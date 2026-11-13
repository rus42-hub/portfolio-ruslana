"""Bake the look of a Blender scene into one texture and export a compressed GLB.
Works on the in-memory copy only: the .blend file is never saved.

Usage: blender -b file.blend --python bake_scene.py -- <config json>
Config: out, name, size, samples, hdr, keep (object names left unbaked), skip (names dropped),
        backdrop (bool), frame.
"""
import bpy, json, math, os, sys, time

cfg = json.loads(sys.argv[sys.argv.index('--') + 1])
out, name = cfg['out'], cfg['name']
size, samples = cfg.get('size', 2048), cfg.get('samples', 32)
keep, skip = set(cfg.get('keep', [])), set(cfg.get('skip', []))
scene = bpy.context.scene
start = time.time()
def log(*a): print('@@', round(time.time() - start), *a, flush=True)

scene.frame_set(cfg.get('frame', scene.frame_start))
scene.render.engine = 'CYCLES'
scene.cycles.device = 'CPU'
scene.cycles.samples = samples
scene.cycles.use_denoising = False
scene.render.image_settings.media_type = 'IMAGE'

if cfg.get('hdr'):
    image = bpy.data.images.load(cfg['hdr'])
    world = scene.world or bpy.data.worlds.new('World')
    scene.world = world
    world.use_nodes = True
    nodes = world.node_tree.nodes
    env = next((n for n in nodes if n.bl_idname == 'ShaderNodeTexEnvironment'), None) or nodes.new('ShaderNodeTexEnvironment')
    env.image = image
    bg = next(n for n in nodes if n.bl_idname == 'ShaderNodeBackground')
    world.node_tree.links.new(env.outputs['Color'], bg.inputs['Color'])
    bg.inputs['Strength'].default_value = cfg.get('hdr_strength', 1.0)

if cfg.get('world_color'):
    # The scene's own sky image is missing: Blender would light everything bright pink.
    world = scene.world
    world.use_nodes = True
    bg = next(n for n in world.node_tree.nodes if n.bl_idname == 'ShaderNodeBackground')
    for link in list(bg.inputs['Color'].links): world.node_tree.links.remove(link)
    bg.inputs['Color'].default_value = (*cfg['world_color'], 1)
    bg.inputs['Strength'].default_value = cfg.get('world_strength', 1.0)

if cfg.get('world_light') is not None and scene.world and scene.world.use_nodes:
    # A softer world lets the scene's own lamps (windows, lanterns) lead, as in the original render.
    for node in scene.world.node_tree.nodes:
        if node.bl_idname == 'ShaderNodeBackground':
            node.inputs['Strength'].default_value *= cfg['world_light']

for object_name, colour in cfg.get('colour_objects', {}).items():
    # Objects without any material show plain grey: give them the colour of the original render.
    o = bpy.data.objects.get(object_name)
    if o and o.type == 'MESH':
        material = bpy.data.materials.new(object_name + '-colour')
        material.use_nodes = True
        bsdf = next(n for n in material.node_tree.nodes if n.bl_idname == 'ShaderNodeBsdfPrincipled')
        bsdf.inputs['Base Color'].default_value = (*colour, 1)
        bsdf.inputs['Roughness'].default_value = 0.8
        o.data.materials.clear()
        o.data.materials.append(material)

if cfg.get('backdrop'):
    hidden = [o for o in scene.objects if o.type == 'MESH' and not o.hide_render and o.name not in cfg.get('backdrop_keep', [])]
    for o in hidden: o.hide_render = True
    scene.render.resolution_x, scene.render.resolution_y = 1600, 1000
    scene.frame_set(cfg.get('frame', scene.frame_start))
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = 'JPEG'
    scene.render.image_settings.quality = 84
    scene.render.filepath = os.path.join(out, f'{name}-backdrop.jpg')
    bpy.ops.render.render(write_still=True)
    for o in hidden: o.hide_render = False
    log('backdrop done')

if cfg.get('bump_only'):
    # True displacement moves surfaces into neighbouring stones while baking: keep the relief as bump only.
    for m in bpy.data.materials:
        if hasattr(m, 'displacement_method'): m.displacement_method = 'BUMP'

for o in scene.objects:
    if o.name in cfg.get('no_shadow', []):
        # Still baked itself, but no longer blocks light for its neighbours.
        o.visible_shadow = o.visible_diffuse = o.visible_glossy = o.visible_transmission = False

for o in list(scene.objects):
    if o.name in skip: bpy.data.objects.remove(o, do_unlink=True)

missing = cfg.get('missing_color')
if missing:
    # Blender paints a missing image bright pink: use a plain colour instead.
    trees = [m.node_tree for m in bpy.data.materials if m.use_nodes] + list(bpy.data.node_groups)
    for tree in trees:
        for node in tree.nodes:
            if node.bl_idname == 'ShaderNodeTexImage' and (node.image is None or node.image.size[0] == 0):
                log('missing', node.image.name if node.image else None)
                for link in list(node.outputs['Color'].links):
                    socket = link.to_socket
                    tree.links.remove(link)
                    if socket.type == 'RGBA': socket.default_value = (*missing, 1)
sky_mats = set(cfg.get('exclude_mats', []))
sky_names = set(cfg.get('exclude_names', []))
for o in scene.objects:
    o.hide_set(False)
for o in scene.objects:
    if o.mode != 'OBJECT':
        bpy.context.view_layer.objects.active = o
        bpy.ops.object.mode_set(mode='OBJECT')
targets = [o for o in scene.objects if o.type == 'MESH' and not o.hide_render and o.name not in keep
           and o.name not in sky_names and not any(s.material and s.material.name in sky_mats for s in o.material_slots)]

# Shiny or see-through materials (water) cannot be baked: cut those faces out and keep them live.
live = set(cfg.get('live_materials', []))
for o in list(targets):
    slots = [i for i, slot in enumerate(o.material_slots) if slot.material and slot.material.name in live]
    if not slots: continue
    for other in scene.objects: other.select_set(False)
    o.select_set(True)
    bpy.context.view_layer.objects.active = o
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='DESELECT')
    for i in slots:
        o.active_material_index = i
        bpy.ops.object.material_slot_select()
    bpy.ops.mesh.separate(type='SELECTED')
    bpy.ops.object.mode_set(mode='OBJECT')
    for part in [x for x in bpy.context.selected_objects if x is not o]:
        part.name = 'live-' + part.name
        keep.add(part.name)
        log('live part', part.name, len(part.data.polygons))

# Groups get their own texture, so small detailed objects are not squeezed by a large ground.
groups = []
claimed = set()
for group in cfg.get('groups', []):
    members = [o for o in targets if o.name in group['names']]
    claimed.update(o.name for o in members)
    if members: groups.append((members, group.get('size', size)))
rest = [o for o in targets if o.name not in claimed]
if rest: groups.insert(0, (rest, size))

def join(objects, label):
    for o in scene.objects: o.select_set(False)
    for o in objects: o.select_set(True)
    bpy.context.view_layer.objects.active = objects[0]
    bpy.ops.object.make_single_user(object=True, obdata=True)
    bpy.ops.object.convert(target='MESH')
    bpy.ops.object.join()
    merged = bpy.context.view_layer.objects.active
    merged.name = label
    mesh = merged.data
    mesh.uv_layers.active = mesh.uv_layers.new(name='bake')
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.reveal(select=True)
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.uv.smart_project(angle_limit=math.radians(60), island_margin=cfg.get('margin', 0.004))
    bpy.ops.object.mode_set(mode='OBJECT')
    log('joined', label, len(mesh.polygons), 'polys')
    return merged

# Join and unwrap every group first: materials are only swapped after all bakes,
# so each bake still sees the original lighting of the other groups.
merged_groups = [(join(members, f'baked-{index}'), group_size) for index, (members, group_size) in enumerate(groups)]
scene.cycles.bake_type = 'COMBINED'
baked_images = []
for merged, group_size in merged_groups:
    target = bpy.data.images.new(merged.name, group_size, group_size, float_buffer=True)
    for slot in merged.material_slots:
        if slot.material is None:
            slot.material = bpy.data.materials.new('fallback')
        material = slot.material
        material.use_nodes = True
        node = next((n for n in material.node_tree.nodes if n.bl_idname == 'ShaderNodeTexImage' and n.image == target), None) or material.node_tree.nodes.new('ShaderNodeTexImage')
        node.image = target
        material.node_tree.nodes.active = node
    for o in scene.objects: o.select_set(False)
    merged.select_set(True)
    bpy.context.view_layer.objects.active = merged
    bpy.ops.object.bake(type='COMBINED', margin=8, uv_layer='bake', use_clear=True)
    if cfg.get('fill_black'):
        # Some faces bake pure black although they are visible on the site.
        # Fill those texels with the plain material colour under a soft light.
        import numpy as np
        albedo = bpy.data.images.new(merged.name + '-albedo', group_size, group_size, float_buffer=True)
        bake_nodes = [n for slot in merged.material_slots for n in slot.material.node_tree.nodes if n.bl_idname == 'ShaderNodeTexImage' and n.image == target]
        for n in bake_nodes: n.image = albedo
        samples_before = scene.cycles.samples
        scene.cycles.samples = 1
        bpy.ops.object.bake(type='DIFFUSE', pass_filter={'COLOR'}, margin=8, uv_layer='bake', use_clear=True)
        scene.cycles.samples = samples_before
        for n in bake_nodes: n.image = target
        lit = np.empty(group_size * group_size * 4, dtype=np.float32); target.pixels.foreach_get(lit)
        flat = np.empty_like(lit); albedo.pixels.foreach_get(flat)
        lit = lit.reshape(-1, 4); flat = flat.reshape(-1, 4)
        black = (lit[:, :3].max(axis=1) < cfg.get('black_level', 0.003)) & (flat[:, :3].max(axis=1) > 0.01)
        lit[black, :3] = flat[black, :3] * cfg.get('fill_light', 0.3)
        target.pixels.foreach_set(lit.ravel())
        log('filled black texels', int(black.sum()))
    # save_render applies the scene's AgX view transform, so colours match the render.
    path = os.path.join(out, f'{name}-{merged.name}.png')
    scene.render.image_settings.file_format = 'PNG'
    target.save_render(path, scene=scene)
    baked_images.append(bpy.data.images.load(path))
    log('bake done', merged.name, group_size)

for (merged, _), baked in zip(merged_groups, baked_images):
    mesh = merged.data
    mat = bpy.data.materials.new(merged.name)
    mat.use_nodes = True
    tree = mat.node_tree
    principled = next(n for n in tree.nodes if n.bl_idname == 'ShaderNodeBsdfPrincipled')
    tex = tree.nodes.new('ShaderNodeTexImage')
    tex.image = baked
    tree.links.new(tex.outputs['Color'], principled.inputs['Base Color'])
    principled.inputs['Roughness'].default_value = 1
    mesh.materials.clear()
    mesh.materials.append(mat)
    mesh.uv_layers['bake'].active_render = True
    extra = [a.name for a in mesh.attributes if a.domain == 'CORNER' and a.data_type == 'FLOAT2' and a.name != 'bake' and not a.name.startswith('.')]
    for attribute in extra: mesh.attributes.remove(mesh.attributes[attribute])
    for attribute in [a.name for a in mesh.color_attributes]: mesh.color_attributes.remove(mesh.color_attributes[attribute])

for o in scene.objects: o.select_set(False)
for merged, _ in merged_groups: merged.select_set(True)
for o in scene.objects:
    if o.name in keep: o.select_set(True)
glb = os.path.join(out, f'{name}.glb')
bpy.ops.export_scene.gltf(filepath=glb, export_format='GLB', use_selection=True, export_apply=True,
    export_animations=False, export_cameras=False, export_lights=False,
    export_image_format='WEBP', export_image_quality=cfg.get('quality', 80),
    export_draco_mesh_compression_enable=True, export_draco_mesh_compression_level=6)
log('GLB', round(os.path.getsize(glb) / 1e6, 2), 'MB')
cam = scene.camera
log('camera', [round(v, 2) for v in cam.matrix_world.translation], cam.data.lens)

"""Export a scene with its real materials and lamps, so the site lights it live like Eevee.
Only procedural materials that glTF cannot describe are baked, one object at a time.
Never saves the .blend file.

Usage: blender -b file --python export_pbr.py -- <config json>
Config: out, name, max_texture (px), bake_size, samples, albedo, albedo_roughness, glow, force_bake, exclude, live, liquid, hdr,
missing_color, colour_objects."""
import bpy, json, math, os, sys, time

cfg = json.loads(sys.argv[sys.argv.index('--') + 1])
out, name = cfg['out'], cfg['name']
scene = bpy.context.scene
start = time.time()
def log(*a): print('@@', round(time.time() - start), *a, flush=True)

for o in scene.objects:
    if o.mode != 'OBJECT':
        bpy.context.view_layer.objects.active = o
        bpy.ops.object.mode_set(mode='OBJECT')

def is_simple(material):
    """glTF understands a Principled BSDF plugged straight into the material output."""
    if not material or not material.use_nodes: return False
    output = next((n for n in material.node_tree.nodes if n.bl_idname == 'ShaderNodeOutputMaterial' and n.is_active_output), None)
    links = output.inputs['Surface'].links if output else []
    return bool(links) and links[0].from_node.bl_idname == 'ShaderNodeBsdfPrincipled'

# exclude: objects left out (sky shells, far props). live: objects the site draws itself (glass, water),
# exported as they are without baking. missing_color: plain colour for images left on another computer.
exclude = set(cfg.get('exclude', []))
live = set(cfg.get('live', []))
missing = cfg.get('missing_color')
if missing:
    for material in bpy.data.materials:
        if not material.use_nodes: continue
        tree = material.node_tree
        for node in tree.nodes:
            if node.bl_idname == 'ShaderNodeTexImage' and (node.image is None or node.image.size[0] == 0):
                for link in list(node.outputs['Color'].links):
                    socket = link.to_socket
                    tree.links.remove(link)
                    if socket.type == 'RGBA': socket.default_value = (*missing, 1)
for object_name, colour in cfg.get('colour_objects', {}).items():
    o = bpy.data.objects.get(object_name)
    if o and o.type == 'MESH':
        material = bpy.data.materials.new(object_name + '-colour')
        material.use_nodes = True
        bsdf = next(n for n in material.node_tree.nodes if n.bl_idname == 'ShaderNodeBsdfPrincipled')
        bsdf.inputs['Base Color'].default_value = (*colour, 1)
        bsdf.inputs['Roughness'].default_value = 0.85
        o.data.materials.clear()
        o.data.materials.append(material)
if cfg.get('hdr'):
    # World image chosen outside Blender (her downloads): used for the bakes below too.
    image = bpy.data.images.load(cfg['hdr'])
    nodes = scene.world.node_tree.nodes
    env = next((n for n in nodes if n.bl_idname == 'ShaderNodeTexEnvironment'), None) or nodes.new('ShaderNodeTexEnvironment')
    env.image = image
    background = next(n for n in nodes if n.bl_idname == 'ShaderNodeBackground')
    scene.world.node_tree.links.new(env.outputs['Color'], background.inputs['Color'])
meshes = [o for o in scene.objects if o.type == 'MESH' and not o.hide_render and o.name not in exclude]
# force_bake: objects whose image mapping glTF gets wrong (a second UV map, box projection), baked like procedurals.
force = set(cfg.get('force_bake', []))
complex_objects = [o for o in meshes if o.name not in live and (o.name in force or any(not is_simple(s.material) for s in o.material_slots))]
# albedo: bake only the colour, so the site lights it live (no baked shine or shadows). glow: objects that light
# themselves (the sphere, crystals) keep the full baked look and stay self-lit on the site.
albedo = cfg.get('albedo', False)
glow = set(cfg.get('glow', []))
log('meshes', len(meshes), 'to bake', [o.name for o in complex_objects])

# Procedural materials: bake what Blender shows into a texture, then use it as a glowing base colour.
scene.render.engine = 'CYCLES'
scene.cycles.device = 'CPU'
scene.cycles.samples = cfg.get('samples', 32)
scene.cycles.use_denoising = False
scene.render.image_settings.media_type = 'IMAGE'
for o in complex_objects:
    for other in scene.objects: other.select_set(False)
    o.select_set(True)
    bpy.context.view_layer.objects.active = o
    mesh = o.data
    # A forced object gets its own clean unwrap: its old UV map is what glTF stretched.
    if o.name in force and mesh.uv_layers:
        fresh = mesh.uv_layers.new(name='bake')
        mesh.uv_layers.active = fresh
        fresh.active_render = False
        bpy.ops.object.mode_set(mode='EDIT')
        bpy.ops.mesh.select_all(action='SELECT')
        bpy.ops.uv.smart_project(angle_limit=math.radians(60), island_margin=0.02)
        bpy.ops.object.mode_set(mode='OBJECT')
    if not mesh.uv_layers:
        mesh.uv_layers.new(name='bake')
        bpy.ops.object.mode_set(mode='EDIT')
        bpy.ops.mesh.select_all(action='SELECT')
        bpy.ops.uv.smart_project(angle_limit=math.radians(60), island_margin=0.01)
        bpy.ops.object.mode_set(mode='OBJECT')
    size = cfg.get('bake_size', 1024)
    image = bpy.data.images.new(o.name + '-baked', size, size, float_buffer=True)
    for slot in o.material_slots:
        if slot.material is None: slot.material = bpy.data.materials.new('fallback')
        slot.material.use_nodes = True
        node = slot.material.node_tree.nodes.new('ShaderNodeTexImage')
        node.image = image
        slot.material.node_tree.nodes.active = node
    # Liquids: bake only their own glow; the site draws the see-through part live.
    liquid = o.name in cfg.get('liquid', [])
    colour_only = albedo and not liquid and o.name not in glow
    if colour_only:
        bpy.ops.object.bake(type='DIFFUSE', pass_filter={'COLOR'}, margin=8, use_clear=True)
    else:
        bpy.ops.object.bake(type='EMIT' if liquid else 'COMBINED', margin=8, use_clear=True)
    path = os.path.join(out, f'{name}-{o.name}.png')
    if colour_only:
        # Plain colour: saved without the scene's view transform (AgX/Filmic would wash it out).
        image.filepath_raw = path
        image.file_format = 'PNG'
        image.save()
    else:
        scene.render.image_settings.file_format = 'PNG'
        image.save_render(path, scene=scene)
    baked = bpy.data.images.load(path)
    material = bpy.data.materials.new(o.name + ('-liquid' if liquid else '-colour' if colour_only else '-baked'))
    material.use_nodes = True
    tree = material.node_tree
    bsdf = next(n for n in tree.nodes if n.bl_idname == 'ShaderNodeBsdfPrincipled')
    texture = tree.nodes.new('ShaderNodeTexImage')
    texture.image = baked
    if o.name in force:
        uv = tree.nodes.new('ShaderNodeUVMap')
        uv.uv_map = 'bake'
        tree.links.new(uv.outputs['UV'], texture.inputs['Vector'])
    if colour_only:
        tree.links.new(texture.outputs['Color'], bsdf.inputs['Base Color'])
        bsdf.inputs['Roughness'].default_value = cfg.get('albedo_roughness', 0.85)
        bsdf.inputs['Specular IOR Level'].default_value = 0.3
    else:
        bsdf.inputs['Base Color'].default_value = (0, 0, 0, 1)
        tree.links.new(texture.outputs['Color'], bsdf.inputs['Emission Color'])
        bsdf.inputs['Emission Strength'].default_value = 1.0
    mesh.materials.clear()
    mesh.materials.append(material)
    log('baked', o.name)

# Smaller textures for the web, resized in memory only.
limit = cfg.get('max_texture', 2048)
for image in bpy.data.images:
    w, h = image.size
    if image.source == 'FILE' and max(w, h) > limit:
        ratio = limit / max(w, h)
        image.scale(int(w * ratio), int(h * ratio))

# The light map of the site is rendered separately by pano.py, so it matches the 360 background exactly.

for o in scene.objects: o.select_set(False)
for o in meshes: o.select_set(True)
# Lamps travel too: the site lights the scene with them (windows, lanterns, the sun).
for o in scene.objects:
    if o.type == 'LIGHT' and not o.hide_render: o.select_set(True)
glb = os.path.join(out, f'{name}.glb')
bpy.ops.export_scene.gltf(filepath=glb, export_format='GLB', use_selection=True, export_apply=True,
    export_animations=False, export_cameras=False, export_lights=True,
    export_image_format='WEBP', export_image_quality=cfg.get('quality', 85),
    export_draco_mesh_compression_enable=True, export_draco_mesh_compression_level=6)
log('GLB', round(os.path.getsize(glb) / 1e6, 2), 'MB')

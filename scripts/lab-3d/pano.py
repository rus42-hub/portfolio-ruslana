"""Render the outer world of a scene as a 360 equirectangular image.
Usage: blender -b file --python pano.py -- <config json>
Config: out, hdr (optional), keep (mesh names left visible), height (camera z), width."""
import bpy, json, math, os, sys

cfg = json.loads(sys.argv[sys.argv.index('--') + 1])
scene = bpy.context.scene
scene.render.engine = 'CYCLES'
scene.cycles.device = 'CPU'
scene.cycles.samples = cfg.get('samples', 16)
scene.cycles.use_denoising = False
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
keep = set(cfg.get('keep', []))
for o in scene.objects:
    if o.type == 'MESH' and o.name not in keep:
        o.hide_render = True
data = bpy.data.cameras.new('pano')
data.type = 'PANO'
data.panorama_type = 'EQUIRECTANGULAR'
pano = bpy.data.objects.new('pano', data)
scene.collection.objects.link(pano)
pano.location = (0, 0, cfg.get('height', 0))
pano.rotation_euler = (math.pi / 2, 0, 0)
scene.camera = pano
width = cfg.get('width', 2048)
scene.render.resolution_x, scene.render.resolution_y = width, width // 2
scene.render.resolution_percentage = 100
scene.render.image_settings.media_type = 'IMAGE'
scene.render.image_settings.file_format = cfg.get('format', 'JPEG')
if scene.render.image_settings.file_format == 'JPEG': scene.render.image_settings.quality = cfg.get('quality', 82)
scene.render.filepath = cfg['out']
bpy.ops.render.render(write_still=True)
print('@@ pano', os.path.getsize(cfg['out']))

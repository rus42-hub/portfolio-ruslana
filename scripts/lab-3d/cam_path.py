"""Export the animated camera of a scene to JSON in glTF axes. Never saves the .blend.
Usage: blender -b file --python cam_path.py -- <out.json>"""
import bpy, json, math, sys

out = sys.argv[sys.argv.index('--') + 1]
scene = bpy.context.scene
cam = scene.camera
start, end = scene.frame_start, scene.frame_end
step = max(1, (end - start) // 60)
frames = []
for frame in range(start, end + 1, step):
    scene.frame_set(frame)
    bpy.context.view_layer.update()
    loc, rot, _ = cam.matrix_world.decompose()
    # Blender Z-up to glTF Y-up. Both cameras look along local -Z.
    frames.append({'p': [round(loc.x, 3), round(loc.z, 3), round(-loc.y, 3)],
                   'q': [round(rot.x, 4), round(rot.z, 4), round(-rot.y, 4), round(rot.w, 4)]})
sensor = cam.data.sensor_width
horizontal = 2 * math.atan(sensor / 2 / cam.data.lens)
vertical = 2 * math.atan(math.tan(horizontal / 2) * scene.render.resolution_y / scene.render.resolution_x)
json.dump({'fov': round(math.degrees(vertical), 2), 'frames': frames}, open(out, 'w'))
dist = [round(math.dist(f['p'], [0, 0, 0]), 1) for f in frames]
print('@@', out.split('/')[-1], 'frames', len(frames), 'fov', round(math.degrees(vertical), 1), 'first', frames[0]['p'], 'mid', frames[len(frames) // 2]['p'], 'last', frames[-1]['p'], 'dist', min(dist), max(dist))

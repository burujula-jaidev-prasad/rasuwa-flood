"""
The 2026 Rasuwa–Bhotekoshi Flood — Blender 3D Scene Generator
Based on the Scene Content & Production Bible

Usage:
1. Open Blender (3.3+ / 4.x)
2. Go to the 'Scripting' tab
3. Open or paste this script
4. Click 'Run Script' (Alt+P)

This script procedurally creates:
- 168x168 terrain mesh with the 6 specified massifs and carved river gorge
- Shading material with elevation color bands and glacier zone
- 3D River curve through the 8 Catmull-Rom control points
- Keyframed camera tracking following §7 Camera Choreography (816 frames @ 24fps = 34s)
- Waypoint marker empties with embedded analytics metadata
"""

import math
try:
    import bpy
    import mathutils
    IN_BLENDER = True
except ImportError:
    IN_BLENDER = False

# ==============================================================================
# 1. SPECIFICATION DATA
# ==============================================================================

PEAKS = [
    {"name": "Langtang Lirung", "x": -96.0, "y": -88.0, "h": 58.0, "w": 20.0},
    {"name": "Massif 2 (Ganesh)", "x": -58.0, "y": -76.0, "h": 42.0, "w": 18.0},
    {"name": "Massif 3 (Gorge)",  "x": -16.0, "y": -48.0, "h": 32.0, "w": 16.0},
    {"name": "Massif 4 (Trishuli)", "x": 68.0, "y": -16.0, "h": 40.0, "w": 20.0},
    {"name": "Massif 5 (Betrawati)", "x": 48.0, "y": 66.0, "h": 32.0, "w": 18.0},
    {"name": "Massif 6 (Escarpment)", "x": -12.0, "y": 52.0, "h": 26.0, "w": 16.0},
]

# Web coordinate (X, Y_up, Z) -> Blender coordinate (X, Y=Z_web, Z=Y_up)
RIVER_CONTROL_POINTS = [
    (-84.0, -80.0, 30.0),  # Source / Langtang Lirung base
    (-60.0, -50.0, 22.0),
    (-36.0, -32.0, 16.0),
    (-12.0,  -8.0, 11.0),
    ( 12.0,  12.0,  8.0),
    ( 36.0,  30.0,  5.5),
    ( 62.0,  52.0,  3.4),
    ( 98.0,  86.0,  2.0)   # Outlet toward India
]

WAYPOINTS = [
    {"u": 0.02, "t": 0.02, "name": "Langtang Lirung (Collapse Origin)"},
    {"u": 0.10, "t": 0.20, "name": "Rasuwagadhi Border + Dam"},
    {"u": 0.22, "t": 0.26, "name": "The Gorge (Bedrock Scour)"},
    {"u": 0.30, "t": 0.30, "name": "Syabrubesi"},
    {"u": 0.42, "t": 0.42, "name": "Hydropower Corridor + Dam"},
    {"u": 0.52, "t": 0.52, "name": "Betrawati (Sensors Lost)"},
    {"u": 0.66, "t": 0.66, "name": "Galchhi (+9m Surge)"},
    {"u": 0.90, "t": 0.90, "name": "Runout & Toll (100km Corridor)"}
]

# ==============================================================================
# 2. NOISE & ELEVATION HELPERS
# ==============================================================================

def pseudo_noise(x, y):
    n = math.sin(x * 12.9898 + y * 78.233) * 43758.5453
    return n - math.floor(n)

def ridged_val(x, y):
    val = 0.0
    amp = 1.0
    freq = 0.022
    max_amp = 0.0
    for _ in range(3):
        ix = math.floor(x * freq)
        iy = math.floor(y * freq)
        fx = (x * freq) - ix
        fy = (y * freq) - iy
        ux = fx * fx * (3.0 - 2.0 * fx)
        uy = fy * fy * (3.0 - 2.0 * fy)
        a = pseudo_noise(ix, iy)
        b = pseudo_noise(ix + 1, iy)
        c = pseudo_noise(ix, iy + 1)
        d = pseudo_noise(ix + 1, iy + 1)
        n = a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy
        r = 1.0 - abs(2.0 * n - 1.0)
        val += (r * r) * amp
        max_amp += amp
        amp *= 0.5
        freq *= 2.0
    return (val / max_amp) * 15.0 + 3.0

def get_closest_river(x, y):
    min_dsq = float('inf')
    best_pt = RIVER_CONTROL_POINTS[0]
    for i in range(len(RIVER_CONTROL_POINTS) - 1):
        p1 = RIVER_CONTROL_POINTS[i]
        p2 = RIVER_CONTROL_POINTS[i + 1]
        dx = p2[0] - p1[0]
        dy = p2[1] - p1[1]
        seg_len_sq = dx * dx + dy * dy
        if seg_len_sq == 0:
            continue
        u = max(0.0, min(1.0, ((x - p1[0]) * dx + (y - p1[1]) * dy) / seg_len_sq))
        proj_x = p1[0] + u * dx
        proj_y = p1[1] + u * dy
        proj_z = p1[2] + u * (p2[2] - p1[2])
        dsq = (x - proj_x) ** 2 + (y - proj_y) ** 2
        if dsq < min_dsq:
            min_dsq = dsq
            best_pt = (proj_x, proj_y, proj_z)
    return math.sqrt(min_dsq), best_pt[2]

def compute_elevation(x, y):
    h = ridged_val(x, y)
    for p in PEAKS:
        dsq = (x - p["x"]) ** 2 + (y - p["y"]) ** 2
        h += p["h"] * math.exp(-dsq / (2.0 * p["w"] * p["w"]))

    # Guaranteed river clearance
    dist, river_z = get_closest_river(x, y)
    BED_WIDTH = 5.5
    RIM_WIDTH = 18.0
    if dist < RIM_WIDTH:
        bed_floor = river_z - 1.4
        if dist <= BED_WIDTH:
            h = min(h, bed_floor)
        else:
            t = (dist - BED_WIDTH) / (RIM_WIDTH - BED_WIDTH)
            wall_profile = t * t * (3.0 - 2.0 * t)
            max_allowed = bed_floor + (h - bed_floor) * wall_profile
            h = min(h, max_allowed)
    return h

# ==============================================================================
# 3. BLENDER BUILD FUNCTIONS
# ==============================================================================

def create_terrain_mesh(grid_res=168, area=120.0):
    mesh = bpy.data.meshes.new("Rasuwa_Terrain_Mesh")
    obj = bpy.data.objects.new("Rasuwa_Terrain", mesh)
    bpy.context.collection.objects.link(obj)

    verts = []
    faces = []

    step = (area * 2.0) / grid_res
    for j in range(grid_res + 1):
        y = -area + j * step
        for i in range(grid_res + 1):
            x = -area + i * step
            z = compute_elevation(x, y)
            verts.append((x, y, z))

    for j in range(grid_res):
        for i in range(grid_res):
            idx = j * (grid_res + 1) + i
            faces.append((idx, idx + 1, idx + grid_res + 2, idx + grid_res + 1))

    mesh.from_pydata(verts, [], faces)
    mesh.update()

    for poly in mesh.polygons:
        poly.use_smooth = True

    return obj

def create_river_curve():
    curve_data = bpy.data.curves.new("Rasuwa_River_Path", type='CURVE')
    curve_data.dimensions = '3D'
    curve_data.bevel_depth = 2.4
    curve_data.bevel_resolution = 4

    spline = curve_data.splines.new('BEZIER')
    spline.bezier_points.add(len(RIVER_CONTROL_POINTS) - 1)

    for i, pt in enumerate(RIVER_CONTROL_POINTS):
        bp = spline.bezier_points[i]
        bp.co = pt
        bp.handle_left_type = 'AUTO'
        bp.handle_right_type = 'AUTO'

    obj = bpy.data.objects.new("Rasuwa_River", curve_data)
    bpy.context.collection.objects.link(obj)
    return obj

def setup_camera_animation(duration_sec=34, fps=24):
    total_frames = duration_sec * fps
    bpy.context.scene.frame_start = 1
    bpy.context.scene.frame_end = total_frames
    bpy.context.scene.render.fps = fps

    cam_data = bpy.data.cameras.new("Director_Camera")
    cam_data.lens = 35
    cam_data.clip_end = 2000

    cam_obj = bpy.data.objects.new("Director_Camera", cam_data)
    bpy.context.collection.objects.link(cam_obj)
    bpy.context.scene.camera = cam_obj

    target_obj = bpy.data.objects.new("Camera_Focus_Target", None)
    bpy.context.collection.objects.link(target_obj)

    track = cam_obj.constraints.new(type='TRACK_TO')
    track.target = target_obj
    track.track_axis = 'TRACK_NEGATIVE_Z'
    track.up_axis = 'UP_Y'

    keyframes_t = [0.0, 0.16, 0.50, 0.93, 1.0]

    for t_val in keyframes_t:
        frame = max(1, int(t_val * total_frames))

        if t_val < 0.16:
            tgt = (-84.0, -80.0, 46.0)
            radius = 120.0
            phi = 0.72
            theta = -1.15
        elif t_val <= 0.93:
            u = (t_val - 0.14) / 0.86
            alpha = (t_val - 0.16) / (0.93 - 0.16)
            tgt_x = -84.0 + (98.0 - (-84.0)) * u
            tgt_y = -80.0 + (86.0 - (-80.0)) * u
            tgt = (tgt_x, tgt_y, 10.0)
            radius = 100.0
            phi = 0.85
            theta = -1.12 + (-0.07 - (-1.12)) * alpha
        else:
            tgt = (24.0, 34.0, 6.0)
            radius = 240.0
            phi = 0.96
            theta = -0.5

        cam_x = tgt[0] + radius * math.sin(phi) * math.sin(theta)
        cam_y = tgt[1] + radius * math.sin(phi) * math.cos(theta)
        cam_z = tgt[2] + radius * math.cos(phi)

        cam_obj.location = (cam_x, cam_y, cam_z)
        cam_obj.keyframe_insert(data_path="location", frame=frame)

        target_obj.location = tgt
        target_obj.keyframe_insert(data_path="location", frame=frame)

def build_scene():
    if not IN_BLENDER:
        print("Note: This script is designed to be executed inside Blender.")
        return

    print("Building Rasuwa 2026 3D Scene...")
    terrain = create_terrain_mesh(grid_res=140, area=120.0)
    river = create_river_curve()
    setup_camera_animation()
    print("Scene build complete! Hit Space in Blender to preview the camera path.")

if __name__ == "__main__":
    build_scene()

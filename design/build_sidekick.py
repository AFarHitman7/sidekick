"""
SIDEKICK — hardware concept render
Blender 5.x / Cycles.  All dimensions in millimetres, built at 1:1 (metres).

Design language: Teenage Engineering-like instrument, not a glass slab.
Tactile perimeter controls, exposed fasteners, a knurled scroll wheel,
physical FOCUS slider, chunky chin keys, bone polycarbonate + charcoal bezel.

Run:
  blender -b --python build_sidekick.py -- --preview
  blender -b --python build_sidekick.py -- --shot hero
  blender -b --python build_sidekick.py -- --all
"""

import bpy
import bmesh
import math
import os
import sys
from mathutils import Vector, Matrix

MM = 0.001
ROOT = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(ROOT, "renders")
os.makedirs(OUT, exist_ok=True)

# ---------------------------------------------------------------- dimensions
W = 63.0           # body width
H = 101.0          # body height
D = 9.0            # body depth
CORNER = 6.5       # body corner radius
EDGE = 1.45        # body edge bevel

SCREEN_W = 49.2    # active panel, 4.0" 16:9 portrait
SCREEN_H = 87.5
SCREEN_Z = 2.0     # screen centre offset upward -> chin

FRAME_W = 59.5
FRAME_H = 98.5
FRAME_R = 6.2
FRAME_D = 1.2
AP_W = 49.0
AP_H = 87.0
AP_R = 3.8

FRONT_Y = D / 2.0          # 4.5
FRAME_Y = FRONT_Y + FRAME_D  # 5.7
GLASS_Y = FRONT_Y + 0.40   # screen face
CHIN_Z = -45.0
SIDE_X = W / 2.0           # 31.5


# ---------------------------------------------------------------- utilities
def lin(c):
    c = c / 255.0
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def rgb(h):
    h = h.lstrip("#")
    return (lin(int(h[0:2], 16)), lin(int(h[2:4], 16)), lin(int(h[4:6], 16)), 1.0)


def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    sc.unit_settings.system = "METRIC"
    sc.unit_settings.scale_length = 1.0
    sc.render.fps = 24


def deselect():
    for o in bpy.context.selected_objects:
        o.select_set(False)


def activate(o):
    deselect()
    o.select_set(True)
    bpy.context.view_layer.objects.active = o


def material(name, color, rough=0.5, metal=0.0, coat=0.0, coat_rough=0.06,
             emission=None, emit_strength=0.0, aniso=0.0, noise=None,
             bump=0.0, noise_scale=400.0, spec=0.5, sheen=0.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    b = nt.nodes.get("Principled BSDF")
    b.inputs["Base Color"].default_value = color
    b.inputs["Roughness"].default_value = rough
    b.inputs["Metallic"].default_value = metal
    b.inputs["Specular IOR Level"].default_value = spec
    b.inputs["Coat Weight"].default_value = coat
    b.inputs["Coat Roughness"].default_value = coat_rough
    b.inputs["Anisotropic"].default_value = aniso
    if sheen:
        b.inputs["Sheen Weight"].default_value = sheen
    if emission is not None:
        b.inputs["Emission Color"].default_value = emission
        b.inputs["Emission Strength"].default_value = emit_strength
    if bump > 0:
        tex = nt.nodes.new("ShaderNodeTexNoise")
        tex.inputs["Scale"].default_value = noise_scale
        tex.inputs["Detail"].default_value = 3.0
        tex.inputs["Roughness"].default_value = 0.5
        coord = nt.nodes.new("ShaderNodeTexCoord")
        nt.links.new(coord.outputs["Object"], tex.inputs["Vector"])
        bmp = nt.nodes.new("ShaderNodeBump")
        bmp.inputs["Strength"].default_value = bump
        bmp.inputs["Distance"].default_value = 0.0004
        nt.links.new(tex.outputs["Fac"], bmp.inputs["Height"])
        nt.links.new(bmp.outputs["Normal"], b.inputs["Normal"])
    return m


def assign(o, m):
    o.data.materials.clear()
    o.data.materials.append(m)


def shade(o, angle=32):
    activate(o)
    try:
        bpy.ops.object.shade_smooth_by_angle(angle=math.radians(angle))
    except Exception:
        for p in o.data.polygons:
            p.use_smooth = True


def apply_mods(o):
    activate(o)
    for m in list(o.modifiers):
        try:
            bpy.ops.object.modifier_apply(modifier=m.name)
        except Exception as e:
            print("modifier apply failed", o.name, m.name, e)


def bevel(o, width, segments=3, angle=32):
    if width <= 0:
        return
    m = o.modifiers.new("bev", "BEVEL")
    m.width = width
    m.segments = segments
    m.limit_method = "ANGLE"
    m.angle_limit = math.radians(angle)
    m.use_clamp_overlap = True
    m.harden_normals = False
    apply_mods(o)
    shade(o, 34)


def rrect_pts(w, h, r, seg=12, cx=0.0, cz=0.0):
    pts = []
    r = max(r, 0.0001)
    for ox, oz, a0 in ((w / 2 - r, h / 2 - r, 0.0),
                       (-(w / 2 - r), h / 2 - r, 90.0),
                       (-(w / 2 - r), -(h / 2 - r), 180.0),
                       (w / 2 - r, -(h / 2 - r), 270.0)):
        for i in range(seg):
            a = math.radians(a0 + 90.0 * i / seg)
            pts.append((cx + ox + r * math.cos(a), cz + oz + r * math.sin(a)))
    return pts


def slab(name, w, h, d, r, mat, loc, bevel_w=0.0, seg=12, bev_seg=3):
    """Rounded rectangle in XZ, extruded along Y (front = +Y)."""
    me = bpy.data.meshes.new(name)
    bm = bmesh.new()
    pts = rrect_pts(w, h, r, seg)
    f = [bm.verts.new((x * MM, d / 2 * MM, z * MM)) for x, z in pts]
    b = [bm.verts.new((x * MM, -d / 2 * MM, z * MM)) for x, z in pts]
    n = len(pts)
    bm.faces.new(f)
    bm.faces.new(list(reversed(b)))
    for i in range(n):
        bm.faces.new((f[i], f[(i + 1) % n], b[(i + 1) % n], b[i]))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(me)
    bm.free()
    o = bpy.data.objects.new(name, me)
    bpy.context.collection.objects.link(o)
    o.location = (loc[0] * MM, loc[1] * MM, loc[2] * MM)
    assign(o, mat)
    shade(o, 20)
    if bevel_w > 0:
        m = o.modifiers.new("bev", "BEVEL")
        m.width = bevel_w * MM
        m.segments = bev_seg
        m.limit_method = "ANGLE"
        m.angle_limit = math.radians(32)
        m.use_clamp_overlap = True
        apply_mods(o)
        shade(o, 34)
    return o


def box(name, sx, sy, sz, loc, mat, bevel_w=0.0, seg=3, rot=(0, 0, 0)):
    bpy.ops.mesh.primitive_cube_add(size=1)
    o = bpy.context.object
    o.name = name
    o.scale = (sx * MM, sy * MM, sz * MM)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    o.location = (loc[0] * MM, loc[1] * MM, loc[2] * MM)
    o.rotation_euler = rot
    assign(o, mat)
    if bevel_w > 0:
        bevel(o, bevel_w * MM, seg)
    return o


def cyl(name, r, depth, loc, mat, axis="Z", verts=64, bev=0.0, rot_extra=0.0):
    bpy.ops.mesh.primitive_cylinder_add(vertices=verts, radius=r * MM, depth=depth * MM)
    o = bpy.context.object
    o.name = name
    o.location = (loc[0] * MM, loc[1] * MM, loc[2] * MM)
    if axis == "X":
        o.rotation_euler = (0, math.radians(90), rot_extra)
    elif axis == "Y":
        o.rotation_euler = (math.radians(90), 0, rot_extra)
    bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)
    assign(o, mat)
    if bev > 0:
        bevel(o, bev * MM, 3)
    else:
        shade(o, 34)
    return o


def torus(name, major, minor, loc, mat, axis="Y", seg_major=64, seg_minor=16):
    bpy.ops.mesh.primitive_torus_add(major_radius=major * MM, minor_radius=minor * MM,
                                     major_segments=seg_major, minor_segments=seg_minor)
    o = bpy.context.object
    o.name = name
    o.location = (loc[0] * MM, loc[1] * MM, loc[2] * MM)
    if axis == "Y":
        o.rotation_euler = (math.radians(90), 0, 0)
    elif axis == "X":
        o.rotation_euler = (0, math.radians(90), 0)
    bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)
    assign(o, mat)
    shade(o, 40)
    return o


FONTS = {}


def font(name):
    if name in FONTS:
        return FONTS[name]
    path = {
        "mono": r"C:\Windows\Fonts\consola.ttf",
        "monob": r"C:\Windows\Fonts\consolab.ttf",
        "sans": r"C:\Windows\Fonts\bahnschrift.ttf",
    }.get(name, r"C:\Windows\Fonts\consola.ttf")
    f = None
    try:
        f = bpy.data.fonts.load(path, check_existing=True)
    except Exception as e:
        print("font fail", path, e)
    FONTS[name] = f
    return f


def text(name, body, size, loc, mat, f="mono", align_x="CENTER", align_y="CENTER",
         face=(0, 1, 0), up=(0, 0, 1), spacing=1.0, extrude=0.0):
    cu = bpy.data.curves.new(name, "FONT")
    cu.body = body
    ft = font(f)
    if ft:
        cu.font = ft
    cu.size = size * MM
    cu.align_x = align_x
    cu.align_y = align_y
    cu.space_character = spacing
    cu.extrude = extrude * MM
    cu.resolution_u = 6
    o = bpy.data.objects.new(name, cu)
    bpy.context.collection.objects.link(o)
    o.location = (loc[0] * MM, loc[1] * MM, loc[2] * MM)
    assign(o, mat)
    n = Vector(face).normalized()
    u = Vector(up).normalized()
    r = u.cross(n).normalized()
    u2 = n.cross(r).normalized()
    m = Matrix(((r.x, u2.x, n.x), (r.y, u2.y, n.y), (r.z, u2.z, n.z)))
    o.rotation_mode = "QUATERNION"
    o.rotation_quaternion = m.to_quaternion()
    return o


def screw(name, loc, mat_head, mat_socket, axis="Y", r=1.15, out=1):
    head = cyl(name + "_head", r, 0.55, loc, mat_head, axis=axis, verts=32, bev=0.18)
    off = 0.26 * out
    if axis == "Y":
        p = (loc[0], loc[1] + off, loc[2])
    elif axis == "X":
        p = (loc[0] + off, loc[1], loc[2])
    else:
        p = (loc[0], loc[1], loc[2] + off)
    sock = cyl(name + "_sock", r * 0.42, 0.22, p, mat_socket, axis=axis, verts=6)
    return [head, sock]


def join(objs, name):
    deselect()
    for o in objs:
        o.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]
    bpy.ops.object.join()
    o = bpy.context.object
    o.name = name
    return o



# ---------------------------------------------------------------- palettes
PALETTES = {
    "studio": dict(
        shell="#D6D0C1", frame="#1D1E1B", keys="#EEE9DC", accent="#FF3D02",
        accent_emit="#FF5A1F", chip="#E23A05", chip_emit="#FF4A0A",
        power="#C02F18", back_ink="#5A574E", back_faint="#7C786C",
        seam="#262623", grip="#7A2408",
    ),
    "night": dict(
        shell="#4A4A44", frame="#121311", keys="#E7E2D4", accent="#FF5A1F",
        accent_emit="#FF7A45", chip="#E8491A", chip_emit="#FF5A24",
        power="#C02F18", back_ink="#DCD6C6", back_faint="#A29C8E",
        seam="#0E0F0D", grip="#7A2C10",
    ),
    "field": dict(
        shell="#C6C9C4", frame="#2A2B29", keys="#F0ECE1", accent="#3FB98F",
        accent_emit="#59D6AA", chip="#2E9E7C", chip_emit="#4BC99E",
        power="#C02F18", back_ink="#4C4E49", back_faint="#7B7E77",
        seam="#262623", grip="#1E6B55",
    ),
    "clay": dict(
        shell="#C8B69E", frame="#2B2420", keys="#EFE7D8", accent="#E0472B",
        accent_emit="#FF6A4D", chip="#D63E20", chip_emit="#F25A3A",
        power="#C02F18", back_ink="#5C4A3A", back_faint="#8B7A68",
        seam="#3A2F27", grip="#6E2314",
    ),
}


# ---------------------------------------------------------------- scene build
def build(theme="studio"):
    reset()
    P = PALETTES[theme]

    bone = material("bone_PC", rgb(P["shell"]), rough=0.50, coat=0.05,
                    coat_rough=0.25, bump=0.06, noise_scale=260, spec=0.42)
    frame_m = material("charcoal_bezel", rgb(P["frame"]), rough=0.80, coat=0.0,
                       bump=0.04, noise_scale=900, spec=0.10)
    cream = material("key_cream", rgb(P["keys"]), rough=0.34, coat=0.15, coat_rough=0.15,
                     bump=0.05, noise_scale=500)
    orange = material("TE_orange", rgb(P["accent"]), rough=0.42, coat=0.06, coat_rough=0.16,
                      bump=0.04, noise_scale=500)
    red = material("safety_red", rgb(P["power"]), rough=0.42, coat=0.08,
                   bump=0.04, noise_scale=500)
    alu = material("anodised_alu", rgb("BEBEB8"), rough=0.30, metal=1.0,
                   aniso=0.55, bump=0.04, noise_scale=900)
    steel = material("steel", rgb("9B9B97"), rough=0.24, metal=1.0)
    dark_socket = material("socket", rgb("1B1B19"), rough=0.45, metal=0.4)
    seam = material("seam", rgb(P["seam"]), rough=0.62)
    glass = material("screen_glass", rgb("030508"), rough=0.30, coat=0.12, coat_rough=0.10,
                     spec=0.12, emission=rgb("080C12"), emit_strength=0.12)
    ui = material("ui_cream", rgb("000000"), rough=0.3, emission=rgb("F7F2E4"), emit_strength=3.0)
    ui_dim = material("ui_dim", rgb("000000"), rough=0.4, emission=rgb("A8A79E"), emit_strength=1.05)
    ui_orange = material("ui_orange", rgb("000000"), rough=0.4, emission=rgb(P["accent_emit"]), emit_strength=3.4)
    chip_m = material("ui_chip", rgb(P["chip"]), rough=0.4, emission=rgb(P["chip_emit"]), emit_strength=0.85)
    chip_dark = material("ui_chip_dark", rgb("000000"), rough=0.4, emission=rgb("1A1F24"), emit_strength=0.55)
    screen_dark = material("screen_dead", rgb("030405"), rough=0.62, coat=0.0, spec=0.0,
                           emission=rgb("05080C"), emit_strength=0.08)

    # ---- body
    body = slab("body", W, H, D, CORNER, bone, (0, 0, 0), bevel_w=EDGE, seg=16, bev_seg=4)
    # parting line around the shell
    slab("seam", W + 0.10, H + 0.10, 0.26, CORNER + 0.05, seam, (0, 0, 0), bevel_w=0.0, seg=16)

    # ---- front bezel frame (boolean aperture)
    frame = slab("bezel", FRAME_W, FRAME_H, FRAME_D, FRAME_R, frame_m,
                 (0, FRONT_Y + FRAME_D / 2, 0.0), bevel_w=0.42, seg=20, bev_seg=3)
    cutter = slab("ap_cutter", AP_W, AP_H, FRAME_D + 2.4, AP_R, frame_m,
                  (0, FRONT_Y + FRAME_D / 2, SCREEN_Z), bevel_w=0.32, seg=20, bev_seg=3)
    b = frame.modifiers.new("cut", "BOOLEAN")
    b.object = cutter
    b.operation = "DIFFERENCE"
    b.solver = "EXACT"
    activate(frame)
    bpy.ops.object.modifier_apply(modifier=b.name)
    bpy.data.objects.remove(cutter, do_unlink=True)
    shade(frame, 34)

    # ---- glass + UI plane
    slab("glass", AP_W + 0.7, AP_H + 0.7, 0.5, AP_R + 0.2, glass,
         (0, FRONT_Y + 0.15, SCREEN_Z), bevel_w=0.12, seg=20, bev_seg=2)

    ui_y = FRONT_Y + 0.435
    # screen background slightly inset inside the aperture
    slab("screen_base", AP_W - 0.15, AP_H - 0.15, 0.03, AP_R, screen_dark,
         (0, FRONT_Y + 0.405, SCREEN_Z), bevel_w=0.0, seg=20)

    # ---- UI (coordinates are viewer-oriented; camera at +Y sees world +X on the left)
    sy = ui_y
    # top status
    text("ui_time", "08:12", 2.8, (20.6, sy, 41.2), ui, "mono", "LEFT")
    text("ui_focus", "FOCUS", 1.9, (-20.8, sy, 41.1), ui_orange, "monob", "RIGHT", spacing=1.22)
    # battery glyph: outline, cap, fill
    box("ui_batt_top", 3.5, 0.02, 0.16, (10.2, sy + 0.004, 41.78), ui_dim)
    box("ui_batt_bot", 3.5, 0.02, 0.16, (10.2, sy + 0.004, 40.62), ui_dim)
    box("ui_batt_l", 0.16, 0.02, 1.16, (8.53, sy + 0.004, 41.2), ui_dim)
    box("ui_batt_r", 0.16, 0.02, 1.16, (11.87, sy + 0.004, 41.2), ui_dim)
    box("ui_batt_cap", 0.34, 0.02, 0.52, (8.30, sy + 0.004, 41.2), ui_dim)
    box("ui_batt_fill", 2.05, 0.02, 0.58, (10.03, sy + 0.008, 41.2), ui)
    box("ui_hr1", 41.4, 0.03, 0.10, (0, sy, 38.4), ui_dim)
    # sender
    text("ui_sender", "MAYA CHEN", 3.75, (20.6, sy, 34.9), ui, "monob", "LEFT", spacing=1.02)
    text("ui_meta", "3 MESSAGES  ·  NOW", 1.6, (20.6, sy, 31.5), ui_dim, "mono", "LEFT", spacing=1.03)
    # orange thread rule sits on the incoming side
    box("ui_thread", 0.42, 0.03, 15.4, (22.5, sy, 20.7), ui_orange)
    # messages
    text("ui_m1", "are we still on", 3.25, (19.2, sy, 26.0), ui, "mono", "LEFT")
    text("ui_m2", "for tonight?", 3.25, (19.2, sy, 22.2), ui, "mono", "LEFT")
    text("ui_m3", "yes — 7pm", 2.7, (-19.8, sy, 14.8), ui, "mono", "RIGHT")
    text("ui_m4", "perfect. bring", 3.25, (19.2, sy, 7.4), ui, "mono", "LEFT")
    text("ui_m5", "the thing.", 3.25, (19.2, sy, 3.6), ui, "mono", "LEFT")
    text("ui_sugg", "SUGGESTED REPLIES", 1.52, (20.6, sy, -3.2), ui_dim, "monob", "LEFT", spacing=1.14)

    # primary reply chip
    slab("ui_chip1", 39.4, 6.9, 0.04, 1.6, chip_m, (0, sy + 0.005, -9.3), bevel_w=0.0, seg=10)
    text("ui_chip1_t", "7pm works", 2.85, (18.6, sy + 0.045, -9.3), material(
        "ui_ink", rgb("050200"), rough=0.4), "monob", "LEFT")
    # secondary reply
    slab("ui_chip2", 39.4, 6.4, 0.04, 1.5, chip_dark, (0, sy + 0.005, -17.6), bevel_w=0.0, seg=10)
    text("ui_chip2_t", "running 10 late", 2.5, (18.6, sy + 0.045, -17.6), ui_dim, "mono", "LEFT")

    text("ui_session", "SESSION  0:38", 1.5, (-20.6, sy, -26.4), ui_dim, "mono", "RIGHT", spacing=1.06)
    box("ui_hr2", 41.4, 0.03, 0.08, (0, sy, -30.4), ui_dim)
    text("ui_keys", "WHEEL  SCROLL      ●  SEND      BACK", 1.45,
         (0, sy, -34.8), ui_dim, "mono", "CENTER", spacing=1.06)

    # ---- chin keys
    def keycap(name, w, h, x, z, mat, y0=FRAME_Y, thick=1.55):
        # dark well
        slab(name + "_well", w + 0.7, h + 0.7, 0.10, 1.3, seam,
             (x, y0 + 0.02, z), bevel_w=0.0, seg=10)
        return slab(name, w, h, thick, 1.15, mat, (x, y0 + thick / 2, z),
                    bevel_w=0.46, seg=14, bev_seg=4)

    k1 = keycap("key_back", 13.2, 5.0, 16.2, CHIN_Z, cream)
    k2 = keycap("key_home", 13.2, 5.0, 0.0, CHIN_Z, cream)
    # round send key
    slab("key_send_well", 6.4, 6.4, 0.10, 3.1, seam, (-17.3, FRAME_Y + 0.02, CHIN_Z),
         bevel_w=0.0, seg=16)
    send = cyl("key_send", 2.65, 1.75, (-17.3, FRAME_Y + 0.875, CHIN_Z), orange,
               axis="Y", verts=48, bev=0.34)

    # key legends
    ink = material("key_ink", rgb("3B3A35"), rough=0.55)
    text("leg_back", "BACK", 1.55, (16.2, FRAME_Y + 1.58, CHIN_Z + 0.02), ink,
         "monob", "CENTER", spacing=1.15)
    text("leg_home", "HOME", 1.55, (0.0, FRAME_Y + 1.58, CHIN_Z + 0.02), ink,
         "monob", "CENTER", spacing=1.15)
    # send glyph: chevron drawn as geometry
    tg = 1.12
    vs = [(-tg, CHIN_Z - 0.78), (tg, CHIN_Z - 0.78), (0, CHIN_Z + 0.95)]
    me = bpy.data.meshes.new("send_glyph")
    bm = bmesh.new()
    vv = [bm.verts.new(((-17.3 + x) * MM, (FRAME_Y + 1.88) * MM, z * MM)) for x, z in vs]
    bm.faces.new(vv)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(me)
    bm.free()
    g = bpy.data.objects.new("send_glyph", me)
    bpy.context.collection.objects.link(g)
    assign(g, ink)

    # ---- front bezel screws
    for sx in (-27.1, 27.1):
        for sz in (-35.6, 35.6):
            screw("scr_f%d_%d" % (sx, sz), (sx, FRAME_Y, sz), steel, dark_socket, axis="Y", r=1.05)

    # ---- wordmark + focus label on top band
    text("wordmark", "SIDEKICK", 2.42, (0.0, FRAME_Y + 0.02, 47.0), cream,
         "monob", "CENTER", spacing=1.36)
    box("wm_dot", 0.95, 0.05, 0.95, (10.4, FRAME_Y + 0.03, 47.0), orange, bevel_w=0.22)
    text("focus_label", "FOCUS", 1.35, (20.6, FRAME_Y + 0.02, 47.0), orange,
         "monob", "CENTER", spacing=1.12)

    # ---- right-hand knurled scroll wheel: 8 mm, sits in the 9 mm edge
    wz = -8.0
    wheel_x = 31.3
    # dark recess the wheel sits inside
    cyl("wheel_well", 4.55, 0.35, (SIDE_X + 0.02, 0, wz), seam, axis="X", verts=48, bev=0.10)
    cyl("wheel_body", 4.0, 2.0, (wheel_x, 0, wz), alu, axis="X", verts=48, bev=0.18)
    # 30-tooth knurl around the rim
    teeth = []
    for i in range(30):
        a = 2 * math.pi * i / 30
        yy = math.cos(a) * 4.06
        zz = math.sin(a) * 4.06
        t = box("tooth%d" % i, 1.70, 0.32, 0.46, (wheel_x, yy, wz + zz), alu,
                bevel_w=0.07, seg=2, rot=(a, 0, 0))
        teeth.append(t)
    wteeth = join(teeth, "wheel_knurl")
    # orange index ring + line on the outer face
    box("wheel_index", 0.06, 0.32, 1.60, (wheel_x + 1.01, 0, wz + 2.05), orange, bevel_w=0.02)
    torus("wheel_ring", 3.70, 0.115, (wheel_x + 1.0, 0, wz), orange, axis="X", seg_major=56, seg_minor=8)
    # ---- left edge keys: vol+, vol-, power
    def sidekey(name, z, h, mat, glyph=None):
        box(name + "_well", 0.12, 6.6, h + 1.0, (-SIDE_X - 0.01, 0, z), seam, bevel_w=0.10)
        o = box(name, 1.25, 5.8, h, (-SIDE_X - 0.62, 0, z), mat, bevel_w=0.42, seg=4)
        return o

    sidekey("key_volp", 7.0, 7.6, cream)
    sidekey("key_volm", -3.5, 7.6, cream)
    sidekey("key_power", -13.8, 6.0, red)
    # glyphs on side keys (normal -X)
    gy = -SIDE_X - 1.27
    text("vol_plus", "+", 2.9, (gy, 0, 7.1), ink, "mono", "CENTER", face=(-1, 0, 0))
    text("vol_minus", "−", 2.9, (gy, 0, -3.4), ink, "mono", "CENTER", face=(-1, 0, 0))
    # power glyph
    torus("pwr_ring", 1.15, 0.17, (gy - 0.01, 0, -14.0), ink, axis="X", seg_major=40, seg_minor=8)
    box("pwr_bar", 0.12, 0.34, 1.25, (gy - 0.02, 0, -13.4), ink)

    # ---- top focus slider
    box("focus_track", 15.5, 4.3, 0.30, (10.0, 0, H / 2 + 0.08), seam, bevel_w=0.10)
    slider = box("focus_nub", 5.4, 3.1, 2.0, (13.2, 0, H / 2 + 1.05), orange,
                 bevel_w=0.42, seg=4)
    box("focus_grip", 3.2, 0.35, 0.16, (13.2, 0, H / 2 + 1.9), material(
        "grip_dark", rgb(P["grip"]), rough=0.6), bevel_w=0.05)

    # ---- lanyard loop
    box("loop_boss", 7.4, 6.4, 4.4, (-24.0, 0, H / 2 - 0.2), bone, bevel_w=0.8, seg=4)
    torus("lanyard_loop", 3.1, 1.42, (-24.0, 0, H / 2 + 1.9), bone, axis="Y",
          seg_major=64, seg_minor=18)

    # ---- USB-C port on bottom edge
    box("usb_recess", 8.9, 3.1, 0.30, (0, 0, -H / 2 + 0.10), seam, bevel_w=0.14, seg=3)
    box("usb_tongue", 6.6, 0.55, 0.16, (0, 0, -H / 2 + 0.02), steel, bevel_w=0.06)

    # ---- back graphics
    by = -D / 2 - 0.012
    back_ink = material("back_ink", rgb(P["back_ink"]), rough=0.62)
    back_faint = material("back_faint", rgb(P["back_faint"]), rough=0.66)
    text("bk_word", "SIDEKICK", 6.6, (0, by, 38.6), back_ink, "monob", "CENTER", face=(0, -1, 0), spacing=1.28)
    text("bk_sub", "COMPANION DISPLAY", 1.62, (0, by, 32.6), back_faint, "mono", "CENTER", face=(0, -1, 0), spacing=1.18)
    text("bk_motto1", "DESIGNED TO", 2.55, (0, by, 11.5), back_ink, "monob", "CENTER", face=(0, -1, 0), spacing=1.1)
    text("bk_motto2", "BE PUT DOWN", 2.55, (0, by, 8.2), back_ink, "monob", "CENTER", face=(0, -1, 0), spacing=1.1)
    text("bk_magnet", "MAGNET ARRAY  ×6", 1.18, (0, by, -2.2), back_faint, "mono", "CENTER", face=(0, -1, 0), spacing=1.1)

    # magnet ring
    torus("magnet_ring", 14.0, 0.16, (0, by + 0.02, 8.0), back_faint, axis="Y",
          seg_major=96, seg_minor=6)
    mag = material("magnet", rgb("30302E"), rough=0.34, metal=0.85)
    for i in range(6):
        a = math.radians(90 + 60 * i)
        cyl("magnet%d" % i, 2.15, 0.35, (math.cos(a) * 14.0, -D / 2 + 0.03, 8.0 + math.sin(a) * 14.0),
            mag, axis="Y", verts=40, bev=0.12)

    text("bk_refuse", "NO BROWSER   ·   NO FEED   ·   NO STORE", 1.62,
         (0, by, -15.4), back_ink, "mono", "CENTER", face=(0, -1, 0), spacing=1.06)
    box("bk_rule", 34.0, 0.03, 0.10, (0, by, -19.4), back_faint)
    text("bk_concept", "CONCEPT   ·   NOT FOR PRODUCTION", 1.28,
         (0, by, -23.0), back_faint, "mono", "CENTER", face=(0, -1, 0), spacing=1.12)
    text("bk_serial", "SK-01     101 × 63 × 9.0     85 G", 1.22,
         (0, by, -34.2), back_faint, "mono", "CENTER", face=(0, -1, 0), spacing=1.05)
    for sx in (-26.0, 26.0):
        for sz in (-44.0, 44.0):
            screw("scr_b%d_%d" % (sx, sz), (sx, -D / 2, sz), steel, dark_socket, axis="Y", r=1.05, out=-1)

    # ---- todo: group under product empty
    objs = [o for o in bpy.context.scene.objects if o.type in ("MESH", "FONT")]
    empty = bpy.data.objects.new("PRODUCT", None)
    bpy.context.collection.objects.link(empty)
    empty.location = (0, 0, 0)
    for o in objs:
        o.parent = empty
        o.matrix_parent_inverse = empty.matrix_world.inverted()

    return empty


# ---------------------------------------------------------------- studio
def look_at(o, target):
    d = Vector(target) - o.location
    o.rotation_euler = d.to_track_quat("-Z", "Y").to_euler()


def studio():
    sc = bpy.context.scene

    # cyclorama: floor -> quarter round -> wall
    prof = [(1.10, -0.0508), (0.55, -0.0508), (0.10, -0.0508), (-0.15, -0.0508)]
    rad = 0.45
    cy, cz = -0.15, 0.3992
    for i in range(1, 25):
        a = math.radians(-90 - 90 * i / 24)
        prof.append((cy + rad * math.cos(a), cz + rad * math.sin(a)))
    prof += [(-0.60, 0.95), (-0.60, 1.60)]
    me = bpy.data.meshes.new("cyclorama")
    bm = bmesh.new()
    rows = [[bm.verts.new((-2.2, y, z)) for y, z in prof],
            [bm.verts.new((2.2, y, z)) for y, z in prof]]
    for i in range(len(prof) - 1):
        bm.faces.new((rows[0][i], rows[1][i], rows[1][i + 1], rows[0][i + 1]))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(me)
    bm.free()
    cyc = bpy.data.objects.new("cyclorama", me)
    bpy.context.collection.objects.link(cyc)
    backdrop = material("backdrop", rgb("A9A399"), rough=0.94)
    assign(cyc, backdrop)
    shade(cyc, 60)

    # world
    w = bpy.data.worlds.new("W")
    sc.world = w
    w.use_nodes = True
    bg = w.node_tree.nodes["Background"]
    bg.inputs["Color"].default_value = rgb("3A3B3A")
    bg.inputs["Strength"].default_value = 0.35

    def area(name, loc, target, power, sx, sy, color=(1, 1, 1), shape="RECTANGLE"):
        ld = bpy.data.lights.new(name, "AREA")
        ld.shape = shape
        ld.size = sx
        ld.size_y = sy
        ld.energy = power
        ld.color = color
        o = bpy.data.objects.new(name, ld)
        bpy.context.collection.objects.link(o)
        o.location = loc
        look_at(o, target)
        return o

    area("key", (-0.34, 0.36, 0.36), (0, 0, 0), 15, 0.85, 0.65, (1.0, 0.965, 0.92))
    area("fill", (0.46, 0.30, 0.10), (0, 0, 0), 4.5, 1.1, 0.8, (0.92, 0.96, 1.0))
    area("rim", (0.26, -0.36, 0.34), (0, 0, 0), 18, 0.22, 0.90, (0.90, 0.95, 1.0))
    area("top", (0.02, -0.02, 0.62), (0, 0, 0), 6, 0.55, 0.40, (1.0, 0.98, 0.95))
    area("kick", (-0.50, -0.02, 0.14), (0, 0, 0), 7, 0.28, 0.55, (1.0, 0.92, 0.84))

    # camera
    cam_d = bpy.data.cameras.new("Camera")
    cam = bpy.data.objects.new("Camera", cam_d)
    bpy.context.collection.objects.link(cam)
    sc.camera = cam
    cam_d.lens = 100
    cam_d.sensor_width = 36
    cam.location = (0.215, 0.52, 0.115)
    look_at(cam, (0, 0, 0.004))

    # render settings
    sc.render.engine = "CYCLES"
    sc.cycles.device = "CPU"
    sc.cycles.samples = 96
    sc.cycles.use_adaptive_sampling = True
    sc.cycles.adaptive_threshold = 0.02
    sc.cycles.use_denoising = True
    sc.cycles.denoiser = "OPENIMAGEDENOISE"
    sc.cycles.max_bounces = 8
    sc.cycles.diffuse_bounces = 3
    sc.cycles.glossy_bounces = 4
    sc.cycles.transmission_bounces = 4
    sc.render.film_transparent = False
    sc.render.image_settings.file_format = "PNG"
    sc.render.image_settings.color_mode = "RGB"
    try:
        sc.view_settings.view_transform = "AgX"
        sc.view_settings.look = "AgX - Punchy"
    except Exception as e:
        print("look", e)
    sc.view_settings.exposure = -0.7
    return cam


SHOTS = {
    "hero": dict(res=(2400, 1700), yaw=0, cam=(0.215, 0.52, 0.115), target=(0, 0, 0.004),
                 lens=100, samples=96, dof=False),
    "front": dict(res=(1500, 2000), yaw=0, cam=(0, 0.62, 0.005), target=(0, 0, 0.004),
                  lens=160, samples=112, dof=False),
    "back": dict(res=(2100, 1650), yaw=203, cam=(0.19, 0.5, 0.10), target=(0, 0, 0.004),
                 lens=100, samples=96, dof=False),
    "detail": dict(res=(1800, 1200), yaw=0, cam=(0.18, 0.33, -0.004), target=(-0.002, 0.0, -0.032),
                   lens=78, samples=88, dof=True),
}


def set_shot(shot, product, cam, theme="studio"):
    sc = bpy.context.scene
    s = SHOTS[shot]
    sc.render.resolution_x, sc.render.resolution_y = s["res"]
    sc.render.resolution_percentage = 100
    product.rotation_euler = (0, 0, math.radians(s["yaw"]))
    cam.location = s["cam"]
    cam.data.lens = s["lens"]
    cam.data.sensor_fit = s.get("fit", "AUTO")
    look_at(cam, s["target"])
    sc.cycles.samples = s["samples"]
    if theme != "studio" and shot == "hero":
        sc.render.resolution_x, sc.render.resolution_y = 1800, 1275
        sc.cycles.samples = 80
    cam.data.dof.use_dof = s["dof"]
    if s["dof"]:
        cam.data.dof.focus_distance = (Vector(cam.location) - Vector(s["target"])).length
        cam.data.dof.aperture_fstop = 9.0
    suffix = "" if theme == "studio" else "_" + theme
    sc.render.filepath = os.path.join(OUT, "sidekick_%s%s.png" % (shot, suffix))


def main():
    argv = sys.argv
    args = argv[argv.index("--") + 1:] if "--" in argv else []
    preview = "--preview" in args
    shots = [a.split("=")[1] for a in args if a.startswith("--shot=")]
    theme = next((a.split("=")[1] for a in args if a.startswith("--palette=")), "studio")
    if theme not in PALETTES:
        print("unknown palette", theme, "using studio")
        theme = "studio"

    product = build(theme)
    cam = studio()

    if preview:
        sc = bpy.context.scene
        sc.render.engine = "CYCLES" if "--slow" in args else "BLENDER_EEVEE"
        if "--slow" in args:
            sc.cycles.samples = 48
            sc.cycles.use_denoising = True
        sc.render.resolution_x = 1000
        sc.render.resolution_y = 720
        sc.render.resolution_percentage = 100
        try:
            sc.eevee.taa_render_samples = 32
        except Exception:
            try:
                sc.eevee.taa_samples = 32
            except Exception:
                pass
        sc.render.filepath = os.path.join(OUT, "preview.png")
        sc.render.image_settings.file_format = "PNG"
        bpy.ops.render.render(write_still=True)
    else:
        for s in shots if shots else SHOTS.keys():
            set_shot(s, product, cam, theme)
            print("RENDERING", s)
            bpy.ops.render.render(write_still=True)

    blend = "sidekick.blend" if theme == "studio" else "sidekick_%s.blend" % theme
    bpy.ops.wm.save_as_mainfile(filepath=os.path.join(ROOT, blend))


if __name__ == "__main__":
    main()

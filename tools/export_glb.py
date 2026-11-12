"""Export the Sidekick product to glTF for the web viewer.

Run:
    blender -b design/sidekick.blend --python tools/export_glb.py

The .blend is built by design/build_sidekick.py and contains a studio rig plus
the product meshes parented to the PRODUCT empty. We export only the product.
"""
import os
import sys

import bpy

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "web", "public", "models", "sidekick.glb")

# ------------------------------------------------------------------ inspect
mesh_objs = [o for o in bpy.context.scene.objects if o.type in ("MESH", "FONT")]
print("SCENE OBJECTS:", len(bpy.context.scene.objects))
print("MESH/FONT:", len(mesh_objs))

for o in mesh_objs:
    o.select_set(False)

product = bpy.data.objects.get("PRODUCT")
keep = []
if product:
    for child in product.children_recursive:
        if child.type in ("MESH", "FONT"):
            keep.append(child)
else:
    keep = mesh_objs

print("EXPORTING:", len(keep), "objects")
for o in keep:
    o.select_set(True)

bpy.context.view_layer.objects.active = keep[0]

os.makedirs(os.path.dirname(OUT), exist_ok=True)

bpy.ops.export_scene.gltf(
    filepath=OUT,
    export_format="GLB",
    use_selection=True,
    export_apply=True,
    export_yup=True,
    export_materials="EXPORT",
    export_cameras=False,
    export_lights=False,
    export_extras=False,
    export_texcoords=True,
    export_normals=True,
    export_tangents=False,
)

print("WROTE", OUT, os.path.getsize(OUT), "bytes")

from PIL import Image, ImageCms
import os, io

files = [
    r"C:/Users/kaihuang/Downloads/hkvision.github.io/R_1.JPG",
    r"C:/Users/kaihuang/Downloads/hkvision.github.io/R_3.JPG",
]

srgb_profile = ImageCms.createProfile('sRGB')

for src in files:
    img = Image.open(src)
    icc_bytes = img.info.get('icc_profile', b'')
    print(f"\n{os.path.basename(src)}")
    print(f"  Mode: {img.mode}, Size: {img.size}")
    print(f"  ICC profile: {len(icc_bytes)} bytes")

    if icc_bytes:
        src_profile = ImageCms.ImageCmsProfile(io.BytesIO(icc_bytes))
        print(f"  Source profile: {ImageCms.getProfileDescription(src_profile).strip()}")
        img_srgb = ImageCms.profileToProfile(
            img, src_profile, srgb_profile,
            renderingIntent=ImageCms.Intent.RELATIVE_COLORIMETRIC,
            outputMode='RGB'
        )
    else:
        print("  No ICC profile, treating as sRGB already")
        img_srgb = img.convert('RGB')

    # Save with sRGB profile embedded, quality 95
    srgb_icc = ImageCms.ImageCmsProfile(srgb_profile)
    srgb_icc_bytes = srgb_icc.tobytes()

    dst = src  # overwrite original
    img_srgb.save(dst, 'JPEG', quality=95, subsampling=0, icc_profile=srgb_icc_bytes)
    print(f"  Saved: {os.path.getsize(dst)//1024} KB (quality=95, sRGB embedded)")

print("\nDone.")

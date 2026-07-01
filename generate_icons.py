from PIL import Image
import os

sizes = [72, 96, 128, 144, 152, 192, 384, 512]
src_path = 'src/app/icon.png'
out_dir = 'public/icons'

if not os.path.exists(out_dir):
    os.makedirs(out_dir)

img = Image.open(src_path).convert("RGBA")
w, h = img.size

# create a square canvas
sq_size = max(w, h)
# Add some padding so the logo isn't touching the edge
sq_size = int(sq_size * 1.2)
square_img = Image.new("RGBA", (sq_size, sq_size), (255, 255, 255, 0))

# paste img into center
x = (sq_size - w) // 2
y = (sq_size - h) // 2
square_img.paste(img, (x, y))

for size in sizes:
    resized = square_img.resize((size, size), Image.Resampling.LANCZOS)
    out_path = os.path.join(out_dir, f'icon-{size}x{size}.png')
    resized.save(out_path)
    print(f"Generated {out_path}")


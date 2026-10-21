"""Encode captured website frames as small looping GIF previews (requires Pillow)."""
from pathlib import Path
import sys
from PIL import Image

for number in (sys.argv[1:] or ("01", "02", "03")):
    paths = sorted(Path(f"/tmp/portfolio-capture-{number}").glob("*.png"))
    if len(paths) != 36:
        raise RuntimeError(f"Incomplete capture for {number}: {len(paths)} frames")
    frames = [Image.open(path).convert("RGB").resize((640, 400), Image.Resampling.LANCZOS) for path in paths]
    # A shared palette prevents colors shifting between adjacent frames.
    sample = Image.new("RGB", (640, 400 * 6))
    for i, frame in enumerate(frames[::6]):
        sample.paste(frame, (0, i * 400))
    palette = sample.quantize(colors=192)
    indexed = [frame.quantize(palette=palette, dither=Image.Dither.FLOYDSTEINBERG) for frame in frames]
    asset_name = "01-v2" if number == "01" else number
    output = Path(f"public/projects/{asset_name}.gif")
    indexed[0].save(output, save_all=True, append_images=indexed[1:], duration=170, loop=0, optimize=True, disposal=2)
    print(output, output.stat().st_size, "bytes")

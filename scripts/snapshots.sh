#!/bin/sh
# Regenerates src/public/cv.pdf (print styles) and src/public/og.jpg (social preview)
# from the built site. Needs Google Chrome; the path below is for macOS.
set -e
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

npx vite build
npx vite preview --port 4173 --strictPort &
PREVIEW=$!
trap 'kill $PREVIEW' EXIT
sleep 2

"$CHROME" --headless --no-pdf-header-footer --virtual-time-budget=4000 \
    --print-to-pdf=src/public/cv.pdf http://localhost:4173/
"$CHROME" --headless --hide-scrollbars --force-prefers-reduced-motion --window-size=1200,630 \
    --virtual-time-budget=4000 --screenshot=og.png http://localhost:4173/
npx --yes sharp-cli@5 -i og.png -o src/public/og.jpg -f jpeg -q 82 --mozjpeg
rm og.png

# Rebuild so build/ carries the fresh files
npx vite build

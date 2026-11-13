#!/usr/bin/env bash
# Regenerates the web-ready media in src/assets from the heavy originals.
#
#   npm run media            # everything
#   npm run media -- video   # only videos
#   npm run media -- images  # only images
#   npm run media -- audio   # only music + UI sounds
#
# Originals live in media-src/ (UI sounds in "Persona 3 Reload SFX/") and are
# never bundled. Outputs go to src/assets/
# and are small enough to commit. Requires ffmpeg (libvpx-vp9, libx264) and cwebp.
# "images" also covers the icons and the About page party portraits.
#
# Why the outputs are so much smaller than the originals:
#   - main2/main3/skills are a short animation loop captured for ~1-2 min. We export a
#     single loop and cross-fade its seam, so <video loop> repeats it invisibly.
#   - 1440p at 50-60 fps -> 1080p at 25-30 fps, plenty for a full-screen backdrop.
#   - No audio track: every <video> on the site is muted.
#   - Each clip gets VP9/WebM (small) plus H.264/MP4 (plays everywhere).
set -euo pipefail

cd "$(dirname "$0")/.."
SRC=media-src
SFX="Persona 3 Reload SFX"
OUT=src/assets
WHAT="${1:-all}"
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT

FF=(ffmpeg -hide_banner -loglevel error -y)
# Limited-range BT.709 is what every browser decodes consistently.
SCALE="flags=lanczos:out_range=tv,format=yuv420p"
COLOR=(-color_range tv -colorspace bt709 -color_primaries bt709 -color_trc bt709)
VP9=(-an -c:v libvpx-vp9 -b:v 0 -deadline good -cpu-used 1 -row-mt 1 "${COLOR[@]}")
H264=(-an -c:v libx264 -preset slow -profile:v high -movflags +faststart "${COLOR[@]}")

need() { command -v "$1" >/dev/null || { echo "missing: $1" >&2; exit 1; }; }
have() { [ -f "$1" ] || { echo "  skip: $1 not found" >&2; return 1; }; }
size() { du -h "$1" | cut -f1 | tr -d ' '; }
poster() { "${FF[@]}" -i "$OUT/$1.mp4" -frames:v 1 -q:v 4 "$OUT/$1.jpg"; }

# One seamless loop cut out of a longer capture of a repeating animation.
# start/length/fade are frames at the output fps. The <fade> frames that follow
# the loop are cross-faded over its first frames, so the last frame flows into
# the first one. Writes <name>.webm, <name>.mp4 and a <name>.jpg poster.
loop_bg() { # <name> <fps> <height> <start> <length> <fade>
  local name="$1" fps="$2" h="$3" s="$4" len="$5" fade="$6"
  local in="$SRC/$name.mp4"
  have "$in" || return 0
  local dur; dur=$(awk "BEGIN{print $fade/$fps}")
  "${FF[@]}" -i "$in" -filter_complex "
    [0:v]fps=$fps,scale=-2:$h:$SCALE,split=2[a][b];
    [a]trim=start_frame=$((s + len)):end_frame=$((s + len + fade)),setpts=PTS-STARTPTS[tail];
    [b]trim=start_frame=$s:end_frame=$((s + len)),setpts=PTS-STARTPTS[head];
    [tail][head]xfade=transition=fade:duration=$dur:offset=0,format=yuv420p,split=2[w][m]" \
    -map "[w]" "${VP9[@]}" -crf 32 "$OUT/$name.webm" \
    -map "[m]" "${H264[@]}" -crf 23 "$OUT/$name.mp4"
  poster "$name"
  echo "  $name: webm $(size "$OUT/$name.webm"), mp4 $(size "$OUT/$name.mp4")"
}

# H.264 fallback for a clip whose WebM is already web-sized. Only browsers
# without WebM/VP9 ever download it, so it trades some quality for size.
fallback() { # <name> <input> <fps> <height> <crf> [poster]
  local name="$1" in="$2" fps="$3" h="$4" crf="$5"
  have "$in" || return 0
  "${FF[@]}" -i "$in" -vf "fps=$fps,scale=-2:$h:$SCALE" "${H264[@]}" -crf "$crf" "$OUT/$name.mp4"
  [ "${6:-}" = poster ] && poster "$name"
  echo "  $name: mp4 $(size "$OUT/$name.mp4")"
}

# Resize to the height the layout needs (2x for hi-dpi) and store as WebP.
image() { # <name> <source file> <height> <quality>
  local name="$1" in="$SRC/$2" h="$3" q="$4"
  have "$in" || return 0
  cwebp -quiet -q "$q" -alpha_q 90 -m 6 -resize 0 "$h" "$in" -o "$OUT/$name.webp"
  echo "  $name.webp: $(size "$OUT/$name.webp")"
}

# A small UI icon, kept pixel-exact (lossless WebP): these are a few KB anyway.
icon() { # <name> <P3R_ icon>
  local name="$1" in="$SRC/icons/P3R_$2_Icon.png"
  have "$in" || return 0
  cwebp -quiet -lossless -z 9 -exact "$in" -o "$OUT/$name.webp"
  echo "  $name.webp: $(size "$OUT/$name.webp")"
}

# The status-screen sprites in media-src/status-portraits are numbered
# 0001-0010, one party member each.
sprite() { echo "$SRC/status-portraits/T_UI_Camp_Status_Character_$1.png"; }

# The profile of a member shown in the About list: the source image as it is,
# over a diagonal beam of the member's colour like the game's party list.
#   - <nose x> <nose y> is the tip of the nose in the source image. It lands on
#     the same spot for everyone, so the faces line up down the list; anything
#     in front of it (a cap, a snout) sticks out to the left.
#   - <zoom> is output pixels per source pixel (2 for the battle graphics).
#   - "flip" mirrors a source that faces right; measure the nose after flipping.
# The output is 620x232: a window 116 source pixels tall around the head.
profile() { # <name> <source image> <nose x> <nose y> <beam colour rrggbb> [zoom] [flip]
  local name="$1" in="$2" nx="$3" ny="$4" c="$5" zoom="${6:-2}" flip=""
  [ "${7:-}" = flip ] && flip="hflip,"
  have "$in" || return 0
  local ox oy
  ox=$(awk "BEGIN{printf \"%d\", 128 - $nx * $zoom}")
  oy=$(awk "BEGIN{printf \"%d\", 180 - $ny * $zoom}")
  # The beam, drawn at twice the size and scaled down for smooth edges: a band
  # that starts behind the head and falls to the right.
  local beam="between(X/2,max(108+336*(Y/2-40)/192,160),108+502*Y/2/232)"
  "${FF[@]}" -i "$in" -f lavfi -i "color=c=black@0:s=1240x464,format=rgba" -frames:v 1 -filter_complex "
    [0:v]${flip}format=rgba,scale=iw*$zoom:ih*$zoom:flags=lanczos[head];
    [1:v]geq=r=$((16#${c:0:2})):g=$((16#${c:2:2})):b=$((16#${c:4:2})):a='if($beam,190,0)',scale=620:232:flags=area[beam];
    [beam][head]overlay=x=$ox:y=$oy:format=auto,format=rgba" "$TMP/profile.png"
  cwebp -quiet -q 90 -alpha_q 100 -m 6 "$TMP/profile.png" -o "$OUT/$name-profile.webp"
  echo "  $name-profile.webp: $(size "$OUT/$name-profile.webp")"
}

# The status-screen bust of a member, as the game shows it next to the stats:
# the cut-out sprite, cropped to the box around the figure (in pixels of the
# 2048x2048 sprite) and kept transparent, so the page draws the backdrop.
bust() { # <name> <sprite no.> <x> <y> <width> <height>
  local name="$1" in; in=$(sprite "$2")
  have "$in" || return 0
  "${FF[@]}" -i "$in" -frames:v 1 -vf "format=rgba,crop=$5:$6:$3:$4,scale=-2:1000:flags=lanczos" "$TMP/bust.png"
  cwebp -quiet -q 80 -alpha_q 90 -m 6 "$TMP/bust.png" -o "$OUT/$name-bust.webp"
  echo "  $name-bust.webp: $(size "$OUT/$name-bust.webp")"
}

# Background music: the audio track of a capture, trimmed to <from>-<to>
# seconds. It ends in its own fade-out, so it loops without an edit. The level
# is baked in (<gain> dB) because iOS ignores the volume of an <audio> element.
music() { # <name> <input> <from> <to> <gain dB>
  local name="$1" in="$2"
  have "$in" || return 0
  "${FF[@]}" -ss "$3" -to "$4" -i "$in" -vn -af "volume=${5}dB" -c:a libmp3lame -b:a 112k "$OUT/$name.mp3"
  echo "  $name.mp3: $(size "$OUT/$name.mp3")"
}

# One UI sound from the Steam Deck sound pack, without its silent tail.
sfx() { # <name> <deck_ui_ sound>
  local name="$1" in="$SFX/deck_ui_$2.wav"
  have "$in" || return 0
  mkdir -p "$OUT/sfx"
  "${FF[@]}" -i "$in" -af "areverse,silenceremove=start_periods=1:start_threshold=-60dB,areverse" \
    -c:a libmp3lame -q:a 4 "$OUT/sfx/$name.mp3"
  echo "  sfx/$name.mp3: $(size "$OUT/sfx/$name.mp3")"
}

if [ "$WHAT" = all ] || [ "$WHAT" = video ]; then
  need ffmpeg
  echo "videos:"
  #        name   fps height start length fade
  loop_bg  main2  30  1080   271   600    15   # resume:  3 cycles of 6.67 s
  loop_bg  main3  25  1080   979   479    13   # socials: 1 cycle of 19.16 s
  # skills.mp4 is "Persona 3 Reload - Clean Skills Menu Loop (Wallpaper Engine)" by kecox.
  loop_bg  skills 30  1080   247   401    15   # side projects: 1 cycle of 13.37 s
  #        name       input                  fps height crf
  fallback main1      "$SRC/main1.mp4"       24  540    29  poster  # about (pairs with main1.webm)
  fallback startFast  "$OUT/startFast.webm"  30  1080   23  poster  # menu intro
  fallback loopFast   "$OUT/loopFast.webm"   30  1080   23          # menu loop
fi

if [ "$WHAT" = all ] || [ "$WHAT" = images ]; then
  need cwebp
  echo "images:"
  #     name     source       height quality
  image char1    char1.png    200    82   # shown at most 90px tall
  image char2    char2.png    200    82
  image char3    char3.png    200    82
  image newsign  newsign.png  96     85   # shown ~30px tall
  # Side projects: captures of each project (screenshots of about 1440x900;
  # the card cycles through those listed in its row of src/SideProjects.jsx).
  image shot-grimorio            projects/grimorio.png             700  80
  image shot-grimorio-clases     projects/grimorio-clases.png      700  80
  image shot-grimorio-ficha      projects/grimorio-ficha.png       700  80
  image shot-unsub-dashboard     projects/unsub-dashboard.png      700  80
  image shot-unsub-suscripciones projects/unsub-suscripciones.png  700  80
  image shot-unsub-recordatorios projects/unsub-recordatorios.png  700  80
  image shot-pollanzas-dashboard projects/pollanzas-dashboard.png  700  80
  image shot-pollanzas-reportes  projects/pollanzas-reportes.png   700  80
  image shot-pollanzas-ajustes   projects/pollanzas-ajustes.png    700  80
  #    name       icon in media-src/icons (also there: Material_1 ... Material_4)
  icon icon-item  Item                  # socials: rows of each network
  icon icon-skill Skill
  icon icon-gear  Equipment_Accessory
  icon icon-plant Plant                 # side projects rows
  # About page party: the profile of all ten members...
  BG="$SRC/battle/P3R_%s_Battle_Graphic.png"
  #       name      source image                         nose x,y  beam    zoom
  profile makoto    "$(printf "$BG" Makoto_Yuki)"        29  108   35c0fb
  profile junpei    "$(printf "$BG" Junpei_Iori)"        34  89    285ff2
  profile yukari    "$(printf "$BG" Yukari_Takeba)"      5   96    d330c2
  profile akihiko   "$(printf "$BG" Akihiko_Sanada)"     4   94    a8a8a8
  profile mitsuru   "$(printf "$BG" Mitsuru_Kirijo)"     8   91    d03536
  profile aigis     "$(printf "$BG" Aigis)"              9   90    d8bc3a
  profile ken       "$(printf "$BG" Ken_Amada)"          21  94    ed945d
  profile koromaru  "$(printf "$BG" Koromaru)"           40  87    c5c5af
  profile shinjiro  "$(printf "$BG" Shinjiro_Aragaki)"   4   99    b84a66
  profile fuuka     "$(printf "$BG" Fuuka_Yamagishi)"    2   88    33c97f
  # ...and the bust shown when an entry is opened. The box is the figure's
  # outline plus some room above the head; the sprite ends at the chest.
  #    name      no.   x    y    width height
  bust makoto    0001  503  590  1138  1458
  bust yukari    0002  549  665  1018  1383
  bust junpei    0003  308  610  1238  1438
  bust akihiko   0004  228  600  1292  1448
  bust mitsuru   0005  226  610  1754  1438
  bust fuuka     0006  288  700  1078  1348
  bust aigis     0007  80   650  1250  1398
  bust ken       0008  293  737  1044  1311
  bust koromaru  0009  169  778  1474  1270
  bust shinjiro  0010  0    598  1370  1450
fi

if [ "$WHAT" = all ] || [ "$WHAT" = audio ]; then
  need ffmpeg
  echo "audio:"
  #     name  input             from  to     gain
  music bgm   "$SRC/main1.mp4"  0.18  191.4  -6
  #   name     sound in the pack     used for (see src/sound.js)
  sfx cursor   navigation          # moving the selection
  sfx confirm  default_activation  # opening a link
  sfx open     into_game_detail    # entering a page
  sfx back     out_of_game_detail  # leaving a page
  sfx show     show_modal          # revealing a panel
  sfx hide     hide_modal          # closing a panel
  sfx tab      tab_transition_01   # switching column
  sfx toggle   switch_toggle_on    # sound on/off
  sfx flyin    side_menu_fly_in    # the menu opening, once per visit
fi

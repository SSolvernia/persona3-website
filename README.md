## Media

The site uses the files in `src/assets`, already compressed for the web (short
seamless video loops in WebM + MP4, images in WebP, music and UI sounds in MP3).

The heavy originals are only needed to re-export that media. Put them in
`media-src/` (UI sounds come from `Persona 3 Reload SFX/`) and run
`npm run media` (needs `ffmpeg` and `cwebp`); the settings for each file are at
the bottom of `scripts/optimize-media.sh`. Which sound plays for each action,
and how loud, is the table at the top of `src/sound.js`. Press `M` on the site
to turn sound on or off.

The About page list is the `PARTY` table at the top of `src/AboutMe.jsx`: one
row per entry, with its text, its role (`LEADER`, `PARTY`, `NAVI` or none) and
its two images. `LEADER` and `NAVI` are fixed; `PARTY` only sets who starts in
the party, since visitors can add or remove members with Space (up to three). The side portrait on each bar is made from the battle graphics
in `media-src/battle/`, over a beam of each member's colour; the bust shown when
an entry is opened is the whole status-screen sprite from
`media-src/status-portraits/`, over the member's `color`. The small
icons of the Socials rows come from `media-src/icons/`.

The Side Projects page (`/projects`) is the `PROJECTS` table at the top of
`src/SideProjects.jsx`: one row per project, with its text, link and
captures, which the card cycles through on its own (screenshots go in
`media-src/projects/`). Its backdrop is "Persona 3 Reload -
Clean Skills Menu Loop (Wallpaper Engine)" by kecox, cut down to one loop.

The original
video captures are too big for git. Assets from the original project:
https://drive.google.com/drive/folders/1_dVxHVTJO_YtMAo9ia7wnja1XY0nImr5?usp=drive_link


All credits reserved to blairxu13 for creathing the original website

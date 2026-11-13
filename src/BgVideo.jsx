// Full-screen background clip. Browsers take the first <source> they can
// decode: VP9/WebM where supported, H.264/MP4 everywhere else. The poster
// paints immediately, so the page is never black while the clip downloads.
export default function BgVideo({ media, ref, autoPlay = true, loop = true, ...props }) {
  return (
    <video
      ref={ref}
      poster={media.poster}
      autoPlay={autoPlay}
      loop={loop}
      muted
      playsInline
      {...props}
    >
      <source src={media.webm} type="video/webm" />
      <source src={media.mp4} type="video/mp4" />
    </video>
  )
}

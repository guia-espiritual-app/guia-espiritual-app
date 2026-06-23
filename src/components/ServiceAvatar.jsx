export default function ServiceAvatar({ src, alt }) {
  return (
    <img
      src={src}
      alt={alt}
      className="service-avatar mx-auto mb-3 h-[150px] w-auto max-w-[160px] object-contain drop-shadow-[0_0_14px_rgba(251,191,36,0.2)]"
    />
  )
}

export default function StoreLogo({
  src,
  alt = "هميزات البال",
  variant = "full",
  className = "",
}: {
  src?: string;
  alt?: string;
  variant?: "full" | "mark";
  className?: string;
}) {
  const url = src || "/branding/logo.jpg";
  const crop = variant === "mark" ? "h-16 w-16 rounded-full object-cover sm:h-20 sm:w-20" : "object-contain";
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={url} alt={alt} className={`${crop} ${className}`} />
  );
}

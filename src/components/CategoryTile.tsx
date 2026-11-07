import Link from "next/link";

export default function CategoryTile({
  href,
  image,
  index,
  title,
  description,
  count,
}: {
  href: string;
  image: string;
  index: string;
  title: string;
  description: string;
  count: number;
}) {
  return (
    <Link href={href} className="card group flex h-full flex-col overflow-hidden">
      <div className="relative aspect-[4/3] overflow-hidden bg-black">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover object-center transition duration-700 group-hover:scale-105"
        />
        <span className="absolute right-3 top-3 rounded-full bg-black/65 px-2.5 py-1 text-[10px] tracking-[0.28em] text-gold">
          {index}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h2 className="text-xl font-extrabold leading-tight text-cream sm:text-2xl">{title}</h2>
        <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted sm:text-sm">{description}</p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <span className="whitespace-nowrap text-xs text-gold sm:text-sm">{count} قطعة</span>
          <span className="whitespace-nowrap rounded-full border border-gold/40 px-3 py-1 text-xs text-gold-2 transition group-hover:bg-gold group-hover:text-[#1a140c]">
            دخل تشوف
          </span>
        </div>
      </div>
    </Link>
  );
}

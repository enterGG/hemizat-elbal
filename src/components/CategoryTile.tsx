import type { CategoryStyle } from "@/lib/types";
import Link from "next/link";

const shapeClass: Record<CategoryStyle["shape"], string> = {
  square: "aspect-square",
  rectangle: "aspect-[4/3]",
  triangle: "aspect-square cat-clip-triangle",
  star: "aspect-square cat-clip-star",
  circle: "aspect-square cat-clip-circle",
  hexagon: "aspect-square cat-clip-hex",
};

const cornerClass: Record<CategoryStyle["corners"], string> = {
  sharp: "rounded-none",
  rounded: "rounded-2xl",
  soft: "rounded-[2.2rem]",
};

const glowClass: Record<CategoryStyle["glow"], string> = {
  off: "",
  soft: "cat-glow-soft",
  strong: "cat-glow-strong",
};

function canRound(shape: CategoryStyle["shape"]) {
  return shape === "square" || shape === "rectangle";
}

export default function CategoryTile({
  href,
  image,
  logo,
  index,
  title,
  description,
  count,
  style,
}: {
  href: string;
  image: string;
  logo?: string;
  index: string;
  title: string;
  description: string;
  count: number;
  style: CategoryStyle;
}) {
  const clip = shapeClass[style.shape] || shapeClass.rectangle;
  const round = canRound(style.shape) ? cornerClass[style.corners] : "";
  const glow = glowClass[style.glow];
  const framed = style.frame !== "none";
  const double = style.frame === "double";

  return (
    <Link href={href} className="group flex h-full w-full flex-col">
      <div
        className={`relative ${clip} ${round} ${glow} ${framed ? "bg-gold p-[3px]" : "bg-black"} ${
          double ? "cat-frame-double" : ""
        }`}
      >
        <div className={`h-full w-full overflow-hidden bg-black ${clip} ${round}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover object-center transition duration-700 group-hover:scale-105"
          />
          {logo ? (
            <span className="absolute bottom-3 right-3 overflow-hidden rounded-full border border-gold/50 bg-black/70 p-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logo} alt="" className="h-10 w-10 object-cover object-center sm:h-12 sm:w-12" />
            </span>
          ) : null}
          <span className="absolute right-3 top-3 rounded-full bg-black/65 px-2.5 py-1 text-[10px] tracking-[0.28em] text-gold">
            {index}
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col pt-4">
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

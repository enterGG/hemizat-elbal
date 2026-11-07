import SiteFrame from "@/components/SiteFrame";
import Link from "next/link";

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ number?: string }>;
}) {
  const { number } = await searchParams;

  return (
    <SiteFrame>
      <div className="mx-auto max-w-2xl px-5 py-24 text-center">
        <p className="text-xs tracking-[0.3em] text-gold">MERCI</p>
        <h1 className="mt-4 text-4xl font-extrabold">توصلنا بالطلب</h1>
        {number ? <p className="mt-3 text-gold-2">رقم الطلب: {number}</p> : null}
        <p className="mt-4 text-muted leading-8">
          الطلب تسجّل، والمالك غادي يتواصل معاك باش يأكد التفاصيل والتوصيل. شكراً ليك على الثقة في هميزات البال.
        </p>
        <Link href="/" className="gold-btn mt-8 inline-flex rounded-full px-6 py-3">
          رجوع للرئيسية
        </Link>
      </div>
    </SiteFrame>
  );
}

import type { Metadata } from "next";
import { Cairo, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "هميزات البال | سبرديلات وسيكان أصلية مستعملة",
    template: "%s | هميزات البال",
  },
  description:
    "هميزات البال: ستور احترافي لسبرديلات الماركات الواعرة والسيكان الأصلية المستعملة. قطع منتقاة، حالة واضحة، وطلب سهل داخل المغرب.",
  keywords: [
    "هميزات البال",
    "سبرديلات مستعملة",
    "سيكان مستعملة",
    "ماركات أصلية",
    "Jordan",
    "Louis Vuitton",
    "Chanel",
    "المغرب",
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${cairo.variable} ${display.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}

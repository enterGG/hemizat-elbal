"use client";

import StoreLogo from "./StoreLogo";
import { useEffect, useState } from "react";

export default function IntroOverlay({ logoUrl }: { logoUrl: string }) {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("hemizat-intro") === "1") return;
    } catch {
      /* show intro anyway */
    }
    setVisible(true);
    const leave = window.setTimeout(() => setLeaving(true), 4200);
    const hide = window.setTimeout(() => {
      try {
        sessionStorage.setItem("hemizat-intro", "1");
      } catch {
        /* ignore */
      }
      setVisible(false);
    }, 5200);
    return () => {
      window.clearTimeout(leave);
      window.clearTimeout(hide);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[80] flex items-center justify-center bg-[#070707] ${
        leaving ? "intro-leave" : ""
      }`}
    >
      <div className="px-6 text-center">
        <div className="mx-auto mb-4 opacity-0 animate-fade-up" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
          <StoreLogo src={logoUrl} className="mx-auto h-auto w-[min(420px,86vw)]" />
        </div>
        <p
          className="mt-2 text-2xl text-cream/90 opacity-0 animate-fade-up sm:text-3xl"
          style={{ animationDelay: "1.6s", animationFillMode: "forwards" }}
        >
          مرحبا بكم
        </p>
      </div>
    </div>
  );
}

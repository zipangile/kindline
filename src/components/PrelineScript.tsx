"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function PrelineScript() {
  const pathname = usePathname();

  useEffect(() => {
    const loadPreline = async () => {
      const { HSStaticMethods } = await import("preline");

      HSStaticMethods.autoInit();
    };

    loadPreline();
  }, [pathname]);

  return null;
}

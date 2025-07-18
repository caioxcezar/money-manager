"use client";

import React, { useTransition } from "react";
import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export default function LocaleDropdown() {
  const t = useTranslations("panel");
  const defaultLocale = useLocale();

  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const params = useParams();

  const onSelectChange = ({ target: { value } }) =>
    startTransition(() => {
      router.replace({ pathname, params }, { locale: value });
    });

  return (
    <label className="block mb-2 text-sm font-medium">
      {t("select_language")}
      <select
        className="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5 dark:bg-canvas-gray dark:border-gray-600 dark:placeholder-gray-400"
        defaultValue={defaultLocale}
        disabled={isPending}
        onChange={onSelectChange}
      >
        {routing.locales.map((cur) => (
          <option key={cur} value={cur}>
            {cur}
          </option>
        ))}
      </select>
    </label>
  );
}

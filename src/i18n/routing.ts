import { defineRouting } from "next-intl/routing";

export enum AppRoutes {
  HOME = '/',
  EXPENSES = '/expenses',
  CATEGORIES = '/categories',
  BACKUP = '/backup'
}

export const routing = defineRouting({
  locales: ["en", "pt"],
  defaultLocale: "en",
  pathnames: {
    '/': AppRoutes.HOME,
    '/expenses': AppRoutes.EXPENSES,
    '/categories': AppRoutes.CATEGORIES,
    '/backup': AppRoutes.BACKUP,
  },
});

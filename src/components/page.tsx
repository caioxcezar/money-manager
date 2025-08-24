import React from "react";
import { ToastContainer } from "react-toastify";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import LocaleDropdown from "./LocaleDropdown";
import { AppRoutes } from "@/i18n/routing";

type Props = {
  children: React.ReactNode;
  title?: string;
};

const Page = ({ children, title }: Props) => {
  const t = useTranslations("panel");

  const pages = [
    { path: AppRoutes.HOME, title: t("home") },
    { path: AppRoutes.EXPENSES, title: t("expenses") },
    { path: AppRoutes.CATEGORIES, title: t("categories") },
    { path: AppRoutes.BACKUP, title: t("backup") },
  ];

  return (
    <main className={"flex bg-canvas-lgray dark:bg-black"}>
      <div className="ms-2 me-4 w-1/6 h-screen">
        <div className="mt-2">
          <ul className="fixed bg-white dark:bg-canvas-gray rounded-t-lg h-screen p-2 w-1/6">
            {pages.map(({ path, title }) => (
              <li
                key={path}
                className="bg-purple-900-alt hover:bg-purple-900 rounded-lg mb-2 p-2"
              >
                <Link href={path}>{title}</Link>
              </li>
            ))}
            <LocaleDropdown />
          </ul>
        </div>
      </div>
      <div className="bg-white dark:bg-canvas-gray rounded-t-lg mt-2 me-2 p-2 w-5/6 text-black dark:text-white">
        <ToastContainer />
        <span className="text-5xl">{title}</span>
        <div>{children}</div>
      </div>
    </main>
  );
};

export default Page;

import React from "react";
import PropTypes from "prop-types";
import { ToastContainer } from "react-toastify";
import Link from "next/link";

const pages = [
  { path: "/", title: "Home" },
  { path: "/expenses", title: "Expenses" },
  { path: "/categories", title: "Categories" },
];

const Page = ({ children, title }) => {
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
Page.propTypes = {
  children: PropTypes.element,
  title: PropTypes.string,
};
export default Page;

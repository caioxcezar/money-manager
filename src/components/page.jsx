import React from "react";
import PropTypes from "prop-types";
import { ToastContainer } from "react-toastify";
import Link from "next/link";
import { Convergence } from "next/font/google";

const pages = [
  { path: "/", title: "Home" },
  { path: "/expenses", title: "Expenses" },
  { path: "/categories", title: "Categories" },
];

const convergence = Convergence({ weight: "400", subsets: ["latin"] });

const Page = ({ children, title }) => {
  return (
    <main
      className={`flex h-screen bg-white dark:bg-black ${convergence.className}`}
    >
      <div className=" bg-blue-900/20 rounded-lg m-2 p-2 w-1/4">
        <ul>
          {pages.map(({ path, title }) => (
            <li key={path} className="bg-blue-500 rounded-lg mb-2 p-2">
              <Link href={path}>{title}</Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-blue-900/20 rounded-lg m-2 p-2 w-3/4">
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

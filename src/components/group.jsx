import React, { useState } from "react";
import PropTypes from "prop-types";
import Button from "./button";
import { useTranslations } from "next-intl";
const Group = ({ title, children, initialOpen = false }) => {
  const t = useTranslations("group");
  const [isOpen, setOpen] = useState(initialOpen);
  return (
    <div className="border border-black dark:border-white my-2 rounded-lg p-2">
      <div className="flex">
        {!!title && (
          <div className="text-2xl flex items-center w-full">{title}</div>
        )}
        <Button
          title={isOpen ? t("close") : t("open")}
          onClick={() => setOpen(!isOpen)}
        />
      </div>
      <div
        className={`transition-all overflow-hidden ease-in-out duration-500 ${
          isOpen ? "max-h-screen" : "max-h-0"
        }`}
      >
        {children}
      </div>
    </div>
  );
};
Group.propTypes = {
  children: PropTypes.element,
  title: PropTypes.string,
  initialOpen: PropTypes.bool,
};
export default Group;

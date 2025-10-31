import React, { useContext, useState } from "react";
import { MdOutlineWbSunny, MdSunny } from "react-icons/md";
import { ThemeContext } from "../context/ThemeContext.jsx";
import { Link, useLocation } from "react-router-dom"; // ✅ useLocation helps detect current route

const Header = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const location = useLocation(); // get current URL path

  const links = [
    { name: "Learn", path: "/" },
    { name: "Create", path: "/create" },
    { name: "Visualize", path: "/visualize" },
  ];

  return (
    <div>
      <div className="w-full h-[50px] bg-[#efede9] dark:bg-[#2a333f] rounded-full shadow-md px-2 py-1 flex flex-wrap gap-5 items-center justify-between">
        {/* Logo */}
        <div className="w-[40px] h-[40px]">
          <img
            className="w-full h-full object-contain"
            src="/icons/icon128.png"
            alt="Master"
          />
        </div>

        {/* Navigation */}
        <div className="flex flex-wrap gap-8 justify-center items-center">
          {links.map((link, index) => (
            <Link
              key={index}
              to={link.path}
              className={`text-lg font-semibold text-[#0694d1] ${
                location.pathname === link.path ? "underline" : ""
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Theme Toggle */}
        <button
          className="icon flex justify-center items-center mr-2 text-lg"
          onClick={toggleTheme}
        >
          {theme === "light" ? (
            <MdOutlineWbSunny className="text-[#0694d1] font-bold" />
          ) : (
            <MdSunny className="text-[#0694d1] font-bold" />
          )}
        </button>
      </div>
    </div>
  );
};

export default Header;



"use client";
import React, { useState } from "react";
import scss from "./header.module.scss";
import { CiSearch } from "react-icons/ci";
import { useRouter } from "next/navigation";
import { IoMdMenu } from "react-icons/io";
import { GoX } from "react-icons/go";

const Header = () => {
  const [isModal, setIsModal] = useState(false);
  const [menuIsModal, setMenuIsModal] = useState(false);

  const router = useRouter();
  return (
    <header className={scss.header}>
      <div className="container">
        <div className={scss.mainContainer}>
          <span
            className={scss.menu}
            onClick={() => setMenuIsModal((prev) => !prev)}
            role="button"
            aria-label="Toggle menu"
            aria-expanded={menuIsModal}
          >
            <div className={scss.iconWrapper}>
              <IoMdMenu
                className={`${scss.icon} ${scss.menuIcon} ${
                  menuIsModal ? scss.hidden : ""
                }`}
              />
              <GoX
                className={`${scss.icon} ${scss.closeIcon} ${
                  menuIsModal ? scss.visible : ""
                }`}
              />
            </div>
          </span>
          {menuIsModal && (
            <div className={scss.sidebar} onClick={() => setMenuIsModal(false)}>
              <a
                onClick={() => {
                  setMenuIsModal(false);
                  router.push("/movies");
                }}
              >
                Movies
              </a>
              <a
                onClick={() => {
                  setMenuIsModal(false);
                  router.push("/tv");
                }}
              >
                TV Shows
              </a>
            </div>
          )}
          <div onClick={() => router.push("/")} className={scss.left_header}>
            <img
              src="https://movie.elcho.dev/assets/eco-movie-logo-a8_bjuTM.svg"
              alt=""
            />
            <h2>EcoMovie</h2>
          </div>
          <div className={scss.right_header}>
            <a onClick={() => router.push("/movies")}>Movies</a>
            <a onClick={() => router.push("/tv")}>TV Shows</a>
            <span onClick={() => setIsModal(!isModal)}>
              <CiSearch />
            </span>
            {isModal && (
              <div
                className={scss.modalOverlay}
                onClick={() => setIsModal(false)}
              >
                <div
                  className={scss.modalContent}
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="text"
                    placeholder="Search movies or TV shows..."
                    className={scss.modalInput}
                  />
                  <button onClick={() => setIsModal(false)}>Close</button>{" "}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

"use client";
import React, { useState } from "react";
import scss from "./header.module.scss";
import { CiSearch } from "react-icons/ci";
import { useRouter } from "next/navigation";

const Header = () => {
  const [isModal, setIsModal] = useState(false);

  const router = useRouter();
  return (
    <header className={scss.header}>
      <div className="container">
        <div className={scss.mainContainer}>
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

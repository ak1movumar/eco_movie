"use client";
import React, { useState } from "react";
import scss from "./header.module.scss";
import { CiSearch } from "react-icons/ci";
import { useRouter } from "next/navigation";

const Header = () => {
  const [isModal, setIsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  // console.log(isModal);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchTerm.trim();
    if (query) {
      router.push(`/searchPage?query=${encodeURIComponent(query)}`);
    }
  };

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
            <a onClick={() => router.push("/tvs")}>TV Shows</a>
            <span onClick={() => setIsModal(!isModal)}>
              <CiSearch />
            </span>
            {isModal && (
              <div
                className={scss.modalOverlay}
                onClick={() => setIsModal(false)}
              >
                <form
                  className={scss.modalContent} 
                  onClick={(e) => e.stopPropagation()} onSubmit={handleSearch}
                >
                  <input
                    type="text"
                    placeholder="Search movies or TV shows..."
                    className={scss.modalInput}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {/* <button type="submit">Search</button> */}
                  <button type="submit" className={scss.searchButton}><CiSearch /></button>
                  <button onClick={() => setIsModal(false)}>Close</button>{" "}
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

"use client";

import React, { useState, useCallback, useEffect } from "react";
import scss from "./header.module.scss";
import { CiSearch } from "react-icons/ci";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { IoMdMenu } from "react-icons/io";
import { GoX } from "react-icons/go";

const LOGO_URL = "https://movie.elcho.dev/assets/eco-movie-logo-a8_bjuTM.svg";

const Header = () => {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigate = useCallback(
    (path: string) => {
      router.push(path);
      setIsMenuOpen(false);
    },
    [router],
  );

  const toggleMenu = useCallback(() => setIsMenuOpen((p) => !p), []);

  const handleSearch = useCallback(
    (query: string) => {
      if (query.trim()) {
        router.push(`/search/${encodeURIComponent(query.trim())}`);
        setIsSearchModalOpen(false);
        setSearchQuery("");
      }
    },
    [router],
  );

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch(searchQuery);
    }
  };

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Close on Escape key and support Space to toggle
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className={scss.header}>
      <div className="container">
        <div className={scss.mainContainer}>
          {/* Mobile Menu Button */}
          <span
            className={scss.menu}
            onClick={toggleMenu}
            role="button"
            tabIndex={0}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") toggleMenu();
            }}
          >
            <div className={scss.iconWrapper}>
              <IoMdMenu
                className={`${scss.icon} ${scss.menuIcon} ${
                  isMenuOpen ? scss.hidden : ""
                }`}
              />
              <GoX
                className={`${scss.icon} ${scss.closeIcon} ${
                  isMenuOpen ? scss.visible : ""
                }`}
              />
            </div>
          </span>

          {/* Mobile Sidebar */}
          {isMenuOpen && (
            <nav className={scss.sidebar} role="navigation">
              <h2
                onClick={() => handleNavigate("/movies")}
                className={scss.navLink}
              >
                Movies
              </h2>
              <h2
                onClick={() => handleNavigate("/tv")}
                className={scss.navLink}
              >
                TV Shows
              </h2>
            </nav>
          )}

          {/* Logo */}
          <div
            onClick={() => handleNavigate("/")}
            className={scss.left_header}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && handleNavigate("/")}
          >
            <img src={LOGO_URL} alt="EcoMovie Logo" />
            <h2>EcoMovie</h2>
          </div>

          {/* Desktop Navigation */}
          <div className={scss.right_header}>
            <button
              onClick={() => handleNavigate("/movies")}
              className={scss.navLink}
            >
              Movies
            </button>
            <button
              onClick={() => handleNavigate("/tv")}
              className={scss.navLink}
            >
              TV Shows
            </button>
            <button
              onClick={() => setIsSearchModalOpen(!isSearchModalOpen)}
              className={scss.searchButton}
              aria-label="Open search"
            >
              <CiSearch />
            </button>

            {/* Search Modal */}
            {isSearchModalOpen && (
              <div
                className={scss.modalOverlay}
                onClick={() => setIsSearchModalOpen(false)}
                role="dialog"
                aria-modal="true"
              >
                <div
                  className={scss.modalContent}
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="text"
                    placeholder="Search movies or TV shows..."
                    className={scss.modalInput}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                    autoFocus
                  />
                  <button
                    onClick={() => handleSearch(searchQuery)}
                    className={scss.searchBtn}
                    type="button"
                  >
                    Search
                  </button>
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

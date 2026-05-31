"use client";

import React, { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import scss from "./header.module.scss";
import { CiSearch } from "react-icons/ci";
import { IoMdMenu } from "react-icons/io";
import { GoX } from "react-icons/go";

const LOGO_URL = "https://movie.elcho.dev/assets/eco-movie-logo-a8_bjuTM.svg";


const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  const closeAll = useCallback(() => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  }, []);

  const handleSearch = useCallback(
    (query: string) => {
      if (query.trim()) {
        router.push(`/search/${encodeURIComponent(query.trim())}`);
        setIsSearchOpen(false);
        setSearchQuery("");
      }
    },
    [router],
  );

  const handleSearchKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") handleSearch(searchQuery);
    },
    [handleSearch, searchQuery],
  );

  // Close menu on route change
  useEffect(() => { setIsMenuOpen(false); }, [pathname]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeAll(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeAll]);

  return (
    <header className={scss.header}>
      <div className="container">
        <div className={scss.mainContainer}>
          {/* Mobile menu toggle */}
          <button
            className={scss.menu}
            onClick={() => setIsMenuOpen((p) => !p)}
            aria-label="Открыть меню"
            aria-expanded={isMenuOpen}
          >
            <div className={scss.iconWrapper}>
              <IoMdMenu className={`${scss.icon} ${scss.menuIcon} ${isMenuOpen ? scss.hidden : ""}`} />
              <GoX className={`${scss.icon} ${scss.closeIcon} ${isMenuOpen ? scss.visible : ""}`} />
            </div>
          </button>

          {/* Mobile sidebar */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.nav
                className={scss.sidebar}
                initial={{ x: "-100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "-100%", opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 } as any}
                aria-label="Мобильная навигация"
              >
                <Link href="/movies" className={scss.navLink} onClick={closeAll}>
                  Фильмы
                </Link>
                <Link href="/tv" className={scss.navLink} onClick={closeAll}>
                  ТВ-шоу
                </Link>
              </motion.nav>
            )}
          </AnimatePresence>

          {/* Logo */}
          <Link href="/" className={scss.left_header} aria-label="На главную страницу">
            <img src={LOGO_URL} alt="EcoMovie" />
            <span className={scss.logoText}>EcoMovie</span>
          </Link>

          {/* Desktop navigation */}
          <nav className={scss.right_header} aria-label="Основная навигация">
            <Link
              href="/movies"
              className={`${scss.navLink} ${pathname === "/movies" ? scss.active : ""}`}
            >
              Фильмы
            </Link>
            <Link
              href="/tv"
              className={`${scss.navLink} ${pathname === "/tv" ? scss.active : ""}`}
            >
              ТВ-шоу
            </Link>
            <button
              onClick={() => setIsSearchOpen((p) => !p)}
              className={scss.searchButton}
              aria-label="Открыть поиск"
            >
              <CiSearch />
            </button>

            {/* Search dropdown */}
            <AnimatePresence>
              {isSearchOpen && (
                <motion.div
                  className={scss.searchDropdown}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                >
                  <input
                    type="text"
                    placeholder="Поиск фильмов или ТВ-шоу..."
                    className={scss.searchInput}
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
                    Поиск
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;

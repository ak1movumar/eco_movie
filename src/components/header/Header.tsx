"use client";

import React, { useState, useCallback, useEffect } from "react";
import scss from "./header.module.scss";
import { CiSearch } from "react-icons/ci";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { IoMdMenu } from "react-icons/io";
import { GoX } from "react-icons/go";

const LOGO_URL = "https://movie.elcho.dev/assets/eco-movie-logo-a8_bjuTM.svg";

/**
 * Компонент заголовка приложения с навигацией и поиском
 */
const Header = () => {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  /**
   * Обработчик навигации с закрытием меню
   */
  const handleNavigate = useCallback(
    (path: string) => {
      router.push(path);
      setIsMenuOpen(false);
    },
    [router],
  );

  /**
   * Переключатель видимости меню
   */
  const toggleMenu = useCallback(() => setIsMenuOpen((prev) => !prev), []);

  /**
   * Обработчик поиска с валидацией
   */
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

  /**
   * Обработчик нажатия клавиши Enter в поле поиска
   */
  const handleSearchKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleSearch(searchQuery);
      }
    },
    [handleSearch, searchQuery],
  );

  // Закрываем меню при смене маршрута
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Закрываем меню по клавише Escape
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
        setIsSearchModalOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscapeKey);
    return () => window.removeEventListener("keydown", handleEscapeKey);
  }, []);

  return (
    <header className={scss.header}>
      <div className="container">
        <div className={scss.mainContainer}>
          {/* Кнопка меню для мобильных устройств */}
          <span
            className={scss.menu}
            onClick={toggleMenu}
            role="button"
            tabIndex={0}
            aria-label="Переключить меню"
            aria-expanded={isMenuOpen}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleMenu();
              }
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

          {/* Мобильная боковая панель */}
          {isMenuOpen && (
            <nav
              className={scss.sidebar}
              role="navigation"
              aria-label="Мобильная навигация"
            >
              <h2
                onClick={() => handleNavigate("/movies")}
                className={scss.navLink}
                role="button"
                tabIndex={0}
                onKeyDown={(e) =>
                  e.key === "Enter" && handleNavigate("/movies")
                }
              >
                Фильмы
              </h2>
              <h2
                onClick={() => handleNavigate("/tv")}
                className={scss.navLink}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && handleNavigate("/tv")}
              >
                ТВ-шоу
              </h2>
            </nav>
          )}

          {/* Логотип */}
          <div
            onClick={() => handleNavigate("/")}
            className={scss.left_header}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && handleNavigate("/")}
            aria-label="На главную страницу"
          >
            <img src={LOGO_URL} alt="EcoMovie Логотип" />
            <h2>EcoMovie</h2>
          </div>

          {/* Компьютерная навигация */}
          <div className={scss.right_header}>
            <button
              onClick={() => handleNavigate("/movies")}
              className={scss.navLink}
              aria-label="Перейти к фильмам"
            >
              Фильмы
            </button>
            <button
              onClick={() => handleNavigate("/tv")}
              className={scss.navLink}
              aria-label="Перейти к ТВ-шоу"
            >
              ТВ-шоу
            </button>
            <button
              onClick={() => setIsSearchModalOpen(!isSearchModalOpen)}
              className={scss.searchButton}
              aria-label="Открыть поиск"
            >
              <CiSearch />
            </button>

            {/* Модальное окно поиска */}
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
                    placeholder="Поиск фильмов или ТВ-шоу..."
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
                    aria-label="Выполнить поиск"
                  >
                    Поиск
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

"use client";

import { FaDiscord, FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";
import scss from "./footer.module.scss";
import { SlSocialVkontakte } from "react-icons/sl";

// Ссылки социальных сетей
const SOCIAL_LINKS = [
  { Icon: FaDiscord, label: "Discord", href: "#" },
  { Icon: FaInstagram, label: "Instagram", href: "#" },
  { Icon: SlSocialVkontakte, label: "ВКонтакте", href: "#" },
  { Icon: FaLinkedin, label: "LinkedIn", href: "#" },
  { Icon: FaGithub, label: "GitHub", href: "#" },
];

/**
 * Компонент подвала приложения с навигацией и социальными сетями
 */
export default function Footer() {
  return (
    <footer className={scss.container}>
      <div className="container">
        <div className={scss.mainContainer}>
          {/* Навигационные ссылки */}
          <nav className={scss.tags}>
            <a href="#" rel="noopener noreferrer">
              Условия использования
            </a>
            <a href="#" rel="noopener noreferrer">
              Политика конфиденциальности
            </a>
            <a href="#" rel="noopener noreferrer">
              О нас
            </a>
            <a href="#" rel="noopener noreferrer">
              Блог
            </a>
            <a href="#" rel="noopener noreferrer">
              ЧастыеВопросы
            </a>
          </nav>

          {/* Описание приложения */}
          <p>
            EcoMovie - уникальный веб-сайт, предоставляющий увлекательную
            информацию о фильмах и телешоу. Здесь вы можете узнать все
            необходимые детали о ваших любимых фильмах, актёрах, режиссёрах,
            рейтингах и многом другом. EcoMovie обладает стильным и интуитивным
            интерфейсом, который делает ваш поиск кинематографических шедевров
            максимально удобным и приятным.
          </p>

          {/* Иконки социальных сетей */}
          <div className={scss.icons}>
            {SOCIAL_LINKS.map(({ Icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                title={label}
                rel="noopener noreferrer"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

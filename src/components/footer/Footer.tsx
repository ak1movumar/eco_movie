"use client";

import { FaDiscord, FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";
import scss from "./footer.module.scss";
import { SlSocialVkontakte } from "react-icons/sl";

const SOCIAL_LINKS = [
  { Icon: FaDiscord, label: "Discord", href: "#" },
  { Icon: FaInstagram, label: "Instagram", href: "#" },
  { Icon: SlSocialVkontakte, label: "VKontakte", href: "#" },
  { Icon: FaLinkedin, label: "LinkedIn", href: "#" },
  { Icon: FaGithub, label: "GitHub", href: "#" },
];

export default function Footer() {
  return (
    <footer className={scss.container}>
      <div className="container">
        <div className={scss.mainContainer}>
          <nav className={scss.tags}>
            <a href="#" rel="noopener noreferrer">
              Terms Of Use
            </a>
            <a href="#" rel="noopener noreferrer">
              Privacy Policy
            </a>
            <a href="#" rel="noopener noreferrer">
              About
            </a>
            <a href="#" rel="noopener noreferrer">
              Blog
            </a>
            <a href="#" rel="noopener noreferrer">
              FAQ
            </a>
          </nav>

          <p>
            EcoMovie - a unique website providing fascinating information about
            movies and TV shows. Here you can discover all the necessary details
            about your favorite films, actors, directors, ratings, and much
            more. EcoMovie boasts a stylish and intuitive interface that makes
            your search for cinematic masterpieces as convenient and enjoyable
            as possible.
          </p>

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

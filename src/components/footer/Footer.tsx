"use client"
import { FaDiscord, FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";
import scss from "./footer.module.scss";
import { SlSocialVkontakte } from "react-icons/sl";

export default function Footer() {
  return (
    <footer className={scss.container}>
      <div className="container">
        <div className={scss.mainContainer}>
          <div className={scss.tags}>
            <a href="">Terms Of Use</a>
            <a href="">Privacy-Policy</a>
            <a href="">About</a>
            <a href="">Blog</a>
            <a href="">FAQ</a>
          </div>
          <p>
            EcoMovie - a unique website providing fascinating information about
            movies and TV shows. Here you can discover all the <br />
            necessary details about your favorite films, actors, directors,
            ratings, and much more. EcoMovie boasts a stylish and intuitive{" "}
            <br />
            interface that makes your search for cinematic masterpieces as
            convenient and enjoyable as possible.
          </p>
          <div className={scss.icons}>
            <span>
              <FaDiscord />
            </span>
            <span>
              <FaInstagram />
            </span>
            <span>
              <SlSocialVkontakte />
            </span>
            <span>
              <FaLinkedin />
            </span>
            <span>
              <FaGithub />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

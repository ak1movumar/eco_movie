import HomeMovie from "@/components/home/HomeMovie";
import Trending from "@/components/pages/trending/Trending";
import Popular from "@/components/pages/popular/Popular";

/**
 * Главная страница приложения со списком трендов и популярного контента
 */
export default function Home() {
  return (
    <div>
      {/* Баннер с поиском */}
      <HomeMovie />
      {/* Раздел трендов */}
      <Trending />
      {/* Раздел популярного контента */}
      <Popular />
    </div>
  );
}

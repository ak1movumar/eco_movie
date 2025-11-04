import HomeMovie from "@/components/home/HomeMovie";
import Trending from "@/components/pages/trending/Trending";
import Popular from "@/components/pages/popular/Popular";

export default function Home() {
  return (
    <div>
      <HomeMovie />
      <Trending />
      <Popular />
    </div>
  );
}

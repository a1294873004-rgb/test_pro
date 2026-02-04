import { PageNav } from "../PageNav";
import { SEO } from "../SEO";

function HomePage() {
  return (
    <div>
      HomePage
      <PageNav />
      <SEO
        title="YidooO - Best AI Anime Generator | Free Character Design & Story Creator"
        description="Transform your ideas into anime art with YidooO's AI-powered platform. Explore classic recreations, trending remixes, original worldbuilding, and character design templates. Free AI art generator with infinite creative board. Start creating now!"
        path="/"
      />
    </div>
  );
}

export default HomePage;

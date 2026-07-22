import type { Metadata } from "next";
import AboutStory from "@/components/about/AboutStory";
import AboutSimple from "@/components/about/AboutSimple";

export const metadata: Metadata = {
  title: "About",
  description: "The founding story of Madbunny — a character-IP drop brand born in a Detroit art studio.",
};

// sm+: scrolling founding-story carousel — four full-viewport dark chapters
// (AboutStory, client). Mobile: simple light one-pager (AboutSimple). Copy is
// shared via components/about/chapters.tsx.
export default function AboutPage() {
  return (
    <main className="flex-1">
      <div className="hidden sm:block">
        <AboutStory />
      </div>
      <AboutSimple className="sm:hidden" />
    </main>
  );
}

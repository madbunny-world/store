import type { Metadata } from "next";
import AboutStory from "@/components/about/AboutStory";

export const metadata: Metadata = {
  title: "About",
  description: "The founding story of Madbunny — a character-IP drop brand born in a Detroit art studio.",
};

// Scrolling founding-story narrative — four full-viewport chapters that fade in
// and lift as they scroll (AboutStory, client). Copy verbatim from the reference.
export default function AboutPage() {
  return (
    <main className="flex-1">
      <AboutStory />
    </main>
  );
}

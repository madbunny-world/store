import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy notice",
  description: "How Madbunny handles the email address you share when you sign up.",
};

const EMAIL = "world.madbunny@gmail.com";

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 pb-24 pt-16 sm:px-6">
      <h1 className="text-2xl font-semibold">Madbunny Privacy Notice</h1>
      <p className="mt-2 font-mono text-[11px] uppercase tracking-wider text-gun-metal">
        Effective: July 21, 2026
      </p>

      <div className="mt-10 space-y-6 text-[15px] leading-relaxed text-gun-metal [&_strong]:text-black">
        <p>
          Madbunny collects your email address when you sign up on our site. We use
          it for one thing: to send updates about drops, releases, and news.
        </p>
        <p>
          <strong>Fine art inquiries.</strong>{" "}
          When you inquire about a fine art piece, we collect your email, full name,
          and address, plus a note if you write one. The address is used to quote
          shipping for that piece. The rest is used to reply to you about it. An
          inquiry does not add you to the mailing list.
        </p>
        <p>
          <strong>Where it lives.</strong> Your email and any inquiry details are
          stored with Airtable, the service we use to run our list and our
          inquiries. Airtable holds and processes this data on our behalf.
        </p>
        <p>
          <strong>What we don&rsquo;t do.</strong>{" "}
          We don&rsquo;t sell your details. We don&rsquo;t rent them. We don&rsquo;t
          hand them to anyone outside the tools we use to run Madbunny.
        </p>
        <p>
          <strong>Leaving.</strong>{" "}
          Every email has an unsubscribe link. Use it anytime and you&rsquo;re off
          the list. You can also email{" "}
          <a href={`mailto:${EMAIL}`} className="text-black underline">
            {EMAIL}
          </a>{" "}
          to be removed, or to ask what we hold on you.
        </p>
        <p>
          <strong>Changes.</strong> If this notice changes, the updated version goes
          here.
        </p>
        <p>
          <strong>Questions.</strong>{" "}
          <a href={`mailto:${EMAIL}`} className="text-black underline">
            {EMAIL}
          </a>
        </p>
      </div>
    </main>
  );
}

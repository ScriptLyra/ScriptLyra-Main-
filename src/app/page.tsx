import Hero from "@/components/Hero";
import Capabilities from "@/components/Capabilities";
import BookShowcase from "@/components/BookShowcase";
import AuthorsSection from "@/components/AuthorsSection";
import PublishTimeline from "@/components/PublishTimeline";
import JournalSection from "@/components/JournalSection";
import Manifesto from "@/components/Manifesto";
import CTASection from "@/components/CTASection";

export default function Home() {
  return (
    <>
      <Hero />
      <Capabilities />
      <BookShowcase />
      <AuthorsSection />
      <PublishTimeline />
      <JournalSection />
      <Manifesto />
      <CTASection />
    </>
  );
}

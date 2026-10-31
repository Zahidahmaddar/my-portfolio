import Hero from "@/components/site/Hero";
import Work from "@/components/site/Work";
import About from "@/components/site/About";
import Skills from "@/components/site/Skills";
import Contact from "@/components/site/Contact";
import { getPortfolioContent } from "@/lib/content";
import { CONTACT_EMAIL, DEFAULT_SUBTITLE, GITHUB_URL, LINKEDIN_URL, SITE_URL } from "@/lib/site";

// Admin edits refresh the page immediately through revalidatePath
export const revalidate = 3600;

export default async function Home() {
  const { projects, skills, settings } = await getPortfolioContent();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Zahid Farooq",
    jobTitle: settings?.heroSubtitle || DEFAULT_SUBTITLE,
    url: SITE_URL,
    email: `mailto:${CONTACT_EMAIL}`,
    sameAs: [GITHUB_URL, LINKEDIN_URL],
    knowsAbout: skills.map((s) => s.name),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Hero settings={settings} skills={skills} />
      <Work projects={projects} />
      <About
        settings={settings}
        projectCount={projects.length}
        skillCount={skills.length}
      />
      <Skills skills={skills} />
      <Contact />
    </>
  );
}

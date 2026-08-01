import { getPortfolioData } from "@/lib/api";
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { About } from "@/components/about";
import { Projects } from "@/components/projects";
import { Experience } from "@/components/experience";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { profile, projects, skills, experiences, stats } =
    await getPortfolioData();

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero profile={profile} />
        <About
          bio={profile.bio}
          stats={stats}
          skills={skills.map((s) => s.name)}
        />
        <Projects projects={projects} />
        <Experience experiences={experiences} />
        <Contact profile={profile} />
      </main>
      <Footer profile={profile} />
    </>
  );
}

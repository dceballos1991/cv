import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CommandMenu } from "@/components/command-menu";
import { Metadata } from "next";
import { Section } from "@/components/ui/section";
import { GlobeIcon, MailIcon, PhoneIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RESUME_DATA_ME as RESUME_DATA } from "@/data/resume-data";
import { ProjectCard } from "@/components/project-card";

export const metadata: Metadata = {
  title: `${RESUME_DATA.name} | ${RESUME_DATA.about}`,
  description: RESUME_DATA.summary,
};

export default function Page() {
  return (
    <main className="container relative mx-auto scroll-my-12 overflow-auto p-4 print:p-12 md:p-16">
      <section className="mx-auto w-full max-w-2xl space-y-8 bg-white print:space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 space-y-1.5">
            <h1 className="text-2xl font-bold">{RESUME_DATA.name}</h1>
            <p className="max-w-md text-pretty font-mono text-sm text-muted-foreground print:text-[12px]">
              {RESUME_DATA.position}
            </p>
            <p className="max-w-md items-center text-pretty font-mono text-xs text-muted-foreground">
              <a
                className="inline-flex gap-x-1.5 align-baseline leading-none hover:underline"
                href={RESUME_DATA.locationLink}
                target="_blank"
              >
                <GlobeIcon className="size-3" />
                {RESUME_DATA.location}
              </a>
            </p>
            <div className="flex gap-x-1 pt-1 font-mono text-sm text-muted-foreground print:hidden">
              {RESUME_DATA.contact.email ? (
                <Button
                  className="size-8"
                  variant="outline"
                  size="icon"
                  asChild
                >
                  <a href={`mailto:${RESUME_DATA.contact.email}`}>
                    <MailIcon className="size-4" />
                  </a>
                </Button>
              ) : null}
              {RESUME_DATA.contact.tel ? (
                <Button
                  className="size-8"
                  variant="outline"
                  size="icon"
                  asChild
                >
                  <a href={`tel:${RESUME_DATA.contact.tel}`}>
                    <PhoneIcon className="size-4" />
                  </a>
                </Button>
              ) : null}
              {RESUME_DATA.contact.social.map((social) => (
                <Button
                  key={social.name}
                  className="size-8"
                  variant="outline"
                  size="icon"
                  asChild
                >
                  <a href={social.url}>
                    <social.icon className="size-4" />
                  </a>
                </Button>
              ))}
            </div>
            <div className="hidden flex-col gap-x-1 font-mono text-sm text-muted-foreground print:flex print:text-[12px]">
              {RESUME_DATA.contact.email ? (
                <a href={`mailto:${RESUME_DATA.contact.email}`}>
                  <span className="underline">{RESUME_DATA.contact.email}</span>
                </a>
              ) : null}
              {RESUME_DATA.contact.tel ? (
                <a href={`tel:${RESUME_DATA.contact.tel}`}>
                  <span className="underline">{RESUME_DATA.contact.tel}</span>
                </a>
              ) : null}
            </div>
          </div>
        </div>
        <Section>
          <p className="text-pretty text-sm leading-none">Ernie Ball</p>
          <p className="text-pretty text-sm leading-none">53973 Polk St</p>
          <p className="text-pretty text-sm leading-none">
            Coachella, CA 92236
          </p>
        </Section>
        <Section>
          <p className="text-pretty text-sm leading-none">
            Dear Hiring Manager,
          </p>
          <br />
          <p className="text-pretty text-sm ">
            As a mechanical engineer with hands-on manufacturing experience and
            a musician who relies on Music Man basses strung with Ernie Ball
            strings, I am uniquely positioned to contribute to Ernie Ball's
            manufacturing excellence and continuous improvement initiatives.
          </p>
          <br />
          <p className="text-pretty text-sm ">
            At Wilorco, I reduced takt time by 15% by automating PCB conformal
            coating through an innovative stencil design. This hands-on
            experience with precision manufacturing processes aligns directly
            with Ernie Ball's reputation for consistent, high-quality string
            production. My background in tolerance stack-up analysis and GD&T
            would help maintain the tight tolerances required for reliable
            string winding and coating processes.
          </p>
          <br />
          <p className="text-pretty text-sm ">
            My background in software development enhances my approach to
            automation and quality control - I've developed data acquisition
            systems, automated documentation processes, and built user
            interfaces for real-time performance monitoring. This combination of
            mechanical and software expertise would help streamline Ernie Ball's
            manufacturing processes while maintaining the consistency that
            working musicians rely on. As a touring bassist, I've experienced
            firsthand how Music Man instruments and Ernie Ball strings perform
            under demanding conditions, giving me unique insight into quality
            assurance from both an engineer's and musician's perspective.{" "}
          </p>
          <br />
          <p className="text-pretty text-sm ">
            I look forward to discussing how my blend of mechanical engineering,
            software development expertise, and real-world experience with Ernie
            Ball and Music Man products could contribute to advancing your
            manufacturing capabilities.
          </p>
          <br />
          <p className="mb-8 text-pretty text-sm ">Sincerely,</p>
          <p className="text-pretty text-sm font-semibold ">David Ceballos</p>
        </Section>
      </section>
    </main>
  );
}

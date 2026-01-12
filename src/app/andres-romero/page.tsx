import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CommandMenu } from "@/components/command-menu";
import { Metadata } from "next";
import { Section } from "@/components/ui/section";
import { GlobeIcon, MailIcon, PhoneIcon, TrophyIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ANDRES_ROMERO_DATA } from "@/data/andres-romero";

export const metadata: Metadata = {
  title: `${ANDRES_ROMERO_DATA.name} | ${ANDRES_ROMERO_DATA.about}`,
  description: ANDRES_ROMERO_DATA.summary,
};

export default function Page() {
  return (
    <main className="container relative mx-auto scroll-my-12 overflow-auto p-4 print:px-3 print:py-0 md:p-16">
      <section className="mx-auto w-full max-w-3xl space-y-8 bg-white print:space-y-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex-1 space-y-1.5">
              <h1 className="text-2xl font-bold">
                {ANDRES_ROMERO_DATA.name}
                <span className="inline max-w-lg text-pretty font-mono text-sm print:hidden">
                  &nbsp;-&nbsp;{ANDRES_ROMERO_DATA.about}
                </span>
              </h1>

              <p className="max-w-lg text-pretty font-mono text-sm print:hidden">
                {ANDRES_ROMERO_DATA.aboutLong}
              </p>
              {/* Print only section */}
              <p className="hidden max-w-lg text-pretty font-mono text-sm print:block print:max-w-full print:text-[12px]">
                {ANDRES_ROMERO_DATA.aboutLong}
              </p>
              <div className="hidden w-full gap-x-6 pt-0 font-mono text-sm text-muted-foreground print:flex print:text-[12px]">
                <p className="items-center text-pretty font-mono text-xs text-muted-foreground">
                  <a
                    className="inline-flex gap-x-1.5 align-baseline leading-none hover:underline"
                    href={ANDRES_ROMERO_DATA.locationLink}
                    target="_blank"
                  >
                    <GlobeIcon className="size-3" />
                    {ANDRES_ROMERO_DATA.location}
                  </a>
                </p>
                {ANDRES_ROMERO_DATA.contact.email ? (
                  <a
                    href={`mailto:${ANDRES_ROMERO_DATA.contact.email}`}
                    className="inline-flex gap-x-1.5 align-baseline leading-none hover:underline"
                  >
                    <MailIcon className="size-3" />
                    {ANDRES_ROMERO_DATA.contact.email}
                  </a>
                ) : null}
                {ANDRES_ROMERO_DATA.contact.tel ? (
                  <a
                    href={`tel:${ANDRES_ROMERO_DATA.contact.tel}`}
                    className="inline-flex gap-x-1.5 align-baseline leading-none hover:underline"
                  >
                    <PhoneIcon className="size-3" />
                    {ANDRES_ROMERO_DATA.contact.tel}
                  </a>
                ) : null}
              </div>
              {/* Print only section - End*/}
              {/* Web only section */}
              <p className="max-w-md items-center text-pretty pt-1 font-mono text-xs text-muted-foreground print:hidden">
                <a
                  className="inline-flex gap-x-1.5 align-baseline leading-none hover:underline"
                  href={ANDRES_ROMERO_DATA.locationLink}
                  target="_blank"
                >
                  <GlobeIcon className="size-3" />
                  {ANDRES_ROMERO_DATA.location}
                </a>
              </p>
              <div className="flex items-center gap-x-1 font-mono text-sm text-muted-foreground print:hidden">
                {ANDRES_ROMERO_DATA.contact.email ? (
                  <Button
                    className="size-8"
                    variant="outline"
                    size="icon"
                    asChild
                  >
                    <a href={`mailto:${ANDRES_ROMERO_DATA.contact.email}`}>
                      <MailIcon className="size-4" />
                    </a>
                  </Button>
                ) : null}
                {ANDRES_ROMERO_DATA.contact.tel ? (
                  <Button
                    className="size-8"
                    variant="outline"
                    size="icon"
                    asChild
                  >
                    <a href={`tel:${ANDRES_ROMERO_DATA.contact.tel}`}>
                      <PhoneIcon className="size-4" />
                    </a>
                  </Button>
                ) : null}
                {ANDRES_ROMERO_DATA.contact.social.map((social) => (
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
            </div>

            {ANDRES_ROMERO_DATA.avatarUrl && (
              <Avatar className="size-28 print:hidden">
                <AvatarImage
                  alt={ANDRES_ROMERO_DATA.name}
                  src={ANDRES_ROMERO_DATA.avatarUrl}
                />
                <AvatarFallback>{ANDRES_ROMERO_DATA.initials}</AvatarFallback>
              </Avatar>
            )}
            {/* Web only section - End*/}
          </div>

          <p className="text-pretty pt-2 font-mono text-sm text-muted-foreground print:pt-0 print:text-[12px]">
            {ANDRES_ROMERO_DATA.summary}
          </p>
        </div>
        <div className="flex gap-x-8">
          <div className="flex flex-[2] flex-col">
            <Section>
              <h2 className="text-xl font-bold">Experience</h2>
              {ANDRES_ROMERO_DATA.work.map((work) => {
                return (
                  <Card key={work.company}>
                    <CardHeader>
                      <div className="flex items-center justify-between gap-x-2 text-base">
                        <h3 className="inline-flex items-center justify-center gap-x-1 font-semibold leading-none">
                          <a className="hover:underline" href={work.link}>
                            {work.company}
                          </a>

                          <span className="inline-flex gap-x-1">
                            {work.isRemote && (
                              <Badge
                                variant="secondary"
                                className="bg-transparent align-middle text-xs print:px-1 print:py-0.5 print:text-[8px] print:leading-tight"
                              >
                                Remote
                              </Badge>
                            )}
                          </span>
                        </h3>
                        <div className="text-sm tabular-nums text-gray-500">
                          {work.start} - {work.end ?? "Present"}
                        </div>
                      </div>

                      <h4 className="font-mono text-sm leading-none print:text-[12px]">
                        {work.title}
                      </h4>
                    </CardHeader>
                    <CardContent className="mt-2 text-xs print:text-[10px]">
                      {work.description}
                    </CardContent>
                    <span className="inline-flex flex-wrap gap-1">
                      {work.badges.map((badge) => (
                        <Badge
                          variant="secondary"
                          className="align-middle text-xs print:border-gray-200 print:px-1 print:py-0.5 print:text-[8px] print:leading-tight"
                          key={badge}
                        >
                          {badge}
                        </Badge>
                      ))}
                    </span>
                  </Card>
                );
              })}
            </Section>
          </div>
          <div className="flex flex-1 shrink-0 flex-col">
            <Section className="scroll-mb-16">
              <h2 className="text-xl font-bold">Highlights & Awards</h2>
              <div className="-mx-3 grid grid-cols-1 gap-3 print:grid-cols-1 print:gap-2 md:grid-cols-1 lg:grid-cols-1">
                {ANDRES_ROMERO_DATA.highlights.map((highlight) => {
                  return (
                    <Card
                      key={highlight.title}
                      className="flex flex-col overflow-hidden border border-muted p-3"
                    >
                      <CardHeader className="p-0">
                        <div className="flex items-center gap-2">
                          <TrophyIcon className="size-4 text-yellow-500" />
                          <h3 className="text-sm font-semibold leading-none">
                            {highlight.title}
                          </h3>
                        </div>
                      </CardHeader>
                      <CardContent className="mt-2 p-0 text-xs text-muted-foreground print:text-[10px]">
                        {highlight.description}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </Section>
          </div>
        </div>

        <Section>
          <h2 className="text-xl font-bold">Skills</h2>
          <div className="flex flex-wrap gap-1">
            {ANDRES_ROMERO_DATA.skills.map((skill) => {
              return (
                <Badge
                  className="print:border-gray-200 print:text-[10px]"
                  key={skill}
                >
                  {skill}
                </Badge>
              );
            })}
          </div>
        </Section>
      </section>

      <CommandMenu links={[]} />
    </main>
  );
}

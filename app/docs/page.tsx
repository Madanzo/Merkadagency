import { SectionHeader } from '@/components/marketing/section-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Zap, Code, FileText } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Documentation | MerkadAgency',
  description: 'Learn how to use MerkadAgency Studio to create stunning videos.',
};

const docSections = [
  {
    icon: Zap,
    title: 'Getting Started',
    description: 'Quick guide to creating your first video in under 5 minutes.',
    href: '#getting-started',
  },
  {
    icon: BookOpen,
    title: 'User Guide',
    description: 'Comprehensive walkthrough of all Studio features and workflows.',
    href: '#user-guide',
  },
  {
    icon: Code,
    title: 'API Reference',
    description: 'Integrate MerkadAgency into your applications and workflows.',
    href: '#api-reference',
  },
  {
    icon: FileText,
    title: 'Export Formats',
    description: 'Learn about MP4, FCPXML, and EDL exports for professional editing.',
    href: '#export-formats',
  },
];

export default function DocsPage() {
  return (
    <div className="container mx-auto px-6 pt-32 pb-24">
      <section className="mb-16">
        <SectionHeader
          title="Documentation"
          subtitle="Everything you need to know about creating videos with MerkadAgency Studio."
        />
      </section>

      <section className="mb-16 grid gap-6 md:grid-cols-2">
        {docSections.map((section) => {
          const Icon = section.icon;
          return (
            <Card
              key={section.title}
              className="border-violet/20 p-6 transition-colors hover:border-violet/50"
            >
              <div className="mb-4 inline-flex rounded-lg bg-violet/20 p-3">
                <Icon className="h-6 w-6 text-violet" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">{section.title}</h3>
              <p className="mb-4 text-sm text-graycool">{section.description}</p>
              <Link href={section.href}>
                <Button variant="ghost" className="text-violet hover:bg-violet/10">
                  Read More →
                </Button>
              </Link>
            </Card>
          );
        })}
      </section>

      <section id="getting-started" className="mb-16">
        <div className="glass-card rounded-xl p-8">
          <h2 className="mb-6 text-3xl font-bold text-white">Getting Started</h2>

          <div className="space-y-6 text-graycool">
            <div>
              <h3 className="mb-3 text-xl font-semibold text-white">1. Create a Project</h3>
              <p className="leading-relaxed">
                Navigate to the Studio and click "New Project". Give your project a descriptive
                title and provide a brief description of the video you want to create.
              </p>
            </div>

            <div>
              <h3 className="mb-3 text-xl font-semibold text-white">2. Review the Storyboard</h3>
              <p className="leading-relaxed">
                Our AI Director will analyze your brief and generate a professional storyboard with
                5-8 scenes. Each scene includes a visual description, duration, and suggested
                overlay text.
              </p>
            </div>

            <div>
              <h3 className="mb-3 text-xl font-semibold text-white">3. Generate Voice-Over</h3>
              <p className="leading-relaxed">
                Click "Generate VO" in the Voice Over tab to create natural-sounding narration for
                your video. The script is automatically generated based on your storyboard.
              </p>
            </div>

            <div>
              <h3 className="mb-3 text-xl font-semibold text-white">4. Add Music</h3>
              <p className="leading-relaxed">
                Select background music from our library in the Music tab. The music will
                automatically duck when voice-over plays for professional audio mixing.
              </p>
            </div>

            <div>
              <h3 className="mb-3 text-xl font-semibold text-white">5. Render & Export</h3>
              <p className="leading-relaxed">
                Hit "Render Video" to assemble your final MP4. You can also download FCPXML and EDL
                files for further editing in professional video editing software.
              </p>
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <Link href="/studio">
              <Button className="bg-gradient-to-tr from-violet to-purple-400 shadow-glow">
                Try Studio Now
              </Button>
            </Link>
            <Link href="/book">
              <Button variant="outline" className="border-violet/30 text-violet">
                Book a Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="rounded-xl bg-gradient-to-br from-violet/10 to-pink/5 p-8 text-center">
        <h2 className="mb-4 text-2xl font-bold text-white">Need More Help?</h2>
        <p className="mb-6 text-graycool">
          Our team is here to help you get the most out of MerkadAgency Studio.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/book">
            <Button className="bg-violet hover:bg-violet-light">Schedule a Call</Button>
          </Link>
          <a href="mailto:support@merkadagency.com">
            <Button variant="outline" className="border-violet/30 text-violet">
              Email Support
            </Button>
          </a>
        </div>
      </section>
    </div>
  );
}

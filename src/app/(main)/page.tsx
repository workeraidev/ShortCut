import Link from "next/link";
import type { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accessibility,
  Film,
  FileText,
  Library,
  Lightbulb,
  Swords,
  ArrowRight,
  TrendingUp,
  Send,
} from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "AI-Powered Toolkit for Viral YouTube Shorts | ShortCut",
  description:
    "Transform your long-form videos into viral YouTube Shorts with ShortCut. Our AI-powered toolkit helps you with video analysis, script generation, trend optimization, and more.",
};

const features = [
  {
    title: "Video Analysis",
    description: "Find viral moments & get key insights from any YouTube video.",
    icon: Film,
    href: "/analyze",
    badge: "Start Here",
  },
  {
    title: "Script Generation",
    description: "Create engaging scripts from video clips in seconds.",
    icon: FileText,
    href: "/script",
  },
  {
    title: "Trend Optimizer",
    description: "Optimize your shorts with trending topics, titles, and music.",
    icon: Lightbulb,
    href: "/optimize",
  },
  {
    title: "Series Planner",
    description: "Turn one long video into a strategic series of shorts.",
    icon: Library,
    href: "/series",
  },
  {
    title: "Competitor Analysis",
    description: "Analyze competitor content to find your unique advantage.",
    icon: Swords,
    href: "/competitors",
  },
  {
    title: "Accessibility",
    description: "Enhance your shorts with captions and localization.",
    icon: Accessibility,
    href: "/accessibility",
  },
];

export default function DashboardPage() {
  return (
    <div className="container mx-auto">
      <section className="py-12 text-center md:py-24">
        <Badge
          variant="outline"
          className="mb-4 border-primary/50 text-primary md:mb-6"
        >
          <TrendingUp className="mr-2 h-4 w-4" />
          Unleash Your Viral Potential
        </Badge>
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
          Create YouTube Shorts 10x Faster with AI
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-md text-muted-foreground md:mt-6 md:max-w-2xl md:text-lg">
          ShortCut is your AI co-pilot for turning long-form videos into
          engaging, viral shorts. Analyze, script, and optimize your content in
          minutes, not hours.
        </p>
        <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center md:mt-8">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/analyze">Get Started Now</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
            <Link href="#features">Learn More</Link>
          </Button>
        </div>
      </section>

      <section id="features" className="py-12 md:py-24">
        <PageHeader
          title="A Powerful Toolkit for Every Creator"
          description="Everything you need to go from long-form content to viral short-form sensation."
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Link href={feature.href} key={feature.href} className="group">
              <Card className="flex h-full transform-gpu flex-col transition-all duration-300 ease-in-out group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-primary/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <feature.icon className="h-8 w-8 text-primary" />
                    {feature.badge && (
                      <Badge variant="secondary">{feature.badge}</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex flex-grow flex-col">
                  <CardTitle className="mb-2 text-xl font-bold tracking-tight">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="flex-grow">
                    {feature.description}
                  </CardDescription>
                </CardContent>
                <CardContent>
                  <div className="flex items-center text-sm font-semibold text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    Go to {feature.title}{" "}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="my-16 rounded-lg bg-primary/10 p-6 text-center md:my-24 md:p-12">
        <div className="mx-auto max-w-2xl">
          <div className="mb-4 flex justify-center md:mb-6">
            <div className="rounded-full bg-primary/20 p-4">
              <Send className="h-6 w-6 text-primary md:h-8 md:w-8" />
            </div>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
            Join Our Community
          </h2>
          <p className="mt-4 text-md text-muted-foreground md:text-lg">
            Connect with other creators, get exclusive tips, and stay updated
            with the latest features. Join our official Telegram channel today!
          </p>
          <div className="mt-6 md:mt-8">
            <Button asChild size="lg">
              <Link href="https://t.me/drkingbd" target="_blank">
                Join on Telegram
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

import Link from "next/link";
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
} from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";

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
      <PageHeader
        title="Welcome to ShortCut"
        description="Your AI-powered toolkit for creating viral YouTube Shorts."
      />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <Link href={feature.href} key={feature.href} className="group">
            <Card className="flex h-full transform-gpu flex-col transition-all duration-300 ease-in-out group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-primary/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <feature.icon className="h-8 w-8 text-primary" />
                  {feature.badge && <Badge variant="secondary">{feature.badge}</Badge>}
                </div>
              </CardHeader>
              <CardContent className="flex flex-grow flex-col">
                <CardTitle className="mb-2 text-xl font-bold tracking-tight">
                  {feature.title}
                </CardTitle>
                <CardDescription className="flex-grow">{feature.description}</CardDescription>
              </CardContent>
              <CardContent>
                <div className="flex items-center text-sm font-semibold text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  Go to {feature.title} <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

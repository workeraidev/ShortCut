import Link from "next/link";
import {
  Card,
  CardContent,
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
  ArrowRight
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
        {features.map((feature) => (
          <Link href={feature.href} key={feature.href} className="group">
            <Card className="flex h-full flex-col transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl">
              <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center gap-3">
                  <feature.icon className="h-6 w-6 text-primary" />
                  <CardTitle className="text-lg font-semibold tracking-tight">
                    {feature.title}
                  </CardTitle>
                </div>
                {feature.badge && <Badge variant="secondary">{feature.badge}</Badge>}
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
              <CardContent>
                <div className="flex items-center text-sm font-medium text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100">
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

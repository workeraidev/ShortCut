"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Accessibility,
  Film,
  FileText,
  LayoutDashboard,
  Library,
  Lightbulb,
  Recycle,
  Sparkles,
  Swords,
  Youtube,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/ideas", label: "Idea Generation", icon: Sparkles },
  { href: "/analyze", label: "Video Analysis", icon: Film },
  { href: "/script", label: "Script Generation", icon: FileText },
  { href: "/optimize", label: "Trend Optimizer", icon: Lightbulb },
  { href: "/series", label: "Series Planner", icon: Library },
  { href: "/competitors", label: "Competitor Analysis", icon: Swords },
  { href: "/repurpose", label: "Repurpose Content", icon: Recycle },
  { href: "/accessibility", label: "Accessibility", icon: Accessibility },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2">
          <Youtube className="h-8 w-8 text-primary" />
          <span className="text-lg font-semibold">ShortCut</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === item.href
                : pathname.startsWith(item.href);
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  className="w-full justify-start"
                >
                  <Link href={item.href}>
                    <item.icon className="h-4 w-4" />
                    <span
                      className={cn(
                        "group-data-[collapsible=icon]:hidden",
                        "transition-opacity duration-300"
                      )}
                    >
                      {item.label}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}

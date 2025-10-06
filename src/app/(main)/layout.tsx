import Link from "next/link";
import { AppSidebar } from "@/components/app/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Send, Youtube } from "lucide-react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-col">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm sm:justify-end">
            <Link href="/" className="flex items-center gap-2 sm:hidden">
              <Youtube className="h-6 w-6 text-primary" />
              <span className="text-md font-semibold">ShortCut</span>
            </Link>
            <SidebarTrigger className="sm:hidden" />
          </header>
          <SidebarInset>
            <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
          </SidebarInset>
          <footer className="mt-auto border-t">
            <div className="container mx-auto flex h-16 flex-col items-center justify-center gap-4 px-4 sm:h-auto sm:flex-row sm:justify-between sm:py-4 lg:px-8">
              <p className="text-center text-sm text-muted-foreground sm:text-left">
                &copy; {new Date().getFullYear()} ShortCut. All rights reserved.
              </p>
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="https://t.me/drkingbd" target="_blank">
                    <Send className="mr-2 h-4 w-4" />
                    Contact
                  </Link>
                </Button>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
}

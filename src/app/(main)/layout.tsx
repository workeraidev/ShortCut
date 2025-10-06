import Link from "next/link";
import { AppSidebar } from "@/components/app/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

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
          <header className="sticky top-0 z-10 hidden h-14 items-center justify-end border-b bg-background/80 px-4 backdrop-blur-sm sm:flex">
            {/* Header content can go here */}
          </header>
          <SidebarInset>
            <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
          </SidebarInset>
          <footer className="mt-auto border-t">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
              <p className="text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} ShortCut. All rights reserved.
              </p>
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="https://t.me/drkingbd" target="_blank">
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

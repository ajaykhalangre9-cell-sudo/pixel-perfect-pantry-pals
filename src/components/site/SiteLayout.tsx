import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Brand } from "./Brand";
import { useAuth } from "@/lib/auth";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/donate", label: "Donate" },
  { to: "/food-rescue", label: "Food Rescue" },
  { to: "/volunteer", label: "Volunteer" },
  { to: "/about", label: "About" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Brand />
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
              activeProps={{ className: "text-foreground font-medium" }}
              activeOptions={{ exact: true }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          {user ? (
            <Button asChild><Link to="/app">Dashboard</Link></Button>
          ) : (
            <>
              <Button variant="ghost" asChild><Link to="/auth">Sign In</Link></Button>
              <Button asChild><Link to="/auth" search={{ mode: "signup" }}>Get Started</Link></Button>
            </>
          )}
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu"><Menu /></Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <nav className="mt-8 flex flex-col gap-1">
              {NAV.map((n) => (
                <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="rounded-md px-3 py-3 text-base hover:bg-accent">
                  {n.label}
                </Link>
              ))}
              <div className="mt-4 flex flex-col gap-2">
                {user ? (
                  <Button asChild><Link to="/app" onClick={() => setOpen(false)}>Dashboard</Link></Button>
                ) : (
                  <>
                    <Button variant="outline" asChild><Link to="/auth" onClick={() => setOpen(false)}>Sign In</Link></Button>
                    <Button asChild><Link to="/auth" search={{ mode: "signup" }} onClick={() => setOpen(false)}>Get Started</Link></Button>
                  </>
                )}
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t bg-cream">
      <div className="container-page grid gap-10 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <Brand />
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">Bridging Food. Ending Hunger. A food rescue and meal sponsorship platform for India.</p>
        </div>
        <div>
          <p className="text-sm font-semibold">Platform</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/how-it-works" className="hover:text-foreground">How it works</Link></li>
            <li><Link to="/food-rescue" className="hover:text-foreground">Food rescue</Link></li>
            <li><Link to="/volunteer" className="hover:text-foreground">Volunteer</Link></li>
            <li><Link to="/donate" className="hover:text-foreground">Donate</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold">Organisation</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-foreground">About</Link></li>
            <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
            <li><Link to="/privacy" className="hover:text-foreground">Privacy</Link></li>
            <li><Link to="/terms" className="hover:text-foreground">Terms</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t py-5 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} AnnaSetu</div>
    </footer>
  );
}

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}

export function InfoPage({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro: string; children: ReactNode }) {
  return (
    <SiteLayout>
      <section className="border-b bg-cream">
        <div className="container-page py-16 md:py-20">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-semibold md:text-5xl">{title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{intro}</p>
        </div>
      </section>
      <div className="container-page py-14">{children}</div>
    </SiteLayout>
  );
}

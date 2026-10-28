import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SiteLayout } from "@/components/site/SiteLayout";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  validateSearch: z.object({ mode: z.enum(["signin", "signup"]).optional() }),
  head: () => ({ meta: [{ title: "Sign in — AnnaSetu" }, { name: "description", content: "Sign in or create your AnnaSetu account." }, { property: "og:title", content: "Sign in — AnnaSetu" }, { property: "og:description", content: "Sign in or create your AnnaSetu account." }] }),
  component: AuthPage,
});

function AuthPage() {
  const { mode } = Route.useSearch();
  const [signup, setSignup] = useState(mode === "signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) return toast.error("Password must be at least 8 characters");
    setBusy(true);
    const res = signup
      ? await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin } })
      : await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (res.error) return toast.error(res.error.message);
    if (signup && !res.data.session) return toast.success("Check your email to confirm your account.");
    navigate({ to: "/app" });
  }
  return (
    <SiteLayout>
      <form onSubmit={submit} className="mx-auto my-16 max-w-sm space-y-4 rounded-xl border bg-card p-6">
        <h1 className="text-2xl font-semibold">{signup ? "Create account" : "Sign in"}</h1>
        <div><Label htmlFor="e">Email</Label><Input id="e" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        <div><Label htmlFor="p">Password</Label><Input id="p" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} /></div>
        <Button className="w-full" disabled={busy}>{busy ? "Please wait…" : signup ? "Sign up" : "Sign in"}</Button>
        <button type="button" className="text-sm text-primary" onClick={() => setSignup(!signup)}>{signup ? "Have an account? Sign in" : "New here? Create an account"}</button>
      </form>
    </SiteLayout>
  );
}

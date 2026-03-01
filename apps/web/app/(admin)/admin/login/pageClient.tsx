"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@temi/ui";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password }),
    }).catch(() => null);
    setLoading(false);
    if (!res || !res.ok) {
      setError("Invalid email or password");
      return;
    }
    router.push("/admin/dashboard");
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-md border border-(--border)/30 bg-transparent px-3 py-2 outline-none focus:border-(--text)"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm mb-1">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-md border border-(--border)/30 bg-transparent px-3 py-2 outline-none focus:border-(--text)"
        />
      </div>
      {error && (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
      <div className="pt-2">
        <Button type="submit" disabled={loading} magnetic={false}>
          {loading ? "Signing in..." : "Sign in"}
        </Button>
      </div>
    </form>
  );
}

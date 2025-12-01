import { apiFetch } from "@/lib/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAppContext } from "@/context/AppContext";
import { Mail } from "lucide-react";

const LoginPage = () => {
  const navigate = useNavigate();
  const { setUser } = useAppContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSocialLogin = (provider: string) => {
    // Mock social login
    const mockUser = {
      id: `user_${Date.now()}`,
      name: `User from ${provider}`,
      email: `user@${provider}.com`,
      createdAt: new Date(),
    };
    setUser(mockUser);
    navigate("/freelancer/dashboard");
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const data = await apiFetch("/api/auth/login/", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
    });

    // data = { access, refresh }
    localStorage.setItem("accessToken", data.access);
    localStorage.setItem("refreshToken", data.refresh);

    // Minimal user object for the UI
    const user = {
      id: email, // since backend didn't send id
      name: email.split("@")[0],
      email,
      createdAt: new Date(),
    };

    setUser(user);
    // Persist user for refresh durability
    try { localStorage.setItem("user", JSON.stringify(user)); } catch {}
    navigate("/freelancer/dashboard");
  } catch (err) {
    console.error("Login error", err);
    // TODO: show error message to user
  }
};

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md p-8">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold">Log in to FairFound</h1>
          <p className="text-muted-foreground">
            Ready for another day of leveling up?
          </p>
        </div>

        <div className="space-y-4">
          <Button
            variant="outline"
            className="w-full dark:hover:bg-cyan-600"
            onClick={() => handleSocialLogin("Google")}
          >
            <Mail className="mr-2 h-4 w-4" />
            Continue with Google
          </Button>
        </div>

        <div className="my-6 flex items-center">
          <Separator className="flex-1" />
          <span className="mx-4 text-sm text-muted-foreground">or log in with email</span>
          <Separator className="flex-1" />
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full dark:text-slate-950">
            Log in
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don’t have an account?{" "}
          <Button
            variant="link"
            className="p-0 h-auto font-normal"
            onClick={() => navigate("/dashboard/industry")}
          >
            Sign up
          </Button>
        </p>
      </Card>
    </div>
  );
};

export default LoginPage;
import { apiFetch } from "../../lib/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAppContext } from "@/context/AppContext";
import { Github, Mail } from "lucide-react";

const RegistrationPage = () => {
  const navigate = useNavigate();
  const { setUser } = useAppContext();
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSocialSignup = (provider: string) => {
    // Mock social signup
    const mockUser = {
      id: `user_${Date.now()}`,
      name: `User from ${provider}`,
      email: `user@${provider}.com`,
      createdAt: new Date(),
    };
    setUser(mockUser);
    navigate("/freelancer/dashboard");
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
      try {
      const data = await apiFetch("/api/auth/register/", {
        method: "POST",
        body: JSON.stringify({
          name: email.split("@")[0],
          email,
          password,
          username,
        }),
      });

      // adjust keys to match your backend response
      const user = {
          id: data.id ?? email,
          name: (data.name ?? name) || email.split("@")[0],
          email,
          createdAt: new Date(),
        };

        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
        navigate("/freelancer/dashboard");
    } catch (err) {
      console.error(err);
      // show a toast or inline error in real app
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md p-8">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold">Create your FairFound account</h1>
          <p className="text-muted-foreground">
            Unlock next-level career potential, all in<br />one place.
          </p>
        </div>

        {/* Hidden for now */}
        <div className="space-y-4 hidden">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => handleSocialSignup("Google")}
          >
            <Mail className="mr-2 h-4 w-4" />
            Continue with Google
          </Button>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => handleSocialSignup("GitHub")}
          >
            <Github className="mr-2 h-4 w-4" />
            Continue with GitHub
          </Button>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => handleSocialSignup("LinkedIn")}
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
            </svg>
            Continue with LinkedIn
          </Button>
        </div>

        {/* This separator is hidden for now as well */}
        <div className="my-6 hidden">
          <Separator className="flex-1" />
          <span className="mx-4 text-sm text-muted-foreground">or sign up with email</span>
          <Separator className="flex-1" />
        </div>

        <form onSubmit={handleEmailSignup} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="username">User Name</Label>
            <Input
              id="username"
              type="text"
              placeholder="Your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
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

          <Button type="submit" className="w-full">
            Continue
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Button
            variant="link"
            className="p-0 h-auto font-normal"
            onClick={() => navigate("/auth/login")}
          >
            Sign in
          </Button>
        </p>
      </Card>
    </div>
  );
};

export default RegistrationPage;

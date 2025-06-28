import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import StardustBackground from "@/components/StardustBackground";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  /* ------------------------------ SIGN‑UP ------------------------------ */
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: fullName,
        },
      },
    });

    setLoading(false);

    if (error) {
      toast({
        title: "Error during sign‑up",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success!",
        description: "Account created successfully. Check your inbox to verify your email.",
      });
    }
  };

  /* ------------------------------ SIGN‑IN ------------------------------ */
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      toast({
        title: "Error during sign‑in",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Welcome back!",
        description: "You've been successfully signed in.",
      });
      navigate("/");
    }
  };

  /* ------------------------- GOOGLE OAUTH FLOW ------------------------- */
  const handleSignInWithGoogle = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin, // after Google redirects back
      },
    });
    setLoading(false);

    if (error) {
      toast({
        title: "Google sign‑in failed",
        description: error.message,
        variant: "destructive",
      });
    }
    // on success Supabase will redirect automatically
  };

  /* -------------------------------------------------------------------- */
  return (
    <>
      <StardustBackground />
      <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-md">
          {/* TITLE */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground">MindScape</h1>
            <p className="text-muted-foreground">Your personal mindfulness companion</p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid grid-cols-2 mb-8 bg-card/80 backdrop-blur-sm">
              <TabsTrigger value="login">Log In</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            {/* ------------------------------ LOGIN ------------------------------ */}
            <TabsContent value="login">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Welcome back</CardTitle>
                  <CardDescription>
                    Sign in to your account to continue your mindfulness journey
                  </CardDescription>
                </CardHeader>

                {/* Google */}
                <CardContent className="space-y-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleSignInWithGoogle}
                    disabled={loading}
                  >
                    {loading ? "Please wait…" : "Log in as Google"}
                  </Button>
                </CardContent>

                {/* Email / password */}
                <form onSubmit={handleSignIn}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="bg-background/50 backdrop-blur-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="bg-background/50 backdrop-blur-sm"
                      />
                    </div>
                  </CardContent>

                  <CardFooter>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Signing in…" : "Sign In"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            {/* ---------------------------- REGISTER ---------------------------- */}
            <TabsContent value="register">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Create an account</CardTitle>
                  <CardDescription>
                    Join MindScape to begin your journey to mindfulness and well‑being
                  </CardDescription>
                </CardHeader>

                {/* Google */}
                <CardContent className="space-y-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleSignInWithGoogle}
                    disabled={loading}
                  >
                    {loading ? "Please wait…" : "Log in as Google"}
                  </Button>
                </CardContent>

                {/* Email / password */}
                <form onSubmit={handleSignUp}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        placeholder="John Doe"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        className="bg-background/50 backdrop-blur-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="registerEmail">Email</Label>
                      <Input
                        id="registerEmail"
                        type="email"
                        placeholder="your.email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="bg-background/50 backdrop-blur-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="registerPassword">Password</Label>
                      <Input
                        id="registerPassword"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="bg-background/50 backdrop-blur-sm"
                      />
                    </div>
                  </CardContent>

                  <CardFooter>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Creating account…" : "Create Account"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default Auth;

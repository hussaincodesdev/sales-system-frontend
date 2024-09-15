"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FormEvent, useEffect, useState } from "react";
import { useMutation } from "react-query";
import { postLogin } from "@/api/auth";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { redirect } from "next/navigation";
import useVerifyToken from "@/hooks/useVerifyToken";
import Loading from "@/components/Loading";

export default function Component() {
  const { setUserToken } = useAuth();
  const { data, isLoading } = useVerifyToken();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && !isLoading) {
      data ? redirect("/dashboard") : setUserToken("");
    }
  }, [data, isLoading, setUserToken, isClient]);

  if (!isClient || isLoading) return <Loading />;

  return <LoginPage />;
}

const LoginPage = () => {
  const { setUserToken } = useAuth();
  const { toast } = useToast();

  const loginMutation = useMutation(postLogin, {
    onSuccess: (data) => {
      if (data.token) {
        setUserToken(data.token);
        toast({
          title: data.message.title,
          description: data.message.description,
          variant: "success",
        });
      } else {
        toast({
          title: data.message.title,
          description: data.message.description,
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      console.error(error);
      toast({
        title: "An error occurred",
        description: "Please check your email and password and try again.",
        variant: "destructive",
      });
    },
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>
            Enter your email and password to access your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground"
                  prefetch={false}
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <CardFooter className="flex flex-col gap-2">
              <Button
                type="submit"
                className="w-full"
                disabled={loginMutation.isLoading}
              >
                {loginMutation.isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuthContext } from "@/contexts/auth-context";
import Link from "next/link";

const loginSchema = z.object({
  email: z
    .string({ message: "This field is required" })
    .email("Enter a valid email"),
  password: z
    .string({ message: "This field is required" })
    .min(8, "Password must be at least 8 characters"),
  rememberMe: z.boolean(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuthContext();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "admin@hotelier.com",
      password: "Admin@123",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    await login(data.email, data.password);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void form.handleSubmit(onSubmit)(e);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          void form.handleSubmit(onSubmit)();
        }
      }}
      className="space-y-4"
    >
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="admin@hotelier.com"
          {...form.register("email")}
          disabled={isLoading}
          className={form.formState.errors.email ? "border-red-500" : ""}
        />
        {form.formState.errors.email && (
          <p className="text-sm text-red-500">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            {...form.register("password")}
            disabled={isLoading}
            className={form.formState.errors.password ? "border-red-500" : ""}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
        {form.formState.errors.password && (
          <p className="text-sm text-red-500">
            {form.formState.errors.password.message}
          </p>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="remember"
          checked={useWatch({ control: form.control, name: "rememberMe" })}
          onCheckedChange={(checked) =>
            form.setValue("rememberMe", checked as boolean)
          }
          disabled={isLoading}
        />
        <Label htmlFor="remember" className="text-sm">
          Remember me
        </Label>
      </div>

      <Button
        type="button"
        className="w-full"
        disabled={isLoading}
        onClick={() => void form.handleSubmit(onSubmit)()}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          "Sign In"
        )}
      </Button>

      <div className="mt-6 text-center space-y-3">
        <Link
          href="/forgot-password"
          className="text-sm text-muted-foreground hover:text-primary underline-offset-4 hover:underline"
        >
          Forgot your password?
        </Link>
        <div className="border-t pt-3">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-primary underline-offset-4 hover:underline font-medium"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </form>
  );
}

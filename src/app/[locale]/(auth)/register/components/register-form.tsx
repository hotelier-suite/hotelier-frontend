"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Link, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { authService } from "@/lib/features/auth/service";
import { toast } from "sonner";

function createRegisterSchema(t: (key: string) => string) {
  return z
    .object({
      name: z
        .string({ message: t("fieldRequired") })
        .min(2, t("nameMin"))
        .max(100, t("nameMax")),
      email: z.string({ message: t("fieldRequired") }).email(t("validEmail")),
      phone: z
        .string({ message: t("fieldRequired") })
        .regex(/^(\+\d{1,3}[- ]?)?\d{10}$/, t("validPhone")),
      password: z
        .string({ message: t("fieldRequired") })
        .min(8, t("passwordMin"))
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
          t("passwordRequirements"),
        ),
      confirmPassword: z.string({ message: t("fieldRequired") }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("passwordsMismatch"),
      path: ["confirmPassword"],
    });
}

type RegisterFormData = z.infer<ReturnType<typeof createRegisterSchema>>;

export function RegisterForm() {
  const t = useTranslations("RegisterForm");
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const registerSchema = createRegisterSchema(t);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await authService.register({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
      });

      toast.success(t("registrationSuccess"), {
        description: t("registrationSuccessDesc"),
      });

      router.push("/login");
    } catch (error: unknown) {
      console.error("Registration error:", error);
      toast.error(t("registrationError"), {
        description: t("tryAgain"),
      });
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">{t("fullName")}</Label>
        <Input
          id="name"
          type="text"
          placeholder={t("fullNamePlaceholder")}
          {...form.register("name")}
          disabled={form.formState.isSubmitting}
          className={form.formState.errors.name ? "border-red-500" : ""}
        />
        {form.formState.errors.name && (
          <p className="text-sm text-red-500">
            {form.formState.errors.name.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">{t("email")}</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@email.com"
          {...form.register("email")}
          disabled={form.formState.isSubmitting}
          className={form.formState.errors.email ? "border-red-500" : ""}
        />
        {form.formState.errors.email && (
          <p className="text-sm text-red-500">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">{t("phone")}</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+1 300 123 4567"
          {...form.register("phone")}
          disabled={form.formState.isSubmitting}
          className={form.formState.errors.phone ? "border-red-500" : ""}
        />
        {form.formState.errors.phone && (
          <p className="text-sm text-red-500">
            {form.formState.errors.phone.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">{t("password")}</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder={t("passwordPlaceholder")}
            {...form.register("password")}
            disabled={form.formState.isSubmitting}
            className={form.formState.errors.password ? "border-red-500" : ""}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
            disabled={form.formState.isSubmitting}
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

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder={t("repeatPassword")}
            {...form.register("confirmPassword")}
            disabled={form.formState.isSubmitting}
            className={
              form.formState.errors.confirmPassword ? "border-red-500" : ""
            }
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            disabled={form.formState.isSubmitting}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
        {form.formState.errors.confirmPassword && (
          <p className="text-sm text-red-500">
            {form.formState.errors.confirmPassword.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={form.formState.isSubmitting}
      >
        {form.formState.isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t("creatingAccount")}
          </>
        ) : (
          t("createAccount")
        )}
      </Button>

      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          {t("haveAccount")}{" "}
          <Link
            href="/login"
            className="text-primary underline-offset-4 hover:underline font-medium"
          >
            {t("signInHere")}
          </Link>
        </p>
      </div>
    </form>
  );
}

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { HotelierLogo } from "@/components/hotelier-logo";
import { LoginForm } from "./components/login-form";
import { useTranslations } from "next-intl";

export default function LoginPage() {
  const t = useTranslations("LoginPage");
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1 text-center">
        <div className="flex items-center justify-center mb-6">
          <HotelierLogo variant="full" size="xl" showBackground={false} />
        </div>
        <CardTitle className="text-2xl">{t("signIn")}</CardTitle>
        <CardDescription>{t("enterCredentials")}</CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />

        <div className="mt-4 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground text-center mb-2">
            {t("testCredentials")}
          </p>
          <div className="space-y-2 text-xs">
            <div className="text-center">
              <strong>{t("superAdmin")}</strong> admin@hotelier.com / Admin@123
            </div>
            <div className="text-center">
              <strong>{t("manager")}</strong> manager@hotelier.com / Staff@123
            </div>
            <div className="text-center">
              <strong>{t("receptionist")}</strong> reception@hotelier.com /
              Staff@123
            </div>
            <div className="text-center">
              <strong>{t("guest")}</strong> guest@hotelier.com / Guest@123
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

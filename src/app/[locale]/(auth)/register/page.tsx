import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { HotelierLogo } from "@/components/hotelier-logo";
import { RegisterForm } from "./components/register-form";
import { useTranslations } from "next-intl";

export default function RegisterPage() {
  const t = useTranslations("RegisterPage");
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1 text-center">
        <div className="flex items-center justify-center mb-6">
          <HotelierLogo variant="full" size="xl" showBackground={false} />
        </div>
        <CardTitle className="text-2xl">{t("createAccount")}</CardTitle>
        <CardDescription>{t("joinHotelier")}</CardDescription>
      </CardHeader>
      <CardContent>
        <RegisterForm />
      </CardContent>
    </Card>
  );
}

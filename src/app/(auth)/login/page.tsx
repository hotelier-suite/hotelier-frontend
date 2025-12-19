import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { HotelierLogo } from "@/components/hotelier-logo";
import { LoginForm } from "./components/login-form";

export default function LoginPage() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1 text-center">
        <div className="flex items-center justify-center mb-6">
          <HotelierLogo variant="full" size="xl" showBackground={false} />
        </div>
        <CardTitle className="text-2xl">Sign In</CardTitle>
        <CardDescription>
          Enter your credentials to access the system
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />

        <div className="mt-4 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground text-center mb-2">
            Test credentials:
          </p>
          <div className="space-y-2 text-xs">
            <div className="text-center">
              <strong>Super Admin:</strong> admin@hotelier.com / Admin@123
            </div>
            <div className="text-center">
              <strong>Manager:</strong> manager@hotelier.com / Staff@123
            </div>
            <div className="text-center">
              <strong>Receptionist:</strong> reception@hotelier.com / Staff@123
            </div>
            <div className="text-center">
              <strong>Guest:</strong> guest@hotelier.com / Guest@123
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

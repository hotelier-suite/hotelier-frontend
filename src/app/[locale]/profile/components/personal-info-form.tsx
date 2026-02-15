"use client";

import { useTranslations } from "next-intl";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User, Mail, Phone, MapPin, Calendar, Save } from "lucide-react";

function createPersonalInfoSchema(t: (key: string) => string) {
  return z.object({
    name: z
      .string({ message: t("validationNameRequired") })
      .min(2, t("validationNameMin"))
      .max(100, t("validationNameMax")),
    email: z
      .string({ message: t("validationEmailRequired") })
      .email(t("validationEmailInvalid")),
    phone: z
      .string()
      .refine((val) => {
        if (!val || val.trim() === "") return true;
        const cleaned = val.replace(/[\s\-\(\)]/g, "");
        return /^(\+?\d{10,15})$/.test(cleaned);
      }, t("validationPhoneInvalid"))
      .optional()
      .or(z.literal("")),
    address: z
      .string()
      .max(200, t("validationAddressMax"))
      .optional()
      .or(z.literal("")),
    birthDate: z
      .string()
      .refine((val) => {
        if (!val || val.trim() === "") return true;
        const date = new Date(val);
        const today = new Date();
        return date <= today;
      }, t("validationBirthDateFuture"))
      .optional()
      .or(z.literal("")),
    bio: z
      .string()
      .max(500, t("validationBioMax"))
      .optional()
      .or(z.literal("")),
  });
}

type PersonalInfoFormData = z.infer<
  ReturnType<typeof createPersonalInfoSchema>
>;

interface PersonalInfoFormProps {
  initialData: PersonalInfoFormData;
  isSaving: boolean;
  onSave: (data: PersonalInfoFormData) => Promise<void>;
  onChange?: (data: Partial<PersonalInfoFormData>) => void;
}

export function PersonalInfoForm({
  initialData,
  isSaving,
  onSave,
  onChange,
}: PersonalInfoFormProps) {
  const t = useTranslations("PersonalInfoFormComp");

  const personalInfoSchema = createPersonalInfoSchema(t);

  const form = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      address: initialData?.address || "",
      birthDate: initialData?.birthDate || "",
      bio: initialData?.bio || "",
    },
  });

  useEffect(() => {
    form.reset(initialData);
  }, [initialData, form]);

  // Sync form values to parent whenever they change
  const formValues = useWatch({ control: form.control });

  useEffect(() => {
    if (onChange && formValues) {
      onChange(formValues as PersonalInfoFormData);
    }
  }, [formValues, onChange]);

  const onSubmit = async (data: PersonalInfoFormData) => {
    await onSave(data);
  };

  const nameValue = useWatch({ control: form.control, name: "name" });

  const getInitials = () => {
    const name = nameValue || initialData?.name || "";
    return name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-lg font-semibold bg-primary/10 text-primary" delayMs={0}>
                {getInitials()}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t("fullName")}</Label>
              <div className="relative">
                <User className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  {...form.register("name")}
                  disabled={isSaving}
                  className={`pl-8 ${form.formState.errors.name ? "border-red-500" : ""}`}
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t("email")}</Label>
              <div className="relative">
                <Mail className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  {...form.register("email")}
                  disabled={isSaving}
                  className={`pl-8 ${form.formState.errors.email ? "border-red-500" : ""}`}
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">{t("phone")}</Label>
              <div className="relative">
                <Phone className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  {...form.register("phone")}
                  disabled={isSaving}
                  className={`pl-8 ${form.formState.errors.phone ? "border-red-500" : ""}`}
                />
                {form.formState.errors.phone && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.phone.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthDate">{t("birthDate")}</Label>
              <div className="relative">
                <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="birthDate"
                  type="date"
                  {...form.register("birthDate")}
                  disabled={isSaving}
                  className={`pl-8 ${form.formState.errors.birthDate ? "border-red-500" : ""}`}
                />
                {form.formState.errors.birthDate && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.birthDate.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">{t("address")}</Label>
            <div className="relative">
              <MapPin className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="address"
                {...form.register("address")}
                disabled={isSaving}
                className={`pl-8 ${form.formState.errors.address ? "border-red-500" : ""}`}
              />
              {form.formState.errors.address && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.address.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">{t("bio")}</Label>
            <Textarea
              id="bio"
              {...form.register("bio")}
              disabled={isSaving}
              className={form.formState.errors.bio ? "border-red-500" : ""}
              rows={3}
            />
            {form.formState.errors.bio && (
              <p className="text-sm text-red-500">
                {form.formState.errors.bio.message}
              </p>
            )}
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSaving}>
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? t("saving") : t("saveChanges")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

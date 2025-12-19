"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User, Mail, Phone, MapPin, Calendar, Save } from "lucide-react";

const personalInfoSchema = z.object({
  name: z
    .string({ message: "Name is required" })
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),
  email: z
    .string({ message: "Email is required" })
    .email("Enter a valid email"),
  phone: z
    .string()
    .refine((val) => {
      if (!val || val.trim() === "") return true;
      // Allow formats like: +1234567890, +12-345-6789, 1234567890, etc.
      const cleaned = val.replace(/[\s\-\(\)]/g, "");
      return /^(\+?\d{10,15})$/.test(cleaned);
    }, "Enter a valid phone number (10-15 digits)")
    .optional()
    .or(z.literal("")),
  address: z
    .string()
    .max(200, "Address must be at most 200 characters")
    .optional()
    .or(z.literal("")),
  birthDate: z
    .string()
    .refine((val) => {
      if (!val || val.trim() === "") return true;
      const date = new Date(val);
      const today = new Date();
      return date <= today;
    }, "Birth date cannot be in the future")
    .optional()
    .or(z.literal("")),
  bio: z
    .string()
    .max(500, "Bio must be at most 500 characters")
    .optional()
    .or(z.literal("")),
});

type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;

interface PersonalInfoFormProps {
  initialData: PersonalInfoFormData;
  userAvatar?: string;
  isSaving: boolean;
  onSave: (data: PersonalInfoFormData) => Promise<void>;
  onChange?: (data: Partial<PersonalInfoFormData>) => void;
}

export function PersonalInfoForm({
  initialData,
  userAvatar,
  isSaving,
  onSave,
  onChange,
}: PersonalInfoFormProps) {
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
      .toUpperCase();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>
          Update your personal information and contact details
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={userAvatar || "/placeholder.svg"} />
              <AvatarFallback className="text-lg">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
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
              <Label htmlFor="email">Email</Label>
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
              <Label htmlFor="phone">Phone</Label>
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
              <Label htmlFor="birthDate">Birth Date</Label>
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
            <Label htmlFor="address">Address</Label>
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
            <Label htmlFor="bio">Bio</Label>
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
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

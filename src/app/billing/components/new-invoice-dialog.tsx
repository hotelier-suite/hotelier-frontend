"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Invoice, InvoiceConcept } from "@/lib/types";
import { billingService } from "@/lib/features/billing/service";
import { type ReservationBillingDetails } from "@/lib/features/reservations/types";
import { ReservationSelector } from "./reservation-selector";
import { BillingDetailsDisplay } from "./billing-details-display";

// Zod Schema for form validation
const createInvoiceSchema = z.object({
  reservationId: z
    .string({ message: "You must select a reservation" })
    .min(1, "Reservation is required"),

  issueDate: z
    .string({ message: "Issue date is required" })
    .min(1, "Issue date is required")
    .refine((date) => {
      // Validate that it's a valid date
      const dateObj = new Date(date);
      return !isNaN(dateObj.getTime());
    }, "Invalid date"),

  paymentMethod: z
    .enum([
      "CASH",
      "CREDIT_CARD",
      "DEBIT_CARD",
      "BANK_TRANSFER",
      "CHECK",
      "GIFT_CARD",
    ])
    .describe("Payment method is required"),
});

type CreateInvoiceFormData = z.infer<typeof createInvoiceSchema>;

interface NewInvoiceDialogProps {
  reservationsBillingData: ReservationBillingDetails[];
  loadingReservations: boolean;
  onInvoiceAdd: (invoice: Invoice) => void;
}

export function NewInvoiceDialog({
  reservationsBillingData,
  loadingReservations,
  onInvoiceAdd,
}: NewInvoiceDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedBillingData, setSelectedBillingData] =
    useState<ReservationBillingDetails | null>(null);

  // React Hook Form with Zod validation
  const form = useForm<CreateInvoiceFormData>({
    resolver: zodResolver(createInvoiceSchema),
    defaultValues: {
      reservationId: "",
      issueDate: "",
      paymentMethod: "CASH",
    },
  });

  const handleReservationSelect = (reservationId: string) => {
    const billingData = reservationsBillingData.find(
      (bd) => bd.reservation.id.toString() === reservationId,
    );

    if (billingData) {
      setSelectedBillingData(billingData);
      form.setValue("reservationId", reservationId);
    }
  };

  const onSubmit = async (data: CreateInvoiceFormData) => {
    if (!selectedBillingData) {
      toast("Error", {
        description: "You must select a valid reservation",
      });
      return;
    }

    // Auto-populate concepts with all charges
    const concepts: InvoiceConcept[] = [];

    // Add room charges
    if (selectedBillingData.roomCharges > 0) {
      concepts.push({
        description: `Room ${selectedBillingData.reservation.room?.number} - ${selectedBillingData.reservation.nights || 0} nights`,
        quantity: 1,
        price: Number(selectedBillingData.roomCharges),
      });
    }

    // Add room service charges
    selectedBillingData.roomServiceCharges.forEach((rs) => {
      concepts.push({
        description: `Room Service - ${rs.orderNumber}`,
        quantity: 1,
        price: Number(rs.total),
      });
    });

    // Add event charges
    selectedBillingData.eventCharges.forEach((evt) => {
      concepts.push({
        description: `Event: ${evt.title} - ${evt.attendees} people`,
        quantity: 1,
        price: Number(evt.total),
      });
    });

    // Calculate total
    const subtotal = concepts.reduce(
      (sum, concept) =>
        sum + (Number(concept.quantity) || 0) * (Number(concept.price) || 0),
      0,
    );

    try {
      // Calculate tax rate (e.g., 19% IVA)
      const taxRate = 0.19;
      const dueDate = new Date(data.issueDate);
      dueDate.setDate(dueDate.getDate() + 30); // Due in 30 days

      // Create invoice items from concepts
      const items = concepts.map((concept) => ({
        description: concept.description,
        quantity: concept.quantity,
        price: concept.price,
        total: concept.quantity * concept.price,
      }));

      // Create invoice with proper backend structure
      const invoiceData = {
        guestName: selectedBillingData.reservation.guestName || "",
        roomNumber: selectedBillingData.reservation.room?.number || "",
        issueDate: new Date(data.issueDate),
        dueDate: dueDate,
        subtotal: subtotal,
        taxes: subtotal * taxRate,
        total: subtotal * (1 + taxRate),
        reservationId: parseInt(data.reservationId),
        paymentMethod: data.paymentMethod,
        invoiceItems: items.map((item) => ({
          description: item.description,
          quantity: item.quantity,
          price: item.price,
          total: item.quantity * item.price,
        })),
      };

      // Send to backend
      const createdInvoice = await billingService.createInvoice(invoiceData);
      onInvoiceAdd(createdInvoice as Invoice);

      // Show success toast
      toast("Invoice Created", {
        description: `Invoice ${createdInvoice.number} for ${selectedBillingData.reservation.guestName} created successfully`,
      });

      // Reset form and close dialog
      handleClose();
    } catch (error) {
      console.error("Error creating invoice:", error);
      toast.error("Error", {
        description: "Could not create the invoice. Please try again.",
      });
    }
  };

  const handleClose = () => {
    form.reset();
    setSelectedBillingData(null);
    setOpen(false);
  };

  const handleCancel = () => {
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Invoice
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New Invoice</DialogTitle>
          <DialogDescription>
            Create a new invoice for a guest
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Reservation Selection */}
            <FormField
              control={form.control}
              name="reservationId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reservation with Guest</FormLabel>
                  <FormControl>
                    <ReservationSelector
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value);
                        handleReservationSelect(value);
                      }}
                      reservations={reservationsBillingData}
                      loading={loadingReservations}
                      roomNumber={
                        selectedBillingData?.reservation.room?.number || ""
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Issue Date */}
            <FormField
              control={form.control}
              name="issueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Issue Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Payment Method */}
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Method</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="CASH">Cash</SelectItem>
                      <SelectItem value="CREDIT_CARD">Credit Card</SelectItem>
                      <SelectItem value="DEBIT_CARD">Debit Card</SelectItem>
                      <SelectItem value="BANK_TRANSFER">
                        Bank Transfer
                      </SelectItem>
                      <SelectItem value="CHECK">Check</SelectItem>
                      <SelectItem value="GIFT_CARD">Gift Card</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Billing Details Display */}
            {selectedBillingData && (
              <BillingDetailsDisplay billingData={selectedBillingData} />
            )}

            {/* Action Buttons */}
            <DialogFooter className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  !form.formState.isValid || form.formState.isSubmitting
                }
              >
                Create Invoice
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

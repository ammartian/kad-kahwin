"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLandingStore } from "@/stores/landing-store";
import { scaleIn, fadeIn } from "@/lib/animations";
import { Check, Sparkles, Loader2, AlertCircle, X } from "lucide-react";

// Form validation schema
const waitlistSchema = z.object({
  email: z.string().min(1, "email_required").email("email_invalid"),
});

type WaitlistFormData = z.infer<typeof waitlistSchema>;

type SubmitStatus = "idle" | "loading" | "success" | "error";

export function WaitlistModal() {
  const { t } = useTranslation();
  const { isWaitlistModalOpen, closeWaitlistModal } = useLandingStore();
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
  const [submittedEmail, setSubmittedEmail] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WaitlistFormData>({
    resolver: zodResolver(waitlistSchema),
  });

  const onSubmit = async (data: WaitlistFormData) => {
    setSubmitStatus("loading");
    setSubmittedEmail(data.email);

    try {
      // Simulate API call - replace with actual Convex mutation later
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // For now, always succeed (will integrate with Convex later)
      setSubmitStatus("success");
      reset();
    } catch {
      setSubmitStatus("error");
    }
  };

  const handleClose = () => {
    closeWaitlistModal();
    // Reset form state after modal closes
    setTimeout(() => {
      setSubmitStatus("idle");
      reset();
    }, 300);
  };

  const getErrorMessage = (error: string) => {
    if (error === "email_required") return t("waitlist.error_email_required");
    if (error === "email_invalid") return t("waitlist.error_email_invalid");
    return error;
  };

  return (
    <Dialog open={isWaitlistModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md overflow-hidden">
        <AnimatePresence mode="wait">
          {submitStatus === "success" ? (
            // Success state
            <motion.div
              key="success"
              variants={scaleIn}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="py-6 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-chart-3/10 flex items-center justify-center"
              >
                <Check className="w-10 h-10 text-chart-3" />
              </motion.div>
              <h3 className="font-display text-2xl font-bold text-foreground mb-2">
                {t("waitlist.success_title")}
              </h3>
              <p className="text-muted-foreground mb-2">
                Your email ({submittedEmail}) is on the list.
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                {t("waitlist.success_message")}
              </p>
              <Button onClick={handleClose} variant="outline">
                Close
              </Button>
            </motion.div>
          ) : submitStatus === "error" ? (
            // Error state
            <motion.div
              key="error"
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="py-6 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-destructive/10 flex items-center justify-center"
              >
                <AlertCircle className="w-10 h-10 text-destructive" />
              </motion.div>
              <h3 className="font-display text-2xl font-bold text-foreground mb-2">
                {t("waitlist.error_title")}
              </h3>
              <p className="text-muted-foreground mb-6">
                {t("waitlist.error_message")}
              </p>
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={() => setSubmitStatus("idle")}
                  variant="outline"
                >
                  Try Again
                </Button>
                <Button onClick={handleClose} variant="ghost">
                  Close
                </Button>
              </div>
            </motion.div>
          ) : (
            // Form state
            <motion.div
              key="form"
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <DialogHeader className="text-center sm:text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <DialogTitle className="font-display text-2xl font-bold">
                  {t("waitlist.title")}
                </DialogTitle>
              </DialogHeader>

              <div className="mt-6">
                <p className="text-muted-foreground mb-4">
                  {t("waitlist.description")}
                </p>

                {/* Benefits list */}
                <ul className="space-y-3 mb-6">
                  {[
                    t("waitlist.benefit1"),
                    t("waitlist.benefit2"),
                    t("waitlist.benefit3"),
                  ].map((benefit, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-chart-3/10 flex items-center justify-center">
                        <Check className="w-3 h-3 text-chart-3" />
                      </div>
                      <span className="text-sm text-foreground">{benefit}</span>
                    </motion.li>
                  ))}
                </ul>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <Input
                      type="email"
                      placeholder={t("waitlist.email_placeholder")}
                      className={errors.email ? "border-destructive" : ""}
                      {...register("email")}
                      disabled={submitStatus === "loading"}
                    />
                    {errors.email && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-destructive mt-1"
                      >
                        {getErrorMessage(errors.email.message || "")}
                      </motion.p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={submitStatus === "loading"}
                  >
                    {submitStatus === "loading" ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      t("waitlist.cta")
                    )}
                  </Button>
                </form>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  {t("waitlist.fine_print")}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      </DialogContent>
    </Dialog>
  );
}

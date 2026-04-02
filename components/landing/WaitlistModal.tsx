"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
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
import { Check, Loader2, AlertCircle, X } from "lucide-react";
import Image from "next/image";
import {
  trackWaitlistFormOpened,
  trackWaitlistSubmitted,
} from "@/lib/posthog-events";

const waitlistSchema = z.object({
  email: z.string().min(1, "email_required").email("email_invalid"),
});

type WaitlistFormData = z.infer<typeof waitlistSchema>;

type SubmitStatus = "idle" | "loading" | "success" | "error";

export function WaitlistModal() {
  const { t } = useTranslation();
  const { isWaitlistModalOpen, closeWaitlistModal, waitlistModalTrigger } =
    useLandingStore();
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const addToWaitlist = useMutation(api.waitlist.addToWaitlist);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WaitlistFormData>({
    resolver: zodResolver(waitlistSchema),
  });

  useEffect(() => {
    if (isWaitlistModalOpen && waitlistModalTrigger) {
      trackWaitlistFormOpened(waitlistModalTrigger);
    }
  }, [isWaitlistModalOpen, waitlistModalTrigger]);

  const onSubmit = async (data: WaitlistFormData) => {
    setSubmitStatus("loading");
    setErrorMessage("");

    try {
      await addToWaitlist({
        email: data.email,
        source: waitlistModalTrigger || "landing-page",
      });

      const emailDomain = data.email.split("@")[1] || "unknown";

      trackWaitlistSubmitted({
        email_domain: emailDomain,
        trigger: waitlistModalTrigger || "hero",
      });

      setSubmitStatus("success");
      reset();
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Something went wrong";

      if (errorMsg.includes("already subscribed")) {
        setErrorMessage(
          t("waitlist.error_already_subscribed") || "Email already subscribed"
        );
      } else if (errorMsg.includes("Invalid email")) {
        setErrorMessage(
          t("waitlist.error_email_invalid") || "Invalid email format"
        );
      } else {
        setErrorMessage(errorMsg);
      }

      setSubmitStatus("error");
    }
  };

  const handleClose = () => {
    closeWaitlistModal();
    setTimeout(() => {
      setSubmitStatus("idle");
      setErrorMessage("");
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
      <DialogContent className="sm:max-w-md overflow-hidden border-border bg-card p-0" showCloseButton={false}>
        {/* Decorative background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-xl">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-2xl" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-accent/10 rounded-full blur-2xl" />
        </div>

        <div className="relative p-6">
          <AnimatePresence mode="wait">
            {submitStatus === "success" ? (
              <motion.div
                key="success"
                variants={scaleIn}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="py-4 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center"
                >
                  <Check className="w-10 h-10 text-primary" />
                </motion.div>
                <h3 className="font-landing text-2xl text-foreground mb-3">
                  {t("waitlist.success_title")}
                </h3>
                <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
                  {t("waitlist.success_message")}
                </p>
                <Button
                  onClick={handleClose}
                  className="px-8 rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  {t("waitlist.close")}
                </Button>
              </motion.div>
            ) : submitStatus === "error" ? (
              <motion.div
                key="error"
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="py-4 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-destructive/10 flex items-center justify-center"
                >
                  <AlertCircle className="w-10 h-10 text-destructive" />
                </motion.div>
                <h3 className="font-landing text-2xl text-foreground mb-3">
                  {t("waitlist.error_title")}
                </h3>
                <p className="text-muted-foreground mb-8 leading-relaxed text-sm">
                  {errorMessage || t("waitlist.error_message")}
                </p>
                <div className="flex gap-3 justify-center">
                  <Button
                    onClick={() => setSubmitStatus("idle")}
                    className="px-6 rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    {t("waitlist.try_again")}
                  </Button>
                  <Button
                    onClick={handleClose}
                    variant="ghost"
                    className="px-6 rounded-full"
                  >
                    {t("waitlist.close")}
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <DialogHeader className="text-center sm:text-center mb-6">
                  <div className="mx-auto mb-4 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center">
                    <Image src="/logo.jpeg" alt="Jemputan Digital" width={64} height={64} />
                  </div>
                  <DialogTitle className="font-landing text-2xl text-foreground leading-snug">
                    {t("waitlist.title")}
                  </DialogTitle>
                </DialogHeader>

                <p className="text-muted-foreground text-sm mb-5 text-center leading-relaxed">
                  {t("waitlist.description")}
                </p>

                {/* Benefits list */}
                <ul className="space-y-3 mb-6 bg-muted/40 rounded-xl p-4 border border-border">
                  {[t("waitlist.benefit1"), t("waitlist.benefit2")].map(
                    (benefit, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15 + index * 0.1 }}
                        className="flex items-center gap-3"
                      >
                        <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 text-primary" />
                        </div>
                        <span className="text-sm text-foreground font-medium">
                          {benefit}
                        </span>
                      </motion.li>
                    )
                  )}
                </ul>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                  <div>
                    <Input
                      type="email"
                      placeholder={t("waitlist.email_placeholder")}
                      className={`rounded-xl h-11 ${errors.email ? "border-destructive focus-visible:ring-destructive" : "border-border"}`}
                      {...register("email")}
                      disabled={submitStatus === "loading"}
                    />
                    {errors.email && (
                      <motion.p
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-destructive mt-1.5 ml-1"
                      >
                        {getErrorMessage(errors.email.message || "")}
                      </motion.p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11 rounded-full text-base font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                    disabled={submitStatus === "loading"}
                  >
                    {submitStatus === "loading" ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {t("waitlist.loading") || "Loading..."}
                      </>
                    ) : (
                      t("waitlist.cta")
                    )}
                  </Button>
                </form>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  {t("waitlist.fine_print")}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 z-10 w-8 h-8 rounded-lg bg-muted/60 flex items-center justify-center opacity-70 hover:opacity-100 hover:bg-muted transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      </DialogContent>
    </Dialog>
  );
}

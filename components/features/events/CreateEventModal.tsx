"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toSlug } from "@/lib/utils/slug";
import {
  createEventSchema,
  type CreateEventFormData,
} from "@/lib/validators/event";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { useSlugCheck } from "@/hooks/use-slug-check";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { siteConfig } from "@/lib/config";
import { Check, Loader2, AlertCircle } from "lucide-react";

type SubmitStatus = "idle" | "loading" | "success" | "error";

interface CreateEventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

function resetFormState(
  setSubmitStatus: (s: SubmitStatus) => void,
  setErrorMessage: (s: string) => void,
  setInvitedEmail: (s: string | null) => void,
  reset: () => void
) {
  setSubmitStatus("idle");
  setErrorMessage("");
  setInvitedEmail(null);
  reset();
}

export function CreateEventModal({
  open,
  onOpenChange,
  onSuccess,
}: CreateEventModalProps) {
  const { t } = useTranslation();
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [invitedEmail, setInvitedEmail] = useState<string | null>(null);

  const isMobile = useIsMobile(640);

  const createEvent = useMutation(api.events.createEvent);
  const inviteCoManager = useMutation(api.events.inviteCoManager);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<CreateEventFormData>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      coupleName: "",
      weddingDate: "",
      weddingTime: "",
      slug: "",
      rsvpDeadline: "",
      coManagerEmail: "",
    },
  });

  const coupleName = watch("coupleName");
  const slug = watch("slug");

  const { slugStatus } = useSlugCheck(slug);

  useEffect(() => {
    if (!slug && coupleName) {
      const generated = toSlug(coupleName);
      if (generated) setValue("slug", generated);
    }
  }, [coupleName, slug, setValue]);

  const resetState = useCallback(() => {
    setTimeout(() => {
      resetFormState(setSubmitStatus, setErrorMessage, setInvitedEmail, reset);
    }, 300);
  }, [reset]);

  const handleClose = useCallback(() => {
    onOpenChange(false);
    resetState();
  }, [onOpenChange, resetState]);

  const handleOpenChange = useCallback(
    (next: boolean) => {
      onOpenChange(next);
      if (!next) resetState();
    },
    [onOpenChange, resetState]
  );

  const onSubmit = async (data: CreateEventFormData) => {
    setSubmitStatus("loading");
    setErrorMessage("");

    try {
      const eventId = await createEvent({
        coupleName: data.coupleName.trim(),
        weddingDate: data.weddingDate,
        weddingTime: data.weddingTime || undefined,
        slug: data.slug.toLowerCase().trim(),
        rsvpDeadline: data.rsvpDeadline || undefined,
      });

      const email = data.coManagerEmail?.trim();
      if (email) {
        await inviteCoManager({ eventId, email });
        setInvitedEmail(email);
      } else {
        setInvitedEmail(null);
      }

      setSubmitStatus("success");
      onSuccess?.();
    } catch (error) {
      const msg = error instanceof Error ? error.message : t("event_creation.error_generic");
      setErrorMessage(msg);
      setSubmitStatus("error");
    }
  };

  const slugAlternatives =
    slugStatus === "taken" && slug
      ? [`${slug.toLowerCase().trim()}-1`, `${slug.toLowerCase().trim()}-2`]
      : [];

  const formContent = (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
      id="create-event-form"
    >
      <div className="space-y-2">
        <label htmlFor="coupleName" className="text-sm font-medium">
          {t("event_creation.couple_name")}
        </label>
        <Input
          id="coupleName"
          placeholder={t("event_creation.couple_name_placeholder")}
          className="min-h-[44px]"
          {...register("coupleName")}
          disabled={submitStatus === "loading"}
          aria-invalid={!!errors.coupleName}
        />
        {errors.coupleName && (
          <p className="text-sm text-destructive">{errors.coupleName.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="weddingDate" className="text-sm font-medium">
            {t("event_creation.wedding_date")}
          </label>
          <Input
            id="weddingDate"
            type="date"
            min={new Date().toISOString().split("T")[0]}
            className="min-h-[44px]"
            {...register("weddingDate")}
            disabled={submitStatus === "loading"}
            aria-invalid={!!errors.weddingDate}
          />
          {errors.weddingDate && (
            <p className="text-sm text-destructive">{errors.weddingDate.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <label htmlFor="weddingTime" className="text-sm font-medium">
            {t("event_creation.wedding_time")}
          </label>
          <Input
            id="weddingTime"
            type="time"
            placeholder={t("event_creation.wedding_time_placeholder")}
            className="min-h-[44px]"
            {...register("weddingTime")}
            disabled={submitStatus === "loading"}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="slug" className="text-sm font-medium">
          {t("event_creation.slug")}
        </label>
        <div className="relative">
          <Input
            id="slug"
            placeholder={t("event_creation.slug_placeholder")}
            className="min-h-[44px] pr-20"
            {...register("slug")}
            disabled={submitStatus === "loading"}
            aria-invalid={!!errors.slug || slugStatus === "taken" || slugStatus === "invalid"}
          />
          {slugStatus === "checking" && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
              {t("event_creation.slug_checking")}
            </span>
          )}
          {slugStatus === "available" && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-green-600 flex items-center gap-1">
              <Check className="size-3.5" />
              {t("event_creation.slug_available")}
            </span>
          )}
          {slugStatus === "taken" && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-destructive">
              {t("event_creation.slug_taken")}
            </span>
          )}
          {slugStatus === "invalid" && slug && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-destructive">
              {t("event_creation.slug_invalid")}
            </span>
          )}
        </div>
        {slugStatus === "taken" && slugAlternatives.length > 0 && (
          <p className="text-xs text-muted-foreground">
            {t("event_creation.slug_suggest")}:{" "}
            {slugAlternatives.map((alt) => (
              <button
                key={alt}
                type="button"
                onClick={() => setValue("slug", alt)}
                className="text-xs text-primary hover:underline font-medium mr-1"
              >
                {alt}
              </button>
            ))}
          </p>
        )}
        {slug && (
          <p className="text-xs text-muted-foreground truncate" title={`${siteConfig.url}/${slug.toLowerCase().trim()}`}>
            {t("event_creation.url_preview")}: {siteConfig.url}/{slug.toLowerCase().trim()}
          </p>
        )}
        {errors.slug && (
          <p className="text-sm text-destructive">{errors.slug.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="rsvpDeadline" className="text-sm font-medium">
          {t("event_creation.rsvp_deadline")}
        </label>
        <Input
          id="rsvpDeadline"
          type="date"
          className="min-h-[44px]"
          {...register("rsvpDeadline")}
          disabled={submitStatus === "loading"}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="coManagerEmail" className="text-sm font-medium">
          {t("event_creation.co_manager_email")}
        </label>
        <Input
          id="coManagerEmail"
          type="email"
          placeholder={t("event_creation.co_manager_email_placeholder")}
          className="min-h-[44px]"
          {...register("coManagerEmail")}
          disabled={submitStatus === "loading"}
          aria-invalid={!!errors.coManagerEmail}
        />
        {errors.coManagerEmail && (
          <p className="text-sm text-destructive">{errors.coManagerEmail.message}</p>
        )}
      </div>
    </form>
  );

  const statusContent =
    submitStatus === "success" ? (
      <div className="flex flex-col gap-4 py-4">
        <div className="flex items-center gap-2 text-green-600">
          <Check className="size-5" />
          <span className="font-medium">{t("event_creation.success_title")}</span>
        </div>
        <p className="text-sm text-muted-foreground">
          {t("event_creation.success_message")}
        </p>
        {invitedEmail && (
          <p className="text-sm text-green-600">
            {t("event_creation.invitation_sent", { email: invitedEmail })}
          </p>
        )}
        <Button onClick={handleClose} className="w-full min-h-[44px]">
          {t("waitlist.close")}
        </Button>
      </div>
    ) : submitStatus === "error" ? (
      <div className="flex flex-col gap-4 py-4">
        <div className="flex items-center gap-2 text-destructive">
          <AlertCircle className="size-5" />
          <span className="font-medium">{t("waitlist.error_title")}</span>
        </div>
        <p className="text-sm text-muted-foreground">{errorMessage}</p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setSubmitStatus("idle")}
            className="flex-1 min-h-[44px]"
          >
            {t("waitlist.try_again")}
          </Button>
          <Button onClick={handleClose} variant="ghost" className="flex-1 min-h-[44px]">
            {t("waitlist.close")}
          </Button>
        </div>
      </div>
    ) : null;

  const footerContent =
    submitStatus === "idle" || submitStatus === "loading" ? (
      <Button
        type="submit"
        form="create-event-form"
        className="w-full min-h-[44px]"
        disabled={
          submitStatus === "loading" ||
          slugStatus === "checking" ||
          slugStatus === "taken" ||
          slugStatus === "invalid"
        }
      >
        {submitStatus === "loading" ? (
          <>
            <Loader2 className="size-4 animate-spin mr-2" />
            {t("event_creation.submitting")}
          </>
        ) : (
          t("event_creation.submit")
        )}
      </Button>
    ) : null;

  const modalTitle = t("event_creation.title");

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={handleOpenChange}>
        <SheetContent
          side="bottom"
          className="max-h-[90vh] overflow-y-auto rounded-t-xl"
          showCloseButton={true}
        >
          <SheetHeader>
            <SheetTitle>{modalTitle}</SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-4 pb-4">
            {statusContent ?? formContent}
          </div>
          {footerContent && (
            <SheetFooter className="border-t pt-4">{footerContent}</SheetFooter>
          )}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{modalTitle}</DialogTitle>
          <DialogDescription className="sr-only">
            {t("event_creation.couple_name")}, {t("event_creation.wedding_date")},{" "}
            {t("event_creation.slug")}
          </DialogDescription>
        </DialogHeader>
        {statusContent ?? formContent}
        {footerContent && <DialogFooter>{footerContent}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
}

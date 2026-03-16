import { GuestInvitationPage } from "@/components/features/guest/GuestInvitationPage";

interface GuestPageProps {
  params: Promise<{ slug: string }>;
}

export default async function GuestPage({ params }: GuestPageProps) {
  const { slug } = await params;
  return <GuestInvitationPage slug={slug} />;
}

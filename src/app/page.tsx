import type { Metadata } from "next";
import {
  Navbar,
  Hero,
  Features,
  HowItWorks,
  CTA,
  Footer,
} from "@/fe/module/landingPage/components";

export const metadata: Metadata = {
  title:
    "ContactKaro - Privacy and Security at its Best | ContactKaro Vehicle Parking Tag",
  description:
    "Get your ContactKaro Tag today. Keep your contact details private while staying connected. Masked calls, SMS, WhatsApp and Emergency help for vehicle parking.",
  keywords:
    "vehicle parking tag, car ContactKaro tag, QR code parking, masked calls, privacy, ContactKaro",
};

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-black selection:bg-yellow-200 selection:text-black">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <CTA />
      <Footer />
    </main>
  );
}

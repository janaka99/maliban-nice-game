import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { LanguageProvider } from "@/context/language/LanguageContext";
import { MultistepFormProvider } from "@/context/steps/multistepsContext";
import { Toaster } from "@/components/ui/toaster";
import { UserProvider } from "@/context/user/userContext";
import LandingImage from "Landing.png";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Maliban Game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head></head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-[100svh] w-screen overflow-x-hidden`}
        style={{
          backgroundImage: "url(Landing.png)",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <LanguageProvider>
          <UserProvider>
            <MultistepFormProvider initialStepIndex={0}>
              {children}
            </MultistepFormProvider>
          </UserProvider>
        </LanguageProvider>
        <Toaster />
        <p className="text-center text-[9px] text-white  pt-10 pb-2">
          AI Solution By{" "}
          <a href="https://www.linkedin.com/company/arts-lab-creatives">
            Artslab Creatives
          </a>
        </p>
      </body>
    </html>
  );
}

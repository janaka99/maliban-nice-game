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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1560558655341594');
fbq('track', 'PageView');
            `,
          }}
        />
        {/* <!-- Meta Pixel Code --> */}

        <noscript>
          <img
            height="1"
            width="1"
            style={{
              display: "none",
            }}
            src="https://www.facebook.com/tr?id=1560558655341594&ev=PageView&noscript=1"
          />
        </noscript>
        {/* <!-- End Meta Pixel Code --> */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-[100svh] w-screen overflow-x-hidden`}
        style={{
          backgroundImage: "url(Landing.png)",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <div className="w-screen h-screen flex justify-center items-center text-white">
          Game is over!
        </div>
        {/* <LanguageProvider>
          <UserProvider>
            <MultistepFormProvider initialStepIndex={0}>
              {children}
            </MultistepFormProvider>
          </UserProvider>
        </LanguageProvider>
        <Toaster /> */}
        {/* <p className="text-center text-[9px] text-white  pt-10 pb-2">
          AI Solution By{" "}
          <a href="https://www.linkedin.com/company/arts-lab-creatives">
            Artslab Creatives
          </a>
        </p> */}
      </body>
    </html>
  );
}

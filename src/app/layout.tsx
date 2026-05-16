import type { Metadata } from "next";
import { Fredoka, Lilita_One } from "next/font/google";
import "./globals.css";
import { IntlClientProvider } from "./i18n/IntlClientProvider";

const fredoka = Fredoka({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const lilitaOne = Lilita_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-lilita",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Birthday",
  description: "Press the right button.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fredoka.variable} ${lilitaOne.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <IntlClientProvider>{children}</IntlClientProvider>
      </body>
    </html>
  );
}

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SidebarProvider } from "./components/context/SidebarContext";
import { ThemeProvider } from "./components/context/ThemeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Apex Home Outlet",
  description: "Up to 25% Off ALL items plus FREE 3D Kitchen Design. Over 15yrs of experience in Kitchen Cabinets, Quartz &amp; Granite Countertops * Location in Fresno, Clovis, Los Angeles, Gardena, Carson, San Marcos, San Diego, Bakersfield.git ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <SidebarProvider>{children}</SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

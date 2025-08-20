import { RoomProvider } from "./context/RoomProvider";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={roboto.className}>
      <RoomProvider>
        <body className="w-screen h-screen">{children}</body>
      </RoomProvider>
    </html>
  );
}

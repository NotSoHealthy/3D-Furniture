import { RoomProvider } from "./context/RoomProvider";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <RoomProvider>
        <body className="w-screen h-screen">{children}</body>
      </RoomProvider>
    </html>
  );
}

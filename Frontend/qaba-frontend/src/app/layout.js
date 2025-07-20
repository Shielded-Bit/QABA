import "./globals.css";
import ClientLayout from "./ClientLayout";

export const metadata = {
  title: 'QABA - Real Estate Platform',
  description: 'Find your perfect property with QABA',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground" suppressHydrationWarning>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}

import "./globals.css";

export const metadata = {
  title: "For my Dearest Dishu",
  description: "A private gratitude book for Dishu."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

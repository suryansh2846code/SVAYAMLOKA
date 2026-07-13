import "./globals.css";
import { world } from "./site.config";

export const metadata = {
  title: `${world.name} — ${world.player}`,
  description: world.subtitle,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

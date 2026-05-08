import type { Metadata } from "next";
import "./globals.css";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getCart } from '@/app/actions/cart';
import CartSidebar from '@/components/CartSidebar';
import { getLocale } from '@/app/actions/locale';
import { t } from '@/lib/i18n';

export const metadata: Metadata = {
  title: "OTO GEORGIA",
  description: "პრემიუმ ხარისხის ავტონაწილები, აკუმულატორები და ძრავის ზეთები",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cart = await getCart();
  const totalItems = cart.items.reduce((acc: number, item: any) => acc + item.quantity, 0);
  const locale = await getLocale();

  return (
    <html lang={locale}>
      <body>
        <Navbar cartItemCount={totalItems} locale={locale} />
        <main style={{ flex: 1 }}>{children}</main>
        <Footer locale={locale} />
        <CartSidebar items={cart.items} locale={locale} />
      </body>
    </html>
  );
}

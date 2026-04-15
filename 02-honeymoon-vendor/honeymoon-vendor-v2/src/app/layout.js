import './globals.css';
import Providers from '../components/Providers';
import { VendorAuthProvider } from '../context/auth';

export const metadata = { title: 'HoneyMoon Vendor', description: 'Vendor Dashboard' };

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers><VendorAuthProvider>{children}</VendorAuthProvider></Providers>
      </body>
    </html>
  );
}

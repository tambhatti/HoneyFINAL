import './globals.css';
import Providers from '../components/Providers';
import { UserAuthProvider } from '../context/auth';

export const metadata = { title: 'HoneyMoon', description: 'Luxury Emirati Weddings' };

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers><UserAuthProvider>{children}</UserAuthProvider></Providers>
      </body>
    </html>
  );
}

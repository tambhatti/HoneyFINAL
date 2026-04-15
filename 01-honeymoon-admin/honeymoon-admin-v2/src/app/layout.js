import './globals.css';
import Providers from '../components/Providers';
import { AdminAuthProvider } from '../context/auth';

export const metadata = { title: 'HoneyMoon — Admin', description: 'HoneyMoon Admin Control Panel' };

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers><AdminAuthProvider>{children}</AdminAuthProvider></Providers>
      </body>
    </html>
  );
}

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F5F5EF] flex items-center justify-center px-4">
      <div className="text-center">
        <p className="font-baskerville text-8xl text-[#174a37] mb-4">404</p>
        <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-2">Page Not Found</h2>
        <p className="text-black/40 mb-6">The page you're looking for doesn't exist.</p>
        <Link href="/" className="bg-[#174a37] text-white px-6 py-3 rounded-full font-medium hover:bg-[#1a5c45] transition-colors">
          Go Home
        </Link>
      </div>
    </div>
  );
}

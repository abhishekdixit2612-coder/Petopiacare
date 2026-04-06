import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard | PetopiaCare',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-root min-h-screen bg-gray-100 font-secondary">
      {children}
    </div>
  );
}

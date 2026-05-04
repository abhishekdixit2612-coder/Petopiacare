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
    <div className="admin-root min-h-screen bg-neutral-100 font-body">
      {children}
    </div>
  );
}

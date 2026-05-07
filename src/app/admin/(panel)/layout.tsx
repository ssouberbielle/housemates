import { redirect } from 'next/navigation';
import { getAdminUser } from '@/lib/auth/admin';
import { Sidebar } from '@/components/admin/sidebar';
import { Header } from '@/components/admin/header';

export const metadata = { title: 'Admin — HOUSE MATES' };

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getAdminUser();
  if (!admin) redirect('/admin/login');

  return (
    <div className="flex h-screen bg-[#0f0f0f] text-bone">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header admin={admin} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}

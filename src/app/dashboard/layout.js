import Navbar from '@/components/Navbar';

export default function DashboardLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="dashboard-main">
        {children}
      </main>
    </>
  );
}
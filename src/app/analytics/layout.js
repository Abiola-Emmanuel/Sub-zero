import Navbar from '@/components/Navbar';

export default function AnalyticsLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="analytics-main">
        {children}
      </main>
    </>
  );
}
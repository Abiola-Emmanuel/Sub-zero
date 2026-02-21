import Navbar from '@/components/Navbar';

export default function CalendarLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="calendar-main">
        {children}
      </main>
    </>
  );
}
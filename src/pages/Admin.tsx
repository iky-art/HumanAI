import StatsGrid from '../components/StatsGrid';
import PendingApplications from '../components/PendingApplications';
import WaUserPanel from '../components/WaUserPanel';
import BroadcastPanel from '../components/BroadcastPanel';

export default function Admin() {
  return (
    <main className="mx-auto max-w-4xl space-y-6 px-6 py-10 md:px-12">
      <h1 className="font-display text-2xl">Admin Panel</h1>
      <StatsGrid />
      <PendingApplications />
      <WaUserPanel masked />
      <BroadcastPanel />
    </main>
  );
}

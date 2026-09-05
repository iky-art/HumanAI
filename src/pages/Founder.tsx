import { Link } from 'react-router-dom';
import StatsGrid from '../components/StatsGrid';
import PendingApplications from '../components/PendingApplications';
import WaUserPanel from '../components/WaUserPanel';
import BroadcastPanel from '../components/BroadcastPanel';

export default function Founder() {
  return (
    <main className="mx-auto max-w-4xl space-y-6 px-6 py-10 md:px-12">
      <h1 className="font-display text-2xl">Founder Panel</h1>
      <p className="text-sm text-ash-500">
        Founder punya akses penuh — termasuk{' '}
        <Link to="/operator" className="text-signal-blue underline underline-offset-2">
          Operator Panel
        </Link>{' '}
        buat langsung menjawab percakapan kalau perlu.
      </p>

      <StatsGrid />
      <PendingApplications />
      <WaUserPanel masked={false} />
      <BroadcastPanel />
    </main>
  );
}

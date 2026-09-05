import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { fetchAllProfiles } from '../lib/profiles';

export default function StatsGrid() {
  const [stats, setStats] = useState({ users: 0, operators: 0, pending: 0, active: 0, completed: 0 });

  useEffect(() => {
    async function load() {
      const profiles = await fetchAllProfiles();
      const { count: active } = await supabase
        .from('conversations')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'active');
      const { count: completed } = await supabase
        .from('conversations')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'completed');

      setStats({
        users: profiles.length,
        operators: profiles.filter((p) => p.role === 'operator').length,
        pending: profiles.filter((p) => p.operator_status === 'pending').length,
        active: active ?? 0,
        completed: completed ?? 0,
      });
    }
    load();
  }, []);

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
      <Stat label="Total Users" value={stats.users} />
      <Stat label="Total Operator" value={stats.operators} />
      <Stat label="Pending" value={stats.pending} />
      <Stat label="Active Chat" value={stats.active} />
      <Stat label="Completed" value={stats.completed} />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-ink-border p-4">
      <p className="text-xs text-ash-500">{label}</p>
      <p className="mt-1 font-display text-xl">{value}</p>
    </div>
  );
}

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { notifyUser } from '../lib/notifications';

const TIERS = [
  { name: 'Traktir Kopi', price: 10000, desc: 'Cukup buat secangkir kopi operator.' },
  { name: 'Traktir Makan', price: 25000, desc: 'Setara satu porsi makan siang.', recommended: true },
  { name: 'Support Sehari', price: 50000, desc: 'Bantu operator sepanjang hari itu.' },
  { name: 'Support Sebulan', price: 150000, desc: 'Dukungan rutin, dibagi ke operator aktif.' },
];

function formatRupiah(n: number) {
  return `Rp ${n.toLocaleString('id-ID')}`;
}

export default function Pricing() {
  const { profile } = useAuth();
  const [chosen, setChosen] = useState<string | null>(null);

  async function choose(tierName: string) {
    setChosen(tierName);
    if (profile) {
      await notifyUser(
        profile.id,
        'Terima kasih atas niat dukungannya!',
        `Kamu memilih paket "${tierName}". Ini masih prototype, belum ada payment gateway sungguhan.`
      );
    }
    setTimeout(() => setChosen(null), 3000);
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-10 md:px-12">
      <h1 className="font-display text-2xl">Kasihan Operatornya, Pak/Bu</h1>
      <p className="mt-2 text-sm text-ash-300">
        Kami bukan server yang hidup dari listrik doang. Yang jawab pertanyaan kalian itu manusia — bisa lapar,
        bisa ngantuk, dan butuh duit buat beli makan. Ini bukan biaya wajib, cuma cara buat traktir operator
        kalau kamu mau.
      </p>

      {/* A clean list, not a grid of identical cards — one row gets a
          quiet left-border accent instead of a floating badge. */}
      <div className="mt-8 divide-y divide-ink-border rounded-md border border-ink-border">
        {TIERS.map((tier) => (
          <div
            key={tier.name}
            className={
              'flex items-center justify-between gap-4 p-5 ' +
              (tier.recommended ? 'border-l-2 border-l-signal-blue bg-ink-raised' : '')
            }
          >
            <div>
              <p className="font-medium text-ash-100">
                {tier.name}
                {tier.recommended && <span className="ml-2 text-xs text-signal-blue">paling sering dipilih</span>}
              </p>
              <p className="mt-0.5 text-sm text-ash-500">{tier.desc}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-display text-lg">{formatRupiah(tier.price)}</span>
              <button
                onClick={() => choose(tier.name)}
                className={tier.recommended ? 'btn-primary btn-sm' : 'btn-ghost btn-sm'}
              >
                {chosen === tier.name ? 'Terima kasih!' : 'Pilih'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-3 text-xs text-ash-500">
        Prototype — belum terhubung payment gateway sungguhan. Nominal di atas contoh, belum final.
      </p>

      <section className="mt-8 rounded-md border border-ink-border p-5">
        <h2 className="font-display text-base">Transparansi</h2>
        <ul className="mt-3 space-y-2 text-sm text-ash-300">
          <li>• Pembayaran operator dilakukan setiap 1 bulan sekali.</li>
          <li>• Dukungan yang kamu berikan disalurkan langsung untuk operator yang aktif menjawab.</li>
          <li>• Belum ada skema pembagian persentase yang final — akan diumumkan lewat broadcast begitu ditentukan.</li>
        </ul>
      </section>
    </main>
  );
}

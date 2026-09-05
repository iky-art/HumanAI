# HumanAI v1.0.0

Stage 1 dari migrasi prototype → aplikasi beneran. Stack: **React + Vite +
TypeScript + Tailwind**, database & auth pakai **Supabase**, hosting di
**Cloudflare Pages** (`pages.dev`).

Yang sudah ada di stage ini:
- Landing page (desain baru, ada pilihan bahasa ID/EN)
- Login/Register (dengan Konfirmasi Password + nomor WhatsApp + centang Legal)
- Halaman Legal (Terms & Privacy)
- Koneksi ke Supabase (auth + schema database + Row Level Security)
- **Chat realtime** — user bisa kirim pesan, otomatis update pas operator balas
- **Operator Panel** — klaim/balas/tutup percakapan + tombol konsultasi WA
- **History, Profile** (referral progress + alur jadi-operator), **Pricing** (versi rapi), **About** & **Rules** (diperkaya), **Settings** (akun, keamanan, notifikasi, tampilan, privasi & data)
- **Notifikasi in-app** — lonceng di topbar, realtime
- **Broadcast** — Admin/Founder bisa kirim pengumuman yang muncul sebagai banner ke semua user
- **Admin Panel** — approve/reject operator, panel "WA User" (nomor tersamar, reveal butuh alasan & tercatat), broadcast
- **Founder Panel** — sama seperti Admin, tapi nomor WA langsung penuh (highest trust), plus akses ke Operator Panel juga (all-in-one)
- Nav jadi drawer di mobile, inline di desktop

Yang belum: verifikasi/reset password lewat email, payment gateway sungguhan,
Cloudflare Pages Functions (server-side secrets), deploy pipeline.

---

## Migration yang harus dijalankan (urutan penting!)

Di Supabase SQL Editor, jalankan **satu per satu, sesuai urutan**:
1. `supabase/migrations/0001_init.sql`
2. `supabase/migrations/0002_terms_consent.sql`
3. `supabase/migrations/0003_settings_support.sql`

---

## 1. Install dependencies

Sandbox saya nggak punya akses internet, jadi bagian ini harus kamu jalankan
sendiri di Termux (atau laptop):

```bash
cd humanai-v1
npm install
```

## 2. Bikin project Supabase

1. Buka [supabase.com](https://supabase.com) → New Project (gratis).
2. Setelah project jadi, buka **SQL Editor** di dashboard Supabase.
3. Copy seluruh isi file `supabase/migrations/0001_init.sql` di project ini,
   paste ke SQL Editor, klik **Run**. Ini bikin semua tabel + keamanan
   (Row Level Security) sekaligus.
4. Buka **Project Settings → API**, catat:
   - `Project URL`
   - `anon public` key

## 3. Setup environment variable

```bash
cp .env.example .env.local
```

Edit `.env.local`, isi dengan URL & anon key dari langkah 2.

## 4. Jalankan di local (buat testing)

```bash
npm run dev
```

Buka `http://localhost:5173` di browser.

## 5. Deploy ke Cloudflare Pages

Paling gampang lewat dashboard (tanpa perlu install `wrangler` CLI):

1. Push project ini ke GitHub (repo baru).
2. Buka [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
3. Pilih repo-nya. Build settings:
   - Build command: `npm run build`
   - Build output directory: `dist`
4. Di bagian **Environment variables**, tambahkan `VITE_SUPABASE_URL` dan
   `VITE_SUPABASE_ANON_KEY` (sama kayak isi `.env.local`).
5. Deploy. Kamu dapat domain `<nama-project>.pages.dev`.

Setiap kali kamu push ke GitHub lagi, Cloudflare otomatis build ulang.

---

## Kenapa auth-nya pakai "email samaran"?

Supabase Auth butuh email atau nomor HP sebagai identifier. HumanAI sengaja
**tidak** memakai provider OTP WhatsApp (Twilio/Fonnte/dkk) untuk
memverifikasi nomor itu — makai API key pihak ketiga cuma buat konfirmasi
nomor HP bertentangan sama prinsip "no hidden API key" produk ini sendiri.
Jadi username kamu diubah jadi `username@users.humanai.app` di belakang
layar cuma buat keperluan Supabase Auth — nomor WhatsApp aslinya tersimpan
apa adanya di `profiles.wa_number` sebagai kontak biasa, tidak diverifikasi
otomatis. "Verifikasi"-nya terjadi secara manual: begitu Operator beneran
menghubungi nomor itu buat konsultasi. Ini didokumentasikan di komentar
`src/context/AuthContext.tsx`.

## Struktur folder

```
src/
  lib/supabase.ts       -> koneksi ke Supabase
  context/               -> Auth & Language (state global)
  i18n/                  -> kamus terjemahan id.json / en.json
  types/database.ts      -> tipe TypeScript sesuai schema
  pages/                 -> satu file per halaman
  components/            -> komponen kecil yang dipakai berulang
supabase/migrations/     -> schema database + RLS (jalankan di SQL Editor)
functions/api/           -> (kosong dulu) buat payment gateway nanti
```

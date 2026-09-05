import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function Privacy() {
  const { t } = useLanguage();

  return (
    <main className="min-h-dvh bg-ink px-6 py-10 text-ash-100 md:px-12">
      <div className="mx-auto max-w-2xl">
        <Link to="/login" className="text-sm text-ash-500 hover:text-ash-300">
          ← {t('legal.back')}
        </Link>

        <h1 className="mt-6 font-display text-2xl">{t('legal.privacy_title')}</h1>
        <p className="mt-1 text-xs text-ash-500">{t('legal.last_updated')}: September 2026</p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-ash-300">
          <Section title="1. Data yang Kami Kumpulkan">
            Saat kamu mendaftar, kami menyimpan: username, kata sandi (dalam bentuk terenkripsi,
            dikelola oleh Supabase Auth — kami tidak pernah menyimpan atau melihat kata sandi asli
            kamu), dan nomor WhatsApp aktif. Saat kamu memakai layanan, kami juga menyimpan isi
            percakapan dengan Operator, dan aktivitas terkait fitur referral/promosi.
          </Section>

          <Section title="2. Kenapa Nomor WhatsApp Diminta">
            Nomor WhatsApp dipakai untuk memverifikasi bahwa kamu manusia sungguhan, dan supaya
            Operator/Admin bisa menghubungimu bila terjadi hal penting terkait akunmu (misalnya
            dugaan pelanggaran, atau masalah teknis). Nomor ini tidak pernah ditampilkan ke sesama
            pengguna. Di dalam panel Admin, nomor ditampilkan terpotong/tersamar sebagian; nomor
            lengkap hanya terlihat oleh Founder, dan setiap kali Admin membuka nomor lengkap,
            tindakan itu tercatat di log internal beserta alasannya.
          </Section>

          <Section title="3. Siapa yang Bisa Mengakses Datamu">
            Isi percakapanmu bisa dilihat oleh Operator yang menangani percakapan tersebut, serta
            Admin/Founder untuk keperluan moderasi dan quality control. Kami tidak menjual data
            pengguna ke pihak ketiga mana pun.
          </Section>

          <Section title="4. Layanan Pihak Ketiga">
            Kami menggunakan Supabase untuk database, autentikasi, dan penyimpanan realtime, serta
            Cloudflare Pages untuk hosting. Kedua layanan ini punya kebijakan privasi dan standar
            keamanan mereka sendiri. HumanAI tidak menggunakan penyedia verifikasi WhatsApp pihak
            ketiga mana pun — nomor WhatsApp yang kamu daftarkan tidak diverifikasi secara
            otomatis, dan hanya "dikonfirmasi" secara manual saat Operator benar-benar
            menghubungimu. Bila di masa depan kami mengaktifkan payment gateway untuk fitur
            dukungan/donasi, penyedia layanan tersebut akan memproses detail transaksi yang
            relevan.
          </Section>

          <Section title="5. Berapa Lama Data Disimpan">
            Data akun & percakapan disimpan selama akunmu aktif. Jika kamu menghapus akun lewat
            halaman Settings, data utama (profil, percakapan, notifikasi) akan dihapus dari sistem
            kami, kecuali catatan yang wajib disimpan untuk kepatuhan hukum (misalnya log
            transaksi dukungan/pembayaran, bila ada).
          </Section>

          <Section title="6. Hak Kamu">
            Kamu berhak meminta salinan data yang kami simpan tentang kamu, meminta koreksi data
            yang salah, dan meminta penghapusan akun beserta datanya. Permintaan ini bisa dilakukan
            langsung lewat halaman Settings, atau dengan menghubungi kami.
          </Section>

          <Section title="7. Keamanan">
            Kami menerapkan Row Level Security di tingkat database, sehingga secara teknis satu
            pengguna tidak bisa membaca data pengguna lain di luar aturan yang kami tetapkan.
            Meski begitu, tidak ada sistem yang 100% bebas risiko — kami akan menginformasikan
            lewat broadcast bila terjadi insiden keamanan yang berdampak ke data pengguna.
          </Section>

          <Section title="8. Anak-Anak">
            HumanAI tidak ditujukan untuk pengguna di bawah 17 tahun. Kami tidak dengan sengaja
            mengumpulkan data dari anak-anak.
          </Section>

          <Section title="9. Perubahan Kebijakan">
            Kami dapat memperbarui kebijakan ini sewaktu-waktu. Perubahan signifikan akan
            diinformasikan lewat fitur broadcast di dalam aplikasi.
          </Section>
        </div>

        <p className="mt-10 rounded-sm border border-ink-border bg-ink-raised p-4 text-xs text-ash-500">
          Catatan: teks ini adalah draf awal untuk kebutuhan produk dan belum ditinjau oleh
          profesional hukum. Sebelum dipakai untuk layanan yang menampung data pengguna
          sungguhan, sebaiknya direview oleh konsultan hukum agar sesuai dengan UU Pelindungan
          Data Pribadi (UU PDP) dan regulasi lain yang berlaku di Indonesia.
        </p>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-base text-ash-100">{title}</h2>
      <p className="mt-2">{children}</p>
    </section>
  );
}

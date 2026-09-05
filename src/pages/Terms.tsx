import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function Terms() {
  const { t } = useLanguage();

  return (
    <main className="min-h-dvh bg-ink px-6 py-10 text-ash-100 md:px-12">
      <div className="mx-auto max-w-2xl">
        <Link to="/login" className="text-sm text-ash-500 hover:text-ash-300">
          ← {t('legal.back')}
        </Link>

        <h1 className="mt-6 font-display text-2xl">{t('legal.terms_title')}</h1>
        <p className="mt-1 text-xs text-ash-500">{t('legal.last_updated')}: September 2026</p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-ash-300">
          <Section title="1. Tentang HumanAI">
            HumanAI adalah eksperimen percakapan di mana tampilannya menyerupai chatbot AI modern,
            tetapi setiap balasan yang kamu terima ditulis langsung oleh manusia (disebut
            "Operator"). HumanAI tidak menggunakan model AI atau API key tersembunyi untuk
            menghasilkan jawaban apa pun. HumanAI dikembangkan oleh Orbit Studio.
          </Section>

          <Section title="2. Syarat Menggunakan Layanan">
            Kamu harus berusia minimal 17 tahun untuk membuat akun. Kamu wajib memberikan nomor
            WhatsApp aktif dan benar saat mendaftar — akun dengan data yang jelas tidak valid dapat
            ditangguhkan tanpa pemberitahuan lebih dulu. Satu orang hanya boleh memiliki satu akun,
            kecuali mendapat izin tertulis dari Admin/Founder.
          </Section>

          <Section title="3. Perilaku yang Dilarang">
            Sesuai halaman Rules, kamu dilarang mengirim konten seksual/eksplisit, permintaan yang
            tidak pantas, ujaran kebencian, ancaman kekerasan, spam, atau upaya menipu/mengelabui
            Operator maupun pengguna lain. Pelanggaran dapat menyebabkan percakapan dihentikan,
            akun ditangguhkan sementara, atau diblokir permanen, tergantung tingkat keparahannya.
          </Section>

          <Section title="4. Sifat Jawaban Operator">
            Operator adalah manusia, bukan sumber kebenaran mutlak. HumanAI tidak menjamin setiap
            jawaban selalu akurat, lengkap, atau tersedia dalam waktu tertentu — waktu respons bisa
            bervariasi tergantung ketersediaan Operator. Jangan mengandalkan HumanAI untuk
            keputusan medis, hukum, atau finansial yang kritis.
          </Section>

          <Section title="5. Dukungan & Pembayaran">
            Fitur "Pricing" bersifat dukungan sukarela untuk membantu operasional dan Operator,
            bukan biaya wajib untuk mengakses layanan dasar. Nominal yang ditampilkan dapat berubah
            sewaktu-waktu. Dukungan yang sudah diproses umumnya tidak dapat dikembalikan, kecuali
            terjadi kesalahan sistem di pihak kami.
          </Section>

          <Section title="6. Program Operator">
            Pengguna dapat mengajukan diri menjadi Operator setelah memenuhi syarat penggunaan
            minimum yang ditentukan di aplikasi. Persetujuan akhir ada di tangan Admin/Founder dan
            dapat ditolak tanpa kewajiban memberi alasan rinci. Operator yang melanggar Syarat &
            Ketentuan ini dapat dicabut statusnya kapan saja.
          </Section>

          <Section title="7. Penangguhan & Penghentian Akun">
            Kami dapat menangguhkan atau menghapus akun yang melanggar ketentuan ini. Kamu juga
            berhak menghapus akunmu sendiri kapan saja melalui halaman Settings.
          </Section>

          <Section title="8. Batasan Tanggung Jawab">
            HumanAI disediakan "sebagaimana adanya". Sepanjang diizinkan oleh hukum yang berlaku,
            Orbit Studio tidak bertanggung jawab atas kerugian tidak langsung yang timbul dari
            penggunaan layanan ini, termasuk dari jawaban Operator yang keliru.
          </Section>

          <Section title="9. Perubahan Ketentuan">
            Ketentuan ini dapat diperbarui sewaktu-waktu. Perubahan signifikan akan diinformasikan
            melalui fitur broadcast di dalam aplikasi.
          </Section>

          <Section title="10. Hukum yang Berlaku">
            Ketentuan ini tunduk pada hukum Republik Indonesia.
          </Section>
        </div>

        <p className="mt-10 rounded-sm border border-ink-border bg-ink-raised p-4 text-xs text-ash-500">
          Catatan: teks ini adalah draf awal untuk kebutuhan produk dan belum ditinjau oleh
          profesional hukum. Sebelum dipakai untuk layanan yang menampung data pengguna
          sungguhan, sebaiknya direview oleh konsultan hukum agar sesuai dengan UU PDP dan
          regulasi lain yang berlaku di Indonesia.
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

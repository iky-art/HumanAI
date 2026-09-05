export default function Rules() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-10 md:px-12">
      <h1 className="font-display text-2xl">Rules HumanAI</h1>
      <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-danger/10 px-4 py-1.5 text-sm font-medium text-danger">
        No 18+ Content
      </div>

      <div className="mt-8 space-y-7 text-sm leading-relaxed text-ash-300">
        <Section title="1. Konten Dewasa">
          Tidak ada konten seksual atau eksplisit. Tidak ada permintaan yang tidak pantas. Tidak ada percakapan
          dewasa dalam bentuk apa pun — termasuk yang dibungkus lelucon, roleplay, atau "cuma nanya".
        </Section>

        <Section title="2. Hormati Operator">
          Operator adalah manusia sungguhan, sama seperti kamu. Jangan melecehkan, mengancam, atau memaksa
          Operator menjawab hal yang membuat mereka tidak nyaman. Operator berhak menutup percakapan kapan
          saja tanpa perlu memberi alasan.
        </Section>

        <Section title="3. Ujaran Kebencian & Kekerasan">
          Dilarang mengirim ujaran kebencian berbasis SARA, ancaman kekerasan, atau konten yang mempromosikan
          bahaya terhadap diri sendiri maupun orang lain. Jika kamu atau orang lain dalam bahaya, hubungi
          layanan darurat setempat — HumanAI bukan layanan krisis.
        </Section>

        <Section title="4. Spam & Penyalahgunaan">
          Jangan mengirim pesan berulang-ulang, tautan mencurigakan, promosi tanpa izin, atau mencoba
          mengeksploitasi bug/celah sistem. Satu orang hanya boleh punya satu akun aktif.
        </Section>

        <Section title="5. Identitas & Keamanan Akun">
          Nomor WhatsApp yang kamu daftarkan harus aktif dan benar-benar milikmu. Jangan membagikan password
          akunmu ke siapa pun, termasuk yang mengaku sebagai Operator/Admin — HumanAI tidak akan pernah
          meminta password kamu lewat chat.
        </Section>

        <Section title="6. Batasan Jawaban Operator">
          Operator menjawab berdasarkan pengetahuan pribadi mereka, bukan sumber kebenaran mutlak. Jangan
          jadikan jawaban di HumanAI sebagai dasar keputusan medis, hukum, atau finansial yang kritis tanpa
          verifikasi lebih lanjut ke ahlinya.
        </Section>

        <Section title="7. Konsekuensi Pelanggaran">
          Pelanggaran ringan biasanya berupa peringatan atau percakapan dihentikan. Pelanggaran berat (konten
          18+, ancaman kekerasan, ujaran kebencian) dapat menyebabkan akun ditangguhkan langsung tanpa
          peringatan lebih dulu. Admin/Founder berhak menentukan tingkat keparahan pelanggaran.
        </Section>

        <Section title="8. Banding">
          Kalau kamu merasa akunmu ditangguhkan secara keliru, kamu bisa mengajukan banding lewat nomor
          WhatsApp yang terdaftar di akunmu — Founder akan meninjau kasus tersebut.
        </Section>

        <Section title="9. Perubahan Rules">
          Rules ini bisa diperbarui sewaktu-waktu mengikuti kebutuhan komunitas. Perubahan signifikan akan
          diinformasikan lewat fitur broadcast di dalam aplikasi.
        </Section>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-base text-ash-100">{title}</h2>
      <p className="mt-1.5">{children}</p>
    </section>
  );
}

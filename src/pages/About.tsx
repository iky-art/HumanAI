export default function About() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-10 md:px-12">
      <h1 className="font-display text-2xl">Tentang HumanAI</h1>
      <p className="mt-3 text-ash-100">HumanAI adalah sebuah eksperimen percakapan.</p>

      <div className="mt-6 space-y-3">
        {[
          'HumanAI 100% dijawab oleh manusia.',
          'Tidak ada AI yang menghasilkan respons.',
          'Tidak ada API key tersembunyi.',
          'Tidak ada model AI yang diam-diam digunakan untuk menjawab percakapan.',
        ].map((line) => (
          <div key={line} className="flex gap-3 text-sm text-ash-300">
            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-human" />
            {line}
          </div>
        ))}
      </div>

      <p className="mt-6 text-sm leading-relaxed text-ash-300">
        Setiap respons berasal dari manusia sungguhan. HumanAI adalah eksperimen independen — dibangun untuk
        melihat seperti apa rasanya mengobrol dengan sesama manusia lewat antarmuka yang terasa modern, tanpa
        embel-embel kecerdasan buatan di baliknya.
      </p>

      <section className="mt-8 rounded-md border border-ink-border p-5">
        <h2 className="font-display text-base">Kenapa tampilannya seperti AI?</h2>
        <p className="mt-2 text-sm text-ash-300">
          Justru itu poinnya: sekilas HumanAI terlihat seperti chatbot AI modern. Begitu kamu mengobrol atau
          membaca halaman ini, kamu sadar tidak ada AI di baliknya sama sekali. Kontrasnya disengaja —
          Visual: mirip AI. Yang menjawab: manusia. Hidden API: tidak ada.
        </p>
      </section>

      <section className="mt-6 rounded-md border border-ink-border p-5">
        <h2 className="font-display text-base">Siapa Operatornya?</h2>
        <p className="mt-2 text-sm text-ash-300">
          Operator adalah pengguna HumanAI sendiri yang sudah memenuhi syarat pemakaian minimum dan disetujui
          oleh Admin/Founder. Mereka bukan pegawai penuh waktu — jadi waktu balasnya bisa bervariasi tergantung
          ketersediaan mereka. Lihat halaman <span className="text-human">Pricing</span> kalau kamu ingin
          membantu operasional & operator.
        </p>
      </section>

      <section className="mt-6 rounded-md border border-ink-border p-5">
        <h2 className="font-display text-base">Inspired by ChatTJB</h2>
        <p className="mt-2 text-sm text-ash-300">
          Konsep HumanAI terinspirasi oleh ChatTJB, namun HumanAI merupakan proyek independen yang
          dikembangkan oleh Orbit Studio. HumanAI tidak berafiliasi dengan ChatTJB.
        </p>
      </section>

      <section className="mt-6 rounded-md border border-ink-border p-5">
        <h2 className="font-display text-base">Tentang Orbit Studio</h2>
        <p className="mt-2 text-sm text-ash-300">
          Orbit Studio adalah tim yang mengembangkan HumanAI dari nol — mulai dari konsep, desain, sampai
          infrastrukturnya. HumanAI adalah salah satu eksperimen produk dari Orbit Studio.
        </p>
      </section>
    </main>
  );
}

import Navbar from "@/components/layout/Navbar";

const contactCards = [
  {
    icon: "fa-regular fa-envelope",
    title: "Email Us",
    value: "support@astroved.com",
    href: "mailto:support@astroved.com",
  },
  {
    icon: "fa-solid fa-phone",
    title: "Call Us",
    value: "+91 9677391108",
    meta: "10:30 AM - 7:30 PM (IST)",
    href: "tel:+919677391108",
  },
];

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white text-[#241a46]">
        <section className="mx-auto max-w-6xl px-6 py-14 lg:px-8">
          <div className="rounded-sm border border-gray-100 bg-white px-6 py-8 text-center shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#6869F9]">Contact Us</p>
            <h1 className="mt-3 text-3xl font-black text-[#6f1d1b] md:text-4xl">
              AstroVed Office Address
            </h1>
            <p className="mt-6 text-xl font-semibold text-[#6f1d1b]">
              AstroVed.Com Pvt. Ltd
            </p>
            <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-gray-700">
              
Prince Info Park, Plot No: 81-B,
A-Block, 4th Floor, 2nd Main Road,
Ambattur Industrial Estate,
Chennai 600 058
            </p>
          </div>

          <div className="mt-9 grid gap-8 md:grid-cols-2">
            {contactCards.map((card) => (
              <a
                key={card.title}
                href={card.href}
                className="flex min-h-[210px] flex-col items-center justify-center rounded-sm bg-[#fff3eb] p-8 text-center shadow-[0_8px_22px_rgba(0,0,0,0.1)] transition-all hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(244,120,32,0.18)]"
              >
                <i className={`${card.icon} text-3xl text-[#933913]`} aria-hidden="true"></i>
                <h2 className="mt-8 text-2xl font-black text-[#6f1d1b]">{card.title}</h2>
                <p className="mt-4 text-lg font-semibold text-[#933913]">{card.value}</p>
                {card.meta && <p className="mt-1 text-base font-medium text-[#1f1f1f]">{card.meta}</p>}
              </a>
            ))}
          </div>

          <p className="mx-auto mt-10 max-w-4xl text-center text-lg leading-8 text-gray-700">
            For any queries related to pujas, chadhava, astrology tools, or technical assistance, feel free to reach out to us. Our team is here to help you.
          </p>

          <div className="mt-10 flex justify-center">
            <a
              href="#download-app"
              className="inline-flex items-center gap-3 rounded-xl bg-[#6869F9] px-7 py-4 text-sm font-extrabold uppercase tracking-wide text-white shadow-lg shadow-orange-100 transition-all hover:bg-[#d95f13] active:scale-95"
            >
              <i className="fa-solid fa-download" aria-hidden="true"></i>
              Download App
            </a>
          </div>
        </section>
      </main>
    </>
  );
}

import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Mail, MapPin } from 'lucide-react';

const TEAM = [
  {
    name: 'Tilda Blomsterlund',
    title: 'Chefredaktör',
    email: 'tilda@livsstil24.se',
    photo: '/team/tilda.jpeg',
    bio: 'Leder Livsstil24:s redaktion med ett öga för mode, skönhet och det moderna livet.',
  },
  {
    name: 'Nizar Timori',
    title: 'Ansvarig utgivare',
    email: 'nizar@livsstil24gruppen.se',
    photo: '/team/nizar.jpeg',
    bio: 'Ansvarar för Livsstil24-gruppens publicistiska integritet och strategiska vision.',
  },
  {
    name: 'Alexander Forsberg',
    title: 'Chef för försäljning',
    email: 'alexander.forsberg@livsstil24gruppen.se',
    photo: '/team/alexander.jpeg',
    bio: 'Driver Livsstil24:s kommersiella tillväxt och annonspartnerships.',
  },
];

export default function ContactPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div style={{ backgroundColor: '#F4F0EA' }}>
      <Helmet>
        <title>Kontakt – Livsstil24</title>
        <meta name="description" content="Kontakta Livsstil24 – redaktion, annonsfrågor och vårt team." />
      </Helmet>

      {/* ── Header ── */}
      <div className="border-b border-cream-200">
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-6 h-px" style={{ backgroundColor: '#B89B72' }} />
          </div>
          <p className="eyebrow mb-4" style={{ color: '#B89B72' }}>Livsstil24</p>
          <h1 className="font-sans text-5xl md:text-7xl tracking-tight mb-4 uppercase" style={{ color: '#0e0e0e' }}>
            Kontakt
          </h1>
        </div>
      </div>

      {/* ── Contact info strip ── */}
      <div className="border-b border-cream-200">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x border-cream-200" style={{ borderColor: 'rgba(14,14,14,0.1)' }}>

          <div className="flex-1 flex flex-col items-center justify-center gap-3 px-8 py-6 text-center">
            <MapPin size={16} style={{ color: '#B89B72' }} />
            <p className="eyebrow" style={{ color: '#0E0E0E' }}>Adress</p>
            <p className="text-sm font-light" style={{ color: '#0E0E0E' }}>
              Svärdvägen 7C, 182 33 Danderyd
            </p>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center gap-3 px-8 py-6 text-center" style={{ borderColor: 'rgba(14,14,14,0.1)' }}>
            <Mail size={16} style={{ color: '#B89B72' }} />
            <p className="eyebrow" style={{ color: '#0E0E0E' }}>E-post</p>
            <a href="mailto:info@livsstil24gruppen.se"
              className="text-sm font-light transition-colors text-[#0E0E0E] hover:text-[#B89B72]">
              info@livsstil24gruppen.se
            </a>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center gap-3 px-8 py-6 text-center" style={{ borderColor: 'rgba(14,14,14,0.1)' }}>
            <Mail size={16} style={{ color: '#B89B72' }} />
            <p className="eyebrow" style={{ color: '#0E0E0E' }}>Annonsmaterial</p>
            <a href="mailto:annons@livsstil24gruppen.se"
              className="text-sm font-light transition-colors text-[#0E0E0E] hover:text-[#B89B72]">
              annons@livsstil24gruppen.se
            </a>
          </div>

        </div>
      </div>

      {/* ── Team ── */}
      <section className="mb-20">
        <div className="flex items-center gap-6 py-14 max-w-7xl mx-auto px-6">
          <div className="flex-1 h-px bg-cream-200" />
          <span className="eyebrow" style={{ color: '#B89B72' }}>Redaktionen</span>
          <div className="flex-1 h-px bg-cream-200" />
        </div>

        {TEAM.map((member, i) => {
          const imageLeft = i % 2 === 0;
          return (
            <div key={member.email}
              className="grid grid-cols-1 md:grid-cols-2 border-t border-cream-200 last:border-b"
              style={{ gridTemplateRows: '70vh' }}
            >

              {/* Image */}
              <div
                className={`overflow-hidden ${imageLeft ? 'md:order-1' : 'md:order-2'}`}
                style={{ backgroundColor: '#ECEAE6' }}
              >
                <img
                  src={member.photo}
                  alt={member.name}
                  style={{ height: '100%', width: 'auto', display: 'block', margin: '0 auto' }}
                />
              </div>

              {/* Text */}
              <div
                className={`flex flex-col justify-center items-center py-16 px-10 md:px-16 lg:px-20 ${imageLeft ? 'md:order-2' : 'md:order-1'}`}
              >
                <div className="w-full max-w-sm">
                  <div className="w-8 h-px mb-8" style={{ backgroundColor: '#B89B72' }} />
                  <p className="eyebrow mb-4" style={{ color: '#B89B72' }}>{member.title}</p>
                  <h2 className="font-sans text-3xl md:text-4xl lg:text-5xl leading-[1.04] tracking-tight mb-6"
                    style={{ color: '#0E0E0E' }}>
                    {member.name}
                  </h2>
                  <p className="text-sm leading-relaxed mb-8 font-light"
                    style={{ color: '#0E0E0E' }}>
                    {member.bio}
                  </p>
                  <a
                    href={`mailto:${member.email}`}
                    className="text-sm transition-colors text-[#A39284] hover:text-[#B89B72] inline-flex items-center gap-2"
                  >
                    <Mail size={12} />
                    {member.email}
                  </a>
                </div>
              </div>

            </div>
          );
        })}
      </section>

    </div>
  );
}

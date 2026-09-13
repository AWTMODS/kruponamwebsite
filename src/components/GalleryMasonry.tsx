import React from 'react';
import { Camera } from 'lucide-react';


export const GalleryMasonry: React.FC = () => {
  const photos = [
    {
      title: 'Chenda Melam Rhythm & Fire',
      tag: 'Music',
      url: 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?w=600&auto=format&fit=crop&q=80',
    },
    {
      title: 'Grand Athapookalam Floral Geometry',
      tag: 'Contest',
      url: 'https://images.unsplash.com/photo-1568213816046-0ee1c42bd559?w=600&auto=format&fit=crop&q=80',
    },
    {
      title: 'Traditional Thiruvathira Circle Dance',
      tag: 'Dance',
      url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&auto=format&fit=crop&q=80',
    },
    {
      title: '24-Dish Authentic Onasadya on Plantain Leaf',
      tag: 'Feast',
      url: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=600&auto=format&fit=crop&q=80',
    },
    {
      title: 'High-Stakes Vadam Vali (Tug of War)',
      tag: 'Sports',
      url: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=600&auto=format&fit=crop&q=80',
    },
    {
      title: 'Celebrity DJ Night & Neon Blasts',
      tag: 'Concert',
      url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <section id="gallery" className="py-20 bg-[#FFFDF7] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#0D472B]/10 text-[#0D472B] text-xs font-bold uppercase tracking-widest mb-3">
            <Camera className="w-3.5 h-3.5 text-[#D4AF37]" />
            Festival Memories
          </div>
          <h2 className="font-['Cinzel'] text-3xl sm:text-4xl font-bold text-[#0D472B] tracking-tight mb-3">
            Kruponam Highlights & Celebrations
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 font-sans leading-relaxed">
            Relive the colors, camaraderie, and golden heritage of Krupanidhi’s grandest annual homecoming.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((photo, i) => (
            <div
              key={i}
              className="group relative rounded-3xl overflow-hidden shadow-md border border-stone-200 aspect-4/3 bg-stone-900"
            >
              <img
                src={photo.url}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5 text-left">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#FDE68A] mb-1">
                  {photo.tag}
                </span>
                <h3 className="font-serif font-bold text-white text-base leading-snug">
                  {photo.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

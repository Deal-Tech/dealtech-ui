import { Star } from 'lucide-react';

import PitaBerjalan from '@/components/ui/pita-berjalan/PitaBerjalan';
import './ulasan-berjalan.css';

export interface Ulasan {
  nama: string;
  isi: string;
}

const ULASAN_ATAS: Ulasan[] = [
  {
    nama: 'Hannah Whitfield',
    isi: 'Best morning of our whole trip. Our guide spotted three turtles before we had even been in the water ten minutes, and he stayed right next to my daughter the entire time.',
  },
  {
    nama: 'Putri Ananda',
    isi: 'Booked a private boat for our family and it was worth every rupiah. The captain changed the route because of the wind and we still saw everything we wanted.',
  },
  {
    nama: 'Lucas Meijer',
    isi: 'No pushy selling, no hidden costs at the harbour. Price agreed up front and that was exactly what we paid. Refreshing after two days of being hassled on the beach.',
  },
  {
    nama: 'Sofia Alvarez',
    isi: 'The masks actually fit properly, which sounds small until you have spent a whole trip with water in your eyes somewhere else. Small group, no rushing.',
  },
  {
    nama: 'Rizky Ramadhan',
    isi: 'Guides are local and it shows. They know which reef is calm on which day. We changed the stop order and it turned out to be the right call.',
  },
  {
    nama: 'Jack Thompson',
    isi: 'Did the three island day. Long day but never felt rushed, and lunch on Gili Air was one of the best meals we had in Indonesia.',
  },
  {
    nama: 'Chloé Bernard',
    isi: 'I am not a strong swimmer and I was nervous. The guide stayed with me the whole time and I ended up snorkelling for two hours without noticing.',
  },
  {
    nama: 'Dewi Lestari',
    isi: 'Anak-anak senang banget — and everything was explained in English for my husband too. Very patient with the little ones.',
  },
  {
    nama: 'Daniel Kim',
    isi: 'The underwater statues were the highlight. Water was clear, the boat was not crowded, and we got back exactly when they said we would.',
  },
  {
    nama: 'Emma Lindqvist',
    isi: 'Booked the day before by message and it was all sorted in ten minutes. Straightforward, honest and genuinely friendly people.',
  },
];

const ULASAN_BAWAH: Ulasan[] = [
  {
    nama: 'Mateo Rossi',
    isi: 'Second time booking with them. Same guide remembered us from last year. That says everything about how they treat people.',
  },
  {
    nama: 'Nadia Safitri',
    isi: 'Sunset cruise was beautiful and very relaxed. Good music, cold drinks, and the crew let us enjoy it instead of talking the whole time.',
  },
  {
    nama: 'Tom Baxter',
    isi: 'Life jackets for everyone and a proper briefing before we left the jetty. Felt safe the whole day, which mattered with two kids on board.',
  },
  {
    nama: 'Ana Beatriz Souza',
    isi: 'Coral garden at Meno was unbelievable. Our guide dived down to point things out and came back up grinning every single time.',
  },
  {
    nama: 'Bagus Prasetyo',
    isi: 'Harga jelas dari awal, no surprise. Boatnya bersih dan crewnya ramah. Recommended for anyone visiting Gili for the first time.',
  },
  {
    nama: "Ryan O'Connell",
    isi: 'We were late because of the ferry and they simply waited and adjusted the route. Never once made us feel like a problem.',
  },
  {
    nama: 'Marta Nowak',
    isi: 'Small group meant we actually got to enjoy each stop. On other boats you see forty people crowding the same piece of reef.',
  },
  {
    nama: 'Yuki Tanaka',
    isi: 'Everything was easy to arrange over WhatsApp and the guide spoke great English. The turtles came so close I could not believe it.',
  },
  {
    nama: 'Andi Wijaya',
    isi: 'Took my parents out on a private charter for their anniversary. The crew made a real effort to make the day special for them.',
  },
  {
    nama: 'Liam Fraser',
    isi: 'Honest local operator, fair price, and the money goes to people who actually live here. That is why we booked and we would again.',
  },
];

export const ULASAN_SEMUA: Ulasan[] = [...ULASAN_ATAS, ...ULASAN_BAWAH];

function KartuUlasan({ ulasan }: { ulasan: Ulasan }) {
  return (
    <article className="ulasan-berjalan__kartu">
      <p className="ulasan-berjalan__isi">{ulasan.isi}</p>
      <div className="ulasan-berjalan__kaki">
        <span className="ulasan-berjalan__nama">{ulasan.nama}</span>
        <span className="ulasan-berjalan__bintang" aria-label="5 out of 5">
          {Array.from({ length: 5 }, (_, i) => (
            <Star key={i} className="ulasan-berjalan__bintang-ikon" aria-hidden="true" />
          ))}
        </span>
      </div>
    </article>
  );
}

export function UlasanBerjalan() {
  return (
    <section className="ulasan-berjalan" aria-label="Guest reviews">
      <h2 className="seksi-judul">
        <span className="ulasan-berjalan__garis">Loved by travellers</span> from all over
      </h2>

      <PitaBerjalan
        className="ulasan-berjalan__pita"
        atas={ULASAN_ATAS.map((u) => <KartuUlasan key={u.nama} ulasan={u} />)}
        bawah={ULASAN_BAWAH.map((u) => <KartuUlasan key={u.nama} ulasan={u} />)}
      />
    </section>
  );
}

export default UlasanBerjalan;

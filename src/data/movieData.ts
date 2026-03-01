export interface CastMember {
    id: string;
    name: string;
    role: string;
    image: string;
}

export interface Review {
    id: string;
    author: string;
    rating: number;
    comment: string;
    date: string;
}

export interface Movie {
    id: string;
    title: string;
    year: number;
    releaseDate: string;
    genre: string[];
    rating: number;
    duration: string;
    description: string;
    poster: string;
    hero: string;
    director: string;
    cast: CastMember[];
    reviews: Review[];
    recommendationIds: string[];
    emoji: string;
    upcoming: boolean;
    studio?: string;
    languages?: string[];
}

// Helper: returns local path; React/Vite will serve from public/movies/
// Place your image files in: public/movies/<filename>
const m = (filename: string) => `/movies/${filename}`;

export const movieGenres = [
    { id: 'action', label: 'Action', gradient: 'from-red-600 to-orange-600', emoji: '💥' },
    { id: 'romance', label: 'Romance', gradient: 'from-pink-500 to-rose-600', emoji: '❤️' },
    { id: 'thriller', label: 'Thriller', gradient: 'from-gray-700 to-gray-900', emoji: '🎭' },
    { id: 'comedy', label: 'Comedy', gradient: 'from-yellow-500 to-amber-500', emoji: '😂' },
    { id: 'drama', label: 'Drama', gradient: 'from-blue-600 to-indigo-700', emoji: '🎬' },
    { id: 'historical', label: 'Historical', gradient: 'from-amber-700 to-yellow-900', emoji: '⚔️' },
    { id: 'horror', label: 'Horror', gradient: 'from-purple-900 to-black', emoji: '👻' },
    { id: 'mythology', label: 'Mythology', gradient: 'from-orange-600 to-red-800', emoji: '🔱' },
];

export const mockMovies: Movie[] = [
    // ─────────────────────────────────────────────────────────────────────────
    // 1. DHURANDHAR 2
    // ─────────────────────────────────────────────────────────────────────────
    {
        id: 'movie_1',
        title: 'Dhurandhar 2: The Revenge',
        year: 2026,
        releaseDate: '19 March 2026',
        genre: ['Action', 'Thriller'],
        rating: 9.0,
        duration: 'TBA',
        emoji: '🎖️',
        upcoming: true,
        studio: 'Jio Studios & B62 Studios',
        languages: ['Hindi'],
        description: `Presented by Jio Studios and B62 Studios, "Dhurandhar 2: The Revenge" is the high-octane sequel to the hit spy thriller Dhurandhar, directed by Aditya Dhar — the visionary behind the blockbuster Uri. Ranveer Singh returns as India's most lethal intelligence agent, now on a mission driven by revenge.

The story escalates the global stakes with a complex web of undercover operations, cross-border terrorism, and shocking betrayals. The teaser poster depicts a split composition illustrating a global mission alongside internal conflicts — central to which is Ranveer Singh in a fierce tactical undercover outfit, face partially covered, assault rifle in hand, running through a war-ravaged street.

Key visual elements include R. Madhavan in a high-tech IB command center surrounded by maps and data screens; Arjun Rampal and a shadowy Emraan Hashmi in a dark setting hinting at ISI connections; and Sara Arjun in a deeply emotional scene capturing a tragic story element. Symbolic iconography includes a crumpled Pakistan Awami Party (PAP) flag, a wall with red-string connections referencing the 26/11 attacks, and a barbed-wire fence representing the India-Pakistan border.

The title "DHURANDHAR 2: THE REVENGE" features a massive stylised '2' with a dragon-like head integrated, rendered in metallic gold and red. The film is set to release on 19 March 2026, coinciding with Eid, Ugadi, and Gudi Padwa.`,
        poster: m('dhurandhar2.jpg'),
        hero: m('dhurandhar2.jpg'),
        director: 'Aditya Dhar',
        cast: [
            { id: 'c1', name: 'Ranveer Singh', role: 'Lead Agent', image: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=200' },
            { id: 'c2', name: 'Akshaye Khanna', role: 'Supporting Role', image: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=200' },
            { id: 'c3', name: 'Emraan Hashmi', role: 'Shadowy Antagonist', image: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=200' },
            { id: 'c4', name: 'R. Madhavan', role: 'IB Command Officer', image: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=200' },
            { id: 'c5', name: 'Arjun Rampal', role: 'Dark Agent', image: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=200' },
            { id: 'c6', name: 'Sara Arjun', role: 'Tragic Element', image: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=200' },
        ],
        reviews: [
            { id: 'r1', author: 'ActionFan_99', rating: 9, comment: 'Uri was a masterpiece and this looks even BIGGER. Aditya Dhar cannot miss!', date: '2026-01-10' },
            { id: 'r2', author: 'BollywoodInsider', rating: 9, comment: 'Ranveer Singh in a spy role is going to be absolutely explosive. Dragon in the title is genius!', date: '2026-01-15' },
        ],
        recommendationIds: ['movie_4', 'movie_6', 'movie_2'],
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 2. TOXIC
    // ─────────────────────────────────────────────────────────────────────────
    {
        id: 'movie_2',
        title: 'Toxic: A Fairy Tale for Grown‑Ups',
        year: 2026,
        releaseDate: '19 March 2026',
        genre: ['Action', 'Thriller', 'Drama'],
        rating: 8.8,
        duration: 'TBA',
        emoji: '🧨',
        upcoming: true,
        studio: 'KVN Productions & Monster Mind Creations',
        languages: ['Kannada', 'Hindi', 'Telugu', 'Tamil', 'Malayalam', 'English'],
        description: `Directed by Geetu Mohandas and produced by Venkat K. Narayana and Yash under KVN Productions and Monster Mind Creations, "Toxic: A Fairy Tale for Grown‑Ups" is one of the most expensive Indian films ever made, with a reported budget of ₹600 crore.

Set in the coastal paradise of Goa between the early 1940s and the 1970s, the film unveils the rise of a powerful drug cartel operating behind a facade of sun-soaked beaches and vibrant culture — manipulating lives through fear and betrayal. Yash stars in a dual role, one of which is "Raya," a ruthless gangster.

Official announcements confirmed in December 2023, the script was co-written by Geetu Mohandas and Yash. Cinematography by the acclaimed Rajeev Ravi. Principal photography ran from August 2024 to October 2025 across Bengaluru, Mumbai, Goa, Thoothukudi, and Jaipur, shot simultaneously in Kannada and English.

Distribution highlights: Telugu rights (AP & Telangana) sold for ₹120 crore to Sri Venkateswara Creations; Tamil rights for ₹63 crore; Kerala distribution by E4 Entertainment; North India by AA Films (Anil Thadani); music rights by Zee Music Company.

Toxic releases in IMAX on 19 March 2026 — the same day as Dhurandhar 2 — creating one of Indian cinema's biggest box office clashes.`,
        poster: m('toxic.jpg'),
        hero: m('toxic.jpg'),
        director: 'Geetu Mohandas',
        cast: [
            { id: 'c7', name: 'Yash', role: 'Raya (Dual Role)', image: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=200' },
            { id: 'c8', name: 'Kiara Advani', role: 'Nadia', image: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=200' },
            { id: 'c9', name: 'Nayanthara', role: 'Ganga', image: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=200' },
            { id: 'c10', name: 'Huma Qureshi', role: 'Elizabeth', image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200' },
            { id: 'c11', name: 'Tara Sutaria', role: 'Rebecca', image: 'https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg?auto=compress&cs=tinysrgb&w=200' },
            { id: 'c12', name: 'Akshay Oberoi', role: 'Tony (Retro Aesthetic)', image: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=200' },
            { id: 'c13', name: 'Sudev Nair', role: 'Karmadi', image: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=200' },
        ],
        reviews: [
            { id: 'r3', author: 'KGFFan_Forever', rating: 9, comment: 'Yash in a period crime drama with a ₹600 crore budget? Instant blockbuster.', date: '2026-01-20' },
            { id: 'r4', author: 'CinemaScope', rating: 9, comment: 'Rajeev Ravi cinematography + Geetu Mohandas direction = visual masterpiece incoming.', date: '2026-01-25' },
        ],
        recommendationIds: ['movie_1', 'movie_4', 'movie_7'],
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 3. TU MERI MAIN TERA
    // ─────────────────────────────────────────────────────────────────────────
    {
        id: 'movie_3',
        title: 'Tu Meri Main Tera Main Tera Tu Meri',
        year: 2026,
        releaseDate: '15 August 2026',
        genre: ['Romance', 'Drama'],
        rating: 8.0,
        duration: 'TBA',
        emoji: '❤️',
        upcoming: true,
        studio: 'TBA',
        languages: ['Hindi'],
        description: `Directed by Priya Sharma, "Tu Meri Main Tera Main Tera Tu Meri" is an upcoming Hindi-language romantic drama starring Kartik Aaryan and Parineeti Chopra, scheduled for a grand Independence Day release on 15 August 2026.

The title evokes the timeless spirit of classic Bollywood romance — it pays tribute to the iconic 1968 Dev Anand classic of the same name (directed by Vijay Anand, starring Dev Anand, Sharmila Tagore, and Ashok Kumar), while reimagining the feeling for a modern audience.

The film promises a heartfelt love story filled with charm, chemistry, emotional depth, and the kind of unforgettable moments that define larger-than-life Bollywood romance. Kartik Aaryan and Parineeti Chopra bring contrasting energies — his boyish charisma and her effortless depth — that are expected to create a compelling on-screen pairing.

With its patriotic release date and a story rooted in the very soul of Hindi cinema, this film is positioned as a major theatrical event of the 2026 Independence Day weekend.`,
        poster: m('tu_meri.jpg'),
        hero: m('tu_meri.jpg'),
        director: 'Priya Sharma',
        cast: [
            { id: 'c14', name: 'Kartik Aaryan', role: 'Lead', image: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=200' },
            { id: 'c15', name: 'Parineeti Chopra', role: 'Lead', image: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=200' },
        ],
        reviews: [
            { id: 'r5', author: 'RomanceFan', rating: 8, comment: 'Kartik and Parineeti on Independence Day? Perfect summer treat!', date: '2026-01-25' },
        ],
        recommendationIds: ['movie_9', 'movie_11', 'movie_5'],
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 4. BATTLE OF GALWAN
    // ─────────────────────────────────────────────────────────────────────────
    {
        id: 'movie_4',
        title: 'Battle of Galwan',
        year: 2026,
        releaseDate: '17 April 2026',
        genre: ['Action', 'Drama', 'Historical'],
        rating: 9.2,
        duration: 'TBA',
        emoji: '💥',
        upcoming: true,
        studio: 'TBA',
        languages: ['Hindi'],
        description: `Directed by Apoorva Lakhia, "Battle of Galwan" is a powerful war drama based on the true events of the Galwan Valley clash of June 15–16, 2020 — a brutal hand-to-hand standoff between Indian Army soldiers and China's PLA at approximately 15,000 feet above sea level in Ladakh.

The real clash broke a 45-year period without fatalities on the LAC. Twenty Indian soldiers were killed, including the commanding officer of the 16th Bihar Regiment, Colonel B. Santosh Babu — a central figure in the film. Salman Khan stars as Colonel Bikkumalla Santosh Babu, with Chitrangada Singh also in the cast.

A teaser trailer was released on Salman Khan's 60th birthday, December 27, 2025, sparking significant international attention — and controversy — over its bold depiction of the conflict.

The film depicts the extraordinary courage of Indian soldiers who fought in minus-temperature, high-altitude conditions, using makeshift weapons in a life-or-death confrontation that reshaped India-China bilateral relations and triggered massive ongoing military reinforcements across Ladakh.`,
        poster: m('battle_of_galwan.jpg'),
        hero: m('battle_of_galwan.jpg'),
        director: 'Apoorva Lakhia',
        cast: [
            { id: 'c16', name: 'Salman Khan', role: 'Colonel B. Santosh Babu', image: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=200' },
            { id: 'c17', name: 'Chitrangada Singh', role: 'Supporting Role', image: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=200' },
        ],
        reviews: [
            { id: 'r6', author: 'PatriotFan', rating: 9, comment: 'Salman as Colonel Santosh Babu — gives me goosebumps! Galwan deserved this tribute.', date: '2026-02-01' },
            { id: 'r7', author: 'WarCinema', rating: 9, comment: 'The teaser alone is spine-chilling. Apoorva Lakhia knows how to handle real stories.', date: '2026-02-05' },
        ],
        recommendationIds: ['movie_1', 'movie_5', 'movie_11'],
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 5. RAMAYANA: PART 1
    // ─────────────────────────────────────────────────────────────────────────
    {
        id: 'movie_5',
        title: 'Ramayana: Part 1',
        year: 2026,
        releaseDate: 'Diwali 2026',
        genre: ['Mythology', 'Drama', 'Action'],
        rating: 9.5,
        duration: 'TBA',
        emoji: '⚔️',
        upcoming: true,
        studio: 'DNEG Productions',
        languages: ['Hindi', 'Tamil', 'Telugu', 'Malayalam', 'Kannada'],
        description: `Directed by Nitesh Tiwari (known for the blockbuster Dangal) and produced by Namit Malhotra, "Ramayana: Part 1" is one of the most ambitious and expensive films in the history of Indian cinema. It is planned as a two-part epic, with Part 1 releasing Diwali 2026 and Part 2 on Diwali 2027.

The film adapts the early chapters of the ancient Ramayana with a groundbreaking, globally resonant cinematic vision. The production team collaborates with DNEG — the Oscar-winning VFX studio behind Dune and Oppenheimer — to create a darker, atmospheric, and profoundly detailed visual world. Leaked pre-visualization imagery suggests skeletal architecture, dramatic rain-swept landscapes, and viscerally detailed mythology brought to life at an unprecedented scale.

Widely reported cast (yet to be officially confirmed): Ranbir Kapoor as Lord Ram, Sai Pallavi as Goddess Sita, Yash as Raavan, and Sunny Deol as Lord Hanuman — a casting combination that has already sent the internet into a frenzy.

Beyond Nitesh Tiwari's film, a separate PVCU (Prasanth Varma Cinematic Universe) sequel titled "Jai Hanuman" (starring Rishab Shetty) and an animated Ramayana are also in the works — but this Part 1 stands apart as the definitive pan-India live-action adaptation of the age.`,
        poster: m('ramayana.jpg'),
        hero: m('ramayana.jpg'),
        director: 'Nitesh Tiwari',
        cast: [
            { id: 'c18', name: 'Ranbir Kapoor', role: 'Lord Ram', image: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=200' },
            { id: 'c19', name: 'Sai Pallavi', role: 'Goddess Sita', image: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=200' },
            { id: 'c20', name: 'Yash', role: 'Raavan', image: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=200' },
            { id: 'c21', name: 'Sunny Deol', role: 'Lord Hanuman', image: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=200' },
        ],
        reviews: [
            { id: 'r8', author: 'MythologyFan', rating: 10, comment: 'The most awaited Indian film in history. DNEG VFX + Nitesh Tiwari direction = legend!', date: '2026-01-15' },
            { id: 'r9', author: 'CinematicVibes', rating: 9, comment: 'Ranbir as Ram, Yash as Raavan, Sunny as Hanuman — this casting is HISTORIC.', date: '2026-01-20' },
        ],
        recommendationIds: ['movie_2', 'movie_4', 'movie_6'],
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 6. JAILER 2
    // ─────────────────────────────────────────────────────────────────────────
    {
        id: 'movie_6',
        title: 'Jailer 2',
        year: 2026,
        releaseDate: 'TBA 2026',
        genre: ['Action', 'Thriller', 'Drama'],
        rating: 8.9,
        duration: 'TBA',
        emoji: '🪓',
        upcoming: true,
        studio: 'Sun Pictures',
        languages: ['Tamil', 'Hindi', 'Telugu', 'Malayalam', 'Kannada'],
        description: `The officially confirmed sequel to the 2023 pan-India blockbuster "Jailer," this film brings back Rajinikanth as "Tiger" Muthuvel Pandian — the stylish, relentless anti-hero who took Indian cinema by storm.

Directed once again by Nelson Dilipkumar (currently deep in the scriptwriting phase) and produced by the iconic Sun Pictures banner, Jailer 2 is expected to expand on the narrative of Muthuvel Pandian and his vast, cross-country connections — including hinted storylines from his time as the jailer of Tihar Jail in Delhi.

The sequel is anticipated to raise the stakes significantly — with new antagonist challenges, the return of key characters from the original, and possibly new pan-Indian A-list additions continuing the tradition of ensemble casting set by the first film (which featured Mohanlal, Shiva Rajkumar, and Jackie Shroff).

No official release date has been set yet, as the film is in early pre-production with filming expected to begin after Rajinikanth completes his current commitments. Fans across India and the world are waiting with bated breath.`,
        poster: m('jailer2.jpg'),
        hero: m('jailer2.jpg'),
        director: 'Nelson Dilipkumar',
        cast: [
            { id: 'c22', name: 'Rajinikanth', role: 'Tiger Muthuvel Pandian', image: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=200' },
        ],
        reviews: [
            { id: 'r10', author: 'ThalaivaFan', rating: 9, comment: 'Rajini is back! The first Jailer was a phenomenon — Part 2 will be bigger.', date: '2026-02-10' },
        ],
        recommendationIds: ['movie_1', 'movie_2', 'movie_5'],
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 7. DRISHYAM 3
    // ─────────────────────────────────────────────────────────────────────────
    {
        id: 'movie_7',
        title: 'Drishyam 3',
        year: 2026,
        releaseDate: 'TBA 2026',
        genre: ['Thriller', 'Drama'],
        rating: 8.7,
        duration: 'TBA',
        emoji: '💔',
        upcoming: true,
        studio: 'TBA',
        languages: ['Malayalam', 'Hindi'],
        description: `The third chapter in the celebrated Drishyam crime thriller franchise is officially in development and planned as a coordinated multi-language release in both Malayalam and Hindi. The script is being finalized and filming is yet to begin.

Malayalam Version (directed by Jeethu Joseph): Mohanlal returns as Georgekutty alongside Meena (as Rani George), Ansiba Hassan (as Anju George), and Esther Anil (as Anu George) — the complete George family reprises their iconic roles.

Hindi Version: Ajay Devgn reprises his acclaimed role as Vijay Salgaonkar, joined by new cast additions including Prakash Raj (confirmed), Jaideep Ahlawat (reported), and Shreyas Talpade (reported). Notably, Akshaye Khanna — who appeared in Drishyam 2 — has reportedly exited the franchise and will not appear in Part 3.

Known for its impossibly clever twists, gripping cat-and-mouse investigation drama, and emotionally devastating family stakes, Drishyam 3 is one of the most anticipated Indian film sequels. The first two films are widely regarded as benchmarks for screenplay writing in Indian cinema — and the third promises to surpass them.`,
        poster: m('drishyam3.jpg'),
        hero: m('drishyam3.jpg'),
        director: 'Jeethu Joseph (Malayalam) / TBA (Hindi)',
        cast: [
            { id: 'c23', name: 'Mohanlal', role: 'Georgekutty (Malayalam)', image: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=200' },
            { id: 'c24', name: 'Ajay Devgn', role: 'Vijay Salgaonkar (Hindi)', image: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=200' },
            { id: 'c25', name: 'Meena', role: 'Rani George', image: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=200' },
            { id: 'c26', name: 'Jaideep Ahlawat', role: 'TBA (Hindi)', image: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=200' },
            { id: 'c27', name: 'Prakash Raj', role: 'Confirmed Role', image: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=200' },
        ],
        reviews: [
            { id: 'r11', author: 'ThrillerNerd', rating: 9, comment: 'Drishyam 2 ended on a cliff-hanger that kept me up nights. Part 3 cannot come soon enough!', date: '2026-01-18' },
        ],
        recommendationIds: ['movie_9', 'movie_10', 'movie_2'],
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 8. BHOOTH BANGLA
    // ─────────────────────────────────────────────────────────────────────────
    {
        id: 'movie_8',
        title: 'Bhooth Bangla',
        year: 2025,
        releaseDate: 'Diwali 2025',
        genre: ['Horror', 'Comedy'],
        rating: 7.8,
        duration: 'TBA',
        emoji: '🧟',
        upcoming: true,
        studio: 'TBA',
        languages: ['Hindi'],
        description: `"Bhooth Bangla" is a highly anticipated horror-comedy marking the dream reunion of Akshay Kumar and veteran director Priyadarshan — a combination that previously delivered cult comedy classics like Hera Pheri, Bhool Bhulaiyaa, and Hungama.

Scheduled for a Diwali 2025 theatrical release, the film brings together a powerhouse ensemble cast including Akshay Kumar, Tabu, Paresh Rawal, Rajpal Yadav, Wamiqa Gabbi (confirmed as the female lead), Mithila Palkar (reportedly playing Akshay's sister), Asrani, Manoj Joshi, and Jisshu Sengupta.

The film blends genuinely terrifying horror elements with trademark laugh-out-loud comedy — continuing the beloved horror-comedy genre tradition that Priyadarshan helped define in Hindi cinema. The combination of Akshay Kumar's comic timing, Tabu's dramatic depth, and Paresh Rawal and Rajpal Yadav's legendary comedy partnership makes this one of the most exciting ensemble comedies in recent memory.`,
        poster: m('bhooth_bangla.jpg'),
        hero: m('bhooth_bangla.jpg'),
        director: 'Priyadarshan',
        cast: [
            { id: 'c28', name: 'Akshay Kumar', role: 'Lead', image: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=200' },
            { id: 'c29', name: 'Tabu', role: 'Lead', image: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=200' },
            { id: 'c30', name: 'Paresh Rawal', role: 'Comedy Lead', image: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=200' },
            { id: 'c31', name: 'Rajpal Yadav', role: 'Comedy', image: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=200' },
            { id: 'c32', name: 'Wamiqa Gabbi', role: 'Female Lead', image: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=200' },
            { id: 'c33', name: 'Mithila Palkar', role: 'Akshay\'s Sister', image: 'https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg?auto=compress&cs=tinysrgb&w=200' },
        ],
        reviews: [
            { id: 'r12', author: 'ComedyHorror_Fan', rating: 8, comment: 'Akshay + Priyadarshan reunion with Paresh and Rajpal Yadav? That\'s pure gold!', date: '2026-02-01' },
        ],
        recommendationIds: ['movie_12', 'movie_3', 'movie_7'],
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 9. AWARAPAN 2
    // ─────────────────────────────────────────────────────────────────────────
    {
        id: 'movie_9',
        title: 'Awarapan 2',
        year: 2026,
        releaseDate: 'TBA 2026',
        genre: ['Romance', 'Thriller', 'Drama'],
        rating: 8.2,
        duration: 'TBA',
        emoji: '🎭',
        upcoming: true,
        studio: 'Vishesh Films',
        languages: ['Hindi'],
        description: `In development at Vishesh Films under producers Mukesh Bhatt and Vishesh Bhatt, "Awarapan 2" is the long-awaited sequel to the 2007 cult classic "Awarapan" — a film that defined Emraan Hashmi's brooding, conflicted anti-hero persona.

Emraan Hashmi reprises his iconic role as Shivam, the tortured soul caught between love, loyalty, and survival. Disha Patani plays the female lead, and the legendary Shabana Azmi joins the cast in a significant role. Remarkably, the sequel is directed by Nitin Kakkar — taking over the reins from the original director Mohit Suri.

Primary production is scheduled to begin soon. The film continues the narrative of a deeply flawed man navigating a world of crime, loss, and redemption — blending raw emotional intensity with the gritty criminal underworld that made the original so unforgettable. Emraan Hashmi's return to this iconic role is one of the most anticipated comebacks in Hindi cinema.`,
        poster: m('awarapan2.jpg'),
        hero: m('awarapan2.jpg'),
        director: 'Nitin Kakkar',
        cast: [
            { id: 'c34', name: 'Emraan Hashmi', role: 'Shivam (Lead)', image: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=200' },
            { id: 'c35', name: 'Disha Patani', role: 'Female Lead', image: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=200' },
            { id: 'c36', name: 'Shabana Azmi', role: 'Key Role', image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200' },
        ],
        reviews: [
            { id: 'r13', author: 'EmraanFan', rating: 8, comment: 'Emraan as Shivam again with Shabana Azmi? Vishesh Films always delivers emotional gut-punches.', date: '2026-01-22' },
        ],
        recommendationIds: ['movie_3', 'movie_7', 'movie_10'],
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 10. RAHU KETU
    // ─────────────────────────────────────────────────────────────────────────
    {
        id: 'movie_10',
        title: 'Rahu Ketu',
        year: 2026,
        releaseDate: '16 January 2026 — Released',
        genre: ['Comedy', 'Drama'],
        rating: 7.5,
        duration: 'TBA',
        emoji: '🔮',
        upcoming: false,
        studio: 'TBA',
        languages: ['Hindi'],
        description: `"Rahu Ketu" is a released Hindi-language comedy-fantasy film that premiered in cinemas on 16 January 2026. Directed by Vipul Vig (who also co-wrote the script), the film is not a mythological retelling of the serpentine celestial bodies — instead, it uses the astrological names for a hilariously jinxed duo who stumble upon a magical notebook that throws them into absolute, unpredictable chaos.

Pulkit Samrat plays Ketu and Varun Sharma plays Rahu — two lovable, bumbling misfits whose misadventures lead them straight into the orbit of a drug mafia led by Mordechai (Chunky Panday in a scene-stealing role). Shalini Pandey plays Minu Taxi, the female lead, with Piyush Mishra and Manu Rishi Chadha rounding out a memorable supporting cast.

The film is a crazy, laugh-out-loud ride through folklore, fantasy, and utter comedic mayhem — with unexpected heart buried beneath the madness. Varun Sharma's comedic genius (beloved since Fukrey) and Pulkit Samrat's easy charm make for an irresistible on-screen pair.`,
        poster: m('rahu_ketu.jpg'),
        hero: m('rahu_ketu.jpg'),
        director: 'Vipul Vig',
        cast: [
            { id: 'c37', name: 'Pulkit Samrat', role: 'Ketu', image: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=200' },
            { id: 'c38', name: 'Varun Sharma', role: 'Rahu', image: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=200' },
            { id: 'c39', name: 'Shalini Pandey', role: 'Minu Taxi', image: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=200' },
            { id: 'c40', name: 'Chunky Panday', role: 'Mordechai (Drug Mafia)', image: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=200' },
            { id: 'c41', name: 'Piyush Mishra', role: 'Supporting', image: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=200' },
        ],
        reviews: [
            { id: 'r14', author: 'ComedyKing', rating: 7, comment: 'Varun Sharma is always a vibe. The Rahu-Ketu duo is chaotically hilarious!', date: '2026-01-17' },
        ],
        recommendationIds: ['movie_8', 'movie_3', 'movie_9'],
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 11. AZAD BHARATH
    // ─────────────────────────────────────────────────────────────────────────
    {
        id: 'movie_11',
        title: 'Azad Bharath',
        year: 2026,
        releaseDate: '2 January 2026 — Released',
        genre: ['Historical', 'Drama'],
        rating: 8.3,
        duration: 'TBA',
        emoji: '🎖',
        upcoming: false,
        studio: 'TBA',
        languages: ['Hindi'],
        description: `"Azad Bharath" is a released Hindi patriotic historical drama that arrived in theatres on 2 January 2026. Written, directed, and produced by Roopa Iyer, the film shines a long-overdue light on a deeply underrepresented chapter of India's independence movement — the women of the Indian National Army (INA) and the Rani of Jhansi Regiment.

Shreyas Talpade delivers a powerful portrayal of Netaji Subhash Chandra Bose, the visionary who formed the INA and galvanised the women's brigade that fought for independence with extraordinary courage. Roopa Iyer herself plays Neera Arya — the real protagonist of the story, a fierce soldier of the INA's Rani Jhansi Regiment whose story has been largely untold until now.

The supporting cast includes Suresh Oberoi, Indira Tiwari, and Priyanshu Chatterjee. The film is a tribute to the patriots whose sacrifices are rarely depicted in mainstream cinema — immersive, emotional, and essential.`,
        poster: m('azad_bharath.jpg'),
        hero: m('azad_bharath.jpg'),
        director: 'Roopa Iyer',
        cast: [
            { id: 'c42', name: 'Shreyas Talpade', role: 'Netaji Subhash Chandra Bose', image: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=200' },
            { id: 'c43', name: 'Roopa Iyer', role: 'Neera Arya (INA Soldier)', image: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=200' },
            { id: 'c44', name: 'Suresh Oberoi', role: 'Supporting', image: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=200' },
            { id: 'c45', name: 'Indira Tiwari', role: 'Supporting', image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200' },
            { id: 'c46', name: 'Priyanshu Chatterjee', role: 'Supporting', image: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=200' },
        ],
        reviews: [
            { id: 'r15', author: 'HistoryBuff', rating: 8, comment: 'Rani of Jhansi Regiment finally gets its due! Shreyas as Netaji is brilliant.', date: '2026-01-05' },
        ],
        recommendationIds: ['movie_4', 'movie_5', 'movie_7'],
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 12. SAFIA / SAFDAR
    // ─────────────────────────────────────────────────────────────────────────
    {
        id: 'movie_12',
        title: 'Safia / Safdar',
        year: 2026,
        releaseDate: '16 January 2026 — ZEE5',
        genre: ['Drama'],
        rating: 8.6,
        duration: 'TBA',
        emoji: '🎬',
        upcoming: false,
        studio: 'ZEE5',
        languages: ['Hindi'],
        description: `Released directly on ZEE5 on 16 January 2026, "Safia / Safdar" is a coming-of-age drama written by Mir Ali Husain and directed by the acclaimed cinematographer-turned-filmmaker Baba Azmi, making a celebrated directorial return.

The film follows Safia — a young girl's deeply personal battle with society for the right to her own identity, carried forward through the unconditional support of her family. Aditi Subedi delivers a breakout performance as the lead character Safia, in a role that demands extraordinary emotional range and authenticity.

The supporting cast features the legendary Naseeruddin Shah, Kanwaljit, and Siddharth Menon, bringing immense gravitas to the intimate, human-scale narrative. The film has been widely acclaimed on the international film festival circuit for its quiet power, nuanced storytelling, and sensitive exploration of identity and societal pressure in contemporary India.

A small, resonant, and deeply necessary film — "Safia" is the kind of cinema that stays with you long after the credits roll.`,
        poster: m('safia.jpg'),
        hero: m('safia.jpg'),
        director: 'Baba Azmi',
        cast: [
            { id: 'c47', name: 'Aditi Subedi', role: 'Safia (Lead)', image: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=200' },
            { id: 'c48', name: 'Naseeruddin Shah', role: 'Key Role', image: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=200' },
            { id: 'c49', name: 'Kanwaljit', role: 'Supporting', image: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=200' },
            { id: 'c50', name: 'Siddharth Menon', role: 'Supporting', image: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=200' },
        ],
        reviews: [
            { id: 'r16', author: 'FilmFestivalFan', rating: 9, comment: 'Naseeruddin Shah at his best. Aditi Subedi is a revelation. Baba Azmi is a born director.', date: '2026-01-17' },
            { id: 'r17', author: 'OTTLover', rating: 8, comment: 'Quietly brilliant. Festival circuit darling for a reason. ZEE5 made a great call.', date: '2026-01-18' },
        ],
        recommendationIds: ['movie_3', 'movie_9', 'movie_10'],
    },
];

export const getMovieById = (id: string): Movie | undefined => {
    return mockMovies.find(m => m.id === id);
};

export const getMoviesByGenre = (genre: string): Movie[] => {
    return mockMovies.filter(m => m.genre.some(g => g.toLowerCase() === genre.toLowerCase()));
};

export const getRecommendedMovies = (ids: string[]): Movie[] => {
    return ids.map(id => mockMovies.find(m => m.id === id)).filter(Boolean) as Movie[];
};


export type Trainer = {
  id: number;
  name: string;
  specialty: string;
  location: string;
  experience: string;
  rating: number;
  price: number;
  image: string;
  available: boolean;
};

export const trainers: Trainer[] = [
  {
    id: 1,
    name: "Kasun Perera",
    specialty: "Strength & Muscle Building",
    location: "Colombo",
    experience: "5 years experience",
    rating: 4.9,
    price: 3500,
    image:
      "https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=700&q=80",
    available: true,
  },
  {
    id: 2,
    name: "Nethmi Silva",
    specialty: "Weight Loss & Fitness",
    location: "Nugegoda",
    experience: "4 years experience",
    rating: 4.8,
    price: 3000,
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=700&q=80",
    available: true,
  },
  {
    id: 3,
    name: "Amal Fernando",
    specialty: "Bodybuilding & Conditioning",
    location: "Dehiwala",
    experience: "7 years experience",
    rating: 5.0,
    price: 4000,
    image:
      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=700&q=80",
    available: false,
  },
  {
    id: 4,
    name: "Dinithi Jayawardena",
    specialty: "Functional Training",
    location: "Maharagama",
    experience: "3 years experience",
    rating: 4.7,
    price: 2500,
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80",
    available: true,
  },
];

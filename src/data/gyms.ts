
export type Gym = {
  id: number;
  name: string;
  location: string;
  category: string;
  rating: number;
  priceFrom: number;
  image: string;
  features: string[];
};

export const gyms: Gym[] = [
  {
    id: 1,
    name: "Iron House Fitness",
    location: "Colombo 05",
    category: "Strength & Conditioning",
    rating: 4.9,
    priceFrom: 8500,
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1000&q=80",
    features: ["Free Weights", "Personal Training"],
  },
  {
    id: 2,
    name: "Elevate Fitness Club",
    location: "Nugegoda",
    category: "Modern Fitness Club",
    rating: 4.8,
    priceFrom: 6500,
    image:
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=1000&q=80",
    features: ["Cardio", "Group Classes"],
  },
  {
    id: 3,
    name: "Power Zone Gym",
    location: "Dehiwala",
    category: "Strength & Bodybuilding",
    rating: 4.7,
    priceFrom: 5000,
    image:
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1000&q=80",
    features: ["Strength Equipment", "Flexible Plans"],
  },
];

export interface Reward {
  id: number;        // points cost — used as ID
  name: string;
  description: string;
  points: number;
}

export const REWARDS: Reward[] = [
  { id: 200,  name: "Free Coffee",             description: "Any hot or cold coffee from our menu.", points: 200  },
  { id: 400,  name: "Free Belgium Brownie",    description: "Our most loved creation — yours free.", points: 400  },
  { id: 600,  name: "Free Milkshake",          description: "Any milkshake of your choice.",         points: 600  },
  { id: 1000, name: "Free Falooda",            description: "Any falooda from our signature range.",  points: 1000 },
  { id: 1500, name: "20% Off Bill",            description: "20% discount on your total bill (max ₹200).", points: 1500 },
  { id: 2500, name: "Chocoberry Mess + Note",  description: "Free Chocoberry Mess with a personal thank-you note from us.", points: 2500 },
];

export function getReward(id: number): Reward | undefined {
  return REWARDS.find((r) => r.id === id);
}

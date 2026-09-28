/* Sparta Café — menu data. Prices in AED, VAT added at checkout. */

export const img = (id: string, w = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=72`;

export type Tag = "signature" | "veg" | "vegan" | "gf" | "spicy" | "new";
export type Kind = "drink" | "food";

export interface Category { id: string; name: string; ar: string; blurb: string }
export interface Item {
  id: string; cat: string; kind: Kind; name: string; price: number;
  photo: string; desc: string; tags: Tag[]; kcal: number;
}
export interface Choice { id: string; label: string; add: number }
export interface OptionGroup { id: string; label: string; choices: Choice[] }

export const categories: Category[] = [
  { id: "signature", name: "Signatures", ar: "المميز", blurb: "The plates and cups people cross the city for." },
  { id: "coffee", name: "Coffee", ar: "قهوة", blurb: "Roasted in-house every Tuesday. Single origin, always." },
  { id: "cold", name: "Cold & Tea", ar: "بارد", blurb: "For the other eleven months of Dubai summer." },
  { id: "breakfast", name: "Breakfast", ar: "فطور", blurb: "Served from 7 am until 4 pm, because brunch has no curfew." },
  { id: "plates", name: "Plates", ar: "أطباق", blurb: "Bigger appetites, terrace sunsets." },
  { id: "bakery", name: "Bakery", ar: "مخبز", blurb: "Laminated, proofed and baked before sunrise." },
  { id: "desserts", name: "Desserts", ar: "حلويات", blurb: "Finished to order by our pastry team." },
];

// kind: "drink" gets size + milk options; "food" gets a finishing option
export const items: Item[] = [
  { id: "saffron-latte", cat: "signature", kind: "drink", name: "Saffron Gold Latte", price: 42, photo: "1541167760496-1628856ab772", desc: "Double ristretto, Iranian saffron milk, a whisper of cardamom and 24k edible gold leaf.", tags: ["signature", "veg", "gf"], kcal: 190 },
  { id: "kunafa-croissant", cat: "signature", kind: "food", name: "Pistachio Kunafa Croissant", price: 38, photo: "1555507036-ab1f4038808a", desc: "Twice-baked croissant, pistachio frangipane, crisp kataifi and orange-blossom syrup.", tags: ["signature", "veg", "new"], kcal: 520 },
  { id: "opera-cake", cat: "signature", kind: "food", name: "Gold Leaf Opera", price: 58, photo: "1571115177098-24ec42ed204d", desc: "Seven layers of Joconde sponge, Arabica syrup, dark ganache and gilded glaze.", tags: ["signature", "veg"], kcal: 440 },
  { id: "date-cold-brew", cat: "signature", kind: "drink", name: "Date & Cardamom Cold Brew", price: 36, photo: "1461023058943-07fcbe16d735", desc: "18-hour Ethiopian cold brew over Khalas date cream and a cardamom cloud.", tags: ["signature", "veg", "gf"], kcal: 160 },

  { id: "flat-white", cat: "coffee", kind: "drink", name: "Flat White, Guji", price: 28, photo: "1485808191679-5f86510681a2", desc: "Washed Ethiopian Guji, notes of jasmine and apricot, silky micro-foam.", tags: ["veg", "gf"], kcal: 110 },
  { id: "spanish-latte", cat: "coffee", kind: "drink", name: "Spanish Latte", price: 30, photo: "1509042239860-f550ce710b93", desc: "Condensed-milk sweetness balanced by our house Brazil-Colombia blend.", tags: ["veg", "gf"], kcal: 210 },
  { id: "cortado", cat: "coffee", kind: "drink", name: "Cortado", price: 24, photo: "1572442388796-11668a67e53d", desc: "Equal parts espresso and warm milk. Short, strong, honest.", tags: ["veg", "gf"], kcal: 70 },
  { id: "chemex", cat: "coffee", kind: "drink", name: "Chemex for Two", price: 64, photo: "1442512595331-e89e73853f31", desc: "Rotating micro-lot, brewed tableside by your barista with tasting notes.", tags: ["vegan", "gf"], kcal: 10 },
  { id: "americano", cat: "coffee", kind: "drink", name: "Black Americano", price: 20, photo: "1514432324607-a09d9b4aefdd", desc: "Double shot, hot water, nothing to hide behind.", tags: ["vegan", "gf"], kcal: 5 },

  { id: "matcha", cat: "cold", kind: "drink", name: "Ceremonial Matcha Latte", price: 34, photo: "1515823064-d6e0c04616a7", desc: "Uji ceremonial-grade matcha whisked to order. Hot or over ice.", tags: ["veg", "gf"], kcal: 150 },
  { id: "pearl-tea", cat: "cold", kind: "drink", name: "Brown Sugar Pearl Tea", price: 32, photo: "1558857563-b371033873b8", desc: "Assam milk tea, slow-cooked brown sugar pearls, tiger stripes.", tags: ["veg", "new"], kcal: 330 },
  { id: "rose-shake", cat: "cold", kind: "drink", name: "Strawberry Rose Shake", price: 36, photo: "1579954115545-a95591f28bfc", desc: "Strawberries, Taifi rose water, vanilla bean gelato.", tags: ["veg", "gf"], kcal: 380 },
  { id: "mint-lime", cat: "cold", kind: "drink", name: "Mint Lime Sparkler", price: 26, photo: "1551538827-9c037cb4f32a", desc: "Fresh lime, garden mint and sparkling water. The Dubai classic, sharpened.", tags: ["vegan", "gf"], kcal: 90 },
  { id: "date-tonic", cat: "cold", kind: "drink", name: "Smoked Date Tonic", price: 34, photo: "1514362545857-3bc16c4c7d1b", desc: "Smoked date shrub, orange peel, rosemary and premium tonic. Zero proof.", tags: ["vegan", "gf", "signature"], kcal: 120 },

  { id: "truffle-eggs", cat: "breakfast", kind: "food", name: "Truffle Eggs on Sourdough", price: 58, photo: "1525351484163-7529414344d8", desc: "Free-range fried eggs, black truffle butter, chives, toasted house sourdough.", tags: ["veg"], kcal: 610 },
  { id: "brulee-toast", cat: "breakfast", kind: "food", name: "Crème Brûlée French Toast", price: 62, photo: "1484723091739-30a097e8f929", desc: "Brioche, torched custard crust, blueberries, banana and maple.", tags: ["veg", "signature"], kcal: 780 },
  { id: "souffle-pancakes", cat: "breakfast", kind: "food", name: "Honey Soufflé Pancakes", price: 56, photo: "1567620905732-2d1ec7ab7445", desc: "Three cloud-soft pancakes, Sidr honey, whipped ricotta and bee pollen.", tags: ["veg"], kcal: 690 },
  { id: "avocado-bowl", cat: "breakfast", kind: "food", name: "Avocado & Soft Egg Bowl", price: 54, photo: "1482049016688-2d3e1b311543", desc: "Jammy eggs, smashed avocado, baby spinach, dukkah and chili oil.", tags: ["veg", "gf"], kcal: 480 },
  { id: "full-breakfast", cat: "breakfast", kind: "food", name: "The Sparta Full Breakfast", price: 72, photo: "1533089860892-a7c6f0a88666", desc: "Eggs your way, beef bacon, turkey sausage, roast tomato, beans and toast.", tags: [], kcal: 1120 },

  { id: "wagyu-frites", cat: "plates", kind: "food", name: "Wagyu Striploin & Frites", price: 145, photo: "1600891964092-4316c288032e", desc: "MB6 Australian wagyu, triple-cooked frites, bone-marrow jus.", tags: ["gf"], kcal: 980 },
  { id: "seared-beef", cat: "plates", kind: "food", name: "Seared Beef, Chili & Lime", price: 118, photo: "1504674900247-0877df9cc836", desc: "Tataki-style beef, herb salad, toasted rice and nam jim.", tags: ["gf", "spicy"], kcal: 540 },
  { id: "buddha-bowl", cat: "plates", kind: "food", name: "Garden Buddha Bowl", price: 62, photo: "1512621776951-a57141f2eefd", desc: "Roast sweet potato, chickpeas, avocado, pickled cabbage, tahini-lemon.", tags: ["vegan", "gf"], kcal: 560 },
  { id: "wagyu-burger", cat: "plates", kind: "food", name: "Wagyu Brioche Burger", price: 89, photo: "1568901346375-23c9450c58cd", desc: "Smashed wagyu, aged cheddar, onion jam, pickles, milk-bun.", tags: [], kcal: 920 },
  { id: "ragu", cat: "plates", kind: "food", name: "Tagliatelle, Slow Beef Ragù", price: 78, photo: "1551183053-bf91a1d81141", desc: "Hand-cut egg pasta, eight-hour short-rib ragù, aged parmesan.", tags: [], kcal: 760 },

  { id: "cookie-trio", cat: "bakery", kind: "food", name: "Brown Butter Cookie Trio", price: 28, photo: "1558961363-fa8fdf82db35", desc: "Dark chocolate & sea salt, pistachio & white chocolate, date & tahini.", tags: ["veg"], kcal: 540 },
  { id: "sourdough", cat: "bakery", kind: "food", name: "Heritage Sourdough Loaf", price: 34, photo: "1509440159596-0249088772ff", desc: "72-hour ferment, spelt and rye, blistered crust. Take one home.", tags: ["vegan"], kcal: 1400 },
  { id: "berry-pie", cat: "bakery", kind: "food", name: "Berry Lattice Pie", price: 32, photo: "1464305795204-6f5bbfc7fb81", desc: "Mixed berries, all-butter lattice, served warm with crème fraîche.", tags: ["veg"], kcal: 470 },

  { id: "entremet", cat: "desserts", kind: "food", name: "Raspberry Pistachio Entremet", price: 48, photo: "1565958011703-44f9829ba187", desc: "Pistachio sponge, raspberry crémeux, vanilla chantilly.", tags: ["veg", "new"], kcal: 420 },
  { id: "ganache-cake", cat: "desserts", kind: "food", name: "Double Chocolate Ganache", price: 46, photo: "1578985545062-69928b1d9587", desc: "70% Valrhona sponge, ganache drip, cocoa nib crunch.", tags: ["veg"], kcal: 610 },
  { id: "high-tea", cat: "desserts", kind: "food", name: "High Tea Tower for Two", price: 180, photo: "1579372786545-d24232daf58c", desc: "Twelve petit fours, scones, clotted cream and a pot of rare tea. Served 2 to 6 pm.", tags: ["veg", "signature"], kcal: 1600 },
  { id: "panna-cotta", cat: "desserts", kind: "food", name: "Strawberry Panna Cotta", price: 38, photo: "1488477181946-6428a0291777", desc: "Madagascan vanilla, macerated strawberries, basil.", tags: ["gf"], kcal: 310 },
  { id: "brownie", cat: "desserts", kind: "food", name: "Salted Brownie, Oreo Crumb", price: 32, photo: "1606313564200-e75d5e30476c", desc: "Fudgy, salted, unapologetic. Warmed and served with gelato.", tags: ["veg"], kcal: 560 },
  { id: "crepes", cat: "desserts", kind: "food", name: "Crêpes Chantilly", price: 44, photo: "1587314168485-3236d6710814", desc: "Buttered crêpes, strawberries, Chantilly and an orange syrup.", tags: ["veg"], kcal: 520 },
];

export const options: Record<Kind, OptionGroup[]> = {
  drink: [
    { id: "size", label: "Size", choices: [{ id: "regular", label: "Regular", add: 0 }, { id: "large", label: "Large", add: 6 }] },
    { id: "milk", label: "Milk", choices: [{ id: "whole", label: "Whole", add: 0 }, { id: "oat", label: "Oat", add: 4 }, { id: "almond", label: "Almond", add: 4 }, { id: "camel", label: "Camel", add: 6 }] },
  ],
  food: [
    { id: "extra", label: "Make it special", choices: [{ id: "none", label: "As the chef intends", add: 0 }, { id: "gold", label: "Gold leaf finish", add: 15 }, { id: "gelato", label: "Scoop of gelato", add: 12 }] },
  ],
};

export const tagLabels: Record<Tag, string> = { signature: "Signature", veg: "Vegetarian", vegan: "Vegan", gf: "Gluten-free", spicy: "Spicy", new: "New" };

export const byId: Record<string, Item> = Object.fromEntries(items.map((i) => [i.id, i]));

export const pages = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/order", label: "Order" },
  { href: "/reserve", label: "Reserve" },
  { href: "/story", label: "Our Story" },
] as const;

/* Cart */
export interface CartLine { key: string; id: string; name: string; img: string; unit: number; qty: number; note: string }

const DEFAULT_LABELS = new Set(["Regular", "Whole", "As the chef intends"]);

export function lineFor(item: Item, chosen: Record<string, string> = {}, qty = 1): CartLine {
  const groups = options[item.kind];
  let unit = item.price;
  const labels: string[] = [];
  groups.forEach((g) => {
    const c = g.choices.find((x) => x.id === chosen[g.id]) ?? g.choices[0];
    unit += c.add;
    if (!DEFAULT_LABELS.has(c.label)) labels.push(c.label);
  });
  const key = item.id + "|" + groups.map((g) => chosen[g.id] ?? g.choices[0].id).join("-");
  return { key, id: item.id, name: item.name, img: img(item.photo, 200), unit, qty, note: labels.join(" · ") };
}

export const money = (n: number) => "AED " + n.toFixed(2);

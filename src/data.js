import { CalendarDays, Music2, UsersRound } from "lucide-react";

export const LINKS = {
  facebook: "https://www.facebook.com/pantareiband",
  instagram: "https://www.instagram.com/grupapantarei/",
};

export const NAV = [
  { href: "#about", label: "За нас" },
  { href: "#occasions", label: "Настапи" },
  { href: "#band", label: "Бендот" },
  { href: "#gallery", label: "Галерија" },
];

export const MARQUEE_ITEMS = [
  "СВАДБИ",
  "КЛУБОВИ",
  "ПРОСЛАВИ",
  "КОРПОРАТИВНИ НАСТАНИ",
  "МУЗИКА ВО ЖИВО",
];

export const FACTS = [
  { value: "2000", label: "година на основање" },
  { value: "7", label: "членови на бендот" },
  { value: "25+", label: "години искуство" },
];

export const OCCASIONS = [
  {
    icon: CalendarDays,
    title: "Свадби и семејни прослави",
    text: "Музика во живо за моменти што остануваат засекогаш.",
  },
  {
    icon: Music2,
    title: "Клубови и дискотеки",
    text: "Енергија, динамика и репертоар што ја крева атмосферата.",
  },
  {
    icon: UsersRound,
    title: "Корпоративни настани",
    text: "Професионален настап прилагоден на вашиот настан.",
  },
];

export const MEMBERS = [
  { name: "Кристијан Марковски", instrument: "Вокал" },
  { name: "Горан Лазаров", instrument: "Клавијатури" },
  { name: "Атанас Стојанов", instrument: "Виолина" },
  { name: "Тодор Ќосев", instrument: "Бас гитара" },
  { name: "Горан Митров", instrument: "Кларинет и саксофон" },
  { name: "Боки Митров", instrument: "Тапани" },
  { name: "Слободан Кржев", instrument: "Гитара" },
];

// Zero-padded position, e.g. 0 -> "01"
export const pad = (i) => String(i + 1).padStart(2, "0");

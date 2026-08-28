export interface Project {
  id: string;
  name: string;
  description: string;
  url: string;
  logo: string;
}

export const projects: Project[] = [
  {
    id: "gabrieldsi",
    name: "GabrielDSi",
    description: "Portfolio in DSi style.",
    url: "https://github.com/gabrielcoffee/gabrieldsi",
    logo: "/logos/gabrieldsi.svg",
  },
  {
    id: "feels",
    name: "Feels",
    description: "Terminal mood tracker.",
    url: "https://github.com/gabrielcoffee/feels",
    logo: "/logos/feels.svg",
  },
  {
    id: "be-my-translator",
    name: "Be My Translator",
    description: "Translation app.",
    url: "https://github.com/gabrielcoffee/be-my-translator",
    logo: "/logos/be-my-translator.svg",
  },
  {
    id: "rent",
    name: "Rent",
    description: "C2C rent-everything startup.",
    url: "https://github.com/gabrielcoffee/rent",
    logo: "/logos/rent.svg",
  },
  {
    id: "pio-brasileiro",
    name: "Pio Brasileiro",
    description: "School booking app.",
    url: "https://github.com/gabrielcoffee/pio-brasileiro",
    logo: "/logos/pio-brasileiro.svg",
  },
  {
    id: "truster",
    name: "Truster",
    description: "Genuine social network.",
    url: "https://github.com/gabrielcoffee/truster",
    logo: "/logos/truster.svg",
  },
  {
    id: "goalminder",
    name: "Goalminder",
    description: "Goal reminder app.",
    url: "https://github.com/gabrielcoffee/goalminder",
    logo: "/logos/goalminder.svg",
  },
  {
    id: "old-games",
    name: "Old Games",
    description: "Classic game recreations.",
    url: "https://github.com/gabrielcoffee/old-games",
    logo: "/logos/old-games.svg",
  },
];

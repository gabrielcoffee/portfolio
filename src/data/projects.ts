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
    description: "Nintendo DSi style portfolio.",
    url: "https://gabrieldsi.netlify.app",
    logo: "/logos/gabrieldsi.svg",
  },
  {
    id: "feels",
    name: "Feels",
    description: "Mood tracker for developers.",
    url: "https://github.com/gabrielcoffee/feels",
    logo: "/logos/feels.svg",
  },
  {
    id: "rent",
    name: "Rent",
    description: "C2C rent-everything startup.",
    url: "https://rentbrasil.com.br",
    logo: "/logos/rent.svg",
  },
  {
    id: "pio-brasileiro",
    name: "Pio Brasileiro",
    description: "(Private) school booking app.",
    url: "#",
    logo: "/logos/pio-brasileiro.svg",
  },
  {
    id: "truster",
    name: "Truster",
    description: "Social network design",
    url: "https://github.com/gabrielcoffee/truster",
    logo: "/logos/truster.svg",
  },
  {
    id: "goalminder",
    name: "Goalminder",
    description: "Goal reminder webapp.",
    url: "https://goalminder.netlify.app",
    logo: "/logos/goalminder.svg",
  },
  {
    id: "flappy-copy",
    name: "Flappy Copy",
    description: "Flappy bird recreated in java.",
    url: "https://github.com/gabrielcoffee/flappy-copy",
    logo: "/logos/old-games.svg",
  },
];

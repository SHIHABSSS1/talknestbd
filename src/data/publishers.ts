import type { Publisher } from "@/lib/types";

export const publishers: Publisher[] = [
  {
    slug: "onnodhara",
    name: "Onnodhara Publishing",
    tagline: "Looking for new language, standing beside new stories",
    description:
      "Onnodhara champions new voices in contemporary literature and is loved for its carefully edited novels and poetry collections.",
    established: "2017",
    location: "Dhaka",
    initials: "OP",
    accent: "#1877F2",
    featured: true,
  },
  {
    slug: "pathshala",
    name: "Pathshala Publishing",
    tagline: "The joy of reading in every home",
    description:
      "Pathshala publishes literature, essays and contemporary ideas. A long relationship with readers is its greatest asset.",
    established: "2012",
    location: "Dhaka",
    initials: "PP",
    accent: "#0B3D7A",
    featured: true,
  },
  {
    slug: "maktabatul-furqan",
    name: "Maktabatul Furqan",
    tagline: "Reliable Islamic reading",
    description:
      "A trusted publisher of Seerah, hadith, Islamic history and books on the Sunnah. Sources are checked before every release.",
    established: "2009",
    location: "Dhaka",
    initials: "MF",
    accent: "#4398FE",
    featured: true,
  },
  {
    slug: "shomoy",
    name: "Shomoy Prokashon",
    tagline: "Books that respect the times we live in",
    description:
      "A publisher of biographies, books on the Liberation War and grounded historical writing, known for careful research.",
    established: "2014",
    location: "Dhaka",
    initials: "SP",
    accent: "#E07F00",
    featured: true,
  },
  {
    slug: "students-library",
    name: "Students Library",
    tagline: "The student's closest address",
    description:
      "A reliable source for academic guides, reference books and competitive exam practice.",
    established: "1998",
    location: "Dhaka",
    initials: "SL",
    accent: "#37AAF7",
    featured: true,
  },
  {
    slug: "neelima",
    name: "Neelima Prokash",
    tagline: "World literature in English",
    description:
      "A young publisher with a particular interest in world classics, translated fiction and international non-fiction.",
    established: "2021",
    location: "Chattogram",
    initials: "NP",
    accent: "#8B5CF6",
    featured: true,
  },
];

export function getPublisher(slug: string): Publisher | undefined {
  return publishers.find((publisher) => publisher.slug === slug);
}

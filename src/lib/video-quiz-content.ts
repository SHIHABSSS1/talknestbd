/**
 * Editable copy for the Watch & Quiz surfaces.
 *
 * The catalogue (videos, quizzes, questions), attempts and discussions live in
 * Postgres. This document only holds the words an admin edits on the three
 * copy tabs — it is stored in content_blocks('video-quiz') and read through a
 * cached server query. Nothing here is the source of truth for content items.
 */

import { sectionDefaults } from "@/lib/section-content";

export type VideoQuizCopy = {
  section: { eyebrow: string; title: string; description: string; linkLabel: string };
  home: {
    title: string;
    description: string;
    progressPrefix: string;
    progressSuffix: string;
    quizTitle: string;
    quizText: string;
    quizNote: string;
    allWatchedNote: string;
    watchedSoFarNote: string;
    demoNote: string;
  };
  videoPage: {
    eyebrow: string;
    title: string;
    description: string;
    pills: string[];
    promoEyebrow: string;
    promoTitle: string;
    promoText: string;
  };
  quizPage: {
    eyebrow: string;
    title: string;
    description: string;
    pills: string[];
  };
};

export const VIDEO_QUIZ_CONTENT_KEY = "video-quiz";

const section = sectionDefaults[VIDEO_QUIZ_CONTENT_KEY];

export const videoQuizDefaults: VideoQuizCopy = {
  section: {
    eyebrow: section?.eyebrow ?? "Watch & learn",
    title: section?.title ?? "Videos and quizzes for curious readers",
    description: section?.description ?? "",
    linkLabel: section?.linkLabel ?? "Explore videos",
  },
  home: {
    title: "Many videos. One quiz waiting below.",
    description:
      "Pick an episode from the shelf, watch it without leaving the page, then scroll down to the quiz. Six conversations, six questions — a tea-break challenge for readers.",
    progressPrefix: "of",
    progressSuffix: "episodes watched",
    quizTitle: "The quiz below the videos",
    quizText: "Now that you have watched, how much stuck?",
    quizNote:
      "Six quick questions on the episodes and the books behind them. Answers come with a short explanation.",
    allWatchedNote: "Shelf complete — you have watched every episode.",
    watchedSoFarNote: "episodes watched so far",
    demoNote: "Episodes stream from YouTube or from files uploaded by our editors. Watching is tracked only in this browser.",
  },
  videoPage: {
    eyebrow: "TalkNest Podcast",
    title: "Conversations about books, authors and stories",
    description:
      "A new episode every week — author interviews, book reviews, reader stories and quizzes. Click any episode to watch it here.",
    pills: [
      "New episode every Thursday",
      "Watch here or on YouTube",
      "Authors and readers in conversation",
    ],
    promoEyebrow: "Quiz section",
    promoTitle: "Two quizzes, one page.",
    promoText:
      "Watch an episode and take the Watch & Quiz, or jump straight into the Book Quiz and the leaderboard.",
  },
  quizPage: {
    eyebrow: "TalkNest Quiz",
    title: "Two quizzes, one reading break.",
    description:
      "Watch an episode and take the quiz right below it, or jump straight into the book quiz. Every answer comes with a short explanation.",
    pills: ["Watch & Quiz", "Book Quiz", "Leaderboard", "Bookworm Champion"],
  },
};

export function cloneVideoQuizDefaults(): VideoQuizCopy {
  return JSON.parse(JSON.stringify(videoQuizDefaults)) as VideoQuizCopy;
}

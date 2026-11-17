/** Demo identities and sample comments for the design-only comment system. */
export type DemoRole = "Reader" | "Top reader" | "Moderator" | "Host" | "Admin";

export interface DemoUser {
  id: string;
  name: string;
  handle: string;
  role: DemoRole;
  initials: string;
  avatarClass: string;
}

export const currentUser: DemoUser = {
  id: "you",
  name: "You",
  handle: "@you",
  role: "Reader",
  initials: "YO",
  avatarClass: "bg-brand-600",
};

export const demoUsers: DemoUser[] = [
  {
    id: "tanzila",
    name: "Tanzila Ahmed",
    handle: "@tanzila",
    role: "Host",
    initials: "TA",
    avatarClass: "bg-brand-700",
  },
  {
    id: "mahin",
    name: "Mahin Ahmed",
    handle: "@mahin",
    role: "Top reader",
    initials: "MA",
    avatarClass: "bg-gold-600",
  },
  {
    id: "sadia",
    name: "Sadia Islam",
    handle: "@sadia",
    role: "Moderator",
    initials: "SI",
    avatarClass: "bg-forest-700",
  },
  {
    id: "rakib",
    name: "Rakibul Hasan",
    handle: "@rakib",
    role: "Reader",
    initials: "RH",
    avatarClass: "bg-clay-600",
  },
  {
    id: "nusrat",
    name: "Nusrat Jahan",
    handle: "@nusrat",
    role: "Reader",
    initials: "NJ",
    avatarClass: "bg-brand-500",
  },
];

export interface DemoComment {
  id: string;
  userId: string;
  text: string;
  time: string;
  likes: number;
  parentId?: string;
}

/** Comments used for both the episode videos and the quiz discussion. */
export const demoComments: Record<"video" | "quiz", DemoComment[]> = {
  video: [
    {
      id: "v1",
      userId: "tanzila",
      text: "Welcome to the episode! Drop your favourite moment below — we read every comment.",
      time: "2 hours ago",
      likes: 18,
    },
    {
      id: "v2",
      userId: "mahin",
      text: "The part about reading ten minutes a day really stuck with me. Started doing it last week.",
      time: "1 hour ago",
      likes: 9,
    },
    {
      id: "v3",
      userId: "rakib",
      text: "Could you do an episode on building a home library on a small budget?",
      time: "48 min ago",
      likes: 6,
      parentId: "v2",
    },
    {
      id: "v4",
      userId: "sadia",
      text: "Great question, Rakib — noted for the next recording. Keep them coming!",
      time: "31 min ago",
      likes: 4,
      parentId: "v3",
    },
    {
      id: "v5",
      userId: "nusrat",
      text: "Watched this during my commute. Perfect length for the train ride home.",
      time: "12 min ago",
      likes: 3,
    },
  ],
  quiz: [
    {
      id: "q1",
      userId: "sadia",
      text: "The explanation after each answer is the best part. A wrong guess still teaches something.",
      time: "1 day ago",
      likes: 14,
    },
    {
      id: "q2",
      userId: "mahin",
      text: "Scored 5/6. The one about the used-book rate caught me out!",
      time: "5 hours ago",
      likes: 7,
    },
    {
      id: "q3",
      userId: "nusrat",
      text: "Took the quiz with my sister — we argued over two questions and learned both answers.",
      time: "2 hours ago",
      likes: 5,
      parentId: "q2",
    },
  ],
};

export function findDemoUser(id: string): DemoUser {
  return id === "you"
    ? currentUser
    : demoUsers.find((user) => user.id === id) ?? demoUsers[0];
}

export function roleClass(role: DemoRole): string {
  if (role === "Host" || role === "Admin") return "bg-brand-50 text-brand-700";
  if (role === "Moderator") return "bg-mint/25 text-forest-700";
  if (role === "Top reader") return "bg-gold-500/10 text-gold-600";
  return "bg-canvas text-muted";
}

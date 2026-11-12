import type { QuizQuestion, Story, TalkVideo, UsedBook } from "@/lib/types";

export const stories: Story[] = [
  {
    id: "s1",
    name: "Rumana Islam",
    title: "The morning of my first job",
    excerpt:
      "On the bus that morning, I understood that a new chapter was beginning. One sentence from my mother gave me all the courage I needed...",
    type: "text",
    likes: 284,
    date: "2 days ago",
    avatarColor: "#1877F2",
  },
  {
    id: "s2",
    name: "Sabbir Ahmed",
    title: "My mother's cooking",
    excerpt:
      "I have lived away for almost eight years. Today the smell of her kitchen came back to me all at once. Listen to this little story in my voice.",
    type: "voice",
    duration: "3:48",
    likes: 512,
    date: "4 days ago",
    avatarColor: "#E07F00",
  },
  {
    id: "s3",
    name: "Nafisa Tabassum",
    title: "Diary of a small entrepreneur",
    excerpt:
      "I started with only five thousand taka. Three years later, we are a team of eleven. I wrote down the whole journey in this diary...",
    type: "pdf",
    likes: 198,
    date: "1 week ago",
    avatarColor: "#8B5CF6",
  },
  {
    id: "s4",
    name: "Mahin Chowdhury",
    title: "The friend I lost",
    excerpt:
      "On the last day of school we wrote a letter. Fifteen years later, that letter suddenly found its way back to me...",
    type: "text",
    likes: 367,
    date: "1 week ago",
    avatarColor: "#37AAF7",
  },
  {
    id: "s5",
    name: "Tasnim Akter",
    title: "The last afternoon of the book fair",
    excerpt:
      "The first time I went to the book fair alone, I came home with three books and a brand-new dream.",
    type: "voice",
    duration: "5:12",
    likes: 241,
    date: "2 weeks ago",
    avatarColor: "#0B3D7A",
  },
  {
    id: "s6",
    name: "Imtiaz Hossain",
    title: "A little library in their village",
    excerpt:
      "The story of a small village library. We started with seven books. Today there are more than two thousand.",
    type: "pdf",
    likes: 173,
    date: "3 weeks ago",
    avatarColor: "#2F8DFE",
  },
];

export const videos: TalkVideo[] = [
  {
    id: "v1",
    title: "A Journey Through Blue Clouds: a conversation with the author",
    category: "Author interview",
    duration: "18:42",
    views: "12.4K",
    thumbnail:
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=900&q=80",
    youtubeId: "M7lc1UVf-VE",
    host: "Tanzila Ahmed",
    episode: 12,
    featured: true,
  },
  {
    id: "v2",
    title: "Atomic Habits in five minutes",
    category: "Book review",
    duration: "06:10",
    views: "8.2K",
    thumbnail:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80",
    youtubeId: "aqz-KE-bpKQ",
    host: "Rafida Noor",
    episode: 11,
  },
  {
    id: "v3",
    title: "Seven books for a new reader",
    category: "Reading list",
    duration: "11:05",
    views: "6.8K",
    thumbnail:
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=900&q=80",
    youtubeId: "jNQXAC9IVRw",
    host: "Sadia Islam",
    episode: 10,
  },
  {
    id: "v4",
    title: "TalkNest Sessions: from books to business",
    category: "Event",
    duration: "24:30",
    views: "15.1K",
    thumbnail:
      "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=900&q=80",
    youtubeId: "ScMzIvxBSi4",
    host: "Tanvir Rahman",
    episode: 9,
  },
  {
    id: "v5",
    title: "A simple way to start reading the Seerah",
    category: "Lecture",
    duration: "14:22",
    views: "9.6K",
    thumbnail:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=900&q=80",
    youtubeId: "dQw4w9WgXcQ",
    host: "Maulana Tahmidul Islam",
    episode: 8,
  },
  {
    id: "v6",
    title: "What to check before buying a used book",
    category: "Book tips",
    duration: "08:54",
    views: "4.3K",
    thumbnail:
      "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=900&q=80",
    youtubeId: "9bZkp7q19f0",
    host: "Tasnim Jahan",
    episode: 7,
  },
];

export const quizQuestions: QuizQuestion[] = [
  {
    question: "Who wrote the epic novel 'Bishad Sindhu'?",
    options: [
      "Mir Mosharraf Hossain",
      "Bankim Chandra Chattopadhyay",
      "Rabindranath Tagore",
      "Kazi Nazrul Islam",
    ],
    answerIndex: 0,
    explanation:
      "'Bishad Sindhu' is Mir Mosharraf Hossain's famous epic novel of love and loss.",
  },
  {
    question: "Who is the author of 'Padma Nadir Majhi'?",
    options: [
      "Sarat Chandra Chattopadhyay",
      "Manik Bandopadhyay",
      "Zahir Raihan",
      "Syed Waliullah",
    ],
    answerIndex: 1,
    explanation:
      "Manik Bandopadhyay's 'Padma Nadir Majhi' was first published in 1936.",
  },
  {
    question: "Who led the Muslim army at the Battle of Yarmouk?",
    options: [
      "Sa'd ibn Abi Waqqas (RA)",
      "Khalid ibn al-Walid (RA)",
      "Umar ibn al-Khattab (RA)",
      "Amr ibn al-As (RA)",
    ],
    answerIndex: 1,
    explanation:
      "Khalid ibn al-Walid (RA) led the Muslim forces at the Battle of Yarmouk.",
  },
  {
    question: "Who wrote the poetry collection 'Agnibeena'?",
    options: [
      "Jibanananda Das",
      "Kazi Nazrul Islam",
      "Shamsur Rahman",
      "Sudhindranath Datta",
    ],
    answerIndex: 1,
    explanation:
      "'Agnibeena' was Kazi Nazrul Islam's first poetry collection, published in 1922.",
  },
  {
    question: "In which city was the Prophet ﷺ born?",
    options: ["Madinah", "Ta'if", "Makkah", "Jeddah"],
    answerIndex: 2,
    explanation:
      "The Prophet ﷺ was born in Makkah into the Quraysh tribe.",
  },
  {
    question: "How much do you get back through TalkNest's book buyback?",
    options: ["30%", "40%", "50%", "70%"],
    answerIndex: 2,
    explanation:
      "After you finish a book bought from us, you can get back 50% of its purchase price.",
  },
];

export const usedBooks: UsedBook[] = [
  {
    id: "u1",
    title: "A Journey Through Blue Clouds",
    author: "Rafida Noor",
    condition: "Like new",
    price: 190,
    originalPrice: 380,
    seller: "Sadia Afrin",
    location: "Dhanmondi, Dhaka",
    cover: { from: "#0e3b3f", to: "#1d6b62", accent: "#e6c87c", motif: "arch" },
  },
  {
    id: "u2",
    title: "The Alchemist",
    author: "Paulo Coelho",
    condition: "Good",
    price: 275,
    originalPrice: 550,
    seller: "Rakib Hasan",
    location: "Sylhet",
    cover: { from: "#3a2e1c", to: "#8d7138", accent: "#f2dea7", motif: "circle" },
  },
  {
    id: "u3",
    title: "30 Steps to Success",
    author: "Dr. Mahfuzur Rahman",
    condition: "Very good",
    price: 140,
    originalPrice: 280,
    seller: "Nahida Sultana",
    location: "Uttara, Dhaka",
    cover: { from: "#1b3550", to: "#396b8a", accent: "#e9cf94", motif: "lines" },
  },
  {
    id: "u4",
    title: "The Colourful Pages of Literature",
    author: "Dr. Selina Parvin",
    condition: "Good",
    price: 225,
    originalPrice: 450,
    seller: "Ariful Islam",
    location: "Rajshahi",
    cover: { from: "#40321f", to: "#8a6a35", accent: "#f4dfb4", motif: "star" },
  },
  {
    id: "u5",
    title: "Atomic Habits",
    author: "James Clear",
    condition: "Like new",
    price: 360,
    originalPrice: 720,
    seller: "Tasnim Jahan",
    location: "Chattogram",
    cover: { from: "#21392f", to: "#536e56", accent: "#ddc996", motif: "grid" },
  },
  {
    id: "u6",
    title: "The Life of the Prophet ﷺ",
    author: "Sheikh Abdur Rahman",
    condition: "Good",
    price: 325,
    originalPrice: 650,
    seller: "Mushfiq Ahmed",
    location: "Khulna",
    cover: { from: "#0d3a2c", to: "#276b4e", accent: "#e7c979", motif: "arch" },
  },
];

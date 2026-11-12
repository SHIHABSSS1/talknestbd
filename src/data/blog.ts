export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  authorRole: string;
  image: string;
  imageAlt: string;
  paragraphs: string[];
  quote: string;
  checklistTitle: string;
  checklist: string[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: "boi-porar-obhyash",
    title: "Seven easy ways to build a reading habit",
    excerpt:
      "Ten minutes a day is enough to begin. Practical ways to make reading a regular part of a busy life.",
    category: "Reader Life",
    date: "8 November 2026",
    readTime: "6 min read",
    author: "Tanzila Ahmed",
    authorRole: "TalkNest Reading Editor",
    image:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "An open book beside a cup of coffee",
    paragraphs: [
      "A reading habit is not built in a day. Many people assume they need a long stretch of free time or a perfect reading corner. In practice, small repeated steps make the biggest difference.",
      "Start with a very simple goal: ten minutes a day. Give those minutes a fixed place, such as before bed or with your morning tea. Pick a book you actually want to read; there is no prize for starting with something difficult just because it is popular.",
      "Keep the book close. Put it in your bag, beside your pillow or on your desk. Whenever two or three minutes open up, read a page. Even when reading is broken into pieces, the total time adds up.",
      "Keep a small notebook. Write down a sentence you loved, a new idea from the author or a question of your own. Connecting reading with writing helps the book stay with you more deeply.",
      "Track your progress. Put a tick on a calendar or log it in an app. Seeing a streak builds motivation. If you miss a day, forgive yourself and begin again the next day.",
      "Read one book with a friend. Meet once a month to talk about it. Questions from another reader make the book clearer. You can also share your reading experience with the TalkNest community.",
      "Finally, remember that reading is a pleasure, not a competition. Read slowly and enjoy it. If a book is not working for you, be brave enough to set it aside and start another.",
    ],
    quote:
      "One page a day becomes several books a year. The power of a habit lives in small steps.",
    checklistTitle: "A checklist to start today",
    checklist: [
      "Choose a book you genuinely want to read",
      "Set aside ten minutes every day",
      "Keep the book within reach",
      "Make a few reading notes",
      "Review your progress at the end of the week",
    ],
  },
  {
    slug: "buyback-50-percent",
    title: "50% buyback: a new address for old books",
    excerpt:
      "Finished books do not need to gather dust on a shelf. Here is how TalkNest buyback gives them another reader.",
    category: "TalkNest Services",
    date: "5 November 2026",
    readTime: "5 min read",
    author: "Sadia Islam",
    authorRole: "Community & Services",
    image:
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Pre-loved books arranged on a shelf",
    paragraphs: [
      "A good book never really grows old — it simply waits for its next reader. TalkNest BD's 50% buyback makes that wait shorter.",
      "When you finish a book bought from us and return it in good condition, you can receive up to 50% of the purchase price. We check and clean the book, then pass it on to another reader at a friendly price.",
      "Condition matters for buyback. Intact pages, a sturdy binding and no major stains or folds keep the process simple. Keep your order number or proof of purchase handy.",
      "To apply, message us on WhatsApp with your order number or fill in the contact form. Our team will review photos of the book and give you an initial quote.",
      "The book you return may become someone else's first favourite. That cycle is the loveliest part of our community — books keep moving, and knowledge does not disappear.",
    ],
    quote:
      "One book can pass through two pairs of hands and brighten several lives. Sharing a read is what completes it.",
    checklistTitle: "What to check before a buyback",
    checklist: [
      "The book was bought from TalkNest BD",
      "Pages and binding are intact",
      "You have the order number or receipt",
      "There are no major stains or water damage",
      "Take clear photos before you apply",
    ],
  },
  {
    slug: "audio-book-sonar-somoy",
    title: "When is the best time to listen to an audiobook?",
    excerpt:
      "Let your eyes rest and let the story travel through your ears. A few enjoyable moments for audiobooks in a busy day.",
    category: "Audio",
    date: "2 November 2026",
    readTime: "4 min read",
    author: "Arif Khan",
    authorRole: "Audiobook Curator",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Headphones resting beside a book",
    paragraphs: [
      "The greatest advantage of an audiobook is that it can happen alongside something else. Choose a time when your hands are busy but your mind is ready to listen.",
      "A morning walk or commute is perfect. The same route feels new as another chapter unfolds. Listening with your eyes closed on a bus or train can also make the journey feel less tiring.",
      "An audiobook is excellent company in the kitchen or while tidying up. Small chores become a doorway into another world. Be extra careful when working with knives or an open flame.",
      "Before sleep, a gentle story or memoir works well. A highly exciting book may keep you awake, so a sleep timer can help you end the session calmly.",
      "Some TalkNest audiobooks are completely free, while premium titles include a free first-chapter preview. Listen to a narrator you like, then unlock the full book.",
    ],
    quote:
      "A good story has no fixed hour — make a little room in a busy day and it begins.",
    checklistTitle: "Small tips for listening",
    checklist: [
      "Choose a volume that feels comfortable",
      "Carry earphones and a power bank on long journeys",
      "Use a sleep timer before bed",
      "Keep a notes app open if you like to capture ideas",
      "Find narrators whose voice you enjoy",
    ],
  },
  {
    slug: "islamic-itihas-pora",
    title: "How to start reading Islamic history",
    excerpt:
      "Seerah, the caliphates and Muslim civilisation — a clear reading roadmap for anyone beginning the subject.",
    category: "Reading Lists",
    date: "29 October 2026",
    readTime: "7 min read",
    author: "Maulana Tahmidul Islam",
    authorRole: "Guest Writer",
    image:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "A collection of Islamic books",
    paragraphs: [
      "Islamic history is a vast subject. Trying to read too many books at once can make it easy to lose your way, so begin with something clear and reliable.",
      "Start with the life of the Prophet ﷺ. The Seerah gives you the foundation: the events of Islam's early years, the lives of the Companions and the shape of the society around them. From there, move on to the period of the rightly guided caliphs.",
      "Verify your sources. The same event can be presented differently in different books. Choose trusted publishers, references to primary texts and histories built on evidence.",
      "Read not only about battles and rulers, but also about ordinary people: education, trade, medicine and the arts. That is how the full picture of a civilisation comes together.",
      "Build a timeline as you read. When did an event happen? What changed under which caliph? Organising the material this way makes it easier to remember.",
      "The Islamic History category at TalkNest brings together selected Seerah and history titles. Read slowly, take notes and keep asking questions — history comes alive when it connects to the life we live today.",
    ],
    quote:
      "History is not for memorising. It is for understanding. Look for the cause and the lesson behind each event, and history begins to speak again.",
    checklistTitle: "A starter reading list",
    checklist: [
      "A reliable book on the life of the Prophet ﷺ",
      "A history of the rightly guided caliphs",
      "A history of Muslim civilisation and learning",
      "Selected stories from the lives of the Companions",
      "A historical map or timeline",
    ],
  },
  {
    slug: "lekhok-sakkhatkar-rafida-nur",
    title: "Author interview: Rafida Noor on writing and solitude",
    excerpt:
      "A conversation with the author of A Journey Through Blue Clouds — how she began, the readers she loves and a hint of her next novel.",
    category: "Interviews",
    date: "25 October 2026",
    readTime: "8 min read",
    author: "Tanzila Ahmed",
    authorRole: "TalkNest Reading Editor",
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "A warm conversation with an author",
    paragraphs: [
      "In Rafida Noor's writing, the noise of the city and the silence of the village live side by side. Her first novel, A Journey Through Blue Clouds, reached readers last year.",
      "\"I do not wait for a special moment to write,\" she said. \"On a bus, in the kitchen, overhearing someone speak — when a sentence arrives, I put it in the notes on my phone.\"",
      "For her, observation is the first requirement of good writing. The small habits of people, the feelings hidden between their words — these are the raw material of a story.",
      "Asked about readers' responses, she smiles. \"Someone told me the book made them think of their own village. What greater reward could a writer ask for?\"",
      "She hints at her next project: a small river town will be the setting of her coming novel. She is not ready to say how long it will take.",
      "Her advice for new writers is simple: \"No one has to read the first draft. Write it for yourself. Think of the reader when you edit.\"",
    ],
    quote:
      "A writer sits alone, but a book becomes complete only with a reader. Without readers, a story has no breath.",
    checklistTitle: "The kinds of books Rafida Noor loves",
    checklist: [
      "Character-driven novels",
      "Stories of village life",
      "Memoirs and diaries",
      "Poetry collections",
      "Travel writing",
    ],
  },
  {
    slug: "sishuke-boi-mukhi",
    title: "Six habits that raise a child who loves books",
    excerpt:
      "Families play the biggest role in helping children fall in love with books beyond the screen. A few simple habits.",
    category: "Family",
    date: "20 October 2026",
    readTime: "5 min read",
    author: "Nafisa Tabassum",
    authorRole: "Parent & Reader",
    image:
      "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "A book collection for a child",
    paragraphs: [
      "Children imitate what they see. The easiest way to raise a reader is to let them see their parents reading. Read in front of your child, turn the pages together and enjoy the story openly.",
      "Build a shared reading routine at a fixed time each day. Ten minutes before bed is enough. Let the child choose the book, ask questions and imagine freely.",
      "Pick books with pictures and large type for the right age. A book that is too difficult can cool a child's interest. Funny illustrations, rhymes and repeated sentences hold attention.",
      "Never turn books into punishment or pressure. Give a new book as a reward, plan a small reading festival at home or build a shelf that belongs to the whole family.",
      "To reduce screen time, agree on rules together. At a set time each day, everyone puts their phone away and reads. Children will not change overnight, but a habit will slowly take shape.",
      "Talk about what your child is reading. \"What did you learn today?\" turns reading into part of family conversation. You can also choose age-appropriate books from TalkNest's children's collection.",
    ],
    quote:
      "You can buy a child a book, but friendship with books is built with time, stories and a little patience.",
    checklistTitle: "Small family rules",
    checklist: [
      "Read together for ten minutes every day",
      "Let the child choose the book",
      "Encourage books as gifts",
      "Talk about stories at the table",
      "Keep a screen-free window at night",
    ],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function relatedPosts(post: BlogPost, count = 3): BlogPost[] {
  const others = blogPosts.filter((entry) => entry.slug !== post.slug);
  return [
    ...others.filter((entry) => entry.category === post.category),
    ...others.filter((entry) => entry.category !== post.category),
  ].slice(0, count);
}

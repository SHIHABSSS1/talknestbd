# TalkNest BD

বাংলাদেশের পাঠকদের জন্য একটি বাংলা-ফার্স্ট অনলাইন বইয়ের দোকান ও পাঠক কমিউনিটি — Next.js 16 (App Router) ও Tailwind CSS v4 দিয়ে তৈরি।

> **ডেমো প্রকল্প:** এখানে কোনো আসল ব্যাকএন্ড, পেমেন্ট বা ইউজার অ্যাকাউন্ট নেই। কার্ট, উইশলিস্ট, অর্ডার, ঠিকানা, প্রোফাইল ও অডিও আনলক ব্রাউজারের `localStorage`-এ সংরক্ষিত হয়।

## Live deployment

- **Vercel:** (deployment URL যুক্ত করা হবে)
- **GitHub:** [SHIHABSSS1/talknestbd](https://github.com/SHIHABSSS1/talknestbd)

## Features

- বাংলা-ফার্স্ট রেসপন্সিভ ডিজাইন — forest green, cream, gold ও clay রঙের থিম
- হোমপেজ: হিরো স্লাইডার, সার্চ, ক্যাটাগরি, বেস্ট সেলার, নতুন/ভাইরাল/আন্তর্জাতিক/স্টুডেন্ট বই, লেখক ও প্রকাশনী
- বইয়ের বিস্তারিত পেজ: সংক্ষিপ্ত/বিস্তারিত বিবরণ, ছাড়, লেখক-প্রকাশনী, স্পেসিফিকেশন ও পাঠক রিভিউ
- সম্পূর্ণ কার্ট, বাই-নাউ, চেকআউট, অর্ডার কনফার্মেশন ও প্রিন্ট/PDF-বান্ধব রিসিট
- অ্যাকাউন্ট ড্যাশবোর্ড, অর্ডার ইতিহাস, সংরক্ষিত ঠিকানা, প্রোফাইল সেটিংস ও উইশলিস্ট
- অডিও বুক লাইব্রেরি — কিছু বই সম্পূর্ণ ফ্রি, বাকিগুলোর প্রথম অধ্যায় ফ্রি; চেকআউটে আনলক
- পডকাস্ট-স্টাইল ভিডিও পেজ — YouTube এমবেড প্লেয়ারে ডেমো ভিডিও প্লেব্যাক
- হৃদয়ের গল্প: লেখা, ভয়েস রেকর্ডিং (MediaRecorder) ও PDF শেয়ারিং ডেমো
- কুইজ, পাঠক রিভিউ, ব্লগ, ৫০% বাইব্যাক ক্যালকুলেটর, পুরাতন বই মার্কেট, পাইকারি অর্ডার ফর্ম
- সুন্নাহ সামগ্রী, ফ্রি ডেলিভারি, আমাদের সম্পর্কে, যোগাযোগ ও ম্যাপ
- শর্তাবলি, প্রাইভেসি ও রিটার্ন পলিসি
- কারাসেল, রিভিউ, কুইজ — সব কনটেন্ট ডেমো ডেটা থেকে

## Tech stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 16.4.6 (App Router, Turbopack) |
| UI | React 19.3, Tailwind CSS 4.3.3 |
| Icons | lucide-react |
| Fonts | next/font (Bengali display + body) |
| State | React Context + `localStorage` |
| Deployment | Vercel |

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Production build:

```bash
npm run build
npm start
```

## Project structure

```text
src/
  app/                 # App Router pages (book, cart, checkout, account, community…)
  components/
    account/           # Account nav, orders, addresses, settings, wishlist
    audio/             # Audio library + chapter player
    books/             # Book card, cover, grid, detail tabs, reviews
    home/              # Homepage sections
    layout/            # Header, footer, search, social, toast, mobile nav
    services/          # Wholesale form, buyback calculator
    stories/           # Stories wall + share form (voice/text/PDF)
    ui/                # Button, badge, page header, rating, empty state…
    video/             # Podcast-style YouTube gallery
  data/                # Demo books, authors, publishers, blogs, legal, community
  lib/                 # Store, orders, audio, types, navigation, utils
```

## Demo data & media

- Book covers are generated with CSS (no external cover images).
- Editorial images use Unsplash URLs.
- Demo audio uses SoundHelix MP3 sample files.
- Demo videos are embedded from YouTube via `youtube-nocookie.com`.
- Payment, login, checkout and forms are front-end demos only. No data leaves the browser.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm start` | Serve the production build |
| `npx tsc --noEmit` | Type-check the project |

## License

Private demo project for TalkNest BD. All demo content is for presentation purposes.

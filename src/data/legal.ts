export interface LegalSection {
  id: string;
  title: string;
  paragraphs?: string[];
  bullets?: string[];
}

export interface LegalDocumentData {
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  lastUpdated: string;
  intro: string;
  sections: LegalSection[];
}

export const termsDocument: LegalDocumentData = {
  slug: "terms",
  eyebrow: "Terms & Conditions",
  title: "Terms of Use",
  description:
    "Read the terms covering orders, payments, delivery and returns before using TalkNest BD.",
  lastUpdated: "1 November 2026",
  intro:
    "By using the TalkNest BD website and services, you agree to these terms. If any part is not acceptable to you, please do not use the site.",
  sections: [
    {
      id: "account",
      title: "1. Accounts and information",
      paragraphs: [
        "To place an order, you need to provide a recipient name, mobile number and delivery address. TalkNest BD is not responsible for failed deliveries caused by incorrect information.",
        "This website is currently a front-end demo. Account, order and address information is stored only in your browser's local storage and is not sent to any server.",
      ],
    },
    {
      id: "orders",
      title: "2. Orders and confirmation",
      bullets: [
        "After you place an order, our team will confirm it by phone within 24 hours.",
        "We reserve the right to cancel or adjust an order if stock runs out or a price is listed incorrectly.",
        "If you place multiple orders at the same time, we may process them together.",
      ],
    },
    {
      id: "pricing",
      title: "3. Pricing and payment",
      paragraphs: [
        "All prices are shown in Bangladeshi taka (৳) and may change when necessary. The price confirmed at the time of order confirmation is the price that applies.",
        "No real payment is taken on this demo site. Cash on delivery, bKash, Nagad and other payment methods will be introduced with the live service in the future.",
      ],
    },
    {
      id: "delivery",
      title: "4. Delivery",
      paragraphs: [
        "Standard delivery is free on orders of ৳999 or more. A delivery charge applies below that amount. Express delivery may carry an additional charge.",
        "Delivery usually takes 2–4 working days inside Dhaka and 3–7 working days elsewhere in Bangladesh. Weather, holidays or courier delays may extend that window.",
      ],
    },
    {
      id: "returns",
      title: "5. Returns and exchanges",
      paragraphs: [
        "You can request a return or exchange within seven days of receiving a book if it has a printing fault, is the wrong title or arrived damaged. Full rules are available on the Return Policy page.",
        "We do not accept returns for books damaged through personal use or no longer in a resaleable condition.",
      ],
    },
    {
      id: "buyback",
      title: "6. 50% book buyback",
      paragraphs: [
        "Selected books bought from TalkNest BD can be returned in good condition for 50% of the purchase price. The final amount is confirmed after we inspect the book.",
        "Buyback is an optional service, and its terms and time limits may change.",
      ],
    },
    {
      id: "content",
      title: "7. Content and intellectual property",
      paragraphs: [
        "The text, design, logo and images on this site belong to TalkNest BD or are used with permission from the relevant author or publisher. Commercial use without permission is prohibited.",
        "Readers are responsible for the stories they share. We may remove content that is offensive, misleading or infringes someone else's intellectual property.",
      ],
    },
    {
      id: "changes",
      title: "8. Changes to these terms",
      paragraphs: [
        "TalkNest BD may update these terms from time to time. Changes take effect when they are published on this page. Important updates will be announced on the site.",
      ],
    },
    {
      id: "contact",
      title: "9. Contact",
      paragraphs: [
        "If you have a question about these terms, email hello@talknestbd.com or call +880 1712-345678.",
      ],
    },
  ],
};

export const privacyDocument: LegalDocumentData = {
  slug: "privacy",
  eyebrow: "Privacy Policy",
  title: "Privacy Policy",
  description:
    "A clear explanation of what information we collect, how we use it and where it is stored.",
  lastUpdated: "1 November 2026",
  intro:
    "TalkNest BD takes reader privacy seriously. On this demo site, the information you enter is stored only in your browser; we do not send reader data to a hidden server.",
  sections: [
    {
      id: "collect",
      title: "1. What information we collect",
      bullets: [
        "Name, mobile number, email and delivery address for orders.",
        "Your cart, wishlist, order history and profile settings.",
        "Information you provide in quizzes, reviews, story submissions or contact forms.",
      ],
    },
    {
      id: "use",
      title: "2. How we use information",
      paragraphs: [
        "We use information to process orders, confirm delivery, provide customer support and recommend books that match your interests.",
        "With your consent, we may send news about new books, offers and community events by newsletter. You can turn this off in settings at any time.",
      ],
    },
    {
      id: "storage",
      title: "3. Where information is stored",
      paragraphs: [
        "On this demo website, your cart, wishlist, orders, addresses and profile are stored in your browser's local storage. Clearing your browser data will also remove that information.",
        "If a live service launches in the future, information will be stored on secure servers and this policy will be updated.",
      ],
    },
    {
      id: "sharing",
      title: "4. Who we share information with",
      paragraphs: [
        "To complete a delivery, we may share only the necessary name, phone number and address with a courier or delivery partner.",
        "We do not sell readers' personal information to third parties, except where required by law.",
      ],
    },
    {
      id: "cookies",
      title: "5. Cookies and local storage",
      paragraphs: [
        "Cookies or local storage are used to keep the site working and to remember your preferences. You can control these through your browser settings.",
      ],
    },
    {
      id: "rights",
      title: "6. Your rights",
      bullets: [
        "The right to view and correct the information we hold about you.",
        "The right to request deletion of account and address information.",
        "The right to stop marketing communications.",
        "The right to ask questions about how your information is used.",
      ],
    },
    {
      id: "security",
      title: "7. Security",
      paragraphs: [
        "We take reasonable technical and organisational measures to protect information. However, no internet method is 100% secure, so please be careful when sharing sensitive information.",
      ],
    },
    {
      id: "contact",
      title: "8. Contact",
      paragraphs: [
        "For privacy questions or requests, email hello@talknestbd.com or contact +880 1712-345678.",
      ],
    },
  ],
};

export const returnDocument: LegalDocumentData = {
  slug: "return-policy",
  eyebrow: "Return & Refund",
  title: "Return & Refund Policy",
  description:
    "The complete rules for returns, exchanges, refunds and the 50% buyback offer after you receive a book.",
  lastUpdated: "1 November 2026",
  intro:
    "We want every reader to receive a book they are happy with. If a book has a printing fault, is the wrong title or was damaged in transit, you can request a return or exchange within seven days.",
  sections: [
    {
      id: "window",
      title: "1. Return window",
      paragraphs: [
        "A return or exchange must be requested within seven days of delivery. We generally cannot accept returns after seven days, though we may help in exceptional circumstances.",
      ],
    },
    {
      id: "eligible",
      title: "2. When a return is accepted",
      bullets: [
        "Printing faults, missing pages or a broken binding.",
        "A different book or edition from the one you ordered.",
        "Water damage, tears or serious damage during transit.",
      ],
    },
    {
      id: "not-eligible",
      title: "3. When a return is not accepted",
      bullets: [
        "The book has been used, marked or has folded pages.",
        "Stickers, gifts or extra materials have been removed.",
        "A resaleable book is returned simply because you changed your mind (the buyback service may apply).",
        "More than seven days have passed since the order.",
      ],
    },
    {
      id: "process",
      title: "4. How to return a book",
      bullets: [
        "Contact us through the website form, WhatsApp or phone with your order number.",
        "Send photos of the book and a description of the problem.",
        "Our team will review the request and confirm a return or another solution.",
        "If approved, send the book to the address we provide. If the delivery was wrong or faulty, we may arrange collection.",
      ],
    },
    {
      id: "refund",
      title: "5. Refunds",
      paragraphs: [
        "Once an approved return reaches us, we process the refund within 3–7 working days. The money is returned through bKash, Nagad or a bank transfer, depending on the original payment method.",
        "No real money changes hands on this demo site; these rules will apply when the live service launches.",
      ],
    },
    {
      id: "buyback",
      title: "6. 50% buyback",
      paragraphs: [
        "Books bought from TalkNest BD can be returned in good condition after reading for up to 50% of the purchase price. The final amount depends on condition, current demand and the publisher's terms.",
        "You will need the order number or proof of purchase. Textbooks, older editions and damaged books may not qualify for buyback.",
      ],
    },
    {
      id: "contact",
      title: "7. Support",
      paragraphs: [
        "For any return question, email hello@talknestbd.com, call +880 1712-345678 or send a WhatsApp message. Support hours: Saturday–Thursday, 10am–8pm.",
      ],
    },
  ],
};

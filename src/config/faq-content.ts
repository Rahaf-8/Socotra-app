import type { FAQCategoryDefinition, FAQItem } from "@/types/faq";

export const faqCategories = [
  { key: "travel", label: "Travel and Flights", displayOrder: 1 },
  { key: "weather", label: "Best Time to Visit", displayOrder: 2 },
  { key: "activities", label: "Activities", displayOrder: 3 },
  { key: "safety", label: "Safety", displayOrder: 4 },
  { key: "accommodation", label: "Accommodation", displayOrder: 5 },
  {
    key: "connectivity",
    label: "Internet and Device Charging",
    displayOrder: 6,
  },
  { key: "visa", label: "Visa", displayOrder: 7 },
  { key: "restrictions", label: "Travel Restrictions", displayOrder: 8 },
  { key: "booking", label: "Cancellation Policy", displayOrder: 9 },
] satisfies readonly FAQCategoryDefinition[];

export const faqItems = [
  {
    id: "socotra-open-for-tourists",
    category: "travel",
    displayOrder: 1,
    published: true,
    question: "Is Socotra open for tourists?",
    answer: [
      { type: "paragraph", text: "Yes, Socotra is open for tourists." },
      {
        type: "paragraph",
        text: "You can fly with Air Arabia on a non-stop route from Abu Dhabi to Socotra. It is a weekly flight, every Monday at 10:00 AM, departing from Abu Dhabi and arriving in Socotra at 11:30 AM.",
      },
      {
        type: "paragraph",
        text: "The return flight departs from Socotra at 1:00 PM and arrives in Abu Dhabi at 4:00 PM.",
      },
      {
        type: "paragraph",
        text: "Contact us to arrange your travel to the Socotra Islands.",
      },
    ],
  },
  {
    id: "best-time-to-visit-socotra",
    category: "weather",
    displayOrder: 2,
    published: true,
    question: "What is the best time to visit Socotra Island?",
    answer: [
      {
        type: "paragraph",
        text: "December and January are rainy, but conditions are still manageable if you want to visit.",
      },
      {
        type: "paragraph",
        text: "October to May is the best season to visit. The best months are October, November and February. These months are not too hot and not too rainy, making them ideal for hiking and outdoor activities, which are among Socotra’s main attractions. This period is also excellent for wildlife experiences.",
      },
      {
        type: "paragraph",
        text: "June to September is the monsoon season and can be very windy. This makes the period less desirable for hiking and outdoor sightseeing, but it is ideal for windsurfing and similar wind-based activities.",
      },
      {
        type: "paragraph",
        text: "Summer is quite hot, but not unbearably so. It is excellent beach weather, although hiking can feel much warmer.",
      },
    ],
  },
  {
    id: "what-is-socotra-famous-for",
    category: "activities",
    displayOrder: 3,
    published: true,
    question: "What is Socotra Island famous for?",
    answer: [
      {
        type: "paragraph",
        text: "Socotra offers a wide range of outdoor and nature-based activities:",
      },
      {
        type: "list",
        items: [
          "Trekking through breathtaking landscapes and meeting Bedouin communities in the mountains",
          "Diving among rich marine life that feels like swimming inside an aquarium",
          "Spotting dolphins",
          "Kayaking and stand-up paddleboarding in natural sea lagoons",
          "Fishing, with opportunities to capture memorable catches on camera",
          "Kite surfing in strong winds",
          "Gyrocopter or helicopter trips for travelers who enjoy heights",
        ],
      },
    ],
  },
  {
    id: "is-socotra-safe",
    category: "safety",
    displayOrder: 4,
    published: true,
    question: "Is Socotra safe?",
    answer: [
      {
        type: "paragraph",
        text: "Yes. We recently took our mothers to Socotra, which should tell you how we feel about the island’s safety.",
      },
      {
        type: "paragraph",
        text: "Due to its remoteness and location, the island of Socotra is completely safe for tourists. More than 1,500 people visit the island every season.",
      },
      {
        type: "paragraph",
        text: "Socotra is physically separated from the political instability and uncertainty currently taking place on mainland Yemen.",
      },
      {
        type: "paragraph",
        text: "Mainland Yemen is a different situation. While it may not be as dangerous as some media reports suggest, Socotra is physically and politically removed from what is happening there.",
      },
    ],
  },
  {
    id: "socotra-accommodation",
    category: "accommodation",
    displayOrder: 5,
    published: true,
    question: "What accommodation is provided?",
    answer: [
      {
        type: "paragraph",
        text: "Accommodation differs depending on the package you choose.",
      },
      { type: "subheading", text: "WILD" },
      {
        type: "paragraph",
        text: "You will stay in two-person tents. These are not ordinary camping tents. We have gone to great lengths to provide high-quality and comfortable tents.",
      },
      {
        type: "paragraph",
        text: "The tents were purchased in Europe, shipped to Dubai, transported for a month by cargo boat to Oman, and then carried for another three days by cargo boat to Socotra. They also had to pass through customs in each country. It was a long process, but it allowed us to provide better camping accommodation.",
      },
      { type: "subheading", text: "COMFY" },
      {
        type: "paragraph",
        text: "You will be provided with the same tents used in the Wild programme while camping. On arrival, departure and halfway through the tour, you will stay at our guesthouse or at one of the hotels on the island.",
      },
      { type: "paragraph", text: "Is it five-star accommodation? No." },
      {
        type: "paragraph",
        text: "Does it provide the amenities needed to make you feel comfortable? Absolutely.",
      },
      {
        type: "list",
        items: [
          "Air conditioning",
          "Western-style toilet",
          "Fan",
          "Comfortable bed",
          "Clean sheets",
          "Everything needed for rest and recovery",
        ],
      },
      { type: "subheading", text: "VIP" },
      {
        type: "paragraph",
        text: "With the VIP package, you will stay at our sister hotel on the island. It includes everything provided in the Comfy package, with a greater emphasis on luxury.",
      },
      {
        type: "list",
        items: [
          "Soft beds",
          "Air conditioning",
          "Good Wi-Fi, although not perfect",
          "Hot water",
          "Clean sheets",
          "Breakfast buffet every morning",
        ],
      },
      {
        type: "paragraph",
        text: "It is as luxurious as accommodation can be in Socotra.",
      },
    ],
  },
  {
    id: "internet-in-socotra",
    category: "connectivity",
    displayOrder: 6,
    published: true,
    question: "Is internet available in Socotra?",
    answer: [
      {
        type: "paragraph",
        text: "We all love the internet for social media, emails, text messages and staying in touch. However, in Socotra, we also enjoy being disconnected.",
      },
      {
        type: "paragraph",
        text: "If you need internet access, you should obtain an Etisalat SIM card in the UAE. It is easy to purchase one at the airport, and it works in some locations in Socotra, including the capital and a few other areas.",
      },
      {
        type: "paragraph",
        text: "The highest speed you are likely to receive is 3G. There is no 5G, 4G or LTE.",
      },
      {
        type: "paragraph",
        text: "The connection is generally sufficient for:",
      },
      {
        type: "list",
        items: [
          "Sending messages",
          "Email",
          "Checking in with family or work",
          "Very light web browsing",
        ],
      },
      {
        type: "paragraph",
        text: "Streaming and large downloads are not possible.",
      },
      {
        type: "paragraph",
        text: "You may also use a guide’s hotspot if needed. However, we recommend using your time in Socotra to disconnect, enjoy the surroundings and look up from your phone.",
      },
      {
        type: "paragraph",
        text: "We understand that work and communication with home may still be necessary. If you absolutely need internet, we have you covered.",
      },
    ],
  },
  {
    id: "device-charging",
    category: "connectivity",
    displayOrder: 7,
    published: true,
    question: "Can I charge my devices during the tour?",
    answer: [
      {
        type: "paragraph",
        text: "Thank you to Thomas Edison and Nikola Tesla for helping to make electricity possible. More importantly for your trip, it allows us to charge our devices in Socotra.",
      },
      { type: "paragraph", text: "We recommend bringing a power bank." },
      {
        type: "paragraph",
        text: "Car chargers will also be available in the 4×4 Toyota Land Cruisers.",
      },
      { type: "paragraph", text: "Available charger types include:" },
      { type: "list", items: ["USB-C", "iPhone", "Mini USB"] },
      {
        type: "paragraph",
        text: "We know that photos, videos and drone footage are important, so we make it easy to recharge your devices.",
      },
    ],
  },
  {
    id: "socotra-visa",
    category: "visa",
    displayOrder: 8,
    published: true,
    question: "Do I need a visa to visit Socotra?",
    answer: [
      {
        type: "paragraph",
        text: "All tourists need a Yemeni visa to visit Socotra Island.",
      },
      {
        type: "paragraph",
        text: "We take care of the entire procedure for you.",
      },
      {
        type: "paragraph",
        text: "The process usually takes a few days, and the visa is issued by the island authorities.",
      },
      {
        type: "paragraph",
        text: "Free yourself from the stress of complicated visa procedures. The experienced team at Welcome to Socotra has you covered.",
      },
      {
        type: "paragraph",
        text: "The only document we need from you is a photograph of the main page of your passport.",
      },
      {
        type: "paragraph",
        text: "Once your visa has been obtained, we will send you a copy by email. You will need to print it and show it at the Dubai check-in counter in order to board the flight.",
      },
      {
        type: "paragraph",
        text: "We will meet you with the original copy of your visa in the arrivals hall at Socotra Airport.",
      },
    ],
  },
  {
    id: "uae-travel-restrictions",
    category: "restrictions",
    displayOrder: 9,
    published: true,
    question: "Are there any travel restrictions when travelling through the UAE?",
    answer: [
      {
        type: "paragraph",
        text: "The United Arab Emirates is open to tourists.",
      },
      {
        type: "paragraph",
        text: "Please visit the government’s website for the latest updates and requirements based on your country of origin.",
      },
    ],
  },
  {
    id: "cancellation-policy",
    category: "booking",
    displayOrder: 10,
    published: true,
    question: "What is the cancellation policy?",
    answer: [
      {
        type: "paragraph",
        text: "If you are unable to travel and want to cancel your booking, we can help you request a refund for your flight tickets.",
      },
      {
        type: "paragraph",
        text: "The Welcome to Socotra tour deposit is non-refundable.",
      },
      {
        type: "paragraph",
        text: "The cancellation policy of the company operating the charter flight, Emirates Aviation Services, is stated on its tickets as follows:",
      },
      {
        type: "quote",
        text: "Ticket refunds must be requested at least 8 days before departure. A penalty fee of AED 400 applies. Within 8 days of departure, modification or cancellation is not allowed.",
      },
      {
        type: "paragraph",
        text: "If the airline cancels the flight and this forces our company to cancel the tour, we will reimburse the full amount of your tour deposit.",
      },
    ],
  },
] satisfies readonly FAQItem[];

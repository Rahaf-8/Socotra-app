import type { AboutPageData } from "@/types/about";

export const aboutPageData = {
  hero: {
    eyebrow: "About Socotra",
    title: "The Island Beyond Imagination",
    description:
      "An ancient island shaped by isolation, extraordinary biodiversity and a culture deeply connected to land and sea.",
    image: {
      src: "/socotra-hero-placeholder.png",
      alt: "Dragon's Blood Trees growing across a rocky Socotra plateau above the sea.",
    },
  },
  island: {
    id: "the-island",
    eyebrow: "The Archipelago",
    title: "An Island Set Apart",
    paragraphs: [
      "The Socotra Archipelago lies in the Indian Ocean between the Arabian Peninsula and the Horn of Africa, approximately 240 km east of Cape Guardafui in Somalia and 380 km south of Ras Fartak in Al Mahrah, Yemen.",
      "Together with Abd al-Kuri, Samha and Darsa, Socotra forms one of the world's most botanically diverse island groups. It is often called the “Galápagos of the Indian Ocean” for its exceptionally rich and distinctive flora and fauna.",
      "The island is home to 825 plant species, including 308—approximately 37%—that are endemic and found nowhere else on Earth. UNESCO designated the Socotra Archipelago as a World Heritage Site in 2008.",
    ],
    displayOrder: 1,
    published: true,
  },
  geography: {
    id: "geography-and-climate",
    eyebrow: "Geography and Climate",
    title: "Coast, Plateau and Mountain",
    paragraphs: [
      "Socotra measures approximately 132 km long and 49 km wide, covering about 3,796 km². Its landscape can be understood through three broad zones: the coastal plains, the limestone plateau and the Hagghier Mountains.",
      "The island has a semi-desert climate, with an average temperature above 25°C and generally light annual rainfall. The higher inland areas receive more rain than the coastal lowlands because of the mountains.",
      "From June to September, the monsoon brings very strong winds and rough seas. Fishing becomes difficult or impossible in many areas, and some northern coastal communities move towards the mountains to escape the wind and harvest date palms. Air access has made year-round travel more possible, although the season remains a powerful influence on island life.",
    ],
    displayOrder: 2,
    published: true,
  },
  flora: {
    id: "flora",
    eyebrow: "The Flora",
    title: "Plants Shaped by Isolation",
    description:
      "Socotra's geology, dry climate and long isolation have shaped plant life of extraordinary character, from plateau forests to species adapted to rocky terrain.",
    items: [
      {
        id: "dragons-blood-tree",
        title: "Dragon's Blood Tree",
        description:
          "The island's best-known plant has an umbrella-shaped canopy and deep red resin. Growing across hillsides and plateaus, it has become a symbol of Socotra.",
        displayOrder: 1,
        published: true,
      },
      {
        id: "bottle-tree",
        title: "Bottle Tree",
        description:
          "Its swollen trunk stores water, allowing the plant to endure Socotra's dry climate.",
        displayOrder: 2,
        published: true,
      },
      {
        id: "cucumber-tree",
        title: "Cucumber Tree",
        description:
          "A distinctive plant with a thick, succulent trunk and small flowers.",
        displayOrder: 3,
        published: true,
      },
      {
        id: "desert-rose",
        title: "Desert Rose",
        description:
          "A plant of dry, rocky ground, recognised for its pink or white flowers.",
        displayOrder: 4,
        published: true,
      },
      {
        id: "frankincense-tree",
        title: "Frankincense Tree",
        description:
          "Part of Socotra's long relationship with aromatic resins and ancient maritime trade.",
        displayOrder: 5,
        published: true,
      },
      {
        id: "fruiting-trees",
        title: "Pomegranate and Fig",
        description:
          "The Socotra Pomegranate and Socotra Fig Tree are among the island's other notable plants.",
        displayOrder: 6,
        published: true,
      },
    ],
    displayOrder: 3,
    published: true,
  },
  fauna: {
    id: "fauna",
    eyebrow: "Island Wildlife",
    title: "Life Across Land and Sea",
    description:
      "Isolation has also shaped Socotra's wildlife. Birds, reptiles, seabirds and marine life form part of a fragile island ecosystem supported by local conservation efforts.",
    items: [
      {
        id: "socotra-cormorant",
        title: "Socotra Cormorant",
        description:
          "A seabird associated with the coastline and surrounding waters.",
        displayOrder: 1,
        published: true,
      },
      {
        id: "socotra-grosbeaks",
        title: "Socotra Grosbeaks",
        description:
          "The Socotra Grosbeak and Socotra Golden-winged Grosbeak are among the island's distinctive birdlife.",
        displayOrder: 2,
        published: true,
      },
      {
        id: "socotra-sunbird",
        title: "Socotra Sunbird",
        description:
          "One of the birds that contributes to the island's distinctive natural character.",
        displayOrder: 3,
        published: true,
      },
      {
        id: "reptiles-and-marine-life",
        title: "Reptiles and Marine Life",
        description:
          "The Socotra Spiny-tailed Lizard, other endemic reptiles and varied marine life are part of the wider ecosystem.",
        displayOrder: 4,
        published: true,
      },
    ],
    displayOrder: 4,
    published: true,
  },
  culture: {
    id: "people-and-culture",
    eyebrow: "People and Culture",
    title: "A Living Connection to Land and Sea",
    paragraphs: [
      "The native people of Socotra are known as the Soqotri. Their distinct Soqotri language, with its own grammar, vocabulary and syntax, is spoken by approximately 50,000 people.",
      "Life in communities across the island has long centred on fishing, farming, livestock herding, date cultivation and local agriculture. Families grow dates, figs, vegetables and other crops, while goats and sheep provide meat and dairy products. These traditions reflect a close relationship with both land and sea.",
      "Islam is practised by most of the population, and mosques hold an important place in local communities. Colourful garments, headdresses, local fabrics, jewellery, music and dance are part of cultural life, particularly during weddings and celebrations. Visitors may encounter Soqotri culture respectfully through local food, villages, guesthouses and cultural activities.",
    ],
    displayOrder: 5,
    published: true,
  },
  history: {
    id: "history-trade-and-legends",
    eyebrow: "History, Trade and Legends",
    title: "Where Maritime History Meets Island Myth",
    description:
      "Socotra's position in the Arabian Sea placed it within ancient trade routes, while its remoteness inspired generations of stories.",
    items: [
      {
        id: "ancient-resin-trade",
        title: "Resins and Ancient Trade",
        description:
          "As far back as 2400 B.C., Socotra supplied frankincense, myrrh, aloe and Dragon's Blood resin. Its aromatic resins, plant gums, amber, musk and pearls connected the island to Arabian Sea shipping and goods valued by the Greeks and Romans.",
        displayOrder: 1,
        published: true,
      },
      {
        id: "dragons-blood-legend",
        title: "The Dragon's Blood Legend",
        description:
          "According to legend, gladiators used Dragon's Blood resin before combat in the belief that it would help wounds heal more quickly. This belongs to the island's folklore rather than medical guidance.",
        displayOrder: 2,
        published: true,
      },
      {
        id: "name-of-socotra",
        title: "A Name with Debated Origins",
        description:
          "One theory links Socotra to the Sanskrit “dvipa sukhadhara,” commonly interpreted as “the island of bliss.” Another interpretation connects the Arabic “souk,” meaning market, with “qotra,” meaning drop, in reference to dripping frankincense.",
        displayOrder: 3,
        published: true,
      },
      {
        id: "dioscorida",
        title: "Dioscorida",
        description:
          "The Ancient Greeks called the island Dioscorida. The name appears in the first-century navigation text “Periplus of the Erythraean Sea” and has been associated with Castor and Pollux, the Dioscuri who were regarded as protectors of sailors in Greek mythology.",
        displayOrder: 4,
        published: true,
      },
      {
        id: "island-legends",
        title: "Stories of the Island",
        description:
          "Travelers and writers, from Plato to Marco Polo, contributed to tales of sorcerers, genies and monsters. Legends placed flying snakes, a Phoenix nest and the great Roc bird of Sinbad's stories among Socotra's mountains. These are island myths, not historical accounts.",
        displayOrder: 5,
        published: true,
      },
      {
        id: "lion-of-socotra",
        title: "The Lion of Socotra",
        description:
          "For centuries, Gujarati sailors called the maritime route near the island “Sikotro Sinh”—the lion of Socotra that constantly roars—a reference to its powerful seas.",
        displayOrder: 6,
        published: true,
      },
    ],
    displayOrder: 6,
    published: true,
  },
  highlights: [
    {
      id: "rare-landscapes",
      title: "Rare Landscapes",
      description:
        "Coastal plains, limestone plateaus and the Hagghier Mountains shape a varied island terrain.",
      displayOrder: 1,
      published: true,
    },
    {
      id: "distinctive-plant-life",
      title: "Distinctive Plant Life",
      description:
        "Dragon's Blood Trees and other unusual plants reflect centuries of isolation.",
      displayOrder: 2,
      published: true,
    },
    {
      id: "island-wildlife",
      title: "Island Wildlife",
      description:
        "Birds, reptiles, seabirds and marine life contribute to a fragile ecosystem.",
      displayOrder: 3,
      published: true,
    },
    {
      id: "ancient-trade-routes",
      title: "Ancient Trade Routes",
      description:
        "Frankincense, myrrh, aloe and Dragon's Blood resin once moved through Arabian Sea trade.",
      displayOrder: 4,
      published: true,
    },
    {
      id: "living-soqotri-culture",
      title: "Living Soqotri Culture",
      description:
        "Language, agriculture, fishing, music and celebration remain connected to land and sea.",
      displayOrder: 5,
      published: true,
    },
    {
      id: "myths-and-legends",
      title: "Myths and Legends",
      description:
        "Stories of sailors, sorcerers and mythical creatures form a distinct layer of island memory.",
      displayOrder: 6,
      published: true,
    },
  ],
  cta: {
    title: "Ready to Experience Socotra?",
    description:
      "Explore carefully designed journeys through the island's landscapes, culture and natural wonders.",
    primaryAction: {
      label: "Explore Our Tours",
      href: "/tours",
    },
    secondaryAction: {
      label: "Plan Your Journey",
      href: "/booking",
    },
  },
  seo: {
    title: "About Socotra | Island, Nature, Culture and History",
    description:
      "Discover Socotra's extraordinary landscapes, distinctive flora and fauna, ancient history and living Soqotri culture.",
    image: "/socotra-hero-placeholder.png",
  },
} satisfies AboutPageData;

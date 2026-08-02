import type {
  Tour,
  TourExtra,
  TourImage,
  TourItineraryDay,
} from "@/types/tour";

const image: TourImage = {
  src: "/socotra-hero-placeholder.png",
  alt: "Temporary Socotra landscape image showing Dragon Blood Trees on a rugged plateau.",
};

const campingIncluded = [
  "Socotra airport pick-up",
  "4×4 vehicle with driver",
  "Maximum of 3 guests per car, with window seats for everyone",
  "3 freshly prepared meals per day",
  "Snacks and drinks",
  "Camping under the stars",
  "Private tent",
  "Mattress",
  "Pillow",
  "Blanket",
  "Camp setup by the team",
  "Cozy sitting area",
  "Portable toilet",
  "Portable shower",
  "Local English-speaking tour guide",
  "Local guides and rangers for caves, canyons and forests",
  "Entry fees for all protected nature reserves",
  "1 boat trip",
  "Snorkeling equipment",
  "Lasting friendships",
] as const;

const comfyIncluded = [
  "Socotra airport pick-up",
  "4×4 vehicle with driver",
  "Maximum of 3 guests per car, with window seats for everyone",
  "3 freshly prepared meals per day",
  "Snacks and drinks",
  "Local English-speaking tour guide",
  "Local guides and rangers for caves, canyons and forests",
  "Entry fees for all protected nature reserves",
  "1 boat trip",
  "Snorkeling equipment",
  "Lasting friendships",
] as const;

const requiredExtras = [
  {
    id: "abu-dhabi-socotra-flight",
    label: "Round-trip flight between Abu Dhabi and Socotra",
    referencePrice: 950,
    currency: "USD",
  },
  {
    id: "socotra-tourist-visa",
    label: "Official Socotra tourist visa",
    referencePrice: 150,
    currency: "USD",
  },
] satisfies readonly TourExtra[];

const discoveryItinerary = [
  ["Breathtaking Canyon Views", "Guests are welcomed at Socotra Airport before traveling by 4×4 to the Dixam Plateau. The route passes villages, dramatic viewpoints and Dirhur Canyon, with unusual rock formations and the first Dragon Blood Trees. Camp is set up at Dixam, with toilet and shower facilities.", "Camping at Dixam"],
  ["Dragon Blood Trees", "After sunrise and breakfast, the journey descends into the canyon toward the river for a swim, then continues to Firmihin Forest, home to an exceptional concentration of Dragon Blood Trees, endemic plants and birdlife.", "Camping among the Dragon Blood Trees"],
  ["Camels in the Desert", "The tour travels south to Aomak Beach for walking, swimming or relaxation, then visits Degub Cave and its ocean views, chambers and tunnels. Later, guests explore Zahek Dunes, meet local camels and may try sandboarding.", "Camping at Hayf campsite with toilet and shower facilities"],
  ["The White Canyon", "The route passes Bedouin villages and endemic Bottle Trees before reaching Difarhu Wadi. After swimming and lunch beneath palm trees, guests visit Kalisan Canyon and finish at the great dunes of Arher.", "Camping at Arher campsite with toilet and shower facilities"],
  ["Majestic White Dunes", "Guests may climb the Arher dunes for sunrise before breakfast and a swim. The tour then visits Hoq Cave, approximately 2 kilometres deep, before continuing to Dihamri Marine Protected Area for snorkeling.", "Camping at Dihamri campsite with toilet and shower facilities"],
  ["Wonders of the Blue Lagoon", "After a final morning snorkel, the tour travels to Detwah Lagoon, where white sand meets blue water. Guests explore the lagoon and may climb the nearby mountain for lagoon and sunset views.", "Camping at Detwah campsite with toilet and shower facilities"],
  ["The Golden Beach", "A boat trip takes guests to Shoab Beach. Along the way, guests may see spinner dolphins, seabirds and coastal rock formations. After swimming and relaxing, the tour returns by boat and continues to Hadiboh.", "Hotel or guest house in Hadiboh"],
  ["Back to the Airport", "After breakfast, guests are transferred to Socotra Airport for departure.", "Not applicable"],
].map(([title, description, overnight], index) => ({
  day: index + 1,
  title,
  description,
  overnight,
})) satisfies TourItineraryDay[];

const comfyItinerary = [
  ["Arrival in Socotra and Deleisha Beach", "Guests travel along the coastal road to their hotel in Hadiboh. After lunch, the afternoon includes Deleisha Beach for swimming, walking and sunset views.", "Hotel in Hadiboh", false],
  ["Dixam Plateau and Dragon Blood Trees", "Guests travel by 4×4 to the Dixam Plateau and Shebhan viewpoint, known for Dragon Blood Trees, endemic plants and Bedouin communities. The day includes lunch in the canyon and swimming in freshwater pools.", "Darho village or confirmed hotel accommodation", true],
  ["Degub Cave and Aomak Beach", "The tour visits Degub Cave in Nouged, with stalactites, stalagmites and natural pools, before an afternoon at Aomak Beach and the nearby dunes.", "Use the confirmed Comfy Tour accommodation arrangement", false],
  ["Qalansiyah and Detwah Lagoon", "Guests travel to Qalansiyah and protected Detwah Lagoon, known for its sandy landscape, shallow water and sunset views.", "Use the confirmed Comfy Tour accommodation arrangement", false],
  ["Shoab Beach and Dolphins", "A boat trip heads toward Shoab Beach. Guests may see spinner dolphins, seabirds and coastal cliffs before swimming, relaxing and returning toward the confirmed accommodation.", "Use the confirmed Comfy Tour accommodation arrangement", false],
  ["Dihamri Marine Protected Area", "Guests visit Dihamri Marine Protected Area for swimming and snorkeling among reef and marine life. Coral must not be touched.", "Use the confirmed Comfy Tour accommodation arrangement", false],
  ["Hoq Cave and Socotri Culture", "Guests trek to Hoq Cave and may also visit the Socotra folk museum and an endemic plant nursery before returning to Hadiboh.", "Hotel in Hadiboh", false],
  ["Goodbye Socotra", "After breakfast, guests are transferred to Socotra Airport for the flight to Abu Dhabi.", "Not applicable", false],
].map(([title, description, overnight, needsClientConfirmation], index) => ({
  day: index + 1,
  title: String(title),
  description: String(description),
  overnight: String(overnight),
  needsClientConfirmation: Boolean(needsClientConfirmation),
})) satisfies TourItineraryDay[];

function tiers(prefix: string, prices: [number, number, number, number]) {
  return [
    { id: `${prefix}-couples`, label: "Couples", minGuests: 2, maxGuests: 2, pricePerPerson: prices[0], currency: "USD", displayOrder: 1 },
    { id: `${prefix}-4-5`, label: "4–5 Persons", minGuests: 4, maxGuests: 5, pricePerPerson: prices[1], currency: "USD", displayOrder: 2 },
    { id: `${prefix}-6-7`, label: "6–7 Persons", minGuests: 6, maxGuests: 7, pricePerPerson: prices[2], currency: "USD", displayOrder: 3 },
    { id: `${prefix}-8-plus`, label: "8 or More Persons", minGuests: 8, pricePerPerson: prices[3], currency: "USD", displayOrder: 4 },
  ] as const;
}

const common = {
  durationDays: 8,
  durationLabel: "8 Days of Full Discovery",
  practicalNote:
    "An unforgettable journey through the enchanting landscapes of Socotra Island, from the iconic Dragon Blood Trees and mighty sand dunes to pristine beaches, caves, canyons and the beautiful blue lagoon.",
  requiredExtras,
  featuredImage: image,
  galleryImages: [] as const,
  published: true,
  featured: true,
};

export const placeholderTours = [
  {
    ...common, id: "package-1-group-tour", slug: "group-tour", packageLabel: "Package 1", title: "Group Tour", tourType: "Group Tour",
    shortDescription: "An affordable group experience for solo travelers and small groups who want to discover Socotra with like-minded explorers.",
    fullDescription: "Group tours are ideal for solo travelers and small groups of friends who want to join a shared, once-in-a-lifetime journey across Socotra.",
    pricingAvailabilityLabel: "Contact Us for Available Group Dates and Pricing",
    included: campingIncluded, itinerary: discoveryItinerary, displayOrder: 1,
    seoTitle: "Socotra Group Tour | 8-Day Island Adventure",
    seoDescription: "Join an 8-day Socotra group adventure created for solo travelers and small groups.",
  },
  {
    ...common, id: "package-2-camping-wild-tour", slug: "camping-wild-tour", packageLabel: "Package 2", title: "Camping or Wild Tour", tourType: "Private or Family Tour",
    shortDescription: "An adventurous private or family journey through Socotra with camping under the stars and full island discovery.",
    fullDescription: "This package is designed for adventurous travelers who want to experience Socotra through outdoor exploration and camping in some of the island’s most remote and beautiful landscapes.",
    accommodationNote: "The package includes 6 nights of camping and a final night in a guest house or hotel in Hadiboh. The final accommodation is simple, clean and practical rather than luxurious.",
    pricingTiers: tiers("camping", [1800, 1500, 1300, 1050]), included: campingIncluded, itinerary: discoveryItinerary, displayOrder: 2,
    seoTitle: "Socotra Camping & Wild Tour | 8-Day Private Adventure",
    seoDescription: "Discover Socotra on an 8-day private or family camping adventure.",
  },
  {
    ...common, id: "package-3-comfy-tour", slug: "comfy-tour", packageLabel: "Package 3", title: "Comfy Tour", tourType: "Private or Family Tour",
    shortDescription: "A more comfortable way to discover Socotra, combining camping with selected guesthouse or hotel stays.",
    fullDescription: "This package is designed for private travelers, couples and families who want to explore Socotra with camping on most nights and guesthouse or hotel accommodation on arrival, departure and midway through the trip.",
    accommodationNote: "The Comfy experience includes camping on most nights. A guesthouse or hotel is used on arrival, departure and midway through the trip. Hotels in Socotra should not be compared with international luxury hotel standards; the best available accommodation is generally comfortable, clean and practical, with air conditioning, running water, hot water, acceptable Wi-Fi, a comfortable bed and clean sheets where available.",
    pricingTiers: tiers("comfy", [1985, 1695, 1490, 1230]), included: comfyIncluded, itinerary: comfyItinerary, displayOrder: 3,
    needsClientConfirmation: true,
    internalContentNotes: ["Additional isolated itinerary days appear to belong to another version and are not published."],
    seoTitle: "Socotra Comfy Tour | Private 8-Day Journey",
    seoDescription: "Explore Socotra on an 8-day private journey combining camping with selected guesthouse or hotel stays.",
  },
] satisfies readonly Tour[];

export const placeholderFeaturedTours = placeholderTours.filter((tour) => tour.featured && tour.published).sort((a, b) => a.displayOrder - b.displayOrder);
export function getPublishedPlaceholderTourBySlug(slug: string) {
  return placeholderTours.find((tour) => tour.slug === slug && tour.published);
}

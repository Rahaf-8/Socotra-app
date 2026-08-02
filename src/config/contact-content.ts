import type { ContactPageData } from "@/types/contact";

export const contactPageData = {
  hero: {
    eyebrow: "Get in Touch",
    title: "Let's Plan Your Socotra Journey",
    description:
      "Have a question about travelling to Socotra? Send us a message and tell us how we can help.",
  },
  intro: {
    title: "Start with a General Enquiry",
    description:
      "Use this form for questions about tours, travel planning or preparing for your visit. If you have already chosen a package, continue to the booking request instead.",
  },
  methods: [],
  form: {
    eyebrow: "Send a Message",
    title: "How Can We Help?",
    description:
      "Share your question and a few details about what you are looking for.",
    submitLabel: "Send Enquiry",
    submittingLabel: "Sending...",
    successTitle: "Your Message Has Been Received",
    successMessage:
      "Thank you for getting in touch. Your enquiry has been recorded.",
    errorMessage:
      "We could not send your message. Please review the form and try again.",
    unavailableMessage:
      "Online enquiry delivery is not connected yet. Your message has not been sent.",
  },
  enquiryTypes: [
    {
      id: "general-question",
      label: "General Question",
      value: "general-question",
      displayOrder: 1,
      published: true,
    },
    {
      id: "tour-information",
      label: "Tour Information",
      value: "tour-information",
      displayOrder: 2,
      published: true,
    },
    {
      id: "travel-planning",
      label: "Travel Planning",
      value: "travel-planning",
      displayOrder: 3,
      published: true,
    },
    {
      id: "private-journey",
      label: "Private Journey",
      value: "private-journey",
      displayOrder: 4,
      published: true,
    },
    {
      id: "group-enquiry",
      label: "Group Enquiry",
      value: "group-enquiry",
      displayOrder: 5,
      published: true,
    },
    {
      id: "partnership-or-media",
      label: "Partnership or Media",
      value: "partnership-or-media",
      displayOrder: 6,
      published: true,
    },
    {
      id: "other",
      label: "Other",
      value: "other",
      displayOrder: 7,
      published: true,
    },
  ],
  guidance: {
    eyebrow: "Before You Send",
    title: "What to Include",
    description:
      "A little context helps the team understand your question. These details are optional.",
    items: [
      {
        id: "journey-interest",
        text: "The tour or journey you are interested in",
        displayOrder: 1,
        published: true,
      },
      {
        id: "travel-period",
        text: "Your general travel period",
        displayOrder: 2,
        published: true,
      },
      {
        id: "group-size",
        text: "The number of people travelling",
        displayOrder: 3,
        published: true,
      },
      {
        id: "questions",
        text: "Any questions you would like answered",
        displayOrder: 4,
        published: true,
      },
    ],
    faqAction: {
      label: "Read the Travel FAQ",
      href: "/faq",
    },
  },
  bookingCTA: {
    eyebrow: "Ready to Travel?",
    title: "Already Chosen Your Journey?",
    description:
      "Send a booking request with your preferred tour and travel details.",
    primaryAction: {
      label: "Start a Booking Request",
      href: "/booking",
    },
    secondaryAction: {
      label: "Explore Our Tours",
      href: "/tours",
    },
  },
  seo: {
    title: "Contact Tour Socotra | Plan Your Island Journey",
    description:
      "Contact Tour Socotra with questions about tours, travel planning and visiting Socotra Island.",
    image: "/socotra-hero-placeholder.png",
  },
} satisfies ContactPageData;

export const publishedContactEnquiryTypes =
  contactPageData.enquiryTypes
    .filter((option) => option.published)
    .sort((a, b) => a.displayOrder - b.displayOrder);

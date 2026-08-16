import type { Locale } from "@/i18n/config";

export function getBookingContent(locale: Locale) {
  const ar = locale === "ar";
  return {
    hero: {
      eyebrow: ar ? "طلب حجز" : "Booking Request",
      title: ar ? "خطط لرحلتك إلى سقطرى" : "Plan Your Socotra Journey",
      description: ar ? "أرسل الباقة والمواعيد وتفاصيل السفر المفضلة لديك. سيتواصل معك فريقنا لتأكيد التوافر وتوضيح الخطوات التالية." : "Submit your preferred package, dates and travel details. Our team will contact you to confirm availability and provide the next steps.",
    },
    form: {
      title: ar ? "طلب حجز" : "Booking request",
      requestNotice: ar ? "هذا النموذج يرسل طلبًا فقط. ولا يؤكد الحجز أو يعالج أي دفعة." : "This form submits a request only. It does not confirm a booking or process payment.",
      pricingNotice: ar ? "سيؤكد فريق السفر السعر النهائي والتوافر مباشرة." : "Final pricing and availability will be confirmed directly by the travel team.",
      fields: {
        fullName: ar ? "الاسم الكامل" : "Full Name", email: ar ? "البريد الإلكتروني" : "Email Address", whatsapp: ar ? "رقم واتساب" : "WhatsApp Number", country: ar ? "البلد" : "Country", tour: ar ? "باقة الرحلة" : "Tour Package", date: ar ? "تاريخ الوصول المفضل" : "Preferred Arrival Date", adults: ar ? "عدد البالغين" : "Number of Adults", children: ar ? "عدد الأطفال" : "Number of Children", requirements: ar ? "المتطلبات الخاصة" : "Special Requirements",
      },
      selectPackage: ar ? "اختر باقة" : "Select a package",
      submit: ar ? "إرسال طلب الحجز" : "Submit Booking Request",
      submitting: ar ? "جارٍ الإرسال..." : "Submitting…",
      successTitle: ar ? "شكرًا لك!" : "Thank you!",
      successMessage: ar ? "لقد استلمنا طلب حجزك وسيقوم فريقنا بمراجعته والتواصل معك. لم يتم تأكيد الحجز بعد." : "We received your booking request. Our team will review it and contact you; your booking is not yet confirmed.",
      invalidTour: ar ? "اختر باقة رحلة صالحة." : "Select a valid tour package.",
    },
    steps: [
      { id: "tour-and-dates", title: ar ? "الرحلة والمواعيد" : "Tour & Dates", description: ar ? "اختر باقة الرحلة والمواعيد المفضلة وعدد الضيوف والأطفال وأي متطلبات خاصة." : "Select your preferred tour package, travel dates, number of guests, children and any special requirements.", iconKey: "calendar" },
      { id: "making-the-booking", title: ar ? "إتمام الحجز" : "Making the Booking", description: ar ? "بعد إرسال الطلب، سيتواصل الفريق معك لتأكيد التوافر وإنهاء الحجز وتعليمات الدفع." : "Once the request is submitted, the team will contact you to confirm availability and finalise the booking and payment instructions.", iconKey: "message" },
      { id: "sit-back-and-relax", title: ar ? "استرخِ واترك الباقي لنا" : "Sit Back & Relax", description: ar ? "سيرتب الفريق تذاكر الطيران والتأشيرات وغيرها من ترتيبات الرحلة اللازمة بعد تأكيد الحجز." : "The team will arrange flight tickets, visas and other necessary trip arrangements after the booking is confirmed.", iconKey: "plane" },
    ] as const,
    policy: {
      heading: ar ? "احجز بثقة" : "Book With Confidence",
      intro: ar ? "قد تتغير الخطط، لذلك صُممت سياسة الحجز لتوفير المرونة والمساعدة في حماية مدفوعات الضيوف." : "Plans can change, so the booking policy is designed to provide flexibility and help protect guest payments.",
      points: ar ? ["يلزم دفع عربون بنسبة 20% لتثبيت الحجز.", "يستحق الرصيد المتبقي قبل الوصول بـ20 يومًا.", "يصف العميل سياسة استرداد قيمة الرحلة بأنها مرنة.", "لا تدخل تكاليف تذاكر الطيران وتأشيرة الدخول ضمن مبالغ الرحلة القابلة للاسترداد.", "القيم المرجعية الحالية المقدمة من العميل هي 150 دولارًا للتأشيرة و210 دولارات لتذكرة الطيران.", "التحويل البنكي هو وسيلة الدفع المقبولة حاليًا."] : ["A 20% deposit is required to secure the booking.", "The remaining balance is due 20 days before arrival.", "The tour refund policy is described by the client as flexible.", "Airline tickets and entry visa costs are excluded from refundable tour amounts.", "Current client-provided reference values are $150 for the visa and $210 for the flight ticket.", "Bank transfer is currently the accepted payment method."],
      finalNote: ar ? "سيؤكد فريق السفر الشروط النهائية والتوافر وتعليمات الدفع مباشرة." : "Final terms, availability and payment instructions will be confirmed directly by the travel team.",
    },
    sections: { howToBook: ar ? "كيفية الحجز" : "How to Book" },
    seo: { title: ar ? "خطط لرحلتك إلى سقطرى" : "Plan Your Socotra Journey", description: ar ? "أرسل طلب حجز لباقة رحلة إلى سقطرى مع المواعيد وتفاصيل السفر المفضلة." : "Submit a booking request for a Socotra tour package, preferred dates and travel details." },
  };
}

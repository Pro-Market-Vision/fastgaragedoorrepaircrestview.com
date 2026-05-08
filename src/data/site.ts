export interface Service {
  title: string;
  image: string;
  href: string;
  slug: string;
}

export interface ServiceCategory {
  label: string;
  services: Service[];
}

export interface Testimonial {
  quote: string;
  name: string;
  location: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
  megaMenu?: boolean;
}

export interface LocationSection {
  heading: string;
  paragraphs: string[];
}

export interface Location {
  slug: string;
  name: string;
  state: string;
  phoneDisplay: string;
  phoneTel: string;
  address?: string;
  seoSections?: LocationSection[];
}

export const PHONE_DISPLAY = "(850) 920-2243";
export const PHONE_TEL = "+18509202243";
export const COMPANY = "Fast Garage Door Repair & Service Crestview";
export const TAGLINE = "Fast, Reliable, Affordable";
export const DOMAIN = "fastgaragedoorrepaircrestview.com";
export const ADDRESS = "1455 S Ferdon Blvd D4, Crestview, FL 32536";
export const GBP_CID = "4382157912592646255";
export const GBP_URL = "https://maps.google.com/maps?cid=4382157912592646255";

// Zapier webhook config. Final URL:
// https://hooks.zapier.com/hooks/catch/<ZAPIER_ACCOUNT>/<ZAPIER_HOOK_SLUG>/
// Payload format matches Bonita/Titusville: Title-case Name/Phone/Email/Message + source_domain.
export const ZAPIER_ACCOUNT = "15056432";
export const ZAPIER_HOOK_SLUG = "2554z6b";

// CRM ids (optional, populated only if zap maps to leadStatus/adSource)
export const LEAD_STATUS_ID = "";
export const AD_SOURCE_ID = "";

export const LOCATIONS: Location[] = [
  {
    slug: "crestview",
    name: "Crestview",
    state: "FL",
    phoneDisplay: "(850) 920-2243",
    phoneTel: "+18509202243",
    address: "1455 S Ferdon Blvd D4, Crestview, FL 32536",
    seoSections: [
      {
        heading: "Garage Door Repair & Service Across Crestview, FL",
        paragraphs: [
          "Crestview's mix of new construction in Foxwood and Antioch, established neighborhoods off PJ Adams Parkway, and rural homesteads out toward Laurel Hill all share one thing: garage doors that take a beating from Northwest Florida humidity, summer storms, and daily use. Springs snap, openers stop responding, panels dent from work trucks, and tracks bend out of alignment. When that happens, you need a local team that picks up the phone and shows up the same day.",
          "Fast Garage Door Repair & Service Crestview handles <a href='/service/garage-door-spring-repair/' class='text-[#C8102E] font-semibold hover:underline'>spring repair</a>, <a href='/service/garage-door-opener-repair/' class='text-[#C8102E] font-semibold hover:underline'>opener repair</a>, <a href='/service/garage-door-installation/' class='text-[#C8102E] font-semibold hover:underline'>new garage door installation</a>, <a href='/service/garage-door-keypad-repair/' class='text-[#C8102E] font-semibold hover:underline'>keypad repair</a>, <a href='/service/commercial-garage-door-services/' class='text-[#C8102E] font-semibold hover:underline'>commercial garage door services</a>, and <a href='/service/emergency-garage-door-services/' class='text-[#C8102E] font-semibold hover:underline'>24/7 emergency repairs</a> across Crestview and surrounding Okaloosa County communities.",
        ],
      },
      {
        heading: "Why Crestview Homeowners Call Us First",
        paragraphs: [
          "We're based right on S Ferdon Blvd, so when you call we're rolling out of our shop and onto your driveway, not driving up from Pensacola or Fort Walton. Most spring breaks, snapped cables, and dead openers get diagnosed and fixed in a single visit because our trucks carry the most common torsion springs, rollers, hinges, opener boards, and remote replacements.",
          "Pricing is upfront. We quote before we touch the door and offer free estimates on every job. No upsells, no scare tactics, no \"the whole motor needs replacing\" when a sensor fixes it.",
        ],
      },
      {
        heading: "Areas We Serve Around Crestview",
        paragraphs: [
          "Our service area covers Crestview, Baker, Laurel Hill, Holt, Milligan, Niceville, Valparaiso, Shalimar, Eglin AFB housing, Fort Walton Beach, Destin, and the rest of Okaloosa County. Same-day appointments are usually available, call <a href='tel:+18509202243' class='text-[#C8102E] font-semibold hover:underline'>(850) 920-2243</a> and we'll get you scheduled.",
        ],
      },
    ],
  },
];

export const NAV: NavItem[] = [
  {
    label: "Services",
    href: "/#services",
    megaMenu: true,
  },
  { label: "About Us", href: "/about-us/" },
  { label: "Contact Us", href: "/contact-us/" },
  { label: "Blog", href: "/blog/" },
];

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    label: "Repair Services",
    services: [
      { slug: "garage-door-spring-repair", title: "Garage Door Spring Repair", image: "/images/services/garage-door-spring-repair.jpg", href: "/service/garage-door-spring-repair/" },
      { slug: "garage-door-opener-repair", title: "Garage Door Opener Repair", image: "/images/services/garage-door-opener-repair.jpg", href: "/service/garage-door-opener-repair/" },
      { slug: "garage-door-keypad-repair", title: "Garage Door Keypad Repair", image: "/images/services/garage-door-keypad-repair.jpg", href: "/service/garage-door-keypad-repair/" },
    ],
  },
  {
    label: "Installation",
    services: [
      { slug: "garage-door-installation", title: "Garage Door Installation", image: "/images/services/garage-door-installation.jpg", href: "/service/garage-door-installation/" },
    ],
  },
  {
    label: "Commercial",
    services: [
      { slug: "commercial-garage-door-services", title: "Commercial Garage Door Services", image: "/images/services/commercial-garage-door-services.jpg", href: "/service/commercial-garage-door-services/" },
    ],
  },
  {
    label: "Emergency",
    services: [
      { slug: "emergency-garage-door-services", title: "24/7 Emergency Garage Door Services", image: "/images/services/emergency-garage-door-services.jpg", href: "/service/emergency-garage-door-services/" },
    ],
  },
];

export const ALL_SERVICES = SERVICE_CATEGORIES.flatMap((c) => c.services);

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Spring snapped on a Sunday morning and my truck was stuck in the garage. Called these guys, they were out within two hours, replaced both torsion springs, balanced the door, and I was good to go. Honestly didn't expect that kind of response time on a weekend.",
    name: "Travis B.",
    location: "Crestview, FL",
  },
  {
    quote:
      "Our opener died after a thunderstorm took out the circuit board. Tech showed up the next morning, swapped the logic board, reprogrammed our remotes and keypad, all done in like 45 minutes. Way cheaper than a new opener like the other quote I got.",
    name: "Karen L.",
    location: "Niceville, FL",
  },
  {
    quote:
      "Replaced the whole garage door on our shop in Baker. The old one was bent up from where someone backed into it. New door looks great, opens way smoother, and the install crew cleaned up after themselves. No complaints.",
    name: "Mike D.",
    location: "Baker, FL",
  },
];

export const LOCATION_TESTIMONIALS: Record<string, Testimonial[]> = {
  crestview: TESTIMONIALS,
};

export const FAQS: FaqItem[] = [
  {
    question: "Do you offer free estimates?",
    answer:
      'Yes. Free, no-obligation estimates on every job. Call <a href="tel:+18509202243" class="text-[#C8102E] font-semibold hover:underline">(850) 920-2243</a> or <a href="/contact-us/" class="text-[#C8102E] font-semibold hover:underline">request one here</a>.',
  },
  {
    question: "How fast can you get out for a broken spring or stuck door?",
    answer:
      'Most spring repairs and stuck-door calls are handled same-day. Our trucks carry the common torsion springs, rollers, and cables so we can usually fix it on the first visit.',
  },
  {
    question: "What's the cost of a typical repair?",
    answer:
      "Cost depends on the actual repair (broken spring, opener, cable, panel, etc.) so we always quote on-site before any work starts. Free estimates on every job, no surprises.",
  },
  {
    question: "Do you service commercial properties?",
    answer:
      'Yes. We handle <a href="/service/commercial-garage-door-services/" class="text-[#C8102E] font-semibold hover:underline">commercial garage door services</a> for warehouses, shops, fleet bays, and storefronts across Crestview and Okaloosa County.',
  },
  {
    question: "Do you offer 24/7 emergency service?",
    answer:
      'Yes. <a href="/service/emergency-garage-door-services/" class="text-[#C8102E] font-semibold hover:underline">Emergency garage door services</a> are available around the clock for broken springs, off-track doors, and openers that won\'t close. Call <a href="tel:+18509202243" class="text-[#C8102E] font-semibold hover:underline">(850) 920-2243</a>.',
  },
  {
    question: "Can you replace just one panel instead of the whole door?",
    answer:
      "In many cases yes, if the door is a common style and still in production, we can source a matching panel and swap it. If the door is older or discontinued, full <a href=\"/service/garage-door-installation/\" class=\"text-[#C8102E] font-semibold hover:underline\">replacement</a> is usually the better long-term call. We'll lay out both options before you decide.",
  },
  {
    question: "What brands of openers do you work on?",
    answer:
      "All major brands, LiftMaster, Chamberlain, Genie, Craftsman, Linear, Sommer, Marantec, and more. Whether it's a logic board, sensor, gear, or remote programming, we can handle it.",
  },
];

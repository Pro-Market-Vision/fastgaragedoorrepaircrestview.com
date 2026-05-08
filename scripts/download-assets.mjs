// Download every asset Top Notch Doors & Windows uses on its homepage.
// Files land in public/images/ (services + about + logo + hero) and public/seo/ (favicons).
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;

const HOST = "https://topnotchdoorsandwindows.com";
const UPLOAD = `${HOST}/wp-content/uploads/2025/04`;

const downloads = [
  // Logo + branding
  [`${UPLOAD}/cropped-logo.png`, "public/images/logo.png"],
  [`${UPLOAD}/cropped-logo-300x100.png`, "public/images/logo-300x100.png"],

  // Hero background slideshow
  [`${UPLOAD}/Top-Notch-Doors-Windows-Banner-1.jpg`, "public/images/hero-banner-1.jpg"],
  [`${UPLOAD}/Top-Notch-Doors-Windows-Banner-2.jpg`, "public/images/hero-banner-2.jpg"],

  // About section
  [`${UPLOAD}/About-image.png`, "public/images/about.png"],

  // Service cards
  [`${UPLOAD}/Sliding-Door-Repair.jpg`, "public/images/services/sliding-door-repair.jpg"],
  [`${UPLOAD}/Sliding-Door-Replacement.jpg`, "public/images/services/sliding-door-replacement.jpg"],
  [`${UPLOAD}/Sliding-Door-Installation-1.jpg`, "public/images/services/sliding-door-installation.jpg"],
  [`${UPLOAD}/Pocket-Door-Repair.jpg`, "public/images/services/pocket-door-repair.jpg"],
  [`${UPLOAD}/Pocket-Door-Installation.jpg`, "public/images/services/pocket-door-installation.jpg"],
  [`${UPLOAD}/Barn-Door-Installation.jpg`, "public/images/services/barn-door-installation.jpg"],
  [`${UPLOAD}/Barn-Door-Repair.jpg`, "public/images/services/barn-door-repair.jpg"],
  [`${UPLOAD}/Screen-Door-Installation.jpg`, "public/images/services/screen-door-installation.jpg"],
  [`${UPLOAD}/Screen-Door-Repair.jpg`, "public/images/services/screen-door-repair.jpg"],
  [`${UPLOAD}/Glass-Repair-and-Cutting.jpg`, "public/images/services/glass-repair-cutting.jpg"],
  [`${UPLOAD}/Impact-Window-Installation.jpg`, "public/images/services/impact-window-installation.jpg"],
  [`${UPLOAD}/Impact-Window-Replacement.jpg`, "public/images/services/impact-window-replacement.jpg"],
  [`${UPLOAD}/Impact-Window-Repair.jpg`, "public/images/services/impact-window-repair.jpg"],
  [`${UPLOAD}/Commercial-Door-Services.jpg`, "public/images/services/commercial-door-services.jpg"],

  // Favicons
  [`${UPLOAD}/cropped-New-Sliding-Door-Repair-Service-Card-39-32x32.png`, "public/seo/favicon-32.png"],
  [`${UPLOAD}/cropped-New-Sliding-Door-Repair-Service-Card-39-192x192.png`, "public/seo/favicon-192.png"],
  [`${UPLOAD}/cropped-New-Sliding-Door-Repair-Service-Card-39-180x180.png`, "public/seo/apple-touch-icon.png"],

  // About-page imagery
  [`${UPLOAD}/about-top-notch.jpg`, "public/images/about-top-notch.jpg"],
  [`${UPLOAD}/about-sliding-doors.jpg`, "public/images/about-sliding-doors.jpg"],

  // Inner-page hero banners (used on every /about-us, /service/*, /location/*, /contact-us)
  [`${UPLOAD}/SCREEN-DOOR-BANNER.jpg`, "public/images/inner-hero-banner.jpg"],
  [`${UPLOAD}/CTA-Banner.jpg`, "public/images/cta-banner.jpg"],
  [`${UPLOAD}/cta-banner-1.jpg`, "public/images/cta-banner-1.jpg"],
  [`${UPLOAD}/services-banner-a.jpg`, "public/images/services-banner-a.jpg"],

  // Blog hero + post body images
  ["https://topnotchdoorsandwindows.com/wp-content/uploads/2026/03/commercial-door-entrance-v2.jpg", "public/images/blog/commercial-door-entrance-v2.jpg"],
  ["https://topnotchdoorsandwindows.com/wp-content/uploads/2026/03/steel-entry-doors.jpg", "public/images/blog/steel-entry-doors.jpg"],
  ["https://topnotchdoorsandwindows.com/wp-content/uploads/2026/03/aluminum-glass-doors.jpg", "public/images/blog/aluminum-glass-doors.jpg"],
  ["https://topnotchdoorsandwindows.com/wp-content/uploads/2026/03/hollow-metal-doors-v2.jpg", "public/images/blog/hollow-metal-doors-v2.jpg"],
  ["https://topnotchdoorsandwindows.com/wp-content/uploads/2026/03/automatic-sliding-doors-v2.jpg", "public/images/blog/automatic-sliding-doors-v2.jpg"],
  ["https://topnotchdoorsandwindows.com/wp-content/uploads/2026/03/door-security-features.jpg", "public/images/blog/door-security-features.jpg"],
  ["https://topnotchdoorsandwindows.com/wp-content/uploads/2026/03/energy-efficient-doors-v2-1.jpg", "public/images/blog/energy-efficient-doors-v2-1.jpg"],

  // Per-service detail images: each service page on the live site has 3 inline shots
  // (image-a / image-b / image-c). Sliding-Door-Repair uses an exceptional naming convention.
  [`${UPLOAD}/Sliding-Door-Repair-a.jpg`, "public/images/services/sliding-door-repair-a.jpg"],
  [`${UPLOAD}/Sliding-Door-Repair-b.jpg`, "public/images/services/sliding-door-repair-b.jpg"],
  [`${UPLOAD}/Sliding-Door-Repair-c.jpg`, "public/images/services/sliding-door-repair-c.jpg"],
  // Sliding Door Installation has only -a and -b in the original; the live site reuses
  // a sliding-door-replacement variant for its Why Choose Us image — we save it as -c.
  [`${UPLOAD}/sliding-door-replacement-image-c-1.jpg`, "public/images/services/sliding-door-installation-c.jpg"],
  ...[
    "sliding-door-replacement",
    "sliding-door-installation",
    "pocket-door-repair",
    "pocket-door-installation",
    "barn-door-installation",
    "barn-door-repair",
    "screen-door-installation",
    "screen-door-repair",
    "glass-repair-cutting",
    "impact-window-installation",
    "impact-window-replacement",
    "impact-window-repair",
    "commercial-door-services",
  ].flatMap((slug) =>
    ["a", "b", "c"].map((letter) => [
      `${UPLOAD}/${slug}-image-${letter}.jpg`,
      `public/images/services/${slug}-${letter}.jpg`,
    ])
  ),
];

async function fetchOne([url, rel]) {
  const dest = join(ROOT, rel);
  await mkdir(dirname(dest), { recursive: true });
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} -> ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(dest, buf);
  console.log(`✓ ${rel}  (${buf.length.toLocaleString()} bytes)`);
}

async function run() {
  const batchSize = 4;
  for (let i = 0; i < downloads.length; i += batchSize) {
    await Promise.all(
      downloads.slice(i, i + batchSize).map((d) =>
        fetchOne(d).catch((e) => console.error("✗", d[1], e.message))
      )
    );
  }
  console.log("Done.");
}

run();

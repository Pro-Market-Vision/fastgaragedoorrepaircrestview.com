import type { APIRoute } from "astro";
import {
  COMPANY,
  DOMAIN,
  ZAPIER_ACCOUNT,
  ZAPIER_HOOK_SLUG,
  LEAD_STATUS_ID,
  AD_SOURCE_ID,
} from "@/data/site";

export const prerender = false;

interface FormBody {
  name?: string;
  phone?: string;
  email?: string;
  message?: string;
  service?: string;
  honeypot?: string;
  form_name?: string;
  page_url?: string;
  utm?: Record<string, string>;
}

const ZAPIER_HOOK =
  ZAPIER_ACCOUNT && ZAPIER_HOOK_SLUG
    ? `https://hooks.zapier.com/hooks/catch/${ZAPIER_ACCOUNT}/${ZAPIER_HOOK_SLUG}/`
    : "";

function emailValid(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

function phoneValid(s: string) {
  return s.replace(/\D/g, "").length >= 10;
}

export const POST: APIRoute = async ({ request }) => {
  let body: FormBody;
  let isNativeForm = false;
  try {
    const ct = request.headers.get("content-type") || "";
    if (ct.includes("application/json")) {
      body = await request.json();
    } else {
      isNativeForm = true;
      const fd = await request.formData();
      const raw = Object.fromEntries(fd.entries()) as any;
      // Map Title-case form field names to lowercase API contract
      body = {
        name: raw.name || raw.FullName || raw.Name || "",
        phone: raw.phone || raw.PhoneNumber || raw.Phone || "",
        email: raw.email || raw.EmailAddress || raw.Email || "",
        message: raw.message || raw.Message || "",
        service: raw.service || raw["Select Service"] || "",
        honeypot: raw.honeypot || raw["honeypot-911"] || "",
        form_name: raw.form_name,
        page_url: raw.page_url || raw["Page URL"],
      };
    }
  } catch {
    return new Response(JSON.stringify({ error: "bad request" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const successResponse = (extra: Record<string, any> = {}) =>
    isNativeForm
      ? new Response(null, { status: 303, headers: { Location: "/thank-you/" } })
      : new Response(JSON.stringify({ ok: true, ...extra }), {
          status: 200,
          headers: { "content-type": "application/json" },
        });

  // Honeypot trip → silent fake-success (bots can't tell)
  if (body.honeypot) {
    return successResponse();
  }

  const name = (body.name || "").trim();
  const phone = (body.phone || "").trim();
  const email = (body.email || "").trim();
  const message = (body.message || "").trim();

  const errors: string[] = [];
  if (!name) errors.push("name required");
  if (!email) errors.push("email required");
  else if (!emailValid(email)) errors.push("email invalid");
  if (!phone) errors.push("phone required");
  else if (!phoneValid(phone)) errors.push("phone needs 10 digits");

  if (errors.length) {
    return new Response(JSON.stringify({ error: errors.join("; ") }), {
      status: 422,
      headers: { "content-type": "application/json" },
    });
  }

  if (!ZAPIER_HOOK) {
    console.warn("[api/contact] no Zapier hook configured");
    return successResponse({ routed: false });
  }

  // JDM-style Title-case payload, matches Bonita/Titusville Zaps so the same
  // formatter step in Zapier maps Name→customer_name etc.
  const payload = new URLSearchParams();
  payload.set("Name", name);
  payload.set("Phone", phone);
  payload.set("Email", email);
  payload.set("Message", message);
  if (body.service) payload.set("Select Service", body.service);
  payload.set("form_name", body.form_name || `Contact Form - ${COMPANY}`);
  payload.set("Page URL", body.page_url || "");
  payload.set("page_url", body.page_url || "");
  payload.set("source_domain", DOMAIN);
  if (LEAD_STATUS_ID) payload.set("lead_status_id", LEAD_STATUS_ID);
  if (AD_SOURCE_ID) payload.set("ad_source_id", AD_SOURCE_ID);
  if (body.utm) {
    for (const [k, v] of Object.entries(body.utm)) {
      if (k.startsWith("utm_") && v) payload.set(k, v);
    }
  }

  try {
    const z = await fetch(ZAPIER_HOOK, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: payload.toString(),
    });
    if (!z.ok) {
      const text = await z.text().catch(() => "");
      console.error("[api/contact] Zapier returned", z.status, text);
      return new Response(JSON.stringify({ error: "upstream rejected", status: z.status }), {
        status: 502,
        headers: { "content-type": "application/json" },
      });
    }
  } catch (err) {
    console.error("[api/contact] fetch failed", err);
    return new Response(JSON.stringify({ error: "upstream unreachable" }), {
      status: 502,
      headers: { "content-type": "application/json" },
    });
  }

  return successResponse({ routed: true });
};

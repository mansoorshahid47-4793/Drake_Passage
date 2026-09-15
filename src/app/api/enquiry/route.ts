import { NextResponse } from "next/server";
import { validateEnquiry } from "@/lib/enquiry";
import { sendEnquiry } from "@/lib/email";
import { allow } from "@/lib/rateLimit";
import { getCategories } from "@/lib/catalog";

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!allow(ip)) return NextResponse.json({ ok: false, error: "Too many requests. Try again in a few minutes or use WhatsApp." }, { status: 429 });

  let parsed: unknown;
  try { parsed = await req.json(); } catch { return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 }); }

  if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }
  const body = parsed as Record<string, unknown>;

  if (body.botcheck) return NextResponse.json({ ok: true });

  const result = validateEnquiry(body as Record<string, string>, getCategories().map((c) => c.slug));
  if (!result.ok) return NextResponse.json({ ok: false, errors: result.errors }, { status: 400 });

  const sent = await sendEnquiry(result.value);
  if (!sent.ok) {
    console.error("enquiry delivery failed:", sent.reason);
    return NextResponse.json({ ok: false, error: "We could not send your enquiry. Please try again or message us on WhatsApp." }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
const allowedStatuses = ["New", "Contacted", "Qualified", "Closed"] as const;
type LeadStatus = (typeof allowedStatuses)[number];

function getAdminClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase server configuration is missing.");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

async function authorize(request: NextRequest) {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!token || !adminEmail) return false;
  const supabase = getAdminClient();
  const { data, error } = await supabase.auth.getUser(token);
  return !error && data.user?.email?.toLowerCase() === adminEmail;
}

export async function GET(request: NextRequest) {
  try {
    if (!(await authorize(request))) return NextResponse.json({ error: "You are not authorised to view enquiries." }, { status: 401 });
    const supabase = getAdminClient();
    const { data, error } = await supabase.from("enquiries").select("id,name,phone,email,interest,message,ip_location,created_at,status").order("created_at", { ascending: false }).limit(500);
    if (error) throw error;
    return NextResponse.json({ enquiries: data ?? [] });
  } catch (error) {
    console.error("Admin enquiries GET failed:", error);
    return NextResponse.json({ error: "Unable to load enquiries. Check your database setup." }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    if (!(await authorize(request))) return NextResponse.json({ error: "You are not authorised to update enquiries." }, { status: 401 });
    const body = await request.json();
    const id = Number(body.id);
    const status = body.status as LeadStatus;
    if (!Number.isSafeInteger(id) || id < 1 || !allowedStatuses.includes(status)) {
      return NextResponse.json({ error: "A valid enquiry ID and status are required." }, { status: 400 });
    }
    const supabase = getAdminClient();
    const { error } = await supabase.from("enquiries").update({ status }).eq("id", id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Admin enquiries PATCH failed:", error);
    return NextResponse.json({ error: "Unable to update this enquiry." }, { status: 500 });
  }
}

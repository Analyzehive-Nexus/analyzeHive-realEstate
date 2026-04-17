import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { lead } = body

    if (!lead || !lead.phone || !lead.name) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
    }

    const SENSY_API_URL = process.env.SENSY_API_URL || "https://api.sensy.example.com/send"
    const SENSY_API_KEY = process.env.SENSY_API_KEY || "mock-api-key"
    const BROCHURE_URL = process.env.NEXT_PUBLIC_BROCHURE_URL || "https://example.com/brochure.pdf"

    const leadMessage = `Hi ${lead.name}! Thank you for your interest in our Project. Here is your digital brochure: ${BROCHURE_URL}. Our team will call you shortly.`
    const brokerPhone = process.env.INTERNAL_BROKER_PHONE || "+910000000000" // In a real system, fetch broker's phone from profiles
    const internalMessage = `New Lead Alert! Source: ${lead.source}. Name: ${lead.name}. Phone: ${lead.phone}. Assigned to: ${lead.assigned_broker_id || "Unassigned"}`

    console.log(`[Webhook] Simulating Sensy WhatsApp API call to Lead (${lead.phone}):`, leadMessage)
    console.log(`[Webhook] Simulating Sensy WhatsApp API call to Broker (${brokerPhone}):`, internalMessage)

    // Optional: store webhook log in database
    await supabaseAdmin.from("webhook_logs").insert({
      event: "lead-created",
      lead_id: lead.id,
      payload: body,
      processed_at: new Date().toISOString()
    });

    return NextResponse.json({ success: true, message: "Webhook processed successfully" })
  } catch (error: any) {
    console.error("Webhook processing error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

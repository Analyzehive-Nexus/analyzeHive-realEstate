import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { lead } = body

    if (!lead || !lead.phone || !lead.name) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
    }

    // Mock Sensy WhatsApp API config
    const SENSY_API_URL = process.env.SENSY_API_URL || "https://api.sensy.example.com/send"
    const SENSY_API_KEY = process.env.SENSY_API_KEY || "mock-api-key"
    const BROCHURE_URL = process.env.NEXT_PUBLIC_BROCHURE_URL || "https://example.com/brochure.pdf"

    // 1. Send welcoming message to lead
    const leadMessage = `Hi ${lead.name}! Thank you for your interest in our Project. Here is your digital brochure: ${BROCHURE_URL}. Our team will call you shortly.`
    
    // 2. Alert the assigned broker (if known, otherwise a generic internal number)
    const brokerPhone = process.env.INTERNAL_BROKER_PHONE || "+910000000000" // In a real system, fetch broker's phone from profiles
    const internalMessage = `New Lead Alert! Source: ${lead.source}. Name: ${lead.name}. Phone: ${lead.phone}. Assigned to: ${lead.assigned_broker_id || "Unassigned"}`

    console.log(`[Webhook] Simulating Sensy WhatsApp API call to Lead (${lead.phone}):`, leadMessage)
    console.log(`[Webhook] Simulating Sensy WhatsApp API call to Broker (${brokerPhone}):`, internalMessage)

    // Example fetch to Sensy API (mocked):
    /*
    await fetch(SENSY_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${SENSY_API_KEY}`
      },
      body: JSON.stringify({
        to: lead.phone,
        message: leadMessage
      })
    })
    */

    return NextResponse.json({ success: true, message: "Webhook processed successfully" })
  } catch (error: any) {
    console.error("Webhook processing error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function POST(req: Request) {
  // Uncomment in production to verify secret
  // const authHeader = req.headers.get("Authorization");
  // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // }

  try {
    const now = new Date()
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)

    const { data: visits, error } = await supabaseAdmin
      .from("site_visits")
      .select(`
        visit_id, scheduled_at, lead_id, flat_id,
        leads_customers (id, name, phone)
      `)
      .eq("reminder_sent", false)
      .eq("status", "Scheduled")
      .gte("scheduled_at", now.toISOString())
      .lte("scheduled_at", tomorrow.toISOString())

    if (error) {
      console.error("Supabase query error:", error)
      throw error
    }

    if (!visits || visits.length === 0) {
      return NextResponse.json({ message: "No upcoming visits to remind" })
    }

    const notifiedVisitIds = []

    for (const visit of visits) {
      const lead: any = Array.isArray(visit.leads_customers) ? visit.leads_customers[0] : visit.leads_customers
      if (!lead || !lead.phone) continue

      const timeString = new Date(visit.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      const reminderMsg = `Hi ${lead.name}, this is a friendly reminder for your scheduled site visit tomorrow at ${timeString}. We look forward to seeing you!`

      console.log(`[Cron Webhook] Simulating Sensy reminder to ${lead.phone}:`, reminderMsg)

      notifiedVisitIds.push(visit.visit_id)
    }

    if (notifiedVisitIds.length > 0) {
      const { error: updateError } = await supabaseAdmin
        .from("site_visits")
        .update({ reminder_sent: true })
        .in("visit_id", notifiedVisitIds)
        
      if (updateError) {
         console.error("Error updating reminder_sent status:", updateError)
      }
    }

    return NextResponse.json({ success: true, remindersSent: notifiedVisitIds.length })
  } catch (error: any) {
    console.error("Visit reminder webhook error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

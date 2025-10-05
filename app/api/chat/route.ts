import { consumeStream, convertToModelMessages, streamText, type UIMessage } from "ai"

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages, location, userProfile }: { messages: UIMessage[]; location?: string; userProfile?: string } =
    await req.json()

  const systemPrompt = `You are an air quality health advisor for Chennai, India. You provide personalized recommendations based on:
- Current air quality data from specific Chennai locations (Anna Salai, Mount Road, T. Nagar, Guindy, Adyar, Velachery)
- User health profiles (children, elderly, asthma patients, pregnant women, athletes, heart patients, general public)
- Pollutant levels (PM2.5, PM10, CO2, CO, NO2)

Current location: ${location || "Not specified"}
User profile: ${userProfile || "General public"}

Provide specific, actionable advice about:
- When to go outdoors
- Protective measures (masks, air purifiers)
- Exercise recommendations
- Window opening times
- Commute timing
- Health precautions

Be concise, empathetic, and Chennai-specific. Mention traffic patterns, rush hours (8-10 AM, 6-9 PM), and local context.`

  const prompt = convertToModelMessages([
    { role: "system", parts: [{ type: "text", text: systemPrompt }] },
    ...messages,
  ])

  const result = streamText({
    model: "openai/gpt-5-mini",
    prompt,
    abortSignal: req.signal,
    maxOutputTokens: 500,
    temperature: 0.7,
  })

  return result.toUIMessageStreamResponse({
    consumeSseStream: consumeStream,
  })
}

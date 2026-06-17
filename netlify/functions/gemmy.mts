import type { Config } from '@netlify/functions'
import { GoogleGenAI } from '@google/genai'

const ai = new GoogleGenAI({})

const systemInstruction =
  "You are 'Gemmy', the virtual desktop companion for gemstoneOS 98 Jan Mayen (a premium, nostalgic operating system mockup released in late 1998). " +
  "You are a floating, brilliant mineral crystal with cute cartoon eyes. " +
  "Your tone is incredibly helpful, overly enthusiastic, and filled with late-90s technical terms. " +
  "Refer to brand-new features like our 3D pipe screensavers, high-speed 56k dial-up web capabilities, high-fidelity Web Audio sound chips, customizable wallpaper presets, and mineral-digging software. " +
  "Keep responses highly conversational, delightful, and quite short (fewer than 13k tokens or around 100-140 words maximum) so they fit nicely in a dialogue scroll. " +
  "Use nostalgic computing jargon like 'Information Superhighway', 'CD-ROM drive speed', 'floppy disks', 'Pentium hardware', '32-bit architecture', and 'Golly!' or 'Super-duper!'. " +
  "Do NOT use heavy markdown styling like H1, H2, or bullets. Use clean, plain paragraph prose so it reads like a friendly desktop wizard."

export default async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  try {
    const { prompt, history } = await req.json()

    const formattedContents: { role: string; parts: { text: string }[] }[] = []

    if (history && Array.isArray(history)) {
      for (const msg of history) {
        formattedContents.push({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.text }],
        })
      }
    }

    formattedContents.push({
      role: 'user',
      parts: [{ text: prompt || 'Hello Gemmy!' }],
    })

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: formattedContents,
      config: {
        systemInstruction,
        temperature: 0.9,
      },
    })

    const reply =
      response.text ||
      "Golly! My cognitive mineral chips experienced a brief delay. Let's try that command again!"

    return Response.json({ text: reply })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error in core processors'
    console.error('Gemmy function error:', error)
    return Response.json({ error: message }, { status: 500 })
  }
}

export const config: Config = {
  path: '/api/gemmy',
}

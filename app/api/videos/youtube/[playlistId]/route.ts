import { NextResponse } from "next/server"

export async function GET(
  req: Request,
  { params }: { params: { playlistId: string } }
) {
  const { playlistId } = params
  const apiKey = process.env.YOUTUBE_API_KEY
  const maxResults = 10

  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${playlistId}&maxResults=${maxResults}&key=${apiKey}`
  )

  const data = await res.json()

  if (data.error) {
    return NextResponse.json({ error: data.error }, { status: 500 })
  }

  return NextResponse.json(data)
}

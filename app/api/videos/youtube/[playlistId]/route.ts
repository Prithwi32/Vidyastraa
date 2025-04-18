import { NextResponse } from "next/server"

export async function GET(
  req: Request,
  { params }: { params: { playlistId: string } }
) {
  const { playlistId } = params
  const apiKey = process.env.YOUTUBE_API_KEY
  const allItems: any[] = []
  let nextPageToken = ""

  try {
    // Fetch all pages of playlist items
    do {
      const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${playlistId}&maxResults=50&key=${apiKey}${
        nextPageToken ? `&pageToken=${nextPageToken}` : ""
      }`

      const res = await fetch(url)
      const data = await res.json()

      if (data.error) {
        return NextResponse.json({ error: data.error }, { status: 500 })
      }

      allItems.push(...data.items)
      nextPageToken = data.nextPageToken || ""
    } while (nextPageToken)

    if (allItems.length === 0) {
      return NextResponse.json({ items: [] })
    }

    // Fetch video details in batches (YouTube API allows max 50 IDs per request)
    const videoDetails: any[] = []
    const batchSize = 50
    for (let i = 0; i < allItems.length; i += batchSize) {
      const batchIds = allItems
        .slice(i, i + batchSize)
        .map((item) => item.contentDetails.videoId)
        .join(",")

      const detailsRes = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet,statistics&id=${batchIds}&key=${apiKey}`
      )
      const detailsData = await detailsRes.json()
      videoDetails.push(...(detailsData.items || []))
    }

    // Create a map of video details for easy lookup
    const videoDetailsMap = new Map(videoDetails.map((video) => [video.id, video]))

    // Combine playlist items with their video details
    const enrichedItems = allItems.map((item) => {
      const videoDetails = videoDetailsMap.get(item.contentDetails.videoId)
      return {
        ...item,
        duration: videoDetails?.contentDetails?.duration || null,
        statistics: videoDetails?.statistics || null,
        snippet: {
          ...item.snippet,
          ...(videoDetails?.snippet || {}),
        },
      }
    })

    return NextResponse.json({ items: enrichedItems })
  } catch (error) {
    console.error("YouTube API error:", error)
    return NextResponse.json(
      { error: "Failed to fetch playlist data" },
      { status: 500 }
    )
  }
}
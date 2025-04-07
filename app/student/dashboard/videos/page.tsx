"use client"

import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Clock, PlayCircle, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import Image from "next/image"

const PLAYLISTS: Record<string, string> = {
  PHYSICS: "PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz",
  CHEMISTRY: "PLgUwDviBIf0pMFMWuuvDNMAkoQFi-h0ZF",
  MATHEMATICS: "PLgUwDviBIf0rqmgarU5Rx6MP6Qt1_uVx4",
  BIOLOGY: "PLgUwDviBIf0pMFMWuuvDNMAkoQFi-h0ZF",
  JEE: "PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz",
  NEET: "PL9gnSGHSqcnrslTujkMYzx-GuVrpVpu5_",
}

export default function VideosPage() {
  const [videos, setVideos] = useState<Record<string, any[]>>({
    PHYSICS: [],
    CHEMISTRY: [],
    MATHEMATICS: [],
    BIOLOGY: [],
    JEE: [],
    NEET: [],
  })

  const fetchVideos = async () => {
    const entries = await Promise.all(
      Object.entries(PLAYLISTS).map(async ([subject, playlistId]) => {
        const res = await fetch(`/api/videos/youtube/${playlistId}`)
        const data = await res.json()
        const items = data.items?.map((item: any) => ({
          id: item.contentDetails.videoId,
          title: item.snippet.title,
          thumbnail: item.snippet.thumbnails?.medium?.url,
          duration: "N/A",
          instructor: item.snippet.videoOwnerChannelTitle || "Instructor",
          views: Math.floor(Math.random() * 1000) + 500,
          uploadedDate: item.snippet.publishedAt,
          description: item.snippet.description,
        })) || []
        return [subject, items]
      })
    )

    setVideos(Object.fromEntries(entries))
  }

  useEffect(() => {
    fetchVideos()
  }, [])

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
  <div>
    <h2 className="text-3xl font-bold tracking-tight mb-1">🎓 Video Lectures</h2>
    <p className="text-muted-foreground">Watch high-quality lectures from expert instructors</p>
  </div>
  <a
    href="https://www.youtube.com/@takeUforward"
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md shadow hover:bg-red-700 transition-colors text-sm"
  >
    <PlayCircle className="h-4 w-4" />
    Visit YouTube Channel
  </a>
</div>


      <div className="flex items-center mb-6">
        <div className="relative w-full md:w-1/2">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search videos..."
            className="pl-10"
          />
        </div>
      </div>

      <Tabs defaultValue="PHYSICS" className="space-y-6">
        <TabsList className="w-full justify-start overflow-x-auto rounded-md border bg-background p-1 shadow-sm">
          {Object.keys(PLAYLISTS).map((subject) => (
            <TabsTrigger key={subject} value={subject} className="capitalize">
              {subject.toLowerCase()}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(videos).map(([subject, videoList]) => (
          <TabsContent key={subject} value={subject}>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {videoList.map((video) => (
                <Card key={video.id} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow border">
                  <div className="relative aspect-video group cursor-pointer">
                    <Image
                      src={video.thumbnail || "/placeholder.svg"}
                      alt={video.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <PlayCircle className="h-12 w-12 text-white" />
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {video.duration}
                    </div>
                  </div>
                  <CardContent className="p-4 space-y-1">
                    <h3 className="font-semibold text-sm line-clamp-2">{video.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      {video.instructor} • {video.views} views
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {video.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

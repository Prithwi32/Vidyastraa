"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, PlayCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

const PLAYLISTS: Record<string, { id: string; name: string }> = {
  PHYSICS: { id: "PL5CqlNNHaqGPVD3P1s1BSPYdOYTSGpxfT", name: "Physics" },
  CHEMISTRY: { id: "PL5CqlNNHaqGNldahPYJi8W__HFk2s-O63", name: "Chemistry" },
  MATHEMATICS: {
    id: "PL5CqlNNHaqGParoEFtSg4k-5_3D0hmndb",
    name: "Mathematics",
  },
  BIOLOGY: { id: "PL5CqlNNHaqGMRtkLnc_gNMnbG7uQ0KR5F", name: "Biology" },
  JEE: { id: "PL5CqlNNHaqGParoEFtSg4k-5_3D0hmndb", name: "JEE Preparation" },
  NEET: { id: "PL5CqlNNHaqGNXfQ8Fkdds2we6QuX08YhN", name: "NEET Preparation" },
};

const formatDuration = (duration: string): string => {
  if (!duration) return "N/A";

  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return "N/A";

  const hours = parseInt(match[1] || "0");
  const minutes = parseInt(match[2] || "0");
  const seconds = parseInt(match[3] || "0");

  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);

  return parts.join(" ");
};

const formatViews = (views: string | number): string => {
  const num = typeof views === "string" ? parseInt(views) : views;
  if (isNaN(num)) return "N/A views";

  return new Intl.NumberFormat("en-US").format(num) + " views";
};

export default function VideosPage() {
  const [videos, setVideos] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const entries = await Promise.all(
        Object.entries(PLAYLISTS).map(async ([key, { id }]) => {
          const res = await fetch(`/api/videos/youtube/${id}`);
          if (!res.ok) throw new Error(`Failed to fetch ${key} videos`);

          const data = await res.json();

          const items =
            data.items?.map((item: any) => ({
              id: item.contentDetails.videoId,
              title: item.snippet.title,
              thumbnail: getBestThumbnail(item.snippet.thumbnails),
              duration: formatDuration(item.duration),
              instructor: cleanChannelName(item.snippet.videoOwnerChannelTitle),
              views: formatViews(item.statistics?.viewCount),
              uploadedDate: formatDate(item.snippet.publishedAt),
              description: item.snippet.description,
            })) || [];

          return [key, items];
        })
      );

      setVideos(Object.fromEntries(entries));
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper functions
  const getBestThumbnail = (thumbnails: any) => {
    return (
      thumbnails?.maxres?.url ||
      thumbnails?.standard?.url ||
      thumbnails?.high?.url ||
      thumbnails?.medium?.url ||
      "/placeholder.svg"
    );
  };

  const cleanChannelName = (name: string) => {
    if (!name) return "Unknown Instructor";
    return name.replace(/\s-\sYouTube$/, "");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const filteredVideos = Object.entries(videos).reduce(
    (acc, [subject, videoList]) => {
      const filtered = videoList.filter(
        (video) =>
          video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          video.instructor.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (filtered.length > 0) acc[subject] = filtered;
      return acc;
    },
    {} as Record<string, any[]>
  );

  return (
    <div className="w-[80vw] max-w-full mx-auto sm:w-full">
      <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto">
        <div className="mb-6 md:mb-8 flex flex-col gap-4">
          <div className="text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1">
              🎓 Video Lectures
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Watch high-quality lectures from expert instructors
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-1/2 lg:w-1/3">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search videos..."
                className="pl-10 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <a
              href="https://www.youtube.com/@Neetworld-2025"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md shadow hover:bg-red-700 transition-colors text-sm w-full sm:w-auto justify-center"
            >
              <PlayCircle className="h-4 w-4" />
              Visit YouTube Channel
            </a>
          </div>
        </div>

        <Tabs defaultValue={Object.keys(PLAYLISTS)[0]} className="space-y-6">
          <div className="overflow-x-auto pb-2">
            <TabsList className="w-auto md:w-full justify-start rounded-md border bg-background p-1 shadow-sm">
              {Object.entries(PLAYLISTS).map(([key, { name }]) => (
                <TabsTrigger
                  key={key}
                  value={key}
                  className="text-xs sm:text-sm"
                >
                  {name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {loading ? (
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="aspect-video w-full" />
                  <CardContent className="p-3 sm:p-4 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : Object.entries(filteredVideos).length > 0 ? (
            Object.entries(filteredVideos).map(([subject, videoList]) => (
              <TabsContent key={subject} value={subject}>
                <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {videoList.map((video) => (
                    <Dialog key={video.id}>
                      <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow border h-full flex flex-col">
                        <DialogTrigger asChild>
                          <div className="relative aspect-video group cursor-pointer flex-grow-0">
                            <Image
                              src={video.thumbnail || "/placeholder.svg"}
                              alt={video.title}
                              fill
                              className="object-cover"
                              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            />
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <PlayCircle className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                            </div>
                            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 rounded flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {video.duration}
                            </div>
                          </div>
                        </DialogTrigger>
                        <CardContent className="p-3 sm:p-4 space-y-1 flex-grow">
                          <h3 className="font-semibold text-xs sm:text-sm line-clamp-2">
                            {video.title}
                          </h3>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {video.instructor} • {video.views} •{" "}
                            {video.uploadedDate}
                          </p>
                        </CardContent>
                      </Card>

                      <DialogContent className="sm:max-w-[90vw] max-h-[90vh] p-0">
                        <div className="aspect-video w-full">
                          <iframe
                            className="w-full h-full"
                            src={`https://www.youtube.com/embed/${video.id}?autoplay=1`}
                            title={video.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                        <div className="p-4 overflow-y-auto max-h-[40vh]">
                          <h3 className="font-semibold text-lg">
                            {video.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {video.instructor} • {video.views} •{" "}
                            {video.uploadedDate}
                          </p>
                          <p className="text-sm mt-2 whitespace-pre-line">
                            {video.description}
                          </p>
                        </div>
                      </DialogContent>
                    </Dialog>
                  ))}
                </div>
              </TabsContent>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <Search className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mb-4" />
              <h3 className="text-base sm:text-lg font-medium">
                No videos found
              </h3>
              <p className="text-muted-foreground text-xs sm:text-sm">
                {searchQuery
                  ? "Try a different search term"
                  : "No videos available for this category"}
              </p>
            </div>
          )}
        </Tabs>
      </div>
    </div>
  );
}
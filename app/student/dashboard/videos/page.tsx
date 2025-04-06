import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, PlayCircle, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import Image from "next/image"

export default function VideosPage() {
  // Dummy video lectures data
  const videoLectures = {
    PHYSICS: [
      {
        id: 1,
        title: "Introduction to Mechanics",
        thumbnail: "/placeholder.svg?height=200&width=350",
        duration: "45:20",
        instructor: "Dr. Richard Feynman",
        views: 1250,
        uploadedDate: "2023-04-10",
        description: "An introduction to classical mechanics and Newton's laws of motion",
      },
      {
        id: 2,
        title: "Thermodynamics - Heat Transfer",
        thumbnail: "/placeholder.svg?height=200&width=350",
        duration: "38:15",
        instructor: "Dr. Richard Feynman",
        views: 980,
        uploadedDate: "2023-04-15",
        description: "Understanding heat transfer mechanisms: conduction, convection, and radiation",
      },
      {
        id: 3,
        title: "Electromagnetism - Maxwell's Equations",
        thumbnail: "/placeholder.svg?height=200&width=350",
        duration: "52:40",
        instructor: "Dr. Richard Feynman",
        views: 850,
        uploadedDate: "2023-04-20",
        description: "A deep dive into Maxwell's equations and their implications",
      },
    ],
    CHEMISTRY: [
      {
        id: 4,
        title: "Organic Chemistry - Functional Groups",
        thumbnail: "/placeholder.svg?height=200&width=350",
        duration: "41:30",
        instructor: "Dr. Marie Curie",
        views: 1100,
        uploadedDate: "2023-04-12",
        description: "Understanding different functional groups in organic chemistry",
      },
      {
        id: 5,
        title: "Periodic Table Trends",
        thumbnail: "/placeholder.svg?height=200&width=350",
        duration: "35:45",
        instructor: "Dr. Marie Curie",
        views: 920,
        uploadedDate: "2023-04-18",
        description: "Exploring trends in the periodic table of elements",
      },
      {
        id: 6,
        title: "Chemical Bonding",
        thumbnail: "/placeholder.svg?height=200&width=350",
        duration: "48:20",
        instructor: "Dr. Marie Curie",
        views: 780,
        uploadedDate: "2023-04-25",
        description: "Understanding different types of chemical bonds and their properties",
      },
    ],
    MATHEMATICS: [
      {
        id: 7,
        title: "Calculus - Differentiation",
        thumbnail: "/placeholder.svg?height=200&width=350",
        duration: "50:15",
        instructor: "Dr. Isaac Newton",
        views: 1350,
        uploadedDate: "2023-04-05",
        description: "A comprehensive guide to differentiation techniques and applications",
      },
      {
        id: 8,
        title: "Integration Techniques",
        thumbnail: "/placeholder.svg?height=200&width=350",
        duration: "47:30",
        instructor: "Dr. Isaac Newton",
        views: 1050,
        uploadedDate: "2023-04-15",
        description: "Advanced integration techniques and their applications",
      },
      {
        id: 9,
        title: "Linear Algebra - Matrices",
        thumbnail: "/placeholder.svg?height=200&width=350",
        duration: "42:50",
        instructor: "Dr. Isaac Newton",
        views: 890,
        uploadedDate: "2023-04-22",
        description: "Understanding matrices, determinants, and their applications",
      },
    ],
  }

  // Dummy recently viewed videos
  const recentlyViewed = [
    {
      id: 1,
      title: "Introduction to Mechanics",
      thumbnail: "/placeholder.svg?height=80&width=120",
      duration: "45:20",
      lastViewed: "2 days ago",
      progress: 75,
    },
    {
      id: 7,
      title: "Calculus - Differentiation",
      thumbnail: "/placeholder.svg?height=80&width=120",
      duration: "50:15",
      lastViewed: "3 days ago",
      progress: 60,
    },
    {
      id: 4,
      title: "Organic Chemistry - Functional Groups",
      thumbnail: "/placeholder.svg?height=80&width=120",
      duration: "41:30",
      lastViewed: "5 days ago",
      progress: 90,
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <div className="flex flex-col space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Video Lectures</h2>
          <p className="text-muted-foreground">Watch educational videos for your courses</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search videos..." className="pl-8" />
              </div>
            </div>

            <Tabs defaultValue="PHYSICS" className="space-y-4">
              <TabsList className="flex flex-wrap">
                <TabsTrigger value="PHYSICS">Physics</TabsTrigger>
                <TabsTrigger value="CHEMISTRY">Chemistry</TabsTrigger>
                <TabsTrigger value="MATHEMATICS">Mathematics</TabsTrigger>
              </TabsList>

              {Object.entries(videoLectures).map(([subject, videos]) => (
                <TabsContent key={subject} value={subject} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {videos.map((video) => (
                      <Card key={video.id} className="overflow-hidden">
                        <div className="aspect-video relative group cursor-pointer">
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
                        <CardContent className="p-3">
                          <h3 className="font-medium line-clamp-1">{video.title}</h3>
                          <p className="text-xs text-muted-foreground mt-1">
                            {video.instructor} • {video.views} views
                          </p>
                          <p className="text-xs mt-2 line-clamp-2">{video.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Recently Viewed</CardTitle>
                <CardDescription>Continue watching from where you left off</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentlyViewed.map((video) => (
                  <div key={video.id} className="flex space-x-3 cursor-pointer">
                    <div className="relative h-20 w-32 flex-shrink-0">
                      <Image
                        src={video.thumbnail || "/placeholder.svg"}
                        alt={video.title}
                        fill
                        className="object-cover rounded-md"
                      />
                      <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded">
                        {video.duration}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm line-clamp-2">{video.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">Watched {video.lastViewed}</p>
                      <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${video.progress}%` }}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}


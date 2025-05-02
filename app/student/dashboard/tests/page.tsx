"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  CompletedTestCard,
  UpcomingTestCard,
} from "@/components/student/tests/test-card";
import type { TestItem, TestResultItem } from "@/lib/tests/types";
import { useSession } from "next-auth/react";
import { fetchCompletedTests, fetchUpcomingTests } from "@/app/actions/test";
import Loader from "@/components/Loader";
import { toast, ToastContainer } from "react-toastify";

export default function TestsPage() {
  const session = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("completed");
  const [completedTests, setCompletedTests] = useState<TestResultItem[]>([]);
  const [upcomingTests, setUpcomingTests] = useState<TestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showStartTestDialog, setShowStartTestDialog] = useState(false);
  const [selectedTest, setSelectedTest] = useState<TestItem | null>(null);

  async function loadData() {
    setLoading(true);
    try {
      if (activeTab === "completed") {
        const tests = await fetchCompletedTests(
          session?.data?.user?.id as string
        );
        if (tests == null) {
          toast.error("Failed to fetch completed tests");
        } else setCompletedTests(tests);
      } else {
        const tests = await fetchUpcomingTests(
          session?.data?.user?.id as string
        );
        if (tests == null) {
          toast.error("Failed to fetch upcoming tests");
        } else setUpcomingTests(tests);
      }
    } catch (error) {
      console.error("Error loading tests:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (session && session.status === "authenticated") loadData();
  }, [activeTab, session]);

  const handleStartTest = (test: TestItem) => {
    setSelectedTest(test);
    setShowStartTestDialog(true);
  };

  const confirmStartTest = () => {
    setShowStartTestDialog(false);
    if (selectedTest) {
      router.push(`/student/dashboard/tests/${selectedTest.id}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <ToastContainer />
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <div className="flex flex-col space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Test Performance
          </h2>
          <p className="text-muted-foreground">
            Track your test results and upcoming assessments
          </p>
        </div>

        <Tabs
          defaultValue="completed"
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="bg-muted">
            <TabsTrigger value="completed">Completed Tests</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming Tests</TabsTrigger>
          </TabsList>

          <TabsContent value="completed" className="space-y-4">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader />
              </div>
            ) : completedTests.length > 0 ? (
              completedTests.map((test) => (
                <CompletedTestCard key={test.id} test={test} />
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  You haven't completed any tests yet.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-4">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader />
              </div>
            ) : upcomingTests.length > 0 ? (
              upcomingTests.map((test) => (
                <UpcomingTestCard
                  key={test.id}
                  test={test}
                  onStartTest={handleStartTest}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No upcoming tests available.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Start Test Dialog */}
      <Dialog open={showStartTestDialog} onOpenChange={setShowStartTestDialog}>
        <DialogContent className="sm:max-w-[425px] bg-background">
          <DialogHeader>
            <DialogTitle>Start Test</DialogTitle>
            <DialogDescription>
              You are about to start {selectedTest?.title}. Make sure you have
              enough time to complete the test.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Duration:</span>
                <span className="text-sm font-medium">
                  {selectedTest?.duration} minutes
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Questions:
                </span>
                <span className="text-sm font-medium">
                  {selectedTest?.totalQuestions}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Subject:</span>
                <span className="text-sm font-medium">
                  {selectedTest?.subjects[0]?.name}
                </span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowStartTestDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={confirmStartTest}>Start Test</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

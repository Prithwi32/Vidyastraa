"use client";

import { Calendar, Clock, Eye, FileCheck } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import type { TestResultItem, TestItem } from "@/lib/tests/types";

interface CompletedTestCardProps {
  test: TestResultItem;
}

export function CompletedTestCard({ test }: CompletedTestCardProps) {
  const router = useRouter();

  const handleViewResults = () => {
    router.push(`/student/dashboard/tests/${test.testId}/result/${test.id}`);
  };

  const handleViewAnswers = () => {
    router.push(
      `/student/dashboard/tests/${test.testId}?mode=review&resultId=${test.id}`
    );
  };

  return (
    <Card className="bg-background border-border">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{test.test.title}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <Calendar className="h-3 w-3 mr-1" />
              {new Date(test.submittedAt).toLocaleDateString()}
              <Clock className="h-3 w-3 ml-3 mr-1" />
              {test.duration} minutes
            </CardDescription>
          </div>
          <Badge
            className={
              test.score / test.totalMarks >= 0.9
                ? "bg-green-500"
                : test.score / test.totalMarks >= 0.75
                ? "bg-yellow-500"
                : "bg-red-500"
            }
          >
            {Math.round((test.score / test.totalMarks) * 100)}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center text-sm">
          <div>
            <p>
              <span className="font-medium">Questions:</span> {test.correct}{" "}
              correct out of{" "}
              {test.totalQuestions}
            </p>
            <div className="mt-1">
              <Badge variant="outline">{test.test.category}</Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleViewResults}>
              <FileCheck className="h-4 w-4 mr-2" />
              Results
            </Button>
            <Button variant="outline" size="sm" onClick={handleViewAnswers}>
              <Eye className="h-4 w-4 mr-2" />
              View Answers
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface UpcomingTestCardProps {
  test: TestItem;
  onStartTest: (test: TestItem) => void;
}

export function UpcomingTestCard({ test, onStartTest }: UpcomingTestCardProps) {
  return (
    <Card className="bg-background border-border">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{test.title}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <Calendar className="h-3 w-3 mr-1" />
              {new Date(test.createdAt).toLocaleDateString()}
              <Clock className="h-3 w-3 ml-3 mr-1" />
              {test.duration} minutes
            </CardDescription>
          </div>
          <Badge variant="outline">{test.totalQuestions} Questions</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center text-sm">
          <div>
            <Badge variant="outline">{test.subjects[0]}</Badge>
          </div>
          <Button size="sm" onClick={() => onStartTest(test)}>
            Start Test
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

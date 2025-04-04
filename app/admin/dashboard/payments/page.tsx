"use client"

import { useState } from "react"
import { ArrowUpDown, Calendar, Check, CreditCard, Download, Eye, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Mock data for payments
const mockPayments = [
  {
    id: "1",
    userId: "user1",
    userName: "Rahul Sharma",
    courseId: "course1",
    courseName: "JEE Advanced Complete Course",
    paymentId: "pay_123456",
    amount: 12999,
    status: "COMPLETED",
    createdAt: "2023-04-15T10:30:00Z",
  },
  {
    id: "2",
    userId: "user2",
    userName: "Priya Patel",
    courseId: "course2",
    courseName: "NEET Complete Course",
    paymentId: "pay_123457",
    amount: 14999,
    status: "COMPLETED",
    createdAt: "2023-04-14T11:20:00Z",
  },
  {
    id: "3",
    userId: "user3",
    userName: "Amit Kumar",
    courseId: "course3",
    courseName: "Physics Crash Course",
    paymentId: "pay_123458",
    amount: 4999,
    status: "COMPLETED",
    createdAt: "2023-04-13T09:15:00Z",
  },
  {
    id: "4",
    userId: "user4",
    userName: "Sneha Gupta",
    courseId: "course1",
    courseName: "JEE Advanced Complete Course",
    paymentId: "pay_123459",
    amount: 12999,
    status: "FAILED",
    createdAt: "2023-04-12T14:45:00Z",
  },
  {
    id: "5",
    userId: "user5",
    userName: "Vikram Singh",
    courseId: "course4",
    courseName: "Mathematics Foundation",
    paymentId: "pay_123460",
    amount: 3999,
    status: "PENDING",
    createdAt: "2023-04-11T16:30:00Z",
  },
  {
    id: "6",
    userId: "user6",
    userName: "Neha Verma",
    courseId: "course2",
    courseName: "NEET Complete Course",
    paymentId: "pay_123461",
    amount: 14999,
    status: "COMPLETED",
    createdAt: "2023-04-10T13:10:00Z",
  },
  {
    id: "7",
    userId: "user7",
    userName: "Rajesh Khanna",
    courseId: "course5",
    courseName: "Chemistry Mastery",
    paymentId: "pay_123462",
    amount: 5999,
    status: "REFUNDED",
    createdAt: "2023-04-09T10:00:00Z",
  },
  {
    id: "8",
    userId: "user8",
    userName: "Ananya Desai",
    courseId: "course6",
    courseName: "Biology Crash Course",
    paymentId: "pay_123463",
    amount: 4499,
    status: "COMPLETED",
    createdAt: "2023-04-08T09:30:00Z",
  },
  {
    id: "9",
    userId: "user9",
    userName: "Karan Malhotra",
    courseId: "course1",
    courseName: "JEE Advanced Complete Course",
    paymentId: "pay_123464",
    amount: 12999,
    status: "COMPLETED",
    createdAt: "2023-04-07T11:45:00Z",
  },
  {
    id: "10",
    userId: "user10",
    userName: "Meera Reddy",
    courseId: "course7",
    courseName: "JEE Mains Crash Course",
    paymentId: "pay_123465",
    amount: 9999,
    status: "COMPLETED",
    createdAt: "2023-04-06T15:20:00Z",
  },
]

export default function PaymentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("ALL")

  // Filter payments based on search query and status
  const filteredPayments = mockPayments.filter((payment) => {
    const matchesSearch =
      payment.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.paymentId.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "ALL" || payment.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date)
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
        <p className="text-muted-foreground">View and manage all payment transactions</p>
      </div>

      <div className="flex flex-col space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Payment Summary</CardTitle>
            <CardDescription>Overview of payment transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border p-3">
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-blue-100 p-2">
                    <CreditCard className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium">Total Revenue</span>
                </div>
                <div className="mt-2 text-2xl font-bold">
                  {formatCurrency(
                    mockPayments.filter((p) => p.status === "COMPLETED").reduce((sum, p) => sum + p.amount, 0),
                  )}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  From {mockPayments.filter((p) => p.status === "COMPLETED").length} successful payments
                </div>
              </div>

              <div className="rounded-lg border p-3">
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-green-100 p-2">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-sm font-medium">Completed</span>
                </div>
                <div className="mt-2 text-2xl font-bold">
                  {mockPayments.filter((p) => p.status === "COMPLETED").length}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {((mockPayments.filter((p) => p.status === "COMPLETED").length / mockPayments.length) * 100).toFixed(
                    1,
                  )}
                  % of total
                </div>
              </div>

              <div className="rounded-lg border p-3">
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-amber-100 p-2">
                    <Calendar className="h-4 w-4 text-amber-600" />
                  </div>
                  <span className="text-sm font-medium">Pending</span>
                </div>
                <div className="mt-2 text-2xl font-bold">
                  {mockPayments.filter((p) => p.status === "PENDING").length}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">Awaiting confirmation</div>
              </div>

              <div className="rounded-lg border p-3">
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-red-100 p-2">
                    <X className="h-4 w-4 text-red-600" />
                  </div>
                  <span className="text-sm font-medium">Failed/Refunded</span>
                </div>
                <div className="mt-2 text-2xl font-bold">
                  {mockPayments.filter((p) => p.status === "FAILED" || p.status === "REFUNDED").length}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">Requires attention</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Payment Transactions</CardTitle>
            <CardDescription>View all payment transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by student, course, or payment ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Statuses</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="FAILED">Failed</SelectItem>
                  <SelectItem value="REFUNDED">Refunded</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">
                      <div className="flex items-center gap-1">
                        Student
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Payment ID</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{payment.userName}</TableCell>
                      <TableCell>{payment.courseName}</TableCell>
                      <TableCell className="font-mono text-xs">{payment.paymentId}</TableCell>
                      <TableCell>{formatCurrency(payment.amount)}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`${
                            payment.status === "COMPLETED"
                              ? "border-green-200 bg-green-50 text-green-700"
                              : payment.status === "PENDING"
                                ? "border-amber-200 bg-amber-50 text-amber-700"
                                : payment.status === "FAILED"
                                  ? "border-red-200 bg-red-50 text-red-700"
                                  : "border-slate-200 bg-slate-50 text-slate-700"
                          }`}
                        >
                          {payment.status.charAt(0) + payment.status.slice(1).toLowerCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(payment.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View details</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Payment Details</DialogTitle>
                              <DialogDescription>Complete information about this payment</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="grid grid-cols-3 gap-4">
                                <div>
                                  <p className="text-sm font-medium text-muted-foreground">Payment ID</p>
                                  <p className="font-mono">{payment.paymentId}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-muted-foreground">Amount</p>
                                  <p className="font-bold">{formatCurrency(payment.amount)}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                                  <Badge
                                    variant="outline"
                                    className={`${
                                      payment.status === "COMPLETED"
                                        ? "border-green-200 bg-green-50 text-green-700"
                                        : payment.status === "PENDING"
                                          ? "border-amber-200 bg-amber-50 text-amber-700"
                                          : payment.status === "FAILED"
                                            ? "border-red-200 bg-red-50 text-red-700"
                                            : "border-slate-200 bg-slate-50 text-slate-700"
                                    }`}
                                  >
                                    {payment.status.charAt(0) + payment.status.slice(1).toLowerCase()}
                                  </Badge>
                                </div>
                              </div>

                              <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Student</p>
                                <p>{payment.userName}</p>
                                <p className="text-sm text-muted-foreground">ID: {payment.userId}</p>
                              </div>

                              <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Course</p>
                                <p>{payment.courseName}</p>
                                <p className="text-sm text-muted-foreground">ID: {payment.courseId}</p>
                              </div>

                              <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Date & Time</p>
                                <p>{formatDate(payment.createdAt)}</p>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}

                  {filteredPayments.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        No payments found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


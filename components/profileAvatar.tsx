"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, BookOpenText } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

interface ProfileAvatarProps {
  name: string;
  email: string;
  imageUrl?: string;
}

export default function ProfileAvatar({
  name = "",
  email = "",
  imageUrl,
}: Partial<ProfileAvatarProps>) {
  const router = useRouter();
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full p-0 hover:bg-slate-100 dark:hover:bg-slate-800 focus-visible:ring-0 focus-visible:ring-offset-0"
        >
          <Avatar className="h-10 w-10 border border-slate-200 dark:border-slate-800 shadow-sm">
            <AvatarImage src={imageUrl} alt={name} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => router.push("/student/dashboard/profile")}
          >
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => router.push("/student/dashboard")}
          >
            <BookOpenText className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-600 dark:text-red-400 focus:bg-red-50 dark:focus:bg-red-950/50 focus:text-red-600 dark:focus:text-red-400 cursor-pointer"
          onClick={() => signOut()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

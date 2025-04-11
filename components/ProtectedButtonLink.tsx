"use client";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const ProtectedButtonLink = ({
  target,
  guestFallback = "/auth/signin",
  children,
}) => {
  const router = useRouter();
  const { status } = useSession();

  const handleClick = (e) => {
    e.preventDefault();
    if (status === "loading") return;
    const destination = status === "authenticated" ? target : guestFallback;
    router.push(destination);
  };

  return (
    <Button
      onClick={handleClick}
      variant="ghost"
      className="w-full bg-blue-600 text-white"
      disabled={status === "loading"}
    >
      {status === "loading" ? (
        "Loading..."
      ) : (
        <>
          {children}
        </>
      )}
    </Button>
  );
};

export default ProtectedButtonLink;

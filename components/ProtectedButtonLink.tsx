"use client";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button"; // update as per your UI lib
import { ArrowRight } from "lucide-react";

const ProtectedButtonLink = ({
  target,
  guestFallback = "/signin",
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
      className="w-full"
      disabled={status === "loading"}
    >
      {status === "loading" ? (
        "Loading..."
      ) : (
        <>
          {children} <ArrowRight className="ml-2 h-4 w-4" />
        </>
      )}
    </Button>
  );
};

export default ProtectedButtonLink;

"use client";
import { useSession } from "next-auth/react";

export default function ProfilePage() {
  const { data: session } = useSession();

  if (!session) return <p className="text-center text-gray-500">Please log in.</p>;

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-bold">👤 Profile</h2>
      <p className="text-gray-600">Name: {session.user?.name}</p>
      <p className="text-gray-600">Email: {session.user?.email}</p>
    </div>
  );
}

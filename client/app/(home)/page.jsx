"use client";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  console.log(user, isAuthenticated());
  return <div></div>;
}

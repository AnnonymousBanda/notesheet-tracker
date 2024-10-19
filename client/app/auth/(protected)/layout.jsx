"use client";
import Loader from "@/components/Loader";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Layout = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated()) {
      router.push("/");
    } else {
      setLoading(false);
    }
  }, [user, isAuthenticated, router]);

  if (loading) {
    return <Loader />;
  }

  return <>{children}</>;
};

export default Layout;

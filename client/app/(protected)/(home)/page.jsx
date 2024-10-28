"use client";

import AdminDashboard from "@/components/AdminDashboard";
import Pagination from "@/components/Pagination";
import UserDashboard from "@/components/UserDashboard";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const { isAdmin } = useAuth();
  const [admin] = useState(isAdmin());

  const pathname = usePathname();
  const searchparams = useSearchParams();
  const params = new URLSearchParams(searchparams);
  const { replace } = useRouter();

  useEffect(() => {
    if (!params.toString()) {
      params.set("page", "1");
      if (admin) params.set("type", "raised");
      replace(`${pathname}?${params.toString()}`);
    }
  }, []);

  return (
    <>
      {admin ? <AdminDashboard /> : <UserDashboard />}
      <Link
        href="/new-notesheet"
        className="fixed z-10 bottom-8 right-8 flex justify-center items-center bg-black p-4 hover:bg-[#3a3a3a] rounded-xl"
      >
        <img src="/images/plus.svg" alt="" className="w-12 " />
      </Link>
      <Pagination />
    </>
  );
};

export default Dashboard;

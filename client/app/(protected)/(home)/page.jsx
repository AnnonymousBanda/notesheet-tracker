"use client";

import AdminDashboard from "@/components/AdminDashboard";
import UserDashboard from "@/components/UserDashboard";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const { isAdmin, user } = useAuth();
  const [admin] = useState(isAdmin());

  const pathname = usePathname();
  const searchparams = useSearchParams();
  const params = new URLSearchParams(searchparams);
  const { replace } = useRouter();

  useEffect(() => {
    if (!user) return;

    const updatedParams = new URLSearchParams();
      updatedParams.set("page", "1");
      updatedParams.set("sortBy", "raisedAt");
      updatedParams.set("order", "desc");

      if (user?.admin === "adean") {
        if (admin) updatedParams.set("type", "to-approve");
      } else {
        if (admin) updatedParams.set("type", "raised");
      }

      replace(`${pathname}?${updatedParams.toString()}`);
  }, [user]);

  return (
    <>
      {admin ? <AdminDashboard /> : <UserDashboard />}
      {user?.admin === "adean" ? null : (
        <Link
          href="/new-notesheet"
          className="absolute z-10 bottom-8 right-8 flex justify-center items-center bg-black p-4 hover:bg-[#3a3a3a] rounded-xl"
        >
          <img src="/images/plus.svg" alt="" className="w-12 " />
        </Link>
      )}
    </>
  );
};

export default Dashboard;

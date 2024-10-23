"use client";

import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useState } from "react";

const Dashboard = () => {
  const { isAdmin } = useAuth();
  const [admin] = useState(isAdmin());

  const UserDashboard = () => {
    return <div>User Dashboard</div>;
  };

  const AdminDashboard = () => {
    return (
      <>
        <div className="flex flex-col gap-3"></div>
        <Link
          href="/new-notesheet"
          className="fixed bottom-12 right-12 flex justify-center items-center bg-[#04AA6D] hover:bg-[#3bb588] p-4 rounded-xl">
          <img src="/images/plus.svg" alt="" className="w-12" />
        </Link>
      </>
    );
  };

  return admin ? <AdminDashboard /> : <UserDashboard />;
};

export default Dashboard;

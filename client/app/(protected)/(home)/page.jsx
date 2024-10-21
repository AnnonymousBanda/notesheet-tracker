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
      <div className="flex flex-col gap-3">
        <div className="h-[80vh]"></div>
        <Link href="/new-notesheet" className="flex items-center gap-4 bg-green-400 hover:bg-[#52ca52d6] p-3 rounded-xl w-96 justify-center font-semibold">
          <img src="/images/plus.svg" alt="" className="w-8" />
          <h4>NEW NOTESHEET</h4>
        </Link>
      </div>
    );
  };

  return admin ? <AdminDashboard /> : <UserDashboard />;
};

export default Dashboard;

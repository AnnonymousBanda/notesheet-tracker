"use client";

import AdminDashboard from "@/components/AdminDashboard";
import UserDashboard from "@/components/UserDashboard";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useState } from "react";

const Dashboard = () => {
  const { isAdmin } = useAuth();
  const [admin] = useState(isAdmin());
 
  return admin ? <AdminDashboard /> : <UserDashboard />;
};

export default Dashboard;

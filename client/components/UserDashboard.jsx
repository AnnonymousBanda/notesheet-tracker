"use client";
import React, { useEffect, useState } from "react";
import Notesheetsbyme from "./Notesheetsbyme";
import { useDialog } from "@/contexts/DialogBoxContext";
import Loader from "./Loader";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

export default function UserDashboard() {
  const { openDialog } = useDialog();

  const [loading, setLoading] = useState(true);
  const [notesheets, setNotesheets] = useState([]);


  const pathname = usePathname();
  const searchparams = useSearchParams();
  const params = new URLSearchParams(searchparams);
  const { replace } = useRouter();

  const getNotesheets = async () => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/notesheet/raised/user/me?${params.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        }
      );
      const data = await res.json();
      if (!data.notesheets || data.notesheets.length === 0) {
        // return openDialog("No notesheets found");
      }
      setNotesheets(data.notesheets);
      setLoading(false);
    } catch (error) {
      openDialog(error.message);
    }
  };

  useEffect(() => {
    getNotesheets();
  }, [params.toString()]);

  return loading ? (
    <Loader childcomp={true} />
  ) : (
    <div className="flex flex-col gap-12">
      <div className="flex gap-10 w-full justify-center">
        <div
          onClick={() => {
            params.delete("status");
            replace(`${pathname}?${params.toString()}`);
          }}
          className={`p-3 text-gray-700 ${params.get('status') === null ? "bg-gray-400" : "bg-gray-300"}  cursor-pointer hover:bg-gray-400 transition-all duration-500 w-[18rem] text-center rounded-xl`}
        >
          <p className="font-semibold  text-[2rem]">ALL</p>
        </div>
        <div
          onClick={() => {
            params.set("status", "pending");
            params.set("page", "1");
            replace(`${pathname}?${params.toString()}`);
          }}
          className={`p-3 text-gray-700 ${params.get('status') === "pending" ? "bg-gray-400" : "bg-gray-300"}  cursor-pointer hover:bg-gray-400 transition-all duration-500 w-[18rem] text-center rounded-xl`}
        >
          <p className="font-semibold  text-[2rem]">PENDING</p>
        </div>
        <div
          onClick={() => {
            params.set("status", "approved");
            
            params.set("page", "1");
            replace(`${pathname}?${params.toString()}`);
          }}
          className={`p-3 text-gray-700 ${params.get('status') === "approved" ? "bg-gray-400" : "bg-gray-300"}  cursor-pointer hover:bg-gray-400 transition-all duration-500 w-[18rem] text-center rounded-xl`}
        >
          <p className="font-semibold  text-[2rem]">APPROVED</p>
        </div>
        <div
          onClick={() => {
            params.set("status", "rejected");
            params.set("page", "1");
            replace(`${pathname}?${params.toString()}`);
          }}
          className={`p-3 text-gray-700 ${params.get('status') === "rejected" ? "bg-gray-400" : "bg-gray-300"}  cursor-pointer hover:bg-gray-400 transition-all duration-500 w-[18rem] text-center rounded-xl`}
        >
          <p className="font-semibold  text-[2rem]">REJECTED</p>
        </div>
      </div>
      <div className="h-full bg-white rounded-xl w-full flex flex-col gap-12">
        <div className="flex justify-around rounded-t-xl text-gray-700 bg-gray-300 font-semibold">
          <p className="w-1/12 p-3 rounded-xl">S.no</p>
          <p className="w-5/12 p-3 rounded-xl">Subject</p>
          <p className="w-1/12 p-3 rounded-xl">Date</p>
          <p className="w-1/12 p-3 rounded-xl">Amount</p>
          <p className="w-[6rem] p-3 rounded-xl">Status</p>
          <p className="w-[14rem] p-3 rounded-xl">View/Download</p>
        </div>
        <div>
          <Notesheetsbyme notesheets={notesheets} />
        </div>
      </div>
    </div>
  );
}

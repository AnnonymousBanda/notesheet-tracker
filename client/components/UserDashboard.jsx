"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Notesheetsbyme from "./Notesheetsbyme";
import { useDialog } from "@/contexts/DialogBoxContext";
import Loader from "./Loader";

export default function UserDashboard() {
  const { openDialog } = useDialog();
  const [tab, setTab] = useState("raised");
  const [notesheets, setNotesheets] = useState([]);
  const getNotesheets = async () => {
    try {
      const res = await fetch(
        "http://localhost:8000/api/notesheet/raised/user/me",
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
            return openDialog("No notesheets found");
        }
        console.log(data.notesheets);
      setNotesheets(data.notesheets);
    } catch (error) {
      openDialog(error.message);
    }
  };

  useEffect(() => {
    getNotesheets();
  }, []);


  return (notesheets.length === 0 ? <Loader childcomp={true}/> : 
    <div className="flex flex-col gap-12">
      <div className="flex gap-10 w-full justify-center">
        <div className="p-3 text-gray-700 bg-gray-300 cursor-pointer hover:bg-gray-400 transition-all duration-500 w-[18rem] text-center rounded-xl">
          <p className="font-semibold  text-[2rem]">
            PENDING
          </p>
        </div>
        <div className="p-3 text-gray-700 bg-gray-300 cursor-pointer hover:bg-gray-400 transition-all duration-500 w-[18rem] text-center rounded-xl">
          <p className="font-semibold  text-[2rem]">APPROVED</p>
        </div>
        <div className="p-3 text-gray-700 bg-gray-300 cursor-pointer hover:bg-gray-400 transition-all duration-500 w-[18rem] text-center rounded-xl">
          <p className="font-semibold  text-[2rem]">REJECTED</p>
        </div>
      </div>
      <div className="h-full bg-white rounded-xl w-full flex flex-col gap-12">
        <div className="flex justify-around rounded-t-xl text-gray-700 bg-gray-300 font-semibold">
          <p className="w-1/12 p-3 rounded-xl">S.no</p>
          <p className="w-4/12 p-3 rounded-xl">Subject</p>
          <p className="w-1/12 p-3 rounded-xl">Date</p>
          <p className="w-2/12 p-3 rounded-xl">Amount</p>
          <p className="w-[6rem] p-3 rounded-xl">Status</p>
          <p className="w-[14rem] p-3 rounded-xl">View/Download</p>
        </div>
        <div>
          <Notesheetsbyme notesheets={notesheets}/>
        </div>
      </div>

      <Link
        href="/new-notesheet"
        className="fixed bottom-12 right-12 flex justify-center items-center bg-black hover:bg-[#3a3a3a] p-4 rounded-xl"
      >
        <img src="/images/plus.svg" alt="" className="w-12" />
      </Link>
    </div>
  );
}

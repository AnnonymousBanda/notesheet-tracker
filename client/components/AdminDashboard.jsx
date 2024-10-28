import Link from "next/link";
import React, { useEffect, useState } from "react";
import Notesheetsbyme from "./Notesheetsbyme";
import { useDialog } from "@/contexts/DialogBoxContext";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import Pagination from "./Pagination";

export default function AdminDashboard() {
  const { openDialog } = useDialog();
  const [notesheets, setNotesheets] = useState([]);

  const pathname = usePathname();
  const searchparams = useSearchParams();
  const params = new URLSearchParams(searchparams);
  const { replace } = useRouter();
  console.log(searchparams.get('status'));
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
        // return openDialog("No notesheets found");
      }

      setNotesheets(data.notesheets);
    } catch (error) {
      openDialog(error.message);
    }
  };

  useEffect(() => {
    getNotesheets();
  }, []);
  return (
    <div className="flex flex-col gap-12">
      <div className="flex gap-10 w-full justify-center flex-wrap">
        <div
          onClick={() => {
            params.delete("type");
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
            params.delete("type");
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
            params.delete("type");
            params.set("status", "rejected");
            params.set("page", "1");
            replace(`${pathname}?${params.toString()}`);
          }}
          className={`p-3 text-gray-700 ${params.get('status') === "rejected" ? "bg-gray-400" : "bg-gray-300"}  cursor-pointer hover:bg-gray-400 transition-all duration-500 w-[18rem] text-center rounded-xl`}
        >
          <p className="font-semibold  text-[2rem]">REJECTED</p>
        </div>
        <div
          onClick={() => {
            params.delete("status");
            params.set("type", "to-approve");
            params.set("page", "1");
            replace(`${pathname}?${params.toString()}`);
          }}
          className={`p-3 text-gray-700 ${params.get('type') === "to-approve" ? "bg-gray-400" : "bg-gray-300"} cursor-pointer hover:bg-gray-400 transition-all duration-500 w-[18rem] text-center rounded-xl`}
        >
          <p className="font-semibold  text-[2rem]">TO APPROVE</p>
        </div>
        <div
          onClick={() => {
            params.delete("status");
            params.set("type", "approved");
            params.set("page", "1");
            replace(`${pathname}?${params.toString()}`);
          }}
          className={`p-3 text-gray-700 ${params.get('type') === "approved" ? "bg-gray-400" : "bg-gray-300"} cursor-pointer hover:bg-gray-400 transition-all duration-500 w-[18rem] text-center rounded-xl`}
        >
          <p className="font-semibold  text-[2rem]">APPROVED BY ME</p>
        </div>
      </div>
      <div className="h-full bg-white rounded-xl w-full flex flex-col gap-12">
        <div className="flex justify-around rounded-t-xl text-gray-700 bg-gray-300 font-semibold">
          <p className="w-1/12 p-3 rounded-xl">No.</p>
          <p className="w-5/12 p-3 rounded-xl">Subject</p>
          <p className="w-1/12 p-3 rounded-xl">Date</p>
          <p className="w-1/12 p-3 rounded-xl">Amount</p>
          {(params.get('type') === "to-approve" || params.get('type') === "approved-by-me")  ? <p className="w-2/12 p-3 rounded-xl text-center">Raised By</p> : null}
          <p className="w-[8rem] p-3 rounded-xl text-center">Status</p>
          <p className="w-[14rem] p-3 rounded-xl text-center">View/Download</p>
        </div>
        <div>
          <Notesheetsbyme notesheets={notesheets} />
        </div>
      </div>

      <Link
        href="/new-notesheet"
        className="fixed bottom-12 right-12 flex justify-center items-center bg-black hover:bg-[#3a3a3a] p-4 rounded-xl"
      >
        <img src="/images/plus.svg" alt="" className="w-12" />
      </Link>
      <Pagination />
    </div>
  );
}

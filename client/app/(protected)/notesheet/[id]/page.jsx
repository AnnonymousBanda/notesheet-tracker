"use client";
import Loader from "@/components/Loader";
import { useDialog } from "@/contexts/DialogBoxContext";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function NoteSheet() {
  const [notesheet, setNotesheet] = useState({});
  const [loading, setLoading] = useState(true)
  const notesheetID = useParams().id;
  const router = useRouter()
  const { openDialog } = useDialog();
  const getNotesheet = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/notesheet/${notesheetID}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        }
      );
      const data = await response.json();

      console.log(data)

      if(data.notesheet?.length===0)
        return router.push('/not-found')
      else      
        setLoading(false)

      setNotesheet(data.notesheet);
    } catch (error) {
      openDialog(error.response.data.message);
    }
  };
  useEffect(() => {
      getNotesheet();
  }, []);

  return (
    loading ? (
      <Loader />
    ) : (
      <div className="lg:w-screen-md w-full mx-auto pt-3 flex flex-col gap-4">
        <p className="text-gray-500 font-bold text-[3rem] mb-12">
          Notesheet Details
        </p>
        <div className="flex flex-col gap-4 bg-gray-100 p-6 rounded-xl">
          <p className="text-gray-500 font-bold text-[2rem]">
            Subject : <span className="text-gray-700">{notesheet?.subject}</span>
          </p>
          <p className="text-gray-500 font-bold text-[2rem]">
            Raised By : <span className="text-gray-700">{notesheet?.raiser}</span>
          </p>
          <p className="text-gray-500 font-bold text-[2rem]">
            Amount raised :{" "}
            <span className="text-gray-700">₹{notesheet?.amount}</span>
          </p>
          <p className="text-gray-500 font-bold text-[2rem]">
            Current Required Approval :{" "}
            <span className="text-gray-700">
              {notesheet.status?.currentRequiredApproval.name}
            </span>
          </p>
          <p className="text-gray-500 font-bold text-[2rem]">
            Pending Approvals :{" "}
            <span className="text-gray-700">
              {notesheet.status?.pendingApprovals.map((admin, index) =>
                `${admin.name}${
                  index !== notesheet.status?.pendingApprovals.length - 1
                    ? ", "
                    : ""
                }`
              )}
            </span>
          </p>
          <p className="text-gray-500 font-bold text-[2rem]">
            Past Approvals :{" "}
            <span className="text-gray-700">
              {notesheet.status?.passedApprovals.length === 0
                ? "NULL"
                : notesheet.status?.passedApprovals.map((admin, index) =>
                    `${admin.name}${
                      index !== notesheet.status?.passedApprovals.length - 1
                        ? ", "
                        : ""
                    }`
                  )}
            </span>
          </p>
          <p className="text-gray-500 font-bold text-[2rem]">
            Status :{" "}
            <span
              className={`text-gray-700 p-1 rounded-md ${
                notesheet.status?.state === "pending"
                  ? "bg-yellow-300"
                  : notesheet.status?.state === "approved"
                  ? "bg-green-300"
                  : "bg-red-400"
              }`}
            >
              {notesheet.status?.state.toUpperCase()}
            </span>
          </p>
        </div>
  
        <iframe src="http://localhost:8000/uploads/6718ccf0391ed498aaac21c5-1729789487854.pdf" frameborder="0"></iframe>
      </div>
    )
  );
}

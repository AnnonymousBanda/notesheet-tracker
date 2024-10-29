import React, { useEffect, useState } from "react";
import { useDialog } from "@/contexts/DialogBoxContext";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import NotesheetsTable from "./NotesheetsTable";
import TableLoadingSkeleton from "./TableLoadingSkeleton";
import Pagination from "./Pagination";
import NoNotesheets from "./NoNotesheets";

export default function AdminDashboard() {
  const { openDialog } = useDialog();
  const [notesheets, setNotesheets] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const pathname = usePathname();
  const searchparams = useSearchParams();
  const params = new URLSearchParams(searchparams);
  const { replace } = useRouter();
  const getNotesheets = async () => {
    setLoading(true);
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
      setTotalPages(data.total / 10);
      setLoading(false);
    } catch (error) {
      openDialog(error.message);
    }
  };

  const getNotesheetToApprove = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8000/api/notesheet/${params.get("type")}/user/me`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        }
      );
      const data = await res.json();
      console.log(data);
      setNotesheets(data.notesheets);
      setTotalPages(data.total / 10);
      setLoading(false);
    } catch (error) {
      openDialog(error.message);
    }
  };

  useEffect(() => {
    if (params.get("type")) {
      if (params.get("type") === "raised") {
        getNotesheets();
      } else {
        getNotesheetToApprove();
      }
    }
    console.log(notesheets);
  }, [params.toString()]);

  return (
    <div className="flex h-full flex-col gap-[3rem] min-w-[900px]">
      <div className="flex gap-10 w-full justify-center flex-wrap">
        <div
          onClick={() => {
            params.set("type", "raised");
            params.delete("status");
            params.set("page", "1");
            replace(`${pathname}?${params.toString()}`);
          }}
          className={`p-3 text-gray-700 ${
            params.get("status") === null && params.get("type") === "raised"
              ? "bg-gray-400"
              : "bg-gray-300"
          }  cursor-pointer hover:bg-gray-400 transition-all duration-500 w-[18rem] text-center rounded-xl`}
        >
          <p className="font-semibold  text-[2rem]">ALL</p>
        </div>
        <div
          onClick={() => {
            params.set("type", "raised");
            params.set("status", "pending");
            params.set("page", "1");
            replace(`${pathname}?${params.toString()}`);
          }}
          className={`p-3 text-gray-700 ${
            params.get("status") === "pending" ? "bg-gray-400" : "bg-gray-300"
          }  cursor-pointer hover:bg-gray-400 transition-all duration-500 w-[18rem] text-center rounded-xl`}
        >
          <p className="font-semibold  text-[2rem]">PENDING</p>
        </div>
        <div
          onClick={() => {
            params.set("type", "raised");
            params.set("status", "approved");
            params.set("page", "1");
            replace(`${pathname}?${params.toString()}`);
          }}
          className={`p-3 text-gray-700 ${
            params.get("status") === "approved" ? "bg-gray-400" : "bg-gray-300"
          }  cursor-pointer hover:bg-gray-400 transition-all duration-500 w-[18rem] text-center rounded-xl`}
        >
          <p className="font-semibold  text-[2rem]">APPROVED</p>
        </div>
        <div
          onClick={() => {
            params.set("type", "raised");
            params.set("status", "rejected");
            params.set("page", "1");
            replace(`${pathname}?${params.toString()}`);
          }}
          className={`p-3 text-gray-700 ${
            params.get("status") === "rejected" ? "bg-gray-400" : "bg-gray-300"
          }  cursor-pointer hover:bg-gray-400 transition-all duration-500 w-[18rem] text-center rounded-xl`}
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
          className={`p-3 text-gray-700 ${
            params.get("type") === "to-approve" ? "bg-gray-400" : "bg-gray-300"
          } cursor-pointer hover:bg-gray-400 transition-all duration-500 w-[18rem] text-center rounded-xl`}
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
          className={`p-3 text-gray-700 ${
            params.get("type") === "approved" ? "bg-gray-400" : "bg-gray-300"
          } cursor-pointer hover:bg-gray-400 transition-all duration-500 w-[18rem] text-center rounded-xl`}
        >
          <p className="font-semibold  text-[2rem]">APPROVED BY ME</p>
        </div>
      </div>
      {loading ? (
        <TableLoadingSkeleton params={params} />
      ) : notesheets?.length ? (
        <div className="bg-white rounded-xl w-full flex flex-col gap-12 ">
          <div className="flex justify-around rounded-t-xl text-gray-700 bg-gray-300 font-semibold items-center">
            <p className="w-1/12 p-3 rounded-xl">No.</p>
            <p className="w-5/12 max-w-[41.6667%] p-3 rounded-xl">Subject</p>
            <p className="w-2/12 p-3 rounded-xl text-center">Date</p>
            <p className="w-1/12 p-3 rounded-xl">Amount</p>
            {params.get("type") === "to-approve" ||
            params.get("type") === "approved" ? (
              <p className="w-2/12 p-3 rounded-xl text-center">Raised By</p>
            ) : null}
            {params.get("status") === "rejected" && (
              <p className="w-2/12 max-w-[16.66666%] p-3 rounded-xl">Action Required</p>
            )}
            <p className="w-[8rem] p-3 rounded-xl text-center">Status</p>
            <p className="w-[14rem] p-3 rounded-xl text-center">
              View/Download
            </p>
          </div>

          <div>
            <NotesheetsTable notesheets={notesheets} />
          </div>
        </div>
      ) : (
        <NoNotesheets />
      )}
      <Pagination total={totalPages} />
      <div className='min-h-[4rem] w-full'></div>
    </div>
  );
}

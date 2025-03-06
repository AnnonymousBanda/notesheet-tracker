import React, { useEffect, useState } from "react";
import { useDialog } from "@/contexts/DialogBoxContext";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import NotesheetsTable from "./NotesheetsTable";
import TableLoadingSkeleton from "./TableLoadingSkeleton";
import Pagination from "./Pagination";
import NoNotesheets from "./NoNotesheets";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";
import Image from "next/image";

export default function AdminDashboard() {
  const { openDialog } = useDialog();
  const { user } = useAuth();
  const [notesheets, setNotesheets] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const pathname = usePathname();
  const searchparams = useSearchParams();
  const params = new URLSearchParams(searchparams);
  const { replace } = useRouter();

  const getNotesheets = async (params) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8000/api/notesheets/user/me?${params.toString()}`,
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        }
      );

      setNotesheets(response.data.notesheets);
      setTotalPages(response.data.total / 10);
      setLoading(false);
    } catch (error) {
      if (error.response) {
        openDialog(error.response.data.message);
      } else {
        openDialog(error.message);
      }
    }
  };

  useEffect(() => {
    if (!user) return;

    const params = new URLSearchParams(searchparams);
    if (!params.toString()) {
      params.set("type", "raised");
      params.set("sortBy", "raisedAt");
      params.set("order", "desc");
      params.set("page", "1");
      replace(`${pathname}?${params.toString()}`);
      return;
    }
    let type;
    if (user.role.includes("superadmin")) {
      const types = ["approved", "to-approve"];
      if (types.includes(params.get("type"))) {
        type = params.get("type");
      } else {
        type = "to-approve";
      }
    } else if (user.role.includes("admin")) {
      const types = ["approved", "to-approve", "raised"];
      if (types.includes(params.get("type"))) {
        type = params.get("type");
      } else {
        type = "raised";
      }
    } else {
      type = "raised";
    }
    const status = params.get("status");
    const sortBy = params.get("sortBy") || "raisedAt";
    const order = params.get("order") || "desc";
    const page = params.get("page") || 1;

    const updatedParams = new URLSearchParams();
    updatedParams.set("type", type);
    if (status) updatedParams.set("status", status);
    updatedParams.set("sortBy", sortBy);
    updatedParams.set("order", order);
    updatedParams.set("page", page);

    replace(`${pathname}?${updatedParams.toString()}`);
    getNotesheets(params);
  }, [params.toString()]);

  const handleSort = (e) => {
    console.log(e.target.innerText);

    const params = new URLSearchParams(searchparams);
    const mapping = {
      Subject: "subject",
      Date: "raisedAt",
      // 'Raised By': 'raisedBy.name',
      Amount: "amount",
      Status: "status",
    };

    if (params.get("sortBy") === mapping[e.target.innerText]) {
      params.set("order", params.get("order") === "asc" ? "desc" : "asc");
    } else {
      params.set("sortBy", mapping[e.target.innerText]);
      params.set("order", "asc");
    }

    params.set("page", "1");
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex h-full flex-col gap-12 overflow-hidden">
      <div className="flex flex-col items-center h-full">
        <div className="flex w-full justify-evenly">
          <div className="flex w-fit justify-evenly bg-[#9ca3af63] rounded-t-xl">
            {user?.role.includes("superadmin") ? null : (
              <>
                <div
                  onClick={() => {
                    params.set("type", "raised");
                    params.set("status", "pending");
                    params.set("page", "1");
                    replace(`${pathname}?${params.toString()}`);
                  }}
                  className={`p-3 text-gray-700 ${
                    params.get("status") === "pending" &&
                    params.get("type") === "raised"
                      ? "bg-gray-300"
                      : "bg-transparent hover:bg-[#e5e7eba8]"
                  }  cursor-pointer transition-all duration-500 w-[8rem] py-[1rem] xl:w-[10rem] flex justify-center rounded-t-xl`}
                >
                  <Image
                    src="/images/icons/pending.png"
                    width={35}
                    height={35}
                    alt="Pending icon"
                  />
                </div>
                <div
                  onClick={() => {
                    params.set("type", "raised");
                    params.set("status", "approved");
                    params.set("page", "1");
                    replace(`${pathname}?${params.toString()}`);
                  }}
                  className={`p-3 text-gray-700 ${
                    params.get("status") === "approved" &&
                    params.get("type") === "raised"
                      ? "bg-gray-300"
                      : "bg-transparent hover:bg-[#e5e7eba8]"
                  }  cursor-pointer transition-all duration-500 w-[8rem] py-[1rem] xl:w-[10rem] flex justify-center rounded-t-xl`}
                >
                  <Image
                    src="/images/icons/approved.png"
                    width={35}
                    height={35}
                    alt="Approved icon"
                  />
                </div>
                <div
                  onClick={() => {
                    params.set("type", "raised");
                    params.set("status", "rejected");
                    params.set("page", "1");
                    replace(`${pathname}?${params.toString()}`);
                  }}
                  className={`p-3 text-gray-700 ${
                    params.get("status") === "rejected" &&
                    params.get("type") === "raised"
                      ? "bg-gray-300"
                      : "bg-transparent hover:bg-[#e5e7eba8]"
                  }  cursor-pointer transition-all duration-500 w-[8rem] py-[1rem] xl:w-[10rem] flex justify-center rounded-t-xl`}
                >
                  <Image
                    src="/images/icons/rejected.png"
                    width={35}
                    height={35}
                    alt="Rejected icon"
                  />
                </div>
              </>
            )}
          </div>
          <div className="flex w-fit justify-evenly bg-[#9ca3af63] rounded-t-xl">
            <div
              onClick={() => {
                params.delete("status");
                params.set("type", "to-approve");
                params.set("page", "1");
                replace(`${pathname}?${params.toString()}`);
              }}
              className={`p-3 text-gray-700 ${
                params.get("type") === "to-approve"
                  ? "bg-gray-300"
                  : "bg-transparent hover:bg-[#e5e7eba8]"
              } cursor-pointer transition-all duration-500 w-[8rem] py-[1rem] xl:w-[10rem] flex justify-center rounded-t-xl`}
            >
              <Image
                src="/images/icons/to-approve.png"
                width={35}
                height={35}
                alt="Approved icon"
              />
            </div>
            <div
              onClick={() => {
                params.delete("status");
                params.set("type", "approved");
                params.set("page", "1");
                replace(`${pathname}?${params.toString()}`);
              }}
              className={`p-3 text-gray-700 ${
                params.get("type") === "approved"
                  ? "bg-gray-300"
                  : "bg-transparent hover:bg-[#e5e7eba8]"
              } cursor-pointer transition-all duration-500 w-[8rem] py-[1rem] xl:w-[10rem] flex justify-center rounded-t-xl`}
            >
              <Image
                src="/images/icons/approved-by-me.png"
                width={35}
                height={35}
                alt="Approved by me icon"
              />
            </div>
          </div>
        </div>
        {loading ? (
          <TableLoadingSkeleton params={params} />
        ) : notesheets?.length ? (
          <div className="bg-white lg:rounded-xl w-full h-[90%] overflow-auto flex flex-col gap-[1rem]">
            <div className="flex justify-around min-w-[900px] lg:rounded-t-xl text-gray-700 bg-gray-300 font-semibold items-center">
              <p className="w-[5%] p-3 rounded-xl">No.</p>
              <div className="w-[35.71%] p-3 rounded-xl">
                <p className="w-full cursor-pointer" onClick={handleSort}>
                  Subject
                </p>
              </div>
              <div className="w-[14.28%] p-3 rounded-xl flex justify-center">
                <p className="w-fit cursor-pointer" onClick={handleSort}>
                  Date
                </p>
              </div>
              <div className="w-[14.28%] p-3 rounded-xl">
                <p className="w-full cursor-pointer text-center" onClick={handleSort}>
                  Amount
                </p>
              </div>
              {params.get("type") === "to-approve" ||
              params.get("type") === "approved" ? (
                <div className="w-[14.28%] p-3 rounded-xl flex justify-center">
                  <p
                  // className='w-fit cursor-pointer'
                  // onClick={handleSort}
                  >
                    Raised By
                  </p>
                </div>
              ) : null}
              {params.get("status") === "rejected" && (
                <p className="w-[14.28%] max-w-[16.66666%] p-3 rounded-xl">
                  Action Required
                </p>
              )}
              <div className="w-[7.14%] p-3 rounded-xl flex justify-center">
                <p className="w-fit cursor-pointer" onClick={handleSort}>
                  Status
                </p>
              </div>
              <p className="w-[14.28%] p-3 rounded-xl text-center">
                View/Download
              </p>
            </div>

            <div className="overflow-y-auto overflow-x-clip min-w-[900px] w-full h-full">
              <NotesheetsTable notesheets={notesheets} />
            </div>
          </div>
        ) : (
          <div className="w-full  h-full pt-[2rem]">
            <NoNotesheets />
          </div>
        )}
      </div>
      <Pagination total={totalPages} />
      <div className="min-h-[4rem] w-full"></div>
    </div>
  );
}

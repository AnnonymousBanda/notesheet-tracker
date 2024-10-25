"use client";
import { LazyBlurImage } from "@/components/LazyBlurImage";
import Loader from "@/components/Loader";
import { useAuth } from "@/contexts/AuthContext";
import { useDialog } from "@/contexts/DialogBoxContext";
import { useParams, useRouter } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";

export default function NoteSheet() {
  const [notesheet, setNotesheet] = useState({});
  const [loading, setLoading] = useState(true);
  const notesheetID = useParams().id;
  const router = useRouter();
  const { openDialog } = useDialog();
  const { user } = useAuth();
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

      if (!data.notesheet || data.notesheet?.length === 0)
        return router.push("/not-found");
      else setLoading(false);

      setNotesheet(data.notesheet);
    } catch (error) {
      openDialog(error.response.data.message);
    }
  };
  useEffect(() => {
    getNotesheet();
  }, []);

  const NotesheetDetail = () => {
    return (
      <div className="lg:w-screen-md w-full mx-auto pt-3 flex flex-col gap-4">
        <p className="text-gray-500 font-bold text-[3rem] mb-12">
          Notesheet Details
        </p>
        <div className="flex flex-col gap-4 bg-gray-100 p-6 rounded-xl">
          <p className="text-gray-500 font-bold text-[2rem]">
            Subject :{" "}
            <span className="text-gray-700">{notesheet?.subject}</span>
          </p>
          <p className="text-gray-500 font-bold text-[2rem]">
            Raised By :{" "}
            <span className="text-gray-700">{notesheet?.raiser}</span>
          </p>
          <p className="text-gray-500 font-bold text-[2rem]">
            Amount raised :{" "}
            <span className="text-gray-700">₹{notesheet?.amount}</span>
          </p>

          <div className="flex gap-[1rem]">
            <p className="text-gray-500 font-bold text-[2rem]">
              Current Required Approval :{" "}
            </p>
            {notesheet?.status?.currentRequiredApproval == null ? (
              <LazyBlurImage  src="icons/null.svg" width={30} height={30} />
            ) : (
              <div className="text-gray-700 font-bold text-[2rem] flex gap-3">
                <div className="flex items-center gap-2 bg-gray-200 px-4 rounded-lg">
                  <LazyBlurImage
                    src="user.png"
                    alt={notesheet?.status?.currentRequiredApproval.name}
                    width={20}
                    height={20}
                    rounded={true}
                  />
                  <p>{notesheet?.status?.currentRequiredApproval.name}</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-[1rem]">
            <p className="text-gray-500 font-bold text-[2rem]">
              Pending Approvals :{" "}
            </p>
            {notesheet?.status?.pendingApprovals == [] ? (
              <LazyBlurImage src="icons/null.svg" width={30} height={30} />
            ) : (
              <div className="text-gray-700 font-bold text-[2rem] flex gap-3">
                {notesheet?.status?.pendingApprovals.map((admin, index) => (
                  <div className="flex items-center gap-2 bg-gray-200 px-4 rounded-lg">
                    <LazyBlurImage
                      src="user.png"
                      alt={admin.name}
                      width={20}
                      height={20}
                      rounded={true}
                    />
                    <p>{admin.name.toUpperCase()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-[1rem]">
            <p className="text-gray-500 font-bold text-[2rem]">
              Past Approvals :{" "}
            </p>
            {notesheet?.status?.passedApprovals?.length === 0 ? (
              <LazyBlurImage src="icons/null.svg" width={30} height={30}/>
            ) : (
              <div className="text-gray-700 font-bold text-[2rem] flex gap-3">
                {notesheet?.status?.pendingApprovals.map((admin, index) => (
                  <div className="flex items-center gap-2 bg-gray-200 px-4 rounded-lg">
                    <LazyBlurImage
                      src="user.png"
                      alt={admin.name}
                      width={40}
                      height={40}
                      rounded={true}
                    />
                    <p>{admin.name.toUpperCase()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-[1rem] items-center">
            <p className="text-gray-500 font-bold text-[2rem]">Status :</p>
            <LazyBlurImage
              src={`icons/${notesheet?.status?.state}.png`}
              alt={`${notesheet?.status?.state} icon`}
              width={40}
              height={40}
              rounded={false}
            />
            <p
              className={
                (notesheet?.status?.state === "pending"
                  ? "text-yellow-400"
                  : notesheet?.status?.state === "approved"
                  ? "text-green-400"
                  : "text-red-500") + " font-semibold"
              }
            >
              {notesheet?.status?.state.toUpperCase()}
            </p>
          </div>
        </div>
        <div className="p-3">
          {/* <Suspense fallback={<p>Loding...</p>}> */}
          <iframe
            src={notesheet?.pdf}
            width="100%"
            height={500}
            className="rounded-xl"
          ></iframe>
          {/* </Suspense>  */}
        </div>
        {user?.admin && (
          <div className="flex gap-10 justify-around">
            <button
              onClick={() => router.push(`/approve-notesheet/${notesheetID}`)}
              className="cursor-pointer"
            >
              <LazyBlurImage
                src="icons/approve.png"
                alt="Approve"
                width={75}
                height={75}
                rounded={false}
              />
            </button>
            <button className="cursor-pointer">
              <LazyBlurImage
                src="icons/reject.png"
                alt="Reject"
                width={75}
                height={75}
                rounded={false}
              />
            </button>
          </div>
        )}
      </div>
    );
  };

  return loading ? <Loader /> : <NotesheetDetail />;
}

import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import React from "react";

export default function Page() {
  return (
    <div className="flex flex-col justify-center items-center h-[100vh] w-full mx-auto rounded-xl bg-gray-100 shadow-xl p-8">
      <ExclamationTriangleIcon className="w-28 h-28 text-gray-500 mb-4" />
      <p className="text-[3rem] text-gray-700 font-bold mb-[2rem]">
        You are not allowed to use this platform!
      </p>
      <button className="w-[15rem] flex items-center justify-center bg-[#2f2f2f] text-white h-[45px] px-4 rounded-sm hover:bg-[#0e0202] text-[1.7rem]">
        <Link href="/auth/login">
          <p className="text-[1.5rem] text-[#ffffff] text-center">
            Click here to login
          </p>
        </Link>
      </button>
    </div>
  );
}

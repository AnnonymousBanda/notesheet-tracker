import React from "react";
import Loginform from "@/components/loginform";

export default function Login() {
  return (
    <div className=" flex flex-col items-center justify-center min-h-screen p-5 bg-gray-200">
      <div className="w-full max-w-xl p-10 pb-20  bg-white rounded-lg shadow-lg flex flex-col gap-8 items-center border border-gray-300">
        <div className="flex flex-col items-center gap-4 w-full text-center">
          <h3>Login</h3>
        </div>
        <Loginform />
        <div className="flex w-full items-center gap-2">
            <hr className="border-black w-full border-solid" />
            <p>OR</p>
            <hr className="border-black w-full border-solid" />
        </div>
        
        <form className="w-full">
          <div className="w-full flex justify-center items-center mt-8">
            <button className="flex gap-3 items-center justify-center  bg-[#2f2f2f] text-white h-[45px] px-4 rounded-sm hover:bg-[#0e0202]">
              <img src="/images/ms_logo.svg" alt="" />
              <p>Sign In with Microsoft</p>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

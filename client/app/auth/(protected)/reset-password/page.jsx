'use client'
import ResetPasswordForm from "@/components/resetpassword";
import React from "react";

export default function ForgotPassword() {
  return (
    <div className=" flex flex-col items-center justify-center min-h-screen p-5 bg-gray-200">
      <div className="w-full max-w-xl p-10 pb-20  bg-white rounded-lg shadow-lg flex flex-col gap-8 items-center border border-gray-300">
        <div className="flex flex-col items-center gap-4 w-full text-center">
          <h3>Reset Password</h3>
        </div>
        <ResetPasswordForm />
      </div>
    </div>
  );
}

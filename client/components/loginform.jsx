"use client";
import React from "react";
import { useForm } from "react-hook-form";

export default function Loginform() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }, 
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        <label className="block text-[1.5rem] font-medium text-gray-700">
          Email Address
        </label>
        <input
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Invalid email address",
            },
          })}
          className="text-[2rem] border-black border-solid w-full p-2"
          type="email"
          placeholder="Email"
        />
        {errors.email && <p className="text-red-600">{errors.email.message}</p>}
      </div>
      <div className="flex flex-col gap-3">
        <label className="block text-[1.5rem] font-medium text-gray-700">
          Password
        </label>
        <input
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
          className="text-[2rem] border-black border-solid w-full p-2"
          type="password"
          placeholder="Password"
        />
        {errors.password && <p className="text-red-600">{errors.password.message}</p>}
      </div>
      <div className="text-right">
        <a href="/auth/forgot-password">
          <p>Forgot Password?</p>
        </a>
      </div>

      <div className="w-full flex justify-center">
        <button
          type="submit"
          className="w-[15rem] flex items-center justify-center bg-[#2f2f2f] text-white h-[45px] px-4 rounded-sm hover:bg-[#0e0202] text-[1.7rem]"
        >
          <p>Login</p>
        </button>
      </div>
    </form>
  );
}

"use client";
import React, { useState } from "react";
import { set, useForm } from "react-hook-form";
import DialogBox from "./DialogBox";

export default function ResetPasswordForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setshowConfirmPassword] = useState(false);
  const [isopen, setIsOpen] = useState(false);
  const [showDialogue, setShowDialogue] = useState({
    isOpen: false,
    message: "",
  });

  const showErrorDialog = (message) => {
		setErrorDialog({
			isOpen: true,
			message,
		})
	}

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleConfirmPasswordVisibility = () => {
    setshowConfirmPassword(!showConfirmPassword);
  };

  const onSubmit = (data) => {
    if (data.password !== data.confirmPassword) {
      setIsOpen(true);
      reset();
      setShowPassword(false);
      setshowConfirmPassword(false);
      return;
    }
    console.log("data", data);
    console.log(data.password.length);
    setShowPassword(false);
    setshowConfirmPassword(false);
    reset();
  };

  const onError = (error)=>{
    if(error.password.length < 6)
    {
      showErrorDialog(error.password.message);
    }
    else if(error.password !== error.confirmPassword)
    {
      showErrorDialog(error.confirmPassword.message);
    }
  }

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit, onError)}
        className="w-full flex flex-col gap-10"
      >
        <div className="flex flex-col gap-3 relative">
          <label className="block text-[1.5rem] font-medium text-gray-700">
            Password
          </label>
          <div>
            <input
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password should have at least 6 characters",
                },
              })}
              className="text-[2rem] border-black border-solid w-full p-2"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-[40px] text-[2rem] cursor-pointer"
            >
              {showPassword ? (
                <img className="w-8" src="/images/eye.svg" alt="" />
              ) : (
                <img className="w-8" src="/images/eyeslash.svg" alt="" />
              )}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3 relative">
          <label className="block text-[1.5rem] font-medium text-gray-700">
            Confirm Password
          </label>
          <div className="flex items-center">
            <input
              {...register("confirmPassword", {
                required: "Enter password again",
              })}
              className="text-[2rem] border-black border-solid w-full p-2"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
            />

            <button
              type="button"
              onClick={toggleConfirmPasswordVisibility}
              className="absolute right-3 text-[2rem] cursor-pointer"
            >
              {showConfirmPassword ? (
                <img className="w-8" src="/images/eye.svg" alt="" />
              ) : (
                <img className="w-8" src="/images/eyeslash.svg" alt="" />
              )}
            </button>
          </div>
        </div>

        <div className="w-full flex justify-center">
          <button
            type="submit"
            className="w-[15rem] flex items-center justify-center bg-[#2f2f2f] text-white h-[45px] px-4 rounded-sm hover:bg-[#0e0202] text-[1.7rem]"
          >
            <p>Reset Password</p>
          </button>
        </div>
      </form>
      <DialogBox isOpen={showDialogue.isOpen} message={showDialogue.message} />
    </>
  );
}

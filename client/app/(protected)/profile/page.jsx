"use client";
import {
  DynamicLazyBlurImage,
  LazyBlurImage,
} from "@/components/LazyBlurImage";
import { useAuth } from "@/contexts/AuthContext";
import { useDialog } from "@/contexts/DialogBoxContext";
import { useState } from "react";
import { useForm } from "react-hook-form";

const Profile = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [shownewPassword, setShowNewPassword] = useState(false);
  const [showconfirmPassword, setShowConfirmPassword] = useState(false);
  const {openDialog} = useDialog()
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!shownewPassword);
  };
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showconfirmPassword);
  };
  const {
    register,
    handleSubmit,
	reset,
    formState: { errors },
  } = useForm();
  const { user } = useAuth();

  const onError = (errorList) => {
	if (errorList.oldPassword) {
		openDialog(errorList.oldPassword.message)
	} else if (errorList.newPassword) {
		openDialog(errorList.newPassword.message)
	} else if (errorList.confirmPassword) {
		openDialog(errorList.confirmPassword.message)
	}
	  
  }

  const onSubmit = (data) => {
	data.email = user.email
	 if(data.oldPassword == "" && data.newPassword != ""){
		openDialog("Please provide the old password to change the password")
		reset();
	} else if (data.oldPassword != "" && data.newPassword == ""){
		openDialog("Please provide the new password to change the password")
		return 
	} else if (data.oldPassword != "" && data.newPassword != "" && data.confirmPassword == "") {
		openDialog("Please confirm the new password")
		return
	} else if (data.newPassword != data.confirmPassword ) {
		openDialog("New password and confirm password should be same")
		return
	}
	console.log("Data", data)
  };
  return (
    <div className="flex flex-col justify-center items-center gap-8 lg:w-screen-md  mx-auto">
      <div className="cursor-pointer h-full flex justify-center items-center">
        {user?.photoURL ? (
          <DynamicLazyBlurImage
            src={user.photoURL}
            alt="profile picture"
            width={35}
            height={35}
            className="p-[3rem]"
          />
        ) : (
          <LazyBlurImage
            src="user.png"
            alt="profile picture"
            width={150}
            height={150}
            className="p-[0.2rem]"
          />
        )}
      </div>
      <form
        onSubmit={handleSubmit(onSubmit, onError)}
        className="md:w-1/2 flex flex-col gap-8"
      >
        <div className="flex flex-col gap-3">
          <label className="text-[2rem] font-medium text-gray-700">Name</label>
          <input
            {...register("raisedBy", {
              required:
                "Please provide the name of the authority raising the notesheet",
            })}
            className="text-[2rem] border-gray-400 focus:border-blue-400 border-solid w-full p-2"
            defaultValue={user.name}
            type="text"
            placeholder="Authority raising the notesheet"
          />
        </div>
        <div className="flex flex-col gap-3">
          <label className="block text-[2rem] font-medium text-gray-700">
            Email
          </label>
          <input
            {...register("email", {
              pattern: {
                value:
                  /^[a-zA-Z0-9._%+-]+@(outlook\.com|hotmail\.com|live\.com|msn\.com|iitp\.ac\.in)$/,
                message: "Please provide a valid outlook email address!",
              },
            })}
            disabled
            value={user.email}
            className="text-[2rem] border-gray-400 focus:border-blue-400 border-solid w-full p-2 cursor-not-allowed"
            type="email"
            placeholder="Email"
          />
        </div>

        <div className="flex flex-col gap-3 relative">
          <label className="block text-[2rem] font-medium text-gray-700">
            Old Password
          </label>
          <div className="flex justify-between items-center gap-6 text-[2rem] border-gray-400 focus:border-blue-400 border-solid p-2">
            <input
              {...register("oldPassword", {
                minLength: {
                  value: 8,
                  message: "Password should have at least 8 characters",
                },
              })}
              className="w-full p-2"
              type={showPassword ? "text" : "password"}
              placeholder="Old Password"
            />
            <button type="button" onClick={togglePasswordVisibility}>
              {showPassword ? (
                <img className="w-9" src="/images/eye.svg" alt="" />
              ) : (
                <img className="w-9" src="/images/eyeslash.svg" alt="" />
              )}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3 relative">
          <label className="block text-[2rem] font-medium text-gray-700">
            New Password
          </label>
          <div className="flex justify-between items-center gap-6 text-[2rem] border-gray-400 focus:border-blue-400 border-solid p-2">
            <input
              {...register("newPassword", {
                minLength: {
                  value: 8,
                  message: "Password should have at least 8 characters",
                },
              })}
              className="w-full p-2"
              type={shownewPassword ? "text" : "password"}
              placeholder="New Password"
            />
            <button type="button" onClick={toggleNewPasswordVisibility}>
              {shownewPassword ? (
                <img className="w-9" src="/images/eye.svg" alt="" />
              ) : (
                <img className="w-9" src="/images/eyeslash.svg" alt="" />
              )}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3 relative">
          <label className="block text-[2rem] font-medium text-gray-700">
            Confirm New Password
          </label>
          <div className="flex justify-between items-center gap-6 text-[2rem] border-gray-400 focus:border-blue-400 border-solid p-2">
            <input
              {...register("confirmPassword", {
                minLength: {
                  value: 8,
                  message: "Password should have at least 8 characters",
                },
              })}
              className="w-full p-2"
              type={showconfirmPassword ? "text" : "password"}
              placeholder="Confirm new Password"
            />
            <button type="button" onClick={toggleConfirmPasswordVisibility}>
              {showconfirmPassword ? (
                <img className="w-9" src="/images/eye.svg" alt="" />
              ) : (
                <img className="w-9" src="/images/eyeslash.svg" alt="" />
              )}
            </button>
          </div>
        </div>

        <div className="w-full flex justify-center">
          <button
            type="submit"
            className="w-[15rem] flex items-center justify-center bg-[#2f2f2f] text-white h-[45px] px-4 rounded-sm hover:bg-[#0e0202] text-[1.7rem]"
          >
            <p>Update Profile</p>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;

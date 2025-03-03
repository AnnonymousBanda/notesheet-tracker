"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { DynamicLazyBlurImage, LazyBlurImage } from "./LazyBlurImage";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { PencilSquareIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useForm } from "react-hook-form";
import { useDialog } from "@/contexts/DialogBoxContext";
import axios from "axios";

const DropdownMenu = ({
  isOpen,
  setIsOpen,
  isSettingsOpen,
  setIsSettingsOpen,
}) => {
  const handlecloseMenu = () => {
    setIsOpen(false);
  };
  const handleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
    handlecloseMenu();
  };
  const { user, logout } = useAuth();
  const handleLogout = async () => {
    await logout();
    handlecloseMenu();
  };

  useEffect(() => {
    if (isOpen) {
      document.onkeydown = function (event) {
        if (event.key === "Escape") {
          setIsOpen(false);
        }
      };
    }
    return () => {
      document.onkeydown = null;
    };
  }, [isOpen]);

  return (
    <div
      className={`${
        isOpen ? "block" : "hidden"
      } absolute z-10 bg-white min-w-[18rem] w-fit right-[2.5rem] top-[8.5rem] p-2 rounded-md transition-transform duration-1000 shadow-xl`}
    >
      <div className="flex flex-col">
        <div className="flex gap-3 items-start hover:bg-gray-100 p-4 transition-all duration-500">
          {user?.picture ? (
            <DynamicLazyBlurImage
              src={user.picture}
              alt="profile picture"
              width={25}
              height={25}
              className="p-[3rem]"
            />
          ) : (
            <LazyBlurImage
              src="user.png"
              alt="profile picture"
              width={30}
              height={30}
              className="p-[0.2rem]"
            />
          )}
          <div className="flex flex-col gap-[1rem]">
            <p className="text-[1.5rem] text-gray-500 font-bold">
              {user?.name}
            </p>
            <p className="text-[1.5rem] text-gray-500 font-bold">
              {user?.email}
            </p>
          </div>
        </div>

        <Link
          onClick={handlecloseMenu}
          href="/"
          className="flex items-center gap-3 hover:bg-gray-100 p-4 transition-all duration-500"
        >
          <Image
            width={32}
            height={32}
            src="/images/dashboard.svg"
            alt="Home icon"
            className="w-8"
          />
          <p className="text-[1.5rem] text-gray-500 font-bold">HOME</p>
        </Link>
        <div
          onClick={handleSettings}
          className="flex cursor-pointer items-center gap-3 hover:bg-gray-100 p-4 transition-all duration-500"
        >
          <Image
            width={32}
            height={32}
            src="/images/settings.svg"
            alt="Settings gear icon"
            className="w-8"
          />
          <p className="text-[1.5rem] text-gray-500 font-bold">SETTINGS</p>
        </div>

        <button
          onClick={handleLogout}
          className="flex gap-3 items-center hover:bg-red-300  p-4 transition-all duration-500"
        >
          <Image
            width={32}
            height={32}
            src="/images/logout.svg"
            alt="Logout icon"
            className="w-8"
          />
          <p className="text-[1.5rem] text-gray-500 font-bold">LOGOUT</p>
        </button>
      </div>
    </div>
  );
};

const SettingsDialog = ({ isOpen, setIsOpen }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [shownewPassword, setShowNewPassword] = useState(false);
  const [showconfirmPassword, setShowConfirmPassword] = useState(false);
  const [edit, setedit] = useState(false);

  const handleClose = () => {
    setIsOpen(!isOpen);
  };

  const { user, logout } = useAuth();
  const { openDialog } = useDialog();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset : resetPassword,
    formState: { errors : errorsPassword },
  } = useForm();

  const onProfileError = (errorList) => {
    console.log("ErrorList", errorList);
  };
  const onProfileSubmit = async (data) => {
    if (!data.name) {
      openDialog("Please provide the new name to update");
      return;
    }

    setedit(false);

    try {
      const response = await axios.patch(
        "http://localhost:8000/auth/update-profile",
        {
          name: data.name,
        },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        }
      );

      openDialog(response.data.message);
    } catch (error) {
      openDialog(error?.message);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!shownewPassword);
  };
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showconfirmPassword);
  };

  const onPasswordSubmit = async (data) => {
    if (!data.oldPassword) {
      openDialog("Please provide the old password to change the password");
      return;
    } else if (!data.newPassword) {
      openDialog("Please provide the new password to change the password");
      return;
    } else if (!data.confirmPassword) {
      openDialog("Please re-enter the new password");
      return;
    } else if (data.newPassword !== data.confirmPassword) {
      openDialog("New password and confirm password should be same");
      return;
    }

    try {
      const response = await axios.patch(
        "http://localhost:8000/auth/change-password",
        {
          oldPassword: data.oldPassword,
          password: data.newPassword,
          confirmPassword: data.confirmPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        }
      );

      openDialog(response.data.message);
      setTimeout(() => {
        logout();
      }, 1000);
    } catch (error) {
      openDialog(error.response.data.message);
    }
  };

  const onPasswordError = (errorList) => {
    if (errorList.oldPassword) {
      openDialog(errorList.oldPassword.message);
    } else if (errorList.newPassword) {
      openDialog(errorList.newPassword.message);
    } else if (errorList.confirmPassword) {
      openDialog(errorList.confirmPassword.message);
    }
  };

  return (
    <div
      className={`absolute z-10 inset-0 bg-black backdrop-blur-[7px] bg-opacity-30 flex items-center justify-center ${
        isOpen ? "" : "hidden"
      }`}
    >
      <div className="bg-[#E5E7EB] p-6 rounded-lg shadow-lg h-auto md:max-w-5xl w-full flex flex-col gap-[2rem] overflow-y-auto max-h-screen max-w-[98vw]">
        <div className="w-full flex justify-between items-center">
          <p className="uppercase text-[2rem] text-gray-500 font-bold flex gap-[1rem]">
            <Image
              src="/images/settings.svg"
              alt="Settings gear icon"
              width={30}
              height={30}
            />
            <span>settings</span>
          </p>
          <button onClick={handleClose}>
            <XMarkIcon
              className="stroke-gray-500 fill-gray-500"
              width={30}
              height={30}
            />
          </button>
        </div>

        <div className="w-full flex md:flex-row flex-col gap-[5rem] justify-center items-center py-[3rem] rounded-lg">
          <div className="cursor-pointer h-full flex justify-center items-center">
            {user?.picture ? (
              <DynamicLazyBlurImage
                src={user?.picture}
                alt="profile picture"
                width={150}
                height={150}
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
            onSubmit={handleSubmit(onProfileSubmit, onProfileError)}
            className="md:w-1/2 w-3/4 flex flex-col gap-[1rem]"
          >
            <div className="flex flex-col gap-3 relative">
              <label className="text-[2rem] font-medium text-gray-700">
                Name
              </label>
              <div className="flex gap-2 w-full">
                <input
                  {...register("name", {
                    required: "Please provide the new name to update",
                  })}
                  className={`text-[2rem] w-full rounded-lg px-[1.5rem] py-[0.5rem] bg-white ${
                    edit ? "" : "cursor-not-allowed opacity-50"
                  }`}
                  defaultValue={user?.name}
                  disabled={!edit}
                  type="text"
                  placeholder="Name"
                />
              </div>
              <div className="flex justify-between items-center">
                <div
                  onClick={() => setedit(!edit)}
                  className={`flex  bg-[#2f2f2f] p-2 rounded-lg px-3  items-center justify-center ${
                    edit
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer hover:bg-[#0e0202]"
                  }`}
                >
                  <PencilSquareIcon
                    className="fill-white"
                    width={15}
                    height={15}
                  />
                  <span className="text-[1.5rem] text-white uppercase font-semibold">
                    Edit
                  </span>
                </div>
                <button
                  type="submit"
                  className={`${
                    edit ? "" : "hidden"
                  } bg-[#2f2f2f] p-2 rounded-lg px-3 hover:bg-[#0e0202] transition-opacity duration-300`}
                >
                  <span className="text-[1.5rem] text-white uppercase font-semibold">
                    Save
                  </span>
                </button>
              </div>
            </div>
            <div className="w-full flex justify-center"></div>
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
                value={user?.email}
                className="text-[2rem] w-full rounded-lg px-[1.5rem] py-[0.5rem] bg-white cursor-not-allowed opacity-50"
                type="email"
                placeholder="Email"
              />
            </div>
          </form>
        </div>
        {user?.admin ? (
          <div className="flex flex-col items-center gap-[2rem] px-[1rem] w-full">
            <p className="text-[2rem] w-full uppercase font-bold text-[#2f2f2f]">
              Change Password
            </p>
            <form
              onSubmit={handleSubmitPassword(onPasswordSubmit, onPasswordError)}
              className="md:w-full w-5/6 flex flex-col justify-center gap-[1rem] relative"
            >
              <div className="flex md:justify-between md:flex-row flex-col gap-3 relative">
                <label className="block text-[2rem] font-medium text-gray-700 px-[1.5rem]">
                  Old Password
                </label>
                <div className="flex justify-between items-center gap-6 text-[2rem] bg-gray-300 rounded-lg pr-[1rem]">
                  <input
                    {...registerPassword("oldPassword", {
                      minLength: {
                        value: 8,
                        message: "Password should have at least 8 characters",
                      },
                    })}
                    className="w-full p-2 rounded-l-lg px-[1.5rem] py-[0.5rem]"
                    type={showPassword ? "text" : "password"}
                    placeholder="Old Password"
                  />
                  <button type="button" onClick={togglePasswordVisibility}>
                    {showPassword ? (
                      <Image
                        width={36}
                        height={36}
                        className="w-9"
                        src="/images/eye.svg"
                        alt="show password"
                      />
                    ) : (
                      <Image
                        width={36}
                        height={36}
                        className="w-9"
                        src="/images/eyeslash.svg"
                        alt="show password"
                      />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex md:justify-between md:flex-row flex-col gap-3 relative">
                <label className="block text-[2rem] font-medium text-gray-700 px-[1.5rem]">
                  New Password
                </label>
                <div className="flex justify-between items-center gap-6 text-[2rem] bg-gray-300 rounded-lg pr-[1rem]">
                  <input
                    {...registerPassword("newPassword", {
                      minLength: {
                        value: 8,
                        message: "Password should have at least 8 characters",
                      },
                    })}
                    className="w-full rounded-l-lg px-[1.5rem] py-[0.5rem]"
                    type={shownewPassword ? "text" : "password"}
                    placeholder="New Password"
                  />
                  <button type="button" onClick={toggleNewPasswordVisibility}>
                    {shownewPassword ? (
                      <Image
                        width={36}
                        height={36}
                        className="w-9"
                        src="/images/eye.svg"
                        alt="show password"
                      />
                    ) : (
                      <Image
                        width={36}
                        height={36}
                        className="w-9"
                        src="/images/eyeslash.svg"
                        alt="show password"
                      />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex md:justify-between md:flex-row flex-col gap-3 relative">
                <label className="block text-[2rem] font-medium text-gray-700 px-[1.5rem]">
                  Confirm New Password
                </label>
                <div className="flex justify-between items-center gap-6 text-[2rem] bg-gray-300 rounded-lg pr-[1rem]">
                  <input
                    {...registerPassword("confirmPassword", {
                      minLength: {
                        value: 8,
                        message: "Password should have at least 8 characters",
                      },
                    })}
                    className="w-full rounded-l-lg px-[1.5rem] py-[0.5rem]"
                    type={showconfirmPassword ? "text" : "password"}
                    placeholder="Confirm new Password"
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                  >
                    {showconfirmPassword ? (
                      <Image
                        width={36}
                        height={36}
                        className="w-9"
                        src="/images/eye.svg"
                        alt="show password"
                      />
                    ) : (
                      <Image
                        width={36}
                        height={36}
                        className="w-9"
                        src="/images/eyeslash.svg"
                        alt="show password"
                      />
                    )}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                className="bg-[#2f2f2f] w-fit self-end mt-[1.5rem] p-2 rounded-lg px-4 hover:bg-[#0e0202] transition-opacity duration-300"
              >
                <span className="text-[1.5rem] text-white uppercase font-semibold">
                  Change password
                </span>
              </button>
            </form>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default function Navbar() {
  const pathname = usePathname();
  const pathSegments = pathname.split("/");
  const route =
    pathSegments.length > 2 ? pathSegments[1] : pathSegments[1] || "";

  const [isOpen, setIsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);
  const { user } = useAuth();

  return (
    <>
      <div className="w-full bg-gray-200 min-h-[7rem] h-[8rem] px-8 py-4 flex justify-between items-center rounded-lg">
        <h4 className="text-gray-500 font-bold uppercase">
          {route.toUpperCase() == "" ? "DASHBOARD" : route}
        </h4>
        <div
          onClick={toggleMenu}
          className="cursor-pointer h-full flex justify-center items-center"
        >
          {user?.picture ? (
            <DynamicLazyBlurImage
              src={user.picture}
              alt="profile picture"
              width={35}
              height={35}
              className="p-[3rem]"
            />
          ) : (
            <LazyBlurImage
              src="user.png"
              alt="profile picture"
              width={40}
              height={40}
              className="p-[0.2rem]"
            />
          )}
        </div>
        <DropdownMenu
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          setIsSettingsOpen={setIsSettingsOpen}
          isSettingsOpen={isSettingsOpen}
        />
      </div>
      {<SettingsDialog isOpen={isSettingsOpen} setIsOpen={setIsSettingsOpen} />}
    </>
  );
}

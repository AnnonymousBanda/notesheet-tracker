"use client";

import gsap from "gsap";
import { useRouter } from "next/navigation";
import React from "react";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

import LazyBlurImage from "@/components/LazyBlurImage";

function SidebarButton({ text, image, alt, route, onClick }) {
  const router = useRouter();
  return (
    <button
      onClick={() => {
        router.push(route);
		onClick()
      }}
      className="flex items-center justify-start gap-4 rounded-lg transition-all duration-500 cursor-pointer hover:bg-blue-200 p-6 lg:py-6 lg:px-4 xl:p-8"
    >
      <img
        src={`/images/${image}`}
        className="w-[2.5rem] h-[2.5rem]"
        alt={alt}
      />
      <h4 className="xl:text-[2.5rem]">{text}</h4>
    </button>
  );
}

export default function Sidebar({ isSidebarOpen, setisSidebarOpen }) {
  const onClick = () => {
    setisSidebarOpen(!isSidebarOpen);
  };
  const tl = gsap.timeline();
  useEffect(() => {
    if (isSidebarOpen) {
      tl.to(".bgblur", {
        opacity: 1,
        duration: 0.5,
      });
      tl.to(".sidebar", {
        left: "2%",
        duration: 0.5,
      });
    } else {
      tl.to(".sidebar", {
        left: "-100%",
        duration: 0.5,
      });
      tl.to(".bgblur", {
        opacity: 0,
        duration: 0.5,
      });
    }
  }, [isSidebarOpen]);
  const { logout } = useAuth();

  return (
    <>
      <div className="sidebar lg:z-0 z-10 lg:left-0 left-[-100%] lg:static absolute lg:w-4/12 md:w-1/2 w-[95vw]  p-4 h-full lg:px-8 bg-gray-200 rounded-lg flex flex-col justify-start pt-32 gap-36">
        <div className="w-full flex justify-center">
          <LazyBlurImage
            src="iitplogo.png"
            alt="IITP logo"
            width={130}
            height={130}
            className="rounded-full"
			onClick={onClick}
          />
        </div>
        <div className="lg:px-0 px-8 w-full h-[40vh] text-center flex flex-col justify-evenly gap-[1.5rem] container mx-auto">
          <SidebarButton
            text="Dashboard"
            image="dashboard.svg"
            alt="Dashboard icon"
            route="/"
			onClick={onClick}			
          />
          <SidebarButton
            text="Notesheets"
            image="notesheet.svg"
            alt="Notesheet icon"
            route="/my-notesheets"
			onClick={onClick}
          />
          <SidebarButton
            text="New Notesheet"
            image="newnotesheet.svg"
            alt="New notesheet icon"
            route="/new-notesheet"
			onClick={onClick}
          />
          <SidebarButton
            text="Profile"
            image="user.svg"
            alt="Profile icon"
            route="/profile"
			onClick={onClick}
          />
          <button>
            <div
              onClick={() => {
                logout();
				onClick()
              }}
              className="flex items-center justify-start gap-4 rounded-lg transition-all duration-500 cursor-pointer hover:bg-green-300 p-6 lg:py-6 lg:px-4 xl:p-8"
            >
              <img
                src="/images/logout.svg"
                className="w-[2.5rem] h-[2.5rem]"
                alt="Logout icon"
              />
              <h4 className="xl:text-[2.5rem]">Logout</h4>
            </div>
          </button>
        </div>
      </div>
      <div className="bgblur opacity-0 fixed top-0 left-0 backdrop-blur-sm lg:hidden block h-screen w-screen bg-[#1e1e1eae]"></div>
    </>
  );
}

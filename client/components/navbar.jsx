"use client";
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { DynamicLazyBlurImage, LazyBlurImage } from "./LazyBlurImage";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);
  const { user } = useAuth();

  return (
    <div className="w-full bg-gray-200 h-[8vh] px-8 py-4 flex justify-between items-center rounded-lg">
      <h4>DASHBOARD</h4>
      <div
        onClick={toggleMenu}
        className="cursor-pointer h-full flex justify-center items-center"
      >
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
            width={40}
            height={40}
            className="p-[0.2rem]"
          />
        )}
      </div>
    </div>
  );
}

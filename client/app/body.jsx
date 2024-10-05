"use client"
import React from 'react'
import Sidebar from "@/components/sidebar";
import Navbar from "@/components/navbar";
import { useState } from 'react';

export default function Body({children}) {
    const [issidebarOpen, setisSidebarOpen] = useState(false)
  return (
    <body>
        <div className="flex">
            <Sidebar isSidebarOpen={issidebarOpen} />
          <div className="w-full flex flex-col">
            <Navbar isSidebarOpen={issidebarOpen} setisSidebarOpen={setisSidebarOpen} />
            {children}
          </div>
        </div>        
    </body>
  )
}

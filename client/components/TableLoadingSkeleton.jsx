import React from "react";

function TableSkeleton({params}) {
  return (
    <div
      className="flex rounded-b-xl justify-around  transition-colors duration-300"
    >
      <p className="w-1/12 p-3 rounded-xl animate-skeleton bg-gradient-to-r h-[3rem]"></p>
      <p className="w-5/12 p-3 rounded-xl animate-skeleton bg-gradient-to-r h-[3rem]"></p>
      <p className="w-2/12 p-3 rounded-xl text-center animate-skeleton bg-gradient-to-r h-[3rem]"></p>
      <p className="w-1/12 p-3 rounded-xl animate-skeleton bg-gradient-to-r h-[3rem]"></p>
      {params.get("type") === "to-approve" ||
      params.get("type") === "approved" ? (
        <p className="w-2/12 p-3 rounded-xl text-center animate-skeleton bg-gradient-to-r h-[3rem]"></p>
      ) : null}
      <p className="w-[8rem] p-3 rounded-xl flex justify-center animate-skeleton bg-gradient-to-r h-[3rem]"></p>
      <p className="w-[14rem] p-3 rounded-xl flex justify-center gap-[2rem] animate-skeleton bg-gradient-to-r h-[3rem]"></p>
    </div>
  );
}

export default function TableLoadingSkeleton({ params }) {
  return (
    <div className="bg-white rounded-xl w-full flex flex-col gap-12 pb-[1rem]">
      <div className="flex justify-around rounded-t-xl  bg-gray-300 font-semibold h-[4rem] py-2">
        <p className="w-1/12 p-3 rounded-lg h-full animate-skeleton bg-gradient-to-r"></p>
        <p className="w-5/12 p-3 rounded-lg h-full animate-skeleton bg-gradient-to-r"></p>
        <p className="w-2/12 p-3 rounded-lg h-full text-center animate-skeleton bg-gradient-to-r"></p>
        <p className="w-1/12 p-3 rounded-lg h-full animate-skeleton bg-gradient-to-r"></p>
        {params.get("type") === "to-approve" ||
        params.get("type") === "approved" ? (
          <p className="w-2/12 p-3 rounded-lg h-full text-center animate-skeleton bg-gradient-to-r"></p>
        ) : null}
        <p className="w-[8rem] p-3 rounded-lg h-full text-center animate-skeleton bg-gradient-to-r"></p>
        <p className="w-[14rem] p-3 rounded-lg h-full text-center animate-skeleton bg-gradient-to-r"></p>
      </div>
      <TableSkeleton params = {params}/>
      <TableSkeleton params = {params}/>
      <TableSkeleton params = {params}/>
      <TableSkeleton params = {params}/>
      <TableSkeleton params = {params}/>
      <TableSkeleton params = {params}/>
      <TableSkeleton params = {params}/>
      <TableSkeleton params = {params}/>
      <TableSkeleton params = {params}/>
      <TableSkeleton params = {params}/>
    </div>
  );
}

import React from "react";
import { LazyBlurImage } from "./LazyBlurImage";
import eye from "@/public/images/eye.svg";
import download from "@/public/images/download.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Notesheetsbyme({ notesheets }) {
  const router = useRouter();
  return (
    <div className="flex flex-col gap-3">
      {notesheets.map((notesheet, index) => (
        <div
          onClick={() => {
            window.open(`/notesheet/${notesheet?._id}`, "_blank");
          }}
          key={notesheet?.id}
          className={`flex ${index === notesheets.length-1 ? "rounded-b-xl" : ""} justify-around text-gray-700 font-semibold cursor-pointer hover:bg-blue-200 transition-colors duration-300`}
        >
          <p className="w-1/12 p-3 rounded-xl">{index + 1}</p>
          <p className="w-4/12 p-3 rounded-xl">{notesheet?.subject}</p>
          <p className="w-1/12 p-3 rounded-xl">
            {new Date(notesheet?.raisedAt).getDate()}-
            {new Date(notesheet?.raisedAt).getMonth()}-
            {new Date(notesheet?.raisedAt).getFullYear()}
          </p>
          <p className="w-2/12 p-3 rounded-xl">₹{notesheet?.amount}</p>
          <p className="w-[6rem] p-3 rounded-xl flex justify-center">
            <LazyBlurImage
              src={`icons/${notesheet?.status?.state}.png`}
              width={25}
              height={25}
              rounded={false}
              bgColor={false}
            />
          </p>
          <p className="w-[14rem] p-3 rounded-xl flex justify-center gap-[2rem]">
            <a
              onClick={(e) => e.stopPropagation()}
              href={notesheet?.pdf}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image src={eye} alt="eye icon" width={25} height={25} />
            </a>
            <a
              onClick={(e) => e.stopPropagation()}
              href={notesheet?.pdf}
              download
            >
              <Image
                src={download}
                alt="download icon"
                width={25}
                height={25}
              />
            </a>
          </p>
        </div>
      ))}
    </div>
  );
}

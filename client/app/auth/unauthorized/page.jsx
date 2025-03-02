import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <div className="flex items-center justify-center">
        <ExclamationTriangleIcon width={50} height={50} className="relative top-[5px]"/>
        <h1 className="font-bold flex items-center">401</h1>
      </div>
      <p className="text-[2.5rem] mt-4">Unauthorized Access</p>
      <p className="text-[2rem] mt-2">
        Sorry, you don't have permission to view this page.
      </p>
      <Link href="/auth/login" className="mt-4 text-blue-500 hover:underline">
        <p className="text-[2rem]">Try again</p>
      </Link>
    </div>
  );
};

export default Unauthorized;

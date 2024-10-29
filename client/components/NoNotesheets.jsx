import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';

export default function NoNotesheets() {
  return (
    <div className="flex flex-col justify-center items-center min-h-[20rem] h-full w-full mx-auto rounded-xl bg-gray-100 shadow-xl p-8">
      <ExclamationTriangleIcon className="w-16 h-16 text-gray-500 mb-4" />
      <p className="text-[2.5rem] text-gray-700 font-bold mb-2">No Notesheets to Display!</p>
      <p className="text-[1.8rem] text-gray-500 text-center">
        You currently have no notesheets available. Once notesheets are added, they'll appear here.
      </p>
    </div>
  );
}

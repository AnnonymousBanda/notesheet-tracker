import React from 'react';

const Loader = ({childcomp}) => {
  return (
    <div className={`flex items-center justify-center ${childcomp ? "h-full" : "h-screen"}`}>
      <div className="flex space-x-3">
        <div className="w-4 h-4 bg-gray-600 rounded-full animate-[bounce_1.5s_infinite_200ms]"></div>
        <div className="w-4 h-4 bg-gray-600 rounded-full animate-[bounce_1.5s_infinite_500ms]"></div>
        <div className="w-4 h-4 bg-gray-600 rounded-full animate-[bounce_1.5s_infinite_800ms]"></div>
      </div>
    </div>
  );
};

export default Loader;

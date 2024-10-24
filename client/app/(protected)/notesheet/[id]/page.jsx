import React from 'react'

export default function NoteSheet() {
    const getNotesheet = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/notesheet/raised/user/me', {
                method: 'GET',
                headers: { token: localStorage.token }
            })
        }
        catch (error) {
            console.error(error.message)
        }
    }
    const notesheet = getNotesheet()
  return (
    <div className='w-screen-md mx-auto pt-3 flex flex-col gap-4'>
        <p className='text-gray-500 font-bold text-[3rem] mb-12'>Notesheet Details</p>
        <div className='flex flex-col gap-4 bg-gray-100 p-6 rounded-xl'>        
            <p className='text-gray-500 font-bold text-[2rem]'>Subject : </p>
            <p className='text-gray-500 font-bold text-[2rem]'>Raised By : </p>
            <p className='text-gray-500 font-bold text-[2rem]'>Amount raised : </p>
            <p className='text-gray-500 font-bold text-[2rem]'>Current Approval : </p>
            <p className='text-gray-500 font-bold text-[2rem]'>Pending Approvals : </p>
            <p className='text-gray-500 font-bold text-[2rem]'>Past Approvals : </p>
        </div>
    </div>
  )
}

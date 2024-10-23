"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useDialog } from "@/contexts/DialogBoxContext";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

const NewNotesheetForm = () => {
  const { register, handleSubmit, setValue, reset } = useForm();
  const { user } = useAuth();
  const date = new Date().toISOString().split("T")[0];
  const { openDialog, onClose } = useDialog();
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfFileUrl, setPdfFileUrl] = useState(null);
  const router = useRouter();

  const onSubmit = (data) => {
    data.approvals.push("adean");
    console.log("Form Data:", data);
    reset();
    setPdfFile(null);
    setPdfFileUrl(null);
    openDialog("Notesheet submitted successfully");
    setTimeout(() => {
      router.push("/");
      onClose();
    }, 1500);
  };

  const onError = (errorList) => {
    if (errorList.pdfFile) {
      openDialog("Please upload a pdf file");
    } else if (errorList.subject) {
      openDialog(errorList.subject.message);
    } else if (errorList.date) {
      openDialog(errorList.date.message);
    } else if (errorList.raisedBy) {
      openDialog(errorList.raisedBy.message);
    } else if (errorList.Amount) {
      openDialog(errorList.Amount.message);
    } else if (errorList.approvals) {
      openDialog(errorList.approvals.message);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file.type !== "application/pdf") {
      openDialog("Please upload a pdf file");
    } else {
      setPdfFile(file);
      setValue("pdfFile", file);
      setPdfFileUrl(URL.createObjectURL(file));
    }
  };
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file.type !== "application/pdf") {
      openDialog("Please upload a pdf file");
    } else {
      setPdfFile(file);
      setValue("pdfFile", file);
      setPdfFileUrl(URL.createObjectURL(file));
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onError)}
      className="flex items-center justify-start gap-10 w-full p-4 h-full"
    >
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="overflow-hidden h-full flex flex-col items-center justify-center text-center w-1/3 hover:bg-gray-100 border-gray-400 hover:border-black border-dashed border-[4px] rounded-lg gap-8 transition-all duration-500 flex-wrap px-4"
      >
        <h4 className="px-4 lg:text-[2rem] text-[1.5rem] break-words whitespace-normal text-center overflow-hidden text-ellipsis">
          {pdfFile ? (
            <a className="text-blue-400 text-wrap" target="#" href={pdfFileUrl}>
              {pdfFile.name}
            </a>
          ) : (
            "Please drag and drop or upload a pdf"
          )}
        </h4>
        {pdfFile ? (
          <button
            onClick={() => {
              setPdfFile(null);
              setPdfFileUrl(null);
            }}
            className="w-[12rem] flex items-center justify-center bg-[#2f2f2f] text-white h-[40px] px-4 rounded-sm hover:bg-[#0e0202] text-[1.5rem]"
          >
            <h4>Reset PDF</h4>
          </button>
        ) : (
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileUpload}
            className="xl:text-[2rem] lg:text-[1.5rem] text-[1.2rem]"
            required
          />
        )}
      </div>
      <div className="flex flex-col justify-start h-full w-2/3 gap-10 overflow-auto">
        <h3 className="text-gray-700 font-semibold">Notesheet Details</h3>
        <div className="w-full flex flex-col gap-4">
          <div className="flex flex-col gap-3 w-2/3">
            <label className="text-[2rem] font-medium text-gray-700">
              Subject
            </label>
            <input
              {...register("subject", {
                required: "Please provide a subject for your notesheet",
              })}
              className="text-[2rem] border-gray-400 focus:border-blue-400 border-solid w-full p-2"
              type="text"
              placeholder="Subject"
            />
          </div>

          <div className="flex flex-col gap-3 w-fit">
            <label className="block text-[2rem] font-medium text-gray-700">
              Date
            </label>
            <input
              {...register("date")}
              className="text-[2rem] border-gray-400 focus:border-blue-400 border-solid p-2 cursor-not-allowed"
              type="date"
              value={date}
              placeholder="dd/mm/yyyy"
              readOnly
            />
          </div>

          <div className="flex flex-col gap-3 w-fit">
            <label className="text-[2rem] font-medium text-gray-700">
              Raised By
            </label>
            <input
              {...register("raisedBy", {
                required:
                  "Please provide the name of the authority raising the notesheet",
              })}
              className="text-[2rem] border-gray-400 focus:border-blue-400 border-solid w-full p-2"
              defaultValue={user.admin}
              type="text"
              placeholder="Authority raising the notesheet"
            />
          </div>

          <div className="flex flex-col gap-3 w-1/2">
            <label className="text-[2rem] font-medium text-gray-700">
              Amount
            </label>
            <input
              {...register("Amount", {
                required:
                  "Please provide the name of the authority raising the notesheet",
              })}
              className="text-[2rem] border-gray-400 focus:border-blue-400 border-solid w-full p-2"
              type="number"
              placeholder="Enter Amount"
            />
          </div>

          <div className="flex flex-col gap-4 w-2/3">
            <label className="text-[2rem] font-medium text-gray-700">
              Approvals needed
            </label>
            <div className="flex flex-wrap gap-10">
              {["GenSec", "PIC", "VP Gymkhana", "ARSA", "DrSA"].map(
                (approval) => (
                  <label
                    key={approval}
                    className="flex items-center cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      {...register("approvals", {
                        required: "Please select at least one approval",
                      })}
                      value={approval.toLowerCase()}
                      className="mr-2 w-7 h-7 border-black border-solid bg-transparent text-[2rem] cursor-pointer"
                    />
                    <p className="text-[2rem]">{approval}</p>
                  </label>
                )
              )}

              <label key="adean" className="flex items-center">
                <input
                  type="checkbox"
                  value="adean"
                  checked={true}
                  disabled
                  className="mr-2 w-7 h-7 border-black border-solid bg-transparent text-[2rem] cursor-not-allowed"
                />
                <p className="text-[2rem]">Adean</p>
              </label>
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="mb-3 w-[15rem] flex items-center justify-center bg-[#2f2f2f] text-white min-h-[45px] px-4 rounded-sm hover:bg-[#0e0202] text-[1.7rem]"
        >
          <h4>Submit</h4>
        </button>
      </div>
    </form>
  );
};

const NewNotesheets = () => {
  return (
    <div className="flex h-full">
      <NewNotesheetForm />
    </div>
  );
};

export default NewNotesheets;

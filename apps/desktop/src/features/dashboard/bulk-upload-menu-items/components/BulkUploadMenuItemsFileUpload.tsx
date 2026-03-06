import { useState, ChangeEvent, DragEvent } from "react";
import { Card, CardBody, Chip, Button } from "@heroui/react";
import {
  HiOutlineCloudUpload,
  HiOutlineDocumentText,
  HiOutlineX,
} from "react-icons/hi";

const BulkUploadMenuItemsFileUpload = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const removeFile = () => setFile(null);

  return (
    <Card
      className={`border-2 border-dashed transition-all shadow-none ${
        isDragging
          ? "border-blue-500 bg-blue-50/50"
          : "border-slate-200 bg-white"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <CardBody className="py-12 flex flex-col items-center justify-center gap-6">
        {/* VIEW 1: FILE PREVIEW (Shown after upload/drop) */}
        {file ? (
          <div className="flex flex-col items-center gap-4 w-full max-w-sm">
            <div className="flex items-center justify-between w-full p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3">
                <HiOutlineDocumentText className="text-primary text-3xl" />
                <div className="flex flex-col">
                  <span className="text-slate-900 font-semibold truncate max-w-45">
                    {file.name}
                  </span>
                  <span className="text-slate-500 text-xs">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
              </div>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                color="danger"
                onClick={removeFile}
              >
                <HiOutlineX />
              </Button>
            </div>
            <p className="text-sm text-slate-400">Ready to upload</p>
          </div>
        ) : (
          /* VIEW 2: INITIAL UPLOAD BOX (The current UI) */
          <>
            <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
              <HiOutlineCloudUpload className="text-4xl" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-primary font-bold text-xl">
                Select file to upload
              </h3>
              <div className="text-slate-500 text-lg max-w-125">
                Drag and drop your menu catalog here, or{" "}
                <label
                  htmlFor="file-input"
                  className="text-primary font-bold underline cursor-pointer hover:text-primary/70 transition-colors"
                >
                  browse files
                </label>{" "}
                on your computer.
                <input
                  type="file"
                  id="file-input"
                  className="hidden"
                  accept=".csv, .xlsx"
                  onChange={handleFileInput}
                />
              </div>
            </div>

            <div className="flex gap-3">
              {["CSV", "XLSX", "MAX 10MB"].map((tag) => (
                <Chip
                  key={tag}
                  variant="flat"
                  radius="sm"
                  className="bg-slate-100 text-slate-500 font-bold px-3 py-1 text-[12px]"
                >
                  {tag}
                </Chip>
              ))}
            </div>
          </>
        )}
      </CardBody>
    </Card>
  );
};

export default BulkUploadMenuItemsFileUpload;

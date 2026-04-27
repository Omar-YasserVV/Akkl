import { Pagination } from "@heroui/react";

interface PaginationButtonsProps {
  page: number;
  total: number;
  onChange: (page: number) => void;
}

const PaginationButtons = ({ page, total, onChange }: PaginationButtonsProps) => {
  return (
    <div className="flex justify-center w-full py-4">
      <Pagination
        disableCursorAnimation
        showControls
        className="gap-2 cursor-pointer"
        classNames={{
          next: "!text-black bg-default-200 hover:bg-default-300 ",
          prev: "!text-black",
        }}
        total={total}
        page={page}
        onChange={onChange}
        variant="light"
      />
    </div>
  );
};

export default PaginationButtons;

import BulkUploadMenuItemsFileUpload from "./components/BulkUploadMenuItemsFileUpload";
import BulkUploadMenuItemsHeader from "./components/BulkUploadMenuItemsHeader";
import BulkUploadMenuItemsHelp from "./components/BulkUploadMenuItemsHelp";
import BulkUploadMenuItemsProTip from "./components/BulkUploadMenuItemsProTip";
import BulkUploadMenuItemsRecentUploads from "./components/BulkUploadMenuItemsRecentUploads";
import BulkUploadMenuItemsRequirment from "./components/BulkUploadMenuItemsRequirment";
import BulkUploadMenuItemsTemp from "./components/BulkUploadMenuItemsTemp";

function BulkUploadMenuItems() {
  return (
    <div className="">
      <BulkUploadMenuItemsHeader />

      {/* Main Grid Container */}
      <div className="mt-4.5 grid grid-cols-12 gap-8">
        <div className="md:col-span-8 flex flex-col gap-8">
          <BulkUploadMenuItemsTemp />
          <BulkUploadMenuItemsFileUpload />
          <BulkUploadMenuItemsRecentUploads />
        </div>

        <div className="md:col-span-4 flex flex-col gap-5">
          <BulkUploadMenuItemsRequirment />
          <BulkUploadMenuItemsHelp />
          <BulkUploadMenuItemsProTip />
        </div>
      </div>
    </div>
  );
}

export default BulkUploadMenuItems;

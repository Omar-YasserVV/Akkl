function BulkUploadMenuItemsHeader() {
  return (
    <header className="flex flex-col rounded-lg">
      <div>
        <div className="space-y-2.5">
          <h2 className="font-cherry text-primary text-5xl">
            Bulk Upload Menu Items
          </h2>
          <p className="text-muted-foreground">
            Quickly populate your menu by uploading catalog files.{" "}
          </p>
        </div>
      </div>
    </header>
  );
}

export default BulkUploadMenuItemsHeader;

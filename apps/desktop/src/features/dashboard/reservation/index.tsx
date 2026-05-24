import { useState } from "react";
import DefineAreasView from "./components/DefineAreasView";
import AreaTablesView from "./components/AreaTablesView";

const Reservation = () => {
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null);

  if (selectedAreaId) {
    return (
      <AreaTablesView
        areaId={selectedAreaId}
        onBack={() => setSelectedAreaId(null)}
      />
    );
  }

  return <DefineAreasView onSelectArea={setSelectedAreaId} />;
};

export default Reservation;
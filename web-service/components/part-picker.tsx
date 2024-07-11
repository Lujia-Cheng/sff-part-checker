import { Autocomplete, AutocompleteItem } from "@nextui-org/react";

import caseData from "../app/db/data/json/case.json";
import cpuCoolerData from "../app/db/data/json/cpu-cooler.json";
import videoCardData from "../app/db/data/json/video-card.json";
import motherboardData from "../app/db/data/json/motherboard.json";
import powerSupplyData from "../app/db/data/json/power-supply.json";

export default function PartPicker({ parts, setParts }) {
  const handleSelectPart = (type, value) => {
    setParts((prevParts) => ({
      ...prevParts,
      [type]: value,
    }));
  };

  const renderAutocomplete = (label, data, type) => (
    <Autocomplete
      fullWidth
      placeholder={`Select a ${label}`}
      value={parts[type]}
      onChange={(value) => handleSelectPart(type, value)}
    >
      {data.map((item) => (
        <AutocompleteItem key={item.id} value={item} label={item.name} />
      ))}
    </Autocomplete>
  );

  return (
    <>
      {renderAutocomplete("Case", caseData, "case")}
      {renderAutocomplete("CPU Cooler", cpuCoolerData, "cooler")}
      {renderAutocomplete("GPU", videoCardData, "gpu")}
      {renderAutocomplete("Motherboard", motherboardData, "motherboard")}
      {renderAutocomplete("PSU", powerSupplyData, "psu")}

      <div>
        {Object.entries(parts).map(([type, part]) =>
          part ? (
            <div key={type}>
              <h3>{type.toUpperCase()}</h3>
              <p>{part.name}</p>
            </div>
          ) : null
        )}
      </div>
    </>
  );
}

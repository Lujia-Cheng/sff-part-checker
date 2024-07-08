import { Autocomplete, AutocompleteItem } from "@nextui-org/react";

import caseData from "../db/data/json/case.json";
import cpuCoolerData from "../db/data/json/cpu-cooler.json";
import videoCardData from "../db/data/json/video-card.json";
import motherboardData from "../db/data/json/motherboard.json";
import powerSupplyData from "../db/data/json/power-supply.json";

export default function PartPicker(parts, setParts) {
  return (
    <>
      <Autocomplete
        label="Case"
        placeholder="Search an case"
        className="max-w-xs"
      >
        {caseData.map(
          (
            item // fixme dynamic load to speed up ui pop up
          ) => (
            <AutocompleteItem key={item.name}>{item.name}</AutocompleteItem>
          )
        )}
      </Autocomplete>
    </>
  );
}

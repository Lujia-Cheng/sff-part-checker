import AutoComplete from "@mui/material/AutoComplete";
import TextField from "@mui/material/TextField";

import caseData from "../db/data/json/case.json";
import cpuCoolerData from "../db/data/json/cpu-cooler.json";
import videoCardData from "../db/data/json/video-card.json";
import motherboardData from "../db/data/json/motherboard.json";
import powerSupplyData from "../db/data/json/power-supply.json";

export default function PartPicker(parts, setParts) {
  return (
    <>
      <AutoComplete
        id="case"
        options={caseData}
        getOptionLabel={(option) => option.name}
        onChange={(event, newValue) => {
          setParts({ ...parts, case: newValue });
        }}
        renderInput={(params) => <TextField {...params} label="Case" />}
      />

      <AutoComplete
        id="cooler"
        options={cpuCoolerData}
        getOptionLabel={(option) => option.name}
        onChange={(event, newValue) => {
          setParts({ ...parts, cooler: newValue });
        }}
        renderInput={(params) => <TextField {...params} label="Cooler" />}
      />

      <AutoComplete
        id="gpu"
        options={videoCardData}
        getOptionLabel={(option) => option.name}
        onChange={(event, newValue) => {
          setParts({ ...parts, gpu: newValue });
        }}
        renderInput={(params) => <TextField {...params} label="GPU" />}
      />

      <AutoComplete
        id="motherboard"
        options={motherboardData}
        getOptionLabel={(option) => option.name}
        onChange={(event, newValue) => {
          setParts({ ...parts, motherboard: newValue });
        }}
        renderInput={(params) => <TextField {...params} label="Motherboard" />}
      />
      <AutoComplete
        id="psu"
        options={powerSupplyData}
        getOptionLabel={(option) => option.name}
        onChange={(event, newValue) => {
          setParts({ ...parts, psu: newValue });
        }}
        renderInput={(params) => <TextField {...params} label="Power Supply" />}
      />
    </>
  );
}

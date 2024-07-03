import AutoComplete from "@mui/material/AutoComplete";

export default function PartPicker(parts, setParts) {
  return (<>
  <AutoComplete options={parts.case} />
  <AutoComplete options={parts.cooler} />
  <AutoComplete options={parts.gpu} />
  <AutoComplete options={parts.motherboard} />
  <AutoComplete options={parts.psu} />
  <h1>todo - implement the part picker UI</h1>)</>
}

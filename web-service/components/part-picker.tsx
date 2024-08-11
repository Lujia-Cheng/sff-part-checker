import { Autocomplete, AutocompleteItem, Link } from "@nextui-org/react";

import caseData from "@/app/data/json/case.json";
import cpuCoolerData from "@/app/data/json/cpu-cooler.json";
import videoCardData from "@/app/data/json/video-card.json";
import motherboardData from "@/app/data/json/motherboard.json";
import powerSupplyData from "@/app/data/json/power-supply.json";

import type { PcConfig } from "@/types";
import { useEffect, useState } from "react";
import { lookupManualUrl } from "@/app/actions";

export default function PartPicker({
  parts,
  setParts,
}: {
  parts: PcConfig | undefined;
  setParts: any;
}) {
  const [manualUrl, setManualUrl] = useState<string>();
  // update the parts state with the selected part
  const updateParts = (part: string, item: any) => {
    const parsedItem = JSON.parse(item);
    setParts({ ...parts, [part]: parsedItem });
  };

  useEffect(() => {
    if (!parts?.case?.name) {
      return;
    }
    lookupManualUrl(parts.case?.name).then((url) => {
      setManualUrl(url);
      console.log("Manual URL:", url);
    });
  }, [parts?.case?.name]);
  return (
    // todo - not the cleanest way to do this, but it works for now
    <div className="flex flex-col w-full gap-2">
      <Autocomplete
        aria-label="Case"
        isRequired
        label="Case"
        placeholder="Select a case"
        onSelectionChange={(item) => updateParts("case", item)}
      >
        {caseData.map((item) => (
          <AutocompleteItem key={JSON.stringify(item)}>
            {item.name}
          </AutocompleteItem>
        ))}
      </Autocomplete>

      {manualUrl && (
        <span>
          We&apos;ve found the manual for your case on&nbsp;
          <Link href={manualUrl} isExternal showAnchorIcon>
            {/* show file.pdf (main url)  */}
            {new URL(manualUrl).hostname}
          </Link>
        </span>
      )}

      <Autocomplete
        aria-label="CPU Cooler"
        isRequired
        label="CPU Cooler"
        placeholder="Select a cpu cooler"
        onSelectionChange={(item) => updateParts("cooler", item)}
      >
        {cpuCoolerData.map((item) => (
          <AutocompleteItem key={JSON.stringify(item)}>
            {item.name}
          </AutocompleteItem>
        ))}
      </Autocomplete>
      <Autocomplete
        aria-label="Graphic Card"
        isRequired
        label="Graphic Card"
        placeholder="Select a video card"
        onSelectionChange={(item) => updateParts("gpu", item)}
      >
        {videoCardData.map((item) => (
          <AutocompleteItem key={JSON.stringify(item)}>
            {item.name + " " + item.chipset}
          </AutocompleteItem>
        ))}
      </Autocomplete>

      <Autocomplete
        aria-label="Motherboard"
        label="Motherboard"
        placeholder="Select a motherboard"
        onSelectionChange={(item) => updateParts("motherboard", item)}
      >
        {motherboardData.map((item) => (
          <AutocompleteItem key={JSON.stringify(item)}>
            {item.name}
          </AutocompleteItem>
        ))}
      </Autocomplete>

      <Autocomplete
        aria-label="Power Supply Unit"
        label="Power Supply Unit"
        placeholder="Select a power supply unit"
        onSelectionChange={(item) => updateParts("psu", item)}
      >
        {powerSupplyData.map((item) => (
          <AutocompleteItem key={JSON.stringify(item)}>
            {item.name}
          </AutocompleteItem>
        ))}
      </Autocomplete>
    </div>
  );
}

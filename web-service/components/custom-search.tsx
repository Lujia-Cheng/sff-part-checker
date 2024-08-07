import { useEffect, useState } from "react";

import { Link } from "@nextui-org/link";

import type { PcConfig } from "@/types";
import { lookupManualUrl } from "@/app/actions";
import { Space_Mono } from "next/font/google";
import { m } from "framer-motion";
import { Button } from "@nextui-org/react";

// todo move the manual upload from ai-suggestion to here
export default function CustomSearch({
  parts,
}: {
  parts: PcConfig | undefined;
}) {
  const [manualUrl, setManualUrl] = useState<string>();
  useEffect(() => {
    if (!parts?.case?.name) {
      return;
    }
    lookupManualUrl(parts.case?.name).then((url) => {
      setManualUrl(url);
      console.log("Manual URL:", url);
    });
  }, [parts]);
  function uploadManual() {
    // todo
  }

  return (
    <>
      {manualUrl && (
        <>
          <p>
            We found the manual of your case on{" "}
            <Link href={manualUrl} isExternal showAnchorIcon>
              {new URL(manualUrl).hostname}
            </Link>
          </p>
          <Button disabled onClick={uploadManual}>
            Review and Upload Manual
          </Button>
        </>
      )}
    </>
  );
}

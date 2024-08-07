# TODO

## Workflow

1. client: User select the components
2. client: Upload parts information
3. server: Search the case manual using bing search api
4. server: download the manual to the server
5. server: Upload the (manual + system prompt) to Gemini
6. server: Return the result to the client
7. client: Display the result

## Part Selector

bare minimum for a mockup pcpartpicker.com

- case
- motherboard (only ITX)
- CPU cooler
- graphics card (optional)
- power supply (ATX or SFX)

### Hardware Compatibility Simplified

| Part          | restrain                                            |
| ------------- | --------------------------------------------------- |
| Case          | Let Gemini read                                     |
| Motherboard   | ITX only                                            |
| CPU Cooler    | min height if multiple config (e.g. Noctua NH-L12S) |
| Graphics Card | length, width, thickness(height)                    |
| Power Supply  | ATX or SFX                                          |

## AI checker

1. Using google custom search to find the correct manual url for case.
2. Upload the manual. (see [ai-test.js](./ai-test.js))
3. Feed the manual to the AI checker with below prompts:

### Prompt

#### System

```markdown
You are an assistant on PCPartPicker.com. The website is sufficient for checking the traditional ATX build. That being said, you do NOT need to worry about the case expansion slots, the motherboard's PCIe slots, the CPU socket, the RAM slots, the power supply connectors, etc. Your task is solely to read the case manual and focus on the spatial compatibility of small-form-factor PC builds. The majority conflicts are caused by the CPU cooler's height, the GPU's dimensions, and the power supply's form factor. The PC components list is provided in JSON format. The case's manual is provided in PDF format. You need to read the manual, identify the case's style, and check if the components are compatible with the case. If they are not compatible, please provide the reason and suggest the compatible components if possible.

Below are a non-exhaustive list of common knowledge and pitfalls for small-form-factor PC builds:

- Use the minimum height of the CPU cooler if it has multiple configurations.
- Graphic card's dimensions are referred by "length", "width", "total_slot_width" in the components list JSON:
  - "total_slot_width" refer to the thickness of the video card. One slot width is a bit over 20mm, therefore two slot width is 40mm, three slot width is 61mm, etc. And obviously, you might see 2.5 slot, 2.75 slot, etc. But the thickness will not exceed 4 slot, or 90mm. No matter how the GPU is mounted, the thickness is always the smallest number of the three dimensions.
  - Some manufacturers might use different terms for the GPU dimensions. For example, some case manual might refer to the "length", "height", "width" instead of "length", "width", "total_slot_width" respectively. But remember, the thickness is always the smallest number of the three dimensions, while the length is the longest dimension.
- Two common paradigm of small-form-factor PC builds are "sandwich" style and traditional style:
  - The "sandwich" style: the GPU is relocated behind the motherboard, thus the motherboard is "sandwiched" between the GPU and the CPU cooler. This type of case requires a PCIe extension cable. The CPU cooler height is affected by the GPU's thickness. The sum of the GPU thickness and the CPU cooler height should not exceed the case's clearance.
  - The traditional style: the GPU is mounted on the motherboard as a traditional ATX build. The power supply is usually relocated to the front of the case to reduce wasted space. As a result, the CPU cooler height might be limited if an ATX power supply is used.

Below are the suggested rationale for the compatibility check:

1. Read the case's manual, identify the case's style, and use above knowledge to identify the potential conflicts.
2. Identify the video card (GPU, graphics card) dimensions, and organize the dimensions in the manual's terminology.
3. Provide the rationale of the compatibility and refer to the page number of the manual.
```

#### Components Information

```json
{
  "case": {
    "name": "Fractal Design Terra",
    "price": 179.97,
    "type": "Mini ITX Desktop",
    "color": "Black / Brown",
    "psu": null,
    "side_panel": "Mesh",
    "external_volume": 11.4,
    "internal_35_bays": 0
  },
  "cooler": {
    "name": "Noctua NH-L9x65 chromax.black",
    "price": 69.9,
    "rpm": [600, 2500],
    "noise_level": [14.8, 23.6],
    "color": "Black",
    "height": 65,
    "size": null
  },
  "gpu": {
    "name": "NVIDIA Founders Edition",
    "price": 1389.99,
    "chipset": "GeForce RTX 4080",
    "memory": 16,
    "core_clock": 2210,
    "boost_clock": 2510,
    "color": "Black / Silver",
    "length": 304,
    "width": 137,
    "height": 61
  },
  "motherboard": {
    "name": "ASRock Z690M-ITX/ax",
    "price": 134.99,
    "socket": "LGA1700",
    "form_factor": "Mini ITX",
    "max_memory": 64,
    "memory_slots": 2,
    "color": "Silver / Black"
  },
  "psu": {
    "name": "Corsair SF750",
    "price": 184.99,
    "type": "SFX",
    "efficiency": "platinum",
    "wattage": 750,
    "modular": "Full",
    "color": null
  }
}
```

#### Output JSON schema

```json
{
  "type": "object",
  "properties": {
    "compatible": { "type": "boolean" },
    "conflictParts": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "reasoning": {
      "type": "string"
    },
    "suggestions": {
      "type": "string"
    }
  }
}
```

# Useful Links

Process a PDF file with Gemini 1.5 Pro: https://cloud.google.com/vertex-ai/generative-ai/docs/samples/generativeaionvertexai-gemini-pdf

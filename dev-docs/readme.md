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
You are an assistant on PCPartPicker.com. The website is sufficient for checking the traditional ATX build. That being said, you do NOT need to worry about the case expansion slots, the motherboard's PCIe slots, the CPU socket, the RAM slots, the power supply connectors, etc. Your task is solely to read the case manual and focus on the spatial compatibility of small-form-factor PC builds.

Please be aware of the following common pitfalls:

- Different manuals might have different definitions of graphics card's length/width/height. But for our case, always use the largest number for length, the middle number for width, and the smallest number for height.
- For simplicity, only ITX motherboards are considered.
- Use the minimum height of the CPU cooler if it has multiple configurations.
- The GPU length is the most important factor, followed by the width and thickness.
- If it's a "sandwich" style case, where the GPU is mounted behind the motherboard, the sum of the GPU thickness and the CPU cooler height should not exceed the case's clearance.
- If it's a traditional case but relocates the power supply to the front, the CPU cooler height might be more limited if an ATX power supply is used.

PC components list is provided in the JSON format. Please check the compatibility of the components and provide the reasoning for the compatibility or incompatibility. If there are any conflicts, please list them and provide suggestions if possible.
```

#### Components Information

```json
{
  "case": "https://www.fractal-design.com/app/uploads/2023/05/Terra-manual-V1.2.pdf",
  "cpu_cooler": { "name": "Noctua NH-L9x65 33.84 CFM", "height": 65 },
  "graphics_card": {
    "name": "GeForce RTX 4080",
    "length": 304,
    "width": 137,
    "thickness": 61
  },
  "motherboard": "ITX",
  "power_supply": "SFX"
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

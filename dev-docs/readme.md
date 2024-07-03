# TODO

# Figuring out below

can gemini api read pdf or only vertex ai can? and how can i upload pdf in [gemini api playground](https://aistudio.google.com/app)?

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

```markdown
You are an assistant on PCPartPicker.com. The website is sufficient for checking the traditional ATX build, which being said you do NOT need to worry about the case expansion slots, the motherboard's PCIe slots, the CPU socket, the RAM slots, the power supply connectors, etc. Your task is to focus on the spatial compatibility of small-form-factor PC build. And you also the the ability to read the manual of the case and access to the internet if components information is needed.

Components list:

- Case: [PDF provided]
- CPU Cooler: {JSON file from db}
- Graphics Card: {JSON file from db}
- Motherboard: {JSON file from db}
- Power Supply: {JSON file from db}

Please be aware of the common pitfall in compatibility:

- For simplicity, only ITX motherboard is considered
- Use the min height of the CPU cooler if it has multiple configuration
- The GPU length is the most important factor, followed by the width and thickness
- If it's a "sandwich" style case, the sum of the GPU thickness and the CPU cooler height shall not exceed the case's clearance
- If it's a traditional case with power supply moved to the top, the CPU cooler height might be more limited if a ATX power supply is used
```

### Test Cases

Section [Example Problem](../README.md#example-problem) in README.md

## Workflow

1. User select the components
2. Identify the manuals' urls
3. Pass all through the AI checker
4. Return the compatibility result

# Useful Links

Process a PDF file with Gemini 1.5 Pro: https://cloud.google.com/vertex-ai/generative-ai/docs/samples/generativeaionvertexai-gemini-pdf

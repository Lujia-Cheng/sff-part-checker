# TODO

## Part Selector

bare minimum for a mockup pcpartpicker.com

- case
- motherboard (only ITX)
- CPU cooler
- graphics card (optional)
- power supply (ATX or SFX)

## AI checker

- Read the manual of the case and understand the compatibility under different configuration
- know the height of CPU cooler
- know the length, width, and thickness of GPU

## Workflow

1. User select the components
2. Identify the manuals' urls
3. Pass all through the AI checker
4. Return the compatibility result

# Hardware Compatibility Simplified

| Part          | restrain                         |
| ------------- | -------------------------------- |
| Case          | Let Gemini read                  |
| Motherboard   | ITX only                         |
| CPU Cooler    | min height if multiple config (e.g. diff fan position in Noctua nh-L12S)   |
| Graphics Card | length, width, thickness(height) |
| Power Supply  | ATX or SFX                       |

# Useful Links

Process a PDF file with Gemini 1.5 Pro: https://cloud.google.com/vertex-ai/generative-ai/docs/samples/generativeaionvertexai-gemini-pdf

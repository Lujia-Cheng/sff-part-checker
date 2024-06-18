## Project Scope

> TL;DR: To answer the question: 
"I'm planning to upgrade my PC, it'll be better, obviously. But how much smaller can it be?"

With a few recent new case release, small form factor PC (SFF PC) are more adaptable than usual. However, the compatibility checker (namely [PCPartPicker.com](https://pcpartpicker.com/)) are not as accurate when it comes to SFF. And it would be programmatically
tedious for checker that check every published and upcoming SFF cases and hardware compatibility. After all, the SFF community is still a niche field.

This project aims to create a compatibility checker that abuse the documentation reading ability of the AI. At this time of writing, AI is still not as good as human in logic and reasoning. But its reading speed and documentation searching ability is far superior. This project will use the AI to read the documentation of the hardware and cases, and then use the information to determine the compatibility.

## Example Problem

1. [Example](https://pcpartpicker.com/user/ayoitsLuke/saved/JdGzZL)

Cases support both ATX and SFX power supply, and it only affect the CPU cooler height clearance. However, the compatibility checker will only check the CPU cooler height clearance for the ATX power supply, and not the SFX power supply.

2. [Terra case manual from Fractal Design](https://www.fractal-design.com/app/uploads/2023/05/Terra-manual-V1.2.pdf)

This is a new case from Fractal Design, it's a fun little sandwich layout case with a adjustable spine which support up to 3 slot GPU. So thicker GPU = less CPU cooler height clearance, and vice versa. And the sum of the GPU thickness and CPU cooler height are also different based on the length of the GPU.
The compatibility checker will not be able to check this. Only the manual can tell you this.

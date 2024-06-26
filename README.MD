## Project Scope

> TL;DR: To answer one question: "Will all these parts I choose fit nicely into this tiny SFF case?"

Small Form Factor (SFF) PC community has recently received a few new and economical cases. Unfortunately, the compatibility checker, namely [PCPartPicker.com](https://pcpartpicker.com), is not as accurate when it comes to SFF. It's not the fault of the developers, but rather the nature of SFF cases. The creativity of case designers is limitless, and the compatibility of hardware is not as straightforward as with traditional cases. Therefore, it would be programmatically tedious for a checker to verify compatibility for every published and upcoming SFF case and hardware.

Typically, compatibility issues are passed on to the user. Case and CPU cooler manufacturers usually provide detailed manuals to help users determine the amount of clearance they have. It's not uncommon for users to improvise, and in some extreme cases, even modify the case to make the build fit. Some may argue that this is the fun part of building an SFF PC, but it can still be a tedious task.

This project aims to create a compatibility checker that leverages the AI's ability to read and analyze documentation, overcoming this tediousness. At the time of writing, AI is still not as proficient as humans in logic and reasoning, but its reading speed and documentation searching ability are far superior. This project will utilize AI to read the documentation of hardware and cases, and then use the gathered information to determine compatibility.

## Example Problem

1. [Example](https://pcpartpicker.com/user/ayoitsLuke/saved/JdGzZL)

Cases support both ATX and SFX power supply, and it only affect the CPU cooler height clearance. However, the compatibility checker will only check the CPU cooler height clearance for the ATX power supply, and not the SFX power supply.

2. [Terra case manual from Fractal Design](https://www.fractal-design.com/app/uploads/2023/05/Terra-manual-V1.2.pdf)

This is a new case from Fractal Design, it's a fun little sandwich layout case with a adjustable spine which support up to 3 slot GPU. So thicker GPU = less CPU cooler height clearance, and vice versa. And the sum of the GPU thickness and CPU cooler height are also different based on the length of the GPU.
The compatibility checker will not be able to check this. Only the manual can tell you this.

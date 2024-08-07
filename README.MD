## Project Scope

> TL;DR: To answer one question: "Will all these parts fit in this SFF case?"

Small-form-factor (SFF) PC community has recently received a few innovative and economical cases. Unfortunately, the common PC hardware compatibility checker, [PCPartPicker.com](https://pcpartpicker.com), is not as accurate when it comes to SFF. It's not the fault of the developers, but rather the nature of SFF cases. The creativity of the design result in a wide variety of case layouts, and renders programmatically tedious in determining compatibility. This project aims to create a compatibility checker that leverages the AI's ability to read and analyze documentation, overcoming in traditional, deterministic methods.

Typically, compatibility issues are passed on to the user. Case and CPU cooler manufacturers usually provide detailed manuals to help users determine the amount of clearance they have. It's not uncommon for users to improvise, and in some extreme cases, even modify the case to make the build fit. Some may argue that this is the fun part of building an SFF PC, but it can still be a tedious task.

This project aims to create a compatibility checker that leverages the AI's ability to read and analyze documentation, overcoming this tediousness. At the time of writing, AI is still not as proficient as humans in logic and reasoning, but its reading speed and documentation searching ability are far superior. This project will utilize AI to read the documentation of hardware and cases, and then use the gathered information to determine compatibility.

## Current Problem for PCPartPicker.com

1. [SilverStone SG13](https://pcpartpicker.com/user/ayoitsLuke/saved/JdGzZL)

This case support both ATX and SFX power supply, and the CPU cooler height clearance is different for each. However, the compatibility checker will assume that the case only support ATX power supply, and will not be able to check the compatibility for SFX power supply.

1. [Fractal Design Terra](https://www.fractal-design.com/app/uploads/2023/05/Terra-manual-V1.2.pdf)

This is a new case from Fractal Design, it's a sandwich layout case with a adjustable spine that can support up to 3 slot GPU. The adjustable spine can be moved to accommodate different GPU thickness, therefore affecting the CPU cooler height clearance. And adding to the complexity, a internal support structure intrudes into the GPU area, relating the thickness and width of the GPU.

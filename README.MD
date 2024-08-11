# Small-Form-Factor PC Part Checker

## Description

> TL;DR: A web app to answer one simple yet tedious question: "Will all these parts fit in my SFF case?"

The Small-Form-Factor (SFF) PC Part Checker project aims to develop a web app that simplifies the tedious task of determining hardware compatibility in SFF cases, addressing the limitations of existing tools like PCPartPicker.com. While SFF cases are innovative, their diverse layouts often make it challenging to programmatically ensure compatibility. This project uses AI to read and analyze hardware and case documentation, offering an efficient solution for users, especially beginners, who find this process daunting. The app is deployable via Vercel, with a more reliable version available for local deployment. A video demo and case-specific examples highlight the tool's potential to address common compatibility issues overlooked by current checkers.

### Background/Inspiration

The small-form-factor (SFF) PC community has recently seen a number of innovative and affordable cases. Unfortunately, common PC hardware compatibility checkers, such as [PCPartPicker.com](https://pcpartpicker.com), are not always accurate for SFF builds. This is not the developers' fault but rather a challenge inherent to SFF cases. The creativity in design results in a wide variety of case layouts, making it programmatically tedious to determine compatibility.

### Current Challenges

Typically, compatibility issues are left to the PC enthusiast to resolve. Case, CPU cooler, graphic card manufacturers usually provide detailed manuals to help enthusiasts determine the amount of clearance available. While this information is useful, reading through all the documentation to determine compatibility can be tedious.

### AI Solution

Some may argue that this is the fun part of building an SFF PC, but it can be daunting for beginners. This project seeks to create a compatibility checker that uses AI to read and analyze documentation, thereby alleviating this burden. While AI is still not as adept as humans in logic and reasoning, its speed in reading and searching documentation is far superior. This project will utilize AI to read hardware and case documentation and use the information gathered to determine compatibility.

## Video Demo

Video Demo: https://www.youtube.com/watch?v=5Sd5JIF3OPI

## How to Run

### Vercel

> Due to Vercel's and dev API rate limit, the deployed version may not work as expected. Please refer to the local deployment for the most accurate result.

Visit the website at [sff-part-checker.vercel.app](https://sff-part-checker.vercel.app/)

### Local

1. Clone the repository
2. Enable the following APIs in [Google Cloud Console](https://console.cloud.google.com/) and obtain their API key:

   - Generative Language API
   - Custom Search API (Optional: Quality of Life)

3. Add the environment variables obtained in step 2 to the `.env.sample` and rename file to `.env`
4. Install the required packages via cmd/terminal/bash:

```bash
cd ./web-service
npm install
npm run dev
```

3. Open the browser and visit `localhost:3000`
4. Use the website

## A sample collection of current limitations of PCPartPicker.com

### [SilverStone SG13](https://pcpartpicker.com/user/ayoitsLuke/saved/JdGzZL)

This case support both ATX and SFX power supply, and the CPU cooler height clearance is different for each. However, the compatibility checker will assume that the case only support ATX power supply, and will not be able to check the compatibility for SFX power supply.

### [Fractal Design Terra](https://www.fractal-design.com/app/uploads/2023/05/Terra-manual-V1.2.pdf)

This is a new case from Fractal Design, it's a sandwich layout case with a adjustable spine that can support up to 3 slot GPU. The adjustable spine can be moved to accommodate different GPU thickness, therefore affecting the CPU cooler height clearance. And adding to the complexity, a internal support structure intrudes into the GPU area, relating the thickness and width of the GPU.

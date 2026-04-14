// backend/services/hfLabService.js
const { Client } = require("@gradio/client");

async function analyzeLabReport(imageUrl) {
  try {
    // Connect to your Space
    // Use the Space name: "nutriwise95/nutriwise-ocr"
    const client = await Client.connect(process.env.HF_LAB_ANALYSIS_API);

    console.log("Calling HF via Gradio Client with URL:", imageUrl);

    // Call the specific API named 'predict_api' defined in your app.py
    const result = await client.predict("/predict_api", {
      image: null,
      image_url: imageUrl,
    });


    // Gradio returns data in an array: [output1, output2, ...]
    // Your output is a JSON object, so it will be at index 0
    if (result.data && result.data.length > 0) {
      return result.data[0];
    }

    throw new Error("Empty response from HuggingFace");
  } catch (err) {
    console.error("Gradio Client Error:", err.message);
    throw new Error("Failed to analyze report using HuggingFace: " + err.message);
  }
}

module.exports = { analyzeLabReport };
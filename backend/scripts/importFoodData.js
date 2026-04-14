const mongoose = require("mongoose");
const XLSX = require("xlsx");
const Food = require("../models/Food");
require("dotenv").config();

async function importData() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    const workbook = XLSX.readFile("data/diet_dataset.xlsx");
    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    const rows = XLSX.utils.sheet_to_json(sheet);

    await Food.deleteMany({});
    await Food.insertMany(rows);

    console.log("Food dataset imported successfully!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

importData();

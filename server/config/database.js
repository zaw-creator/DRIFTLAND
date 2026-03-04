const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Seed safety requirements on first connection
    const SafetyRequirements = require("../models/SafetyRequirements");
    const count = await SafetyRequirements.countDocuments();

    if (count === 0) {
      console.log("Seeding safety requirements...");
      await require("../seeds/safetyRequirements")();
      console.log("Safety requirements seeded successfully");
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;

// Script to create an admin user
require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// MongoDB connection - hardcoded for direct use
const MONGODB_URI =
  "mongodb+srv://darzahid537:<db_password>@cluster0.gdkciyi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

if (!MONGODB_URI) {
  console.error("MongoDB URI is not defined");
  process.exit(1);
}

// Define User Schema (simplified version of your existing schema)
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin"],
    default: "admin",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create User model
const User = mongoose.models.User || mongoose.model("User", UserSchema);

// Admin user details - you can change these values
const adminUser = {
  name: "Zahid Farooq",
  email: "darzahid537@gmail.com",
  password: "ddtHc22#63", // You should change this to a secure password
  role: "admin",
};

async function createAdminUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Check if user already exists
    const existingUser = await User.findOne({ email: adminUser.email });
    if (existingUser) {
      console.log(`User with email ${adminUser.email} already exists`);
      process.exit(0);
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(adminUser.password, salt);

    // Create new admin user
    const newUser = new User({
      name: adminUser.name,
      email: adminUser.email,
      password: hashedPassword,
      role: adminUser.role,
    });

    await newUser.save();
    console.log(`Admin user created successfully: ${adminUser.email}`);
  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    // Close MongoDB connection
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

// Run the function
createAdminUser();

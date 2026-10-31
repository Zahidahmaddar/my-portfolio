// Creates the admin user, or updates its password if the user already exists.
// Reads everything from the environment, so no secrets live in this file:
//   npm run create-admin
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const { MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

if (!MONGODB_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error("Set MONGODB_URI, ADMIN_EMAIL and ADMIN_PASSWORD in .env.local");
  process.exit(1);
}

if (ADMIN_PASSWORD.length < 12) {
  console.error("ADMIN_PASSWORD must be at least 12 characters");
  process.exit(1);
}

// Mirrors the fields in src/lib/models/user.ts
const User = mongoose.model(
  "User",
  new mongoose.Schema({
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin"], default: "admin" },
    createdAt: { type: Date, default: Date.now },
  }),
);

async function createAdminUser() {
  try {
    await mongoose.connect(MONGODB_URI);

    const password = await bcrypt.hash(ADMIN_PASSWORD, 12);
    const email = ADMIN_EMAIL.toLowerCase().trim();
    const existing = await User.findOne({ email });

    if (existing) {
      existing.password = password;
      await existing.save();
      console.log(`Updated the password for ${email}`);
    } else {
      await User.create({ email, password, role: "admin" });
      console.log(`Created admin user ${email}`);
    }
  } catch (error) {
    console.error("Could not create the admin user:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

createAdminUser();

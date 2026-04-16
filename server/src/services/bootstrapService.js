import bcrypt from "bcryptjs";

import { USER_ROLES } from "../constants/requestConfig.js";
import User from "../models/User.js";

export const ensureDefaultAdmin = async () => {
  const existingAdmin = await User.findOne({ username: "udhaya" });

  if (existingAdmin) {
    if (existingAdmin.role !== USER_ROLES.ADMIN) {
      existingAdmin.role = USER_ROLES.ADMIN;
      existingAdmin.isSystemAdmin = true;
      await existingAdmin.save();
    }

    return existingAdmin;
  }

  const hashedPassword = await bcrypt.hash("admin123", 12);

  return User.create({
    name: "Udhaya Admin",
    username: "udhaya",
    email: "udhaya@smartrequesthub.local",
    password: hashedPassword,
    role: USER_ROLES.ADMIN,
    isSystemAdmin: true,
  });
};


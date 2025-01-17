import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { userModelTable } from "../user.model.js";
import { sendVerificationEmail } from "../../config/emailVerification.js";

async function registerUserService(param) {
  try {
    const { firstName, lastName, email, password, role } = param;
    const existingUser = await userModelTable.findOne({ email });
    if (existingUser) {
      throw {
        status: 400,
        message: "Email already exists",
        success: false,
      };
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModelTable.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const sentEmail = await sendVerificationEmail(user.email, token);
    return sentEmail;
  } catch (error) {
    console.log("services || registerUserService", error);
    throw error;
  }
}

async function loginAdminService(params) {
  try {
    const { email, password } = params;
    const user = await userModelTable.findOne({ email });
    console.log("user", user.role);

    if (!user || (user.role !== "admin" && user.emailVerified)) {
      throw {
        code: 400,
        message: "You are not allowed to login here",
        success: false,
      };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw {
        code: 400,
        message: "Invalid credentials",
        success: false,
      };
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    return { token };
  } catch (error) {
    console.log("services || loginAdminService", error);

    throw error;
  }
}
async function loginCustomerService(params) {
  try {
    const { email, password } = params;
    const user = await userModelTable.findOne({ email });

    if (!user || (user.role !== "customer" && user.emailVerified)) {
      throw {
        code: 400,
        message: "You are not allowed to login here",
        success: false,
      };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw {
        code: 400,
        message: "Invalid credentials",
        success: false,
      };
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    return { token };
  } catch (error) {
    console.log("services || loginCustomerService", error);

    throw error;
  }
}

async function verifyLoginService(params) {
  try {
    const {
      token: { token },
    } = params;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModelTable.findById(decoded.id);
    if (!user) {
      throw { code: 400, message: "Invalid token", success: false };
    }
    user.emailVerified = true;
    await user.save();
    return { status: 200, message: "Email verified successfully" };
  } catch (error) {
    console.log("services || verifyLoginService", error);

    throw error;
  }
}

export {
  registerUserService,
  loginAdminService,
  loginCustomerService,
  verifyLoginService,
};

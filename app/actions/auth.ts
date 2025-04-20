"use server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/lib/email";
import { EMAIL_VERIFICATION_TEMPLATE, PASSWORD_RESET_TEMPLATE } from "@/lib/template";

export async function signUp(name: string, email: string, password: string) {
  try {
    if (!name || !email || !password) {
      throw new Error("All fields are required");
    }

    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error("Email already in use");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = crypto.randomUUID();
    const verificationTokenExpires = new Date(Date.now() + 12 * 60 * 60 * 1000);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        verificationToken,
        verificationTokenExpires,
      },
    });

    const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify?token=${verificationToken}`;

    await sendEmail({
      to: email,
      subject: "Verify Your Email",
      html: EMAIL_VERIFICATION_TEMPLATE.replaceAll(
        "{{verification_url}}",
        verificationUrl
      )
    });

    return {
      success: true,
      message:
        "Account created! Please check your email to verify your account.",
    };
  } catch (error) {
    console.error("Signup error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Signup failed",
    };
  }
}

// Email Verification
export async function sendVerificationEmail(email: string) {
  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) throw new Error("User not found");
    if (user.emailVerified) throw new Error("Email already verified");

    const token = crypto.randomUUID();
    const expires = new Date(Date.now() + 12 * 60 * 60 * 1000);

    await prisma.user.update({
      where: { email },
      data: {
        verificationToken: token,
        verificationTokenExpires: expires,
      },
    });

    const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify?token=${token}`;

    await sendEmail({
      to: email,
      subject: "Verify Your Email",
      html: EMAIL_VERIFICATION_TEMPLATE.replaceAll(
        "{{verification_url}}",
        verificationUrl
      ),
    });

    return {
      success: true,
      message:
        "Verification email sent! Please check your inbox.",
    };
  } catch (error) {
    console.error("Email verification error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Signup failed",
    };
  }
}

export async function verifyEmail(token: string) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        verificationToken: token,
        verificationTokenExpires: { gt: new Date() },
      },
    });

    if (!user) throw new Error("Invalid or expired token");

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        verificationToken: null,
        verificationTokenExpires: null,
      },
    });

    return {
      success: true,
      message: "Email verified successfully!",
    };
  } catch (error) {
    console.error("Email verification error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Signup failed",
    };
  }
}

// Password Reset
export async function requestPasswordReset(email: string) {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("User not found");

    const token = crypto.randomUUID();
    const expires = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

    await prisma.user.update({
      where: { email },
      data: {
        resetToken: token,
        resetTokenExpires: expires,
      },
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/reset-password?token=${token}`;

    await sendEmail({
      to: email,
      subject: "Password Reset Request",
      html: PASSWORD_RESET_TEMPLATE.replaceAll(
        "{{reset_url}}",
        resetUrl
      )
    });

    return {
      success: true,
      message:
        "Password reset email sent! Please check your email to reset your password.",
    };
  } catch (error) {
    console.error("Password reset error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Signup failed",
    };
  }
}

export async function resetPassword(token: string, newPassword: string) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpires: { gt: new Date() },
      },
    });

    if (!user) throw new Error("Invalid or expired token");

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpires: null,
      },
    });

    return {
      success: true,
      message: "Password reset successfully!",
    };
  } catch (error) {
    console.error("Password reset error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Signup failed",
    };
  }
}

'use server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function signUp(
  name:string,
  email:string,
  password:string
) {
  try {
    if (!name || !email || !password) {
      throw new Error('All fields are required');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw new Error('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    });

    return { success: true, message: 'Account created successfully' };
  } catch (error) {
    console.error('Signup error:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Signup failed' 
    };
  }
}
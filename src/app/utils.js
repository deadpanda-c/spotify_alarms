import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const generateRandomString = (length) => {
  return crypto
  .randomBytes(60)
  .toString('hex')
  .slice(0, length);
}

export const getUserFromDatabase = async (id) => {
  const data = await prisma.user.findUnique({
    where: {
      id: Number(id),
    },
  });

  return data;
}

export const createNewUser = async (access_token, refresh_token) => {
  const oldResults = await prisma.user.findMany();
  const result = await prisma.user.create({
    data: {
      access_token: token.access_token,
      refresh_token: token.refresh_token,
    }
  });
  const newResults = await prisma.user.findMany();

  if (newResults.length === oldResults.length + 1) {
    return {
      success: true,
      message: 'User created successfully',
      data: result,
    };
  }
  return {
    success: false,
    message: 'User creation failed',
    data: null,
  }
}

import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';
import { CLIENT_ID, CLIENT_SECRET, SPOTIFY_TOKEN_URL, DEVICE_ID } from './config';

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
      devices_id: DEVICE_ID
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

export const updateUser = async (user) => {
  const updatedUser = await prisma.user.update({
    where: {
      id: 1
    },
    data: {
      access_token: user.access_token,
      refresh_token: user.refresh_token
    }
  });
  return updatedUser;
}

export const refreshToken = async (refresh_token) => {
  const newToken = await fetch(`${SPOTIFY_TOKEN_URL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refresh_token,
      client_id: CLIENT_ID,
    }),
  })
  .then((res) => {
    return res.json();
  })
  .catch((err) => console.log(err));

  return newToken;
}

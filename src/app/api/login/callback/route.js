import {
  PrismaClient
} from '@prisma/client';

import {
  NextResponse
} from 'next/server';

import {
  BASE_URL,
  SPOTIFY_BASE_URL,
  SPOTIFY_TOKEN_URL,
  REDIRECT_URI,
  CLIENT_ID,
  CLIENT_SECRET
} from '../../../config';

import {
  createNewUser,
  updateUser
} from '../../../utils';

const prisma = new PrismaClient();

const getAccessToken = async (code) => {
  if (!code) {
    return NextResponse.redirect(`${BASE_URL}/api/login`);
  }
  const result = await fetch(`${SPOTIFY_TOKEN_URL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: REDIRECT_URI
    })
  })
  .then(res => {
    if (res.status === 200) {
      return res.json();
    } else {
      throw new Error('Failed to get access token');
    }
  })
  .catch(err => {
    console.log(err);
  });

  return result;
}


export const GET = async (req) => {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const token = await getAccessToken(code);

  if (!token) {
    return NextResponse.redirect(`${BASE_URL}/api/login`);
  }

  const allUser = await prisma.user.findMany();

  if (allUser.length === 0) {
    const newUser = await createNewUser(token.access_token, token.refresh_token);
    console.log(newUser);
  } else {
    const user = await updateUser(token);
    console.log(user);
  }
  return NextResponse.json({ message: 'success', status: 200});
}

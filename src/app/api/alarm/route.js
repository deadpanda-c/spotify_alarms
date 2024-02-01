import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { getUserFromDatabase, updateUser, refreshToken } from '../../utils';

import { SPOTIFY_BASE_URL, SPOTIFY_TOKEN_URL, CLIENT_ID, CLIENT_SECRET, DEVICE_ID } from '../../config';

const prisma = new PrismaClient();

const playNextSong = async (access_token) => {
  const result = await fetch(`${SPOTIFY_BASE_URL}/me/player/next?device_id=${DEVICE_ID}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  })
  .then((res) => {
    if (res.status === 401) {
      return {
        status: res.status,
        message: 'Unauthorized',
      };
    } else if (res.status === 204) {
      return {
        status: res.status,
        message: 'Next Music Played',
        content: res.json(),
      };
    }
  })
  .catch((err) => console.log(err));
  return result;
}

export const POST = async (req) => {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  const user = await getUserFromDatabase(id);
  var result = {};

  result = await playNextSong(user.access_token);
  if (result.status === 401) {
    const refresh_token = await refreshToken(user.refresh_token);
    if (refresh_token) {
      result = await playNextSong(refresh_token);
    }
  }

  return NextResponse.json(user);
}

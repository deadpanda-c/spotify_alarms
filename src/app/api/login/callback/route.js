import { NextResponse } from 'next/server';
import {
  BASE_URL,
  SPOTIFY_BASE_URL,
  SPOTIFY_TOKEN_URL,
  REDIRECT_URI,
  CLIENT_ID,
  CLIENT_SECRET
} from '../../../config';

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
  localStorage.setItem('token', token.access_token);

  console.log('token: ', localStorage.getItem('token'));
  return NextResponse.json({ message: 'Hello World!' });
}

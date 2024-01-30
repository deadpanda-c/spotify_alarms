import {
  NextResponse
} from 'next/server';

import {
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI,
  SCOPES,
  AUTH_URL
} from '../../config';

import {
  generateRandomString
} from '../../utils';

export const GET = async () => {
  const state = generateRandomString(16);
  const scopes = SCOPES;

  return NextResponse.redirect(`${AUTH_URL}?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&state=${state}&scope=${scopes}`);
}

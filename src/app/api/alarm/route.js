import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { getUserFromDatabase } from '../../utils';

const prisma = new PrismaClient();

export const POST = async (req) => {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');

  const user = await getUserFromDatabase(id);


  console.log(user);
  
  return NextResponse.json(user);
}

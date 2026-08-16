import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { z } from 'zod';
import { apiErrorResponse } from '@/lib/api-errors';

const schema = z.object({ image: z.string().min(1), caption: z.string().optional(), alt: z.string().optional(), order: z.number().int().optional() });
export async function GET() { const items = await prisma.gallery.findMany({ orderBy: { order: 'asc' } }); const unique = items.filter((item, index, all) => all.findIndex((candidate) => candidate.image === item.image) === index); return NextResponse.json(unique); }
export async function POST(req: NextRequest) { try { await requireAdmin(req); return NextResponse.json(await prisma.gallery.create({ data: schema.parse(await req.json()) }), { status: 201 }); } catch (error) { return apiErrorResponse(error, 'Unable to create gallery item'); } }

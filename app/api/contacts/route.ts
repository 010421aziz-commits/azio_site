import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { z } from 'zod';
import { apiErrorResponse } from '@/lib/api-errors';
const schema = z.object({ address: z.string().min(3), phone: z.string().min(6), instagram: z.string().url(), mapUrl: z.string().url().optional().or(z.literal('')) });
export async function GET() { const contact = await prisma.contact.findFirst(); return NextResponse.json(contact); }
export async function PUT(request: NextRequest) { try { await requireAdmin(request); const data = schema.parse(await request.json()); const current = await prisma.contact.findFirst(); return NextResponse.json(current ? await prisma.contact.update({ where: { id: current.id }, data: { ...data, mapUrl: data.mapUrl || null } }) : await prisma.contact.create({ data: { ...data, mapUrl: data.mapUrl || null } })); } catch (error) { return apiErrorResponse(error, 'Unable to update contact details'); } }

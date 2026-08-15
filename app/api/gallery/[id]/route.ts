import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, UnauthorizedError } from '@/lib/auth';
import { z } from 'zod';

const schema = z.object({ image: z.string().min(1), caption: z.string().max(160).optional(), alt: z.string().max(160).optional(), order: z.number().int().optional() });
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) { try { await requireAdmin(request); return NextResponse.json(await prisma.gallery.update({ where: { id: (await params).id }, data: schema.parse(await request.json()) })); } catch (error) { if (error instanceof UnauthorizedError) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); return NextResponse.json({ error: 'Unable to update gallery item' }, { status: 400 }); } }
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) { try { await requireAdmin(request); await prisma.gallery.delete({ where: { id: (await params).id } }); return NextResponse.json({ ok: true }); } catch (error) { if (error instanceof UnauthorizedError) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); return NextResponse.json({ error: 'Unable to delete gallery item' }, { status: 400 }); } }

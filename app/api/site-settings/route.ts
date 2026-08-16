import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { apiErrorResponse } from '@/lib/api-errors';
import { z } from 'zod';

const schema = z.object({
  heroLocation: z.string().min(1), heroTitle: z.string().min(1), heroSubtitle: z.string().min(1), heroDescription: z.string().min(1),
  aboutTitle: z.string().min(1), aboutText: z.string().min(1), featuresTitle: z.string().min(1), programsTitle: z.string().min(1),
  teachersTitle: z.string().min(1), galleryTitle: z.string().min(1), contactTitle: z.string().min(1),
  stats: z.array(z.object({ value: z.string().min(1), label: z.string().min(1) })).length(4),
});

export async function GET() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 'main' } });
  return NextResponse.json(settings);
}

export async function PUT(request: NextRequest) {
  try {
    await requireAdmin(request);
    const data = schema.parse(await request.json());
    return NextResponse.json(await prisma.siteSettings.upsert({ where: { id: 'main' }, update: data, create: { id: 'main', ...data } }));
  } catch (error) {
    return apiErrorResponse(error, 'Unable to update site settings');
  }
}
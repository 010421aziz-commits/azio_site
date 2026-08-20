import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { apiErrorResponse } from '@/lib/api-errors';
import { z } from 'zod';

const fieldSchema = z.object({
  label: z.string().min(1).max(120), name: z.string().regex(/^[a-z][a-z0-9_]{0,39}$/),
  type: z.enum(['text', 'phone', 'email', 'textarea']), required: z.boolean(), order: z.number().int().nonnegative(),
});
const configSchema = z.object({
  title: z.string().min(1).max(160), subtitle: z.string().min(1).max(300), buttonText: z.string().min(1).max(80), successMessage: z.string().min(1).max(300), fields: z.array(fieldSchema).min(1).max(20),
}).superRefine((value, context) => {
  if (new Set(value.fields.map((field) => field.name)).size !== value.fields.length) context.addIssue({ code: z.ZodIssueCode.custom, message: 'Field names must be unique', path: ['fields'] });
});

export async function GET() {
  const config = await prisma.formConfig.findUnique({ where: { id: 'main' }, include: { fields: { orderBy: { order: 'asc' } } } });
  return NextResponse.json(config);
}

export async function PUT(request: NextRequest) {
  try {
    await requireAdmin(request);
    const data = configSchema.parse(await request.json());
    const config = await prisma.$transaction(async (transaction) => {
      await transaction.formField.deleteMany({ where: { configId: 'main' } });
      return transaction.formConfig.upsert({ where: { id: 'main' }, update: { title: data.title, subtitle: data.subtitle, buttonText: data.buttonText, successMessage: data.successMessage, fields: { create: data.fields } }, create: { id: 'main', ...data, fields: { create: data.fields } }, include: { fields: { orderBy: { order: 'asc' } } } });
    });
    return NextResponse.json(config);
  } catch (error) {
    return apiErrorResponse(error, 'Unable to update form configuration');
  }
}
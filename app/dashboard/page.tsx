import { prisma } from '@/lib/prisma'; import { BookOpen, Image as ImageIcon, Mail, Users } from 'lucide-react'; import { DashboardClient } from './dashboard-client';
export const dynamic = 'force-dynamic';
export default async function Dashboard(){const [teachers,programs,gallery,messages]=await Promise.all([prisma.teacher.findMany({orderBy:{order:'asc'}}),prisma.program.findMany({orderBy:{order:'asc'}}),prisma.gallery.findMany({orderBy:{order:'asc'}}),prisma.message.findMany({orderBy:{createdAt:'desc'},take:8})]);return <DashboardClient data={{teachers,programs,gallery,messages}}/>}

import { PrismaClient } from '@prisma/client'; import bcrypt from 'bcryptjs';
const db = new PrismaClient();
const adminEmail = process.env.ADMIN_EMAIL || '010421aziz@gmail.com';
const adminPassword = process.env.ADMIN_PASSWORD || 'Azio2104';
async function main() { const password = await bcrypt.hash(adminPassword, 12); await db.admin.upsert({ where:{email:adminEmail}, update:{password}, create:{email:adminEmail,password,name:'Quran Academy'} });
 await db.contact.upsert({where:{id:'academy-contact'},update:{},create:{id:'academy-contact',address:'Бишкек шаары, Кызыл-Адыр 156',phone:'+996 501 041 617',instagram:'https://www.instagram.com/quranacademy.kg'}});
 const teachers = [
  {id:'teacher-0',name:'Насрулло каары',position:'Медресенин мудуру',bio:'Окуу менен тарбияны айкалыштырган академиялык багыт.',image:'/images/mudur.jpeg',order:0},
  {id:'teacher-1',name:'Абдулазиз каары',position:'Устаз',bio:'Ижазасы бар устаз. Куран жаттоо жана тажвид сабактарын окутат.',image:'/images/ustaz2.jpeg',order:1},
 ];
 for (const teacher of teachers) await db.teacher.upsert({where:{id:teacher.id},update:teacher,create:teacher});
 const programs: [string,string,string,string[]][]=[['Куран жаттоо','Толук Куран жаттоо программасы.','BookOpen',['Толук жаттоо','Кайталоо','Тажвид']],['Ижаза','Куранды санад менен окуу.','ScrollText',['Санад','Кыраат','Устаздык көзөмөл']],['Араб тили','Куран тилин түшүнүүгө багытталган терең курс.','Languages',['Нахв','Сарф','Окуу','Жазуу','Сүйлөө']],['Англис тили','Заманбап англис тилинин практикалык программасы.','MessageCircle',['Grammar','Speaking','Reading','Listening']],['Диний сабактар','Негизги ислам илимдери.','Landmark',['Фикх','Акыда','Хадис','Сира','Тафсир']]];
 for (const [index, row] of programs.entries()) { const [title,description,icon,topics]=row; await db.program.upsert({where:{id:`program-${index}`},update:{},create:{id:`program-${index}`,title,description,icon,topics,order:index}}); } }
main().finally(()=>db.$disconnect());

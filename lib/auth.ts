import { SignJWT, jwtVerify } from 'jose'; import { NextRequest } from 'next/server'; const key=new TextEncoder().encode(process.env.JWT_SECRET || 'development-secret-change-me');
export class UnauthorizedError extends Error { constructor(){super('Unauthorized'); this.name='UnauthorizedError';} }
export const createToken=(id:string,email:string)=>new SignJWT({email}).setProtectedHeader({alg:'HS256'}).setSubject(id).setIssuedAt().setExpirationTime('7d').sign(key);
export async function requireAdmin(req:NextRequest){const token=req.cookies.get('qa_token')?.value; if(!token) throw new UnauthorizedError(); try{return await jwtVerify(token,key);}catch{throw new UnauthorizedError();}}

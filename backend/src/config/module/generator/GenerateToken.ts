import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

// Configure environment variables
dotenv.config();

interface TokenPayload {
  role: string;
  full_name: string;
  user_id: number;
  email: string;
}

function GenerateToken(payload: TokenPayload): string {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable not set');
  }

  const Token = jwt.sign(payload, process.env.JWT_SECRET as jwt.Secret, {
    expiresIn: '7d',
    algorithm: 'HS256',
    issuer: 'Mockupidea',
    audience: 'client-app'
  } as jwt.SignOptions);

  return Token;
}

export default GenerateToken;


import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  generateJwtToken(user: any): string {
    const payload = { 
      username: user.username, sub: user.id, role: user.role || 'USER'};
    return this.jwtService.sign(payload);
  }
}
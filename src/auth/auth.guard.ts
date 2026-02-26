import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;
    
    const path = request.url;
    const publicPaths = ['/', '/api/prices', '/api/prices?type=ADULTS' , '/api/prices?type=CHILDREN' , '/api/users/login', '/api/users/register', '/api/users/sign-up-for-lesson'];

    if (publicPaths.includes(path)) {
      return true;
    }

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Unauthorized');
    }

    const token = authHeader.split(' ')[1];
    try {
      const decoded = this.jwtService.verify(token);

      interface RequestWithUser extends Request {
        user?: {
          id: string;
          username: string;
          role: string;
        };
      }

      const request = context.switchToHttp().getRequest<RequestWithUser>();

      request.user = {
        id: decoded.sub,
        username: decoded.username,
        role: decoded.role,
      };
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
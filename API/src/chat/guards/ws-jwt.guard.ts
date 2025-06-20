import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { TokenPayload } from 'src/auth/models/token.model';
import { Socket } from 'socket.io';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient();
    const auth = client.handshake.headers.authorization as string;
    const token = auth?.split(' ')[1];
    if (!token) {
      throw new WsException('Unauthorized');
    }
    try {
      const payload = await this.jwtService.verifyAsync<TokenPayload>(token);
      client.data.user = { id: payload.sub, role: payload.role };
      return true;
    } catch {
      throw new WsException('Unauthorized');
    }
  }
}

import { WsJwtGuard } from './ws-jwt.guard';

describe('WsJwtGuard', () => {
  it('should be defined', () => {
    expect(new WsJwtGuard(null as any)).toBeDefined();
  });
});

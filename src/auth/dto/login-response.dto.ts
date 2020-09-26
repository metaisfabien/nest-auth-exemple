import { ApiProperty } from '@nestjs/swagger';

/**
 * Object reponse pour le login
 */
export class LoginResponseDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXJAZ21haWwuY29tIiwic3ViIjoiNWY2ZjMxMTlhM2MyNjY2ZDAwMTYzOTRiIiwiaWF0IjoxNjAxMTIyOTI1LCJleHAiOjE2MDExMjY1MjV9.nTvq24SWeFNdH_v0un-_f0B4-gf0Am_gO5wsDr1ULRY',
    description: 'Token JWT',
  })
  accessToken: string;

  /**
   * Assignement des properties
   */
  constructor(payload: Partial<any> = null) {
    if (payload) {
      Object.assign(this, payload);
    }
  }
}

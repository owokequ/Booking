import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class BookingReserveDto {
  @ApiProperty({
    description: 'event_id',
    example: 1,
    type: 'number',
  })
  @IsNumber({}, { message: 'Вы не ввели event_id' })
  event_id: number;

  @ApiProperty({
    description: 'user_id',
    example: 'user123',
    type: 'string',
  })
  @IsString({ message: 'Вы не ввели user_id' })
  user_id: string;
}

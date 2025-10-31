import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class BookingFilterDto {
  @IsString({ message: 'Введите начальную дату в формате "2025-12-12"' })
  dateStart: Date;

  @IsString({ message: 'Введите конечную дату в формате "2025-12-12"' })
  dateEnd: Date;
}

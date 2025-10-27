import { BadRequestException, Injectable } from '@nestjs/common';
import { BookingsRepository } from './bookings.repository';

@Injectable()
export class BookingsService {
  constructor(private readonly bookingRepository: BookingsRepository) {}

  async reserveBooking(userId: string, eventId: number) {
    const res = await this.bookingRepository.reserveBooking(userId, eventId);
    if (!res) {
      throw new BadRequestException('Не удалось забронировать место');
    }
    return res;
  }
}

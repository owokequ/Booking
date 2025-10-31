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

  async filterBookings(date: string) {
    if (date == 'day') {
      let count = 1;
      const dateStart = new Date();
      const dateEnd = new Date();
      dateEnd.setDate(dateStart.getDate() + 1);
      console.log(dateStart, dateEnd);
      const result = await this.bookingRepository.filterDay(dateStart, dateEnd);
      const sort = result.sort((a, b) => a.place - b.place);
      sort.map((item) => {
        item.place = count++;
      });
      return sort;
    }
    if (date == 'week') {
      let count = 1;
      const dateStart = new Date();
      const dateEnd = new Date();
      dateEnd.setDate(dateStart.getDate() + 7);
      console.log(dateStart, dateEnd);

      const result = await this.bookingRepository.filterDay(dateStart, dateEnd);
      const sort = result.sort((a, b) => a.place - b.place);
      sort.map((item) => {
        item.place = count++;
      });
      return sort;
    }
    if (date == 'month') {
      let count = 1;
      const dateStart = new Date();
      const dateEnd = new Date();
      dateEnd.setMonth(dateStart.getMonth() + 1);
      console.log(dateStart, dateEnd);

      const result = await this.bookingRepository.filterDay(dateStart, dateEnd);
      const sort = result.sort((a, b) => a.place - b.place);
      sort.map((item) => {
        item.place = count++;
      });
      return sort;
    }

    throw new BadRequestException('Не верно указан query параметр');
  }
}

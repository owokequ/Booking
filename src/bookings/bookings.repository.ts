import { ConflictException, GoneException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookingsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async reserveBooking(userId: string, eventId: number) {
    return await this.prisma.$transaction(async (tx) => {
      const booking = await tx.booking.findFirst({
        where: { eventId, userId },
      });
      if (booking) {
        throw new ConflictException('Вы уже забронировали место');
      }

      const count = await tx.booking.count({
        where: { eventId },
      });
      const events = await tx.events.findUnique({
        where: { id: eventId },
      });
      if (events?.totalSeats <= count) {
        throw new GoneException('Места на мероприятие закончились!');
      }
      return await tx.booking.create({
        data: {
          userId,
          eventId,
        },
      });
    });
  }

  async filterDay(dateStart: Date, dateEnd: Date) {
    return await this.prisma.user.findMany({
      where: {
        createdAt: {
          gte: new Date(dateStart),
          lt: new Date(dateEnd),
        },
      },
      take: 10,
    });
  }
}

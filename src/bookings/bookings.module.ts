import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { BookingsRepository } from './bookings.repository';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { BOOKING_SERVICE_RABBITMQ } from '../constants';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: BOOKING_SERVICE_RABBITMQ,
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://root:root@localhost:5672'],
          queue: 'booking_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],

  controllers: [BookingsController],
  providers: [BookingsService, BookingsRepository],
})
export class BookingsModule {}

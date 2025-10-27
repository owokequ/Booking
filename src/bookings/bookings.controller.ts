import {
  Body,
  Controller,
  HttpException,
  Inject,
  Next,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import type { NextFunction, Response, Request } from 'express';
import { BookingReserveDto } from './dtos/booking-reserve.dto';
import { ClientProxy } from '@nestjs/microservices';
import { BOOKING_SERVICE_RABBITMQ } from '../constants';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('bookings')
@Controller('bookings')
export class BookingsController {
  constructor(
    private readonly bookingsService: BookingsService,
    @Inject(BOOKING_SERVICE_RABBITMQ)
    private readonly client: ClientProxy,
  ) {}

  @ApiOperation({
    summary: 'Забронировать место',
    description:
      'Возвращает сообщение об успешной брони и передает его в RabbitMQ',
  })
  @ApiResponse({
    status: 200,
    description:
      'Пользователь ${user_id} забронировал место на событие ${event_id}',
  })
  @ApiResponse({
    status: 400,
    description: `Не удалось забронировать место`,
    example: {
      success: false,
      status: 400,
      path: '/bookings/reserve',
      timestamp: '2023-09-12T14:30:00.000Z',
      error: 'Не удалось забронировать место',
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Вы уже забронировали место',
  })
  @ApiResponse({
    status: 410,
    description: 'Места на мероприятие закончились!',
  })
  @ApiResponse({
    status: 423,
    description: 'Ошибка сохранения сессии',
  })
  @Post('reserve')
  async reserve(
    @Body() dto: BookingReserveDto,
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const { user_id, event_id } = dto;
      await this.bookingsService.reserveBooking(user_id, event_id);
      await new Promise((resolve, reject) => {
        req.session.user = { user_id: user_id, event_id: event_id };
        req.session.save((err) => {
          if (err) {
            return reject(new HttpException('Ошибка сохранения сессии', 423));
          }
          resolve(true);
        });
      });
      this.client.emit('booking-created', {
        message: `Пользователь ${user_id} забронировал место на событие ${event_id}`,
      });
      return res.status(200).json({
        message: `Пользователь ${user_id} забронировал место на событие ${event_id}`,
      });
    } catch (error) {
      next(error);
    }
  }
}

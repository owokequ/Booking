import { TestingModule, Test } from '@nestjs/testing';
import { BookingsService } from './bookings.service';
import { BookingsRepository } from './bookings.repository';

const mockBookingRepository = () => ({
  reserveBooking: jest.fn(),
});

const BookingDto = {
  userId: 'user1',
  eventId: 1,
};

describe('BookingsService', () => {
  let service: BookingsService;
  let bookingRepository: ReturnType<typeof mockBookingRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        { provide: BookingsRepository, useFactory: mockBookingRepository },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
    bookingRepository = module.get(BookingsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('reserveBooking', () => {
    it('should call error reserveBooking', async () => {
      bookingRepository.reserveBooking.mockResolvedValue(undefined);
      await expect(
        service.reserveBooking(BookingDto.userId, BookingDto.eventId),
      ).rejects.toThrow('Не удалось забронировать место');
    });

    it('should call reserveBooking', async () => {
      bookingRepository.reserveBooking.mockResolvedValue({
        userId: 'user1',
        eventId: 1,
      });

      await expect(
        service.reserveBooking(BookingDto.userId, BookingDto.eventId),
      ).resolves.toEqual({ userId: 'user1', eventId: 1 });
    });
  });
});

import { TestingModule, Test } from '@nestjs/testing';
import { BookingsRepository } from './bookings.repository';
import { PrismaService } from '../prisma/prisma.service';

const mockPrisma = () => ({
  booking: {
    findFirst: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
  },
  events: {
    findUnique: jest.fn(),
  },
  $transaction: jest.fn(),
});

const BookingDto = {
  userId: 'user1',
  eventId: 1,
};

describe('BookingsRepository', () => {
  let repository: BookingsRepository;
  let prisma: ReturnType<typeof mockPrisma>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsRepository,
        {
          provide: PrismaService,
          useValue: mockPrisma(),
        },
      ],
    }).compile();

    repository = module.get<BookingsRepository>(BookingsRepository);
    prisma = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('reserveBooking', () => {
    it('should call error reserveBooking', async () => {
      prisma.$transaction.mockImplementation((callback) => {
        const tx = {
          booking: {
            findFirst: jest.fn().mockResolvedValue({
              id: '1',
              eventId: 1,
              userId: 'user1',
              createdAt: new Date(),
            }),
            count: jest.fn(),
            create: jest.fn(),
          },
          events: {
            findUnique: jest.fn(),
          },
        };
        return callback(tx);
      });
      await expect(
        repository.reserveBooking(BookingDto.userId, BookingDto.eventId),
      ).rejects.toThrow('Вы уже забронировали место');
    });

    it('should call reserveBooking', async () => {
      const mockDate = new Date();
      prisma.$transaction.mockImplementation((callback) => {
        const tx = {
          booking: {
            findFirst: jest.fn().mockResolvedValue(null),
            count: jest.fn().mockResolvedValue(9),
            create: jest.fn().mockResolvedValue({
              id: '1',
              userId: BookingDto.userId,
              eventId: BookingDto.eventId,
              createdAt: mockDate,
            }),
          },
          events: {
            findUnique: jest
              .fn()
              .mockResolvedValue({ name: 'name', id: 1, totalSeats: 10 }),
          },
        };
        return callback(tx);
      });

      await expect(
        repository.reserveBooking(BookingDto.userId, BookingDto.eventId),
      ).resolves.toEqual({
        id: '1',
        userId: BookingDto.userId,
        eventId: BookingDto.eventId,
        createdAt: mockDate,
      });
    });
    it('should call totalSeats all reserveBooking', async () => {
      prisma.$transaction.mockImplementation((callback) => {
        const tx = {
          booking: {
            findFirst: jest.fn().mockResolvedValue(null),
            count: jest.fn().mockResolvedValue(10),
            create: jest.fn(),
          },
          events: {
            findUnique: jest
              .fn()
              .mockResolvedValue({ name: 'name', id: 1, totalSeats: 10 }),
          },
        };
        return callback(tx);
      });

      await expect(
        repository.reserveBooking(BookingDto.userId, BookingDto.eventId),
      ).rejects.toThrow('Места на мероприятие закончились!');
    });
  });
});

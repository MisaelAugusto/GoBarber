import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import AppError from '@shared/errors/AppError';
import CreateAppointmentService from './CreateAppointmentService';

let createAppointment: CreateAppointmentService;
let fakeCacheProvider: FakeCacheProvider;
let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeNotificationsRepository: FakeNotificationsRepository;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeNotificationsRepository = new FakeNotificationsRepository();
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeCacheProvider = new FakeCacheProvider();

    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationsRepository,
      fakeCacheProvider
    );
  });

  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 9, 10, 12).getTime();
    });

    const appointment = await createAppointment.execute({
      date: new Date(2020, 9, 10, 13),
      user_id: 'user-id',
      provider_id: 'provider-id'
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('provider-id');
  });

  it('should not be able to create a new appointment on the same time', async () => {
    const appointmentDate = new Date(2020, 9, 11, 15);

    await createAppointment.execute({
      date: appointmentDate,
      user_id: 'user-id',
      provider_id: 'provider-id'
    });

    await expect(
      createAppointment.execute({
        date: appointmentDate,
        user_id: 'user-id',
        provider_id: 'provider-id'
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new appointment on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 9, 10, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 9, 10, 11),
        user_id: 'user-id',
        provider_id: 'provider-id'
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new appointment with same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 9, 10, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 9, 10, 13),
        user_id: 'user-id',
        provider_id: 'user-id'
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new appointment before 8am and after 5pm', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 9, 10, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 9, 11, 7),
        user_id: 'user-id',
        provider_id: 'provider-id'
      })
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointment.execute({
        date: new Date(2020, 9, 11, 18),
        user_id: 'user-id',
        provider_id: 'provider-id'
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});

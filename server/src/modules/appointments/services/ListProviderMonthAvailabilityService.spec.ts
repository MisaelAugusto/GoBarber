import 'reflect-metadata';

import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderMonthAvalability: ListProviderMonthAvailabilityService;

describe('ListProviderMonthAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();

    listProviderMonthAvalability = new ListProviderMonthAvailabilityService(
      fakeAppointmentsRepository
    );
  });

  it('should be able to list the month availability from provider', async () => {
    const hours = Array(10)
      .fill(0)
      .map((_, idx) => 8 + idx);

    hours.map(async hour => {
      await fakeAppointmentsRepository.create({
        provider_id: 'user',
        user_id: '123456789',
        date: new Date(2020, 9, 20, hour, 0, 0)
      });
    });

    const availability = await listProviderMonthAvalability.execute({
      provider_id: 'user',
      year: 2020,
      month: 10
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        {
          day: 19,
          available: true
        },
        {
          day: 20,
          available: false
        },
        {
          day: 21,
          available: true
        },
        {
          day: 22,
          available: true
        }
      ])
    );
  });
});

import 'reflect-metadata';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';
import ShowProfileService from './ShowProfileService';

let fakeUsersRepository: FakeUsersRepository;
let showProfile: ShowProfileService;

describe('ShowProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    showProfile = new ShowProfileService(fakeUsersRepository);
  });

  it('should be able to show profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Misael Augusto',
      email: 'misael.augusto@gmail.com',
      password: '123456'
    });

    const profile = await showProfile.execute({
      user_id: user.id
    });

    expect(profile.name).toBe('Misael Augusto');
    expect(profile.email).toBe('misael.augusto@gmail.com');
  });

  it('should not be able to show profile from non-existing user', async () => {
    await expect(
      showProfile.execute({
        user_id: 'non-existing user'
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});

import 'reflect-metadata';

import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateProfileService from './UpdateProfileService';

let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;
let fakeUsersRepository: FakeUsersRepository;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeHashProvider = new FakeHashProvider();
    fakeUsersRepository = new FakeUsersRepository();

    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider
    );
  });

  it('should be able to update profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Misael Augusto',
      email: 'misael.augusto326@gmail.com',
      password: '326159487'
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Misael Augusto 2',
      email: 'misael2.augusto326@gmail.com'
    });

    expect(updatedUser.name).toBe('Misael Augusto 2');
    expect(updatedUser.email).toBe('misael2.augusto326@gmail.com');
  });

  it('should not be able to change to another user email', async () => {
    await fakeUsersRepository.create({
      name: 'Misael Augusto',
      email: 'misael.augusto326@gmail.com',
      password: '326159487'
    });

    const user = await fakeUsersRepository.create({
      name: 'Misael Augusto 2',
      email: 'misael2.augusto326@gmail.com',
      password: '326159487'
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Misael Augusto 3',
        email: 'misael.augusto326@gmail.com'
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Misael Augusto',
      email: 'misael.augusto326@gmail.com',
      password: '326159487'
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Misael Augusto 2',
      email: 'misael2.augusto326@gmail.com',
      old_password: '326159487',
      password: '123456789'
    });

    expect(updatedUser.password).toBe('123456789');
  });

  it('should not be able to update the password without the old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Misael Augusto',
      email: 'misael.augusto326@gmail.com',
      password: '326159487'
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Misael Augusto 2',
        email: 'misael2.augusto326@gmail.com',
        password: '123456789'
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password without the old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Misael Augusto',
      email: 'misael.augusto326@gmail.com',
      password: '326159487'
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Misael Augusto 2',
        email: 'misael2.augusto326@gmail.com',
        old_password: 'wrong-old-password',
        password: '123456789'
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});

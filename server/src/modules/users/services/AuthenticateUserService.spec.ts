import 'reflect-metadata';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';
import AuthenticateUserService from './AuthenticateUserService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeHashProvider: FakeHashProvider;
let fakeUsersRepository: FakeUsersRepository;
let authenticateUser: AuthenticateUserService;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );
  });

  it('should be able to authenticate', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Misael Augusto',
      email: 'misael.augusto@gmail.com',
      password: '123456'
    });

    const response = await authenticateUser.execute({
      email: 'misael.augusto@gmail.com',
      password: '123456'
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not be able to authenticate with non existing user', async () => {
    await expect(
      authenticateUser.execute({
        email: 'misael.augusto@gmail.com',
        password: '123456'
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    await fakeUsersRepository.create({
      name: 'Misael Augusto',
      email: 'misael.augusto@gmail.com',
      password: '123456'
    });

    await expect(
      authenticateUser.execute({
        email: 'misael.augusto@gmail.com',
        password: '000000'
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});

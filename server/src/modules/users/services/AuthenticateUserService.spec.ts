import "reflect-metadata";

import CreateUserService from './CreateUserService';
import AuthenticateUserService from './AuthenticateUserService';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from "../providers/HashProvider/fakes/FakeHashProvider";
import AppError from "@shared/errors/AppError";

describe('AuthenticateUser', () => {
  it('should be able to authenticate', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );

    const authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );

    const user = await createUser.execute({
      name: 'Misael Augusto',
      email: 'misael.augusto326@gmail.com',
      password: '326159487'
    });

    const response = await authenticateUser.execute({
      email: 'misael.augusto326@gmail.com',
      password: '326159487'
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not be able to authenticate with non existing user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );

    await expect(
      authenticateUser.execute({
        email: 'misael.augusto326@gmail.com',
        password: '326159487'
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );

    const authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );

    const user = await createUser.execute({
      name: 'Misael Augusto',
      email: 'misael.augusto326@gmail.com',
      password: '326159487'
    });

    await expect(
      authenticateUser.execute({
        email: 'misael.augusto326@gmail.com',
        password: '123456789'
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
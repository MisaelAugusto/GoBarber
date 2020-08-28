import "reflect-metadata";

import CreateUserService from './CreateUserService';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';
import FakeHashProvider from "../providers/HashProvider/fakes/FakeHashProvider";

describe('CreateAppointment', () => {
  it('should be able to create a new user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );

    const user = await createUser.execute({
      name: 'Misael Augusto',
      email: 'misael.augusto326@gmail.com',
      password: '326159487'
    });

    expect(user).toHaveProperty('id');

  });

  it('should not be able to create a new user with same email from another', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );

    await createUser.execute({
      name: 'Misael Augusto',
      email: 'misael.augusto326@gmail.com',
      password: '326159487'
    });

    expect(
      createUser.execute({
        name: 'Misael Augusto',
        email: 'misael.augusto326@gmail.com',
        password: '326159487'
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
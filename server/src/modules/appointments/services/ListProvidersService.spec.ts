import 'reflect-metadata';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProvidersService from './ListProvidersService';

let fakeCacheProvider: FakeCacheProvider;
let fakeUsersRepository: FakeUsersRepository;
let listProviders: ListProvidersService;

describe('ListProviders', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();

    listProviders = new ListProvidersService(
      fakeUsersRepository,
      fakeCacheProvider
    );
  });

  it('should be able to list the providers', async () => {
    const user1 = await fakeUsersRepository.create({
      name: 'Misael Augusto',
      email: 'misael.augusto@gmail.com',
      password: '123456'
    });

    const user2 = await fakeUsersRepository.create({
      name: 'Misael Augusto 2',
      email: 'misael.augusto2@gmail.com',
      password: '123456'
    });

    const loggedUser = await fakeUsersRepository.create({
      name: 'Misael Augusto 3',
      email: 'misael.augusto3@gmail.com',
      password: '123456'
    });

    const providers = await listProviders.execute({
      user_id: loggedUser.id
    });

    expect(providers).toEqual([user1, user2]);
  });
});

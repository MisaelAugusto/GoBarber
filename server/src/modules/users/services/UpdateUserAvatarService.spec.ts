import "reflect-metadata";

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import UpdateUserAvatarService from "./UpdateUserAvatarService";
import AppError from "@shared/errors/AppError";

describe('UpdateUserAvatar', () => {
  it('should be able to update user avatar', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider
    );

    const user = await fakeUsersRepository.create({
      name: 'Misael Augusto',
      email: 'misael.augusto326@gmail.com',
      password: '326159487'
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'avatar.png'
    });

    expect(user.avatar).toBe('avatar.png');
  });

  it('should not be able to update avatar from non existing user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider
    );

    await expect(
      updateUserAvatar.execute({
      user_id: 'non-existing-user',
      avatarFilename: 'avatar.png'
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to delete old avatar when updating new one', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider
    );

    const user = await fakeUsersRepository.create({
      name: 'Misael Augusto',
      email: 'misael.augusto326@gmail.com',
      password: '326159487'
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'avatar.png'
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'avatar2.png'
    });

    expect(deleteFile).toHaveBeenCalledWith('avatar.png');
    expect(user.avatar).toBe('avatar2.png');
  });
});
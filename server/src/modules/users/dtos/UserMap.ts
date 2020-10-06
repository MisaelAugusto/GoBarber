/* eslint-disable @typescript-eslint/no-unused-vars */
import User from '../infra/typeorm/entities/User';

class UserMap {
  public static toDTO(user: User): Omit<User, 'password'> {
    const { password, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }
}

export default UserMap;

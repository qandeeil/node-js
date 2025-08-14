import UserModel, { IUser } from './user-model';

export class UserService {
  async getUserById(id: string): Promise<IUser | null> {
    return UserModel.findById(id).exec();
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return UserModel.findOne({ email }).exec();
  }

  async createUser(data: { email: string; name: string; passwordHash: string }): Promise<{ id: string; name: string; email: string; createdAt: Date }> {
    const exists = await this.findByEmail(data.email);
    if (exists) throw new Error('User already exists');
    const created = await UserModel.create({
      name: data.name,
      email: data.email,
      password: data.passwordHash,
    });
    return { id: created._id.toString(), name: created.name, email: created.email, createdAt: created.createdAt };
  }
}

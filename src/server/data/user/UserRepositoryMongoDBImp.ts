import UserSchema, { UserSchemaToDomain } from './UserSchema'
import { IUserRepository, CreateOrUpdateUserData } from '../../domain/interfaces/IUserRepository'
import { connectDB } from '../mongodb'
import { User } from '../../domain/entities/User'

export class UserRepositoryMongoDBImp implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    await connectDB()
    const user = await UserSchema.findOne({ email })
    return user ? UserSchemaToDomain(user) : null
  }

  async create(user: CreateOrUpdateUserData): Promise<User> {
    await connectDB()
    const result = await UserSchema.create(user)
    return UserSchemaToDomain(result)
  }

  async findById(id: string): Promise<User | null> {
    await connectDB()
    const result = await UserSchema.findById(id)
    return result ? UserSchemaToDomain(result) : null
  }

  async update(id: string, data: Partial<CreateOrUpdateUserData>): Promise<User | null> {
    await connectDB()
    const result = await UserSchema.findByIdAndUpdate(id, data, { new: true })
    return result ? UserSchemaToDomain(result) : null
  }

  async delete(id: string): Promise<boolean> {
    await connectDB()
    const result = await UserSchema.findByIdAndDelete(id)
    return !!result
  }
} 
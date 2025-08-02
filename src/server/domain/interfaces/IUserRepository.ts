import { User } from "../entities/User"

export interface CreateOrUpdateUserData {
  name: string
  email: string
}

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>
  create(user: CreateOrUpdateUserData): Promise<User>
  findById(id: string): Promise<User | null>
  update(id: string, data: Partial<CreateOrUpdateUserData>): Promise<User | null>
  delete(id: string): Promise<boolean>
} 
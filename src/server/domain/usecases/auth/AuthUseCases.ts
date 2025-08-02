import bcrypt from 'bcryptjs'
import { IUserRepository } from '../../interfaces/IUserRepository'

interface RegisterUserDTO {
  name: string
  email: string
  password: string
}

interface GoogleRegisterUserDTO {
  email: string
  name: string
}

interface AuthenticateUserDTO {
  email: string
  password: string
}

export class AuthUseCase {
  constructor(private userRepository: IUserRepository) {}

  // async register({ name, email, password }: RegisterUserDTO) {
  //   const existingUser = await this.userRepository.findByEmail(email)
    
  //   if (existingUser) {
  //     throw new Error('User already exists')
  //   }

  //   const hashedPassword = await bcrypt.hash(password, 12)

  //   const user = await this.userRepository.create({
  //     name,
  //     email,
  //     password: hashedPassword,
  //   })

  //   return {
  //     id: user._id,
  //     name: user.name,
  //     email: user.email,
  //   }
  // }

  /**
   * Checks if the user exists and returns it.
   * If the user does not exist, creates a new user and returns it.
   * @param userData - The user data to create or find.
   * @returns The user data.
   */
  async googleSignIn({ email, name }: GoogleRegisterUserDTO) {
    const existingUser = await this.userRepository.findByEmail(email)

    if (!existingUser) {
      const createdUser = await this.userRepository.create({
        name,
        email,
      })

      return createdUser;
    }

    return existingUser;
  }

  // async authenticate({ email, password }: AuthenticateUserDTO) {
  //   const user = await this.userRepository.findByEmail(email)

  //   if (!user || !user.password) {
  //     throw new Error('Invalid credentials')
  //   }

  //   const isCorrectPassword = await bcrypt.compare(password, user.password)

  //   if (!isCorrectPassword) {
  //     throw new Error('Invalid credentials')
  //   }

  //   return {
  //     id: user._id.toString(),
  //     email: user.email,
  //     name: user.name,
  //   }
  // }
} 
import { User } from '@/server/domain/entities/User';
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
  },
  name: {
    type: String,
    required: [true, 'Please provide a name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
  },
  password: {
    type: String,
  },
  googleId: {
    type: String,
  },
  balance: {
    type: Number,
    default: 0,
  },
  // Reference to transactions created by this user
  transactions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VehicleTransaction',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const UserSchemaToDomain = (user: any): User => {
  return new User(
    user._id.toString(),
    user.name,
    user.email,
    user.googleId,
    user.balance,
  )
}

export default mongoose.models.User || mongoose.model('User', UserSchema);
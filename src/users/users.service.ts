import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, UserRole, UserStatus } from './schemas/user.schema';
import { Group } from '../groups/schemas/group.schema';
import { CreateUserDto, UpdateUserDto } from './users.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Group.name) private groupModel: Model<Group>
  ) {}

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findByRole(role: UserRole): Promise<User[]> {
    return this.userModel.find({ role }).exec();
  }

  async findByStatus(status: UserStatus): Promise<User[]> {
    return this.userModel.find({ status }).exec();
  }

  async findByRoleAndStatus(role: UserRole, status: UserStatus): Promise<User[]> {
    return this.userModel.find({ role, status }).exec();
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async login(email: string, password: string): Promise<{ username: string, id: string, role: string }> {
    
        const user = await this.userModel.findOne({ email }).exec();
    
        if (!user || !user.password) {
            throw new NotFoundException('Invalid email or password');
        }
    
        const isPasswordValid = await bcrypt.compare(password, user.password);
    
        if (!isPasswordValid) {
            throw new NotFoundException('Invalid email or password');
        }

        const { _id, role } = user;
    
        return {
            username: email,
            id: _id.toString(),
            role: role,
        };
    }

  private generatePassword(length = 10): string {
        return Math.random().toString(36).slice(-length);
    }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const plainPassword = this.generatePassword();
    const hashedPassword = await bcrypt.hash(plainPassword, 12);

    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      {
        ...updateUserDto,
        password: hashedPassword,
      },
      { new: true }
    );

    if (!updatedUser) throw new NotFoundException('User not found');
    return updatedUser;
  }

  async remove(id: string): Promise<void> {
    const isStudent = await this.groupModel.exists({ students: id });
    if (isStudent) {
      throw new BadRequestException('User is assigned as a student in a group and cannot be deleted');
    }

    const isInstructor = await this.groupModel.exists({ instructors: id });
    if (isInstructor) {
      throw new BadRequestException('User is assigned as an instructor in a group and cannot be deleted');
    }

    const result = await this.userModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException('User not found');
    }
  }

  async updateStatus(id: string, status: UserStatus): Promise<User> {
    return this.update(id, { status });
  }

  async updateRole(id: string, role: UserRole): Promise<User> {
    return this.update(id, { role });
  }

  async createWithPlainPassword(createUserDto: CreateUserDto): Promise<{ user: User, plainPassword: string }> {
    const plainPassword = this.generatePassword();
    const hashedPassword = await bcrypt.hash(plainPassword, 12);

    const user = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });

    await user.save();

    return { user, plainPassword };
  }

  async regeneratePassword(id: string): Promise<{ id: string, plainPassword: string }> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const plainPassword = this.generatePassword();
    const hashedPassword = await bcrypt.hash(plainPassword, 12);

    user.password = hashedPassword;
    await user.save();

    return {
      id: user._id.toString(),
      plainPassword,
    };
  }
}
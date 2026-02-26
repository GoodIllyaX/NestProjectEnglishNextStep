import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Group } from './schemas/group.schema';
import { CreateGroupDto } from './dto/create-group.dto';

@Injectable()
export class GroupsService {
  constructor(@InjectModel(Group.name) private groupModel: Model<Group>) {}

  async create(createGroupDto: CreateGroupDto): Promise<Group> {
    return this.groupModel.create(createGroupDto);
  }

  async findAll(): Promise<Group[]> {
    return this.groupModel.find().exec();
  }

  async findByTeacherId(teacherId: string): Promise<Group[]> {
    return this.groupModel.find({ instructors: teacherId }).exec();
  }

  async findOne(id: string): Promise<Group> {
    const group = await this.groupModel.findById(id).exec();
    if (!group) throw new NotFoundException('Group not found');
    return group;
  }

  async update(id: string, updateData: Partial<CreateGroupDto>): Promise<Group> {
    const group = await this.groupModel.findByIdAndUpdate(id, updateData, { new: true });
    if (!group) throw new NotFoundException('Group not found');
    return group;
  }

  async remove(id: string): Promise<void> {
    const result = await this.groupModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('Group not found');
  }
}

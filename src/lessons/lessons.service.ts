
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Lesson } from './schemas/lesson.schema';
import { CreateLessonDto } from './dto/create-lesson.dto';

@Injectable()
export class LessonsService {
  constructor(@InjectModel(Lesson.name) private lessonModel: Model<Lesson>) {}

  async create(dto: CreateLessonDto): Promise<Lesson> {
    return this.lessonModel.create({ ...dto, status: 'CONDUCTED' });
  }

  async findAll(): Promise<Lesson[]> {
    return this.lessonModel.find().populate('teacherId groupId').exec();
  }

  async findByTeacher(teacherId: string): Promise<Lesson[]> {
    return this.lessonModel.find({ teacherId }).populate('teacherId groupId').exec();
  }

  async update(id: string, updateData: Partial<CreateLessonDto>): Promise<Lesson> {
    const lesson = await this.lessonModel.findByIdAndUpdate(id, updateData, { new: true });
    if (!lesson) throw new NotFoundException('Lesson not found');
    return lesson;
  }

  async remove(id: string): Promise<void> {
    const result = await this.lessonModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('Lesson not found');
  }
}

import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Level, LevelDocument } from './schemas/level.schema';
import { UpdateLevelsDto, LevelDto } from './dto/update-levels.dto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(Level.name) private levelModel: Model<LevelDocument>,
  ) {}

  async getAllGrouped() {
    const levels: Level[] = await this.levelModel.find().lean();

    const groupBy = (type: string) =>
      levels.filter((lvl) => lvl.courseType === type);

    return {
      business: groupBy('business'),
      school: groupBy('school'),
      general: groupBy('general'),
    };
  }

  async replaceLevels(dto: UpdateLevelsDto) {
    if (!dto || typeof dto !== 'object') {
      throw new BadRequestException('Invalid data format.');
    }

    const courseTypes: Array<keyof UpdateLevelsDto> = ['business', 'school', 'general'];

    for (const courseType of courseTypes) {
      const levels = dto[courseType] ?? [];

      await this.levelModel.deleteMany({ courseType });

      for (const level of levels) {
        if (!level.name || (level.children && !Array.isArray(level.children))) {
          throw new BadRequestException(`Invalid level structure for ${courseType}`);
        }

        await this.levelModel.create({
          name: level.name,
          docUrl: level.docUrl ?? null,
          courseType,
          children: (level.children ?? []).map((child, index) => ({
            id: index + 1,
            name: child.name,
            docUrl: child.docUrl ?? null,
          })),
        });
      }
    }

    return { message: 'Levels replaced successfully' };
  }

  async getCourseGroups(courseType: 'business' | 'school' | 'general') {
    return this.levelModel
      .find({ courseType })
      .select('id name docUrl')
      .lean();
  }
}
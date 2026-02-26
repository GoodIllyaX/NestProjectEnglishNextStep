import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { Level, LevelSchema } from './schemas/level.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Level.name, schema: LevelSchema }]), AuthModule],
  controllers: [CoursesController],
  providers: [CoursesService],
})
export class CoursesModule {}
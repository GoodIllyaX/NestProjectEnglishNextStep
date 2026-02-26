import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LessonSchema } from './schemas/lesson.schema';
import { LessonsController } from './lessons.controller';
import { LessonsService } from './lessons.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Lesson', schema: LessonSchema }]), AuthModule],
    controllers: [LessonsController],
    providers: [LessonsService],
})
export class LessonsModule {}
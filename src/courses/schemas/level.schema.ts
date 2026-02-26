import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Lesson, LessonSchema } from './lesson.schema';

export type LevelDocument = Level & Document;

@Schema()
export class Level {
  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  docUrl?: string;

  @Prop({ type: [LessonSchema], default: [] })
  children: Lesson[];

  @Prop({ required: true, enum: ['business', 'school', 'general'] })
  courseType: 'business' | 'school' | 'general';
}

export const LevelSchema = SchemaFactory.createForClass(Level);
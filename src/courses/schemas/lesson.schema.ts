import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class Lesson {
  @Prop({ required: true })
  id: number;

  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  docUrl?: string;
}

export const LessonSchema = SchemaFactory.createForClass(Lesson);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type LessonDocument = Lesson & Document;

@Schema()
export class Lesson {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  teacherId: Types.ObjectId;

  @Prop({ type: Date, required: true })
  timestamp: Date;

  @Prop({ default: 'CONDUCTED' })
  status: string;

  @Prop({ type: Types.ObjectId, ref: 'Group', required: true })
  groupId: Types.ObjectId;

  @Prop()
  description: string;

  @Prop()
  isChangable: boolean;

  @Prop()
  paid: boolean;

  @Prop()
  price: number;
}

export const LessonSchema = SchemaFactory.createForClass(Lesson);

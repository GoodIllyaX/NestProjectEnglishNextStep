import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Group extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  level: string;

  @Prop({ enum: ['PAIR', 'INDIVIDUAL', 'GROUP'], required: true })
  groupType: string;

  @Prop({ enum: ['CHILDREN', 'ADULTS', 'BUSINESS'], required: true })
  courseType: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  students: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  instructors: Types.ObjectId[];

  @Prop()
  meetingLink: string;

  @Prop({ type: [{ time: String, day: String }] })
  schedule: { time: string; day: string }[];
}

export const GroupSchema = SchemaFactory.createForClass(Group);

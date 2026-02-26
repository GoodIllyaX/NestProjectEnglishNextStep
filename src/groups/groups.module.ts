import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Group, GroupSchema } from './schemas/group.schema';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [MongooseModule.forFeature([{ name: Group.name, schema: GroupSchema }]), AuthModule],
    controllers: [GroupsController],
    providers: [GroupsService],
})
export class GroupsModule {}
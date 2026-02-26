import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';
import { Group, GroupSchema } from '../groups/schemas/group.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: Group.name, schema: GroupSchema },
    ]), AuthModule],
    controllers: [UsersController],
    providers: [UsersService, AuthModule],
})
export class UsersModule {}
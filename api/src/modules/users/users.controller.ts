import { Body, Controller, Delete, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IDataMessage, IMessage, IUser } from '../../shared/interfaces';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private service: UsersService) {}

  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Post()
  create(@Body() createDto: CreateUserDto): Promise<IUser> {
    return this.service.create(createDto);
  }

  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Put(':id')
  update(@Param('id') id: number, @Body() updateDto: UpdateUserDto): Promise<IDataMessage<IUser>> {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<IMessage> {
    return this.service.remove(id);
  }
}

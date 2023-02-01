import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { PageDto } from '@common/abstract/dto/page.dto';
import { TranslationService } from '@common/translation/translation.service';
import { RoleType } from '@constants';
import { ApiPageOkResponse, Auth, AuthUser, UUIDParam } from '@decorators';
import { UseLanguageInterceptor } from '@interceptors/language-interceptor.service';
import { CreateUserNotificationTokenDto } from '@modules/user/dto/create-user-notification-token.dto';

import { UserDto } from './dto/user.dto';
import { UsersPageOptionsDto } from './dto/users-page-options.dto';
import { UserEntity } from './entities/user.entity';
import { UserService } from './user.service';

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly translationService: TranslationService
  ) {}

  @Get('admin')
  @Auth([RoleType.ADMIN])
  @HttpCode(HttpStatus.OK)
  @UseLanguageInterceptor()
  async admin(@AuthUser() user: UserEntity) {
    const translation = await this.translationService.translate(
      'admin.keywords.admin'
    );

    return {
      text: `${translation} ${user.firstName}`,
    };
  }

  @Get()
  @Auth([RoleType.USER])
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get users list',
    type: PageDto,
  })
  getUsers(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: UsersPageOptionsDto
  ): Promise<PageDto<UserDto>> {
    return this.userService.getUsers(pageOptionsDto);
  }

  @Get(':id')
  @Auth([RoleType.USER])
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get user',
    type: UserDto,
  })
  async getUser(@UUIDParam('id') userId: Uuid): Promise<UserDto> {
    const userEntity = await this.userService.getUser(userId);

    return userEntity.toDto();
  }

  @Post('/tokens')
  @Auth([])
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Create Token',
  })
  async createUserNotificationToken(
    @AuthUser() user: UserEntity,
    @Body() dto: CreateUserNotificationTokenDto
  ) {}
}

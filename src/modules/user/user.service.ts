/* eslint-disable @typescript-eslint/no-unsafe-argument */
import type { UpdateUserSettingsBo } from '@modules/user/bo/update-user-settings.bo';
import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import type { FindOptionsWhere } from 'typeorm';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional-cls-hooked';

import type { PageDto } from '@common/abstract/dto/page.dto';
import { AwsS3Service } from '@common/shared/services/aws-s3.service';
import { ValidatorService } from '@common/shared/services/validator.service';
import { FileNotImageException, UserNotFoundException } from '@exceptions';
import { IFile } from '@interfaces';
import { CreateUserDto } from '@modules/user/dto/create-user.dto';
import type { UpdateUserDto } from '@modules/user/dto/update-user.dto';

import type { CreateUserSettingsBo } from './bo/create-user-settings.bo';
import type { UserDto } from './dto/user.dto';
import type { UsersPageOptionsDto } from './dto/users-page-options.dto';
import { UserEntity } from './entities/user.entity';
import { UserRegisterDto } from '../auth/dto/user-register.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly validatorService: ValidatorService,
    private readonly awsS3Service: AwsS3Service,
    private readonly commandBus: CommandBus
  ) {}

  /**
   * @getUsers
   * @description will return a paginated response with  all the users
   * @param pageOptionsDto
   */
  async getUsers(
    pageOptionsDto: UsersPageOptionsDto
  ): Promise<PageDto<UserDto>> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    const [items, pageMetaDto] = await queryBuilder.paginate(pageOptionsDto);

    return items.toPageDto(pageMetaDto);
  }

  /**
   * @getUser
   * @description will return a user
   * @param userId
   */
  async getUser(userId: Uuid): Promise<UserEntity> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    queryBuilder.where('user.id = :userId', { userId });
    const userEntity = await queryBuilder.getOne();

    if (!userEntity) {
      throw new UserNotFoundException();
    }

    return userEntity;
  }

  /**
   * @findOne
   * @description finds a single user
   * @param findData
   */
  findOne(findData: FindOptionsWhere<UserEntity>): Promise<UserEntity | null> {
    return this.userRepository.findOneBy(findData);
  }

  /**
   * @findByUsernameOrEmail
   * @description finds a user by email or password
   * @param email
   */
  async findByUsernameOrEmail(email: string): Promise<UserEntity> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    if (email) {
      queryBuilder.orWhere('user.email = :email', {
        email,
      });
    }

    return queryBuilder.getOneOrFail();
  }

  /**
   * @CreateUser
   * @description create  a user
   * @param createUserDto
   * @param file
   */
  @Transactional()
  async createUser(
    createUserDto: CreateUserDto,
    file?: IFile
  ): Promise<UserEntity> {
    const user = this.userRepository.create(createUserDto);

    // todo
    //  if social media auth download image and upload it to server

    if (file && !this.validatorService.isImage(file.mimetype)) {
      throw new FileNotImageException();
    }

    if (file) {
      user.avatar = await this.awsS3Service.uploadImage(file);
    }

    await this.userRepository.save(user);

    return user;
  }

  /**
   * @upsertUser
   * @description creates or updates a user and his settings
   * @param userRegisterDto
   * @param file
   * @param userSettingsDto
   */
  @Transactional()
  async upsertUser(
    userRegisterDto: CreateUserDto,
    file?: IFile,
    userSettingsDto?: Partial<CreateUserSettingsBo>
  ): Promise<UserEntity> {
    const insertion = await this.userRepository
      .createQueryBuilder()
      .insert()
      .into(UserEntity)
      .values(userRegisterDto)
      .orUpdate(['first_name', 'last_name', 'avatar'], ['email'])
      .execute();

    return await this.findByUsernameOrEmail(userRegisterDto.email);
  }

  async updateUser(userId: string, updateUserBo: UpdateUserDto): Promise<void> {
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id: userId });

    const userEntity = await queryBuilder.getOne();

    if (!userEntity) {
      throw new UserNotFoundException();
    }

    this.userRepository.merge(userEntity, updateUserBo);

    await this.userRepository.save(updateUserBo);
  }
}

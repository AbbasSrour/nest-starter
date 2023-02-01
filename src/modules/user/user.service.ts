/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { FindOptionsWhere } from 'typeorm';
import { Repository } from 'typeorm';

import type { PageDto } from '@common/abstract/dto/page.dto';
import { AwsS3Service } from '@common/shared/services/aws-s3.service';
import { ValidatorService } from '@common/shared/services/validator.service';
import { FileNotImageException, UserNotFoundException } from '@exceptions';
import type { IFile } from '@interfaces';
import type { CreateUserDto } from '@modules/user/dto/create-user.dto';
import type { UpdateUserDto } from '@modules/user/dto/update-user.dto';

import type { UserDto } from './dto/user.dto';
import type { UsersPageOptionsDto } from './dto/users-page-options.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly validatorService: ValidatorService,
    private readonly awsS3Service: AwsS3Service
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
   * @findByEmail
   * @description finds a user by email or password
   * @param email
   */
  async findByEmail(email: string): Promise<UserEntity> {
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
  async createUser(
    createUserDto: Partial<UserEntity>,
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
   */
  async upsertUser(
    userRegisterDto: CreateUserDto,
    file?: IFile
  ): Promise<UserEntity> {
    void (await this.userRepository
      .createQueryBuilder()
      .insert()
      .into(UserEntity)
      .values(userRegisterDto)
      .orUpdate(['first_name', 'last_name', 'avatar'], ['email'])
      .execute());

    return this.findByEmail(userRegisterDto.email);
  }

  /**
   * @updateUser
   * @description updates the user entity
   * @param userId
   * @param updateUserDto
   */
  async updateUser(userId: Uuid, updateUserDto: UpdateUserDto): Promise<void> {
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id: userId });

    const userEntity = await queryBuilder.getOne();

    if (!userEntity) {
      throw new UserNotFoundException();
    }

    const user = this.userRepository.merge(userEntity, updateUserDto);

    await this.userRepository.save(user);
  }
}

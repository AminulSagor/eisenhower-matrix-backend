import { Controller, Post, Body, BadRequestException, UseGuards, Req, Put, UseInterceptors, UploadedFile, UsePipes, ValidationPipe, UnauthorizedException, Get, Param, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { Auth } from 'typeorm';

export class CreateUserDto {
  username: string;
  email: string;
  password: string;
  otp: string;
}

export class VerifyOtpDto {
  email: string;
  otp: string;
}

export class LoginDto {
  email: string;
  password: string;
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService,
  ) {
    
  }

  
  @Post('initiate-signup')
  async initiateSignUp(@Body() createUserDto: CreateUserDto): Promise<{ message: string }> {
    const { email } = createUserDto;
    if (!email) {
      throw new BadRequestException('Email is required');
    }
    await this.usersService.initiateSignUp(createUserDto);
    return { message: 'OTP has been sent to your email' };
  }

  @Post('verify-otp')
  async verifyOtpAndCreateUser(@Body() verifyOtpDto: VerifyOtpDto): Promise<AuthResponse> {
    const { email, otp } = verifyOtpDto;
    return await this.usersService.verifyOtpAndCreateUser(email, otp);
  }

  @Post('resend-otp')
  async resendOtp(@Body('email') email: string): Promise<{ message: string }> {
    if (!email) {
      throw new BadRequestException('Email is required');
    }
    await this.usersService.resendOtp(email);
    return { message: 'New OTP has been sent to your email' };
  }

  

}

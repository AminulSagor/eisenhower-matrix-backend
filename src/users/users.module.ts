import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtpService } from 'src/otp/otp.service';
import { OtpModule } from 'src/otp/otp.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { TokenBlacklist } from 'src/auth/TokenBlacklist.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([TokenBlacklist]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'secret-key',  
      signOptions: { expiresIn: '1000m' }, 
    }),
    TypeOrmModule.forFeature([User]),
    OtpModule,
  ],
  providers: [JwtStrategy,UsersService, OtpService],
  controllers: [UsersController],
  exports: [PassportModule, JwtStrategy,UsersService, TypeOrmModule],
})
export class UsersModule {}

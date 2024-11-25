import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtpService } from 'src/otp/otp.service';
import { OtpModule } from 'src/otp/otp.module';
import { JwtModule } from '@nestjs/jwt';


@Module({
  imports: [
    JwtModule.register({
      secret: 'secret-key',  
      signOptions: { expiresIn: '1000m' }, 
    }),
    TypeOrmModule.forFeature([User]),
    OtpModule,
  ],
  providers: [UsersService, OtpService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}

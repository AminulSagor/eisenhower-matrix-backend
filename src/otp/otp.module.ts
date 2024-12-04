import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { RedisModule } from '@nestjs-modules/ioredis';

@Module({
  imports: [
    RedisModule.forRoot({
      type: 'single', 
      url: process.env.REDIS_URL ? `${process.env.REDIS_URL}?family=0` : 'redis://default:yUITpgwBinuhnBixdNRtxoXzRcQgtFdZ@redis.railway.internal:6379?family=0', 
    }),
  ],
  providers: [OtpService],
  exports: [OtpService],
})
export class OtpModule {}

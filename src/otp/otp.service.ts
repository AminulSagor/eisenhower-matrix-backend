// src/otp/otp.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { randomBytes } from 'crypto';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Injectable()
export class OtpService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async generateOtp(email: string): Promise<string> {
    const otp = randomBytes(3).toString('hex'); 
    await this.redis.set(`otp:${email}`, otp, 'EX', 300);

    await this.sendOtpEmail(email, otp);
    return otp;
  }

  async validateOtp(email: string, otp: string): Promise<boolean> {
    const storedOtp = await this.redis.get(`otp:${email}`);
    if (storedOtp === otp) {
      await this.redis.del(`otp:${email}`); // Invalidate the OTP after verification
      return true;
    }
    return false;
  }

  private async sendOtpEmail(email: string, otp: string): Promise<void> {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'gardenaid29@gmail.com',
        pass: 'rjwhlucthgnjwmbm', // Use environment variables for security
      },
    });

    const mailOptions = {
      from: 'gardenaid29@gmail.com',
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}`,
    };

    await transporter.sendMail(mailOptions);
  }
}

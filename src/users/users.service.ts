import { Injectable, ConflictException, BadRequestException, NotFoundException, UnauthorizedException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { OtpService } from 'src/otp/otp.service';
import { CreateUserDto } from './users.controller';
import { JwtService } from '@nestjs/jwt';
import { TokenBlacklist } from 'src/auth/TokenBlacklist.entity';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(TokenBlacklist)
    private tokenBlacklistRepository: Repository<TokenBlacklist>,
    private readonly otpService: OtpService,
    private readonly jwtService: JwtService,
    

  ) {}

  async initiateSignUp(createUserDto: CreateUserDto): Promise<void> {
    const { email, username, password } = createUserDto;
    const user = await this.findByEmail(email);
    if (user && user.verified) {
      throw new ConflictException('Email already exists');
    }

    await this.otpService.generateOtp(email);
    await this.usersRepository.save({ email, username, password, verified: false })
    
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async verifyOtpAndCreateUser(email: string, otp: string): Promise<AuthResponse> {
    const isOtpValid = await this.otpService.validateOtp(email, otp);
    if (!isOtpValid) {
      throw new BadRequestException('Invalid OTP');
    }

    const userData = await this.usersRepository.findOne({ where: { email } });
    if (!userData) {
      throw new BadRequestException('User data not found');
    }
  await this.usersRepository.update(
    { email }, 
    { username: userData.username, email, password: userData.password, verified: true} 
  );

  const payload = { email: email,  sub: userData.id };
    const token = this.jwtService.sign(payload); 

    return { token };

  }


  async resendOtp(email: string): Promise<void> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.otpService.generateOtp(email);
    
  }


  async login(email: string, password: string): Promise<{ accessToken: string }> {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Email not found.');
    }

    if (password!=user.password) {
      throw new UnauthorizedException('Password not matched.');
    }

    const payload = { username: user.username, sub: user.id };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }

  async findById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async logout(token: string): Promise<void> {
    await this.blacklistToken(token);
  }

  async blacklistToken(token: string): Promise<void> {
    const blacklistedToken = this.tokenBlacklistRepository.create({ token });
    await this.tokenBlacklistRepository.save(blacklistedToken);
  }

  

}

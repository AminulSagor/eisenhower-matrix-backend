// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';
import { NotesModule } from './note/notes.module';
import { Note } from './note/note.entity';
import { TokenBlacklist } from './auth/TokenBlacklist.entity';
import { ConfigModule } from '@nestjs/config';
;

@Module({
  imports: [
    ConfigModule.forRoot(), 
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL, 
      entities: [User, Note, TokenBlacklist],
      synchronize: true, 
    }),
    UsersModule,
    NotesModule
  ],
})
export class AppModule {}

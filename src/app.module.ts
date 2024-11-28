// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';
import { NotesModule } from './note/notes.module';
import { Note } from './note/note.entity';
import { TokenBlacklist } from './auth/TokenBlacklist.entity';
;

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'abc456',
      database: process.env.DB_NAME || 'eisenhower',
      entities: [User,Note,TokenBlacklist],
      synchronize: true,
    }),
    UsersModule,
    NotesModule
  ],
})
export class AppModule {}

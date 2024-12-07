// src/notes/notes.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNoteDto } from './dto/create-note.dto';
import { Note } from './note.entity';
import { User } from 'src/users/user.entity';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private notesRepository: Repository<Note>,

    @InjectRepository(User)
    private usersRepository: Repository<User>, 
  ) {}

  async create(createNoteDto: CreateNoteDto, userId: number): Promise<Note> {
    const user = await this.usersRepository.findOne({
      where: { id: userId }, 
    });
    if (!user) {
      throw new Error('User not found');
    }
    const note = this.notesRepository.create({
      ...createNoteDto,  
      user,
    });
    return await this.notesRepository.save(note);
  }

  async findAllByUser(userId: number): Promise<Note[]> {
    return await this.notesRepository.find({
      where: { user: { id: userId } },
      relations: ['user'], 
    });
  }

  

  async deleteNoteById(id: string): Promise<boolean> {
    const result = await this.notesRepository.delete(id);
    return result.affected > 0;
  }

  async updateNoteById(id: string, updateNoteDto: CreateNoteDto): Promise<Note | null> {
    const note = await this.notesRepository.findOneBy({ id });
    if (!note) {
      return null; // Note not found
    }

    // Merge existing note with new updates
    const updatedNote = this.notesRepository.merge(note, updateNoteDto);
    return await this.notesRepository.save(updatedNote);
  }


  async findNoteById(id: string): Promise<Note | null> {
    return await this.notesRepository.findOneBy({ id });
  }

  
}

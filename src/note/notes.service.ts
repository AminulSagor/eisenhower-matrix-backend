// src/notes/notes.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNoteDto } from './dto/create-note.dto';
import { Note } from './note.entity';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private notesRepository: Repository<Note>,
  ) {}

  async create(createNoteDto: CreateNoteDto): Promise<Note> {
    const note = this.notesRepository.create(createNoteDto);
    return await this.notesRepository.save(note);
  }

  async findAll(): Promise<Note[]> {
    return await this.notesRepository.find();
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

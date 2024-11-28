// src/notes/notes.controller.ts
import { Controller, Post, Body, Get, UseGuards, Delete, Param, HttpException, HttpStatus, Put, NotFoundException } from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { Note } from './note.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}
  
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createNoteDto: CreateNoteDto): Promise<Note> {
    return this.notesService.create(createNoteDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<Note[]> {
    return this.notesService.findAll();
  }


  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteNoteById(@Param('id') id: string): Promise<{ message: string }> {
    const deleted = await this.notesService.deleteNoteById(id);
    if (!deleted) {
      throw new HttpException('Note not found', HttpStatus.NOT_FOUND);
    }
    return { message: 'Note deleted successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateNote(
    @Param('id') id: string,
    @Body() updateNoteDto: CreateNoteDto,
  ) {
    const updatedNote = await this.notesService.updateNoteById(id, updateNoteDto);
    if (!updatedNote) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }
    return updatedNote;
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findNoteById(@Param('id') id: string) {
    const note = await this.notesService.findNoteById(id);
    if (!note) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }
    return note;
  }
}

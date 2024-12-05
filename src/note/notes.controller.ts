// src/notes/notes.controller.ts
import { Controller, Post, Body, Get, UseGuards, Delete, Param, HttpException, HttpStatus, Put, NotFoundException, Req } from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { Note } from './note.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}
  
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Req() request,@Body() createNoteDto: CreateNoteDto): Promise<Note> {
    const userId = request.user.id; 
    return this.notesService.create(createNoteDto,userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Req() request): Promise<Note[]> {
    const userId = request.user.id; 
    return this.notesService.findAllByUser(userId);
  }

  @UseGuards(JwtAuthGuard)
@Get('filter')
async findNotesByType(@Req() request,@Param() query: { type: string }): Promise<Note[]> {
  const userId = request.user.id;

  const { type } = query;

  if (!type) {
    throw new HttpException('Type is required', HttpStatus.BAD_REQUEST);
  }

  const validTypes = [
    'Important and urgent',
    'Important and not urgent',
    'Not important and urgent',
    'Not important and not urgent',
  ];

  if (!validTypes.includes(type)) {
    throw new HttpException('Invalid type', HttpStatus.BAD_REQUEST);
  }

  return this.notesService.findNotesByType(userId, type);
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

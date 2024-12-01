import { Note } from 'src/note/note.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: false }) 
  verified: boolean;

  @OneToMany(() => Note, (note) => note.user)
  notes: Note[];
}

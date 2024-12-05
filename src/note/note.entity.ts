import { User } from 'src/users/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Note {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  type: string;

  @Column()
  createdAt: string; 

  @ManyToOne(() => User, (user) => user.notes, { onDelete: 'CASCADE' }) 
  user: User;
}

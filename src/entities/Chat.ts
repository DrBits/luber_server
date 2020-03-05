import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  Column,
  OneToOne
} from 'typeorm';

import Message from './Message';
import User from './User';
import Ride from './Ride';

@Entity()
class Chat extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;

  @OneToMany(
    () => Message,
    message => message.chat
  )
  messages: Message[];

  @Column({ nullable: true })
  passengerId: number;

  @Column({ nullable: true })
  driverId: number;

  @Column({ nullable: true })
  rideId: number;

  @OneToOne(
    _ => Ride,
    ride => ride.chat
  )
  ride: Ride;

  @ManyToOne(
    () => User,
    user => user.chatsAsPassenger
  )
  passenger: User;

  @ManyToOne(
    () => User,
    user => user.chatsAsDriver
  )
  driver: User;

  @CreateDateColumn() createdAt: string;
  @UpdateDateColumn() updatedAt: string;
}

export default Chat;

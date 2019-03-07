import { BeforeInsert, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger';

@Entity()
@Unique(['email'])
export class User {

  @ApiModelProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiModelProperty()
  @Column()
  firstName: string;

  @ApiModelProperty()
  @Column()
  lastName: string;

  @ApiModelProperty()
  @Column()
  email: string;

  @ApiModelProperty()
  @Column()
  password: string;

  @ApiModelProperty()
  @Column({ nullable: true })
  ethWalletAddress: string;

  @Column({ select: false, nullable: true })
  passwordResetToken: string;

  @Column({ select: false, nullable: true })
  passwordResetExpires: Date;

  @ApiModelProperty()
  @CreateDateColumn()
  createdDate: Date;

  @ApiModelProperty()
  @UpdateDateColumn()
  updatedDate: Date;

}

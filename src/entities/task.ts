import {Entity, Column, PrimaryGeneratedColumn} from "typeorm";

@Entity("task")
export class taskEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    title: string;
    @Column()
    description: string;
    @Column()
    state:string;
    @Column()
    prioritylevel: number;
    @Column()
    dateOfCompletion:Date;
}
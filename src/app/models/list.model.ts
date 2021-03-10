import { ListItem } from './list-item.model';


export class List {
    id: number;
    title: string;
    created_at: Date;
    finished_at: Date;
    finished: boolean;
    items: ListItem[];

    constructor( titulo: string ) {
        this.title = titulo;
        this.created_at = new Date();
        this.finished = false;
        this.items = [];
        this.id = new Date().getTime();
    }
}
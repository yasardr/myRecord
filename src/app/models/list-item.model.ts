export class ListItem {
    name: string;
    money: number;
    completed: boolean;

    constructor( name: string, money: number) {
        this.name = name;
        this.money = money;
        this.completed = false;
    }
}
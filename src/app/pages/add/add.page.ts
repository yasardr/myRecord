import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecordService } from '../../services/record.service';
import { List } from '../../models/list.model';
import { ListItem } from '../../models/list-item.model';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
})
export class AddPage implements OnInit {

  list: List;
  nameItem = '';
  moneyItem = null;

  constructor(
    private recordService: RecordService,
    private route: ActivatedRoute,
    public alertController: AlertController
  ) {
    const listId = this.route.snapshot.paramMap.get('listId');
    this.list = this.recordService.getList(listId);
  }

  ngOnInit() {
  }

  addItem() {
    if (this.nameItem.length === 0 || this.moneyItem === null || this.moneyItem <= 0) {
      return;
    }
    const newItem = new ListItem(this.nameItem, this.moneyItem);
    this.list.items.push(newItem);
    this.list.total += this.moneyItem;
    this.nameItem = '';
    this.moneyItem = null;
    this.recordService.saveStorage();
  }

  changeCheck(item: ListItem) {
    const pending = this.list.items
                          .filter(itemData => !itemData.completed)
                          .length;
    if (pending === 0) {
      this.list.finished_at = new Date();
      this.list.finished = true;
    } else {
      this.list.finished_at = null;
      this.list.finished = false;
    }

    this.recordService.saveStorage();
  }

  deleteItem(i: number) {
    this.list.total -= this.list.items[i].money;
    this.list.items.splice(i, 1);
    this.recordService.saveStorage();
  }

}

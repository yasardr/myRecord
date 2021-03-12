import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { RecordService } from '../../services/record.service';
import { List } from '../../models/list.model';
import { Router } from '@angular/router';
import { AlertController, IonList } from '@ionic/angular';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {

  @ViewChild(IonList) list: IonList;
  @Input() total = true;

  constructor(
    public recordService: RecordService,
    private router: Router,
    public alertController: AlertController
  ) { }

  ngOnInit() {}

  openList(list: List) {
    if ( this.total ) {
      this.router.navigateByUrl(`/tabs/tab2/add/${list.id}`);
    } else {
      this.router.navigateByUrl(`/tabs/tab1/add/${list.id}`);
    }
  }

  deleteList(list:List) {
    this.recordService.deleteList(list);
  }

  async changeTitle(list:List) {
    const alert = await this.alertController.create({
      header: 'Editar nombre',
      inputs: [
        {
          name: 'title',
          type: 'text',
          value: list.title,
          placeholder: 'Nombre de la lista'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancelar');
            this.list.closeSlidingItems();
          }
        },
        {
          text: 'Actualizar',
          handler: data => {
            if (data.title.length === 0) {
              return;
            }
            list.title = data.title;
            this.recordService.saveStorage();
            this.list.closeSlidingItems();
          }
        }
      ]
    });

    alert.present();
  }

}

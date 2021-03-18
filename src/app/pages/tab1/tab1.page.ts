import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ActionSheetController, LoadingController } from '@ionic/angular';
import { RecordService } from '../../services/record.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  user: string;

  constructor(
    private recordService: RecordService,
    private router: Router,
    public alertController: AlertController,
    public actionSheetController: ActionSheetController,
    public loadingController: LoadingController
  ) {
    this.user = this.recordService.user;
    if (this.user === '') {
      this.selectUser();
    } else {
      this.recordService.loadStorage();
    }
  }

  async selectUser() {
    const alert = await this.alertController.create({
      header: 'Usuario',
      message: 'Selecciona quien esta creando registros.',
      inputs: [
        {
          name: 'user',
          type: 'radio',
          label: 'Raúl',
          value: 'raul',
          checked: true
        },
        {
          name: 'user',
          type: 'radio',
          label: 'Ángel',
          value: 'angel'
        },
        {
          name: 'user',
          type: 'radio',
          label: 'Yael',
          value: 'yael'
        },
        {
          name: 'user',
          type: 'radio',
          label: 'Yoav',
          value: 'yoav'
        },
        {
          name: 'user',
          type: 'radio',
          label: 'Jazmín',
          value: 'jazmin'
        },
        {
          name: 'user',
          type: 'radio',
          label: 'Alicia',
          value: 'alicia'
        }
      ],
      buttons: [
        {
          text: 'Ingresar',
          handler: data => {
            this.recordService.saveUser(data);
            this.user = this.recordService.user;
          }
        }
      ]
    });

    alert.present();
  }

  async addList() {
    const date = new Date();

    const alert = await this.alertController.create({
      header: 'Nueva lista',
      inputs: [
        {
          name: 'title',
          type: 'text',
          placeholder: 'Nombre de la lista',
          value: `${date.getMonth()+1}-${date.getDate()}-${date.getFullYear()}`
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Crear',
          handler: data => {
            if (data.title.length === 0) {
              return;
            }
            const listId = this.recordService.createList(data.title);
            this.router.navigateByUrl(`/tabs/tab1/add/${listId}`);
          }
        }
      ]
    });

    alert.present();
  }

  async openOptionsTab1() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Opciones',
      buttons: [{
        text: 'Cambiar de usuario',
        handler: () => {
          this.changeUser();
        }
      }, {
        text: 'Obtener respaldo',
        handler: () => {
          this.getBackUp();
        }
      }, {
        text: 'Respaldar información',
        handler: () => {
          /*Verificar si no ha cambiado nada entonces no hacer nada 
            y posteriormente solicitar pasword para realizar la acción
          */
          this.presentLoading();
        }
      }, {
        text: 'Cancelar',
        role: 'cancel',
      }]
    });
    actionSheet.present();
  }

  async getBackUp() {
    const alert = await this.alertController.create({
      header: 'Clave Usuario',
      inputs: [
        {
          name: 'keyCode',
          type: 'password',
          placeholder: 'Clave'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Obtener',
          handler: data => {
            if (data.keyCode.length === 0) {
              this.recordService.messageResponse('Ingresa una contraseña');
              return;
            }
            if (data.keyCode === `Medicina${this.recordService.user}`) {
              this.recordService.loadStorageFirebase();
              this.recordService.messageResponse('Respaldo obtenido');
            } else {
              this.recordService.messageResponse('Contraseña incorrecta');
            }
          }
        }
      ]
    });

    alert.present();
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Espera por favor...',
      duration: 1000
    });
    loading.present();
    this.recordService.backUpStorage();
  }

  async changeUser() {
    const alert = await this.alertController.create({
      header: 'Clave Maestra',
      inputs: [
        {
          name: 'keyCode',
          type: 'password',
          placeholder: 'Clave'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Cambiar',
          handler: data => {
            if (data.keyCode.length === 0) {
              this.recordService.messageResponse('Ingresa una contraseña');
              return;
            }
            if (data.keyCode === "Medicina2021!") {
              this.selectUser();
            } else {
              this.recordService.messageResponse('Contraseña incorrecta');
            }
          }
        }
      ]
    });

    alert.present();
  }

}

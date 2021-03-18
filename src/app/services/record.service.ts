import { Injectable } from '@angular/core';
import { List } from '../models/list.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { AlertController } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class RecordService {

  list: List[] = [];
  user: string;

  constructor(private firestore: AngularFirestore,
              private alertController: AlertController
  ) {
    this.loadUser();
  }

  loadUser() {
    if (localStorage.getItem('user')) {
      this.user = JSON.parse( localStorage.getItem('user') );
    } else {
      this.user = '';
    }
  }

  saveUser(user: string) {
    this.user = user;
    localStorage.setItem('user', JSON.stringify(user));
    this.list = [];
    this.saveStorage();
  }

  createList( title: string ) {
    const newList = new List(title);
    this.list.push(newList);
    this.saveStorage();
    return newList.id;
  }

  deleteList( list: List ) {
    this.list = this.list.filter( listData => listData.id !== list.id);
    this.saveStorage();
  }

  getList( id:string | number ) {
    id = Number(id);
    return this.list.find( listData => listData.id === id );
  }

  saveStorage() {
    localStorage.setItem('data', JSON.stringify(this.list));
  }

  backUpStorage() {
    this.firestore.collection(this.user).doc("data").set({
      data: JSON.stringify(this.list)
    })
    .then((docRef) => {
      console.log("Document update");
      this.messageResponse('Respaldo exitoso');
    })
    .catch((error) => {
      console.error("Error updating document: ", error);
      this.messageResponse(`Eror ${error}`);
    });
  }

  async messageResponse(mess: string) {
    const alert = await this.alertController.create({
      header: 'Respuesta',
      message: mess,
      buttons: ['OK']
    });

    alert.present();
  }

  loadStorage() {
    if (localStorage.getItem('data')) {
      this.list = JSON.parse( localStorage.getItem('data') );
    }
  }

  loadStorageFirebase() {
    this.firestore.collection(this.user).snapshotChanges().subscribe((data) => {
      data.forEach((doc) => {
        var data = doc.payload.doc.data();
        if (data['data']) {
          this.list = JSON.parse( data['data'] );
          this.saveStorage();
        }
      });
    });
  }
}

import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/firestore'; 

import { Observable, Subject } from 'rxjs';
import { map, take } from 'rxjs/operators';

export interface Plato {
  ID?: string;
  nombre: string;
  precio: number;
  descripcion: string;
  imagen: string;
}

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private platos: Observable<any[]>;
  private platosCollection: AngularFirestoreCollection<Plato>;
  constructor(private afs: AngularFirestore) {
    this.platosCollection = this.afs.collection<any>('menu');
    this.platos = this.platosCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
		      const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
	);
  }

  getMenu(id: string): Observable<any[]> {
		this.platosCollection = this.afs.collection<any>(id, ref => ref.orderBy('precio', 'asc'));
		this.platos = this.platosCollection.snapshotChanges().pipe(
		  map(actions => {
			return actions.map(a => {
			  const data = a.payload.doc.data();
			  const id = a.payload.doc.id;
			  return { id, ...data };
			});
		  })
		);
		return this.platos;
		  
  }

  getPlato(id: string): Observable<any> {
    return this.platosCollection.doc<any>(id).collection(id)
    .snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }
}
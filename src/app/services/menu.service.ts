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
  private opcionesPago: Observable<any[]>;
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

  getCategorias(): Observable<any[]> {
		this.platosCollection = this.afs.collection<any>('categorias', ref => ref.orderBy('order', 'asc'));
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

  getMenuDetail(categoryID, id: string): Observable<any> {
    return this.afs.collection<any>(categoryID).doc<any>(id).collection('opciones', ref => ref.orderBy('precio', 'asc'))
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

  getOpcionesPago(): Observable<any[]> {
		this.platosCollection = this.afs.collection<any>('formasPago', ref => ref.orderBy('order', 'asc'));
		this.opcionesPago = this.platosCollection.snapshotChanges().pipe(
		  map(actions => {
			return actions.map(a => {
			  const data = a.payload.doc.data();
			  const id = a.payload.doc.id;
			  return { id, ...data };
			});
		  })
		);
		return this.opcionesPago;
  }

  registrarPedido(pedido){
    return this.afs.collection<any>('pedidos').add(pedido);
  }

  getPedidoDetail(pedidoID): Observable<any> {
    return this.afs.collection<any>('pedidos').doc<any>(pedidoID).snapshotChanges();
  }
}
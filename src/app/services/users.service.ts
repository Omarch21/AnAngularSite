import { Injectable } from '@angular/core';
import {
  collection,
  doc,
  docData,
  Firestore,
  getDoc,
  setDoc,
  updateDoc,addDoc, collectionData
} from '@angular/fire/firestore';

import { filter, from, map, Observable, of, switchMap } from 'rxjs';
import { ProfileUser } from '../models/user';
import { AuthService } from './auth.service';
import { Expenditure } from '../models/expenditure.model'

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private firestore: Firestore, private authService: AuthService) {}
  //private userCollection = this.firestore.collection('users');

  get currentUserProfile$(): Observable<ProfileUser | null> {
    return this.authService.currentUser$.pipe(
      switchMap((user) => {
        if (!user?.uid) {
          return of(null);
        }

        const ref = doc(this.firestore, 'users', user?.uid);
        return docData(ref) as Observable<ProfileUser>;
      })
    );
  }
  async addExpenditures(userId: string, expenditures: Expenditure[]): Promise<void> {
    const userDoc = doc(this.firestore, 'users', userId);
    console.log('Adding expenditures', userId, expenditures);
    const expendituresCollection = collection(userDoc, 'expenditures');
    const addOperations = expenditures.map(expenditure => addDoc(expendituresCollection, expenditure));
    return Promise.all(addOperations).then(() => {});
  }
  getExpenditures(): Observable<Expenditure[] | null> {
    return this.authService.currentUser$.pipe(
      switchMap((user) => {
        if (!user?.uid) {
          return of(null);
        }

        const ref = collection(this.firestore, 'users', user?.uid, 'expenditures');
        return collectionData(ref) as Observable<Expenditure[] | null>;
      })
    );
  }
  addUser(user: ProfileUser): Observable<void> {
    const ref = doc(this.firestore, 'users', user.uid);
    return from(setDoc(ref, user));
  }

  updateUser(user: ProfileUser): Observable<void> {
    const ref = doc(this.firestore, 'users', user.uid);
    return from(updateDoc(ref, { ...user }));
  }
}

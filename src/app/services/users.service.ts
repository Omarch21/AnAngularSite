import { Injectable } from '@angular/core';
import {
  collection,
  doc,
  docData,
  Firestore,
  getDoc,
  setDoc,
  updateDoc,addDoc, collectionData,deleteDoc
} from '@angular/fire/firestore';
import { fromRef } from '@angular/fire/firestore';

import { filter, from, map, Observable, of, switchMap } from 'rxjs';
import { ProfileUser } from '../models/user';
import { AuthService } from './auth.service';
import { Expenditure } from '../models/expenditure.model'
import { DatePipe } from '@angular/common';
import { CalendarEvent } from '../models/calendarEvent.model';
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
    const addOperations = expenditures.map(expenditure => {
      const expenditureId = expenditure.id;
      const expenditureDoc = doc(expendituresCollection, expenditureId);
      return setDoc(expenditureDoc, expenditure);
    });
    return Promise.all(addOperations).then(() => {});
  }
  addEvent(userId: string, event: CalendarEvent): Observable<void> {
    const userDoc = doc(this.firestore, 'users', userId);
    console.log('Adding event', userId, event);
    const expendituresCollection = collection(userDoc, 'events');
    
      const eventId = event.id;
      const eventDoc = doc(expendituresCollection, eventId);
      return from(setDoc(eventDoc, event));
  
  }
  editExpenditure(userId: string, expenditureId: string, updatedExpenditure: Partial<Expenditure>): Observable<void> {
    const expenditureDoc = doc(this.firestore, 'users', userId, 'expenditures', expenditureId);
    return from(updateDoc(expenditureDoc, updatedExpenditure));
  }
  editEvent(userId: string, eventId: string, updatedEvent: Partial<CalendarEvent>): Observable<void> {
    const eventDoc = doc(this.firestore, 'users', userId, 'events', eventId);
    return from(updateDoc(eventDoc, updatedEvent));
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
  getEvents(): Observable<Event[] | null> {
    return this.authService.currentUser$.pipe(
      switchMap((user) => {
        if (!user?.uid) {
          return of(null);
        }

        const ref = collection(this.firestore, 'users', user?.uid, 'events');
        return collectionData(ref) as Observable<Event[] | null>;
      })
    );
  }
  getExpenditureById(expenditureid: string): Observable<Expenditure> {
    return this.authService.currentUser$.pipe(
      switchMap(user => {
        if (!user?.uid) {
          throw new Error('User is not authenticated.');
        }
  
        const ref = doc(this.firestore, `users/${user.uid}/expenditures/${expenditureid}`);
        return fromRef(ref).pipe(
          map(doc => {
            if (doc.exists()) {
              const data = doc.data() as Expenditure;
              return { ...data, id: doc.id };
            } else {
              throw new Error(`Expenditure with ID ${expenditureid} does not exist for user ${user.uid}.`);
            }
          })
        );
      })
    );
  }
  getEventById(eventid: string): Observable<CalendarEvent> {
    return this.authService.currentUser$.pipe(
      switchMap(user => {
        if (!user?.uid) {
          throw new Error('User is not authenticated.');
        }
  
        const ref = doc(this.firestore, `users/${user.uid}/events/${eventid}`);
        return fromRef(ref).pipe(
          map(doc => {
            if (doc.exists()) {
              const data = doc.data() as CalendarEvent;
              return { ...data, id: doc.id };
            } else {
              throw new Error(`Expenditure with ID ${eventid} does not exist for user ${user.uid}.`);
            }
          })
        );
      })
    );
  }
  updateExpenditure(expenditureId: string, updatedData: Partial<Expenditure>): Observable<void> {
     return this.authService.currentUser$.pipe(
      switchMap((user) => {
        if (!user?.uid) {
          throw new Error('User is not authenticated.');
        }

        const ref = doc(this.firestore, 'users', user?.uid, 'expenditures', expenditureId);
        return from(updateDoc(ref, updatedData));
      })
    );
  }
  async deleteExpenditure(userId: string, expenditureId: string): Promise<void> {
    const userDoc = doc(this.firestore, 'users', userId);
    const expenditureDoc = doc(collection(userDoc, 'expenditures'), expenditureId);
    await deleteDoc(expenditureDoc);
    console.log('Expenditure deleted successfully');
  }
  async deleteEvent(userId: string, eventid: string): Promise<void> {
    const userDoc = doc(this.firestore, 'users', userId);
    const eventDoc = doc(collection(userDoc, 'events'), eventid);
    await deleteDoc(eventDoc);
    console.log('event deleted successfully');
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

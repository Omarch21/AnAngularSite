import { Injectable } from '@angular/core';
import {
  collection,
  getDocs,
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
import { Goal } from '../models/goal.model';
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
          console.log('error');
          return of(null);
     
        }

        const ref = collection(this.firestore, 'users', user?.uid, 'expenditures');
        return collectionData(ref) as Observable<Expenditure[] | null>;
      })
    );
  }
  getEvents(): Observable<CalendarEvent[] | null> {
    return this.authService.currentUser$.pipe(
      switchMap((user) => {
        if (!user?.uid) {
          return of(null);
        }

        const ref = collection(this.firestore, 'users', user?.uid, 'events');
        return collectionData(ref) as Observable<CalendarEvent[] | null>;
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
  async getExpenditureTotal(userid: string){
    const expendituretotalref = collection(this.firestore, 'users',userid,'expenditures');
    const snapshot = await getDocs(expendituretotalref);
    const amount = snapshot.docs.reduce((total,doc) => total+ doc.data()['Amount'] ,0);
    return amount;
}

addGoal(userId: string, goal: Goal): Observable<void> {
  const userDoc = doc(this.firestore, 'users', userId);
  console.log('Adding Goal', userId, goal);
  const goalCollection = collection(userDoc, 'goals');
  
    const goalId = goal.id;
    const goalDoc = doc(goalCollection, goalId);
    return from(setDoc(goalDoc, goal));

}
getGoals(): Observable<Goal[] | null> {
  return this.authService.currentUser$.pipe(
    switchMap((user) => {
      if (!user?.uid) {
        console.log('error');
        return of(null);
   
      }

      const ref = collection(this.firestore, 'users', user?.uid, 'goals');
      return collectionData(ref) as Observable<Goal[] | null>;
    })
  );
}
getGoalById(goalid: string): Observable<Goal> {
  return this.authService.currentUser$.pipe(
    switchMap(user => {
      if (!user?.uid) {
        throw new Error('User is not authenticated.');
      }

      const ref = doc(this.firestore, `users/${user.uid}/goals/${goalid}`);
      return fromRef(ref).pipe(
        map(doc => {
          if (doc.exists()) {
            const data = doc.data() as Goal;
            return { ...data, id: doc.id };
          } else {
            throw new Error(`Expenditure with ID ${goalid} does not exist for user ${user.uid}.`);
          }
        })
      );
    })
  );
}
editGoal(userId: string, goalId: string, updatedgoal: Partial<Goal>): Observable<void> {
  const goalDoc = doc(this.firestore, 'users', userId, 'goals', goalId);
  return from(updateDoc(goalDoc, updatedgoal));
}
async deleteGoal(userId: string, goalId: string): Promise<void> {
  const userDoc = doc(this.firestore, 'users', userId);
  const goalDoc = doc(collection(userDoc, 'goals'), goalId);
  await deleteDoc(goalDoc);
  console.log('Goal deleted successfully');
}

accomplishGoal(userId: string, goal: Goal): Observable<void> {
  const goalDoc = doc(this.firestore, 'users', userId, 'goals', goal.id);
  const accomplishcollection = collection(this.firestore,'users',userId, 'accomplishments')
  const newdoc = doc(accomplishcollection, goal.id);

  deleteDoc(goalDoc);
  return from(setDoc(newdoc,goal));
}
getAccomplishments(): Observable<Goal[] | null> {
  return this.authService.currentUser$.pipe(
    switchMap((user) => {
      if (!user?.uid) {
        console.log('error');
        return of(null);
   
      }

      const ref = collection(this.firestore, 'users', user?.uid, 'accomplishments');
      return collectionData(ref) as Observable<Goal[] | null>;
    })
  );
}
getAccomplishmentById(accomplishmentid: string): Observable<Goal> {
  return this.authService.currentUser$.pipe(
    switchMap(user => {
      if (!user?.uid) {
        throw new Error('User is not authenticated.');
      }

      const ref = doc(this.firestore, `users/${user.uid}/accomplishments/${accomplishmentid}`);
      return fromRef(ref).pipe(
        map(doc => {
          if (doc.exists()) {
            const data = doc.data() as Goal;
            return { ...data, id: doc.id };
          } else {
            throw new Error(`Accomplishment with ID ${accomplishmentid} does not exist for user ${user.uid}.`);
          }
        })
      );
    })
  );
}
editAccomplishment(userId: string, accomplishmentId: string, accomplishment: Partial<Goal>): Observable<void> {
  const goalDoc = doc(this.firestore, 'users', userId, 'accomplishments', accomplishmentId);
  return from(updateDoc(goalDoc, accomplishment));
}
async deleteAccomplishment(userId: string, accomplishmentId: string): Promise<void> {
  const userDoc = doc(this.firestore, 'users', userId);
  const accomplishmentDoc = doc(collection(userDoc, 'accomplishments'), accomplishmentId);
  await deleteDoc(accomplishmentDoc);
  console.log('Accomplishment deleted successfully');
}
}

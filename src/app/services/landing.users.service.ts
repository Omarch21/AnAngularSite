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
@Injectable({
  providedIn: 'root',
})
export class LandingUsersService {
  constructor(private firestore: Firestore, private authService: AuthService) {}

  async getExpenditureTotal(userid: string){
    const expendituretotalref = collection(this.firestore, 'users',userid,'expenditures');
    const snapshot = await getDocs(expendituretotalref);
    const amount = snapshot.docs.reduce((total,doc) => total+ doc.data()['Amount'] ,0);
    return amount;
}
}
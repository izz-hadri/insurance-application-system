import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';

import { MedicalStatus } from '../dtos/responses/medical-status.dto';

import firebase from 'firebase';
import { formatDate } from '@angular/common';
import { Applicant } from '../dtos/responses/applicant.dto';
import { Applicant_MedicalStatus } from '../dtos/responses/applicant-medical-status.dto';
import { DataSnapshot } from '@angular/fire/database/interfaces';
import { About } from '../dtos/responses/about.dto';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  isLoggedIn = false

  medicalStatus: AngularFireList<MedicalStatus>;
  medicalStatusDetails: AngularFireObject<MedicalStatus>;

  applicant: AngularFireList<Applicant>;
  applicantDetails: AngularFireObject<Applicant>;

  applicant_medicalStatus: AngularFireList<Applicant_MedicalStatus>;
  applicant_medicalStatusDetails: AngularFireObject<Applicant_MedicalStatus>;
  applicant_medicalStatusList: Applicant[] = [];

  about: AngularFireList<About>;
  aboutDetails: AngularFireObject<About>;

  constructor(public firebaseAuth: AngularFireAuth, private angularFireDatabase: AngularFireDatabase) { }

  // ---------------------------- AUTHENTICATION ----------------------------

  async signin(email: string, password: string) {
    await this.firebaseAuth.signInWithEmailAndPassword(email, password)
      .then(res => {
        this.isLoggedIn = true;
        localStorage.setItem('user', JSON.stringify(res.user));
        localStorage.setItem('email', email);
      })
  }

  signout() {
    this.firebaseAuth.signOut()
    localStorage.removeItem('user');
    localStorage.removeItem('email')
  }

  // ---------------------------- MEDICAL STATUS ----------------------------

  medicalStatus_getAll(): AngularFireList<MedicalStatus> {
    this.medicalStatus = this.angularFireDatabase.list('/medical-status') as AngularFireList<MedicalStatus>;
    return this.medicalStatus;
  }

  medicalStatus_getById(key: string): AngularFireObject<MedicalStatus> {
    this.medicalStatusDetails = this.angularFireDatabase.object('/medical-status/' + key) as AngularFireObject<MedicalStatus>;
    return this.medicalStatusDetails;
  }

  medicalStatus_create(medicalStatus: MedicalStatus): firebase.database.ThenableReference {
    const now = formatDate(new Date(), 'HH:mm:ss dd/MM/yyyy', 'en-US');
    const medicalStatusObj = {
      specialisation: medicalStatus.specialisation,
      category: medicalStatus.category,
      status: medicalStatus.status,
      description: medicalStatus.description,
      limit250k: medicalStatus.limit250k,
      limit500k: medicalStatus.limit500k,
      limit1m: medicalStatus.limit1m,
      limit1p5m: medicalStatus.limit1p5m,
      limit2m: medicalStatus.limit2m,
      limit3m: medicalStatus.limit3m,
      limit5m: medicalStatus.limit5m,
      createdAt: medicalStatus.createdAt != null ? medicalStatus.createdAt : now,
      updatedAt: medicalStatus.updatedAt != null ? medicalStatus.updatedAt : now,
    };

    if (this.medicalStatus == null) {
      return this.angularFireDatabase.database.ref('/medical-status').push(medicalStatusObj);
    } else {
      return this.medicalStatus.push(medicalStatusObj);
    }
  }

  medicalStatus_update(medicalStatus: MedicalStatus): Promise<void> {
    const now = formatDate(new Date(), 'HH:mm:ss dd/MM/yyyy', 'en-US');
    if (this.medicalStatus == null) {
      const reference = this.angularFireDatabase.database.ref('/medical-status/' + medicalStatus.$key);
      delete medicalStatus.$key; // You should delete this otherwise the update call will fail
      return reference.update({
        ...medicalStatus,
        updatedAt: now
      });
    } else {
      return this.medicalStatus.update(medicalStatus.$key, {
        specialisation: medicalStatus.specialisation,
        category: medicalStatus.category,
        status: medicalStatus.status,
        description: medicalStatus.description,
        limit250k: medicalStatus.limit250k,
        limit500k: medicalStatus.limit500k,
        limit1m: medicalStatus.limit1m,
        limit1p5m: medicalStatus.limit1p5m,
        limit2m: medicalStatus.limit2m,
        limit3m: medicalStatus.limit3m,
        limit5m: medicalStatus.limit5m,

        createdAt: medicalStatus.createdAt,
        updatedAt: now
      });
    }
  }

  medicalStatus_deleteById(key: string): Promise<void> {
    if (this.medicalStatus == null) {
      return this.angularFireDatabase.database.ref('/medical-status/' + key).remove();
    } else {
      return this.medicalStatus.remove(key);
    }
  }

  // ---------------------------- APPLICANT ----------------------------

  applicant_getAll(): AngularFireList<Applicant> {
    this.applicant = this.angularFireDatabase.list('/applicant') as AngularFireList<Applicant>;
    return this.applicant;
  }

  applicant_getById(key: string): AngularFireObject<Applicant> {
    this.applicantDetails = this.angularFireDatabase.object('/applicant/' + key) as AngularFireObject<Applicant>;
    return this.applicantDetails;
  }

  applicant_create(applicant: Applicant): firebase.database.ThenableReference {
    const now = formatDate(new Date(), 'HH:mm:ss dd/MM/yyyy', 'en-US');
    const applicantObj = {
      dateFrom: applicant.dateFrom,
      dateTo: applicant.dateTo,

      limit: applicant.limit,
      // limit2: applicant.limit2,

      dateRetroactive: applicant.dateRetroactive,

      applicantName: applicant.applicantName,
      applicantIc: applicant.applicantIc,
      applicantGender: applicant.applicantGender,
      applicantCorrespondenceAddress: applicant.applicantCorrespondenceAddress,
      applicantPrimaryPracticeLocation: applicant.applicantPrimaryPracticeLocation,
      applicantPhoneNumber: applicant.applicantPhoneNumber,
      applicantEmail: applicant.applicantEmail,
      applicantLicensing: applicant.applicantLicensing,
      applicantRegistrationNumber: applicant.applicantRegistrationNumber,
      dateRegistration: applicant.dateRegistration,
      dateFirstRegistration: applicant.dateFirstRegistration,

      history1: applicant.history1, // Do you currently hold medical malpractice Takaful? If YES, please provide details.
      history2: applicant.history2, // Have you ever had any application for medical malpractice Takaful refused, or had any medical malpractice Takaful coverage rescinded or cancelled? If YES, please provide details on a separate sheet, noting the Section number

      experience1: applicant.experience1, // Have any claims ever been made, or lawsuits been brought against you?
      experience2: applicant.experience2, // Are you aware of any errors, omissions, offences, circumstances or allegations which might result in a claim being made against you?
      experience3: applicant.experience3, // Have you ever been the subject of disciplinary action or investigation by any authority or regulator or professional body?
      experience4: applicant.experience4, // Have you ever been the subject of a criminal investigation or had criminal charges brought against you? For the purposes of this question, please disregard traffic or minor motor vehicle licensing offences.

      confirm1: applicant.confirm1,
      confirm2: applicant.confirm2,
      createdAt: applicant.createdAt != null ? applicant.createdAt : now,
      updatedAt: applicant.updatedAt != null ? applicant.updatedAt : now,

      submitStatus: applicant.submitStatus,
    };

    if (this.applicant == null) {
      return this.angularFireDatabase.database.ref('/applicant').push(applicantObj);
    } else {
      return this.applicant.push(applicantObj);
    }
  }

  applicant_update(applicant: Applicant): Promise<void> {
    const now = formatDate(new Date(), 'HH:mm:ss dd/MM/yyyy', 'en-US');
    if (this.applicant == null) {
      const reference = this.angularFireDatabase.database.ref('/applicant/' + applicant.$key);
      delete applicant.$key; // You should delete this otherwise the update call will fail
      return reference.update({
        ...applicant,
        updatedAt: now
      });
    } else {
      return this.applicant.update(applicant.$key, {
        dateFrom: applicant.dateFrom,
        dateTo: applicant.dateTo,

        limit: applicant.limit,
        // limit2: applicant.limit2,

        dateRetroactive: applicant.dateRetroactive,

        applicantName: applicant.applicantName,
        applicantIc: applicant.applicantIc,
        applicantGender: applicant.applicantGender,
        applicantCorrespondenceAddress: applicant.applicantCorrespondenceAddress,
        applicantPrimaryPracticeLocation: applicant.applicantPrimaryPracticeLocation,
        applicantPhoneNumber: applicant.applicantPhoneNumber,
        applicantEmail: applicant.applicantEmail,
        applicantLicensing: applicant.applicantLicensing,
        applicantRegistrationNumber: applicant.applicantRegistrationNumber,
        dateRegistration: applicant.dateRegistration,
        dateFirstRegistration: applicant.dateFirstRegistration,

        history1: applicant.history1, // Do you currently hold medical malpractice Takaful? If YES, please provide details.
        history2: applicant.history2, // Have you ever had any application for medical malpractice Takaful refused, or had any medical malpractice Takaful coverage rescinded or cancelled? If YES, please provide details on a separate sheet, noting the Section number

        experience1: applicant.experience1, // Have any claims ever been made, or lawsuits been brought against you?
        experience2: applicant.experience2, // Are you aware of any errors, omissions, offences, circumstances or allegations which might result in a claim being made against you?
        experience3: applicant.experience3, // Have you ever been the subject of disciplinary action or investigation by any authority or regulator or professional body?
        experience4: applicant.experience4, // Have you ever been the subject of a criminal investigation or had criminal charges brought against you? For the purposes of this question, please disregard traffic or minor motor vehicle licensing offences.

        confirm1: applicant.confirm1,
        confirm2: applicant.confirm2,

        createdAt: applicant.createdAt,
        submitStatus: applicant.submitStatus,
        updatedAt: now
      });
    }
  }

  applicant_deleteById(key: string): Promise<void> {
    if (this.applicant == null) {
      return this.angularFireDatabase.database.ref('/applicant/' + key).remove();
    } else {
      return this.applicant.remove(key);
    }
  }


  // ---------------------------- APPLICANT MEDICAL STATUS (BRIDGE) ----------------------------


  applicant_medicalStatus_getAll(): AngularFireList<Applicant_MedicalStatus> {
    this.applicant_medicalStatus = this.angularFireDatabase.list('/applicant_medicalStatus') as AngularFireList<Applicant_MedicalStatus>;
    return this.applicant_medicalStatus;
  }

  applicant_medicalStatus_create(applicant_medicalStatus: Applicant_MedicalStatus): firebase.database.ThenableReference {
    const now = formatDate(new Date(), 'HH:mm:ss dd/MM/yyyy', 'en-US');
    const applicant_medicalStatusObj = {
      applicantId: applicant_medicalStatus.applicantId,
      medicalStatusId: applicant_medicalStatus.medicalStatusId,
      percentage: applicant_medicalStatus.percentage,
      max: applicant_medicalStatus.max,
      createdAt: applicant_medicalStatus.createdAt != null ? applicant_medicalStatus.createdAt : now,
      updatedAt: applicant_medicalStatus.updatedAt != null ? applicant_medicalStatus.updatedAt : now,
    };

    if (this.applicant_medicalStatus == null) {
      return this.angularFireDatabase.database.ref('/applicant_medicalStatus').push(applicant_medicalStatusObj);
    } else {
      return this.applicant_medicalStatus.push(applicant_medicalStatusObj);
    }
  }

  applicant_medicalStatus_deleteById(key: string): Promise<void> {
    if (this.applicant_medicalStatus == null) {
      return this.angularFireDatabase.database.ref('/applicant_medicalStatus/' + key).remove();
    } else {
      return this.applicant_medicalStatus.remove(key);
    }
  }

  applicant_medicalStatus_getById(key: string): AngularFireObject<Applicant_MedicalStatus> {
    this.applicant_medicalStatusDetails = this.angularFireDatabase.object('/applicant_medicalStatus/' + key) as AngularFireObject<Applicant_MedicalStatus>;
    return this.applicant_medicalStatusDetails;
  }

  applicant_medicalStatus_search(key: string): AngularFireList<Applicant_MedicalStatus> {
    this.applicant_medicalStatus = this.angularFireDatabase.list('/applicant_medicalStatus', ref => ref.orderByChild('applicantId').equalTo(key));
    return this.applicant_medicalStatus;
  }

  applicant_medicalStatus_searchMS(key: string): AngularFireList<Applicant_MedicalStatus> {
    this.applicant_medicalStatus = this.angularFireDatabase.list('/applicant_medicalStatus', ref => ref.orderByChild('medicalStatusId').equalTo(key));
    return this.applicant_medicalStatus;
  }

  // ---------------------------- ABOUT ----------------------------


  about_getById(key: string): AngularFireObject<About> {
    this.aboutDetails = this.angularFireDatabase.object('/about/' + key) as AngularFireObject<About>;
    return this.aboutDetails;
  }

  about_update(about: About): Promise<void> {
    if (this.about == null) {
      const reference = this.angularFireDatabase.database.ref('/about/' + about.$key);
      delete about.$key; // You should delete this otherwise the update call will fail
      return reference.update({
        ...about
      });
    } else {
      return this.about.update(about.$key, {
        address: about.address,
        email: about.email,
        link1: about.link1,
        link2: about.link2,
        link3: about.link3,
        phone: about.phone,

        targetApplicantPerMonth: about.targetApplicantPerMonth,
        targetYearlySale: about.targetYearlySale,
        targetMonthlySale: about.targetMonthlySale,
      });
    }
  }
}

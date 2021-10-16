export class Applicant {
  $key?: string;

  dateFrom: string;
  dateTo: string;

  limit: string;
  // limit2: string;

  dateRetroactive: string;

  applicantName: string;
  applicantIc: string;
  applicantGender: string;
  applicantCorrespondenceAddress: string;
  applicantPrimaryPracticeLocation: string;
  applicantPhoneNumber: string;
  applicantEmail: string;
  applicantLicensing: string;
  applicantRegistrationNumber: string;
  dateRegistration: string;
  dateFirstRegistration: string;

  history1: string; // Do you currently hold medical malpractice Takaful? If YES, please provide details.
  history2: string; // Have you ever had any application for medical malpractice Takaful refused, or had any medical malpractice Takaful coverage rescinded or cancelled? If YES, please provide details on a separate sheet, noting the Section number

  experience1: string; // Have any claims ever been made, or lawsuits been brought against you?
  experience2: string; // Are you aware of any errors, omissions, offences, circumstances or allegations which might result in a claim being made against you?
  experience3: string; // Have you ever been the subject of disciplinary action or investigation by any authority or regulator or professional body?
  experience4: string; // Have you ever been the subject of a criminal investigation or had criminal charges brought against you? For the purposes of this question, please disregard traffic or minor motor vehicle licensing offences.

  confirm1: string;
  confirm2: string;

  createdAt: string;
  updatedAt: string;

  submitStatus: string;
}
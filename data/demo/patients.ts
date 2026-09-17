import { PatientProfile } from "@/lib/types";

export const omarHassan: PatientProfile = {
  slug:"demo-001", relationshipToOwner:"self", firstName:"Omar", lastName:"Hassan", age:33, bloodType:"O+", photoColor:"#51405D",
  emergencyProfile:{completeness:92}, recordCompleteness:76, lastConfirmation:"6 days", linkedIds:3,
  allergies:[{id:"a1",allergen:"Penicillin",reaction:"Breathing difficulty",severity:"critical",source:"document",sourceDetail:"Allergy clinic report",confirmedAt:"08 Sep 2026",freshness:"current"}],
  conditions:[{id:"c1",name:"Type 1 Diabetes",status:"active",diagnosedYear:2011,source:"provider",sourceDetail:"Endocrinology clinic",confirmedAt:"08 Sep 2026",freshness:"current"},{id:"c2",name:"Asthma",status:"active",diagnosedYear:2018,source:"patient",confirmedAt:"08 Sep 2026",freshness:"current"}],
  medications:[{id:"m1",name:"Insulin Glargine",dosage:"24 units",frequency:"Nightly",source:"provider",confirmedAt:"08 Sep 2026",freshness:"current"},{id:"m2",name:"Insulin Lispro",dosage:"Per carb ratio",frequency:"With meals",source:"provider",confirmedAt:"08 Sep 2026",freshness:"current"}],
  labResults:[{id:"l1",testName:"HbA1c",value:"7.2",unit:"%",status:"abnormal",date:"03 Sep 2026",lab:"Example Medical Lab",documentId:"d1"}],
  radiology:[{id:"r1",type:"Chest X-ray",bodyPart:"Chest",date:"14 Aug 2026",finding:"No acute cardiopulmonary abnormality.",documentId:"d2"}],
  surgeries:[{id:"s1",name:"Appendectomy",year:2017,hospital:"Example Hospital"}],
  vaccinations:[{id:"v1",name:"Influenza",date:"Oct 2025",provider:"Example Clinic"}],
  timeline:[{id:"t1",year:2011,title:"Type 1 diabetes diagnosed",detail:"Started insulin therapy."},{id:"t2",year:2018,title:"Asthma diagnosed",detail:"Intermittent asthma documented."}],
  emergencyContacts:[{id:"e1",name:"Sara Hassan",relationship:"Sister",phone:"+20 100 000 0000"}],
  documents:[{id:"d1",title:"HbA1c Lab Report",date:"03 Sep 2026",provider:"Example Medical Lab",category:"lab"},{id:"d2",title:"Chest X-ray Report",date:"14 Aug 2026",provider:"Example Imaging Center",category:"radiology"}]
};

export const youssefHassan: PatientProfile = {
  ...omarHassan,
  slug:"demo-child-001", relationshipToOwner:"child", firstName:"Youssef", lastName:"Hassan", age:8, bloodType:"A+", photoColor:"#B6E36E",
  allergies:[{id:"ya1",allergen:"Peanuts",reaction:"Anaphylaxis",severity:"critical",source:"provider",sourceDetail:"Pediatric allergy clinic",confirmedAt:"08 Sep 2026",freshness:"current"}],
  conditions:[{id:"yc1",name:"Asthma",status:"active",diagnosedYear:2022,source:"provider",confirmedAt:"08 Sep 2026",freshness:"current"}],
  medications:[], labResults:[], radiology:[], surgeries:[], vaccinations:[], timeline:[], documents:[],
  emergencyContacts:[{id:"ye1",name:"Omar Hassan",relationship:"Guardian",phone:"+20 100 000 0000"}],
  emergencyProfile:{completeness:88}, recordCompleteness:48, lastConfirmation:"4 days", linkedIds:1
};

export const patients: Record<string, PatientProfile> = {
  [omarHassan.slug]: omarHassan,
  [youssefHassan.slug]: youssefHassan
};

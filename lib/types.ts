export type Freshness = "current" | "review" | "outdated";
export type SourceType = "patient" | "document" | "provider";
export type TimelineEvent = { id:string; year:string|number; title:string; detail:string };
export type PatientProfile = {
  slug:string; firstName:string; lastName:string; age:number; bloodType:string; photoColor:string;
  emergencyProfile:{completeness:number}; recordCompleteness:number; lastConfirmation:string; linkedIds:number;
  allergies:Array<{id:string; allergen:string; reaction:string; severity:"critical"|"moderate"|"mild"; source:SourceType; sourceDetail?:string; confirmedAt:string; freshness:Freshness}>;
  conditions:Array<{id:string; name:string; status:"active"|"inactive"; diagnosedYear:string|number; source:SourceType; sourceDetail?:string; confirmedAt:string; freshness:Freshness}>;
  medications:Array<{id:string; name:string; dosage:string; frequency:string; source:SourceType; sourceDetail?:string; confirmedAt:string; freshness:Freshness}>;
  labResults:Array<{id:string; testName:string; value:string; unit?:string; status:"normal"|"abnormal"; date:string; lab:string; documentId?:string}>;
  radiology:Array<{id:string; type:string; bodyPart:string; date:string; finding:string; documentId?:string}>;
  surgeries:Array<{id:string; name:string; year:string|number; hospital?:string}>;
  vaccinations:Array<{id:string; name:string; date:string; provider?:string}>;
  timeline:TimelineEvent[];
  emergencyContacts:Array<{id:string; name:string; relationship:string; phone:string}>;
  documents:Array<{id:string; title:string; date:string; provider:string}>;
};

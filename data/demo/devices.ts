export type DemoDevice = { id:string; name:string; slug:string; type:"bracelet"|"card"|"bagtag"|"travel"; status:"active"|"deactivated"; createdAt:string; lastScanned?:string };
export const devices: DemoDevice[] = [
  {id:"dev1",name:"Emergency Bracelet",slug:"demo-001",type:"bracelet",status:"active",createdAt:"01 Sep 2026"},
  {id:"dev2",name:"Wallet Card",slug:"demo-001",type:"card",status:"active",createdAt:"01 Sep 2026"},
  {id:"dev3",name:"Child Bag Tag",slug:"demo-child-001",type:"bagtag",status:"active",createdAt:"05 Sep 2026"}
];

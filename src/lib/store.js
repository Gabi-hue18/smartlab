import { supabase, supabaseEnabled } from './supabase'
import { demoUsers, initialEquipment, initialFaults, initialMaintenance, initialHistory, initialNotifications } from './mockData'

const KEYS = { equipment:'smartlab_equipment', faults:'smartlab_faults', maintenance:'smartlab_maintenance', history:'smartlab_history', notifications:'smartlab_notifications' }
function ensure(key, seed){ if(!localStorage.getItem(key)) localStorage.setItem(key, JSON.stringify(seed)); return JSON.parse(localStorage.getItem(key)) }
function put(key, value){ localStorage.setItem(key, JSON.stringify(value)); return value }

export const mode = supabaseEnabled ? 'cloud' : 'demo'

export async function signIn(email,password){
  if(supabaseEnabled){
    const { data, error } = await supabase.auth.signInWithPassword({email,password}); if(error) throw error
    const { data: profile, error: pErr } = await supabase.from('profiles').select('*').eq('id',data.user.id).single(); if(pErr) throw pErr
    return { user:data.user, profile }
  }
  const found=demoUsers.find(u=>u.email===email&&u.password===password); if(!found) throw new Error('Invalid email or password')
  localStorage.setItem('smartlab_session',JSON.stringify(found)); return {user:{id:found.id,email:found.email},profile:found}
}
export async function signOut(){ if(supabaseEnabled) await supabase.auth.signOut(); localStorage.removeItem('smartlab_session') }
export async function getSession(){
  if(supabaseEnabled){ const {data}=await supabase.auth.getSession(); if(!data.session) return null; const {data:profile}=await supabase.from('profiles').select('*').eq('id',data.session.user.id).single(); return {user:data.session.user,profile} }
  const s=localStorage.getItem('smartlab_session'); if(!s) return null; const p=JSON.parse(s); return {user:{id:p.id,email:p.email},profile:p}
}

export async function getEquipment(){ if(supabaseEnabled){ const {data,error}=await supabase.from('equipment').select('*').order('name'); if(error) throw error; return data } return ensure(KEYS.equipment,initialEquipment) }
export async function addEquipment(row){ if(supabaseEnabled){ const {data,error}=await supabase.from('equipment').insert(row).select().single(); if(error) throw error; return data } const a=ensure(KEYS.equipment,initialEquipment); const obj={...row,id:crypto.randomUUID()}; put(KEYS.equipment,[obj,...a]); return obj }
export async function updateEquipment(id,patch){ if(supabaseEnabled){ const {data,error}=await supabase.from('equipment').update(patch).eq('id',id).select().single(); if(error) throw error; return data } const a=ensure(KEYS.equipment,initialEquipment).map(x=>x.id===id?{...x,...patch}:x); put(KEYS.equipment,a); return a.find(x=>x.id===id) }
export async function deleteEquipment(id){ if(supabaseEnabled){ const {error}=await supabase.from('equipment').delete().eq('id',id); if(error) throw error; return } put(KEYS.equipment,ensure(KEYS.equipment,initialEquipment).filter(x=>x.id!==id)) }

export async function getFaults(){ if(supabaseEnabled){ const {data,error}=await supabase.from('faults').select('*').order('reported_at',{ascending:false}); if(error) throw error; return data } return ensure(KEYS.faults,initialFaults) }
export async function addFault(row){ if(supabaseEnabled){ const {data,error}=await supabase.from('faults').insert(row).select().single(); if(error) throw error; return data } const obj={...row,id:crypto.randomUUID(),reported_at:new Date().toISOString(),status:'reported'}; put(KEYS.faults,[obj,...ensure(KEYS.faults,initialFaults)]); return obj }

export async function getMaintenance(){ if(supabaseEnabled){ const {data,error}=await supabase.from('maintenance_tasks').select('*').order('due_date'); if(error) throw error; return data } return ensure(KEYS.maintenance,initialMaintenance) }
export async function addMaintenance(row){ if(supabaseEnabled){ const {data,error}=await supabase.from('maintenance_tasks').insert(row).select().single(); if(error) throw error; return data } const obj={...row,id:crypto.randomUUID()}; put(KEYS.maintenance,[obj,...ensure(KEYS.maintenance,initialMaintenance)]); return obj }
export async function updateMaintenance(id,patch){ if(supabaseEnabled){ const {data,error}=await supabase.from('maintenance_tasks').update(patch).eq('id',id).select().single(); if(error) throw error; return data } const a=ensure(KEYS.maintenance,initialMaintenance).map(x=>x.id===id?{...x,...patch}:x); put(KEYS.maintenance,a); return a.find(x=>x.id===id) }

export async function getHistory(){ if(supabaseEnabled){ const {data,error}=await supabase.from('maintenance_history').select('*').order('date',{ascending:false}); if(error) throw error; return data } return ensure(KEYS.history,initialHistory) }
export async function getNotifications(){ if(supabaseEnabled){ const {data,error}=await supabase.from('notifications').select('*').order('created_at',{ascending:false}); if(error) throw error; return data } return ensure(KEYS.notifications,initialNotifications) }
export async function markNotificationRead(id){ if(supabaseEnabled){ await supabase.from('notifications').update({read:true}).eq('id',id); return } const a=ensure(KEYS.notifications,initialNotifications).map(n=>n.id===id?{...n,read:true}:n); put(KEYS.notifications,a) }

export async function uploadDocument(file,equipmentId){
 if(!supabaseEnabled) return { path:file.name, publicUrl:'demo://' + file.name }
 const path=`${equipmentId}/${Date.now()}-${file.name}`
 const {error}=await supabase.storage.from('equipment-docs').upload(path,file); if(error) throw error
 const {data}=supabase.storage.from('equipment-docs').getPublicUrl(path); return {path,publicUrl:data.publicUrl}
}

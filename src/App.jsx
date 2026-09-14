import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Equipment from './pages/Equipment'
import EquipmentDetails from './pages/EquipmentDetails'
import AddEquipment from './pages/AddEquipment'
import Scanner from './pages/Scanner'
import Faults from './pages/Faults'
import Maintenance from './pages/Maintenance'
import History from './pages/History'
import Documents from './pages/Documents'
import Notifications from './pages/Notifications'
import Analytics from './pages/Analytics'
import { getSession, signOut } from './lib/store'

export default function App(){
 const [session,setSession]=useState(undefined)
 useEffect(()=>{getSession().then(setSession)},[])
 if(session===undefined) return <div className="boot">Loading SmartLab…</div>
 if(!session) return <Login onLogin={setSession}/>
 async function logout(){await signOut();setSession(null)}
 return <Routes><Route element={<Layout profile={session.profile} onLogout={logout}/>}><Route index element={<Dashboard/>}/><Route path="equipment" element={<Equipment/>}/><Route path="equipment/new" element={<AddEquipment/>}/><Route path="equipment/:id" element={<EquipmentDetails/>}/><Route path="scanner" element={<Scanner/>}/><Route path="faults" element={<Faults/>}/><Route path="maintenance" element={<Maintenance/>}/><Route path="history" element={<History/>}/><Route path="documents" element={<Documents/>}/><Route path="notifications" element={<Notifications/>}/><Route path="analytics" element={<Analytics/>}/><Route path="*" element={<Navigate to="/" replace/>}/></Route></Routes>
}

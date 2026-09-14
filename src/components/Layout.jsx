import { NavLink, Outlet } from 'react-router-dom'
import { Home, Boxes, QrCode, Wrench, TriangleAlert, History, Bell, BarChart3, FileText, PlusCircle, LogOut, Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'
import { mode } from '../lib/store'

const items=[
 ['/','Dashboard',Home],['/equipment','Equipment',Boxes],['/scanner','QR Scanner',QrCode],['/maintenance','Maintenance',Wrench],['/faults','Faults',TriangleAlert],['/history','History',History],['/documents','Documents',FileText],['/notifications','Notifications',Bell],['/analytics','Analytics',BarChart3],['/equipment/new','Add Equipment',PlusCircle]
]
export default function Layout({profile,onLogout}){
 const [dark,setDark]=useState(localStorage.getItem('smartlab_theme')==='dark')
 useEffect(()=>{document.documentElement.dataset.theme=dark?'dark':'light';localStorage.setItem('smartlab_theme',dark?'dark':'light')},[dark])
 return <div className="app-shell">
  <aside className="sidebar">
    <div className="brand"><div className="brand-mark">SL</div><div><b>SmartLab</b><small>Asset Intelligence</small></div></div>
    <nav>{items.map(([to,label,Icon])=><NavLink key={to} to={to} end={to==='/'} className={({isActive})=>isActive?'nav-link active':'nav-link'}><Icon size={18}/><span>{label}</span></NavLink>)}</nav>
    <div className="side-footer">
      <button className="nav-button" onClick={()=>setDark(x=>!x)}>{dark?<Sun size={18}/>:<Moon size={18}/>}<span>{dark?'Light mode':'Dark mode'}</span></button>
      <button className="nav-button" onClick={onLogout}><LogOut size={18}/><span>Logout</span></button>
    </div>
  </aside>
  <div className="workspace">
   <header className="topbar"><div><span className={`mode-pill ${mode}`}>{mode==='cloud'?'Cloud database':'Demo mode'}</span></div><div className="profile-chip"><div className="avatar">{(profile?.full_name||'U')[0]}</div><div><b>{profile?.full_name||'User'}</b><small>{profile?.role||'staff'}</small></div></div></header>
   <main className="page"><Outlet context={{profile}}/></main>
  </div>
 </div>
}

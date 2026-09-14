import { useState } from 'react'
import { FlaskConical, Microscope, ShieldCheck, Wrench } from 'lucide-react'
import { signIn } from '../lib/store'

export default function Login({onLogin}){
 const [email,setEmail]=useState('admin@smartlab.com'); const [password,setPassword]=useState('admin123'); const [error,setError]=useState(''); const [busy,setBusy]=useState(false)
 async function submit(e){e.preventDefault(); setBusy(true); setError(''); try{const s=await signIn(email,password); onLogin(s)}catch(err){setError(err.message)}finally{setBusy(false)}}
 return <div className="login-shell">
  <section className="login-art"><div className="art-top"><div className="brand-mark large">SL</div><b>SMARTLAB</b></div><div className="art-icons"><Microscope/><FlaskConical/><Wrench/></div><div><h1>Laboratory equipment, managed intelligently.</h1><p>Assets, QR identification, faults, maintenance, calibration, documents and analytics in one workspace.</p><div className="security-line"><ShieldCheck size={18}/> Role-based access & audit-ready records</div></div></section>
  <section className="login-form-wrap"><form className="login-card" onSubmit={submit}><p className="eyebrow">SMART LABORATORY OPERATIONS</p><h2>Welcome back</h2><p className="muted">Sign in to continue to your laboratory workspace.</p><label>Email</label><input value={email} onChange={e=>setEmail(e.target.value)} type="email" required/><label>Password</label><input value={password} onChange={e=>setPassword(e.target.value)} type="password" required/>{error&&<div className="alert error">{error}</div>}<button className="primary-btn wide" disabled={busy}>{busy?'Signing in…':'Sign in'}</button><div className="demo-accounts"><b>Demo accounts</b><span>Admin: admin@smartlab.com / admin123</span><span>Staff: staff@smartlab.com / staff123</span><span>Technician: tech@smartlab.com / tech123</span></div></form></section>
 </div>
}

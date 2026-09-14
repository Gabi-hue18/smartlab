import { useEffect, useMemo, useState } from 'react'
import { Boxes, CircleCheck, Wrench, TriangleAlert, CalendarClock, Activity, Sparkles } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { getEquipment, getMaintenance, getFaults } from '../lib/store'
import MetricCard from '../components/MetricCard'
import StatusBadge from '../components/StatusBadge'
import { format, parseISO, differenceInCalendarDays } from 'date-fns'

const colors=['#2f80ed','#22a06b','#f5a623','#d64545','#8b5cf6']
export default function Dashboard(){
 const [equipment,setEquipment]=useState([]),[maintenance,setMaintenance]=useState([]),[faults,setFaults]=useState([])
 useEffect(()=>{Promise.all([getEquipment(),getMaintenance(),getFaults()]).then(([e,m,f])=>{setEquipment(e);setMaintenance(m);setFaults(f)})},[])
 const statusData=useMemo(()=>['available','in_use','maintenance','damaged','retired'].map(name=>({name,value:equipment.filter(e=>e.status===name).length})).filter(x=>x.value),[equipment])
 const due=maintenance.filter(m=>m.status!=='completed').slice(0,5)
 const highRisk=equipment.filter(e=>e.status==='damaged'||(e.next_calibration && differenceInCalendarDays(parseISO(e.next_calibration),new Date())<=7))
 const trend=[{m:'Apr',v:7},{m:'May',v:9},{m:'Jun',v:6},{m:'Jul',v:11},{m:'Aug',v:8},{m:'Sep',v:13}]
 return <>
  <div className="page-heading"><div><p className="eyebrow">OVERVIEW</p><h1>Laboratory Dashboard</h1><p>Live operational picture of assets, service work and equipment risk.</p></div><div className="smart-chip"><Sparkles size={18}/><span>Smart insights enabled</span></div></div>
  <div className="metrics-grid"><MetricCard label="Total equipment" value={equipment.length} icon={Boxes}/><MetricCard label="Available" value={equipment.filter(e=>e.status==='available').length} icon={CircleCheck} tone="green"/><MetricCard label="Active maintenance" value={maintenance.filter(m=>m.status!=='completed').length} icon={Wrench} tone="orange"/><MetricCard label="Open faults" value={faults.filter(f=>f.status!=='closed').length} icon={TriangleAlert} tone="red"/></div>
  <div className="dashboard-grid">
    <section className="panel"><div className="panel-head"><div><h3>Equipment status</h3><p>Current fleet distribution</p></div></div><div className="chart-row"><div className="donut-wrap"><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={statusData} dataKey="value" nameKey="name" innerRadius={62} outerRadius={92} paddingAngle={3}>{statusData.map((_,i)=><Cell key={i} fill={colors[i%colors.length]}/>)}</Pie><Tooltip/></PieChart></ResponsiveContainer><div className="donut-center"><b>{equipment.length}</b><span>assets</span></div></div><div className="legend-list">{statusData.map((s,i)=><div key={s.name}><i style={{background:colors[i]}}/><span>{s.name.replace('_',' ')}</span><b>{s.value}</b></div>)}</div></div></section>
    <section className="panel"><div className="panel-head"><div><h3>Maintenance trend</h3><p>Jobs handled per month</p></div></div><ResponsiveContainer width="100%" height={250}><BarChart data={trend}><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="m"/><YAxis/><Tooltip/><Bar dataKey="v" fill="#2f80ed" radius={[7,7,0,0]}/></BarChart></ResponsiveContainer></section>
    <section className="panel span-2"><div className="panel-head"><div><h3>Upcoming work</h3><p>Priority schedule for technicians</p></div></div><div className="table-wrap"><table><thead><tr><th>Task</th><th>Equipment</th><th>Due</th><th>Priority</th><th>Status</th></tr></thead><tbody>{due.map(m=><tr key={m.id}><td>{m.title}</td><td>{m.asset_id} · {m.equipment_name}</td><td>{m.due_date?format(parseISO(m.due_date),'dd MMM yyyy'):'—'}</td><td><StatusBadge value={m.priority}/></td><td><StatusBadge value={m.status}/></td></tr>)}</tbody></table></div></section>
    <section className="panel"><div className="panel-head"><div><h3>Smart attention</h3><p>Rule-based risk flags</p></div><Activity size={20}/></div><div className="insight-list">{highRisk.length?highRisk.map(e=><div className="insight" key={e.id}><CalendarClock/><div><b>{e.name}</b><span>{e.status==='damaged'?'Marked damaged — inspection recommended':'Calibration due within 7 days'}</span></div></div>):<p className="muted">No urgent equipment risks detected.</p>}</div></section>
  </div>
 </>
}

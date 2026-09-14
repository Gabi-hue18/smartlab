import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Download, Trash2 } from 'lucide-react'
import { deleteEquipment, getEquipment } from '../lib/store'
import StatusBadge from '../components/StatusBadge'

export default function Equipment(){
 const [items,setItems]=useState([]),[q,setQ]=useState(''),[status,setStatus]=useState('all')
 const load=()=>getEquipment().then(setItems); useEffect(load,[])
 const filtered=useMemo(()=>items.filter(e=>(status==='all'||e.status===status)&&(`${e.name} ${e.asset_id} ${e.location}`.toLowerCase().includes(q.toLowerCase()))),[items,q,status])
 async function remove(id){if(confirm('Delete this equipment record?')){await deleteEquipment(id);load()}}
 function exportCsv(){const rows=[['Asset ID','Name','Category','Location','Status'],...filtered.map(e=>[e.asset_id,e.name,e.category,e.location,e.status])]; const csv=rows.map(r=>r.map(v=>`"${String(v??'').replaceAll('"','""')}"`).join(',')).join('\n'); const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.download='smartlab-equipment.csv';a.click()}
 return <><div className="page-heading"><div><p className="eyebrow">ASSET REGISTRY</p><h1>Equipment</h1><p>Search, track and maintain every laboratory asset.</p></div><div className="heading-actions"><button className="ghost-btn" onClick={exportCsv}><Download size={17}/> Export CSV</button><Link className="primary-btn" to="/equipment/new"><Plus size={17}/> Add equipment</Link></div></div>
 <div className="filters"><div className="search-box"><Search size={18}/><input placeholder="Search equipment, asset ID or location" value={q} onChange={e=>setQ(e.target.value)}/></div><select value={status} onChange={e=>setStatus(e.target.value)}><option value="all">All statuses</option><option value="available">Available</option><option value="in_use">In use</option><option value="maintenance">Maintenance</option><option value="damaged">Damaged</option></select></div>
 <div className="panel"><div className="table-wrap"><table><thead><tr><th>Asset</th><th>Category</th><th>Location</th><th>Status</th><th>Calibration</th><th></th></tr></thead><tbody>{filtered.map(e=><tr key={e.id}><td><Link className="asset-link" to={`/equipment/${e.id}`}><b>{e.name}</b><span>{e.asset_id} · {e.manufacturer} {e.model}</span></Link></td><td>{e.category}</td><td>{e.location}</td><td><StatusBadge value={e.status}/></td><td>{e.next_calibration||'—'}</td><td className="actions-cell"><Link className="small-btn" to={`/equipment/${e.id}`}>Open</Link><button className="icon-btn danger" title="Delete" onClick={()=>remove(e.id)}><Trash2 size={16}/></button></td></tr>)}</tbody></table></div></div></>
}

import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { ArrowLeft, CalendarClock, FileUp, Wrench, TriangleAlert, Gauge } from 'lucide-react'
import { getEquipment, getHistory, uploadDocument } from '../lib/store'
import StatusBadge from '../components/StatusBadge'

export default function EquipmentDetails(){
 const {id}=useParams(), nav=useNavigate(); const [item,setItem]=useState(null),[history,setHistory]=useState([]),[uploading,setUploading]=useState(false)
 useEffect(()=>{getEquipment().then(a=>setItem(a.find(x=>x.id===id)));getHistory().then(h=>setHistory(h.filter(x=>x.equipment_id===id)))},[id])
 if(!item) return <div className="panel">Loading asset…</div>
 const health=item.status==='damaged'?38:item.status==='maintenance'?61:item.condition==='excellent'?96:84
 async function onUpload(e){const f=e.target.files?.[0];if(!f)return;setUploading(true);try{await uploadDocument(f,id);alert('Document uploaded')}catch(err){alert(err.message)}finally{setUploading(false)}}
 return <><div className="page-heading"><div><Link className="back-link" to="/equipment"><ArrowLeft size={16}/> Equipment</Link><h1>{item.name}</h1><p>{item.asset_id} · {item.manufacturer} {item.model}</p></div><StatusBadge value={item.status}/></div>
 <div className="details-grid"><section className="panel span-2"><div className="panel-head"><div><h3>Asset profile</h3><p>Identification, condition and ownership information</p></div></div><div className="details-cards">{[['Category',item.category],['Location',item.location],['Serial number',item.serial_number],['Condition',item.condition],['Purchase date',item.purchase_date],['Warranty expiry',item.warranty_expiry],['Next maintenance',item.next_maintenance],['Next calibration',item.next_calibration]].map(([k,v])=><div className="detail-tile" key={k}><span>{k}</span><b>{v||'—'}</b></div>)}</div></section>
 <section className="panel qr-panel"><h3>Equipment QR</h3><QRCodeSVG value={`${location.origin}${location.pathname}#/equipment/${item.id}`} size={180} level="H"/><code>{item.asset_id}</code><p>Scan to open this asset profile.</p></section>
 <section className="panel"><div className="panel-head"><div><h3>Health score</h3><p>Rule-based readiness indicator</p></div><Gauge size={20}/></div><div className="health-ring" style={{'--score':`${health*3.6}deg`}}><div><b>{health}</b><span>/100</span></div></div><p className="center muted">Based on status, condition and upcoming service dates.</p></section>
 <section className="panel"><div className="panel-head"><div><h3>Quick actions</h3><p>Operate on this equipment</p></div></div><div className="quick-actions"><button onClick={()=>nav('/faults',{state:{equipment:item}})}><TriangleAlert/>Report fault</button><button onClick={()=>nav('/maintenance',{state:{equipment:item}})}><Wrench/>Schedule service</button><label className="upload-action"><FileUp/>{uploading?'Uploading…':'Upload document'}<input type="file" hidden onChange={onUpload}/></label><button onClick={()=>nav('/history')}><CalendarClock/>View history</button></div></section>
 <section className="panel span-2"><div className="panel-head"><div><h3>Recent maintenance history</h3><p>Service trail for this asset</p></div></div>{history.length?history.map(h=><div className="timeline-row" key={h.id}><div className="timeline-dot"/><div><b>{h.action}</b><span>{h.date} · {h.technician} · ₹{h.cost}</span></div></div>):<p className="muted">No history recorded yet.</p>}</section>
 </div></>
}

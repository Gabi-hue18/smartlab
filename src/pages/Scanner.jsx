import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { Camera, Keyboard } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getEquipment } from '../lib/store'

export default function Scanner(){const [running,setRunning]=useState(false),[manual,setManual]=useState(''),reader=useRef(null),nav=useNavigate();
 useEffect(()=>()=>{reader.current?.stop?.().catch(()=>{})},[])
 async function start(){if(running)return;setRunning(true);const q=new Html5Qrcode('reader');reader.current=q;try{await q.start({facingMode:'environment'},{fps:10,qrbox:{width:240,height:240}},txt=>handle(txt),()=>{})}catch(e){alert('Camera could not start. Use manual Asset ID search instead.');setRunning(false)}}
 async function stop(){try{await reader.current?.stop()}catch{}setRunning(false)}
 async function handle(text){const id=text.split('/').pop();const items=await getEquipment();const item=items.find(e=>e.id===id||e.asset_id.toLowerCase()===text.toLowerCase());if(item){await stop();nav(`/equipment/${item.id}`)}}
 async function manualFind(){const items=await getEquipment();const item=items.find(e=>e.asset_id.toLowerCase()===manual.trim().toLowerCase());if(item)nav(`/equipment/${item.id}`);else alert('Asset ID not found')}
 return <><div className="page-heading"><div><p className="eyebrow">QUICK IDENTIFICATION</p><h1>QR Scanner</h1><p>Use a phone or laptop camera to open an equipment record instantly.</p></div></div><div className="scanner-layout"><section className="panel"><div id="reader" className="reader-box"><Camera size={44}/><p>Camera preview appears here</p></div><div className="form-actions"><button className="primary-btn" onClick={running?stop:start}>{running?'Stop scanner':'Start camera scanner'}</button></div></section><section className="panel"><div className="panel-head"><div><h3>Manual lookup</h3><p>Useful when a QR label is damaged.</p></div><Keyboard/></div><label>Asset ID<input placeholder="EQP-001" value={manual} onChange={e=>setManual(e.target.value)}/></label><button className="ghost-btn wide" onClick={manualFind}>Open equipment</button><div className="tip-box"><b>Tip</b><span>GitHub Pages uses HTTPS, which allows browser camera access after you grant permission.</span></div></section></div></>}

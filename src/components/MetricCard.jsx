export default function MetricCard({label,value,icon:Icon,tone='blue',hint}){
 return <div className="metric-card"><div><span>{label}</span><strong>{value}</strong>{hint&&<small>{hint}</small>}</div><div className={`metric-icon tone-${tone}`}>{Icon&&<Icon size={22}/>}</div></div>
}

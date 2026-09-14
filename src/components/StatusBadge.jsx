export default function StatusBadge({value}){
 const v=(value||'unknown').replaceAll('_',' ')
 return <span className={`status status-${value||'unknown'}`}>{v}</span>
}

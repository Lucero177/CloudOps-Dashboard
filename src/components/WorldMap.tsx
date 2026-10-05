import {useState} from 'react'
import {geoNaturalEarth1,geoPath,geoGraticule10} from 'd3-geo'
import {feature} from 'topojson-client'
import world from 'world-atlas/countries-110m.json'
import {Plus,Minus,RotateCcw} from 'lucide-react'
import {Region} from '../types/cloud'
const W=960,H=500,col={ok:'#16A34A',warn:'#F59E0B',error:'#DC2626'}
const proj=geoNaturalEarth1().fitSize([W,H],{type:'Sphere'} as any),path=geoPath(proj)
const land=(feature(world as any,(world as any).objects.countries) as any).features as any[]
const sphere=path({type:'Sphere'} as any)!,grat=path(geoGraticule10())!
const P=(r:Region)=>proj(r.pos)!
export default function WorldMap({all,list,sel,onSelect}:{all:Region[];list:Region[];sel:string;onSelect:(c:string)=>void}){
const [z,setZ]=useState(1),[c,setC]=useState<[number,number]>([W/2,H/2]),[hov,setHov]=useState('')
const vw=W/z,vh=H/z,x=Math.min(Math.max(c[0]-vw/2,0),W-vw),y=Math.min(Math.max(c[1]-vh/2,0),H-vh)
const hub=P(all.find(r=>r.code==='us-east-1')!),cur=all.find(r=>r.code===sel)
const pick=(r:Region)=>{onSelect(r.code);if(z>1)setC(P(r))}
const zoom=(d:number)=>setZ(Math.min(4,Math.max(1,z+d)))
return <div className="relative"><svg viewBox={`${x} ${y} ${vw} ${vh}`} className="w-full rounded-xl bg-slate-50" role="group" aria-label="Mapa de regiones AWS">
<path d={sphere} fill="#F1F5F9" stroke="#CBD5E1" strokeWidth={1/z}/><path d={grat} fill="none" stroke="#E2E8F0" strokeWidth={0.6/z}/>
{land.map((f,i)=><path key={i} d={path(f)??''} fill="#CBD5E1" stroke="#F8FAFC" strokeWidth={0.5/z}/>)}
{list.filter(r=>r.code!=='us-east-1').map(r=>{const p=P(r),a=r.code===sel;return <path key={r.code} d={`M${hub[0]},${hub[1]} Q${(hub[0]+p[0])/2},${Math.min(p[1],hub[1])-60} ${p[0]},${p[1]}`} fill="none" stroke="#2563EB" strokeWidth={(a?2.2:1)/z} strokeDasharray={`${5/z} ${4/z}`} opacity={a?0.9:0.35}/>})}
{list.map(r=>{const p=P(r),a=r.code===sel,show=a||hov===r.code;return <g key={r.code} tabIndex={0} role="button" aria-label={`${r.name}, ${r.code}`} className="cursor-pointer outline-none" onClick={()=>pick(r)} onKeyDown={e=>e.key==='Enter'&&pick(r)} onMouseEnter={()=>setHov(r.code)} onMouseLeave={()=>setHov('')} onFocus={()=>setHov(r.code)} onBlur={()=>setHov('')}>
{a&&<circle cx={p[0]} cy={p[1]} r={13/z} fill="none" stroke="#2563EB" strokeWidth={2/z}/>}
<circle cx={p[0]} cy={p[1]} r={(a?8:6)/z} fill={col[r.status]} stroke="#fff" strokeWidth={2/z}/>
{show&&<g><rect x={p[0]-34/z} y={p[1]-34/z} width={68/z} height={18/z} rx={4/z} fill="#0F172A"/><text x={p[0]} y={p[1]-21/z} textAnchor="middle" fontSize={11/z} fontWeight={600} fill="#fff">{r.code}</text></g>}</g>})}</svg>
<div className="absolute right-2 top-2 flex gap-1">{[[Plus,()=>zoom(1),'Acercar'],[Minus,()=>zoom(-1),'Alejar'],[RotateCcw,()=>{setZ(1);setC([W/2,H/2])},'Restablecer']].map(([I,f,l]:any)=><button key={l} aria-label={l} onClick={f} className="grid h-8 w-8 place-items-center rounded-lg border border-line bg-white shadow-sm hover:bg-bg"><I size={15}/></button>)}</div>
{cur&&z>1&&<p className="sr-only">{cur.name}</p>}</div>}

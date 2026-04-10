import { useState, useRef, useEffect } from "react";

// FONTS — tambahkan di index.html atau layout.jsx:
// <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Geist+Mono:wght@400;500;600&family=Instrument+Sans:wght@400;500;600;700&display=swap" rel="stylesheet"/>

const C = {
  bg: "#020617",
  sidebar: "rgba(6, 13, 31, 0.7)",
  card: "rgba(10, 22, 40, 0.5)",
  card2: "rgba(13, 27, 46, 0.6)",
  border: "rgba(34, 211, 238, 0.08)",
  border2: "rgba(34, 211, 238, 0.15)",
  glass: "rgba(255, 255, 255, 0.03)",
  glassBorder: "rgba(255, 255, 255, 0.08)",
  cyan: "#22d3ee",
  cyanDim: "#0c4a58",
  cyanBg: "rgba(34, 211, 238, 0.04)",
  green: "#4ade80",
  yellow: "#facc15",
  red: "#f87171",
  purple: "#a78bfa",
  blue: "#60a5fa",
  orange: "#fb923c",
  text: "#f1f5f9",
  textSub: "#94a3b8",
  textMid: "#475569",
  syne: "'Syne', sans-serif",
  sans: "'Instrument Sans', sans-serif",
  mono: "'Geist Mono', monospace",
};

// --- PREMIUM BACKGROUND COMPONENTS ---
function PremiumBackground() {
  return (
    <div style={{ position: "fixed", inset: 0, overflow: "hidden", zIndex: -1, background: C.bg }}>
      {/* Animated Mesh Blobs */}
      <div style={{
        position: "absolute", top: "10%", left: "15%", width: "50vw", height: "50vw",
        background: `radial-gradient(circle, ${C.cyan}12 0%, transparent 70%)`,
        borderRadius: "50%", filter: "blur(80px)", animation: "float 20s infinite alternate"
      }} />
      <div style={{
        position: "absolute", bottom: "10%", right: "10%", width: "40vw", height: "40vw",
        background: `radial-gradient(circle, ${C.purple}10 0%, transparent 70%)`,
        borderRadius: "50%", filter: "blur(100px)", animation: "float 25s infinite alternate-reverse"
      }} />
      <div style={{
        position: "absolute", top: "40%", left: "50%", width: "30vw", height: "30vw",
        background: `radial-gradient(circle, ${C.blue}08 0%, transparent 70%)`,
        borderRadius: "50%", filter: "blur(120px)", animation: "float 18s infinite linear"
      }} />
      <style>{`
        @keyframes float {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(5%, 5%) scale(1.05); }
          100% { transform: translate(-2%, 3%) scale(0.95); }
        }
      `}</style>
    </div>
  );
}


const NAV = [
  { id:"dashboard", label:"Dashboard", icon:"⬡", color:C.cyan,
    subs:[{id:"s_prod",label:"Produksi"},{id:"s_keu",label:"Keuangan"},{id:"s_gaji",label:"Penggajian"}] },
  { id:"produksi", label:"Produksi", icon:"◈", color:C.green,
    subs:[{id:"p0",label:"Input PO"},{id:"p1",label:"Cutting"},{id:"p2",label:"Jahit"},{id:"p3",label:"Lubang Kancing"},
          {id:"p4",label:"Buang Benang"},{id:"p5",label:"QC"},{id:"p6",label:"Steam"},
          {id:"p7",label:"Packing"},{id:"p8",label:"Monitoring"}] },
  { id:"pengiriman", label:"Pengiriman", icon:"◎", color:C.blue,
    subs:[{id:"sj1",label:"Buat Surat Jalan"},{id:"sj2",label:"Riwayat Kirim"}] },
  { id:"keuangan", label:"Keuangan", icon:"◇", color:C.yellow,
    subs:[{id:"k1",label:"Ringkasan"},{id:"k2",label:"Laporan PO"},
          {id:"k3",label:"Laporan Margin"},{id:"k4",label:"Jurnal Umum"}] },
  { id:"penggajian", label:"Penggajian", icon:"◉", color:C.purple,
    subs:[{id:"g1",label:"Rekap Gaji"},{id:"g2",label:"Kasbon"},{id:"g3",label:"Slip Gaji"}] },
  { id:"inventory", label:"Inventory", icon:"▣", color:C.green,
    subs:[{id:"i1",label:"Overview Stok"},{id:"i2",label:"Transaksi Keluar"},{id:"i3",label:"Alert Order"}] },
  { id:"laporan", label:"Laporan", icon:"◫", color:C.orange,
    subs:[{id:"l1",label:"Budget vs Realisasi"},{id:"l2",label:"Laporan PO"},
          {id:"l3",label:"Laporan Gaji"},{id:"l4",label:"Laporan Reject"},{id:"l5",label:"Keuangan"}] },
  { id:"master", label:"Master Data", icon:"◰", color:C.blue,
    subs:[{id:"m0",label:"Master Detail"},{id:"m1",label:"Produk & HPP"},{id:"m2",label:"Karyawan"},{id:"m3",label:"Klien"},
          {id:"m4",label:"Jenis Reject"},{id:"m5",label:"Kategori Transaksi"},
          {id:"m6",label:"Satuan (UOM)"},{id:"m7",label:"User & Role"}] },
  { id:"koreksi", label:"Koreksi Data", icon:"◳", color:C.red, subs:[] },
  { id:"auditlog", label:"Audit Log", icon:"◱", color:C.textSub, subs:[] },
];

const rp = n => "Rp " + Number(n||0).toLocaleString("id-ID");

function MacDots() {
  return (
    <div style={{display:"flex",gap:6,alignItems:"center"}}>
      {["#ff5f57","#ffbd2e","#28ca41"].map(c=>(
        <div key={c} style={{width:10,height:10,borderRadius:"50%",background:c}}/>
      ))}
    </div>
  );
}

function ProgBar({pct,color}) {
  return (
    <div style={{height:4,background:"rgba(255,255,255,0.05)",borderRadius:99,overflow:"hidden",marginTop:6}}>
      <div style={{
        width:`${Math.min(pct,100)}%`,
        height:"100%",
        background:color,
        borderRadius:99,
        boxShadow:`0 0 10px ${color}55`
      }}/>
    </div>
  );
}

function Panel({title,children,action,onAction,accent}) {
  const [hover, setHover] = useState(false);
  return (
    <div 
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: "rgba(13, 27, 46, 0.4)",
        backdropFilter: "blur(24px)",
        border: `1px solid ${accent ? accent + "44" : "rgba(255,255,255,0.08)"}`,
        borderRadius: 24,
        overflow: "hidden",
        marginBottom: 24,
        boxShadow: hover ? `0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px ${accent ? accent + "33" : "rgba(34, 211, 238, 0.1)"}` : "0 8px 32px rgba(0,0,0,0.2)",
        transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        transform: hover ? "translateY(-2px)" : "none"
      }}>
      <div style={{
        padding: "16px 28px",
        borderBottom: `1px solid ${accent ? accent + "22" : "rgba(255,255,255,0.06)"}`,
        background: "rgba(255,255,255,0.02)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        <div style={{display: "flex", alignItems: "center", gap: 14}}>
          <MacDots/>
          <span style={{
            fontSize: 10,
            fontWeight: 800,
            color: C.text,
            fontFamily: C.syne,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            opacity: 0.9
          }}>{title}</span>
        </div>
        {action && (
          <button 
            onClick={onAction}
            style={{
              fontSize: 10,
              fontWeight: 800,
              color: "#fff",
              fontFamily: C.mono,
              background: accent ? accent + "22" : C.cyan + "22",
              border: `1px solid ${accent ? accent + "44" : C.cyan + "44"}`,
              padding: "6px 14px",
              borderRadius: 10,
              cursor: "pointer",
              transition: "all 0.2s",
              letterSpacing: "0.05em",
              boxShadow: `0 0 10px ${accent ? accent + "11" : C.cyan + "11"}`
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = accent || C.cyan;
              e.currentTarget.style.color = "#000";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = accent ? accent + "22" : C.cyan + "22";
              e.currentTarget.style.color = "#fff";
            }}
          >
            {action}
          </button>
        )}
      </div>
      <div style={{padding: "12px 0"}}>
        {children}
      </div>
    </div>
  );
}


function KpiCard({label,value,unit,accent,glow,sub,onClick}) {
  const [hover, setHover] = useState(false);
  return (
    <div onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)",
        backdropFilter: "blur(20px)",
        border: `1px solid ${hover ? accent + "aa" : "rgba(255,255,255,0.08)"}`,
        borderRadius: 24,
        padding: "24px 28px",
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
        transform: hover ? "translateY(-6px) scale(1.02)" : "none",
        boxShadow: hover ? `0 20px 40px rgba(0,0,0,0.5), 0 0 30px ${accent}22` : "0 8px 16px rgba(0,0,0,0.1)",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Decorative Glow Circle */}
      <div style={{
        position: "absolute", top: -20, right: -20, width: 80, height: 80,
        background: accent, filter: "blur(40px)", opacity: hover ? 0.3 : 0.1,
        transition: "opacity 0.4s"
      }} />

      <div style={{
        fontSize: 9,
        color: hover ? "#fff" : C.textSub,
        fontFamily: C.syne,
        textTransform: "uppercase",
        letterSpacing: "0.15em",
        marginBottom: 12,
        fontWeight: 800,
        opacity: 0.8
      }}>
        {onClick ? "✦ " : ""}{label}
      </div>
      
      <div style={{
        fontSize: 32,
        fontWeight: 800,
        color: "#fff",
        fontFamily: C.syne,
        letterSpacing: "-0.04em",
        lineHeight: 1,
        display: "flex",
        alignItems: "baseline",
        gap: 6
      }}>
        {value}
        {unit && <span style={{fontSize: 12, color: C.textSub, fontFamily: C.mono, fontWeight: 500}}>{unit}</span>}
      </div>
      
      {sub && (
        <div style={{
          fontSize: 10, color: accent, marginTop: 12, fontFamily: C.sans, 
          fontWeight: 700, display: "flex", alignItems: "center", gap: 6,
          opacity: hover ? 1 : 0.8
        }}>
          <span style={{width: 4, height: 4, borderRadius: "50%", background: accent}} />
          {sub}
        </div>
      )}
    </div>
  );
}


// ── DATA ─────────────────────────────────────────────────────────────────────
const ARTIKEL_PO = {
  "PO-0001":[
    {sku:"ely289",nama:"Airflow Black - S",   size:"S",   warna:"Black",  order:12,cutting:5, jahit:0, kirim:5,  reject:0},
    {sku:"ely290",nama:"Airflow Black - M",   size:"M",   warna:"Black",  order:12,cutting:5, jahit:0, kirim:5,  reject:0},
    {sku:"ely291",nama:"Airflow Black - L",   size:"L",   warna:"Black",  order:15,cutting:5, jahit:0, kirim:5,  reject:0},
    {sku:"ely292",nama:"Airflow Black - XL",  size:"XL",  warna:"Black",  order:15,cutting:15,jahit:5, kirim:5,  reject:0},
    {sku:"ely293",nama:"Airflow Black - XXL", size:"XXL", warna:"Black",  order:15,cutting:14,jahit:5, kirim:5,  reject:0},
    {sku:"ely294",nama:"Airflow Black - XXXL",size:"XXXL",warna:"Black",  order:15,cutting:15,jahit:5, kirim:5,  reject:0},
    {sku:"ely304",nama:"Airflow Skyblue - XL",size:"XL",  warna:"Skyblue",order:15,cutting:15,jahit:0, kirim:0,  reject:0},
    {sku:"ely306",nama:"Airflow Skyblue - XXXL",size:"XXXL",warna:"Skyblue",order:15,cutting:15,jahit:0,kirim:0, reject:0},
    {sku:"ely320",nama:"Airflow Navy - M",    size:"M",   warna:"Navy",   order:12,cutting:5, jahit:0, kirim:0,  reject:0},
    {sku:"ely321",nama:"Airflow Navy - L",    size:"L",   warna:"Navy",   order:15,cutting:8, jahit:3, kirim:3,  reject:0},
    {sku:"ely322",nama:"Airflow Navy - XL",   size:"XL",  warna:"Navy",   order:12,cutting:15,jahit:3, kirim:3,  reject:0},
    {sku:"ely324",nama:"Airflow Navy - XXXL", size:"XXXL",warna:"Navy",   order:15,cutting:18,jahit:3, kirim:3,  reject:0},
  ],
  "PO-0002":[
    {sku:"ely330",nama:"Neck Black - S",    size:"S",   warna:"Black",order:18,cutting:18,jahit:5,kirim:0, reject:0},
    {sku:"ely331",nama:"Neck Black - M",    size:"M",   warna:"Black",order:18,cutting:18,jahit:5,kirim:3, reject:0},
    {sku:"ely332",nama:"Neck Black - L",    size:"L",   warna:"Black",order:18,cutting:18,jahit:5,kirim:3, reject:0},
    {sku:"ely333",nama:"Neck Navy - XXL",   size:"XXL", warna:"Navy", order:18,cutting:8, jahit:3,kirim:3, reject:1},
    {sku:"ely334",nama:"Neck Navy - XXXL",  size:"XXXL",warna:"Navy", order:18,cutting:8, jahit:3,kirim:3, reject:0},
    {sku:"ely335",nama:"Neck Grey - M",     size:"M",   warna:"Grey", order:18,cutting:0, jahit:0,kirim:0, reject:0},
    {sku:"ely336",nama:"Neck Grey - L",     size:"L",   warna:"Grey", order:18,cutting:0, jahit:0,kirim:0, reject:0},
    {sku:"ely338",nama:"Neck Grey - XXL",   size:"XXL", warna:"Grey", order:18,cutting:18,jahit:4,kirim:4, reject:0},
  ],
  "PO-0003":[
    {sku:"ely400",nama:"Storma Black - M",  size:"M",  warna:"Black",order:24,cutting:24,jahit:0,kirim:0,reject:0},
    {sku:"ely401",nama:"Storma Black - L",  size:"L",  warna:"Black",order:24,cutting:24,jahit:0,kirim:0,reject:0},
    {sku:"ely402",nama:"Storma Black - XL", size:"XL", warna:"Black",order:24,cutting:24,jahit:0,kirim:0,reject:0},
    {sku:"ely403",nama:"Storma Navy - M",   size:"M",  warna:"Navy", order:24,cutting:24,jahit:0,kirim:0,reject:0},
    {sku:"ely404",nama:"Storma Navy - L",   size:"L",  warna:"Navy", order:24,cutting:24,jahit:0,kirim:0,reject:0},
    {sku:"ely405",nama:"Storma Navy - XL",  size:"XL", warna:"Navy", order:24,cutting:24,jahit:0,kirim:0,reject:0},
  ],
  "PO-0004":[
    {sku:"ely450",nama:"Dravo Black - M",   size:"M",  warna:"Black",order:36,cutting:35,jahit:0,kirim:0,reject:0},
    {sku:"ely451",nama:"Dravo Black - L",   size:"L",  warna:"Black",order:36,cutting:35,jahit:0,kirim:0,reject:0},
    {sku:"ely452",nama:"Dravo Black - XL",  size:"XL", warna:"Black",order:36,cutting:34,jahit:0,kirim:0,reject:0},
    {sku:"ely453",nama:"Dravo Grey - M",    size:"M",  warna:"Grey", order:36,cutting:36,jahit:0,kirim:0,reject:0},
  ],
};

const PO_LIST = [
  {kode:"PO-0001",model:"Airflow",      klien:"Elyon Store",    qty:168,kirim:34, status:"Parsial",    tahap:{antri:16,cutting:152,jahit:89,lkancing:67,bbenang:67,qc:45,steam:34,packing:34,kirim:34}, cutting:{target:168,real:152,selisih:-16}},
  {kode:"PO-0002",model:"Neck",         klien:"Elyon Store",    qty:162,kirim:16, status:"Parsial",    tahap:{antri:0, cutting:162,jahit:30,lkancing:30,bbenang:30,qc:16,steam:16,packing:16,kirim:16}, cutting:{target:162,real:162,selisih:0}},
  {kode:"PO-0003",model:"Storma",       klien:"Gudang Apparel", qty:144,kirim:0,  status:"Belum Kirim",tahap:{antri:0, cutting:144,jahit:0, lkancing:0, bbenang:0, qc:0, steam:0, packing:0, kirim:0},  cutting:{target:144,real:144,selisih:0}},
  {kode:"PO-0004",model:"Dravo",        klien:"Gudang Apparel", qty:144,kirim:0,  status:"Belum Kirim",tahap:{antri:4, cutting:140,jahit:0, lkancing:0, bbenang:0, qc:0, steam:0, packing:0, kirim:0},  cutting:{target:144,real:140,selisih:-4}},
  {kode:"PO-0005",model:"Zuno Panjang", klien:"Mizan Coll.",    qty:56, kirim:0,  status:"Belum Kirim",tahap:{antri:0, cutting:56, jahit:0, lkancing:0, bbenang:0, qc:0, steam:0, packing:0, kirim:0},  cutting:{target:56, real:56, selisih:0}},
  {kode:"PO-0007",model:"Jimo Panjang", klien:"Mizan Coll.",    qty:52, kirim:0,  status:"Belum Kirim",tahap:{antri:52,cutting:0,  jahit:0, lkancing:0, bbenang:0, qc:0, steam:0, packing:0, kirim:0},  cutting:{target:52, real:0,  selisih:0}},
];

const URGENT = [
  {sku:"ely292",nama:"Airflow Black XL",po:"PO-0001",qty:5, hari:2,ket:"Pesanan khusus konsumen"},
  {sku:"ely333",nama:"Neck Navy XXL",   po:"PO-0002",qty:3, hari:1,ket:"Deadline klien maju"},
  {sku:"ely451",nama:"Dravo Black L",   po:"PO-0004",qty:10,hari:4,ket:"Rush order"},
];

const ACTIVITY = [
  {time:"14:02",msg:"PO-0001 Airflow Navy XL", detail:"antri cutting 15 pcs",   status:"ANTRI",  color:C.yellow},
  {time:"14:04",msg:"EPUL — Jahit",            detail:"selesai 5 pcs Airflow",  status:"SUKSES", color:C.green},
  {time:"14:08",msg:"PO-0004 Dravo Black M",   detail:"cutting selisih -4 pcs", status:"ALERT",  color:C.red},
  {time:"14:12",msg:"ABQI — Kasbon",           detail:"Rp 50.000 diajukan",     status:"KASBON", color:C.purple},
  {time:"14:18",msg:"QC — PO-0001",            detail:"5 pcs cleared",          status:"SYNCED", color:C.cyan},
];

function statusStyle(s) {
  if(s==="Parsial")     return {bg:"#1a2600",text:C.green,  dot:C.green};
  if(s==="Belum Kirim") return {bg:"#1a1040",text:C.purple, dot:C.purple};
  if(s==="Selesai")     return {bg:"#001a20",text:C.cyan,   dot:C.cyan};
  return {bg:C.card,text:C.textSub,dot:C.textSub};
}

// ── ARTIKEL POPUP ─────────────────────────────────────────────────────────────
function ArtikelPopup({poKode,stageKey,stageLabel,onClose}) {
  const all = ARTIKEL_PO[poKode] || [];
  const getVal = a => {
    if(stageKey==="antri")    return a.order - a.cutting;
    if(stageKey==="cutting")  return a.cutting;
    if(stageKey==="jahit")    return a.jahit;
    if(stageKey==="kirim")    return a.kirim;
    return a.cutting;
  };
  const getSelisih = a => {
    if(stageKey==="cutting") return a.cutting - a.order;
    return null;
  };
  const rows = stageKey==="antri"
    ? all.filter(a=>a.order-a.cutting>0)
    : stageKey==="cutting"
      ? all
      : all.filter(a=>getVal(a)>0);

  const headers = stageKey==="cutting"
    ? ["SKU","Nama Produk","Size","Warna","Order","Cutting","Selisih"]
    : stageKey==="antri"
      ? ["SKU","Nama Produk","Size","Warna","Order","Belum Cutting"]
      : stageKey==="kirim"
        ? ["SKU","Nama Produk","Size","Warna","Terkirim","Sisa","Status"]
        : ["SKU","Nama Produk","Size","Warna","Order",stageLabel,"Sisa"];

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:3000,padding:20}}
      onClick={onClose}>
      <div style={{background:C.card,borderRadius:16,width:"100%",maxWidth:740,maxHeight:"80vh",overflowY:"auto",border:`1px solid ${C.border}`,boxShadow:`0 0 40px ${C.cyan}18`}}
        onClick={e=>e.stopPropagation()}>
        <div style={{padding:"14px 20px",borderBottom:`1px solid ${C.border}`,background:C.card2,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <MacDots/>
            <span style={{fontSize:12,fontWeight:700,color:C.text,fontFamily:C.sans}}>Detail Tahap: {stageLabel} — {poKode}</span>
          </div>
          <button onClick={onClose} style={{background:"transparent",border:`1px solid ${C.border}`,borderRadius:6,color:C.textSub,cursor:"pointer",fontSize:16,width:28,height:28}}>×</button>
        </div>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",minWidth:600}}>
            <thead>
              <tr style={{background:`${C.border}55`}}>
                {headers.map(h=>(
                  <th key={h} style={{padding:"9px 14px",textAlign:"left",fontSize:9,fontWeight:700,color:C.textSub,textTransform:"uppercase",letterSpacing:"0.07em",fontFamily:C.sans,whiteSpace:"nowrap"}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length===0
                ? <tr><td colSpan={headers.length} style={{padding:"28px",textAlign:"center",color:C.textMid,fontFamily:C.sans,fontSize:13}}>Tidak ada data untuk tahap ini</td></tr>
                : rows.map((a,i)=>{
                  const sel=getSelisih(a);
                  const val=getVal(a);
                  const sisa=stageKey==="kirim"?a.order-a.kirim:stageKey==="antri"?a.order-a.cutting:a.order-val;
                  return (
                    <tr key={a.sku} style={{borderBottom:`1px solid ${C.border}`,background:i%2===0?C.card:C.card2}}>
                      <td style={{padding:"10px 14px",fontSize:11,fontWeight:700,color:C.cyan,fontFamily:C.mono,whiteSpace:"nowrap"}}>{a.sku}</td>
                      <td style={{padding:"10px 14px",fontSize:12,color:C.text,fontFamily:C.sans}}>{a.nama}</td>
                      <td style={{padding:"10px 14px",fontSize:11,color:C.textSub,fontFamily:C.mono}}>{a.size}</td>
                      <td style={{padding:"10px 14px",fontSize:11,color:C.textSub,fontFamily:C.sans}}>{a.warna}</td>
                      <td style={{padding:"10px 14px",fontSize:12,fontWeight:700,color:C.text,fontFamily:C.mono}}>{a.order}</td>
                      {stageKey==="antri"
                        ? <td style={{padding:"10px 14px",fontSize:12,fontWeight:700,color:C.yellow,fontFamily:C.mono}}>{a.order-a.cutting}</td>
                        : stageKey==="cutting"
                          ? <>
                              <td style={{padding:"10px 14px",fontSize:12,fontWeight:700,color:C.text,fontFamily:C.mono}}>{a.cutting}</td>
                              <td style={{padding:"10px 14px",fontSize:12,fontWeight:700,color:sel<0?C.red:sel>0?C.green:C.textMid,fontFamily:C.mono}}>{sel===0?"OK":sel}</td>
                            </>
                          : stageKey==="kirim"
                            ? <>
                                <td style={{padding:"10px 14px",fontSize:12,fontWeight:700,color:C.green,fontFamily:C.mono}}>{a.kirim}</td>
                                <td style={{padding:"10px 14px",fontSize:12,fontWeight:700,color:sisa>0?C.yellow:C.textMid,fontFamily:C.mono}}>{sisa}</td>
                                <td style={{padding:"10px 14px"}}>
                                  <span style={{fontSize:10,fontWeight:700,color:a.kirim>=a.order?C.green:a.kirim>0?C.yellow:C.textMid,
                                    background:a.kirim>=a.order?"#1a2600":a.kirim>0?"#1a1000":"transparent",
                                    padding:"2px 8px",borderRadius:4,fontFamily:C.sans}}>
                                    {a.kirim>=a.order?"Selesai":a.kirim>0?"Parsial":"Belum"}
                                  </span>
                                </td>
                              </>
                            : <>
                                <td style={{padding:"10px 14px",fontSize:12,fontWeight:700,color:C.text,fontFamily:C.mono}}>{val}</td>
                                <td style={{padding:"10px 14px",fontSize:12,fontWeight:700,color:sisa>0?C.yellow:C.green,fontFamily:C.mono}}>{sisa}</td>
                              </>
                      }
                    </tr>
                  );
                })
              }
            </tbody>
          </table>
        </div>
        <div style={{padding:"10px 16px",background:`${C.border}33`,display:"flex",gap:20}}>
          <span style={{fontSize:11,color:C.textSub,fontFamily:C.sans}}>Total artikel: <strong style={{color:C.text}}>{rows.length}</strong></span>
          <span style={{fontSize:11,color:C.textSub,fontFamily:C.sans}}>Total qty: <strong style={{color:C.cyan,fontFamily:C.mono}}>{rows.reduce((a,r)=>a+getVal(r),0)} pcs</strong></span>
        </div>
      </div>
    </div>
  );
}

// ── STAGE BUTTON ─────────────────────────────────────────────────────────────
function StageBtn({stageKey,label,qty,qtyOrder,color,onClick}) {
  const p = qtyOrder===0?0:Math.min(100,Math.round((qty/qtyOrder)*100));
  const done = p>=100;
  const active = qty>0 && !done;
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
      <button onClick={()=>onClick(stageKey,label)}
        style={{
          width:52,height:52,borderRadius:12,cursor:"pointer",
          background:done?"#0d2a0d":active?C.cyanBg:C.card2,
          border:`2px solid ${done?C.green:active?color:C.border}`,
          display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:2,
          transition:"all 0.12s",
        }}
        onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow=`0 6px 16px ${color}30`;}}
        onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";}}
        title={`Klik detail ${label}`}
      >
        <span style={{fontSize:14,fontWeight:800,color:done?C.green:active?color:C.textMid,fontFamily:C.mono,lineHeight:1}}>{qty}</span>
        <span style={{fontSize:8,color:done?C.green:active?color:C.textMid,fontFamily:C.mono}}>{p}%</span>
      </button>
      <span style={{fontSize:9,color:C.textSub,fontFamily:C.sans,textTransform:"uppercase",letterSpacing:"0.04em",textAlign:"center",maxWidth:56,lineHeight:1.2}}>{label}</span>
    </div>
  );
}

// ── PO DETAIL PANEL ──────────────────────────────────────────────────────────
function PODetailPanel({po,onClose}) {
  const [popup,setPopup]=useState(null);
  const sisa = po.qty - po.kirim;

  const stages=[
    {key:"antri",   label:"Antri",     qty:po.tahap.antri,   color:C.textSub},
    {key:"cutting", label:"Cutting",   qty:po.tahap.cutting, color:C.yellow},
    {key:"jahit",   label:"Jahit",     qty:po.tahap.jahit,   color:C.blue},
    {key:"lkancing",label:"L.Kancing", qty:po.tahap.lkancing,color:C.purple},
    {key:"bbenang", label:"Buang BB",  qty:po.tahap.bbenang, color:C.cyan},
    {key:"qc",      label:"QC",        qty:po.tahap.qc,      color:C.orange},
    {key:"steam",   label:"Steam",     qty:po.tahap.steam,   color:C.green},
    {key:"packing", label:"Packing",   qty:po.tahap.packing, color:C.green},
    {key:"kirim",   label:"Kirim",     qty:po.tahap.kirim,   color:C.green},
  ];

  const sc=statusStyle(po.status);

  return (
    <>
      <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.65)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:2000,padding:20}}
        onClick={onClose}>
        <div style={{background:C.card,borderRadius:18,width:"100%",maxWidth:760,maxHeight:"90vh",overflowY:"auto",border:`1px solid ${C.border}`,boxShadow:`0 0 60px ${C.cyan}14`}}
          onClick={e=>e.stopPropagation()}>

          {/* Header */}
          <div style={{padding:"16px 24px",borderBottom:`1px solid ${C.border}`,background:C.card2,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{display:"flex",alignItems:"center",gap:14}}>
              <MacDots/>
              <div>
                <div style={{fontSize:10,color:C.textSub,fontFamily:C.mono,letterSpacing:"0.08em"}}>Detail PO</div>
                <div style={{fontSize:22,fontWeight:800,color:C.text,fontFamily:C.syne,letterSpacing:"-0.02em",marginTop:1}}>
                  {po.kode} — {po.model}
                </div>
                <div style={{fontSize:12,color:C.textSub,fontFamily:C.sans,marginTop:2}}>
                  Klien: <span style={{color:C.cyan}}>{po.klien}</span>
                  <span style={{margin:"0 8px",color:C.textMid}}>·</span>
                  <span style={{fontSize:10,fontWeight:700,background:sc.bg,color:sc.text,padding:"2px 8px",borderRadius:99,display:"inline-flex",alignItems:"center",gap:4}}>
                    <span style={{width:5,height:5,borderRadius:"50%",background:sc.dot}}/>
                    {po.status}
                  </span>
                </div>
              </div>
            </div>
            <button onClick={onClose} style={{background:C.card2,border:`1px solid ${C.border}`,borderRadius:8,color:C.textSub,cursor:"pointer",fontSize:18,width:34,height:34,lineHeight:1}}>×</button>
          </div>

          <div style={{padding:"20px 24px"}}>
            {/* KPI — qty only, no finansial */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:24}}>
              <KpiCard label="Qty Order"      value={po.qty}          accent={C.cyan}   glow={false}
                sub="Klik untuk detail artikel →"
                onClick={()=>setPopup({key:"cutting",label:"Semua Artikel"})}/>
              <KpiCard label="Terkirim"       value={po.kirim}        accent={C.green}  glow={false}
                sub="Klik untuk detail pengiriman →"
                onClick={()=>setPopup({key:"kirim",label:"Status Pengiriman"})}/>
              <KpiCard label="Sisa"           value={sisa}            accent={sisa>0?C.yellow:C.green} glow={false}/>
              <KpiCard label="Cutting Selisih"
                value={po.cutting.selisih===0?"✓ OK":po.cutting.selisih+" pcs"}
                accent={po.cutting.selisih<0?C.red:C.green} glow={po.cutting.selisih<0}
                sub={po.cutting.selisih!==0?"Klik untuk detail →":undefined}
                onClick={po.cutting.selisih!==0?()=>setPopup({key:"cutting",label:"Detail Selisih Cutting"}):undefined}/>
            </div>

            {/* Alur tahap */}
            <div style={{marginBottom:8}}>
              <div style={{fontSize:10,color:C.textSub,fontFamily:C.mono,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:14}}>
                Alur Produksi — klik tahap untuk detail artikel
              </div>
              <div style={{display:"flex",gap:8,alignItems:"flex-start",flexWrap:"wrap"}}>
                {stages.map((s,i)=>(
                  <div key={s.key} style={{display:"flex",alignItems:"center",gap:8}}>
                    <StageBtn
                      stageKey={s.key} label={s.label} qty={s.qty}
                      qtyOrder={po.qty} color={s.color}
                      onClick={(k,l)=>setPopup({key:k,label:l})}
                    />
                    {i<stages.length-1&&<div style={{width:10,height:1,background:C.border,marginBottom:18}}/>}
                  </div>
                ))}
              </div>
            </div>

            {/* Cutting selisih alert */}
            {po.cutting.selisih<0 && (
              <div style={{marginTop:16,padding:"12px 16px",background:"#1a0000",border:`1px solid ${C.red}44`,borderRadius:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div style={{fontSize:10,color:C.red,fontFamily:C.mono,letterSpacing:"0.08em",marginBottom:3}}>⚠ CUTTING SELISIH TERDETEKSI</div>
                  <div style={{fontSize:12,color:C.textSub,fontFamily:C.sans}}>Target {po.cutting.target} pcs · Realisasi {po.cutting.real} pcs</div>
                </div>
                <div style={{fontSize:26,fontWeight:800,color:C.red,fontFamily:C.syne}}>{po.cutting.selisih} pcs</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Artikel Popup */}
      {popup && (
        <ArtikelPopup
          poKode={po.kode}
          stageKey={popup.key}
          stageLabel={popup.label}
          onClose={()=>setPopup(null)}
        />
      )}
    </>
  );
}

// ── DASHBOARD PRODUKSI ───────────────────────────────────────────────────────
function DashProduksi({onNavTo}) {
  const [selectedPO,setSelectedPO]=useState(null);

  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:12,marginBottom:20}}>
        <KpiCard label="Active PO"     value="10"       unit="orders"  accent={C.cyan}   glow={true}/>
        <KpiCard label="Total Order"   value="978"      unit="pcs"     accent={C.green}  glow={false}/>
        <KpiCard label="Terkirim"      value="66"       unit="pcs"     accent={C.green}  glow={false}/>
        <KpiCard label="Margin Est."   value="Rp 12,4M" unit=""        accent={C.yellow} glow={false}/>
        <KpiCard label="Alert Cutting" value="2"        unit="selisih" accent={C.red}    glow={true}/>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 300px",gap:16,marginBottom:0}}>
        <Panel title="Purchase Order — Status Produksi" action="Lihat Semua →" onAction={()=>onNavTo("produksi","Monitoring")}>
          {/* Table dengan overflow scroll horizontal */}
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",minWidth:700}}>
              <thead>
                <tr style={{background:`${C.border}55`}}>
                  {["Kode PO","Model","Klien","Order","Kirim","Status","⚠",""].map(h=>(
                    <th key={h} style={{padding:"9px 14px",textAlign:"left",fontSize:9,fontWeight:700,color:C.textSub,textTransform:"uppercase",letterSpacing:"0.07em",fontFamily:C.sans,whiteSpace:"nowrap"}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PO_LIST.map((po,i)=>{
                  const sc=statusStyle(po.status);
                  const pct=Math.round((po.kirim/po.qty)*100);
                  return (
                    <tr key={po.kode}
                      style={{borderBottom:i<PO_LIST.length-1?`1px solid ${C.border}`:"none",cursor:"pointer",transition:"background 0.1s"}}
                      onMouseEnter={e=>e.currentTarget.style.background=C.cyanBg}
                      onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                    >
                      <td style={{padding:"13px 14px",fontSize:12,fontWeight:700,color:C.cyan,fontFamily:C.mono,whiteSpace:"nowrap"}}>{po.kode}</td>
                      <td style={{padding:"13px 14px",fontSize:12,fontWeight:600,color:C.text,fontFamily:C.sans}}>{po.model}</td>
                      <td style={{padding:"13px 14px",fontSize:11,color:C.textSub,fontFamily:C.sans,whiteSpace:"nowrap"}}>{po.klien}</td>
                      <td style={{padding:"13px 14px",fontSize:12,fontWeight:700,color:C.text,fontFamily:C.mono}}>{po.qty}</td>
                      <td style={{padding:"13px 14px",minWidth:70}}>
                        <div style={{fontSize:12,fontWeight:700,color:C.green,fontFamily:C.mono}}>{po.kirim}</div>
                        <ProgBar pct={pct} color={C.green}/>
                      </td>
                      <td style={{padding:"13px 14px",whiteSpace:"nowrap"}}>
                        <span style={{fontSize:10,fontWeight:700,background:sc.bg,color:sc.text,padding:"3px 8px",borderRadius:99,display:"inline-flex",alignItems:"center",gap:4,fontFamily:C.sans}}>
                          <span style={{width:5,height:5,borderRadius:"50%",background:sc.dot}}/>
                          {po.status}
                        </span>
                      </td>
                      <td style={{padding:"13px 14px",fontSize:13}}>{po.cutting.selisih<0?"🔴":""}</td>
                      <td style={{padding:"13px 14px"}}>
                        <button onClick={()=>setSelectedPO(po)}
                          style={{fontSize:10,fontWeight:700,padding:"5px 12px",borderRadius:7,border:`1px solid ${C.cyanDim}`,background:C.cyanBg,color:C.cyan,cursor:"pointer",fontFamily:C.sans,whiteSpace:"nowrap",transition:"all 0.1s"}}
                          onMouseEnter={e=>{e.currentTarget.style.background=C.cyanDim;}}
                          onMouseLeave={e=>{e.currentTarget.style.background=C.cyanBg;}}
                        >Buka →</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title="System // Active Log">
          <div style={{padding:"8px 0"}}>
            {ACTIVITY.map((a,i)=>(
              <div key={i} style={{display:"flex",gap:10,padding:"9px 16px",borderBottom:i<ACTIVITY.length-1?`1px solid ${C.border}`:"none",alignItems:"flex-start"}}>
                <span style={{fontSize:9,color:C.textSub,fontFamily:C.mono,marginTop:2,whiteSpace:"nowrap"}}>{a.time}</span>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:11,fontWeight:600,color:C.text,fontFamily:C.sans}}>{a.msg}</div>
                  <div style={{fontSize:10,color:C.textSub,marginTop:1}}>{a.detail}</div>
                </div>
                <span style={{fontSize:8,color:a.color,fontWeight:700,background:`${a.color}18`,padding:"2px 6px",borderRadius:4,fontFamily:C.mono,whiteSpace:"nowrap"}}>{a.status}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel title="⚡ Urgent — Deadline Artikel">
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",minWidth:500}}>
            <thead>
              <tr style={{background:`${C.border}55`}}>
                {["SKU","Nama Produk","Kode PO","QTY","Tenggat","Keterangan"].map(h=>(
                  <th key={h} style={{padding:"9px 14px",textAlign:"left",fontSize:9,fontWeight:700,color:C.textSub,textTransform:"uppercase",letterSpacing:"0.07em",fontFamily:C.sans,whiteSpace:"nowrap"}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {URGENT.map((u,i)=>(
                <tr key={u.sku} style={{borderBottom:i<URGENT.length-1?`1px solid ${C.border}`:"none"}}>
                  <td style={{padding:"12px 14px",fontSize:11,fontWeight:700,color:C.cyan,fontFamily:C.mono}}>{u.sku}</td>
                  <td style={{padding:"12px 14px",fontSize:12,fontWeight:600,color:C.text,fontFamily:C.sans}}>{u.nama}</td>
                  <td style={{padding:"12px 14px",fontSize:11,color:C.textSub,fontFamily:C.mono}}>{u.po}</td>
                  <td style={{padding:"12px 14px",fontSize:12,fontWeight:700,color:C.yellow,fontFamily:C.mono}}>{u.qty} pcs</td>
                  <td style={{padding:"12px 14px"}}>
                    <span style={{fontSize:11,fontWeight:700,color:u.hari<=2?C.red:C.yellow,fontFamily:C.mono,background:u.hari<=2?`${C.red}18`:`${C.yellow}18`,padding:"2px 8px",borderRadius:4}}>
                      {u.hari}h
                    </span>
                  </td>
                  <td style={{padding:"12px 14px",fontSize:11,color:C.textSub,fontFamily:C.sans}}>{u.ket}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {selectedPO && <PODetailPanel po={selectedPO} onClose={()=>setSelectedPO(null)}/>}
    </div>
  );
}

// ── DASHBOARD KEUANGAN ───────────────────────────────────────────────────────
const PENGELUARAN=[
  {bulan:"Februari",bahan:8200000, upah:4500000,ops:3200000,listrik:900000, makan:1800000},
  {bulan:"Maret",   bahan:11500000,upah:5200000,ops:4100000,listrik:950000, makan:1800000},
  {bulan:"April",   bahan:10810000,upah:3200000,ops:2800000,listrik:504000, makan:1800000},
];
const PINJAMAN=[
  {sumber:"BCA KMK", jumlah:50000000,cicilan:2500000,sisaPokok:45000000,jatuhTempo:"2028-01-15",mulai:"2026-01-15"},
  {sumber:"Koperasi",jumlah:10000000,cicilan:500000, sisaPokok:9500000, jatuhTempo:"2027-03-01",mulai:"2026-03-01"},
];
const PO_KEU=[
  {kode:"PO-0001",model:"Airflow",      hpp:13554600,jual:14512344,real:10200000},
  {kode:"PO-0002",model:"Neck",         hpp:14175450,jual:13980600,real:9800000},
  {kode:"PO-0003",model:"Storma",       hpp:11354400,jual:11448000,real:4500000},
  {kode:"PO-0004",model:"Dravo",        hpp:11246400,jual:12316416,real:3200000},
  {kode:"PO-0005",model:"Zuno Panjang", hpp:2934000, jual:3910208, real:1200000},
  {kode:"PO-0007",model:"Jimo Panjang", hpp:2301000, jual:2550028, real:0},
];

function DashKeuangan() {
  const [filterBulan,setFilterBulan]=useState("Semua");
  const totJual=PO_KEU.reduce((a,p)=>a+p.jual,0);
  const totHpp=PO_KEU.reduce((a,p)=>a+p.hpp,0);
  const totReal=PO_KEU.reduce((a,p)=>a+p.real,0);
  const margEst=totJual-totHpp;
  const margReal=totJual-totReal;
  const gap=margEst-margReal;
  const totPinjaman=PINJAMAN.reduce((a,p)=>a+p.sisaPokok,0);
  const pengeluaranFiltered=filterBulan==="Semua"?PENGELUARAN:PENGELUARAN.filter(p=>p.bulan===filterBulan);
  const totPengeluaran=pengeluaranFiltered.reduce((a,p)=>a+p.bahan+p.upah+p.ops+p.listrik+p.makan,0);

  return (
    <div>
      <div style={{display:"flex",gap:8,marginBottom:20,alignItems:"center"}}>
        <span style={{fontSize:11,color:C.textSub,fontFamily:C.sans,marginRight:4}}>Filter:</span>
        {["Semua","Februari","Maret","April"].map(b=>(
          <button key={b} onClick={()=>setFilterBulan(b)}
            style={{padding:"5px 14px",borderRadius:6,border:`1px solid ${filterBulan===b?C.cyan:C.border}`,background:filterBulan===b?C.cyanBg:"transparent",color:filterBulan===b?C.cyan:C.textSub,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:C.sans,transition:"all 0.1s"}}>
            {b}
          </button>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:12,marginBottom:20}}>
        <KpiCard label="Total Harga Jual" value={rp(totJual)}  unit="" accent={C.cyan}   glow={false}/>
        <KpiCard label="Margin Estimasi"  value={rp(margEst)}  unit={`${Math.round((margEst/totJual)*100)}% dari jual`} accent={C.green}  glow={false}/>
        <KpiCard label="Margin Real"      value={rp(margReal)} unit={`${Math.round((margReal/totJual)*100)}% dari jual`} accent={margReal<margEst?C.yellow:C.green} glow={false}/>
        <KpiCard label="Saldo Kas"        value="Rp 8,1M"      unit="BCA Konveksi"      accent={C.blue}   glow={false}/>
        <KpiCard label="Sisa Pinjaman"    value={rp(totPinjaman)} unit="di luar margin"  accent={C.red}    glow={false}/>
      </div>
      {gap>0&&(
        <div style={{marginBottom:16,padding:"14px 20px",background:"#1a0000",border:`1px solid ${C.red}44`,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <div style={{fontSize:10,color:C.red,fontFamily:C.mono,letterSpacing:"0.1em",marginBottom:4}}>⚠ GAP MARGIN — KEMUNGKINAN KEBOCORAN OPERASIONAL</div>
            <div style={{fontSize:11,color:C.textSub,fontFamily:C.sans}}>Margin estimasi lebih tinggi {rp(gap)} dari margin real saat ini</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:10,color:C.textSub,fontFamily:C.sans}}>Gap</div>
            <div style={{fontSize:24,fontWeight:800,color:C.red,fontFamily:C.syne}}>-{rp(gap)}</div>
          </div>
        </div>
      )}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:0}}>
        <Panel title="Margin Estimasi vs Real per PO">
          <div style={{padding:"16px 18px"}}>
            {PO_KEU.map(po=>{
              const mE=po.jual-po.hpp,mR=po.real>0?po.jual-po.real:null;
              const mEP=Math.round((mE/po.jual)*100),mRP=mR!==null?Math.round((mR/po.jual)*100):null;
              return (
                <div key={po.kode} style={{marginBottom:16}}>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:6}}>
                    <span style={{color:C.text,fontFamily:C.sans,fontWeight:600}}>{po.kode} — {po.model}</span>
                    <div style={{display:"flex",gap:12}}>
                      <span style={{color:C.green,fontFamily:C.mono,fontSize:10}}>Est: {rp(mE)}</span>
                      <span style={{color:mR===null?C.textMid:mR<mE?C.red:C.green,fontFamily:C.mono,fontSize:10}}>Real: {mR===null?"—":rp(mR)}</span>
                    </div>
                  </div>
                  <div style={{height:5,background:C.border,borderRadius:99,overflow:"hidden",marginBottom:3}}>
                    <div style={{height:"100%",width:`${Math.min(mEP*2,100)}%`,background:C.green,borderRadius:99,opacity:0.5}}/>
                  </div>
                  <div style={{height:5,background:C.border,borderRadius:99,overflow:"hidden"}}>
                    <div style={{height:"100%",width:mRP!==null?`${Math.min(mRP*2,100)}%`:"0%",background:mR!==null&&mR<mE?C.red:C.cyan,borderRadius:99}}/>
                  </div>
                  <div style={{display:"flex",gap:12,marginTop:3}}>
                    <span style={{fontSize:9,color:C.textMid,fontFamily:C.mono}}>▬ Est ({mEP}%)</span>
                    <span style={{fontSize:9,color:C.textMid,fontFamily:C.mono}}>▬ Real ({mRP!==null?mRP+"%":"—"})</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>
        <div>
          <Panel title="Ringkasan Kas">
            <div style={{padding:"14px 18px"}}>
              {[{label:"Kas Masuk",val:"Rp 23,4M",color:C.green},{label:"Kas Keluar",val:"Rp 15,2M",color:C.red},{label:"Saldo",val:"Rp 8,1M",color:C.cyan}].map(r=>(
                <div key={r.label} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:`1px solid ${C.border}`}}>
                  <span style={{fontSize:12,color:C.textSub,fontFamily:C.sans}}>{r.label}</span>
                  <span style={{fontSize:15,fontWeight:800,color:r.color,fontFamily:C.syne}}>{r.val}</span>
                </div>
              ))}
            </div>
          </Panel>
          <Panel title="Pengeluaran Operasional" action={filterBulan}>
            <div style={{padding:"12px 18px"}}>
              {pengeluaranFiltered.map(p=>(
                <div key={p.bulan} style={{marginBottom:14}}>
                  <div style={{fontSize:10,color:C.cyan,fontFamily:C.mono,letterSpacing:"0.08em",marginBottom:8,display:"flex",justifyContent:"space-between"}}>
                    <span>{p.bulan.toUpperCase()}</span>
                    <span style={{color:C.textSub}}>{rp(p.bahan+p.upah+p.ops+p.listrik+p.makan)}</span>
                  </div>
                  {[{l:"Bahan baku",v:p.bahan,c:C.blue},{l:"Upah",v:p.upah,c:C.purple},{l:"Operasional",v:p.ops,c:C.orange},{l:"Listrik/sewa",v:p.listrik,c:C.cyan},{l:"Makan",v:p.makan,c:C.green}].map(item=>(
                    <div key={item.l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 0",borderBottom:`1px solid ${C.border}`}}>
                      <div style={{display:"flex",alignItems:"center",gap:7}}>
                        <div style={{width:7,height:7,borderRadius:"50%",background:item.c}}/>
                        <span style={{fontSize:11,color:C.textSub,fontFamily:C.sans}}>{item.l}</span>
                      </div>
                      <span style={{fontSize:11,fontWeight:700,color:C.text,fontFamily:C.mono}}>{rp(item.v)}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </Panel>
          <Panel title="Pinjaman (Terpisah dari Margin)">
            <div style={{padding:"10px 18px 4px"}}>
              <div style={{padding:"8px 12px",background:"#1a0000",border:`1px solid ${C.red}33`,borderRadius:8,marginBottom:12}}>
                <div style={{fontSize:10,color:C.red,fontFamily:C.sans,fontWeight:600}}>⚠ Sisa pinjaman tidak masuk kalkulasi margin</div>
              </div>
              {PINJAMAN.map((p,i)=>{
                const lP=Math.round(((p.jumlah-p.sisaPokok)/p.jumlah)*100);
                return (
                  <div key={i} style={{padding:"12px 0",borderBottom:i<PINJAMAN.length-1?`1px solid ${C.border}`:"none"}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                      <div style={{fontSize:13,fontWeight:700,color:C.text,fontFamily:C.sans}}>{p.sumber}</div>
                      <div style={{fontSize:12,fontWeight:700,color:C.red,fontFamily:C.mono}}>{rp(p.jumlah)}</div>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:8}}>
                      {[{l:"Cicilan/bulan",v:rp(p.cicilan)},{l:"Sisa pokok",v:rp(p.sisaPokok)},{l:"Jatuh tempo",v:p.jatuhTempo},{l:"Mulai",v:p.mulai}].map(it=>(
                        <div key={it.l}>
                          <div style={{fontSize:9,color:C.textMid,fontFamily:C.sans,textTransform:"uppercase",letterSpacing:"0.06em"}}>{it.l}</div>
                          <div style={{fontSize:11,fontWeight:600,color:C.text,fontFamily:C.mono}}>{it.v}</div>
                        </div>
                      ))}
                    </div>
                    <ProgBar pct={lP} color={C.green}/>
                    <div style={{fontSize:9,color:C.textMid,fontFamily:C.sans,marginTop:3}}>Lunas {lP}%</div>
                  </div>
                );
              })}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

// ── DASHBOARD PENGGAJIAN ─────────────────────────────────────────────────────
const KARYAWAN=[
  {nama:"EPUL",   role:"Jahit",        pcs:30,  upah:630000,  kasbonTotal:0,      kasbonTerbayar:0,      target:"Capai",reject:0,deduction:0},
  {nama:"ABQI",   role:"Cutting",      pcs:362, upah:844500,  kasbonTotal:50000,  kasbonTerbayar:0,      target:"—",    reject:0,deduction:0},
  {nama:"BB",     role:"Buang Benang", pcs:30,  upah:10500,   kasbonTotal:0,      kasbonTerbayar:0,      target:"Tidak",reject:2,deduction:7000},
  {nama:"UJANG",  role:"Jahit",        pcs:18,  upah:378000,  kasbonTotal:200000, kasbonTerbayar:100000, target:"—",    reject:1,deduction:21000},
  {nama:"QC",     role:"QC",           pcs:30,  upah:15000,   kasbonTotal:0,      kasbonTerbayar:0,      target:"Capai",reject:0,deduction:0},
  {nama:"Packing",role:"Packing",      pcs:30,  upah:4500,    kasbonTotal:0,      kasbonTerbayar:0,      target:"Tidak",reject:0,deduction:0},
];
const DETAIL_KERJA={
  EPUL:[
    {sku:"ely321",nama:"Airflow Navy L",   pcs:3,total:63000, rejectQty:0,alasan:"—",            statusRework:"—"},
    {sku:"ely322",nama:"Airflow Navy XL",  pcs:3,total:63000, rejectQty:0,alasan:"—",            statusRework:"—"},
    {sku:"ely292",nama:"Airflow Black XL", pcs:5,total:105000,rejectQty:0,alasan:"—",            statusRework:"—"},
  ],
  BB:[
    {sku:"ely321",nama:"Airflow Navy L",   pcs:3,total:1050,  rejectQty:1,alasan:"Jahitan miring",     statusRework:"Belum diperbaiki"},
    {sku:"ely292",nama:"Airflow Black XL", pcs:5,total:1750,  rejectQty:1,alasan:"Lubang kancing miring",statusRework:"Sudah diperbaiki"},
  ],
  UJANG:[
    {sku:"ely333",nama:"Neck Navy XXL",   pcs:3,total:63000, rejectQty:1,alasan:"Jahitan loncat",statusRework:"Belum diperbaiki"},
    {sku:"ely334",nama:"Neck Navy XXXL",  pcs:3,total:63000, rejectQty:0,alasan:"—",            statusRework:"—"},
  ],
  ABQI:[
    {sku:"ely289",nama:"Airflow Black S",  pcs:5,total:7500,  rejectQty:0,alasan:"—",statusRework:"—"},
    {sku:"ely290",nama:"Airflow Black M",  pcs:5,total:7500,  rejectQty:0,alasan:"—",statusRework:"—"},
    {sku:"ely292",nama:"Airflow Black XL", pcs:15,total:22500,rejectQty:0,alasan:"—",statusRework:"—"},
  ],
};

function DashPenggajian() {
  const [detail,setDetail]=useState(null);
  const totUpah=KARYAWAN.reduce((a,k)=>a+k.upah-k.deduction,0);
  const totKasbon=KARYAWAN.reduce((a,k)=>a+k.kasbonTotal,0);
  const totSisaKasbon=KARYAWAN.reduce((a,k)=>a+(k.kasbonTotal-k.kasbonTerbayar),0);

  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
        <KpiCard label="Total Karyawan"    value={KARYAWAN.length} unit="aktif minggu ini"  accent={C.purple} glow={false}/>
        <KpiCard label="Total Upah Bersih" value={rp(totUpah)}     unit="setelah deduction" accent={C.green}  glow={false}/>
        <KpiCard label="Total Kasbon"      value={rp(totKasbon)}   unit="keseluruhan"        accent={C.yellow} glow={false}/>
        <KpiCard label="Sisa Kasbon"       value={rp(totSisaKasbon)}unit="belum terbayar"   accent={C.red}    glow={false}/>
      </div>
      <Panel title="Rekap Gaji — 4 Apr–10 Apr 2026" action="Export PDF">
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",minWidth:780}}>
            <thead>
              <tr style={{background:`${C.border}55`}}>
                {["Karyawan","Role","Pcs","Upah Bersih","Kasbon","Sisa Kasbon","Deduction","Target","Detail"].map(h=>(
                  <th key={h} style={{padding:"9px 14px",textAlign:"left",fontSize:9,fontWeight:700,color:C.textSub,textTransform:"uppercase",letterSpacing:"0.06em",fontFamily:C.sans,whiteSpace:"nowrap"}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {KARYAWAN.map((k,i)=>{
                const sisa=k.kasbonTotal-k.kasbonTerbayar;
                return (
                  <tr key={k.nama}
                    style={{borderBottom:i<KARYAWAN.length-1?`1px solid ${C.border}`:"none",background:detail===k.nama?C.cyanBg:"transparent",transition:"background 0.1s"}}>
                    <td style={{padding:"13px 14px",fontSize:13,fontWeight:700,color:C.text,fontFamily:C.sans}}>{k.nama}</td>
                    <td style={{padding:"13px 14px",fontSize:11,color:C.textSub,fontFamily:C.sans,whiteSpace:"nowrap"}}>{k.role}</td>
                    <td style={{padding:"13px 14px",fontSize:12,fontWeight:700,color:C.text,fontFamily:C.mono}}>{k.pcs}</td>
                    <td style={{padding:"13px 14px",fontSize:12,fontWeight:700,color:C.green,fontFamily:C.mono,whiteSpace:"nowrap"}}>{rp(k.upah-k.deduction)}</td>
                    <td style={{padding:"13px 14px",fontSize:12,color:k.kasbonTotal>0?C.yellow:C.textMid,fontFamily:C.mono,whiteSpace:"nowrap"}}>{k.kasbonTotal>0?rp(k.kasbonTotal):"—"}</td>
                    <td style={{padding:"13px 14px",fontSize:12,color:sisa>0?C.red:C.textMid,fontFamily:C.mono,whiteSpace:"nowrap"}}>{sisa>0?rp(sisa):"—"}</td>
                    <td style={{padding:"13px 14px",fontSize:12,color:k.deduction>0?C.red:C.textMid,fontFamily:C.mono,whiteSpace:"nowrap"}}>{k.deduction>0?`-${rp(k.deduction)}`:"—"}</td>
                    <td style={{padding:"13px 14px"}}>
                      <span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:99,fontFamily:C.sans,
                        background:k.target==="Capai"?"#1a2600":k.target==="Tidak"?"#2d0707":C.card,
                        color:k.target==="Capai"?C.green:k.target==="Tidak"?C.red:C.textSub}}>
                        {k.target}
                      </span>
                    </td>
                    <td style={{padding:"13px 14px"}}>
                      <button onClick={()=>setDetail(detail===k.nama?null:k.nama)}
                        style={{fontSize:10,fontWeight:700,padding:"4px 10px",borderRadius:6,border:`1px solid ${C.border2}`,background:detail===k.nama?C.cyanDim:C.card2,color:detail===k.nama?C.cyan:C.textSub,cursor:"pointer",fontFamily:C.sans,whiteSpace:"nowrap"}}>
                        {detail===k.nama?"Tutup":"Detail"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>

      {detail && (
        <div>
          {DETAIL_KERJA[detail] && (
            <Panel title={`Detail Pekerjaan — ${detail}`}>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",minWidth:620}}>
                  <thead>
                    <tr style={{background:`${C.border}55`}}>
                      {["SKU","Nama Produk","Pcs","Total Upah","Reject","Alasan Reject","Status Rework"].map(h=>(
                        <th key={h} style={{padding:"9px 14px",textAlign:"left",fontSize:9,fontWeight:700,color:C.textSub,textTransform:"uppercase",letterSpacing:"0.06em",fontFamily:C.sans,whiteSpace:"nowrap"}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {DETAIL_KERJA[detail].map((d,i)=>(
                      <tr key={d.sku} style={{borderBottom:i<DETAIL_KERJA[detail].length-1?`1px solid ${C.border}`:"none",background:i%2===0?C.card:C.card2}}>
                        <td style={{padding:"11px 14px",fontSize:11,fontWeight:700,color:C.cyan,fontFamily:C.mono}}>{d.sku}</td>
                        <td style={{padding:"11px 14px",fontSize:12,color:C.text,fontFamily:C.sans}}>{d.nama}</td>
                        <td style={{padding:"11px 14px",fontSize:12,fontWeight:700,color:C.text,fontFamily:C.mono}}>{d.pcs}</td>
                        <td style={{padding:"11px 14px",fontSize:12,fontWeight:700,color:C.green,fontFamily:C.mono,whiteSpace:"nowrap"}}>{rp(d.total)}</td>
                        <td style={{padding:"11px 14px",fontSize:12,fontWeight:700,color:d.rejectQty>0?C.red:C.textMid,fontFamily:C.mono}}>{d.rejectQty>0?d.rejectQty+" pcs":"—"}</td>
                        <td style={{padding:"11px 14px",fontSize:11,fontFamily:C.sans,color:d.alasan==="—"?C.textMid:C.yellow}}>{d.alasan}</td>
                        <td style={{padding:"11px 14px"}}>
                          {d.statusRework==="Sudah diperbaiki"&&<span style={{fontSize:10,fontWeight:700,color:C.green,background:"#1a2600",padding:"2px 8px",borderRadius:4,fontFamily:C.sans,whiteSpace:"nowrap"}}>✓ Sudah</span>}
                          {d.statusRework==="Belum diperbaiki"&&<span style={{fontSize:10,fontWeight:700,color:C.red,background:"#2d0707",padding:"2px 8px",borderRadius:4,fontFamily:C.sans,whiteSpace:"nowrap"}}>✗ Belum</span>}
                          {d.statusRework==="—"&&<span style={{fontSize:10,color:C.textMid,fontFamily:C.sans}}>—</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{padding:"10px 16px",background:`${C.border}33`,display:"flex",gap:20}}>
                <span style={{fontSize:11,color:C.textSub,fontFamily:C.sans}}>Total pcs: <strong style={{color:C.text}}>{DETAIL_KERJA[detail].reduce((a,d)=>a+d.pcs,0)}</strong></span>
                <span style={{fontSize:11,color:C.textSub,fontFamily:C.sans}}>Total upah: <strong style={{color:C.green,fontFamily:C.mono}}>{rp(DETAIL_KERJA[detail].reduce((a,d)=>a+d.total,0))}</strong></span>
                <span style={{fontSize:11,color:C.textSub,fontFamily:C.sans}}>Total reject: <strong style={{color:C.red,fontFamily:C.mono}}>{DETAIL_KERJA[detail].reduce((a,d)=>a+d.rejectQty,0)} pcs</strong></span>
              </div>
            </Panel>
          )}
          {KARYAWAN.find(k=>k.nama===detail)?.kasbonTotal>0&&(()=>{
            const k=KARYAWAN.find(k=>k.nama===detail);
            const sisa=k.kasbonTotal-k.kasbonTerbayar;
            return (
              <Panel title={`Detail Kasbon — ${detail}`}>
                <div style={{padding:"16px 18px"}}>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14,marginBottom:16}}>
                    {[{l:"Total Kasbon",v:rp(k.kasbonTotal),c:C.yellow},{l:"Sudah Dibayar",v:rp(k.kasbonTerbayar),c:C.green},{l:"Sisa Kasbon",v:rp(sisa),c:sisa>0?C.red:C.green}].map(item=>(
                      <div key={item.l} style={{background:C.card2,borderRadius:10,padding:"14px 16px",border:`1px solid ${C.border}`}}>
                        <div style={{fontSize:10,color:C.textSub,fontFamily:C.sans,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:6}}>{item.l}</div>
                        <div style={{fontSize:18,fontWeight:800,color:item.c,fontFamily:C.syne}}>{item.v}</div>
                      </div>
                    ))}
                  </div>
                  <ProgBar pct={Math.round((k.kasbonTerbayar/k.kasbonTotal)*100)} color={C.green}/>
                  <div style={{fontSize:10,color:C.textMid,fontFamily:C.sans,marginTop:4}}>{Math.round((k.kasbonTerbayar/k.kasbonTotal)*100)}% sudah terbayar</div>
                  <div style={{marginTop:12,padding:"10px 14px",background:"#1a1040",borderRadius:8,border:`1px solid ${C.purple}33`}}>
                    <div style={{fontSize:10,color:C.purple,fontFamily:C.sans}}>ℹ Cicilan dipotong saat penggajian mingguan. Hanya Owner yang bisa mengubah.</div>
                  </div>
                </div>
              </Panel>
            );
          })()}
          {!DETAIL_KERJA[detail]&&KARYAWAN.find(k=>k.nama===detail)?.kasbonTotal===0&&(
            <Panel title={`Detail — ${detail}`}>
              <div style={{padding:"32px",textAlign:"center",color:C.textSub,fontFamily:C.sans,fontSize:13}}>Belum ada data detail untuk karyawan ini minggu ini.</div>
            </Panel>
          )}
        </div>
      )}
    </div>
  );
}

// ── PLACEHOLDER ──────────────────────────────────────────────────────────────
function Placeholder({label}) {
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"60vh",gap:16}}>
      <div style={{width:64,height:64,borderRadius:16,border:`2px dashed ${C.border2}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,color:C.textMid}}>◫</div>
      <div style={{fontSize:20,fontWeight:800,color:C.text,fontFamily:C.syne}}>{label}</div>
      <div style={{fontSize:10,color:C.textMid,fontFamily:C.mono,background:C.card,border:`1px solid ${C.border}`,padding:"6px 16px",borderRadius:6,letterSpacing:"0.1em"}}>[ PHASE 2 — COMING SOON ]</div>
    </div>
  );
}

// ── MAIN APP ─────────────────────────────────────────────────────────────────


// --- MASTER DETAIL ---




function BtnD({children,onClick,color=C.cyan,small=false,outline=false,disabled=false}) {
  const bg = outline ? "transparent" : color==="red" ? C.red : color==="green" ? C.green : C.cyan;
  const fg = outline ? color==="red" ? C.red : C.cyan : "#000";
  const border = outline ? `1px solid ${color==="red"?C.red:C.cyan}` : "none";
  return (
    <button onClick={onClick} disabled={disabled}
      style={{padding:small?"4px 10px":"6px 14px",fontSize:small?9:10,fontWeight:700,
        fontFamily:C.mono,background:disabled?"#1a2030":bg,color:disabled?C.textMid:fg,
        border:disabled?"1px solid #1a2030":border,borderRadius:6,cursor:disabled?"not-allowed":"pointer",
        letterSpacing:"0.05em",whiteSpace:"nowrap",transition:"opacity 0.1s",opacity:disabled?0.5:1}}>
      {children}
    </button>
  );
}

function InlineInput({value,onChange,placeholder,style={}}) {
  return (
    <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
      style={{background:"#050e1f",border:`1px solid ${C.cyanDim}`,borderRadius:6,
        padding:"5px 9px",fontSize:11,color:C.text,fontFamily:C.sans,outline:"none",
        width:"100%",...style}}/>
  );
}

function InlineSelect({value,onChange,options,style={}}) {
  return (
    <select value={value} onChange={e=>onChange(e.target.value)}
      style={{background:"#050e1f",border:`1px solid ${C.cyanDim}`,borderRadius:6,
        padding:"5px 9px",fontSize:11,color:C.text,fontFamily:C.sans,outline:"none",
        width:"100%",...style}}>
      <option value="">-- Pilih --</option>
      {options.map(o=><option key={o.id||o} value={o.id||o}>{o.nama||o}</option>)}
    </select>
  );
}

function StatusBadge({label,color}) {
  return (
    <span style={{display:"inline-flex",alignItems:"center",gap:5,
      padding:"2px 8px",borderRadius:99,fontSize:9,fontWeight:700,
      fontFamily:C.mono,background:`${color}15`,color:color,border:`1px solid ${color}30`}}>
      <span style={{width:5,height:5,borderRadius:"50%",background:color,display:"inline-block"}}/>
      {label}
    </span>
  );
}

// ── DUMMY DATA ────────────────────────────────────────────────────────────────
const initKategori = [
  {id:"KAT-001",nama:"Jaket",keterangan:"Semua jenis jaket"},
  {id:"KAT-002",nama:"Celana",keterangan:"Celana panjang & pendek"},
  {id:"KAT-003",nama:"Kaos",keterangan:"T-Shirt & polo"},
  {id:"KAT-004",nama:"Kemeja",keterangan:"Kemeja formal & casual"},
];

const initModel = [
  {id:"MDL-001",nama:"Airflow",idKategori:"KAT-001",keterangan:"Jaket windbreaker tipis"},
  {id:"MDL-002",nama:"Neck",idKategori:"KAT-001",keterangan:"Jaket kerah tinggi"},
  {id:"MDL-003",nama:"Storma",idKategori:"KAT-001",keterangan:"Jaket tebal waterproof"},
  {id:"MDL-004",nama:"Arslan",idKategori:"KAT-002",keterangan:"Celana cargo premium"},
  {id:"MDL-005",nama:"Basic Tee",idKategori:"KAT-003",keterangan:"Kaos basic cotton"},
];

const initSize = [
  {id:"SZ-001",nama:"S",urutan:1},
  {id:"SZ-002",nama:"M",urutan:2},
  {id:"SZ-003",nama:"L",urutan:3},
  {id:"SZ-004",nama:"XL",urutan:4},
  {id:"SZ-005",nama:"XXL",urutan:5},
  {id:"SZ-006",nama:"XXXL",urutan:6},
];

const initWarna = [
  {id:"WRN-001",nama:"Black",hex:"#1a1a1a"},
  {id:"WRN-002",nama:"Navy",hex:"#1a237e"},
  {id:"WRN-003",nama:"Grey",hex:"#607d8b"},
  {id:"WRN-004",nama:"Skyblue",hex:"#4fc3f7"},
  {id:"WRN-005",nama:"White",hex:"#f5f5f5"},
  {id:"WRN-006",nama:"Maroon",hex:"#7b1fa2"},
];

function genId(prefix,arr) {
  const nums = arr.map(x=>parseInt(x.id.split("-")[1]||0)).filter(Boolean);
  const next = nums.length ? Math.max(...nums)+1 : 1;
  return `${prefix}-${String(next).padStart(3,"0")}`;
}

const THD = {padding:"9px 14px",textAlign:"left",fontSize:9,fontWeight:700,
  color:C.textSub,textTransform:"uppercase",letterSpacing:"0.07em",
  fontFamily:C.sans,whiteSpace:"nowrap"};
const TDD = (i) => ({padding:"11px 14px",fontSize:11,color:C.text,fontFamily:C.sans,
  background:i%2===0?C.card:C.card2});

// ── TABEL KATEGORI ─────────────────────────────────────────────────────────────
function TabelKategori() {
  const [data,setData] = useState(initKategori);
  const [editId,setEditId] = useState(null);
  const [editVal,setEditVal] = useState({});
  const [adding,setAdding] = useState(false);
  const [newRow,setNewRow] = useState({nama:"",keterangan:""});
  const [delId,setDelId] = useState(null);

  function startEdit(row) { setEditId(row.id); setEditVal({nama:row.nama,keterangan:row.keterangan}); }
  function saveEdit() {
    if(!editVal.nama.trim()) return;
    setData(d=>d.map(x=>x.id===editId?{...x,...editVal}:x));
    setEditId(null);
  }
  function addRow() {
    if(!newRow.nama.trim()) return;
    setData(d=>[...d,{id:genId("KAT",d),nama:newRow.nama,keterangan:newRow.keterangan}]);
    setNewRow({nama:"",keterangan:""});
    setAdding(false);
  }
  function deleteRow(id) { setData(d=>d.filter(x=>x.id!==id)); setDelId(null); }

  return (
    <Panel title="KATEGORI PRODUK" action="+ TAMBAH" onAction={()=>{setAdding(true);setEditId(null);}}>
      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",minWidth:480}}>
          <thead>
            <tr style={{background:"#0e204055"}}>
              {["ID","Nama Kategori","Keterangan","Aksi"].map(h=>(
                <th key={h} style={{...TH,textAlign:h==="Aksi"?"center":THD.textAlign}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row,i)=>(
              <tr key={row.id} style={{borderBottom:`1px solid ${C.border}`}}>
                {editId===row.id ? (
                  <>
                    <td style={TDD(i)}><span style={{fontFamily:C.mono,fontSize:10,color:C.textSub}}>{row.id}</span></td>
                    <td style={TDD(i)}><InlineInput value={editVal.nama} onChange={v=>setEditVal(e=>({...e,nama:v}))} placeholder="Nama kategori"/></td>
                    <td style={TDD(i)}><InlineInput value={editVal.keterangan} onChange={v=>setEditVal(e=>({...e,keterangan:v}))} placeholder="Keterangan"/></td>
                    <td style={{...TDD(i),textAlign:"center"}}>
                      <div style={{display:"flex",gap:6,justifyContent:"center"}}>
                        <BtnD small onClick={saveEdit} color="green">SIMPAN</BtnD>
                        <BtnD small onClick={()=>setEditId(null)} outline>BATAL</BtnD>
                      </div>
                    </td>
                  </>
                ) : delId===row.id ? (
                  <>
                    <td colSpan={3} style={{...TDD(i),color:C.red,fontFamily:C.sans,fontSize:11}}>
                      ⚠ Hapus <strong>{row.nama}</strong>? Tindakan ini tidak bisa dibatalkan.
                    </td>
                    <td style={{...TDD(i),textAlign:"center"}}>
                      <div style={{display:"flex",gap:6,justifyContent:"center"}}>
                        <BtnD small onClick={()=>deleteRow(row.id)} color="red">YA, HAPUS</BtnD>
                        <BtnD small onClick={()=>setDelId(null)} outline>BATAL</BtnD>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td style={TDD(i)}><span style={{fontFamily:C.mono,fontSize:10,color:C.textSub}}>{row.id}</span></td>
                    <td style={TDD(i)}><span style={{fontWeight:600}}>{row.nama}</span></td>
                    <td style={{...TDD(i),color:C.textSub}}>{row.keterangan||"—"}</td>
                    <td style={{...TDD(i),textAlign:"center"}}>
                      <div style={{display:"flex",gap:6,justifyContent:"center"}}>
                        <BtnD small onClick={()=>startEdit(row)} outline>EDIT</BtnD>
                        <BtnD small onClick={()=>setDelId(row.id)} color="red" outline>HAPUS</BtnD>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
            {adding&&(
              <tr style={{borderBottom:`1px solid ${C.cyanDim}`,background:C.cyanBg}}>
                <td style={{padding:"10px 14px"}}><span style={{fontFamily:C.mono,fontSize:10,color:C.cyanDim}}>AUTO</span></td>
                <td style={{padding:"10px 14px"}}><InlineInput value={newRow.nama} onChange={v=>setNewRow(r=>({...r,nama:v}))} placeholder="Nama kategori baru"/></td>
                <td style={{padding:"10px 14px"}}><InlineInput value={newRow.keterangan} onChange={v=>setNewRow(r=>({...r,keterangan:v}))} placeholder="Keterangan (opsional)"/></td>
                <td style={{padding:"10px 14px",textAlign:"center"}}>
                  <div style={{display:"flex",gap:6,justifyContent:"center"}}>
                    <BtnD small onClick={addRow}>SIMPAN</BtnD>
                    <BtnD small onClick={()=>setAdding(false)} outline>BATAL</BtnD>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div style={{padding:"10px 18px",borderTop:`1px solid ${C.border}`,display:"flex",justifyContent:"flex-end"}}>
        <span style={{fontSize:9,color:C.textMid,fontFamily:C.mono}}>{data.length} KATEGORI TERDAFTAR</span>
      </div>
    </Panel>
  );
}

// ── TABEL MODEL ───────────────────────────────────────────────────────────────
function TabelModel({kategoriList}) {
  const [data,setData] = useState(initModel);
  const [editId,setEditId] = useState(null);
  const [editVal,setEditVal] = useState({});
  const [adding,setAdding] = useState(false);
  const [newRow,setNewRow] = useState({nama:"",idKategori:"",keterangan:""});
  const [delId,setDelId] = useState(null);

  const namaKategori = (id) => kategoriList.find(k=>k.id===id)?.nama||"—";

  function startEdit(row) { setEditId(row.id); setEditVal({nama:row.nama,idKategori:row.idKategori,keterangan:row.keterangan}); }
  function saveEdit() {
    if(!editVal.nama.trim()||!editVal.idKategori) return;
    setData(d=>d.map(x=>x.id===editId?{...x,...editVal}:x));
    setEditId(null);
  }
  function addRow() {
    if(!newRow.nama.trim()||!newRow.idKategori) return;
    setData(d=>[...d,{id:genId("MDL",d),...newRow}]);
    setNewRow({nama:"",idKategori:"",keterangan:""});
    setAdding(false);
  }
  function deleteRow(id) { setData(d=>d.filter(x=>x.id!==id)); setDelId(null); }

  return (
    <Panel title="MODEL" action="+ TAMBAH" onAction={()=>{setAdding(true);setEditId(null);}}>
      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",minWidth:540}}>
          <thead>
            <tr style={{background:"#0e204055"}}>
              {["ID","Nama Model","Kategori","Keterangan","Aksi"].map(h=>(
                <th key={h} style={{...TH,textAlign:h==="Aksi"?"center":THD.textAlign}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row,i)=>(
              <tr key={row.id} style={{borderBottom:`1px solid ${C.border}`}}>
                {editId===row.id ? (
                  <>
                    <td style={TDD(i)}><span style={{fontFamily:C.mono,fontSize:10,color:C.textSub}}>{row.id}</span></td>
                    <td style={TDD(i)}><InlineInput value={editVal.nama} onChange={v=>setEditVal(e=>({...e,nama:v}))} placeholder="Nama model"/></td>
                    <td style={TDD(i)}><InlineSelect value={editVal.idKategori} onChange={v=>setEditVal(e=>({...e,idKategori:v}))} options={kategoriList}/></td>
                    <td style={TDD(i)}><InlineInput value={editVal.keterangan} onChange={v=>setEditVal(e=>({...e,keterangan:v}))} placeholder="Keterangan"/></td>
                    <td style={{...TDD(i),textAlign:"center"}}>
                      <div style={{display:"flex",gap:6,justifyContent:"center"}}>
                        <BtnD small onClick={saveEdit} color="green">SIMPAN</BtnD>
                        <BtnD small onClick={()=>setEditId(null)} outline>BATAL</BtnD>
                      </div>
                    </td>
                  </>
                ) : delId===row.id ? (
                  <>
                    <td colSpan={4} style={{...TDD(i),color:C.red,fontFamily:C.sans,fontSize:11}}>
                      ⚠ Hapus model <strong>{row.nama}</strong>? Data HPP yang terhubung juga akan terpengaruh.
                    </td>
                    <td style={{...TDD(i),textAlign:"center"}}>
                      <div style={{display:"flex",gap:6,justifyContent:"center"}}>
                        <BtnD small onClick={()=>deleteRow(row.id)} color="red">YA, HAPUS</BtnD>
                        <BtnD small onClick={()=>setDelId(null)} outline>BATAL</BtnD>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td style={TDD(i)}><span style={{fontFamily:C.mono,fontSize:10,color:C.textSub}}>{row.id}</span></td>
                    <td style={TDD(i)}><span style={{fontWeight:600}}>{row.nama}</span></td>
                    <td style={TDD(i)}>
                      <StatusBadge label={namaKategori(row.idKategori)} color={C.blue}/>
                    </td>
                    <td style={{...TDD(i),color:C.textSub}}>{row.keterangan||"—"}</td>
                    <td style={{...TDD(i),textAlign:"center"}}>
                      <div style={{display:"flex",gap:6,justifyContent:"center"}}>
                        <BtnD small onClick={()=>startEdit(row)} outline>EDIT</BtnD>
                        <BtnD small onClick={()=>setDelId(row.id)} color="red" outline>HAPUS</BtnD>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
            {adding&&(
              <tr style={{borderBottom:`1px solid ${C.cyanDim}`,background:C.cyanBg}}>
                <td style={{padding:"10px 14px"}}><span style={{fontFamily:C.mono,fontSize:10,color:C.cyanDim}}>AUTO</span></td>
                <td style={{padding:"10px 14px"}}><InlineInput value={newRow.nama} onChange={v=>setNewRow(r=>({...r,nama:v}))} placeholder="Nama model baru"/></td>
                <td style={{padding:"10px 14px"}}><InlineSelect value={newRow.idKategori} onChange={v=>setNewRow(r=>({...r,idKategori:v}))} options={kategoriList}/></td>
                <td style={{padding:"10px 14px"}}><InlineInput value={newRow.keterangan} onChange={v=>setNewRow(r=>({...r,keterangan:v}))} placeholder="Keterangan (opsional)"/></td>
                <td style={{padding:"10px 14px",textAlign:"center"}}>
                  <div style={{display:"flex",gap:6,justifyContent:"center"}}>
                    <BtnD small onClick={addRow}>SIMPAN</BtnD>
                    <BtnD small onClick={()=>setAdding(false)} outline>BATAL</BtnD>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div style={{padding:"10px 18px",borderTop:`1px solid ${C.border}`,display:"flex",justifyContent:"flex-end"}}>
        <span style={{fontSize:9,color:C.textMid,fontFamily:C.mono}}>{data.length} MODEL TERDAFTAR</span>
      </div>
    </Panel>
  );
}

// ── TABEL SIZE ────────────────────────────────────────────────────────────────
function TabelSize() {
  const [data,setData] = useState(initSize);
  const [editId,setEditId] = useState(null);
  const [editVal,setEditVal] = useState({});
  const [adding,setAdding] = useState(false);
  const [newRow,setNewRow] = useState({nama:"",urutan:""});
  const [delId,setDelId] = useState(null);

  function startEdit(row) { setEditId(row.id); setEditVal({nama:row.nama,urutan:row.urutan}); }
  function saveEdit() {
    if(!editVal.nama.trim()) return;
    setData(d=>d.map(x=>x.id===editId?{...x,...editVal,urutan:Number(editVal.urutan)||x.urutan}:x)
      .sort((a,b)=>a.urutan-b.urutan));
    setEditId(null);
  }
  function addRow() {
    if(!newRow.nama.trim()) return;
    const maxUrutan = data.length ? Math.max(...data.map(x=>x.urutan))+1 : 1;
    setData(d=>[...d,{id:genId("SZ",d),nama:newRow.nama,urutan:Number(newRow.urutan)||maxUrutan}]
      .sort((a,b)=>a.urutan-b.urutan));
    setNewRow({nama:"",urutan:""});
    setAdding(false);
  }
  function deleteRow(id) { setData(d=>d.filter(x=>x.id!==id)); setDelId(null); }

  return (
    <Panel title="SIZE" action="+ TAMBAH" onAction={()=>{setAdding(true);setEditId(null);}}>
      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",minWidth:400}}>
          <thead>
            <tr style={{background:"#0e204055"}}>
              {["ID","Nama Size","Urutan Tampil","Aksi"].map(h=>(
                <th key={h} style={{...TH,textAlign:h==="Aksi"?"center":THD.textAlign}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row,i)=>(
              <tr key={row.id} style={{borderBottom:`1px solid ${C.border}`}}>
                {editId===row.id ? (
                  <>
                    <td style={TDD(i)}><span style={{fontFamily:C.mono,fontSize:10,color:C.textSub}}>{row.id}</span></td>
                    <td style={TDD(i)}><InlineInput value={editVal.nama} onChange={v=>setEditVal(e=>({...e,nama:v}))} placeholder="Nama size"/></td>
                    <td style={TDD(i)}><InlineInput value={editVal.urutan} onChange={v=>setEditVal(e=>({...e,urutan:v}))} placeholder="Urutan" style={{width:80}}/></td>
                    <td style={{...TDD(i),textAlign:"center"}}>
                      <div style={{display:"flex",gap:6,justifyContent:"center"}}>
                        <BtnD small onClick={saveEdit} color="green">SIMPAN</BtnD>
                        <BtnD small onClick={()=>setEditId(null)} outline>BATAL</BtnD>
                      </div>
                    </td>
                  </>
                ) : delId===row.id ? (
                  <>
                    <td colSpan={3} style={{...TDD(i),color:C.red,fontFamily:C.sans,fontSize:11}}>
                      ⚠ Hapus size <strong>{row.nama}</strong>?
                    </td>
                    <td style={{...TDD(i),textAlign:"center"}}>
                      <div style={{display:"flex",gap:6,justifyContent:"center"}}>
                        <BtnD small onClick={()=>deleteRow(row.id)} color="red">YA, HAPUS</BtnD>
                        <BtnD small onClick={()=>setDelId(null)} outline>BATAL</BtnD>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td style={TDD(i)}><span style={{fontFamily:C.mono,fontSize:10,color:C.textSub}}>{row.id}</span></td>
                    <td style={TDD(i)}>
                      <span style={{fontWeight:700,fontSize:12,color:C.cyan,fontFamily:C.syne}}>{row.nama}</span>
                    </td>
                    <td style={TDD(i)}>
                      <span style={{fontFamily:C.mono,fontSize:11,color:C.textSub}}>#{row.urutan}</span>
                    </td>
                    <td style={{...TDD(i),textAlign:"center"}}>
                      <div style={{display:"flex",gap:6,justifyContent:"center"}}>
                        <BtnD small onClick={()=>startEdit(row)} outline>EDIT</BtnD>
                        <BtnD small onClick={()=>setDelId(row.id)} color="red" outline>HAPUS</BtnD>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
            {adding&&(
              <tr style={{borderBottom:`1px solid ${C.cyanDim}`,background:C.cyanBg}}>
                <td style={{padding:"10px 14px"}}><span style={{fontFamily:C.mono,fontSize:10,color:C.cyanDim}}>AUTO</span></td>
                <td style={{padding:"10px 14px"}}><InlineInput value={newRow.nama} onChange={v=>setNewRow(r=>({...r,nama:v}))} placeholder="Contoh: 4XL"/></td>
                <td style={{padding:"10px 14px"}}><InlineInput value={newRow.urutan} onChange={v=>setNewRow(r=>({...r,urutan:v}))} placeholder="Otomatis jika kosong" style={{width:160}}/></td>
                <td style={{padding:"10px 14px",textAlign:"center"}}>
                  <div style={{display:"flex",gap:6,justifyContent:"center"}}>
                    <BtnD small onClick={addRow}>SIMPAN</BtnD>
                    <BtnD small onClick={()=>setAdding(false)} outline>BATAL</BtnD>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div style={{padding:"10px 18px",borderTop:`1px solid ${C.border}`,display:"flex",justifyContent:"flex-end"}}>
        <span style={{fontSize:9,color:C.textMid,fontFamily:C.mono}}>{data.length} SIZE TERDAFTAR</span>
      </div>
    </Panel>
  );
}

// ── TABEL WARNA ───────────────────────────────────────────────────────────────
function TabelWarna() {
  const [data,setData] = useState(initWarna);
  const [editId,setEditId] = useState(null);
  const [editVal,setEditVal] = useState({});
  const [adding,setAdding] = useState(false);
  const [newRow,setNewRow] = useState({nama:"",hex:""});
  const [delId,setDelId] = useState(null);

  function startEdit(row) { setEditId(row.id); setEditVal({nama:row.nama,hex:row.hex||""}); }
  function saveEdit() {
    if(!editVal.nama.trim()) return;
    setData(d=>d.map(x=>x.id===editId?{...x,...editVal}:x));
    setEditId(null);
  }
  function addRow() {
    if(!newRow.nama.trim()) return;
    setData(d=>[...d,{id:genId("WRN",d),nama:newRow.nama,hex:newRow.hex||""}]);
    setNewRow({nama:"",hex:""});
    setAdding(false);
  }
  function deleteRow(id) { setData(d=>d.filter(x=>x.id!==id)); setDelId(null); }

  return (
    <Panel title="WARNA" action="+ TAMBAH" onAction={()=>{setAdding(true);setEditId(null);}}>
      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",minWidth:460}}>
          <thead>
            <tr style={{background:"#0e204055"}}>
              {["ID","Nama Warna","Preview","Kode Hex","Aksi"].map(h=>(
                <th key={h} style={{...TH,textAlign:h==="Aksi"?"center":THD.textAlign}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row,i)=>(
              <tr key={row.id} style={{borderBottom:`1px solid ${C.border}`}}>
                {editId===row.id ? (
                  <>
                    <td style={TDD(i)}><span style={{fontFamily:C.mono,fontSize:10,color:C.textSub}}>{row.id}</span></td>
                    <td style={TDD(i)}><InlineInput value={editVal.nama} onChange={v=>setEditVal(e=>({...e,nama:v}))} placeholder="Nama warna"/></td>
                    <td style={TDD(i)}>
                      <div style={{width:28,height:28,borderRadius:6,background:editVal.hex||"#333",border:`1px solid ${C.border2}`}}/>
                    </td>
                    <td style={TDD(i)}>
                      <div style={{display:"flex",gap:8,alignItems:"center"}}>
                        <input type="color" value={editVal.hex||"#000000"} onChange={e=>setEditVal(ev=>({...ev,hex:e.target.value}))}
                          style={{width:32,height:28,borderRadius:4,border:`1px solid ${C.border2}`,background:"transparent",cursor:"pointer",padding:2}}/>
                        <InlineInput value={editVal.hex} onChange={v=>setEditVal(e=>({...e,hex:v}))} placeholder="#000000" style={{width:100}}/>
                      </div>
                    </td>
                    <td style={{...TDD(i),textAlign:"center"}}>
                      <div style={{display:"flex",gap:6,justifyContent:"center"}}>
                        <BtnD small onClick={saveEdit} color="green">SIMPAN</BtnD>
                        <BtnD small onClick={()=>setEditId(null)} outline>BATAL</BtnD>
                      </div>
                    </td>
                  </>
                ) : delId===row.id ? (
                  <>
                    <td colSpan={4} style={{...TDD(i),color:C.red,fontFamily:C.sans,fontSize:11}}>
                      ⚠ Hapus warna <strong>{row.nama}</strong>?
                    </td>
                    <td style={{...TDD(i),textAlign:"center"}}>
                      <div style={{display:"flex",gap:6,justifyContent:"center"}}>
                        <BtnD small onClick={()=>deleteRow(row.id)} color="red">YA, HAPUS</BtnD>
                        <BtnD small onClick={()=>setDelId(null)} outline>BATAL</BtnD>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td style={TDD(i)}><span style={{fontFamily:C.mono,fontSize:10,color:C.textSub}}>{row.id}</span></td>
                    <td style={TDD(i)}><span style={{fontWeight:600}}>{row.nama}</span></td>
                    <td style={TDD(i)}>
                      {row.hex
                        ? <div style={{width:28,height:28,borderRadius:6,background:row.hex,border:`1px solid ${C.border2}`,boxShadow:row.hex?"0 0 8px "+row.hex+"44":"none"}}/>
                        : <span style={{color:C.textMid,fontSize:10,fontFamily:C.mono}}>—</span>
                      }
                    </td>
                    <td style={TDD(i)}>
                      <span style={{fontFamily:C.mono,fontSize:10,color:row.hex?C.cyan:C.textMid}}>{row.hex||"—"}</span>
                    </td>
                    <td style={{...TDD(i),textAlign:"center"}}>
                      <div style={{display:"flex",gap:6,justifyContent:"center"}}>
                        <BtnD small onClick={()=>startEdit(row)} outline>EDIT</BtnD>
                        <BtnD small onClick={()=>setDelId(row.id)} color="red" outline>HAPUS</BtnD>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
            {adding&&(
              <tr style={{borderBottom:`1px solid ${C.cyanDim}`,background:C.cyanBg}}>
                <td style={{padding:"10px 14px"}}><span style={{fontFamily:C.mono,fontSize:10,color:C.cyanDim}}>AUTO</span></td>
                <td style={{padding:"10px 14px"}}><InlineInput value={newRow.nama} onChange={v=>setNewRow(r=>({...r,nama:v}))} placeholder="Nama warna baru"/></td>
                <td style={{padding:"10px 14px"}}>
                  <div style={{width:28,height:28,borderRadius:6,background:newRow.hex||"#1a2030",border:`1px solid ${C.border2}`}}/>
                </td>
                <td style={{padding:"10px 14px"}}>
                  <div style={{display:"flex",gap:8,alignItems:"center"}}>
                    <input type="color" value={newRow.hex||"#000000"} onChange={e=>setNewRow(r=>({...r,hex:e.target.value}))}
                      style={{width:32,height:28,borderRadius:4,border:`1px solid ${C.border2}`,background:"transparent",cursor:"pointer",padding:2}}/>
                    <InlineInput value={newRow.hex} onChange={v=>setNewRow(r=>({...r,hex:v}))} placeholder="#000000 (opsional)" style={{width:140}}/>
                  </div>
                </td>
                <td style={{padding:"10px 14px",textAlign:"center"}}>
                  <div style={{display:"flex",gap:6,justifyContent:"center"}}>
                    <BtnD small onClick={addRow}>SIMPAN</BtnD>
                    <BtnD small onClick={()=>setAdding(false)} outline>BATAL</BtnD>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div style={{padding:"10px 18px",borderTop:`1px solid ${C.border}`,display:"flex",justifyContent:"flex-end"}}>
        <span style={{fontSize:9,color:C.textMid,fontFamily:C.mono}}>{data.length} WARNA TERDAFTAR</span>
      </div>
    </Panel>
  );
}

// ── MAIN EXPORT ───────────────────────────────────────────────────────────────
function MasterDetail() {
  const [kategoriData] = useState(initKategori);

  return (
    <div>
      <div style={{marginBottom:20,paddingBottom:16,borderBottom:`1px solid ${C.border}`}}>
        <div style={{fontSize:10,color:C.textSub,fontFamily:C.mono,letterSpacing:"0.07em",marginBottom:4}}>
          MASTER DATA / DETAIL
        </div>
        <div style={{fontSize:13,color:C.textMid,fontFamily:C.sans,marginTop:4}}>
          Kelola referensi dasar: kategori produk, model, size, dan warna. Data ini digunakan di seluruh sistem.
        </div>
      </div>

      <TabelKategori/>
      <TabelModel kategoriList={kategoriData}/>
      <TabelSize/>
      <TabelWarna/>
    </div>
  );
}


// --- MASTER PRODUK ---


const pct = (margin,jual) => jual>0 ? ((margin/jual)*100).toFixed(1)+"%" : "0%";



function Btn({children,onClick,color="cyan",small=false,outline=false,disabled=false}) {
  const colMap = {cyan:C.cyan,green:C.green,red:C.red,yellow:C.yellow,purple:C.purple,orange:C.orange};
  const col = colMap[color]||C.cyan;
  return (
    <button onClick={onClick} disabled={disabled}
      style={{padding:small?"4px 10px":"7px 16px",fontSize:small?9:10,fontWeight:700,
        fontFamily:C.mono,background:disabled?"#1a2030":outline?"transparent":col,
        color:disabled?C.textMid:outline?col:"#000",
        border:disabled?"1px solid #1a2030":`1px solid ${outline?col:col}`,
        borderRadius:6,cursor:disabled?"not-allowed":"pointer",
        letterSpacing:"0.05em",whiteSpace:"nowrap",transition:"opacity 0.1s",opacity:disabled?0.5:1}}>
      {children}
    </button>
  );
}

function Input({label,value,onChange,placeholder,type="text",style={},prefix,suffix,note}) {
  return (
    <div style={{marginBottom:14}}>
      {label&&<div style={{fontSize:9,color:C.textSub,fontFamily:C.sans,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:5}}>{label}</div>}
      <div style={{display:"flex",alignItems:"center",gap:0}}>
        {prefix&&<span style={{padding:"7px 10px",background:C.border,borderRadius:"6px 0 0 6px",fontSize:11,color:C.textSub,fontFamily:C.mono,border:`1px solid ${C.border2}`,borderRight:"none"}}>{prefix}</span>}
        <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
          style={{flex:1,background:"#050e1f",border:`1px solid ${C.border2}`,
            borderRadius:prefix&&suffix?"0":prefix?"0 6px 6px 0":suffix?"6px 0 0 6px":"6px",
            padding:"7px 10px",fontSize:11,color:C.text,fontFamily:type==="number"?C.mono:C.sans,outline:"none",...style}}/>
        {suffix&&<span style={{padding:"7px 10px",background:C.border,borderRadius:"0 6px 6px 0",fontSize:11,color:C.textSub,fontFamily:C.mono,border:`1px solid ${C.border2}`,borderLeft:"none"}}>{suffix}</span>}
      </div>
      {note&&<div style={{fontSize:9,color:C.textMid,fontFamily:C.sans,marginTop:3}}>{note}</div>}
    </div>
  );
}

function Select({label,value,onChange,options,style={}}) {
  return (
    <div style={{marginBottom:14}}>
      {label&&<div style={{fontSize:9,color:C.textSub,fontFamily:C.sans,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:5}}>{label}</div>}
      <select value={value} onChange={e=>onChange(e.target.value)}
        style={{width:"100%",background:"#050e1f",border:`1px solid ${C.border2}`,borderRadius:6,
          padding:"7px 10px",fontSize:11,color:value?C.text:C.textMid,fontFamily:C.sans,outline:"none",...style}}>
        <option value="">-- Pilih --</option>
        {options.map(o=><option key={o.id||o} value={o.id||o}>{o.label||o.nama||o}</option>)}
      </select>
    </div>
  );
}

function SectionLabel({children,color=C.cyan}) {
  return (
    <div style={{fontSize:9,fontWeight:700,color,fontFamily:C.mono,letterSpacing:"0.12em",
      textTransform:"uppercase",padding:"8px 0 6px",borderBottom:`1px solid ${C.border}`,marginBottom:12}}>
      {children}
    </div>
  );
}

const TH = {padding:"9px 14px",textAlign:"left",fontSize:9,fontWeight:700,
  color:C.textSub,textTransform:"uppercase",letterSpacing:"0.07em",
  fontFamily:C.sans,whiteSpace:"nowrap"};
const TD = (i) => ({padding:"11px 14px",fontSize:11,color:C.text,fontFamily:C.sans,
  background:i%2===0?C.card:C.card2});

// ── DUMMY MASTER DATA ─────────────────────────────────────────────────────────
const MASTER_KATEGORI = [
  {id:"KAT-001",nama:"Jaket"},{id:"KAT-002",nama:"Celana"},{id:"KAT-003",nama:"Kaos"},
];
const MASTER_MODEL = [
  {id:"MDL-001",nama:"Airflow",idKategori:"KAT-001"},
  {id:"MDL-002",nama:"Neck",idKategori:"KAT-001"},
  {id:"MDL-003",nama:"Storma",idKategori:"KAT-001"},
  {id:"MDL-004",nama:"Arslan",idKategori:"KAT-002"},
];
const MASTER_SIZE = [
  {id:"SZ-001",nama:"S",urutan:1},{id:"SZ-002",nama:"M",urutan:2},
  {id:"SZ-003",nama:"L",urutan:3},{id:"SZ-004",nama:"XL",urutan:4},
  {id:"SZ-005",nama:"XXL",urutan:5},{id:"SZ-006",nama:"XXXL",urutan:6},
];
const MASTER_WARNA = [
  {id:"WRN-001",nama:"Black",hex:"#1a1a1a"},{id:"WRN-002",nama:"Navy",hex:"#1a237e"},
  {id:"WRN-003",nama:"Grey",hex:"#607d8b"},{id:"WRN-004",nama:"Skyblue",hex:"#4fc3f7"},
];

// Komponen HPP default (upah & bahan)
const DEFAULT_UPAH = [
  {key:"upah_cutting",  label:"Upah Cutting"},
  {key:"upah_jahit",    label:"Upah Jahit"},
  {key:"upah_lk",       label:"Upah Lubang Kancing"},
  {key:"upah_bb",       label:"Upah Buang Benang"},
  {key:"upah_qc",       label:"Upah QC"},
  {key:"upah_steam",    label:"Upah Steam"},
  {key:"upah_packing",  label:"Upah Packing"},
  {key:"op_rumah",      label:"Operasional Rumah"},
  {key:"op_listrik",    label:"Operasional Listrik"},
  {key:"op_harian",     label:"Operasional Sehari-hari"},
  {key:"uang_makan",    label:"Uang Makan"},
];
const DEFAULT_BAHAN = [
  {key:"hpp_bahan",     label:"HPP Bahan"},
  {key:"aksesori",      label:"Aksesori"},
];

// Dummy produk
const initProduk = [
  {id:"PRD-001",skuInternal:"LYX-0001-KOU",skuKlien:"ely289",idModel:"MDL-001",idSize:"SZ-001",idWarna:"WRN-001",hargaJual:185000,marginNominal:45000,statusAktif:true},
  {id:"PRD-002",skuInternal:"LYX-0002-KOU",skuKlien:"ely290",idModel:"MDL-001",idSize:"SZ-002",idWarna:"WRN-001",hargaJual:185000,marginNominal:45000,statusAktif:true},
  {id:"PRD-003",skuInternal:"LYX-0003-KOU",skuKlien:"ely291",idModel:"MDL-001",idSize:"SZ-003",idWarna:"WRN-001",hargaJual:190000,marginNominal:46000,statusAktif:true},
  {id:"PRD-004",skuInternal:"LYX-0004-KOU",skuKlien:"ely292",idModel:"MDL-001",idSize:"SZ-004",idWarna:"WRN-001",hargaJual:195000,marginNominal:47000,statusAktif:true},
  {id:"PRD-005",skuInternal:"LYX-0005-KOU",skuKlien:"ely330",idModel:"MDL-002",idSize:"SZ-001",idWarna:"WRN-001",hargaJual:210000,marginNominal:52000,statusAktif:true},
];

// Dummy HPP per model (upah flat per model, bahan per size)
const initHPP = {
  "MDL-001": {
    upah: {upah_cutting:8000,upah_jahit:22000,upah_lk:2000,upah_bb:1500,upah_qc:2000,upah_steam:1500,upah_packing:1000,op_rumah:3000,op_listrik:2000,op_harian:1500,uang_makan:4000},
    customUpah: [],
    bahanPerSize: {
      "SZ-001":{hpp_bahan:42000,aksesori:8000},
      "SZ-002":{hpp_bahan:44000,aksesori:8000},
      "SZ-003":{hpp_bahan:47000,aksesori:8500},
      "SZ-004":{hpp_bahan:52000,aksesori:9000},
      "SZ-005":{hpp_bahan:58000,aksesori:9500},
      "SZ-006":{hpp_bahan:65000,aksesori:10000},
    },
    customBahan: [],
    targetPoin: 10000,
  },
  "MDL-002": {
    upah: {upah_cutting:6000,upah_jahit:18000,upah_lk:1500,upah_bb:1000,upah_qc:1500,upah_steam:1000,upah_packing:800,op_rumah:2500,op_listrik:1500,op_harian:1000,uang_makan:3500},
    customUpah: [],
    bahanPerSize: {
      "SZ-001":{hpp_bahan:38000,aksesori:6000},
      "SZ-002":{hpp_bahan:40000,aksesori:6000},
    },
    customBahan: [],
    targetPoin: 5000,
  },
};

function genSKUInternal(arr) {
  const nums = arr.map(x=>parseInt(x.skuInternal?.replace("LYX-","").replace("-KOU",""))||0);
  const next = nums.length ? Math.max(...nums)+1 : 1;
  return `LYX-${String(next).padStart(4,"0")}-KOU`;
}

function hitungTotalUpah(hpp) {
  if(!hpp) return 0;
  const defaultTotal = DEFAULT_UPAH.reduce((s,k)=>s+(Number(hpp.upah?.[k.key])||0),0);
  const customTotal = (hpp.customUpah||[]).reduce((s,c)=>s+(Number(c.nilai)||0),0);
  return defaultTotal+customTotal;
}

function hitungTotalBahan(hpp,sizeId) {
  if(!hpp) return 0;
  const bahan = hpp.bahanPerSize?.[sizeId]||{};
  const defaultTotal = DEFAULT_BAHAN.reduce((s,k)=>s+(Number(bahan[k.key])||0),0);
  const customTotal = (hpp.customBahan||[]).reduce((s,c)=>s+(Number(c.nilai)||0),0);
  return defaultTotal+customTotal;
}

// ── FORM TAMBAH/EDIT PRODUK ───────────────────────────────────────────────────
function FormProduk({existing,onSave,onCancel,allProduk}) {
  const isEdit = !!existing;
  const [form,setForm] = useState({
    skuKlien:    existing?.skuKlien||"",
    idModel:     existing?.idModel||"",
    idSize:      existing?.idSize||"",
    idWarna:     existing?.idWarna||"",
    hargaJual:   existing?.hargaJual||"",
    marginNominal: existing?.marginNominal||"",
    statusAktif: existing?.statusAktif??true,
  });

  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const hargaJual = Number(form.hargaJual)||0;
  const marginNominal = Number(form.marginNominal)||0;
  const marginPct = hargaJual>0 ? ((marginNominal/hargaJual)*100).toFixed(1) : "0";
  const hpp = initHPP[form.idModel];
  const totalUpah = hitungTotalUpah(hpp);
  const totalBahan = hitungTotalBahan(hpp,form.idSize);
  const totalHPP = totalUpah+totalBahan;
  const hargaJualMin = totalHPP>0 ? totalHPP : null;

  function handleSave() {
    if(!form.skuKlien||!form.idModel||!form.idSize||!form.idWarna||!form.hargaJual) return;
    const produk = {
      ...existing,
      id: existing?.id||`PRD-${String(allProduk.length+1).padStart(3,"0")}`,
      skuInternal: existing?.skuInternal||genSKUInternal(allProduk),
      ...form,
      hargaJual:Number(form.hargaJual),
      marginNominal:Number(form.marginNominal)||0,
    };
    onSave(produk);
  }

  return (
    <div style={{padding:"20px 24px"}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 24px"}}>
        <div>
          <SectionLabel>Identitas Produk</SectionLabel>
          <Input label="SKU Klien" value={form.skuKlien} onChange={v=>set("skuKlien",v)} placeholder="Contoh: ely289"/>
          <Select label="Model" value={form.idModel} onChange={v=>set("idModel",v)}
            options={MASTER_MODEL.map(m=>({id:m.id,nama:m.nama}))}/>
          <Select label="Size" value={form.idSize} onChange={v=>set("idSize",v)}
            options={MASTER_SIZE.map(s=>({id:s.id,nama:s.nama}))}/>
          <Select label="Warna" value={form.idWarna} onChange={v=>set("idWarna",v)}
            options={MASTER_WARNA.map(w=>({id:w.id,nama:w.nama}))}/>
          <div style={{marginBottom:14}}>
            <div style={{fontSize:9,color:C.textSub,fontFamily:C.sans,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:5}}>Status Aktif</div>
            <div style={{display:"flex",gap:8}}>
              {[true,false].map(v=>(
                <button key={String(v)} onClick={()=>set("statusAktif",v)}
                  style={{padding:"6px 14px",fontSize:10,fontWeight:700,fontFamily:C.mono,
                    background:form.statusAktif===v?(v?`${C.green}22`:`${C.red}22`):"transparent",
                    color:form.statusAktif===v?(v?C.green:C.red):C.textMid,
                    border:`1px solid ${form.statusAktif===v?(v?C.green:C.red):C.border}`,
                    borderRadius:6,cursor:"pointer"}}>
                  {v?"AKTIF":"NON-AKTIF"}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <SectionLabel color={C.yellow}>Harga & Margin</SectionLabel>

          {/* Info HPP dari master */}
          {form.idModel&&(
            <div style={{marginBottom:14,padding:"12px 14px",background:"#050e1f",borderRadius:8,border:`1px solid ${C.border}`}}>
              <div style={{fontSize:9,color:C.textSub,fontFamily:C.mono,letterSpacing:"0.07em",marginBottom:8}}>ESTIMASI HPP DARI MASTER</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
                <div>
                  <div style={{fontSize:9,color:C.textMid,fontFamily:C.sans}}>Total Upah</div>
                  <div style={{fontSize:12,fontWeight:700,color:C.blue,fontFamily:C.mono}}>{rp(totalUpah)}</div>
                </div>
                <div>
                  <div style={{fontSize:9,color:C.textMid,fontFamily:C.sans}}>Total Bahan</div>
                  <div style={{fontSize:12,fontWeight:700,color:C.purple,fontFamily:C.mono}}>
                    {form.idSize ? rp(totalBahan) : <span style={{color:C.textMid,fontSize:10}}>pilih size</span>}
                  </div>
                </div>
                <div>
                  <div style={{fontSize:9,color:C.textMid,fontFamily:C.sans}}>Total HPP</div>
                  <div style={{fontSize:12,fontWeight:700,color:form.idSize?C.orange:C.textMid,fontFamily:C.mono}}>
                    {form.idSize ? rp(totalHPP) : "—"}
                  </div>
                </div>
              </div>
              {!initHPP[form.idModel]&&(
                <div style={{marginTop:8,fontSize:9,color:C.yellow,fontFamily:C.sans}}>
                  ⚠ HPP belum diisi untuk model ini. Isi di tab "HPP per Model".
                </div>
              )}
            </div>
          )}

          <Input label="Harga Jual (Rp)" value={form.hargaJual} onChange={v=>set("hargaJual",v.replace(/\D/g,""))}
            placeholder="0" prefix="Rp" type="text"
            note={hargaJualMin&&hargaJual>0&&hargaJual<hargaJualMin?`⚠ Di bawah total HPP (${rp(hargaJualMin)})`:""}/>

          <Input label="Margin Nominal (Rp)" value={form.marginNominal} onChange={v=>set("marginNominal",v.replace(/\D/g,""))}
            placeholder="0" prefix="Rp" type="text"
            note="Persentase margin akan dihitung otomatis"/>

          {/* Kalkulasi margin live */}
          {hargaJual>0&&(
            <div style={{padding:"12px 14px",background:marginNominal>0?"#001a0f":"#1a0f00",borderRadius:8,
              border:`1px solid ${marginNominal>0?C.green+"44":C.red+"44"}`,marginBottom:14}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:10,color:C.textSub,fontFamily:C.sans}}>Margin Estimasi</span>
                <div style={{textAlign:"right"}}>
                  <span style={{fontSize:16,fontWeight:800,color:marginNominal>0?C.green:C.red,fontFamily:C.syne}}>
                    {pct(marginNominal,hargaJual)}
                  </span>
                  <div style={{fontSize:10,color:C.textSub,fontFamily:C.mono}}>{rp(marginNominal)}</div>
                </div>
              </div>
              {totalHPP>0&&form.idSize&&(
                <div style={{marginTop:8,paddingTop:8,borderTop:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between"}}>
                  <span style={{fontSize:9,color:C.textMid,fontFamily:C.sans}}>HPP vs Harga Jual</span>
                  <span style={{fontSize:9,color:C.textSub,fontFamily:C.mono}}>
                    {rp(totalHPP)} / {rp(hargaJual)}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div style={{display:"flex",gap:10,justifyContent:"flex-end",paddingTop:16,borderTop:`1px solid ${C.border}`}}>
        <Btn onClick={onCancel} outline>BATAL</Btn>
        <Btn onClick={handleSave}
          disabled={!form.skuKlien||!form.idModel||!form.idSize||!form.idWarna||!form.hargaJual}
          color="green">{isEdit?"SIMPAN PERUBAHAN":"TAMBAH PRODUK"}</Btn>
      </div>
    </div>
  );
}

// ── FORM HPP PER MODEL ────────────────────────────────────────────────────────
function FormHPP({modelId,onClose}) {
  const modelNama = MASTER_MODEL.find(m=>m.id===modelId)?.nama||modelId;
  const [hpp,setHpp] = useState(()=>{
    const base = initHPP[modelId];
    if(base) return JSON.parse(JSON.stringify(base));
    return {
      upah: Object.fromEntries(DEFAULT_UPAH.map(k=>[k.key,0])),
      customUpah: [],
      bahanPerSize: Object.fromEntries(MASTER_SIZE.map(s=>[s.id,Object.fromEntries(DEFAULT_BAHAN.map(k=>[k.key,0]))])),
      customBahan: [],
      targetPoin: 0,
    };
  });

  const [activeSize,setActiveSize] = useState(MASTER_SIZE[0]?.id);

  function setUpah(key,val) { setHpp(h=>({...h,upah:{...h.upah,[key]:Number(val)||0}})); }
  function setBahan(sizeId,key,val) {
    setHpp(h=>({...h,bahanPerSize:{...h.bahanPerSize,[sizeId]:{...(h.bahanPerSize[sizeId]||{}),[key]:Number(val)||0}}}));
  }
  function addCustomUpah() { setHpp(h=>({...h,customUpah:[...h.customUpah,{id:Date.now(),label:"",nilai:0}]})); }
  function setCustomUpah(id,field,val) {
    setHpp(h=>({...h,customUpah:h.customUpah.map(c=>c.id===id?{...c,[field]:field==="nilai"?Number(val)||0:val}:c)}));
  }
  function removeCustomUpah(id) { setHpp(h=>({...h,customUpah:h.customUpah.filter(c=>c.id!==id)})); }
  function addCustomBahan() { setHpp(h=>({...h,customBahan:[...h.customBahan,{id:Date.now(),label:"",nilai:0}]})); }
  function setCustomBahan(id,field,val) {
    setHpp(h=>({...h,customBahan:h.customBahan.map(c=>c.id===id?{...c,[field]:field==="nilai"?Number(val)||0:val}:c)}));
  }
  function removeCustomBahan(id) { setHpp(h=>({...h,customBahan:h.customBahan.filter(c=>c.id!==id)})); }

  const totalUpah = hitungTotalUpah(hpp);
  const totalBahan = hitungTotalBahan(hpp,activeSize);
  const totalHPP = totalUpah+totalBahan;

  const inStyle = {background:"#050e1f",border:`1px solid ${C.border2}`,borderRadius:6,
    padding:"5px 9px",fontSize:11,color:C.text,fontFamily:C.mono,outline:"none",width:"100%",textAlign:"right"};

  return (
    <div>
      {/* Header ringkasan */}
      <div style={{padding:"14px 20px",background:"#050e1f",borderBottom:`1px solid ${C.border}`,
        display:"flex",gap:24,alignItems:"center"}}>
        <div>
          <div style={{fontSize:9,color:C.textMid,fontFamily:C.sans}}>Model</div>
          <div style={{fontSize:14,fontWeight:800,color:C.cyan,fontFamily:C.syne}}>{modelNama}</div>
        </div>
        <div style={{height:32,width:1,background:C.border}}/>
        <div>
          <div style={{fontSize:9,color:C.textMid,fontFamily:C.sans}}>Total Upah (flat semua size)</div>
          <div style={{fontSize:13,fontWeight:700,color:C.blue,fontFamily:C.mono}}>{rp(totalUpah)}</div>
        </div>
        <div>
          <div style={{fontSize:9,color:C.textMid,fontFamily:C.sans}}>Total Bahan ({MASTER_SIZE.find(s=>s.id===activeSize)?.nama})</div>
          <div style={{fontSize:13,fontWeight:700,color:C.purple,fontFamily:C.mono}}>{rp(totalBahan)}</div>
        </div>
        <div>
          <div style={{fontSize:9,color:C.textMid,fontFamily:C.sans}}>Total HPP</div>
          <div style={{fontSize:13,fontWeight:700,color:C.orange,fontFamily:C.mono}}>{rp(totalHPP)}</div>
        </div>
        <div style={{marginLeft:"auto",display:"flex",gap:8,alignItems:"center"}}>
          <div style={{fontSize:9,color:C.textSub,fontFamily:C.sans}}>Target Poin/pcs</div>
          <input value={hpp.targetPoin} onChange={e=>setHpp(h=>({...h,targetPoin:Number(e.target.value)||0}))}
            style={{...inStyle,width:90,textAlign:"left"}} type="number" placeholder="0"/>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:0}}>

        {/* KOLOM KIRI — UPAH */}
        <div style={{borderRight:`1px solid ${C.border}`,padding:"16px 20px"}}>
          <SectionLabel color={C.blue}>
            ✦ KOMPONEN UPAH — flat untuk semua size
          </SectionLabel>
          <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:"8px 12px",alignItems:"center"}}>
            {DEFAULT_UPAH.map(k=>(
              <>
                <div key={k.key+"l"} style={{fontSize:11,color:C.text,fontFamily:C.sans}}>{k.label}</div>
                <div key={k.key+"i"} style={{display:"flex",alignItems:"center",gap:4}}>
                  <span style={{fontSize:10,color:C.textMid,fontFamily:C.mono}}>Rp</span>
                  <input value={hpp.upah[k.key]||0} onChange={e=>setUpah(k.key,e.target.value)}
                    style={{...inStyle,width:110}} type="number" min="0"/>
                </div>
              </>
            ))}
            {hpp.customUpah.map(c=>(
              <>
                <div key={c.id+"l"}>
                  <input value={c.label} onChange={e=>setCustomUpah(c.id,"label",e.target.value)}
                    placeholder="Nama komponen..." style={{...inStyle,textAlign:"left",width:"100%",fontSize:11}}/>
                </div>
                <div key={c.id+"i"} style={{display:"flex",alignItems:"center",gap:4}}>
                  <span style={{fontSize:10,color:C.textMid,fontFamily:C.mono}}>Rp</span>
                  <input value={c.nilai} onChange={e=>setCustomUpah(c.id,"nilai",e.target.value)}
                    style={{...inStyle,width:88}} type="number" min="0"/>
                  <button onClick={()=>removeCustomUpah(c.id)}
                    style={{background:"transparent",border:"none",color:C.red,cursor:"pointer",fontSize:14,padding:"0 4px"}}>×</button>
                </div>
              </>
            ))}
          </div>
          <div style={{marginTop:10}}>
            <Btn small outline onClick={addCustomUpah}>+ KOMPONEN BARU</Btn>
          </div>
          <div style={{marginTop:12,padding:"8px 12px",background:"#0a1628",borderRadius:6,border:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between"}}>
            <span style={{fontSize:10,color:C.textSub,fontFamily:C.sans}}>Subtotal Upah</span>
            <span style={{fontSize:12,fontWeight:700,color:C.blue,fontFamily:C.mono}}>{rp(totalUpah)}</span>
          </div>
        </div>

        {/* KOLOM KANAN — BAHAN PER SIZE */}
        <div style={{padding:"16px 20px"}}>
          <SectionLabel color={C.purple}>
            ✦ KOMPONEN BAHAN — per size
          </SectionLabel>

          {/* Size tabs */}
          <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"}}>
            {MASTER_SIZE.map(s=>(
              <button key={s.id} onClick={()=>setActiveSize(s.id)}
                style={{padding:"4px 12px",fontSize:10,fontWeight:700,fontFamily:C.mono,
                  background:activeSize===s.id?C.purple:"transparent",
                  color:activeSize===s.id?"#000":C.textSub,
                  border:`1px solid ${activeSize===s.id?C.purple:C.border}`,
                  borderRadius:6,cursor:"pointer"}}>
                {s.nama}
              </button>
            ))}
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:"8px 12px",alignItems:"center"}}>
            {DEFAULT_BAHAN.map(k=>(
              <>
                <div key={k.key+"l"} style={{fontSize:11,color:C.text,fontFamily:C.sans}}>{k.label}</div>
                <div key={k.key+"i"} style={{display:"flex",alignItems:"center",gap:4}}>
                  <span style={{fontSize:10,color:C.textMid,fontFamily:C.mono}}>Rp</span>
                  <input value={hpp.bahanPerSize[activeSize]?.[k.key]||0}
                    onChange={e=>setBahan(activeSize,k.key,e.target.value)}
                    style={{...inStyle,width:110}} type="number" min="0"/>
                </div>
              </>
            ))}
            {hpp.customBahan.map(c=>(
              <>
                <div key={c.id+"l"}>
                  <input value={c.label} onChange={e=>setCustomBahan(c.id,"label",e.target.value)}
                    placeholder="Nama komponen..." style={{...inStyle,textAlign:"left",width:"100%",fontSize:11}}/>
                </div>
                <div key={c.id+"i"} style={{display:"flex",alignItems:"center",gap:4}}>
                  <span style={{fontSize:10,color:C.textMid,fontFamily:C.mono}}>Rp</span>
                  <input value={c.nilai} onChange={e=>setCustomBahan(c.id,"nilai",e.target.value)}
                    style={{...inStyle,width:88}} type="number" min="0"/>
                  <button onClick={()=>removeCustomBahan(c.id)}
                    style={{background:"transparent",border:"none",color:C.red,cursor:"pointer",fontSize:14,padding:"0 4px"}}>×</button>
                </div>
              </>
            ))}
          </div>
          <div style={{marginTop:10}}>
            <Btn small outline color="purple" onClick={addCustomBahan}>+ KOMPONEN BARU</Btn>
          </div>
          <div style={{marginTop:8,padding:"6px 10px",background:C.cyanBg,borderRadius:6,border:`1px solid ${C.cyanDim}`,fontSize:9,color:C.cyan,fontFamily:C.sans}}>
            ℹ Komponen bahan custom berlaku untuk semua size. Nilai di atas hanya untuk size <strong>{MASTER_SIZE.find(s=>s.id===activeSize)?.nama}</strong>.
          </div>
          <div style={{marginTop:8,padding:"8px 12px",background:"#0a1628",borderRadius:6,border:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between"}}>
            <span style={{fontSize:10,color:C.textSub,fontFamily:C.sans}}>Subtotal Bahan ({MASTER_SIZE.find(s=>s.id===activeSize)?.nama})</span>
            <span style={{fontSize:12,fontWeight:700,color:C.purple,fontFamily:C.mono}}>{rp(totalBahan)}</span>
          </div>
        </div>
      </div>

      {/* Footer total + simpan */}
      <div style={{padding:"12px 20px",borderTop:`1px solid ${C.border}`,background:"#050e1f",
        display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",gap:20}}>
          <div>
            <span style={{fontSize:9,color:C.textMid,fontFamily:C.sans}}>Total HPP ({MASTER_SIZE.find(s=>s.id===activeSize)?.nama})</span>
            <div style={{fontSize:16,fontWeight:800,color:C.orange,fontFamily:C.syne}}>{rp(totalHPP)}</div>
          </div>
        </div>
        <div style={{display:"flex",gap:8}}>
          <Btn onClick={onClose} outline>TUTUP</Btn>
          <Btn onClick={()=>{Object.assign(initHPP,{[modelId]:hpp});onClose();}} color="green">SIMPAN HPP</Btn>
        </div>
      </div>
    </div>
  );
}

// ── TABEL PRODUK ──────────────────────────────────────────────────────────────
function TabelProduk() {
  const [data,setData] = useState(initProduk);
  const [mode,setMode] = useState(null); // null | "add" | {edit: produk}
  const [delId,setDelId] = useState(null);

  function getNama(arr,id) { return arr.find(x=>x.id===id)?.nama||"—"; }

  function handleSave(produk) {
    if(mode?.edit) {
      setData(d=>d.map(x=>x.id===produk.id?produk:x));
    } else {
      setData(d=>[...d,produk]);
    }
    setMode(null);
  }

  const showForm = mode==="add"||mode?.edit;

  return (
    <Panel title="DAFTAR PRODUK (SKU)"
      action={showForm?null:"+ TAMBAH PRODUK"}
      onAction={()=>setMode("add")}>
      {showForm?(
        <FormProduk
          existing={mode?.edit||null}
          onSave={handleSave}
          onCancel={()=>setMode(null)}
          allProduk={data}/>
      ):(
        <>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",minWidth:700}}>
              <thead>
                <tr style={{background:"#0e204055"}}>
                  {["SKU Internal","SKU Klien","Model","Size","Warna","Harga Jual","Margin","Status","Aksi"].map(h=>(
                    <th key={h} style={{...TH,textAlign:h==="Aksi"?"center":TH.textAlign}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row,i)=>(
                  <tr key={row.id} style={{borderBottom:`1px solid ${C.border}`}}>
                    {delId===row.id?(
                      <>
                        <td colSpan={8} style={{...TD(i),color:C.red,fontFamily:C.sans}}>
                          ⚠ Hapus produk <strong>{row.skuInternal}</strong> ({row.skuKlien})?
                        </td>
                        <td style={{...TD(i),textAlign:"center"}}>
                          <div style={{display:"flex",gap:6,justifyContent:"center"}}>
                            <Btn small onClick={()=>{setData(d=>d.filter(x=>x.id!==row.id));setDelId(null);}} color="red">HAPUS</Btn>
                            <Btn small onClick={()=>setDelId(null)} outline>BATAL</Btn>
                          </div>
                        </td>
                      </>
                    ):(
                      <>
                        <td style={TD(i)}><span style={{fontFamily:C.mono,fontSize:10,color:C.cyan}}>{row.skuInternal}</span></td>
                        <td style={TD(i)}><span style={{fontFamily:C.mono,fontSize:10,color:C.textSub}}>{row.skuKlien}</span></td>
                        <td style={TD(i)}><span style={{fontWeight:600}}>{getNama(MASTER_MODEL,row.idModel)}</span></td>
                        <td style={TD(i)}><span style={{fontFamily:C.syne,fontWeight:700,fontSize:12,color:C.cyan}}>{getNama(MASTER_SIZE,row.idSize)}</span></td>
                        <td style={TD(i)}>
                          <div style={{display:"flex",alignItems:"center",gap:6}}>
                            {MASTER_WARNA.find(w=>w.id===row.idWarna)?.hex&&(
                              <div style={{width:14,height:14,borderRadius:3,background:MASTER_WARNA.find(w=>w.id===row.idWarna)?.hex,border:`1px solid ${C.border2}`}}/>
                            )}
                            {getNama(MASTER_WARNA,row.idWarna)}
                          </div>
                        </td>
                        <td style={TD(i)}><span style={{fontFamily:C.mono,fontWeight:700}}>{rp(row.hargaJual)}</span></td>
                        <td style={TD(i)}>
                          <div>
                            <span style={{fontFamily:C.mono,fontSize:11,color:row.marginNominal>0?C.green:C.red,fontWeight:700}}>
                              {pct(row.marginNominal,row.hargaJual)}
                            </span>
                            <div style={{fontSize:9,color:C.textSub,fontFamily:C.mono}}>{rp(row.marginNominal)}</div>
                          </div>
                        </td>
                        <td style={TD(i)}>
                          <span style={{display:"inline-flex",alignItems:"center",gap:5,
                            padding:"2px 8px",borderRadius:99,fontSize:9,fontWeight:700,fontFamily:C.mono,
                            background:row.statusAktif?"#001a20":"#1a1040",
                            color:row.statusAktif?C.cyan:C.purple,
                            border:`1px solid ${row.statusAktif?C.cyan+"30":C.purple+"30"}`}}>
                            <span style={{width:5,height:5,borderRadius:"50%",background:row.statusAktif?C.cyan:C.purple,display:"inline-block"}}/>
                            {row.statusAktif?"Aktif":"Non-Aktif"}
                          </span>
                        </td>
                        <td style={{...TD(i),textAlign:"center"}}>
                          <div style={{display:"flex",gap:6,justifyContent:"center"}}>
                            <Btn small onClick={()=>setMode({edit:row})} outline>EDIT</Btn>
                            <Btn small onClick={()=>setDelId(row.id)} color="red" outline>HAPUS</Btn>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{padding:"10px 18px",borderTop:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{display:"flex",gap:16}}>
              <span style={{fontSize:9,color:C.textMid,fontFamily:C.mono}}>{data.length} PRODUK TERDAFTAR</span>
              <span style={{fontSize:9,color:C.green,fontFamily:C.mono}}>{data.filter(x=>x.statusAktif).length} AKTIF</span>
            </div>
            <div style={{display:"flex",gap:8}}>
              <Btn small outline color="yellow">⬇ DOWNLOAD TEMPLATE</Btn>
              <Btn small outline color="cyan">⬆ UPLOAD EXCEL</Btn>
            </div>
          </div>
        </>
      )}
    </Panel>
  );
}

// ── HPP PER MODEL ─────────────────────────────────────────────────────────────
function PanelHPP() {
  const [selectedModel,setSelectedModel] = useState(null);

  return (
    <Panel title="HPP PER MODEL" accent={C.orange}>
      {selectedModel ? (
        <FormHPP modelId={selectedModel} onClose={()=>setSelectedModel(null)}/>
      ) : (
        <>
          <div style={{padding:"14px 18px",borderBottom:`1px solid ${C.border}`,fontSize:11,color:C.textSub,fontFamily:C.sans}}>
            Pilih model untuk mengatur komponen HPP. Upah berlaku flat untuk semua size, bahan diisi per size.
          </div>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",minWidth:560}}>
              <thead>
                <tr style={{background:"#0e204055"}}>
                  {["Model","Kategori","Total Upah (flat)","Bahan S","Bahan XL","Target Poin","Aksi"].map(h=>(
                    <th key={h} style={{...TH,textAlign:h==="Aksi"?"center":TH.textAlign}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MASTER_MODEL.map((model,i)=>{
                  const hpp = initHPP[model.id];
                  const totalUpah = hitungTotalUpah(hpp);
                  const bahanS = hitungTotalBahan(hpp,"SZ-001");
                  const bahanXL = hitungTotalBahan(hpp,"SZ-004");
                  const hasHPP = !!hpp;
                  return (
                    <tr key={model.id} style={{borderBottom:`1px solid ${C.border}`}}>
                      <td style={TD(i)}><span style={{fontWeight:700}}>{model.nama}</span></td>
                      <td style={TD(i)}>
                        <span style={{fontSize:9,padding:"2px 8px",borderRadius:99,
                          background:`${C.blue}15`,color:C.blue,fontFamily:C.mono,fontWeight:700}}>
                          {MASTER_KATEGORI.find(k=>k.id===model.idKategori)?.nama||"—"}
                        </span>
                      </td>
                      <td style={TD(i)}>
                        {hasHPP
                          ? <span style={{fontFamily:C.mono,color:C.blue,fontWeight:700}}>{rp(totalUpah)}</span>
                          : <span style={{fontFamily:C.mono,color:C.red,fontSize:9}}>BELUM DIISI</span>}
                      </td>
                      <td style={TD(i)}>
                        {hasHPP&&bahanS>0
                          ? <span style={{fontFamily:C.mono,color:C.purple}}>{rp(bahanS)}</span>
                          : <span style={{fontFamily:C.mono,color:C.textMid,fontSize:9}}>—</span>}
                      </td>
                      <td style={TD(i)}>
                        {hasHPP&&bahanXL>0
                          ? <span style={{fontFamily:C.mono,color:C.purple}}>{rp(bahanXL)}</span>
                          : <span style={{fontFamily:C.mono,color:C.textMid,fontSize:9}}>—</span>}
                      </td>
                      <td style={TD(i)}>
                        {hasHPP
                          ? <span style={{fontFamily:C.mono,color:C.yellow}}>{Number(hpp.targetPoin).toLocaleString("id-ID")} poin</span>
                          : <span style={{fontFamily:C.mono,color:C.textMid,fontSize:9}}>—</span>}
                      </td>
                      <td style={{...TD(i),textAlign:"center"}}>
                        <Btn small onClick={()=>setSelectedModel(model.id)} color={hasHPP?"cyan":"orange"} outline={hasHPP}>
                          {hasHPP?"EDIT HPP":"ISI HPP"}
                        </Btn>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div style={{padding:"10px 18px",borderTop:`1px solid ${C.border}`,display:"flex",justifyContent:"flex-end"}}>
            <span style={{fontSize:9,color:C.textMid,fontFamily:C.mono}}>
              {Object.keys(initHPP).length}/{MASTER_MODEL.length} MODEL SUDAH ADA HPP
            </span>
          </div>
        </>
      )}
    </Panel>
  );
}

// ── MAIN EXPORT ───────────────────────────────────────────────────────────────
function MasterProduk() {
  const [activeTab,setActiveTab] = useState("produk");

  return (
    <div>
      <div style={{marginBottom:20,paddingBottom:16,borderBottom:`1px solid ${C.border}`,
        display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
        <div>
          <div style={{fontSize:10,color:C.textSub,fontFamily:C.mono,letterSpacing:"0.07em",marginBottom:4}}>
            MASTER DATA / PRODUK & HPP
          </div>
          <div style={{fontSize:13,color:C.textMid,fontFamily:C.sans,marginTop:4}}>
            Kelola SKU produk, harga jual, margin estimasi, dan komponen HPP per model.
          </div>
        </div>
        <div style={{display:"flex",gap:6}}>
          {[{id:"produk",label:"Daftar Produk"},{id:"hpp",label:"HPP per Model"}].map(t=>(
            <button key={t.id} onClick={()=>setActiveTab(t.id)}
              style={{padding:"7px 16px",fontSize:10,fontWeight:700,fontFamily:C.mono,
                background:activeTab===t.id?C.cyan:"transparent",
                color:activeTab===t.id?"#000":C.textSub,
                border:`1px solid ${activeTab===t.id?C.cyan:C.border}`,
                borderRadius:8,cursor:"pointer",transition:"all 0.1s"}}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab==="produk" && <TabelProduk/>}
      {activeTab==="hpp"    && <PanelHPP/>}
    </div>
  );
}




// --- MASTER KARYAWAN ---





function BtnKar({children,onClick,color="cyan",small=false,outline=false,disabled=false}) {
  const colMap={cyan:C.cyan,green:C.green,red:C.red,yellow:C.yellow,purple:C.purple};
  const col=colMap[color]||C.cyan;
  return (
    <button onClick={onClick} disabled={disabled}
      style={{padding:small?"4px 10px":"7px 16px",fontSize:small?9:10,fontWeight:700,fontFamily:C.mono,
        background:disabled?"#1a2030":outline?"transparent":col,
        color:disabled?C.textMid:outline?col:"#000",
        border:`1px solid ${disabled?"#1a2030":col}`,
        borderRadius:6,cursor:disabled?"not-allowed":"pointer",
        letterSpacing:"0.05em",whiteSpace:"nowrap",opacity:disabled?0.5:1}}>
      {children}
    </button>
  );
}

function FieldKar({label,children,note}) {
  return (
    <div style={{marginBottom:14}}>
      {label&&<div style={{fontSize:9,color:C.textSub,fontFamily:C.sans,textTransform:"uppercase",
        letterSpacing:"0.07em",marginBottom:5}}>{label}</div>}
      {children}
      {note&&<div style={{fontSize:9,color:C.textMid,fontFamily:C.sans,marginTop:3}}>{note}</div>}
    </div>
  );
}

function TextInputKar({value,onChange,placeholder,prefix,type="text"}) {
  return (
    <div style={{display:"flex",alignItems:"center"}}>
      {prefix&&<span style={{padding:"7px 10px",background:C.border,borderRadius:"6px 0 0 6px",
        fontSize:11,color:C.textSub,fontFamily:C.mono,border:`1px solid ${C.border2}`,borderRight:"none"}}>{prefix}</span>}
      <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
        style={{flex:1,background:"#050e1f",border:`1px solid ${C.border2}`,
          borderRadius:prefix?"0 6px 6px 0":"6px",padding:"7px 10px",
          fontSize:11,color:C.text,fontFamily:type==="number"?C.mono:C.sans,outline:"none"}}/>
    </div>
  );
}

const TAHAP_LIST = [
  "Cutting","Jahit","Lubang Kancing","Buang Benang","QC","Steam","Packing"
];


const initKaryawan = [
  {id:"KRY-001",nama:"Budi Santoso",tipeGaji:"borongan",tahap:["Cutting","Jahit"],upahTetap:0,statusAktif:true},
  {id:"KRY-002",nama:"Siti Rahayu",tipeGaji:"borongan",tahap:["Jahit","Lubang Kancing","Buang Benang"],upahTetap:0,statusAktif:true},
  {id:"KRY-003",nama:"Ahmad Fauzi",tipeGaji:"tetap",tahap:[],upahTetap:750000,statusAktif:true},
  {id:"KRY-004",nama:"Dewi Lestari",tipeGaji:"borongan",tahap:["QC","Steam","Packing"],upahTetap:0,statusAktif:false},
];

function genIdKar(arr) {
  const nums=arr.map(x=>parseInt(x.id.split("-")[1]||0));
  return `KRY-${String(Math.max(0,...nums)+1).padStart(3,"0")}`;
}

function FormKaryawan({existing,onSave,onCancel,allData}) {
  const isEdit=!!existing;
  const [form,setForm]=useState({
    nama:existing?.nama||"",
    tipeGaji:existing?.tipeGaji||"borongan",
    tahap:existing?.tahap||[],
    upahTetap:existing?.upahTetap||"",
    statusAktif:existing?.statusAktif??true,
  });
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  function toggleTahap(t) {
    set("tahap",form.tahap.includes(t)?form.tahap.filter(x=>x!==t):[...form.tahap,t]);
  }
  function handleSave() {
    if(!form.nama.trim()) return;
    if(form.tipeGaji==="borongan"&&form.tahap.length===0) return;
    onSave({
      ...existing,
      id:existing?.id||genIdKar(allData),
      ...form,
      upahTetap:Number(form.upahTetap)||0,
    });
  }
  const valid=form.nama.trim()&&(form.tipeGaji==="tetap"||(form.tipeGaji==="borongan"&&form.tahap.length>0));

  return (
    <div style={{padding:"20px 24px"}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 32px"}}>
        {/* Kiri */}
        <div>
          <div style={{fontSize:9,fontWeight:700,color:C.cyan,fontFamily:C.mono,letterSpacing:"0.12em",
            textTransform:"uppercase",paddingBottom:6,borderBottom:`1px solid ${C.border}`,marginBottom:12}}>
            DATA DIRI
          </div>
          <FieldKar label="Nama Lengkap">
            <TextInputKar value={form.nama} onChange={v=>set("nama",v)} placeholder="Nama karyawan"/>
          </FieldKar>
          <FieldKar label="Status Aktif">
            <div style={{display:"flex",gap:8}}>
              {[true,false].map(v=>(
                <button key={String(v)} onClick={()=>set("statusAktif",v)}
                  style={{padding:"6px 16px",fontSize:10,fontWeight:700,fontFamily:C.mono,
                    background:form.statusAktif===v?(v?`${C.green}22`:`${C.red}22`):"transparent",
                    color:form.statusAktif===v?(v?C.green:C.red):C.textMid,
                    border:`1px solid ${form.statusAktif===v?(v?C.green:C.red):C.border}`,
                    borderRadius:6,cursor:"pointer"}}>
                  {v?"AKTIF":"NON-AKTIF"}
                </button>
              ))}
            </div>
          </FieldKar>
        </div>

        {/* Kanan */}
        <div>
          <div style={{fontSize:9,fontWeight:700,color:C.yellow,fontFamily:C.mono,letterSpacing:"0.12em",
            textTransform:"uppercase",paddingBottom:6,borderBottom:`1px solid ${C.border}`,marginBottom:12}}>
            PENGATURAN GAJI
          </div>
          <FieldKar label="Tipe Gaji">
            <div style={{display:"flex",gap:8,marginBottom:14}}>
              {[{v:"borongan",label:"BORONGAN"},{v:"tetap",label:"MINGGUAN TETAP"}].map(t=>(
                <button key={t.v} onClick={()=>set("tipeGaji",t.v)}
                  style={{padding:"6px 16px",fontSize:10,fontWeight:700,fontFamily:C.mono,
                    background:form.tipeGaji===t.v?`${C.cyan}22`:"transparent",
                    color:form.tipeGaji===t.v?C.cyan:C.textMid,
                    border:`1px solid ${form.tipeGaji===t.v?C.cyan:C.border}`,
                    borderRadius:6,cursor:"pointer"}}>
                  {t.label}
                </button>
              ))}
            </div>
          </FieldKar>

          {form.tipeGaji==="borongan"&&(
            <FieldKar label="Tahap yang Dikerjakan" note="Upah per pcs mengacu otomatis dari nilai HPP di Master Produk">
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                {TAHAP_LIST.map(t=>{
                  const checked=form.tahap.includes(t);
                  return (
                    <div key={t} onClick={()=>toggleTahap(t)}
                      style={{display:"flex",alignItems:"center",gap:8,padding:"7px 10px",
                        borderRadius:6,cursor:"pointer",
                        background:checked?`${C.cyan}15`:"#050e1f",
                        border:`1px solid ${checked?C.cyanDim:C.border2}`,
                        transition:"all 0.1s"}}>
                      <div style={{width:14,height:14,borderRadius:3,flexShrink:0,
                        background:checked?C.cyan:"transparent",
                        border:`1.5px solid ${checked?C.cyan:C.textMid}`,
                        display:"flex",alignItems:"center",justifyContent:"center"}}>
                        {checked&&<span style={{fontSize:9,color:"#000",fontWeight:900}}>✓</span>}
                      </div>
                      <span style={{fontSize:11,color:checked?C.text:C.textSub,fontFamily:C.sans}}>{t}</span>
                    </div>
                  );
                })}
              </div>
              {form.tahap.length===0&&(
                <div style={{marginTop:6,fontSize:9,color:C.red,fontFamily:C.sans}}>⚠ Pilih minimal 1 tahap</div>
              )}
            </FieldKar>
          )}

          {form.tipeGaji==="tetap"&&(
            <FieldKar label="Upah per Minggu">
              <TextInputKar value={form.upahTetap} onChange={v=>set("upahTetap",v.replace(/\D/g,""))}
                placeholder="0" prefix="Rp" type="text"/>
            </FieldKar>
          )}
        </div>
      </div>

      <div style={{display:"flex",gap:10,justifyContent:"flex-end",paddingTop:16,borderTop:`1px solid ${C.border}`,marginTop:4}}>
        <BtnKar onClick={onCancel} outline>BATAL</BtnKar>
        <BtnKar onClick={handleSave} disabled={!valid} color="green">
          {isEdit?"SIMPAN PERUBAHAN":"TAMBAH KARYAWAN"}
        </BtnKar>
      </div>
    </div>
  );
}

function MasterKaryawan() {
  const [data,setData]=useState(initKaryawan);
  const [mode,setMode]=useState(null);
  const [delId,setDelId]=useState(null);

  function handleSave(k) {
    if(mode?.edit) setData(d=>d.map(x=>x.id===k.id?k:x));
    else setData(d=>[...d,k]);
    setMode(null);
  }

  const showForm=mode==="add"||mode?.edit;

  return (
    <div>
      <div style={{marginBottom:20,paddingBottom:16,borderBottom:`1px solid ${C.border}`}}>
        <div style={{fontSize:10,color:C.textSub,fontFamily:C.mono,letterSpacing:"0.07em",marginBottom:4}}>
          MASTER DATA / KARYAWAN
        </div>
        <div style={{fontSize:13,color:C.textMid,fontFamily:C.sans}}>
          Kelola data karyawan, tipe gaji, dan tahap pekerjaan.
        </div>
      </div>

      <Panel title="DAFTAR KARYAWAN" action={showForm?null:"+ TAMBAH"} onAction={()=>setMode("add")}>
        {showForm?(
          <FormKaryawan existing={mode?.edit||null} onSave={handleSave}
            onCancel={()=>setMode(null)} allData={data}/>
        ):(
          <>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",minWidth:620}}>
                <thead>
                  <tr style={{background:"#0e204055"}}>
                    {["ID","Nama","Tipe Gaji","Tahap / Upah","Status","Aksi"].map(h=>(
                      <th key={h} style={{...TH,textAlign:h==="Aksi"?"center":TH.textAlign}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((row,i)=>(
                    <tr key={row.id} style={{borderBottom:`1px solid ${C.border}`}}>
                      {delId===row.id?(
                        <>
                          <td colSpan={5} style={{...TD(i),color:C.red,fontFamily:C.sans}}>
                            ⚠ Hapus karyawan <strong>{row.nama}</strong>? Data gaji yang terhubung akan terpengaruh.
                          </td>
                          <td style={{...TD(i),textAlign:"center"}}>
                            <div style={{display:"flex",gap:6,justifyContent:"center"}}>
                              <BtnKar small onClick={()=>{setData(d=>d.filter(x=>x.id!==row.id));setDelId(null);}} color="red">HAPUS</BtnKar>
                              <BtnKar small onClick={()=>setDelId(null)} outline>BATAL</BtnKar>
                            </div>
                          </td>
                        </>
                      ):(
                        <>
                          <td style={TD(i)}><span style={{fontFamily:C.mono,fontSize:10,color:C.textSub}}>{row.id}</span></td>
                          <td style={TD(i)}><span style={{fontWeight:600}}>{row.nama}</span></td>
                          <td style={TD(i)}>
                            <span style={{fontSize:9,padding:"2px 8px",borderRadius:99,fontFamily:C.mono,fontWeight:700,
                              background:row.tipeGaji==="borongan"?`${C.orange}18`:`${C.blue}18`,
                              color:row.tipeGaji==="borongan"?C.orange:C.blue,
                              border:`1px solid ${row.tipeGaji==="borongan"?C.orange+"30":C.blue+"30"}`}}>
                              {row.tipeGaji==="borongan"?"BORONGAN":"MINGGUAN TETAP"}
                            </span>
                          </td>
                          <td style={TD(i)}>
                            {row.tipeGaji==="borongan"?(
                              <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                                {row.tahap.map(t=>(
                                  <span key={t} style={{fontSize:9,padding:"2px 7px",borderRadius:4,
                                    background:`${C.cyan}12`,color:C.cyan,fontFamily:C.sans,
                                    border:`1px solid ${C.cyanDim}`}}>{t}</span>
                                ))}
                              </div>
                            ):(
                              <span style={{fontFamily:C.mono,fontWeight:700,color:C.green}}>{rp(row.upahTetap)}<span style={{fontSize:9,color:C.textSub}}>/minggu</span></span>
                            )}
                          </td>
                          <td style={TD(i)}>
                            <span style={{display:"inline-flex",alignItems:"center",gap:5,padding:"2px 8px",
                              borderRadius:99,fontSize:9,fontWeight:700,fontFamily:C.mono,
                              background:row.statusAktif?"#001a20":"#1a1040",
                              color:row.statusAktif?C.cyan:C.purple,
                              border:`1px solid ${row.statusAktif?C.cyan+"30":C.purple+"30"}`}}>
                              <span style={{width:5,height:5,borderRadius:"50%",
                                background:row.statusAktif?C.cyan:C.purple,display:"inline-block"}}/>
                              {row.statusAktif?"Aktif":"Non-Aktif"}
                            </span>
                          </td>
                          <td style={{...TD(i),textAlign:"center"}}>
                            <div style={{display:"flex",gap:6,justifyContent:"center"}}>
                              <BtnKar small onClick={()=>setMode({edit:row})} outline>EDIT</BtnKar>
                              <BtnKar small onClick={()=>setDelId(row.id)} color="red" outline>HAPUS</BtnKar>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{padding:"10px 18px",borderTop:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between"}}>
              <span style={{fontSize:9,color:C.textMid,fontFamily:C.mono}}>{data.filter(x=>x.statusAktif).length} AKTIF · {data.filter(x=>!x.statusAktif).length} NON-AKTIF</span>
              <span style={{fontSize:9,color:C.textMid,fontFamily:C.mono}}>{data.length} TOTAL KARYAWAN</span>
            </div>
          </>
        )}
      </Panel>
    </div>
  );
}

// --- MASTER KLIEN ---




function BtnKli({children,onClick,color="cyan",small=false,outline=false,disabled=false}) {
  const colMap={cyan:C.cyan,green:C.green,red:C.red};
  const col=colMap[color]||C.cyan;
  return (
    <button onClick={onClick} disabled={disabled}
      style={{padding:small?"4px 10px":"7px 16px",fontSize:small?9:10,fontWeight:700,fontFamily:C.mono,
        background:disabled?"#1a2030":outline?"transparent":col,
        color:disabled?C.textMid:outline?col:"#000",
        border:`1px solid ${disabled?"#1a2030":col}`,
        borderRadius:6,cursor:disabled?"not-allowed":"pointer",
        letterSpacing:"0.05em",whiteSpace:"nowrap",opacity:disabled?0.5:1}}>
      {children}
    </button>
  );
}

function InlineInputKli({value,onChange,placeholder,style={}}) {
  return (
    <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
      style={{background:"#050e1f",border:`1px solid ${C.cyanDim}`,borderRadius:6,
        padding:"5px 9px",fontSize:11,color:C.text,fontFamily:C.sans,outline:"none",
        width:"100%",...style}}/>
  );
}


const initKlien = [
  {id:"KLN-001",nama:"PT. Elysian Garment",alamat:"Jl. Industri No. 12, Bandung",keterangan:"Klien utama, jaket"},
  {id:"KLN-002",nama:"CV. Maju Bersama",alamat:"Jl. Raya Bogor Km 18, Depok",keterangan:"Celana cargo"},
  {id:"KLN-003",nama:"Toko Sportivo",alamat:"Jl. Sudirman No. 45, Jakarta",keterangan:"Kaos & polo"},
];

function genIdKli(arr) {
  const nums=arr.map(x=>parseInt(x.id.split("-")[1]||0));
  return `KLN-${String(Math.max(0,...nums)+1).padStart(3,"0")}`;
}

function MasterKlien() {
  const [data,setData]=useState(initKlien);
  const [editId,setEditId]=useState(null);
  const [editVal,setEditVal]=useState({});
  const [adding,setAdding]=useState(false);
  const [newRow,setNewRow]=useState({nama:"",alamat:"",keterangan:""});
  const [delId,setDelId]=useState(null);

  function startEdit(row){setEditId(row.id);setEditVal({nama:row.nama,alamat:row.alamat,keterangan:row.keterangan});}
  function saveEdit(){
    if(!editVal.nama.trim()) return;
    setData(d=>d.map(x=>x.id===editId?{...x,...editVal}:x));
    setEditId(null);
  }
  function addRow(){
    if(!newRow.nama.trim()) return;
    setData(d=>[...d,{id:genIdKli(d),...newRow}]);
    setNewRow({nama:"",alamat:"",keterangan:""});
    setAdding(false);
  }
  function deleteRow(id){setData(d=>d.filter(x=>x.id!==id));setDelId(null);}

  return (
    <div>
      <div style={{marginBottom:20,paddingBottom:16,borderBottom:`1px solid ${C.border}`}}>
        <div style={{fontSize:10,color:C.textSub,fontFamily:C.mono,letterSpacing:"0.07em",marginBottom:4}}>
          MASTER DATA / KLIEN
        </div>
        <div style={{fontSize:13,color:C.textMid,fontFamily:C.sans}}>
          Kelola data klien yang akan digunakan pada PO dan surat jalan.
        </div>
      </div>

      <Panel title="DAFTAR KLIEN" action="+ TAMBAH" onAction={()=>{setAdding(true);setEditId(null);}}>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",minWidth:620}}>
            <thead>
              <tr style={{background:"#0e204055"}}>
                {["ID","Nama Klien","Alamat","Keterangan","Aksi"].map(h=>(
                  <th key={h} style={{...TH,textAlign:h==="Aksi"?"center":TH.textAlign}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row,i)=>(
                <tr key={row.id} style={{borderBottom:`1px solid ${C.border}`}}>
                  {editId===row.id?(
                    <>
                      <td style={TD(i)}><span style={{fontFamily:C.mono,fontSize:10,color:C.textSub}}>{row.id}</span></td>
                      <td style={TD(i)}><InlineInputKli value={editVal.nama} onChange={v=>setEditVal(e=>({...e,nama:v}))} placeholder="Nama klien"/></td>
                      <td style={TD(i)}><InlineInputKli value={editVal.alamat} onChange={v=>setEditVal(e=>({...e,alamat:v}))} placeholder="Alamat"/></td>
                      <td style={TD(i)}><InlineInputKli value={editVal.keterangan} onChange={v=>setEditVal(e=>({...e,keterangan:v}))} placeholder="Keterangan"/></td>
                      <td style={{...TD(i),textAlign:"center"}}>
                        <div style={{display:"flex",gap:6,justifyContent:"center"}}>
                          <BtnKli small onClick={saveEdit} color="green">SIMPAN</BtnKli>
                          <BtnKli small onClick={()=>setEditId(null)} outline>BATAL</BtnKli>
                        </div>
                      </td>
                    </>
                  ):delId===row.id?(
                    <>
                      <td colSpan={4} style={{...TD(i),color:C.red,fontFamily:C.sans}}>
                        ⚠ Hapus klien <strong>{row.nama}</strong>? PO yang terhubung akan terpengaruh.
                      </td>
                      <td style={{...TD(i),textAlign:"center"}}>
                        <div style={{display:"flex",gap:6,justifyContent:"center"}}>
                          <BtnKli small onClick={()=>deleteRow(row.id)} color="red">YA, HAPUS</BtnKli>
                          <BtnKli small onClick={()=>setDelId(null)} outline>BATAL</BtnKli>
                        </div>
                      </td>
                    </>
                  ):(
                    <>
                      <td style={TD(i)}><span style={{fontFamily:C.mono,fontSize:10,color:C.textSub}}>{row.id}</span></td>
                      <td style={TD(i)}><span style={{fontWeight:600}}>{row.nama}</span></td>
                      <td style={{...TD(i),color:C.textSub,maxWidth:220}}>
                        <span style={{fontSize:10}}>{row.alamat||"—"}</span>
                      </td>
                      <td style={{...TD(i),color:C.textSub}}>{row.keterangan||"—"}</td>
                      <td style={{...TD(i),textAlign:"center"}}>
                        <div style={{display:"flex",gap:6,justifyContent:"center"}}>
                          <BtnKli small onClick={()=>startEdit(row)} outline>EDIT</BtnKli>
                          <BtnKli small onClick={()=>setDelId(row.id)} color="red" outline>HAPUS</BtnKli>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
              {adding&&(
                <tr style={{borderBottom:`1px solid ${C.cyanDim}`,background:C.cyanBg}}>
                  <td style={{padding:"10px 14px"}}><span style={{fontFamily:C.mono,fontSize:10,color:C.cyanDim}}>AUTO</span></td>
                  <td style={{padding:"10px 14px"}}><InlineInputKli value={newRow.nama} onChange={v=>setNewRow(r=>({...r,nama:v}))} placeholder="Nama klien baru"/></td>
                  <td style={{padding:"10px 14px"}}><InlineInputKli value={newRow.alamat} onChange={v=>setNewRow(r=>({...r,alamat:v}))} placeholder="Alamat klien"/></td>
                  <td style={{padding:"10px 14px"}}><InlineInputKli value={newRow.keterangan} onChange={v=>setNewRow(r=>({...r,keterangan:v}))} placeholder="Keterangan (opsional)"/></td>
                  <td style={{padding:"10px 14px",textAlign:"center"}}>
                    <div style={{display:"flex",gap:6,justifyContent:"center"}}>
                      <BtnKli small onClick={addRow}>SIMPAN</BtnKli>
                      <BtnKli small onClick={()=>setAdding(false)} outline>BATAL</BtnKli>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div style={{padding:"10px 18px",borderTop:`1px solid ${C.border}`,display:"flex",justifyContent:"flex-end"}}>
          <span style={{fontSize:9,color:C.textMid,fontFamily:C.mono}}>{data.length} KLIEN TERDAFTAR</span>
        </div>
      </Panel>
    </div>
  );
}


// --- MASTER LAINNYA ---




function BtnLain({children,onClick,color="cyan",small=false,outline=false,disabled=false}) {
  const colMap={cyan:C.cyan,green:C.green,red:C.red,yellow:C.yellow,purple:C.purple,orange:C.orange};
  const col=colMap[color]||C.cyan;
  return (
    <button onClick={onClick} disabled={disabled}
      style={{padding:small?"4px 10px":"7px 16px",fontSize:small?9:10,fontWeight:700,fontFamily:C.mono,
        background:disabled?"#1a2030":outline?"transparent":col,
        color:disabled?C.textMid:outline?col:"#000",
        border:`1px solid ${disabled?"#1a2030":col}`,
        borderRadius:6,cursor:disabled?"not-allowed":"pointer",
        letterSpacing:"0.05em",whiteSpace:"nowrap",opacity:disabled?0.5:1}}>
      {children}
    </button>
  );
}

function ToggleLain({value,onChange,labelOn="YA",labelOff="TIDAK",colorOn=C.green,colorOff=C.textMid}) {
  return (
    <button onClick={()=>onChange(!value)}
      style={{padding:"3px 10px",fontSize:9,fontWeight:700,fontFamily:C.mono,
        background:value?`${colorOn}18`:`${colorOff}18`,
        color:value?colorOn:colorOff,
        border:`1px solid ${value?colorOn+"44":colorOff+"22"}`,
        borderRadius:99,cursor:"pointer",whiteSpace:"nowrap"}}>
      {value?labelOn:labelOff}
    </button>
  );
}

function InlineInputLain({value,onChange,placeholder,style={}}) {
  return (
    <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
      style={{background:"#050e1f",border:`1px solid ${C.cyanDim}`,borderRadius:6,
        padding:"5px 9px",fontSize:11,color:C.text,fontFamily:C.sans,outline:"none",
        width:"100%",...style}}/>
  );
}

function InlineSelectLain({value,onChange,options,style={}}) {
  return (
    <select value={value} onChange={e=>onChange(e.target.value)}
      style={{background:"#050e1f",border:`1px solid ${C.cyanDim}`,borderRadius:6,
        padding:"5px 9px",fontSize:11,color:value?C.text:C.textMid,fontFamily:C.sans,
        outline:"none",width:"100%",...style}}>
      <option value="">-- Pilih --</option>
      {options.map(o=><option key={o.value||o} value={o.value||o}>{o.label||o}</option>)}
    </select>
  );
}


function genIdLain(prefix,arr) {
  const nums=arr.map(x=>parseInt(x.id?.split("-")[1]||0)).filter(Boolean);
  return `${prefix}-${String(Math.max(0,...nums)+1).padStart(3,"0")}`;
}

// ── JENIS REJECT ──────────────────────────────────────────────────────────────
const initReject = [
  {id:"RJT-001",nama:"Jahitan Loncat",potongUpah:true,bisaRework:true,keterangan:"Jahitan tidak tersambung"},
  {id:"RJT-002",nama:"Kancing Lepas",potongUpah:true,bisaRework:true,keterangan:"Kancing tidak terpasang"},
  {id:"RJT-003",nama:"Noda / Kotor",potongUpah:false,bisaRework:true,keterangan:"Bahan terkena noda"},
  {id:"RJT-004",nama:"Cacat Bahan",potongUpah:false,bisaRework:false,keterangan:"Bahan sobek atau berlubang"},
  {id:"RJT-005",nama:"Ukuran Tidak Sesuai",potongUpah:true,bisaRework:true,keterangan:"Selisih ukuran > toleransi"},
  {id:"RJT-006",nama:"Benang Sisa",potongUpah:true,bisaRework:false,keterangan:"Benang tidak dibuang bersih"},
];

function TabelJenisReject() {
  const [data,setData]=useState(initReject);
  const [editId,setEditId]=useState(null);
  const [editVal,setEditVal]=useState({});
  const [adding,setAdding]=useState(false);
  const [newRow,setNewRow]=useState({nama:"",potongUpah:false,bisaRework:true,keterangan:""});
  const [delId,setDelId]=useState(null);

  function startEdit(row){setEditId(row.id);setEditVal({nama:row.nama,potongUpah:row.potongUpah,bisaRework:row.bisaRework,keterangan:row.keterangan});}
  function saveEdit(){
    if(!editVal.nama.trim())return;
    setData(d=>d.map(x=>x.id===editId?{...x,...editVal}:x));
    setEditId(null);
  }
  function addRow(){
    if(!newRow.nama.trim())return;
    setData(d=>[...d,{id:genIdLain("RJT",d),...newRow}]);
    setNewRow({nama:"",potongUpah:false,bisaRework:true,keterangan:""});
    setAdding(false);
  }

  return (
    <Panel title="JENIS REJECT / CACAT" action="+ TAMBAH" onAction={()=>{setAdding(true);setEditId(null);}}>
      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",minWidth:640}}>
          <thead>
            <tr style={{background:"#0e204055"}}>
              {["ID","Nama Cacat","Potong Upah","Bisa Rework","Keterangan","Aksi"].map(h=>(
                <th key={h} style={{...TH,textAlign:["Potong Upah","Bisa Rework","Aksi"].includes(h)?"center":TH.textAlign}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row,i)=>(
              <tr key={row.id} style={{borderBottom:`1px solid ${C.border}`}}>
                {editId===row.id?(
                  <>
                    <td style={TD(i)}><span style={{fontFamily:C.mono,fontSize:10,color:C.textSub}}>{row.id}</span></td>
                    <td style={TD(i)}><InlineInputLain value={editVal.nama} onChange={v=>setEditVal(e=>({...e,nama:v}))} placeholder="Nama cacat"/></td>
                    <td style={{...TD(i),textAlign:"center"}}>
                      <ToggleLain value={editVal.potongUpah} onChange={v=>setEditVal(e=>({...e,potongUpah:v}))} labelOn="YA" labelOff="TIDAK" colorOn={C.red} colorOff={C.textSub}/>
                    </td>
                    <td style={{...TD(i),textAlign:"center"}}>
                      <ToggleLain value={editVal.bisaRework} onChange={v=>setEditVal(e=>({...e,bisaRework:v}))} labelOn="YA" labelOff="TIDAK" colorOn={C.green}/>
                    </td>
                    <td style={TD(i)}><InlineInputLain value={editVal.keterangan} onChange={v=>setEditVal(e=>({...e,keterangan:v}))} placeholder="Keterangan"/></td>
                    <td style={{...TD(i),textAlign:"center"}}>
                      <div style={{display:"flex",gap:6,justifyContent:"center"}}>
                        <BtnLain small onClick={saveEdit} color="green">SIMPAN</BtnLain>
                        <BtnLain small onClick={()=>setEditId(null)} outline>BATAL</BtnLain>
                      </div>
                    </td>
                  </>
                ):delId===row.id?(
                  <>
                    <td colSpan={5} style={{...TD(i),color:C.red,fontFamily:C.sans}}>⚠ Hapus jenis reject <strong>{row.nama}</strong>?</td>
                    <td style={{...TD(i),textAlign:"center"}}>
                      <div style={{display:"flex",gap:6,justifyContent:"center"}}>
                        <BtnLain small onClick={()=>{setData(d=>d.filter(x=>x.id!==row.id));setDelId(null);}} color="red">HAPUS</BtnLain>
                        <BtnLain small onClick={()=>setDelId(null)} outline>BATAL</BtnLain>
                      </div>
                    </td>
                  </>
                ):(
                  <>
                    <td style={TD(i)}><span style={{fontFamily:C.mono,fontSize:10,color:C.textSub}}>{row.id}</span></td>
                    <td style={TD(i)}><span style={{fontWeight:600}}>{row.nama}</span></td>
                    <td style={{...TD(i),textAlign:"center"}}>
                      <span style={{fontSize:9,padding:"2px 8px",borderRadius:99,fontFamily:C.mono,fontWeight:700,
                        background:row.potongUpah?`${C.red}18`:`${C.textMid}18`,
                        color:row.potongUpah?C.red:C.textMid,
                        border:`1px solid ${row.potongUpah?C.red+"33":C.border}`}}>
                        {row.potongUpah?"POTONG":"TIDAK"}
                      </span>
                    </td>
                    <td style={{...TD(i),textAlign:"center"}}>
                      <span style={{fontSize:9,padding:"2px 8px",borderRadius:99,fontFamily:C.mono,fontWeight:700,
                        background:row.bisaRework?`${C.green}18`:`${C.textMid}18`,
                        color:row.bisaRework?C.green:C.textMid,
                        border:`1px solid ${row.bisaRework?C.green+"33":C.border}`}}>
                        {row.bisaRework?"BISA":"TIDAK"}
                      </span>
                    </td>
                    <td style={{...TD(i),color:C.textSub}}>{row.keterangan||"—"}</td>
                    <td style={{...TD(i),textAlign:"center"}}>
                      <div style={{display:"flex",gap:6,justifyContent:"center"}}>
                        <BtnLain small onClick={()=>startEdit(row)} outline>EDIT</BtnLain>
                        <BtnLain small onClick={()=>setDelId(row.id)} color="red" outline>HAPUS</BtnLain>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
            {adding&&(
              <tr style={{borderBottom:`1px solid ${C.cyanDim}`,background:C.cyanBg}}>
                <td style={{padding:"10px 14px"}}><span style={{fontFamily:C.mono,fontSize:10,color:C.cyanDim}}>AUTO</span></td>
                <td style={{padding:"10px 14px"}}><InlineInputLain value={newRow.nama} onChange={v=>setNewRow(r=>({...r,nama:v}))} placeholder="Nama jenis cacat"/></td>
                <td style={{padding:"10px 14px",textAlign:"center"}}>
                  <ToggleLain value={newRow.potongUpah} onChange={v=>setNewRow(r=>({...r,potongUpah:v}))} labelOn="YA" labelOff="TIDAK" colorOn={C.red} colorOff={C.textSub}/>
                </td>
                <td style={{padding:"10px 14px",textAlign:"center"}}>
                  <ToggleLain value={newRow.bisaRework} onChange={v=>setNewRow(r=>({...r,bisaRework:v}))} labelOn="YA" labelOff="TIDAK" colorOn={C.green}/>
                </td>
                <td style={{padding:"10px 14px"}}><InlineInputLain value={newRow.keterangan} onChange={v=>setNewRow(r=>({...r,keterangan:v}))} placeholder="Keterangan (opsional)"/></td>
                <td style={{padding:"10px 14px",textAlign:"center"}}>
                  <div style={{display:"flex",gap:6,justifyContent:"center"}}>
                    <BtnLain small onClick={addRow}>SIMPAN</BtnLain>
                    <BtnLain small onClick={()=>setAdding(false)} outline>BATAL</BtnLain>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div style={{padding:"10px 18px",borderTop:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between"}}>
        <span style={{fontSize:9,color:C.textMid,fontFamily:C.mono}}>{data.filter(x=>x.potongUpah).length} jenis potong upah · {data.filter(x=>x.bisaRework).length} bisa rework</span>
        <span style={{fontSize:9,color:C.textMid,fontFamily:C.mono}}>{data.length} JENIS TERDAFTAR</span>
      </div>
    </Panel>
  );
}

// ── KATEGORI TRANSAKSI ────────────────────────────────────────────────────────
const initKategoriTrx = [
  {id:"KTR-001",nama:"Pembelian Bahan Baku",tipe:"keluar",tambahStok:true,keterangan:"Otomatis tambah stok inventory"},
  {id:"KTR-002",nama:"Upah Karyawan",tipe:"keluar",tambahStok:false,keterangan:"Pembayaran gaji mingguan"},
  {id:"KTR-003",nama:"Operasional Listrik",tipe:"keluar",tambahStok:false,keterangan:"Tagihan listrik bulanan"},
  {id:"KTR-004",nama:"Operasional Rumah",tipe:"keluar",tambahStok:false,keterangan:"Sewa atau perawatan tempat"},
  {id:"KTR-005",nama:"Penerimaan PO",tipe:"masuk",tambahStok:false,keterangan:"Pembayaran dari klien"},
  {id:"KTR-006",nama:"Uang Makan",tipe:"keluar",tambahStok:false,keterangan:"Uang makan harian karyawan"},
  {id:"KTR-007",nama:"Pembelian Aksesori",tipe:"keluar",tambahStok:true,keterangan:"Kancing, resleting, label"},
  {id:"KTR-008",nama:"Pinjaman",tipe:"masuk",tambahStok:false,keterangan:"Dana pinjaman masuk — dipisah dari margin"},
];

function TabelKategoriTrx() {
  const [data,setData]=useState(initKategoriTrx);
  const [editId,setEditId]=useState(null);
  const [editVal,setEditVal]=useState({});
  const [adding,setAdding]=useState(false);
  const [newRow,setNewRow]=useState({nama:"",tipe:"keluar",tambahStok:false,keterangan:""});
  const [delId,setDelId]=useState(null);

  function startEdit(row){setEditId(row.id);setEditVal({nama:row.nama,tipe:row.tipe,tambahStok:row.tambahStok,keterangan:row.keterangan});}
  function saveEdit(){
    if(!editVal.nama.trim())return;
    setData(d=>d.map(x=>x.id===editId?{...x,...editVal}:x));
    setEditId(null);
  }
  function addRow(){
    if(!newRow.nama.trim())return;
    setData(d=>[...d,{id:genIdLain("KTR",d),...newRow}]);
    setNewRow({nama:"",tipe:"keluar",tambahStok:false,keterangan:""});
    setAdding(false);
  }

  return (
    <Panel title="KATEGORI TRANSAKSI" action="+ TAMBAH" onAction={()=>{setAdding(true);setEditId(null);}}>
      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",minWidth:640}}>
          <thead>
            <tr style={{background:"#0e204055"}}>
              {["ID","Nama Kategori","Tipe","Tambah Stok","Keterangan","Aksi"].map(h=>(
                <th key={h} style={{...TH,textAlign:["Tipe","Tambah Stok","Aksi"].includes(h)?"center":TH.textAlign}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row,i)=>(
              <tr key={row.id} style={{borderBottom:`1px solid ${C.border}`}}>
                {editId===row.id?(
                  <>
                    <td style={TD(i)}><span style={{fontFamily:C.mono,fontSize:10,color:C.textSub}}>{row.id}</span></td>
                    <td style={TD(i)}><InlineInputLain value={editVal.nama} onChange={v=>setEditVal(e=>({...e,nama:v}))} placeholder="Nama kategori"/></td>
                    <td style={{...TD(i),textAlign:"center"}}>
                      <InlineSelectLain value={editVal.tipe} onChange={v=>setEditVal(e=>({...e,tipe:v}))}
                        options={[{value:"masuk",label:"MASUK"},{value:"keluar",label:"KELUAR"}]} style={{width:100}}/>
                    </td>
                    <td style={{...TD(i),textAlign:"center"}}>
                      <ToggleLain value={editVal.tambahStok} onChange={v=>setEditVal(e=>({...e,tambahStok:v}))} labelOn="YA" labelOff="TIDAK" colorOn={C.cyan}/>
                    </td>
                    <td style={TD(i)}><InlineInputLain value={editVal.keterangan} onChange={v=>setEditVal(e=>({...e,keterangan:v}))} placeholder="Keterangan"/></td>
                    <td style={{...TD(i),textAlign:"center"}}>
                      <div style={{display:"flex",gap:6,justifyContent:"center"}}>
                        <BtnLain small onClick={saveEdit} color="green">SIMPAN</BtnLain>
                        <BtnLain small onClick={()=>setEditId(null)} outline>BATAL</BtnLain>
                      </div>
                    </td>
                  </>
                ):delId===row.id?(
                  <>
                    <td colSpan={5} style={{...TD(i),color:C.red,fontFamily:C.sans}}>⚠ Hapus kategori <strong>{row.nama}</strong>?</td>
                    <td style={{...TD(i),textAlign:"center"}}>
                      <div style={{display:"flex",gap:6,justifyContent:"center"}}>
                        <BtnLain small onClick={()=>{setData(d=>d.filter(x=>x.id!==row.id));setDelId(null);}} color="red">HAPUS</BtnLain>
                        <BtnLain small onClick={()=>setDelId(null)} outline>BATAL</BtnLain>
                      </div>
                    </td>
                  </>
                ):(
                  <>
                    <td style={TD(i)}><span style={{fontFamily:C.mono,fontSize:10,color:C.textSub}}>{row.id}</span></td>
                    <td style={TD(i)}><span style={{fontWeight:600}}>{row.nama}</span></td>
                    <td style={{...TD(i),textAlign:"center"}}>
                      <span style={{fontSize:9,padding:"2px 8px",borderRadius:99,fontFamily:C.mono,fontWeight:700,
                        background:row.tipe==="masuk"?`${C.green}18`:`${C.red}18`,
                        color:row.tipe==="masuk"?C.green:C.red,
                        border:`1px solid ${row.tipe==="masuk"?C.green+"33":C.red+"33"}`}}>
                        {row.tipe==="masuk"?"↑ MASUK":"↓ KELUAR"}
                      </span>
                    </td>
                    <td style={{...TD(i),textAlign:"center"}}>
                      {row.tambahStok?(
                        <span style={{fontSize:9,padding:"2px 8px",borderRadius:99,fontFamily:C.mono,fontWeight:700,
                          background:`${C.cyan}18`,color:C.cyan,border:`1px solid ${C.cyanDim}`}}>AUTO STOK</span>
                      ):(
                        <span style={{fontSize:9,color:C.textMid,fontFamily:C.mono}}>—</span>
                      )}
                    </td>
                    <td style={{...TD(i),color:C.textSub,fontSize:10}}>{row.keterangan||"—"}</td>
                    <td style={{...TD(i),textAlign:"center"}}>
                      <div style={{display:"flex",gap:6,justifyContent:"center"}}>
                        <BtnLain small onClick={()=>startEdit(row)} outline>EDIT</BtnLain>
                        <BtnLain small onClick={()=>setDelId(row.id)} color="red" outline>HAPUS</BtnLain>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
            {adding&&(
              <tr style={{borderBottom:`1px solid ${C.cyanDim}`,background:C.cyanBg}}>
                <td style={{padding:"10px 14px"}}><span style={{fontFamily:C.mono,fontSize:10,color:C.cyanDim}}>AUTO</span></td>
                <td style={{padding:"10px 14px"}}><InlineInputLain value={newRow.nama} onChange={v=>setNewRow(r=>({...r,nama:v}))} placeholder="Nama kategori baru"/></td>
                <td style={{padding:"10px 14px",textAlign:"center"}}>
                  <InlineSelectLain value={newRow.tipe} onChange={v=>setNewRow(r=>({...r,tipe:v}))}
                    options={[{value:"masuk",label:"MASUK"},{value:"keluar",label:"KELUAR"}]} style={{width:100}}/>
                </td>
                <td style={{padding:"10px 14px",textAlign:"center"}}>
                  <ToggleLain value={newRow.tambahStok} onChange={v=>setNewRow(r=>({...r,tambahStok:v}))} labelOn="YA" labelOff="TIDAK" colorOn={C.cyan}/>
                </td>
                <td style={{padding:"10px 14px"}}><InlineInputLain value={newRow.keterangan} onChange={v=>setNewRow(r=>({...r,keterangan:v}))} placeholder="Keterangan (opsional)"/></td>
                <td style={{padding:"10px 14px",textAlign:"center"}}>
                  <div style={{display:"flex",gap:6,justifyContent:"center"}}>
                    <BtnLain small onClick={addRow}>SIMPAN</BtnLain>
                    <BtnLain small onClick={()=>setAdding(false)} outline>BATAL</BtnLain>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div style={{padding:"10px 18px",borderTop:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between"}}>
        <span style={{fontSize:9,color:C.textMid,fontFamily:C.mono}}>
          {data.filter(x=>x.tipe==="masuk").length} masuk · {data.filter(x=>x.tipe==="keluar").length} keluar · {data.filter(x=>x.tambahStok).length} auto stok
        </span>
        <span style={{fontSize:9,color:C.textMid,fontFamily:C.mono}}>{data.length} KATEGORI</span>
      </div>
    </Panel>
  );
}

// ── SATUAN (UOM) ──────────────────────────────────────────────────────────────
const initSatuan = [
  {id:"STN-001",nama:"PCS",keterangan:"Per pieces / satuan"},
  {id:"STN-002",nama:"METER",keterangan:"Meter — untuk kain"},
  {id:"STN-003",nama:"YARD",keterangan:"Yard — untuk kain import"},
  {id:"STN-004",nama:"LUSIN",keterangan:"12 pieces"},
  {id:"STN-005",nama:"KODI",keterangan:"20 pieces"},
  {id:"STN-006",nama:"ROLL",keterangan:"Per roll kain"},
  {id:"STN-007",nama:"KG",keterangan:"Kilogram — benang, aksesoris"},
  {id:"STN-008",nama:"GROSS",keterangan:"144 pieces"},
];

function TabelSatuan() {
  const [data,setData]=useState(initSatuan);
  const [editId,setEditId]=useState(null);
  const [editVal,setEditVal]=useState({});
  const [adding,setAdding]=useState(false);
  const [newRow,setNewRow]=useState({nama:"",keterangan:""});
  const [delId,setDelId]=useState(null);

  function startEdit(row){setEditId(row.id);setEditVal({nama:row.nama,keterangan:row.keterangan});}
  function saveEdit(){
    if(!editVal.nama.trim())return;
    setData(d=>d.map(x=>x.id===editId?{...x,...editVal}:x));
    setEditId(null);
  }
  function addRow(){
    if(!newRow.nama.trim())return;
    setData(d=>[...d,{id:genIdLain("STN",d),nama:newRow.nama.toUpperCase(),keterangan:newRow.keterangan}]);
    setNewRow({nama:"",keterangan:""});
    setAdding(false);
  }

  return (
    <Panel title="SATUAN (UOM)" action="+ TAMBAH" onAction={()=>{setAdding(true);setEditId(null);}}>
      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",minWidth:400}}>
          <thead>
            <tr style={{background:"#0e204055"}}>
              {["ID","Nama Satuan","Keterangan","Aksi"].map(h=>(
                <th key={h} style={{...TH,textAlign:h==="Aksi"?"center":TH.textAlign}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row,i)=>(
              <tr key={row.id} style={{borderBottom:`1px solid ${C.border}`}}>
                {editId===row.id?(
                  <>
                    <td style={TD(i)}><span style={{fontFamily:C.mono,fontSize:10,color:C.textSub}}>{row.id}</span></td>
                    <td style={TD(i)}><InlineInputLain value={editVal.nama} onChange={v=>setEditVal(e=>({...e,nama:v.toUpperCase()}))} placeholder="Nama satuan"/></td>
                    <td style={TD(i)}><InlineInputLain value={editVal.keterangan} onChange={v=>setEditVal(e=>({...e,keterangan:v}))} placeholder="Keterangan"/></td>
                    <td style={{...TD(i),textAlign:"center"}}>
                      <div style={{display:"flex",gap:6,justifyContent:"center"}}>
                        <BtnLain small onClick={saveEdit} color="green">SIMPAN</BtnLain>
                        <BtnLain small onClick={()=>setEditId(null)} outline>BATAL</BtnLain>
                      </div>
                    </td>
                  </>
                ):delId===row.id?(
                  <>
                    <td colSpan={3} style={{...TD(i),color:C.red,fontFamily:C.sans}}>⚠ Hapus satuan <strong>{row.nama}</strong>?</td>
                    <td style={{...TD(i),textAlign:"center"}}>
                      <div style={{display:"flex",gap:6,justifyContent:"center"}}>
                        <BtnLain small onClick={()=>{setData(d=>d.filter(x=>x.id!==row.id));setDelId(null);}} color="red">HAPUS</BtnLain>
                        <BtnLain small onClick={()=>setDelId(null)} outline>BATAL</BtnLain>
                      </div>
                    </td>
                  </>
                ):(
                  <>
                    <td style={TD(i)}><span style={{fontFamily:C.mono,fontSize:10,color:C.textSub}}>{row.id}</span></td>
                    <td style={TD(i)}>
                      <span style={{fontFamily:C.mono,fontWeight:700,fontSize:12,color:C.yellow}}>{row.nama}</span>
                    </td>
                    <td style={{...TD(i),color:C.textSub,fontSize:10}}>{row.keterangan||"—"}</td>
                    <td style={{...TD(i),textAlign:"center"}}>
                      <div style={{display:"flex",gap:6,justifyContent:"center"}}>
                        <BtnLain small onClick={()=>startEdit(row)} outline>EDIT</BtnLain>
                        <BtnLain small onClick={()=>setDelId(row.id)} color="red" outline>HAPUS</BtnLain>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
            {adding&&(
              <tr style={{borderBottom:`1px solid ${C.cyanDim}`,background:C.cyanBg}}>
                <td style={{padding:"10px 14px"}}><span style={{fontFamily:C.mono,fontSize:10,color:C.cyanDim}}>AUTO</span></td>
                <td style={{padding:"10px 14px"}}><InlineInputLain value={newRow.nama} onChange={v=>setNewRow(r=>({...r,nama:v.toUpperCase()}))} placeholder="Contoh: PACK"/></td>
                <td style={{padding:"10px 14px"}}><InlineInputLain value={newRow.keterangan} onChange={v=>setNewRow(r=>({...r,keterangan:v}))} placeholder="Keterangan (opsional)"/></td>
                <td style={{padding:"10px 14px",textAlign:"center"}}>
                  <div style={{display:"flex",gap:6,justifyContent:"center"}}>
                    <BtnLain small onClick={addRow}>SIMPAN</BtnLain>
                    <BtnLain small onClick={()=>setAdding(false)} outline>BATAL</BtnLain>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div style={{padding:"10px 18px",borderTop:`1px solid ${C.border}`,display:"flex",justifyContent:"flex-end"}}>
        <span style={{fontSize:9,color:C.textMid,fontFamily:C.mono}}>{data.length} SATUAN TERDAFTAR</span>
      </div>
    </Panel>
  );
}

// ── USER & ROLE ───────────────────────────────────────────────────────────────
const ROLE_LIST = ["Owner","Admin Produksi","Admin Keuangan","Supervisor","Mandor"];
const ROLE_COLOR = {
  "Owner":C.cyan,
  "Admin Produksi":C.green,
  "Admin Keuangan":C.yellow,
  "Supervisor":C.blue,
  "Mandor":C.orange,
};

const initUser = [
  {id:"USR-001",nama:"Pak Hendra",email:"hendra@stitchlyx.com",role:["Owner"],statusAktif:true},
  {id:"USR-002",nama:"Rizki Fadilah",email:"rizki@stitchlyx.com",role:["Admin Produksi","Supervisor"],statusAktif:true},
  {id:"USR-003",nama:"Sari Dewi",email:"sari@stitchlyx.com",role:["Admin Keuangan"],statusAktif:true},
  {id:"USR-004",nama:"Mandor Agus",email:"agus@stitchlyx.com",role:["Mandor"],statusAktif:true},
  {id:"USR-005",nama:"Mandor Budi",email:"budi@stitchlyx.com",role:["Mandor"],statusAktif:false},
];

function FormUser({existing,onSave,onCancel,allData}) {
  const isEdit=!!existing;
  const [form,setForm]=useState({
    nama:existing?.nama||"",
    email:existing?.email||"",
    role:existing?.role||[],
    statusAktif:existing?.statusAktif??true,
  });
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  function toggleRole(r){set("role",form.role.includes(r)?form.role.filter(x=>x!==r):[...form.role,r]);}
  const valid=form.nama.trim()&&form.email.trim()&&form.role.length>0;

  return (
    <div style={{padding:"20px 24px"}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 32px"}}>
        <div>
          <div style={{fontSize:9,fontWeight:700,color:C.cyan,fontFamily:C.mono,letterSpacing:"0.12em",
            textTransform:"uppercase",paddingBottom:6,borderBottom:`1px solid ${C.border}`,marginBottom:14}}>
            DATA PENGGUNA
          </div>
          <div style={{marginBottom:14}}>
            <div style={{fontSize:9,color:C.textSub,fontFamily:C.sans,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:5}}>Nama Lengkap <span style={{color:C.red}}>*</span></div>
            <input value={form.nama} onChange={e=>set("nama",e.target.value)} placeholder="Nama pengguna"
              style={{width:"100%",background:"#050e1f",border:`1px solid ${C.border2}`,borderRadius:6,
                padding:"7px 10px",fontSize:11,color:C.text,fontFamily:C.sans,outline:"none"}}/>
          </div>
          <div style={{marginBottom:14}}>
            <div style={{fontSize:9,color:C.textSub,fontFamily:C.sans,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:5}}>Email <span style={{color:C.red}}>*</span></div>
            <input value={form.email} onChange={e=>set("email",e.target.value)} placeholder="email@domain.com" type="email"
              style={{width:"100%",background:"#050e1f",border:`1px solid ${C.border2}`,borderRadius:6,
                padding:"7px 10px",fontSize:11,color:C.text,fontFamily:C.mono,outline:"none"}}/>
          </div>
          <div style={{marginBottom:14}}>
            <div style={{fontSize:9,color:C.textSub,fontFamily:C.sans,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:5}}>Status Aktif</div>
            <div style={{display:"flex",gap:8}}>
              {[true,false].map(v=>(
                <button key={String(v)} onClick={()=>set("statusAktif",v)}
                  style={{padding:"6px 16px",fontSize:10,fontWeight:700,fontFamily:C.mono,
                    background:form.statusAktif===v?(v?`${C.green}22`:`${C.red}22`):"transparent",
                    color:form.statusAktif===v?(v?C.green:C.red):C.textMid,
                    border:`1px solid ${form.statusAktif===v?(v?C.green:C.red):C.border}`,
                    borderRadius:6,cursor:"pointer"}}>
                  {v?"AKTIF":"NON-AKTIF"}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div>
          <div style={{fontSize:9,fontWeight:700,color:C.purple,fontFamily:C.mono,letterSpacing:"0.12em",
            textTransform:"uppercase",paddingBottom:6,borderBottom:`1px solid ${C.border}`,marginBottom:14}}>
            ROLE / AKSES <span style={{color:C.red,fontSize:10}}>*</span>
          </div>
          <div style={{fontSize:9,color:C.textSub,fontFamily:C.sans,marginBottom:10}}>
            Satu akun bisa punya lebih dari satu role (dual role).
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {ROLE_LIST.map(r=>{
              const checked=form.role.includes(r);
              const col=ROLE_COLOR[r]||C.cyan;
              return (
                <div key={r} onClick={()=>toggleRole(r)}
                  style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",
                    borderRadius:8,cursor:"pointer",
                    background:checked?`${col}12`:"#050e1f",
                    border:`1px solid ${checked?col+"44":C.border2}`,
                    transition:"all 0.1s"}}>
                  <div style={{width:16,height:16,borderRadius:3,flexShrink:0,
                    background:checked?col:"transparent",
                    border:`1.5px solid ${checked?col:C.textMid}`,
                    display:"flex",alignItems:"center",justifyContent:"center"}}>
                    {checked&&<span style={{fontSize:10,color:"#000",fontWeight:900}}>✓</span>}
                  </div>
                  <span style={{fontSize:11,fontWeight:checked?700:400,color:checked?col:C.textSub,fontFamily:C.sans,flex:1}}>{r}</span>
                  {r==="Owner"&&<span style={{fontSize:8,color:C.cyan,fontFamily:C.mono,background:`${C.cyan}15`,
                    padding:"1px 6px",borderRadius:3,border:`1px solid ${C.cyanDim}`}}>FULL ACCESS</span>}
                  {r==="Mandor"&&<span style={{fontSize:8,color:C.orange,fontFamily:C.mono,background:`${C.orange}15`,
                    padding:"1px 6px",borderRadius:3,border:`1px solid ${C.orange}44`}}>SCANNER ONLY</span>}
                </div>
              );
            })}
          </div>
          {form.role.length===0&&(
            <div style={{marginTop:8,fontSize:9,color:C.red,fontFamily:C.sans}}>⚠ Pilih minimal 1 role</div>
          )}
        </div>
      </div>
      <div style={{display:"flex",gap:10,justifyContent:"flex-end",paddingTop:16,borderTop:`1px solid ${C.border}`,marginTop:4}}>
        <BtnLain onClick={onCancel} outline>BATAL</BtnLain>
        <BtnLain onClick={()=>{if(!valid)return;onSave({...existing,id:existing?.id||genIdLain("USR",allData),...form});}} disabled={!valid} color="green">
          {isEdit?"SIMPAN PERUBAHAN":"TAMBAH PENGGUNA"}
        </BtnLain>
      </div>
    </div>
  );
}

function TabelUserRole() {
  const [data,setData]=useState(initUser);
  const [mode,setMode]=useState(null);
  const [delId,setDelId]=useState(null);

  function handleSave(u){
    if(mode?.edit) setData(d=>d.map(x=>x.id===u.id?u:x));
    else setData(d=>[...d,u]);
    setMode(null);
  }
  const showForm=mode==="add"||mode?.edit;

  return (
    <Panel title="USER & ROLE" action={showForm?null:"+ TAMBAH USER"} onAction={()=>setMode("add")}>
      {showForm?(
        <FormUser existing={mode?.edit||null} onSave={handleSave} onCancel={()=>setMode(null)} allData={data}/>
      ):(
        <>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",minWidth:560}}>
              <thead>
                <tr style={{background:"#0e204055"}}>
                  {["ID","Nama","Email","Role","Status","Aksi"].map(h=>(
                    <th key={h} style={{...TH,textAlign:h==="Aksi"?"center":TH.textAlign}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row,i)=>(
                  <tr key={row.id} style={{borderBottom:`1px solid ${C.border}`}}>
                    {delId===row.id?(
                      <>
                        <td colSpan={5} style={{...TD(i),color:C.red,fontFamily:C.sans}}>
                          ⚠ Hapus user <strong>{row.nama}</strong>? Akses sistem akan langsung dicabut.
                        </td>
                        <td style={{...TD(i),textAlign:"center"}}>
                          <div style={{display:"flex",gap:6,justifyContent:"center"}}>
                            <BtnLain small onClick={()=>{setData(d=>d.filter(x=>x.id!==row.id));setDelId(null);}} color="red">HAPUS</BtnLain>
                            <BtnLain small onClick={()=>setDelId(null)} outline>BATAL</BtnLain>
                          </div>
                        </td>
                      </>
                    ):(
                      <>
                        <td style={TD(i)}><span style={{fontFamily:C.mono,fontSize:10,color:C.textSub}}>{row.id}</span></td>
                        <td style={TD(i)}><span style={{fontWeight:600}}>{row.nama}</span></td>
                        <td style={TD(i)}><span style={{fontFamily:C.mono,fontSize:10,color:C.textSub}}>{row.email}</span></td>
                        <td style={TD(i)}>
                          <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                            {row.role.map(r=>{
                              const col=ROLE_COLOR[r]||C.cyan;
                              return (
                                <span key={r} style={{fontSize:9,padding:"2px 7px",borderRadius:4,fontFamily:C.mono,fontWeight:700,
                                  background:`${col}18`,color:col,border:`1px solid ${col}33`}}>{r}</span>
                              );
                            })}
                          </div>
                        </td>
                        <td style={TD(i)}>
                          <span style={{display:"inline-flex",alignItems:"center",gap:5,padding:"2px 8px",
                            borderRadius:99,fontSize:9,fontWeight:700,fontFamily:C.mono,
                            background:row.statusAktif?"#001a20":"#1a1040",
                            color:row.statusAktif?C.cyan:C.purple,
                            border:`1px solid ${row.statusAktif?C.cyan+"30":C.purple+"30"}`}}>
                            <span style={{width:5,height:5,borderRadius:"50%",background:row.statusAktif?C.cyan:C.purple,display:"inline-block"}}/>
                            {row.statusAktif?"Aktif":"Non-Aktif"}
                          </span>
                        </td>
                        <td style={{...TD(i),textAlign:"center"}}>
                          <div style={{display:"flex",gap:6,justifyContent:"center"}}>
                            <BtnLain small onClick={()=>setMode({edit:row})} outline>EDIT</BtnLain>
                            <BtnLain small onClick={()=>setDelId(row.id)} color="red" outline>HAPUS</BtnLain>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{padding:"10px 18px",borderTop:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between"}}>
            <span style={{fontSize:9,color:C.textMid,fontFamily:C.mono}}>
              {data.filter(x=>x.statusAktif).length} aktif · {data.filter(x=>!x.statusAktif).length} non-aktif
            </span>
            <span style={{fontSize:9,color:C.textMid,fontFamily:C.mono}}>{data.length} PENGGUNA</span>
          </div>
        </>
      )}
    </Panel>
  );
}

// ── MAIN EXPORT ───────────────────────────────────────────────────────────────
const TABS_LAIN = [
  {id:"reject",   label:"Jenis Reject"},
  {id:"trx",      label:"Kategori Transaksi"},
  {id:"satuan",   label:"Satuan (UOM)"},
  {id:"user",     label:"User & Role"},
];

function MasterLainnya({defaultTab="reject"}) {
  const [activeTab,setActiveTab]=useState(defaultTab);

  return (
    <div>
      <div style={{marginBottom:20,paddingBottom:16,borderBottom:`1px solid ${C.border}`,
        display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
        <div>
          <div style={{fontSize:10,color:C.textSub,fontFamily:C.mono,letterSpacing:"0.07em",marginBottom:4}}>
            MASTER DATA
          </div>
          <div style={{fontSize:13,color:C.textMid,fontFamily:C.sans}}>
            {TABS_LAIN.find(t=>t.id===activeTab)?.label}
          </div>
        </div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {TABS_LAIN.map(t=>(
            <button key={t.id} onClick={()=>setActiveTab(t.id)}
              style={{padding:"6px 14px",fontSize:10,fontWeight:700,fontFamily:C.mono,
                background:activeTab===t.id?C.cyan:"transparent",
                color:activeTab===t.id?"#000":C.textSub,
                border:`1px solid ${activeTab===t.id?C.cyan:C.border}`,
                borderRadius:8,cursor:"pointer",transition:"all 0.1s"}}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab==="reject"  && <TabelJenisReject/>}
      {activeTab==="trx"     && <TabelKategoriTrx/>}
      {activeTab==="satuan"  && <TabelSatuan/>}
      {activeTab==="user"    && <TabelUserRole/>}
    </div>
  );
}




// --- INPUT PO (v2 — with barcode gen + detail + print) ---





function BtnPO2({children,onClick,color="cyan",small=false,outline=false,disabled=false,full=false}) {
  const colMap={cyan:C.cyan,green:C.green,red:C.red,yellow:C.yellow,orange:C.orange,purple:C.purple};
  const col=colMap[color]||C.cyan;
  return (
    <button onClick={onClick} disabled={disabled}
      style={{padding:small?"4px 10px":"8px 18px",fontSize:small?9:11,fontWeight:700,fontFamily:C.mono,
        background:disabled?"#1a2030":outline?"transparent":col,
        color:disabled?C.textMid:outline?col:"#000",
        border:`1px solid ${disabled?"#1a2030":col}`,
        borderRadius:6,cursor:disabled?"not-allowed":"pointer",
        letterSpacing:"0.05em",whiteSpace:"nowrap",opacity:disabled?0.5:1,
        width:full?"100%":"auto"}}>
      {children}
    </button>
  );
}

// ── MASTER DATA DUMMY ─────────────────────────────────────────────────────────
const MASTER_KLIEN = [
  {id:"KLN-001",nama:"PT. Elysian Garment"},
  {id:"KLN-002",nama:"CV. Maju Bersama"},
  {id:"KLN-003",nama:"Toko Sportivo"},
];

const MASTER_PRODUK = [
  {skuKlien:"ely289",skuInternal:"LYX-0001-KOU",model:"Airflow",size:"S",    warna:"Black",  hargaJual:185000},
  {skuKlien:"ely290",skuInternal:"LYX-0002-KOU",model:"Airflow",size:"M",    warna:"Black",  hargaJual:185000},
  {skuKlien:"ely291",skuInternal:"LYX-0003-KOU",model:"Airflow",size:"L",    warna:"Black",  hargaJual:190000},
  {skuKlien:"ely292",skuInternal:"LYX-0004-KOU",model:"Airflow",size:"XL",   warna:"Black",  hargaJual:195000},
  {skuKlien:"ely293",skuInternal:"LYX-0005-KOU",model:"Airflow",size:"XXL",  warna:"Black",  hargaJual:200000},
  {skuKlien:"ely294",skuInternal:"LYX-0006-KOU",model:"Airflow",size:"XXXL", warna:"Black",  hargaJual:210000},
  {skuKlien:"ely304",skuInternal:"LYX-0007-KOU",model:"Airflow",size:"XL",   warna:"Skyblue",hargaJual:195000},
  {skuKlien:"ely320",skuInternal:"LYX-0009-KOU",model:"Airflow",size:"M",    warna:"Navy",   hargaJual:185000},
  {skuKlien:"ely321",skuInternal:"LYX-0010-KOU",model:"Airflow",size:"L",    warna:"Navy",   hargaJual:190000},
  {skuKlien:"ely330",skuInternal:"LYX-0011-KOU",model:"Neck",   size:"S",    warna:"Black",  hargaJual:165000},
  {skuKlien:"ely331",skuInternal:"LYX-0012-KOU",model:"Neck",   size:"M",    warna:"Black",  hargaJual:165000},
  {skuKlien:"ely332",skuInternal:"LYX-0013-KOU",model:"Neck",   size:"L",    warna:"Black",  hargaJual:170000},
  {skuKlien:"ely333",skuInternal:"LYX-0014-KOU",model:"Neck",   size:"XXL",  warna:"Navy",   hargaJual:180000},
];

// ── HELPER GENERATE BARCODE ───────────────────────────────────────────────────

// Singkatan nama model: ambil 3 huruf pertama
function singkatModel(model) {
  return model.slice(0,3).charAt(0).toUpperCase()+model.slice(1,3).toLowerCase();
}

// Singkatan warna: ambil 4 huruf pertama lowercase
function singkatWarna(warna) {
  return warna.slice(0,4).toLowerCase();
}

// Format tanggal DD-MM-YY
function formatTanggalBarcode(tgl) {
  const d = new Date(tgl);
  const dd = String(d.getDate()).padStart(2,"0");
  const mm = String(d.getMonth()+1).padStart(2,"0");
  const yy = String(d.getFullYear()).slice(-2);
  return `${dd}-${mm}-${yy}`;
}

// Generate semua bundle untuk satu PO
// nomorUrutAwal = nomor urut global saat ini (terus naik, tidak boleh terulang)
function generateBundlesPO(kodePO, baris, tanggal, nomorUrutAwal) {
  const tglStr   = formatTanggalBarcode(tanggal);
  const poShort  = kodePO.replace("PO-","");
  let   urutGlobal = nomorUrutAwal;
  const semuaBundle = [];

  baris.forEach(b => {
    const produk = MASTER_PRODUK.find(p=>p.skuKlien===b.skuKlien);
    if(!produk||!b.qtyOrder||!b.isiBundle) return;

    const jumlahBundle = Math.ceil(b.qtyOrder/b.isiBundle);
    const mdl  = singkatModel(produk.model);
    const wrn  = singkatWarna(produk.warna);
    const sz   = produk.size.toLowerCase();
    const urutStr = String(urutGlobal).padStart(4,"0");

    for(let bdl=1; bdl<=jumlahBundle; bdl++) {
      const bdlStr = String(bdl).padStart(2,"0");
      // Format: PO[nopo]-[mdl]-[wrn]-[size]-[urutglobal]-BDL[nourut]-[DD-MM-YY]
      const kodeBarcode = `PO${poShort}-${mdl}-${wrn}-${sz}-${urutStr}-BDL${bdlStr}-${tglStr}`;
      const qtyBundle   = bdl<jumlahBundle ? b.isiBundle : b.qtyOrder - b.isiBundle*(bdl-1);
      semuaBundle.push({
        kodeBarcode,
        kodePO,
        skuKlien:   b.skuKlien,
        skuInternal:produk.skuInternal,
        model:      produk.model,
        warna:      produk.warna,
        size:       produk.size,
        namaArtikel:`${produk.model} ${produk.warna} ${produk.size}`,
        noUrut:     bdl,
        totalBundle:jumlahBundle,
        qtyBundle,
        urutGlobal,
      });
    }
    urutGlobal++;
  });

  return { bundles: semuaBundle, nextUrut: urutGlobal };
}

// PO dummy dengan bundles sudah di-generate
const initDaftarPO = [
  {
    kode:"PO-0001",idKlien:"KLN-001",tanggal:"2025-03-01",status:"Aktif",totalSKU:3,totalQty:39,
    baris:[
      {skuKlien:"ely289",qtyOrder:12,isiBundle:6},
      {skuKlien:"ely290",qtyOrder:12,isiBundle:6},
      {skuKlien:"ely291",qtyOrder:15,isiBundle:8},
    ],
    bundles: generateBundlesPO("PO-0001",[
      {skuKlien:"ely289",qtyOrder:12,isiBundle:6},
      {skuKlien:"ely290",qtyOrder:12,isiBundle:6},
      {skuKlien:"ely291",qtyOrder:15,isiBundle:8},
    ],"2025-03-01",1).bundles,
  },
  {
    kode:"PO-0002",idKlien:"KLN-001",tanggal:"2025-03-10",status:"Aktif",totalSKU:2,totalQty:36,
    baris:[
      {skuKlien:"ely330",qtyOrder:18,isiBundle:9},
      {skuKlien:"ely331",qtyOrder:18,isiBundle:9},
    ],
    bundles: generateBundlesPO("PO-0002",[
      {skuKlien:"ely330",qtyOrder:18,isiBundle:9},
      {skuKlien:"ely331",qtyOrder:18,isiBundle:9},
    ],"2025-03-10",4).bundles,
  },
];

// Nomor urut global terakhir
let globalUrutCounter = 6;

function genKodePO2(arr) {
  const nums=arr.map(x=>parseInt(x.kode.replace("PO-","")||0));
  return `PO-${String(Math.max(0,...nums)+1).padStart(4,"0")}`;
}

// ── BARCODE VISUAL SEDERHANA (SVG bars) ──────────────────────────────────────
// Code128-like visual — hanya untuk preview, bukan encoding resmi
function BarcodeVisual({value,width=180,height=40}) {
  const bars = [];
  let x = 0;
  const barW = width / (value.length * 2 + 4);
  for(let i=0;i<value.length;i++){
    const code = value.charCodeAt(i);
    const wide = code%3===0;
    const w = wide ? barW*2 : barW;
    if(i%2===0) bars.push(<rect key={i} x={x} y={0} width={w} height={height} fill="#000"/>);
    x += w + barW*0.7;
  }
  // Guard bars
  bars.unshift(<rect key="g1" x={0} y={0} width={barW} height={height} fill="#000"/>);
  bars.push(<rect key="g2" x={Math.min(x,width-barW)} y={0} width={barW} height={height} fill="#000"/>);
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{display:"block"}}>
      <rect width={width} height={height} fill="white"/>
      {bars}
    </svg>
  );
}

// ── TIKET BARCODE (untuk print) ───────────────────────────────────────────────
function TiketBarcode({bundle,selected,onToggle,forPrint=false}) {
  const bg = forPrint ? "#fff" : C.card;
  const textColor = forPrint ? "#000" : C.text;
  const subColor  = forPrint ? "#444" : C.textSub;
  const borderCol = forPrint ? "#ccc" : (selected ? C.cyan+"88" : C.border);

  return (
    <div onClick={!forPrint?onToggle:undefined}
      style={{background:bg,border:`2px solid ${borderCol}`,borderRadius:8,
        padding:"10px 12px",cursor:forPrint?"default":"pointer",
        position:"relative",transition:"border-color 0.1s",
        outline:selected&&!forPrint?`1px solid ${C.cyan}`:"none"}}>

      {/* Checkbox */}
      {!forPrint&&(
        <div style={{position:"absolute",top:8,right:8,
          width:16,height:16,borderRadius:3,
          background:selected?C.cyan:"transparent",
          border:`2px solid ${selected?C.cyan:C.border}`,
          display:"flex",alignItems:"center",justifyContent:"center"}}>
          {selected&&<span style={{fontSize:10,color:"#000",fontWeight:900,lineHeight:1}}>✓</span>}
        </div>
      )}

      {/* Barcode visual */}
      <div style={{marginBottom:6,display:"flex",justifyContent:"center"}}>
        <BarcodeVisual value={bundle.kodeBarcode} width={forPrint?160:140} height={forPrint?36:30}/>
      </div>

      {/* Kode teks */}
      <div style={{fontSize:forPrint?7:8,fontFamily:"monospace",color:forPrint?"#000":C.cyan,
        textAlign:"center",letterSpacing:"0.04em",marginBottom:5,wordBreak:"break-all",
        fontWeight:700,lineHeight:1.3}}>
        {bundle.kodeBarcode}
      </div>

      <div style={{borderTop:`1px solid ${forPrint?"#ddd":C.border}`,paddingTop:5,marginTop:3}}>
        <div style={{fontSize:forPrint?8:9,fontWeight:700,color:textColor,fontFamily:"sans-serif",marginBottom:2}}>
          {bundle.namaArtikel}
        </div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:6}}>
          <span style={{fontSize:forPrint?7:8,color:subColor,fontFamily:"monospace"}}>{bundle.kodePO}</span>
          <span style={{fontSize:forPrint?7:8,color:subColor,fontFamily:"monospace"}}>{bundle.skuKlien}</span>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",marginTop:2}}>
          <span style={{fontSize:forPrint?7:8,color:forPrint?"#444":C.textMid,fontFamily:"monospace"}}>
            Bundle {bundle.noUrut}/{bundle.totalBundle}
          </span>
          <span style={{fontSize:forPrint?8:9,fontWeight:700,color:forPrint?"#000":C.yellow,fontFamily:"monospace"}}>
            {bundle.qtyBundle} pcs
          </span>
        </div>
      </div>
    </div>
  );
}

// ── DETAIL PO ─────────────────────────────────────────────────────────────────
function DetailPO({po,onBack}) {
  const klien = MASTER_KLIEN.find(k=>k.id===po.idKlien);
  const [selected,setSelected] = useState(new Set());

  // Group bundle per artikel
  const artikelMap = {};
  po.bundles.forEach(b=>{
    if(!artikelMap[b.skuKlien]) artikelMap[b.skuKlien]={...b,bundles:[]};
    artikelMap[b.skuKlien].bundles.push(b);
  });
  const artikelList = Object.values(artikelMap);

  function toggleBundle(kode) {
    setSelected(s=>{const ns=new Set(s); ns.has(kode)?ns.delete(kode):ns.add(kode); return ns;});
  }
  function toggleArtikel(skuKlien) {
    const bundleKodes = artikelMap[skuKlien].bundles.map(b=>b.kodeBarcode);
    const allSel = bundleKodes.every(k=>selected.has(k));
    setSelected(s=>{
      const ns=new Set(s);
      bundleKodes.forEach(k=>allSel?ns.delete(k):ns.add(k));
      return ns;
    });
  }
  function toggleAll() {
    if(selected.size===po.bundles.length) setSelected(new Set());
    else setSelected(new Set(po.bundles.map(b=>b.kodeBarcode)));
  }

  function handlePrint() {
    const selectedBundles = po.bundles.filter(b=>selected.has(b.kodeBarcode));
    if(!selectedBundles.length) return;

    const printContent = selectedBundles.map(b=>`
      <div class="tiket">
        <div class="barcode-wrap">
          <svg width="160" height="36" viewBox="0 0 160 36">
            <rect width="160" height="36" fill="white"/>
            ${generateBarSVG(b.kodeBarcode,160,36)}
          </svg>
        </div>
        <div class="kode">${b.kodeBarcode}</div>
        <div class="divider"></div>
        <div class="nama">${b.namaArtikel}</div>
        <div class="row">
          <span>${b.kodePO}</span>
          <span>${b.skuKlien}</span>
        </div>
        <div class="row">
          <span>Bundle ${b.noUrut}/${b.totalBundle}</span>
          <span class="qty">${b.qtyBundle} pcs</span>
        </div>
      </div>
    `).join("");

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
    <style>
      @page{margin:8mm}
      *{box-sizing:border-box}
      body{font-family:monospace;margin:0;background:#fff}
      .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:6mm}
      .tiket{border:1px solid #999;border-radius:4px;padding:6px;page-break-inside:avoid}
      .barcode-wrap{display:flex;justify-content:center;margin-bottom:4px}
      .kode{font-size:6px;text-align:center;word-break:break-all;font-weight:700;margin-bottom:4px;letter-spacing:0.03em}
      .divider{border-top:1px solid #ccc;margin:3px 0}
      .nama{font-size:8px;font-weight:700;margin-bottom:2px}
      .row{display:flex;justify-content:space-between;font-size:7px;color:#444;margin-top:1px}
      .qty{font-weight:700;color:#000}
      @media print{.grid{grid-template-columns:repeat(3,1fr)}}
    </style></head><body>
    <div class="grid">${printContent}</div>
    </body></html>`;

    const w=window.open("","_blank","width=800,height=600");
    w.document.write(html);
    w.document.close();
    w.onload=()=>{w.focus();w.print();};
  }

  // SVG bars untuk print
  function generateBarSVG(value,width,height) {
    let out=""; let x=0;
    const barW=width/(value.length*2+4);
    for(let i=0;i<value.length;i++){
      const code=value.charCodeAt(i);
      const wide=code%3===0;
      const w=wide?barW*2:barW;
      if(i%2===0) out+=`<rect x="${x.toFixed(1)}" y="0" width="${w.toFixed(1)}" height="${height}" fill="#000"/>`;
      x+=w+barW*0.7;
    }
    out=`<rect x="0" y="0" width="${barW.toFixed(1)}" height="${height}" fill="#000"/>`+out;
    out+=`<rect x="${Math.min(x,width-barW).toFixed(1)}" y="0" width="${barW.toFixed(1)}" height="${height}" fill="#000"/>`;
    return out;
  }

  const TH={padding:"9px 14px",textAlign:"left",fontSize:9,fontWeight:700,
    color:C.textSub,textTransform:"uppercase",letterSpacing:"0.07em",fontFamily:C.sans,whiteSpace:"nowrap"};
  const TD=(i)=>({padding:"11px 14px",fontSize:11,color:C.text,fontFamily:C.sans,
    background:i%2===0?C.card:C.card2});

  return (
    <div>
      {/* Header */}
      <div style={{marginBottom:20,paddingBottom:16,borderBottom:`1px solid ${C.border}`,
        display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <div style={{fontSize:10,color:C.textSub,fontFamily:C.mono,letterSpacing:"0.07em",marginBottom:4}}>
            INPUT PO / DETAIL
          </div>
          <div style={{fontSize:20,fontWeight:800,color:C.cyan,fontFamily:C.syne}}>{po.kode}</div>
        </div>
        <BtnPO2 onClick={onBack} outline>← KEMBALI</BtnPO2>
      </div>

      {/* Info PO */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:16}}>
        {[
          {label:"Klien",    value:klien?.nama||po.idKlien, color:C.text},
          {label:"Tanggal",  value:po.tanggal,              color:C.textSub},
          {label:"Total SKU",value:`${po.totalSKU} SKU`,    color:C.cyan},
          {label:"Total Bundle",value:`${po.bundles.length} bundle`,color:C.orange},
        ].map(k=>(
          <div key={k.label} style={{background:C.card,border:`1px solid ${C.border}`,
            borderRadius:10,padding:"12px 14px"}}>
            <div style={{fontSize:9,color:C.textSub,fontFamily:C.sans,textTransform:"uppercase",
              letterSpacing:"0.07em",marginBottom:4}}>{k.label}</div>
            <div style={{fontSize:13,fontWeight:700,color:k.color,fontFamily:C.sans}}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Tabel artikel + bundle */}
      <Panel title="DAFTAR ARTIKEL & BUNDLE" accent={C.cyan}>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",minWidth:700}}>
            <thead>
              <tr style={{background:"#0e204055"}}>
                {["Artikel","SKU Klien","SKU Internal","QTY Order","Isi Bundle","Jml Bundle","Bundle"].map(h=>(
                  <th key={h} style={{...TH,textAlign:h==="Bundle"?"center":TH.textAlign}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {artikelList.map((art,i)=>(
                <tr key={art.skuKlien} style={{borderBottom:`1px solid ${C.border}`}}>
                  <td style={TD(i)}><span style={{fontWeight:600}}>{art.namaArtikel}</span></td>
                  <td style={TD(i)}><span style={{fontFamily:C.mono,fontSize:10,color:C.textSub}}>{art.skuKlien}</span></td>
                  <td style={TD(i)}><span style={{fontFamily:C.mono,fontSize:10,color:C.cyan}}>{art.skuInternal}</span></td>
                  <td style={TD(i)}><span style={{fontFamily:C.mono,fontWeight:700}}>{art.bundles.reduce((s,b)=>s+b.qtyBundle,0)} pcs</span></td>
                  <td style={TD(i)}><span style={{fontFamily:C.mono,color:C.textSub}}>{art.bundles[0]?.qtyBundle||0} pcs</span></td>
                  <td style={TD(i)}><span style={{fontFamily:C.mono,fontWeight:700,color:C.orange}}>{art.bundles.length}</span></td>
                  <td style={{...TD(i),textAlign:"center"}}>
                    <div style={{display:"flex",gap:4,flexWrap:"wrap",justifyContent:"center"}}>
                      {art.bundles.map(b=>(
                        <span key={b.kodeBarcode} onClick={()=>toggleBundle(b.kodeBarcode)}
                          title={b.kodeBarcode}
                          style={{fontSize:8,padding:"2px 6px",borderRadius:4,cursor:"pointer",
                            fontFamily:C.mono,fontWeight:700,
                            background:selected.has(b.kodeBarcode)?`${C.cyan}22`:"#050e1f",
                            color:selected.has(b.kodeBarcode)?C.cyan:C.textMid,
                            border:`1px solid ${selected.has(b.kodeBarcode)?C.cyan:C.border2}`}}>
                          BDL{String(b.noUrut).padStart(2,"0")}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* Panel barcode */}
      <Panel title="BARCODE BUNDLE — PILIH UNTUK CETAK" accent={C.yellow}>
        {/* Toolbar pilih + print */}
        <div style={{padding:"12px 18px",borderBottom:`1px solid ${C.border}`,
          display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
          <BtnPO2 small onClick={toggleAll} outline>
            {selected.size===po.bundles.length?"BATAL SEMUA":"PILIH SEMUA"}
          </BtnPO2>
          {artikelList.map(art=>{
            const allSel=art.bundles.every(b=>selected.has(b.kodeBarcode));
            return (
              <BtnPO2 key={art.skuKlien} small onClick={()=>toggleArtikel(art.skuKlien)}
                outline color={allSel?"cyan":"cyan"}>
                {allSel?"✓ ":""}{art.model} {art.size}
              </BtnPO2>
            );
          })}
          <div style={{marginLeft:"auto",display:"flex",gap:8,alignItems:"center"}}>
            <span style={{fontSize:9,color:C.textSub,fontFamily:C.mono}}>
              {selected.size} dipilih
            </span>
            <BtnPO2 onClick={handlePrint} disabled={selected.size===0} color="yellow">
              🖨 CETAK {selected.size>0?`(${selected.size})`:""}
            </BtnPO2>
          </div>
        </div>

        {/* Grid tiket */}
        <div style={{padding:"16px",display:"grid",
          gridTemplateColumns:"repeat(auto-fill,minmax(168px,1fr))",gap:10}}>
          {po.bundles.map(b=>(
            <TiketBarcode key={b.kodeBarcode} bundle={b}
              selected={selected.has(b.kodeBarcode)}
              onToggle={()=>toggleBundle(b.kodeBarcode)}/>
          ))}
        </div>

        <div style={{padding:"10px 18px",borderTop:`1px solid ${C.border}`,
          display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontSize:9,color:C.textMid,fontFamily:C.mono}}>
            {po.bundles.length} total bundle · barcode di-generate sekali saat PO disimpan
          </span>
          <span style={{fontSize:9,color:selected.size>0?C.cyan:C.textMid,fontFamily:C.mono}}>
            {selected.size} dipilih untuk cetak
          </span>
        </div>
      </Panel>
    </div>
  );
}

// ── BARIS ARTIKEL (form input) ────────────────────────────────────────────────
function BarisSKU({row,idx,onChange,onRemove}) {
  const produk = MASTER_PRODUK.find(p=>p.skuKlien===row.skuKlien);
  const jumlahBundle = row.qtyOrder>0&&row.isiBundle>0 ? Math.ceil(row.qtyOrder/row.isiBundle) : 0;

  const inputStyle={background:"#050e1f",border:`1px solid ${C.border2}`,borderRadius:6,
    padding:"6px 9px",fontSize:11,color:C.text,fontFamily:C.mono,outline:"none",width:"100%",textAlign:"right"};
  const skuStyle={background:"#050e1f",
    border:`1px solid ${produk?C.green+"66":row.skuKlien?C.red+"66":C.border2}`,
    borderRadius:6,padding:"6px 9px",fontSize:11,
    color:produk?C.text:row.skuKlien?C.red:C.textMid,fontFamily:C.mono,outline:"none",width:"100%"};

  return (
    <tr style={{borderBottom:`1px solid ${C.border}`}}>
      <td style={{padding:"10px 12px",background:idx%2===0?C.card:C.card2,textAlign:"center"}}>
        <span style={{fontSize:10,color:C.textMid,fontFamily:C.mono}}>{idx+1}</span>
      </td>
      <td style={{padding:"8px 10px",background:idx%2===0?C.card:C.card2}}>
        <input value={row.skuKlien} onChange={e=>onChange("skuKlien",e.target.value)}
          placeholder="Ketik SKU klien..." style={skuStyle}/>
      </td>
      <td style={{padding:"8px 10px",background:idx%2===0?C.card:C.card2,minWidth:160}}>
        {produk?(
          <div>
            <div style={{fontSize:11,fontWeight:600,color:C.text,fontFamily:C.sans}}>{produk.model} — {produk.warna}</div>
            <div style={{display:"flex",gap:6,marginTop:3,alignItems:"center"}}>
              <span style={{fontSize:9,padding:"1px 7px",borderRadius:4,background:`${C.cyan}12`,
                color:C.cyan,fontFamily:C.mono,border:`1px solid ${C.cyanDim}`,fontWeight:700}}>{produk.size}</span>
              <span style={{fontSize:9,color:C.textSub,fontFamily:C.mono}}>{produk.skuInternal}</span>
            </div>
          </div>
        ):row.skuKlien?(
          <span style={{fontSize:10,color:C.red,fontFamily:C.sans}}>⚠ SKU tidak ditemukan</span>
        ):(
          <span style={{fontSize:10,color:C.textMid,fontFamily:C.sans}}>— otomatis —</span>
        )}
      </td>
      <td style={{padding:"8px 10px",background:idx%2===0?C.card:C.card2,textAlign:"right"}}>
        {produk?<span style={{fontSize:11,fontWeight:700,color:C.yellow,fontFamily:C.mono}}>{rp(produk.hargaJual)}</span>
          :<span style={{fontSize:10,color:C.textMid}}>—</span>}
      </td>
      <td style={{padding:"8px 10px",background:idx%2===0?C.card:C.card2,width:90}}>
        <input type="number" min="1" value={row.qtyOrder||""} onChange={e=>onChange("qtyOrder",Number(e.target.value)||0)}
          placeholder="0" style={inputStyle}/>
      </td>
      <td style={{padding:"8px 10px",background:idx%2===0?C.card:C.card2,width:90}}>
        <input type="number" min="1" value={row.isiBundle||""} onChange={e=>onChange("isiBundle",Number(e.target.value)||0)}
          placeholder="0" style={inputStyle}/>
      </td>
      <td style={{padding:"8px 12px",background:idx%2===0?C.card:C.card2,textAlign:"center"}}>
        {jumlahBundle>0
          ?<span style={{fontSize:13,fontWeight:800,color:C.orange,fontFamily:C.syne}}>{jumlahBundle}</span>
          :<span style={{fontSize:10,color:C.textMid,fontFamily:C.mono}}>—</span>}
      </td>
      <td style={{padding:"8px 10px",background:idx%2===0?C.card:C.card2,textAlign:"right"}}>
        {produk&&row.qtyOrder>0
          ?<span style={{fontSize:11,fontWeight:700,color:C.green,fontFamily:C.mono}}>{rp(produk.hargaJual*row.qtyOrder)}</span>
          :<span style={{fontSize:10,color:C.textMid}}>—</span>}
      </td>
      <td style={{padding:"8px 10px",background:idx%2===0?C.card:C.card2,textAlign:"center"}}>
        <button onClick={onRemove} style={{background:"transparent",border:`1px solid ${C.red}44`,
          borderRadius:5,color:C.red,cursor:"pointer",fontSize:13,width:26,height:26,
          display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
      </td>
    </tr>
  );
}

// ── FORM INPUT PO ─────────────────────────────────────────────────────────────
function FormInputPO({daftarPO,onSave,onCancel}) {
  const kodePO = genKodePO2(daftarPO);
  const [idKlien,setIdKlien] = useState("");
  const [tanggal,setTanggal] = useState(new Date().toISOString().split("T")[0]);
  const [baris,setBaris]     = useState([{id:1,skuKlien:"",qtyOrder:0,isiBundle:0}]);

  function tambahBaris(){setBaris(b=>[...b,{id:Date.now(),skuKlien:"",qtyOrder:0,isiBundle:0}]);}
  function hapusBaris(id){if(baris.length===1)return; setBaris(b=>b.filter(x=>x.id!==id));}
  function ubahBaris(id,field,val){setBaris(b=>b.map(x=>x.id===id?{...x,[field]:val}:x));}

  const totalQty    = baris.reduce((s,b)=>s+(b.qtyOrder||0),0);
  const totalNilai  = baris.reduce((s,b)=>{const p=MASTER_PRODUK.find(x=>x.skuKlien===b.skuKlien); return s+(p?p.hargaJual*(b.qtyOrder||0):0);},0);
  const totalBundle = baris.reduce((s,b)=>s+(b.qtyOrder>0&&b.isiBundle>0?Math.ceil(b.qtyOrder/b.isiBundle):0),0);
  const skuValid    = baris.filter(b=>b.skuKlien&&MASTER_PRODUK.find(p=>p.skuKlien===b.skuKlien)).length;
  const canSave     = idKlien && baris.some(b=>b.skuKlien&&b.qtyOrder>0&&b.isiBundle>0);

  function handleSave() {
    if(!canSave) return;
    const barisBersih = baris.filter(b=>b.skuKlien&&b.qtyOrder>0&&b.isiBundle>0);
    const {bundles, nextUrut} = generateBundlesPO(kodePO, barisBersih, tanggal, globalUrutCounter);
    globalUrutCounter = nextUrut;
    onSave({
      kode:kodePO, idKlien, tanggal, baris:barisBersih,
      bundles, status:"Aktif",
      totalSKU:skuValid, totalQty, totalBundle:bundles.length,
    });
  }

  const selStyle={width:"100%",background:"#050e1f",border:`1px solid ${C.border2}`,borderRadius:8,
    padding:"9px 12px",fontSize:12,color:idKlien?C.text:C.textMid,fontFamily:C.sans,outline:"none"};

  return (
    <div style={{padding:"24px"}}>
      {/* Header info */}
      <div style={{display:"grid",gridTemplateColumns:"auto 1fr 1fr",gap:24,marginBottom:24,
        padding:"16px 20px",background:"#050e1f",borderRadius:10,border:`1px solid ${C.border}`}}>
        <div>
          <div style={{fontSize:9,color:C.textSub,fontFamily:C.sans,letterSpacing:"0.07em",marginBottom:6}}>KODE PO (AUTO)</div>
          <div style={{fontSize:22,fontWeight:800,color:C.cyan,fontFamily:C.syne}}>{kodePO}</div>
        </div>
        <div>
          <div style={{fontSize:9,color:C.textSub,fontFamily:C.sans,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:6}}>
            Klien <span style={{color:C.red}}>*</span>
          </div>
          <select value={idKlien} onChange={e=>setIdKlien(e.target.value)} style={selStyle}>
            <option value="">-- Pilih Klien --</option>
            {MASTER_KLIEN.map(k=><option key={k.id} value={k.id}>{k.nama}</option>)}
          </select>
        </div>
        <div>
          <div style={{fontSize:9,color:C.textSub,fontFamily:C.sans,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:6}}>Tanggal PO</div>
          <input type="date" value={tanggal} onChange={e=>setTanggal(e.target.value)}
            style={{...selStyle,fontFamily:C.mono,fontSize:11}}/>
        </div>
      </div>

      {/* Tabel artikel */}
      <div style={{marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{fontSize:9,fontWeight:700,color:C.textSub,fontFamily:C.mono,letterSpacing:"0.1em",textTransform:"uppercase"}}>DAFTAR ARTIKEL</div>
        <BtnPO2 small onClick={tambahBaris} outline>+ TAMBAH BARIS</BtnPO2>
      </div>

      <div style={{overflowX:"auto",marginBottom:16}}>
        <table style={{width:"100%",borderCollapse:"collapse",minWidth:800}}>
          <thead>
            <tr style={{background:"#0e204055"}}>
              {[{label:"No",w:40},{label:"SKU Klien",w:120},{label:"Detail",w:180},{label:"Harga Jual",w:110},
                {label:"QTY Order",w:90},{label:"Isi/Bundle",w:90},{label:"Jml Bundle",w:80},{label:"Total",w:120},{label:"",w:36}].map(h=>(
                <th key={h.label} style={{padding:"9px 10px",textAlign:["No","Jml Bundle",""].includes(h.label)?"center":"left",
                  fontSize:9,fontWeight:700,color:C.textSub,textTransform:"uppercase",
                  letterSpacing:"0.07em",fontFamily:C.sans,whiteSpace:"nowrap",minWidth:h.w}}>{h.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {baris.map((row,idx)=>(
              <BarisSKU key={row.id} row={row} idx={idx}
                onChange={(field,val)=>ubahBaris(row.id,field,val)}
                onRemove={()=>hapusBaris(row.id)}/>
            ))}
          </tbody>
        </table>
      </div>

      {/* Ringkasan */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:12,marginBottom:20,
        padding:"14px 18px",background:"#050e1f",borderRadius:10,border:`1px solid ${C.border}`}}>
        {[
          {label:"SKU Valid",  value:skuValid,       color:C.cyan},
          {label:"Total QTY",  value:`${totalQty} pcs`, color:C.blue},
          {label:"Total Bundle",value:`${totalBundle} bundle`,color:C.orange},
          {label:"Est. Nilai", value:rp(totalNilai), color:C.green},
        ].map(k=>(
          <div key={k.label}>
            <div style={{fontSize:9,color:C.textMid,fontFamily:C.sans}}>{k.label}</div>
            <div style={{fontSize:16,fontWeight:800,color:k.color,fontFamily:C.syne,marginTop:2}}>{k.value}</div>
          </div>
        ))}
      </div>

      <div style={{marginBottom:20,padding:"10px 14px",background:C.cyanBg,borderRadius:8,
        border:`1px solid ${C.cyanDim}`,fontSize:10,color:C.cyan,fontFamily:C.sans,lineHeight:1.6}}>
        ℹ Kode barcode di-generate <strong>sekali</strong> saat tombol Simpan ditekan. Format: PO[kode]-[artikel]-[urut global]-BDL[urut bundle]-[DD-MM-YY]
      </div>

      <div style={{display:"flex",gap:10,justifyContent:"flex-end",paddingTop:16,borderTop:`1px solid ${C.border}`}}>
        <BtnPO2 onClick={onCancel} outline>BATAL</BtnPO2>
        <BtnPO2 onClick={handleSave} disabled={!canSave} color="green">SIMPAN & GENERATE BARCODE — {kodePO}</BtnPO2>
      </div>
    </div>
  );
}

// ── HALAMAN SUKSES ────────────────────────────────────────────────────────────
function HalamanSukses({po,onLihatDetail,onBuatLagi,onKembali}) {
  const klien=MASTER_KLIEN.find(k=>k.id===po.idKlien);
  // Preview 6 barcode pertama
  const preview=po.bundles.slice(0,6);
  return (
    <div>
      <div style={{background:C.card,border:`1px solid ${C.green}44`,borderRadius:14,
        padding:"24px",marginBottom:16}}>
        <div style={{textAlign:"center",marginBottom:20}}>
          <div style={{fontSize:36,marginBottom:8}}>✓</div>
          <div style={{fontSize:20,fontWeight:800,color:C.green,fontFamily:C.syne,marginBottom:4}}>PO Berhasil Disimpan</div>
          <div style={{fontSize:15,fontWeight:700,color:C.cyan,fontFamily:C.mono,marginBottom:4}}>{po.kode}</div>
          <div style={{fontSize:11,color:C.textSub,fontFamily:C.sans}}>
            {klien?.nama} · {po.totalSKU} SKU · {po.totalQty} pcs · <span style={{color:C.orange,fontWeight:700}}>{po.bundles.length} bundle</span>
          </div>
        </div>

        {/* Preview barcode */}
        <div style={{marginBottom:16}}>
          <div style={{fontSize:9,color:C.textSub,fontFamily:C.mono,letterSpacing:"0.1em",
            textTransform:"uppercase",marginBottom:10}}>
            BARCODE YANG BARU DI-GENERATE ({po.bundles.length} total):
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:8}}>
            {preview.map(b=>(
              <div key={b.kodeBarcode} style={{background:"#050e1f",border:`1px solid ${C.border}`,
                borderRadius:7,padding:"8px 10px"}}>
                <div style={{display:"flex",justifyContent:"center",marginBottom:4}}>
                  <BarcodeVisual value={b.kodeBarcode} width={130} height={28}/>
                </div>
                <div style={{fontSize:7,fontFamily:C.mono,color:C.cyan,textAlign:"center",
                  wordBreak:"break-all",lineHeight:1.3,marginBottom:4}}>{b.kodeBarcode}</div>
                <div style={{fontSize:9,color:C.textSub,fontFamily:C.sans,textAlign:"center"}}>{b.namaArtikel}</div>
                <div style={{fontSize:8,color:C.textMid,fontFamily:C.mono,textAlign:"center",marginTop:2}}>
                  BDL{String(b.noUrut).padStart(2,"0")}/{b.totalBundle} · {b.qtyBundle} pcs
                </div>
              </div>
            ))}
            {po.bundles.length>6&&(
              <div style={{background:"#050e1f",border:`1px solid ${C.border}`,borderRadius:7,
                display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:13,fontWeight:800,color:C.textMid,fontFamily:C.syne}}>
                +{po.bundles.length-6} lagi
              </div>
            )}
          </div>
        </div>

        <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
          <BtnPO2 onClick={onKembali} outline>LIHAT DAFTAR PO</BtnPO2>
          <BtnPO2 onClick={onLihatDetail} color="cyan">BUKA DETAIL & CETAK BARCODE</BtnPO2>
          <BtnPO2 onClick={onBuatLagi} color="green">+ BUAT PO LAGI</BtnPO2>
        </div>
      </div>
    </div>
  );
}

// ── TABEL DAFTAR PO ───────────────────────────────────────────────────────────
function TabelDaftarPO({data,onBuat,onBuka}) {
  const TH2={padding:"9px 14px",textAlign:"left",fontSize:9,fontWeight:700,
    color:C.textSub,textTransform:"uppercase",letterSpacing:"0.07em",fontFamily:C.sans,whiteSpace:"nowrap"};
  const TD2=(i)=>({padding:"12px 14px",fontSize:11,color:C.text,fontFamily:C.sans,
    background:i%2===0?C.card:C.card2});
  return (
    <Panel title="DAFTAR PO MASUK" action="+ BUAT PO BARU" onAction={onBuat}>
      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",minWidth:600}}>
          <thead>
            <tr style={{background:"#0e204055"}}>
              {["Kode PO","Klien","Tanggal","Total SKU","Total Bundle","Status","Aksi"].map(h=>(
                <th key={h} style={{...TH2,textAlign:h==="Aksi"?"center":TH2.textAlign}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row,i)=>{
              const klien=MASTER_KLIEN.find(k=>k.id===row.idKlien);
              return (
                <tr key={row.kode} style={{borderBottom:`1px solid ${C.border}`}}>
                  <td style={TD2(i)}><span style={{fontFamily:C.mono,fontWeight:700,color:C.cyan}}>{row.kode}</span></td>
                  <td style={TD2(i)}><span style={{fontWeight:600}}>{klien?.nama||row.idKlien}</span></td>
                  <td style={TD2(i)}><span style={{fontFamily:C.mono,fontSize:10,color:C.textSub}}>{row.tanggal}</span></td>
                  <td style={TD2(i)}><span style={{fontFamily:C.mono}}>{row.totalSKU} SKU</span></td>
                  <td style={TD2(i)}>
                    <span style={{fontFamily:C.mono,fontWeight:700,color:C.orange}}>
                      {row.bundles?.length||0} bundle
                    </span>
                  </td>
                  <td style={TD2(i)}>
                    <span style={{display:"inline-flex",alignItems:"center",gap:5,padding:"2px 8px",
                      borderRadius:99,fontSize:9,fontWeight:700,fontFamily:C.mono,
                      background:"#001a20",color:C.cyan,border:`1px solid ${C.cyan}30`}}>
                      <span style={{width:5,height:5,borderRadius:"50%",background:C.cyan,display:"inline-block"}}/>
                      {row.status}
                    </span>
                  </td>
                  <td style={{...TD2(i),textAlign:"center"}}>
                    <BtnPO2 small onClick={()=>onBuka(row)} color="cyan" outline>BUKA →</BtnPO2>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div style={{padding:"10px 18px",borderTop:`1px solid ${C.border}`,display:"flex",justifyContent:"flex-end"}}>
        <span style={{fontSize:9,color:C.textMid,fontFamily:C.mono}}>{data.length} PO TERDAFTAR</span>
      </div>
    </Panel>
  );
}

// ── MAIN EXPORT ───────────────────────────────────────────────────────────────
function InputPO() {
  const [daftarPO,setDaftarPO] = useState(initDaftarPO);
  const [mode,setMode]         = useState("list"); // list | buat | sukses | detail
  const [savedPO,setSavedPO]   = useState(null);
  const [detailPO,setDetailPO] = useState(null);

  function handleSave(po) {
    setDaftarPO(d=>[...d,po]);
    setSavedPO(po);
    setMode("sukses");
  }

  function handleBuka(po) { setDetailPO(po); setMode("detail"); }

  if(mode==="buat") return (
    <div>
      <div style={{marginBottom:20,paddingBottom:16,borderBottom:`1px solid ${C.border}`,
        display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <div style={{fontSize:10,color:C.textSub,fontFamily:C.mono,letterSpacing:"0.07em",marginBottom:4}}>INPUT PO / BUAT BARU</div>
          <div style={{fontSize:18,fontWeight:800,color:C.text,fontFamily:C.syne}}>Buat Purchase Order Baru</div>
        </div>
        <BtnPO2 onClick={()=>setMode("list")} outline>← KEMBALI</BtnPO2>
      </div>
      <Panel title="FORM INPUT PO">
        <FormInputPO daftarPO={daftarPO} onSave={handleSave} onCancel={()=>setMode("list")}/>
      </Panel>
    </div>
  );

  if(mode==="sukses"&&savedPO) return (
    <div>
      <div style={{marginBottom:20,paddingBottom:16,borderBottom:`1px solid ${C.border}`}}>
        <div style={{fontSize:10,color:C.textSub,fontFamily:C.mono,letterSpacing:"0.07em"}}>INPUT PO / SELESAI</div>
      </div>
      <HalamanSukses po={savedPO}
        onLihatDetail={()=>{setDetailPO(savedPO);setMode("detail");}}
        onBuatLagi={()=>setMode("buat")}
        onKembali={()=>setMode("list")}/>
    </div>
  );

  if(mode==="detail"&&detailPO) return (
    <DetailPO po={detailPO} onBack={()=>setMode("list")}/>
  );

  return (
    <div>
      <div style={{marginBottom:20,paddingBottom:16,borderBottom:`1px solid ${C.border}`}}>
        <div style={{fontSize:10,color:C.textSub,fontFamily:C.mono,letterSpacing:"0.07em",marginBottom:4}}>INPUT PO</div>
        <div style={{fontSize:13,color:C.textMid,fontFamily:C.sans}}>Kelola Purchase Order masuk. Kode PO & barcode bundle di-generate otomatis.</div>
      </div>
      <TabelDaftarPO data={daftarPO} onBuat={()=>setMode("buat")} onBuka={handleBuka}/>
    </div>
  );
}









// --- TAB PRODUKSI (v6 — Monitoring Double Box & Detail Modal) ---




function BtnProd6({children,onClick,color="cyan",small=false,outline=false,disabled=false,full=false}) {
  const colMap={cyan:C.cyan,green:C.green,red:C.red,yellow:C.yellow,purple:C.purple,orange:C.orange,blue:C.blue};
  const col=colMap[color]||C.cyan;
  return (
    <button onClick={onClick} disabled={disabled}
      style={{padding:small?"5px 12px":"9px 20px",fontSize:small?9:11,fontWeight:700,fontFamily:C.mono,
        background:disabled?"#1a2030":outline?"transparent":col,
        color:disabled?C.textMid:outline?col:"#000",
        border:`1px solid ${disabled?"#1a2030":col}`,
        borderRadius:7,cursor:disabled?"not-allowed":"pointer",
        letterSpacing:"0.05em",whiteSpace:"nowrap",opacity:disabled?0.5:1,
        width:full?"100%":"auto"}}>
      {children}
    </button>
  );
}

const OWNER_CODE = "030503";
const URUTAN_TAHAP = ["cutting","jahit","lkancing","bbenang","qc","steam","packing"];
const TAHAP_KEY = {"Cutting":"cutting","Jahit":"jahit","Lubang Kancing":"lkancing","Buang Benang":"bbenang","QC":"qc","Steam":"steam","Packing":"packing"};
const TAHAP_COLOR = {"Cutting":C.yellow,"Jahit":C.blue,"Lubang Kancing":C.purple,"Buang Benang":C.cyan,"QC":C.orange,"Steam":C.green,"Packing":C.green};
const TAHAP_LABEL = {cutting:"CUTTING",jahit:"JAHIT",lkancing:"L.KANCING",bbenang:"BUANG BB",qc:"QC",steam:"STEAM",packing:"PACKING"};
const TAHAP_COL = {cutting:C.yellow,jahit:C.blue,lkancing:C.purple,bbenang:C.cyan,qc:C.orange,steam:C.green,packing:C.green};

const KARYAWAN_AKTIF = [
  {id:"KRY-001",nama:"Budi Santoso",tahap:["Cutting","Jahit"]},
  {id:"KRY-002",nama:"Siti Rahayu",tahap:["Jahit","Lubang Kancing","Buang Benang"]},
  {id:"KRY-003",nama:"Ahmad Fauzi",tahap:["Cutting"]},
  {id:"KRY-004",nama:"Dewi Lestari",tahap:["QC","Steam","Packing"]},
  {id:"KRY-005",nama:"Rudi Hartono",tahap:["Jahit"]},
];

const JENIS_REJECT = [
  {id:"RJT-001",nama:"Jahitan Loncat",potongUpah:true,bisaRework:true},
  {id:"RJT-002",nama:"Kancing Lepas",potongUpah:true,bisaRework:true},
  {id:"RJT-003",nama:"Noda / Kotor",potongUpah:false,bisaRework:true},
  {id:"RJT-004",nama:"Cacat Bahan",potongUpah:false,bisaRework:false},
  {id:"RJT-005",nama:"Ukuran Tidak Sesuai",potongUpah:true,bisaRework:true},
  {id:"RJT-006",nama:"Benang Sisa",potongUpah:true,bisaRework:false},
];

function emptyTahapStatus() {
  return {status:null,qtyTerima:null,qtySelesai:null,waktuTerima:null,waktuSelesai:null,karyawan:null};
}

const initBundleDB = {
  "PO0001-Air-blck-s-0001-BDL01-01-03-25":{kodeBarcode:"PO0001-Air-blck-s-0001-BDL01-01-03-25",po:"PO-0001",model:"Airflow",size:"S",warna:"Black",skuKlien:"ely289",qtyBundle:6,noUrut:1,totalBundle:2,statusTahap:{cutting:{status:"selesai",qtyTerima:6,qtySelesai:6,waktuTerima:"08:00",waktuSelesai:"09:30",karyawan:"Ahmad Fauzi"},jahit:{status:"terima",qtyTerima:6,qtySelesai:null,waktuTerima:"10:00",waktuSelesai:null,karyawan:"Budi Santoso"},lkancing:emptyTahapStatus(),bbenang:emptyTahapStatus(),qc:emptyTahapStatus(),steam:emptyTahapStatus(),packing:emptyTahapStatus()}},
  "PO0001-Air-blck-s-0001-BDL02-01-03-25":{kodeBarcode:"PO0001-Air-blck-s-0001-BDL02-01-03-25",po:"PO-0001",model:"Airflow",size:"S",warna:"Black",skuKlien:"ely289",qtyBundle:6,noUrut:2,totalBundle:2,statusTahap:{cutting:{status:"selesai",qtyTerima:6,qtySelesai:5,waktuTerima:"08:05",waktuSelesai:"09:35",karyawan:"Ahmad Fauzi"},jahit:emptyTahapStatus(),lkancing:emptyTahapStatus(),bbenang:emptyTahapStatus(),qc:emptyTahapStatus(),steam:emptyTahapStatus(),packing:emptyTahapStatus()}},
  "PO0001-Air-blck-m-0002-BDL01-01-03-25":{kodeBarcode:"PO0001-Air-blck-m-0002-BDL01-01-03-25",po:"PO-0001",model:"Airflow",size:"M",warna:"Black",skuKlien:"ely290",qtyBundle:6,noUrut:1,totalBundle:2,statusTahap:{cutting:{status:"selesai",qtyTerima:6,qtySelesai:6,waktuTerima:"08:10",waktuSelesai:"09:40",karyawan:"Budi Santoso"},jahit:{status:"selesai",qtyTerima:6,qtySelesai:6,waktuTerima:"10:00",waktuSelesai:"14:00",karyawan:"Budi Santoso"},lkancing:{status:"terima",qtyTerima:6,qtySelesai:null,waktuTerima:"14:30",waktuSelesai:null,karyawan:null},bbenang:emptyTahapStatus(),qc:emptyTahapStatus(),steam:emptyTahapStatus(),packing:emptyTahapStatus()}},
  "PO0002-Nec-blck-s-0004-BDL01-10-03-25":{kodeBarcode:"PO0002-Nec-blck-s-0004-BDL01-10-03-25",po:"PO-0002",model:"Neck",size:"S",warna:"Black",skuKlien:"ely330",qtyBundle:9,noUrut:1,totalBundle:2,statusTahap:{cutting:{status:"selesai",qtyTerima:9,qtySelesai:9,waktuTerima:"08:00",waktuSelesai:"10:00",karyawan:"Ahmad Fauzi"},jahit:emptyTahapStatus(),lkancing:emptyTahapStatus(),bbenang:emptyTahapStatus(),qc:emptyTahapStatus(),steam:emptyTahapStatus(),packing:emptyTahapStatus()}},
  "PO0002-Nec-blck-s-0004-BDL02-10-03-25":{kodeBarcode:"PO0002-Nec-blck-s-0004-BDL02-10-03-25",po:"PO-0002",model:"Neck",size:"S",warna:"Black",skuKlien:"ely330",qtyBundle:9,noUrut:2,totalBundle:2,statusTahap:{cutting:{status:"selesai",qtyTerima:9,qtySelesai:8,waktuTerima:"08:05",waktuSelesai:"10:05",karyawan:"Ahmad Fauzi"},jahit:emptyTahapStatus(),lkancing:emptyTahapStatus(),bbenang:emptyTahapStatus(),qc:emptyTahapStatus(),steam:emptyTahapStatus(),packing:emptyTahapStatus()}},
  "PO0001-Air-blck-xl-0005-BDL01-01-03-25":{kodeBarcode:"PO0001-Air-blck-xl-0005-BDL01-01-03-25",po:"PO-0001",model:"Airflow",size:"XL",warna:"Black",skuKlien:"ely292",qtyBundle:5,noUrut:1,totalBundle:2,statusTahap:{cutting:{status:"selesai",qtyTerima:5,qtySelesai:7,waktuTerima:"08:00",waktuSelesai:"09:15",karyawan:"Ahmad Fauzi",koreksiStatus:"pending"},jahit:emptyTahapStatus(),lkancing:emptyTahapStatus(),bbenang:emptyTahapStatus(),qc:emptyTahapStatus(),steam:emptyTahapStatus(),packing:emptyTahapStatus()}},
  "PO0002-Nec-blck-m-0006-BDL01-10-03-25":{kodeBarcode:"PO0002-Nec-blck-m-0006-BDL01-10-03-25",po:"PO-0002",model:"Neck",size:"M",warna:"Black",skuKlien:"ely331",qtyBundle:9,noUrut:1,totalBundle:2,statusTahap:{cutting:{status:"selesai",qtyTerima:9,qtySelesai:11,waktuTerima:"08:30",waktuSelesai:"10:00",karyawan:"Budi Santoso",koreksiStatus:"pending"},jahit:emptyTahapStatus(),lkancing:emptyTahapStatus(),bbenang:emptyTahapStatus(),qc:emptyTahapStatus(),steam:emptyTahapStatus(),packing:emptyTahapStatus()}},
  "PO0001-Air-blck-m-0002-BDL02-01-03-25":{kodeBarcode:"PO0001-Air-blck-m-0002-BDL02-01-03-25",po:"PO-0001",model:"Airflow",size:"M",warna:"Black",skuKlien:"ely290",qtyBundle:6,noUrut:2,totalBundle:2,statusTahap:{cutting:{status:"selesai",qtyTerima:6,qtySelesai:6,waktuTerima:"08:15",waktuSelesai:"09:45",karyawan:"Ahmad Fauzi"},jahit:{status:"selesai",qtyTerima:6,qtySelesai:4,waktuTerima:"10:30",waktuSelesai:"14:20",karyawan:"Siti Rahayu",koreksiStatus:"approved",koreksiAlasan:"2 pcs rusak mesin"},lkancing:emptyTahapStatus(),bbenang:emptyTahapStatus(),qc:emptyTahapStatus(),steam:emptyTahapStatus(),packing:emptyTahapStatus()}}
};

const PO_CUTTING = [
  {kode:"PO-0001",klien:"PT. Elysian Garment",tanggal:"2025-03-01",artikel:[
    {skuKlien:"ely289",nama:"Airflow Black S",qtyOrder:12,totalBundle:2,woPrinted:false,barcodePrinted:false},
    {skuKlien:"ely290",nama:"Airflow Black M",qtyOrder:12,totalBundle:2,woPrinted:true,barcodePrinted:false},
    {skuKlien:"ely291",nama:"Airflow Black L",qtyOrder:15,totalBundle:2,woPrinted:true,barcodePrinted:true},
    {skuKlien:"ely292",nama:"Airflow Black XL",qtyOrder:15,totalBundle:2,woPrinted:false,barcodePrinted:false},
  ]},
  {kode:"PO-0002",klien:"PT. Elysian Garment",tanggal:"2025-03-10",artikel:[
    {skuKlien:"ely330",nama:"Neck Black S",qtyOrder:18,totalBundle:2,woPrinted:false,barcodePrinted:false},
    {skuKlien:"ely331",nama:"Neck Black M",qtyOrder:18,totalBundle:2,woPrinted:false,barcodePrinted:false},
  ]},
];

const initArtikelDB = {
  "PO-0001":[
    {skuKlien:"ely289",nama:"Airflow Black S",qtyOrder:12,cutting:11,jahit:6,lkancing:0,bbenang:0,qc:0,steam:0,packing:0,kirim:0,reject:1},
    {skuKlien:"ely290",nama:"Airflow Black M",qtyOrder:12,cutting:12,jahit:12,lkancing:6,bbenang:0,qc:0,steam:0,packing:0,kirim:0,reject:0},
    {skuKlien:"ely291",nama:"Airflow Black L",qtyOrder:15,cutting:15,jahit:15,lkancing:15,bbenang:13,qc:0,steam:0,packing:0,kirim:0,reject:2},
  ],
  "PO-0002":[{skuKlien:"ely330",nama:"Neck Black S",qtyOrder:18,cutting:17,jahit:0,lkancing:0,bbenang:0,qc:0,steam:0,packing:0,kirim:0,reject:0}],
  "PO-0003":[{skuKlien:"ely400",nama:"Storma Black M",qtyOrder:24,cutting:0,jahit:0,lkancing:0,bbenang:0,qc:0,steam:0,packing:0,kirim:0,reject:0}],
};

const PO_META = {
  "PO-0001":{klien:"PT. Elysian Garment",model:"Airflow",deadline:"2025-04-15",urgent:false},
  "PO-0002":{klien:"PT. Elysian Garment",model:"Neck",deadline:"2025-04-10",urgent:true},
  "PO-0003":{klien:"CV. Maju Bersama",model:"Storma",deadline:"2025-04-25",urgent:false},
};

const initWarningSettings = {cutting:2,jahit:5,lkancing:2,bbenang:1,qc:2,steam:1,packing:1};


const initKoreksiQueue = [
  {id:"KOR-001",barcode:"PO0001-Air-blck-xl-0005-BDL01-01-03-25",po:"PO-0001",model:"Airflow",size:"XL",warna:"Black",tahap:"cutting",tahapLabel:"Cutting",karyawan:"Ahmad Fauzi",qtyTarget:5,qtyAktual:7,selisih:+2,alasan:"Sisa potong dari roll sebelumnya",tipe:"lebih",status:"pending",waktu:"2026-04-10 09:15"},
  {id:"KOR-002",barcode:"PO0002-Nec-blck-m-0006-BDL01-10-03-25",po:"PO-0002",model:"Neck",size:"M",warna:"Black",tahap:"cutting",tahapLabel:"Cutting",karyawan:"Budi Santoso",qtyTarget:9,qtyAktual:11,selisih:+2,alasan:"Kompensasi gagal potong sebelumnya",tipe:"lebih",status:"pending",waktu:"2026-04-10 10:00"},
  {id:"KOR-003",barcode:"PO0001-Air-blck-m-0002-BDL02-01-03-25",po:"PO-0001",model:"Airflow",size:"M",warna:"Black",tahap:"jahit",tahapLabel:"Jahit",karyawan:"Siti Rahayu",qtyTarget:6,qtyAktual:4,selisih:-2,alasan:"2 pcs rusak mesin",tipe:"kurang",status:"approved",waktu:"2026-04-09 14:20",reviewWaktu:"2026-04-09 15:00",reviewBy:"Owner"},
  {id:"KOR-004",barcode:"PO0001-Air-blck-s-0001-BDL02-01-03-25",po:"PO-0001",model:"Airflow",size:"S",warna:"Black",tahap:"cutting",tahapLabel:"Cutting",karyawan:"Ahmad Fauzi",qtyTarget:6,qtyAktual:5,selisih:-1,alasan:"Bahan sobek 1 pcs",tipe:"kurang",status:"approved",waktu:"2026-04-08 09:35",reviewWaktu:"2026-04-08 10:00",reviewBy:"Owner"},
];


function waktuSekarang(){return new Date().toLocaleTimeString("id-ID",{hour:"2-digit",minute:"2-digit"});}
function tanggalSekarang(){return new Date().toLocaleDateString("id-ID",{day:"2-digit",month:"short",year:"numeric"});}

function ModalQtySelesai({bundle,tahapKey,onConfirm,onCancel,ownerAuthDone,onOwnerAuth}) {
  const qtyTarget=bundle.statusTahap[tahapKey]?.qtyTerima||bundle.qtyBundle;
  const [qty,setQty]=useState(qtyTarget);
  const [alasan,setAlasan]=useState("");
  const [authCode,setAuthCode]=useState("");
  const [authError,setAuthError]=useState(false);
  const [showAuth,setShowAuth]=useState(false);
  const qtyKurang=qty<qtyTarget;
  const qtyLebih=qty>qtyTarget;
  const alasanWajib=(qtyKurang||qtyLebih)&&!alasan.trim();
  const canSave=qty>0&&!alasanWajib&&(!qtyLebih||ownerAuthDone);
  const accent=TAHAP_COL[tahapKey]||C.cyan;
  function handleAuth(){if(authCode===OWNER_CODE){onOwnerAuth();setShowAuth(false);setAuthCode("");setAuthError(false);}else setAuthError(true);}
  return (
    <div style={{position:"fixed",inset:0,background:"#000000bb",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{background:C.card,border:`1px solid ${accent}55`,borderRadius:14,padding:"24px",width:440,maxWidth:"92vw"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}><MacDots/><span style={{fontSize:12,fontWeight:700,color:accent,fontFamily:C.sans}}>INPUT QTY SELESAI</span></div>
        <div style={{padding:"10px 14px",background:"#050e1f",borderRadius:8,border:`1px solid ${C.border}`,marginBottom:14,display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
          <div><div style={{fontSize:9,color:C.textMid,fontFamily:C.sans}}>Bundle</div><div style={{fontSize:10,color:C.cyan,fontFamily:C.mono,fontWeight:700}}>{bundle.kodeBarcode.split("-").slice(0,2).join("-")}</div></div>
          <div><div style={{fontSize:9,color:C.textMid,fontFamily:C.sans}}>Artikel</div><div style={{fontSize:10,color:C.text,fontFamily:C.sans,fontWeight:600}}>{bundle.model} {bundle.warna} {bundle.size}</div></div>
          <div><div style={{fontSize:9,color:C.textMid,fontFamily:C.sans}}>QTY Terima</div><div style={{fontSize:16,color:C.yellow,fontFamily:C.syne,fontWeight:800}}>{qtyTarget} pcs</div></div>
        </div>
        <div style={{marginBottom:6,padding:"6px 10px",background:C.cyanBg,borderRadius:6,border:`1px solid ${C.cyanDim}`,fontSize:9,color:C.cyan,fontFamily:C.sans}}>ℹ QTY selesai harus sama dengan QTY terima ({qtyTarget} pcs).</div>
        <div style={{marginBottom:12}}>
          <div style={{fontSize:9,color:C.textSub,fontFamily:C.sans,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:5}}>QTY Aktual Selesai <span style={{color:C.red}}>*</span></div>
          <input type="number" min="0" value={qty} onChange={e=>setQty(Math.max(0,Number(e.target.value)))}
            style={{width:"100%",background:"#050e1f",border:`1px solid ${qtyLebih?C.red+"88":qtyKurang?C.yellow+"88":C.green+"55"}`,borderRadius:8,padding:"10px",fontSize:20,color:qtyLebih?C.red:qtyKurang?C.yellow:C.green,fontFamily:C.syne,fontWeight:800,outline:"none",textAlign:"center"}}/>
          {qtyKurang&&<div style={{marginTop:4,fontSize:9,color:C.yellow,fontFamily:C.sans}}>⚠ Kurang {qtyTarget-qty} pcs dari yang diterima.</div>}
          {qtyLebih&&!ownerAuthDone&&<div style={{marginTop:4,fontSize:9,color:C.red,fontFamily:C.sans}}>⚠ Melebihi QTY terima. Butuh validasi Owner.</div>}
          {qtyLebih&&ownerAuthDone&&<div style={{marginTop:4,fontSize:9,color:C.green,fontFamily:C.sans}}>✓ Owner setuju. Masuk antrian koreksi.</div>}
        </div>
        {(qtyKurang||qtyLebih)&&(
          <div style={{marginBottom:12}}>
            <div style={{fontSize:9,color:C.textSub,fontFamily:C.sans,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:5}}>Alasan <span style={{color:C.red}}>*</span></div>
            <textarea value={alasan} onChange={e=>setAlasan(e.target.value)} rows={2} placeholder="Jelaskan alasan perbedaan QTY..."
              style={{width:"100%",background:"#050e1f",border:`1px solid ${alasanWajib?C.red+"88":alasan.trim()?C.green+"44":C.border2}`,borderRadius:7,padding:"8px 11px",fontSize:11,color:C.text,fontFamily:C.sans,outline:"none",resize:"vertical"}}/>
            {alasanWajib&&<div style={{fontSize:9,color:C.red,fontFamily:C.sans,marginTop:2}}>⚠ Alasan wajib diisi.</div>}
          </div>
        )}
        {qtyLebih&&!ownerAuthDone&&(
          <div style={{marginBottom:12}}>
            {!showAuth?<BtnProd6 onClick={()=>setShowAuth(true)} color="yellow" outline full>🔑 MINTA VALIDASI OWNER</BtnProd6>
            :<div style={{padding:"10px",background:"#1a1000",borderRadius:8,border:`1px solid ${C.yellow}44`}}>
              <div style={{fontSize:9,color:C.yellow,fontFamily:C.sans,marginBottom:6}}>Kode Owner:</div>
              <div style={{display:"flex",gap:8}}>
                <input type="password" value={authCode} onChange={e=>{setAuthCode(e.target.value);setAuthError(false);}} onKeyDown={e=>e.key==="Enter"&&handleAuth()}
                  style={{flex:1,background:"#050e1f",border:`1px solid ${authError?C.red+"66":C.yellow+"44"}`,borderRadius:6,padding:"7px",fontSize:14,color:C.text,fontFamily:C.mono,outline:"none",textAlign:"center",letterSpacing:"0.3em"}}/>
                <BtnProd6 onClick={handleAuth} color="yellow" small>OK</BtnProd6>
              </div>
              {authError&&<div style={{fontSize:9,color:C.red,fontFamily:C.sans,marginTop:3}}>⚠ Kode salah.</div>}
            </div>}
          </div>
        )}
        <div style={{display:"flex",gap:8}}>
          <BtnProd6 onClick={onCancel} outline full>BATAL</BtnProd6>
          <BtnProd6 onClick={()=>canSave&&onConfirm({qty,alasan:alasan.trim()||null,overrideOwner:qtyLebih&&ownerAuthDone})} disabled={!canSave} color="green" full>SIMPAN SELESAI</BtnProd6>
        </div>
      </div>
    </div>
  );
}

function ModalReject({bundle,onConfirm,onCancel}) {
  return (
    <div style={{position:"fixed",inset:0,background:"#00000088",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{background:C.card,border:`1px solid ${C.red}55`,borderRadius:14,padding:"22px",width:400,maxWidth:"90vw"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}><MacDots/><span style={{fontSize:12,fontWeight:700,color:C.red,fontFamily:C.sans}}>TANDAI REJECT</span></div>
        <div style={{fontSize:10,color:C.textSub,fontFamily:C.sans,marginBottom:12}}>Bundle <span style={{color:C.cyan,fontFamily:C.mono}}>{bundle.kodeBarcode}</span> — pilih jenis cacat:</div>
        <div style={{display:"flex",flexDirection:"column",gap:7,marginBottom:14}}>
          {JENIS_REJECT.map(j=>(
            <div key={j.id} onClick={()=>onConfirm(j)}
              style={{padding:"9px 13px",borderRadius:8,cursor:"pointer",background:"#050e1f",border:`1px solid ${C.border2}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}
              onMouseEnter={e=>e.currentTarget.style.borderColor=C.red+"66"} onMouseLeave={e=>e.currentTarget.style.borderColor=C.border2}>
              <span style={{fontSize:11,color:C.text,fontFamily:C.sans}}>{j.nama}</span>
              <div style={{display:"flex",gap:5}}>
                {j.potongUpah&&<span style={{fontSize:8,color:C.red,fontFamily:C.mono,background:`${C.red}15`,padding:"1px 6px",borderRadius:3}}>POTONG UPAH</span>}
                {j.bisaRework&&<span style={{fontSize:8,color:C.yellow,fontFamily:C.mono,background:`${C.yellow}15`,padding:"1px 6px",borderRadius:3}}>REWORK</span>}
              </div>
            </div>
          ))}
        </div>
        <BtnProd6 onClick={onCancel} outline full>BATAL</BtnProd6>
      </div>
    </div>
  );
}

function CuttingStation() {
  const [poData,setPoData]=useState(PO_CUTTING.map(po=>({...po,artikel:po.artikel.map(a=>({...a}))})));
  const [selected,setSelected]=useState(new Set());
  const [expandPO,setExpandPO]=useState(new Set(["PO-0001"]));

  function toggleArtikel(poKode,skuKlien){const key=`${poKode}|${skuKlien}`;setSelected(s=>{const ns=new Set(s);ns.has(key)?ns.delete(key):ns.add(key);return ns;});}
  function togglePO(poKode){const po=poData.find(p=>p.kode===poKode);const keys=po.artikel.map(a=>`${poKode}|${a.skuKlien}`);const allSel=keys.every(k=>selected.has(k));setSelected(s=>{const ns=new Set(s);keys.forEach(k=>allSel?ns.delete(k):ns.add(k));return ns;});}

  const selectedArtikel=[];
  poData.forEach(po=>po.artikel.forEach(a=>{if(selected.has(`${po.kode}|${a.skuKlien}`)) selectedArtikel.push({...a,poKode:po.kode,poKlien:po.klien});}));
  const allWOPrinted=selectedArtikel.length>0&&selectedArtikel.every(a=>a.woPrinted);
  const anySelected=selectedArtikel.length>0;

  function printWorkOrder(){
    if(!anySelected) return;
    const rows=selectedArtikel.map(a=>`<tr><td>${a.poKode}</td><td>${a.poKlien}</td><td>${a.skuKlien}</td><td><strong>${a.nama}</strong></td><td style="text-align:center"><strong>${a.qtyOrder}</strong></td><td style="text-align:center">${a.totalBundle}</td><td style="text-align:center">______</td></tr>`).join("");
    const html=`<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{font-family:Arial,sans-serif;padding:20px;font-size:12px}h2{margin-bottom:4px}.sub{color:#666;font-size:11px;margin-bottom:16px}table{width:100%;border-collapse:collapse}th{background:#f0f0f0;padding:8px;text-align:left;border:1px solid #ccc;font-size:11px}td{padding:8px;border:1px solid #ddd}.footer{margin-top:24px;display:flex;justify-content:space-between;font-size:11px;color:#666}</style></head><body><h2>WORK ORDER — CUTTING</h2><div class="sub">Tanggal: ${tanggalSekarang()} | Total Artikel: ${selectedArtikel.length}</div><table><thead><tr><th>Kode PO</th><th>Klien</th><th>SKU Klien</th><th>Nama Artikel</th><th style="text-align:center">QTY</th><th style="text-align:center">Bundle</th><th style="text-align:center">Paraf</th></tr></thead><tbody>${rows}</tbody></table><div class="footer"><span>Disiapkan: _______________</span><span>Disetujui: _______________</span></div></body></html>`;
    const w=window.open("","_blank","width=900,height=600"); w.document.write(html); w.document.close(); w.onload=()=>{w.focus();w.print();};
    setPoData(d=>d.map(po=>({...po,artikel:po.artikel.map(a=>selected.has(`${po.kode}|${a.skuKlien}`)?{...a,woPrinted:true}:a)})));
  }

  function printBarcode(){
    if(!allWOPrinted) return;
    const tikets=selectedArtikel.flatMap(a=>Array.from({length:a.totalBundle},(_,i)=>`<div class="tiket"><div class="bar">${a.poKode.replace("PO-","")} ${a.skuKlien} BDL${String(i+1).padStart(2,"0")}</div><div class="nama">${a.nama}</div><div class="kode">${a.poKode}-${a.skuKlien}-BDL${String(i+1).padStart(2,"0")}</div><div class="row"><span>Bundle ${i+1}/${a.totalBundle}</span><span>${Math.ceil(a.qtyOrder/a.totalBundle)} pcs</span></div></div>`)).join("");
    const html=`<!DOCTYPE html><html><head><meta charset="utf-8"><style>@page{margin:8mm}body{font-family:monospace;margin:0}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:5mm}.tiket{border:1px solid #999;border-radius:4px;padding:7px;page-break-inside:avoid}.bar{background:#000;color:white;height:36px;display:flex;align-items:center;justify-content:center;font-size:8px;letter-spacing:1px;margin-bottom:4px}.nama{font-size:9px;font-weight:700;margin-bottom:3px}.kode{font-size:7px;word-break:break-all;color:#333;margin-bottom:3px}.row{display:flex;justify-content:space-between;font-size:8px;color:#555}</style></head><body><div class="grid">${tikets}</div></body></html>`;
    const w=window.open("","_blank","width=800,height=600"); w.document.write(html); w.document.close(); w.onload=()=>{w.focus();w.print();};
    setPoData(d=>d.map(po=>({...po,artikel:po.artikel.map(a=>selected.has(`${po.kode}|${a.skuKlien}`)&&a.woPrinted?{...a,barcodePrinted:true}:a)})));
  }

  const TH={padding:"9px 12px",textAlign:"left",fontSize:9,fontWeight:700,color:C.textSub,textTransform:"uppercase",letterSpacing:"0.07em",fontFamily:C.sans,whiteSpace:"nowrap"};
  const TD=(i)=>({padding:"10px 12px",fontSize:11,color:C.text,fontFamily:C.sans,background:i%2===0?C.card:C.card2});

  return (
    <div>
      <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:14,padding:"12px 16px",background:C.card2,borderRadius:10,border:`1px solid ${C.border}`}}>
        <div style={{flex:1,fontSize:10,color:C.textSub,fontFamily:C.sans}}>
          {anySelected?<><span style={{color:C.yellow,fontWeight:700}}>{selectedArtikel.length} artikel dipilih</span> · {selectedArtikel.reduce((s,a)=>s+a.qtyOrder,0)} pcs</>:"Pilih artikel yang akan diproses cutting"}
        </div>
        <BtnProd6 onClick={printWorkOrder} disabled={!anySelected} color="blue" outline small>🖨 PRINT WORK ORDER</BtnProd6>
        <BtnProd6 onClick={printBarcode} disabled={!allWOPrinted} color="yellow" small>🏷 PRINT BARCODE</BtnProd6>
        {!allWOPrinted&&anySelected&&<div style={{fontSize:9,color:C.orange,fontFamily:C.sans}}>⚠ Print WO dulu</div>}
      </div>

      {poData.map(po=>(
        <Panel key={po.kode} title={`${po.kode} — ${po.klien}`} accent={C.yellow}
          action={expandPO.has(po.kode)?"▾ TUTUP":"▸ BUKA"}
          onAction={()=>setExpandPO(s=>{const ns=new Set(s);ns.has(po.kode)?ns.delete(po.kode):ns.add(po.kode);return ns;})}>
          {expandPO.has(po.kode)&&(
            <>
              <div style={{padding:"8px 14px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:10}}>
                <input type="checkbox" checked={po.artikel.every(a=>selected.has(`${po.kode}|${a.skuKlien}`))} onChange={()=>togglePO(po.kode)} style={{width:14,height:14,cursor:"pointer"}}/>
                <span style={{fontSize:9,color:C.textSub,fontFamily:C.sans}}>Pilih semua di PO ini</span>
              </div>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",minWidth:560}}>
                  <thead><tr style={{background:"#0e204055"}}>
                    <th style={{...TH,width:36,textAlign:"center"}}>✓</th>
                    {["SKU Klien","Nama Artikel","QTY","Bundle","WO","Barcode"].map(h=>(
                      <th key={h} style={{...TH,textAlign:["QTY","Bundle","WO","Barcode"].includes(h)?"center":TH.textAlign}}>{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {po.artikel.map((art,i)=>{
                      const key=`${po.kode}|${art.skuKlien}`;const isSel=selected.has(key);
                      return (
                        <tr key={art.skuKlien} style={{borderBottom:`1px solid ${C.border}`,background:isSel?`${C.yellow}08`:i%2===0?C.card:C.card2}}>
                          <td style={{...TD(i),textAlign:"center"}}><input type="checkbox" checked={isSel} onChange={()=>toggleArtikel(po.kode,art.skuKlien)} style={{width:14,height:14,cursor:"pointer"}}/></td>
                          <td style={TD(i)}><span style={{fontFamily:C.mono,fontSize:10,color:C.textSub}}>{art.skuKlien}</span></td>
                          <td style={TD(i)}><span style={{fontWeight:600}}>{art.nama}</span></td>
                          <td style={{...TD(i),textAlign:"center"}}><span style={{fontFamily:C.mono,fontWeight:700}}>{art.qtyOrder}</span></td>
                          <td style={{...TD(i),textAlign:"center"}}><span style={{fontFamily:C.mono,color:C.orange}}>{art.totalBundle}</span></td>
                          <td style={{...TD(i),textAlign:"center"}}><span style={{fontSize:9,padding:"2px 7px",borderRadius:99,fontFamily:C.mono,fontWeight:700,background:art.woPrinted?`${C.green}15`:`${C.textMid}15`,color:art.woPrinted?C.green:C.textMid}}>{art.woPrinted?"✓ DONE":"—"}</span></td>
                          <td style={{...TD(i),textAlign:"center"}}><span style={{fontSize:9,padding:"2px 7px",borderRadius:99,fontFamily:C.mono,fontWeight:700,background:art.barcodePrinted?`${C.cyan}15`:`${C.textMid}15`,color:art.barcodePrinted?C.cyan:C.textMid}}>{art.barcodePrinted?"✓ DONE":"—"}</span></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </Panel>
      ))}
      <div style={{padding:"9px 13px",background:C.card2,borderRadius:8,border:`1px solid ${C.border}`,fontSize:9,color:C.textMid,fontFamily:C.sans,lineHeight:1.7}}>⬡ Alur Cutting: Pilih artikel → Print Work Order dulu → Print Barcode → tempel ke bundle fisik</div>
    </div>
  );
}

function ScanStation({tahap,sharedBundleDB,setSharedBundleDB,koreksiQueue,setKoreksiQueue}) {
  const perluKaryawan=["Cutting","Jahit"].includes(tahap);
  const tahapKey=TAHAP_KEY[tahap];
  const tahapIdx=URUTAN_TAHAP.indexOf(tahapKey);
  const tahapSebelumKey=tahapIdx>0?URUTAN_TAHAP[tahapIdx-1]:null;
  const accent=TAHAP_COLOR[tahap]||C.cyan;

  const [showDrop,setShowDrop]=useState(false);
  const [dropIdx,setDropIdx]=useState(-1);
  const [karyawan,setKaryawan]=useState("");
  const [barcode,setBarcode]=useState("");
  const bundleDB=sharedBundleDB;
  const setBundleDB=setSharedBundleDB;
  const [logScan,setLogScan]=useState([]);
  const [modalSelesai,setModalSelesai]=useState(null);
  const [ownerDone,setOwnerDone]=useState(false);
  const [modalReject,setModalReject]=useState(null);
  const [lastBundle,setLastBundle]=useState(null);
  const inputRef=useRef(null);

  useEffect(()=>{if(!perluKaryawan||karyawan) inputRef.current?.focus();},[karyawan,tahap]);

  const allBundleKeys=Object.keys(bundleDB);
  const suggestions=barcode.trim().length>=2?allBundleKeys.filter(k=>k.toLowerCase().includes(barcode.trim().toLowerCase())).slice(0,8):[];
  const canScan=(!perluKaryawan||karyawan)&&barcode.trim();
  const disabled=perluKaryawan&&!karyawan;
  const karyawanList=KARYAWAN_AKTIF.filter(k=>k.tahap.includes(tahap));
  const bundleSedangTerima=Object.values(bundleDB).filter(b=>b.statusTahap[tahapKey]?.status==="terima");

  function pilihSuggestion(kode){setBarcode(kode);setShowDrop(false);setDropIdx(-1);setTimeout(()=>inputRef.current?.focus(),50);}
  function handleBarcodeChange(val){setBarcode(val);setShowDrop(true);setDropIdx(-1);}
  function highlight(text,query){if(!query) return text;const idx=text.toLowerCase().indexOf(query.toLowerCase());if(idx<0) return text;return <>{text.slice(0,idx)}<span style={{color:accent,fontWeight:800}}>{text.slice(idx,idx+query.length)}</span>{text.slice(idx+query.length)}</>;}

  function handleKeyDown(e){
    if(showDrop&&suggestions.length>0){
      if(e.key==="ArrowDown"){e.preventDefault();setDropIdx(i=>Math.min(i+1,suggestions.length-1));}
      else if(e.key==="ArrowUp"){e.preventDefault();setDropIdx(i=>Math.max(i-1,-1));}
      else if(e.key==="Enter"&&dropIdx>=0){e.preventDefault();pilihSuggestion(suggestions[dropIdx]);return;}
      else if(e.key==="Escape"){setShowDrop(false);setDropIdx(-1);}
    }
    if(e.key==="Enter"&&(dropIdx<0||!showDrop)&&canScan) handleScan();
  }

  function handleScan(){
    const kode=barcode.trim();if(!kode) return;
    setBarcode("");setShowDrop(false);
    const bundle=bundleDB[kode];
    if(!bundle){addLog({barcode:kode,status:"error",msg:"Barcode tidak ditemukan."});return;}
    const st=bundle.statusTahap[tahapKey];
    if(tahapSebelumKey){
      const stSblm=bundle.statusTahap[tahapSebelumKey];
      if(!stSblm||stSblm.status!=="selesai"){
        const nm=Object.entries(TAHAP_KEY).find(([,v])=>v===tahapSebelumKey)?.[0]||tahapSebelumKey;
        addLog({barcode:kode,status:"error",msg:`Tahap ${nm} belum selesai untuk bundle ini.`});return;
      }
      if(stSblm.koreksiStatus==="pending"){
        const nm=Object.entries(TAHAP_KEY).find(([,v])=>v===tahapSebelumKey)?.[0]||tahapSebelumKey;
        addLog({barcode:kode,status:"error",msg:`⏳ Bundle menunggu review koreksi di tahap ${nm}. Hubungi Owner.`});return;
      }
    }
    if(!st||st.status===null){
      const qtyTerima=tahapSebelumKey?(bundle.statusTahap[tahapSebelumKey]?.qtySelesai||bundle.qtyBundle):bundle.qtyBundle;
      setBundleDB(db=>({...db,[kode]:{...db[kode],statusTahap:{...db[kode].statusTahap,[tahapKey]:{...db[kode].statusTahap[tahapKey],status:"terima",qtyTerima,waktuTerima:waktuSekarang(),karyawan:perluKaryawan?karyawan:null}}}}));
      const entry={id:Date.now(),waktu:waktuSekarang(),barcode:kode,po:bundle.po,artikel:`${bundle.model} ${bundle.warna} — ${bundle.size}`,qtyTerima,qtySelesai:null,karyawan:perluKaryawan?karyawan:"GLOBAL",fase:"terima"};
      setLogScan(l=>[entry,...l.slice(0,29)]);
      setLastBundle({...bundle,_qtyTerima:qtyTerima});
    } else if(st.status==="terima"){
      setOwnerDone(false);setModalSelesai({...bundle,_qtyTerima:st.qtyTerima||bundle.qtyBundle});
    } else if(st.status==="selesai"){
      addLog({barcode:kode,status:"info",msg:`Bundle sudah SELESAI di tahap ${tahap}.`});
    }
  }

  function handleSelesaiConfirm({qty,alasan,overrideOwner}){
    const bundle=modalSelesai;const kode=bundle.kodeBarcode;
    const qtyTrm=bundle.statusTahap[tahapKey]?.qtyTerima||bundle.qtyBundle;
    const isLebih=qty>qtyTrm;
    const isKurang=qty<qtyTrm;
    const koreksiSt=isLebih?"pending":isKurang?"approved":null;
    setBundleDB(db=>({...db,[kode]:{...db[kode],statusTahap:{...db[kode].statusTahap,[tahapKey]:{...db[kode].statusTahap[tahapKey],status:"selesai",qtySelesai:qty,waktuSelesai:waktuSekarang(),...(koreksiSt?{koreksiStatus:koreksiSt,koreksiAlasan:alasan||null}:{})}}}}));
    if(isLebih||isKurang){
      const korId="KOR-"+Date.now();
      const tahapNm=Object.entries(TAHAP_KEY).find(([,v])=>v===tahapKey)?.[0]||tahapKey;
      const newKor={id:korId,barcode:kode,po:bundle.po,model:bundle.model,size:bundle.size,warna:bundle.warna,tahap:tahapKey,tahapLabel:tahapNm,karyawan:perluKaryawan?karyawan:"GLOBAL",qtyTarget:qtyTrm,qtyAktual:qty,selisih:qty-qtyTrm,alasan:alasan||"",tipe:isLebih?"lebih":"kurang",status:isLebih?"pending":"approved",waktu:new Date().toLocaleString("sv-SE").replace("T"," ").slice(0,16),...(isKurang?{reviewWaktu:new Date().toLocaleString("sv-SE").replace("T"," ").slice(0,16),reviewBy:"Auto"}:{})};
      setKoreksiQueue(q=>[newKor,...q]);
    }
    const entry={id:Date.now(),waktu:waktuSekarang(),barcode:kode,po:bundle.po,artikel:`${bundle.model} ${bundle.warna} — ${bundle.size}`,qtyTerima:bundle._qtyTerima,qtySelesai:qty,selisih:qty-bundle._qtyTerima,alasan:alasan||null,karyawan:perluKaryawan?karyawan:"GLOBAL",fase:"selesai",status:overrideOwner?"override":"sukses"};
    setLogScan(l=>[entry,...l.slice(0,29)]);
    setLastBundle(bundle);setModalSelesai(null);setOwnerDone(false);
    if(qty<bundle._qtyTerima) setTimeout(()=>setModalReject(bundle),150);
  }

  function handleRejectConfirm(jenis){
    const b=modalReject;
    setLogScan(l=>[{id:Date.now(),waktu:waktuSekarang(),barcode:b.kodeBarcode,po:b.po,artikel:`${b.model} ${b.warna} — ${b.size}`,fase:"reject",jenisReject:jenis.nama,potongUpah:jenis.potongUpah,karyawan:perluKaryawan?karyawan:"GLOBAL"},...l.slice(0,29)]);
    setModalReject(null);setLastBundle(null);
  }

  function addLog(e){setLogScan(l=>[{id:Date.now(),waktu:waktuSekarang(),...e},...l.slice(0,29)]);}

  return (
    <div style={{display:"grid",gridTemplateColumns:"340px 1fr",gap:16}}>
      <div>
        {perluKaryawan&&(
          <Panel title={`KARYAWAN — ${tahap.toUpperCase()}`} accent={accent}>
            <div style={{padding:"12px"}}>
              {karyawanList.map(k=>(
                <div key={k.id} onClick={()=>setKaryawan(karyawan===k.nama?"":k.nama)}
                  style={{display:"flex",alignItems:"center",gap:10,padding:"9px 11px",marginBottom:6,borderRadius:8,cursor:"pointer",background:karyawan===k.nama?`${accent}18`:"#050e1f",border:`1px solid ${karyawan===k.nama?accent+"55":C.border2}`,transition:"all 0.1s"}}>
                  <div style={{width:28,height:28,borderRadius:6,flexShrink:0,background:karyawan===k.nama?`${accent}22`:C.card,border:`1px solid ${karyawan===k.nama?accent+"44":C.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:karyawan===k.nama?accent:C.textMid,fontFamily:C.syne}}>{k.nama.charAt(0)}</div>
                  <span style={{fontSize:11,fontWeight:karyawan===k.nama?700:400,color:karyawan===k.nama?C.text:C.textSub,fontFamily:C.sans,flex:1}}>{k.nama}</span>
                  {karyawan===k.nama&&<span style={{fontSize:8,color:accent,fontFamily:C.mono,background:`${accent}15`,padding:"2px 6px",borderRadius:3}}>AKTIF</span>}
                </div>
              ))}
            </div>
          </Panel>
        )}

        {bundleSedangTerima.length>0&&(
          <Panel title={`SEDANG DIPROSES — ${tahap.toUpperCase()}`} accent={accent}>
            <div style={{padding:"10px 12px",display:"flex",flexDirection:"column",gap:7}}>
              {bundleSedangTerima.map(b=>{
                const st=b.statusTahap[tahapKey];
                return (
                  <div key={b.kodeBarcode} style={{padding:"8px 10px",background:"#050e1f",borderRadius:7,border:`1px solid ${accent}33`}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                      <span style={{fontSize:10,fontWeight:700,color:C.text,fontFamily:C.sans}}>{b.model} {b.warna} {b.size}</span>
                      <span style={{fontSize:12,fontWeight:800,color:accent,fontFamily:C.syne}}>{st.qtyTerima} pcs</span>
                    </div>
                    <div style={{display:"flex",gap:10,fontSize:9,color:C.textSub,fontFamily:C.mono}}>
                      <span>{b.po}</span><span>Terima: {st.waktuTerima}</span>{st.karyawan&&<span>{st.karyawan}</span>}
                    </div>
                    <div style={{marginTop:4,fontSize:8,color:accent,fontFamily:C.sans}}>● Scan lagi untuk input hasil SELESAI</div>
                  </div>
                );
              })}
            </div>
          </Panel>
        )}

        <Panel title="SCAN BARCODE" accent={canScan?accent:C.border}>
          <div style={{padding:"14px"}}>
            {perluKaryawan&&!karyawan&&<div style={{marginBottom:10,padding:"8px 11px",background:"#1a0e00",borderRadius:7,border:`1px solid ${C.yellow}44`,fontSize:10,color:C.yellow,fontFamily:C.sans}}>⚠ Pilih karyawan terlebih dahulu.</div>}
            <div style={{marginBottom:10,display:"flex",gap:8}}>
              <div style={{flex:1,padding:"6px 10px",borderRadius:6,textAlign:"center",background:`${C.blue}15`,border:`1px solid ${C.blue}44`}}>
                <div style={{fontSize:8,color:C.blue,fontFamily:C.mono,fontWeight:700}}>SCAN 1</div><div style={{fontSize:9,color:C.textSub}}>TERIMA</div>
              </div>
              <div style={{display:"flex",alignItems:"center",fontSize:12,color:C.textMid}}>→</div>
              <div style={{flex:1,padding:"6px 10px",borderRadius:6,textAlign:"center",background:`${C.green}15`,border:`1px solid ${C.green}44`}}>
                <div style={{fontSize:8,color:C.green,fontFamily:C.mono,fontWeight:700}}>SCAN 2</div><div style={{fontSize:9,color:C.textSub}}>SELESAI</div>
              </div>
            </div>
            <div style={{marginBottom:10,position:"relative"}}>
              <div style={{fontSize:9,color:C.textSub,fontFamily:C.sans,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:5}}>KODE BARCODE</div>
              <input ref={inputRef} value={barcode} onChange={e=>handleBarcodeChange(e.target.value)} onKeyDown={handleKeyDown} onFocus={()=>setShowDrop(true)} onBlur={()=>setTimeout(()=>setShowDrop(false),150)}
                placeholder="Scan atau ketik kode barcode..." disabled={disabled}
                style={{width:"100%",background:"#050e1f",border:`1px solid ${canScan?accent+"66":C.border2}`,borderRadius:showDrop&&suggestions.length>0?"7px 7px 0 0":"7px",padding:"9px 12px",fontSize:12,color:C.text,fontFamily:C.mono,outline:"none",opacity:disabled?0.4:1}}/>
              {showDrop&&suggestions.length>0&&!disabled&&(
                <div style={{position:"absolute",top:"100%",left:0,right:0,zIndex:50,background:"#070f1f",border:`1px solid ${accent}44`,borderTop:"none",borderRadius:"0 0 8px 8px",overflow:"hidden",boxShadow:"0 8px 24px #00000088"}}>
                  {suggestions.map((kode,idx)=>{
                    const b=bundleDB[kode];const st=b?.statusTahap[tahapKey];
                    const faseLabel=!st||st.status===null?"—":st.status==="terima"?"TERIMA":"SELESAI";
                    const fasCol=faseLabel==="TERIMA"?C.blue:faseLabel==="SELESAI"?C.green:C.textMid;
                    return (
                      <div key={kode} onMouseDown={()=>pilihSuggestion(kode)} style={{padding:"9px 12px",cursor:"pointer",background:idx===dropIdx?`${accent}18`:"transparent",borderBottom:`1px solid ${C.border}`}}>
                        <div style={{fontSize:10,fontFamily:C.mono,fontWeight:700,color:idx===dropIdx?accent:C.text,marginBottom:3}}>{highlight(kode,barcode.trim())}</div>
                        {b&&<div style={{display:"flex",gap:8,alignItems:"center"}}>
                          <span style={{fontSize:9,color:C.cyan,fontFamily:C.mono}}>{b.po}</span>
                          <span style={{fontSize:9,color:C.textSub}}>{b.model} {b.warna} {b.size}</span>
                          <span style={{fontSize:8,padding:"1px 6px",borderRadius:3,background:`${fasCol}15`,color:fasCol,fontFamily:C.mono,fontWeight:700,border:`1px solid ${fasCol}33`,marginLeft:"auto"}}>{faseLabel}</span>
                        </div>}
                      </div>
                    );
                  })}
                  <div style={{padding:"4px 10px",fontSize:8,color:C.textMid,fontFamily:C.sans,background:"#050e1f"}}>↑↓ navigasi · Enter pilih · {suggestions.length} hasil</div>
                </div>
              )}
              {showDrop&&barcode.trim().length>=2&&suggestions.length===0&&!disabled&&(
                <div style={{position:"absolute",top:"100%",left:0,right:0,zIndex:50,padding:"10px 12px",background:"#070f1f",border:`1px solid ${C.border}`,borderTop:"none",borderRadius:"0 0 8px 8px",fontSize:10,color:C.red,fontFamily:C.sans}}>✗ Tidak ada bundle cocok dengan "{barcode.trim()}"</div>
              )}
            </div>
            <div style={{marginBottom:10,fontSize:9,color:C.textMid,fontFamily:C.sans}}>Scan 1 = TERIMA · Scan 2 bundle sama = SELESAI + input QTY</div>
            <BtnProd6 onClick={handleScan} disabled={!canScan} color={tahap==="Cutting"?"yellow":tahap==="Jahit"?"cyan":"green"} full>⬡ SCAN — {tahap.toUpperCase()}</BtnProd6>
            {lastBundle&&<div style={{marginTop:8}}><BtnProd6 small onClick={()=>setModalReject(lastBundle)} color="red" outline full>⚑ REJECT — {lastBundle.kodeBarcode?.split("-").slice(0,3).join("-")}...</BtnProd6></div>}
          </div>
        </Panel>

        <div style={{padding:"9px 13px",background:C.card2,borderRadius:8,border:`1px solid ${C.border}`,fontSize:9,color:C.textMid,fontFamily:C.sans,lineHeight:1.7}}>
          {perluKaryawan?"Upah per karyawan yang dipilih.":`Upah global per tahap ${tahap}.`}<br/>
          Scan 1 = TERIMA · Scan 2 = SELESAI + input QTY · Gaji dari SELESAI saja.
        </div>
      </div>

      <Panel title={`LOG SCAN — ${tahap.toUpperCase()}`} accent={accent}>
        {logScan.length===0?(
          <div style={{padding:"40px",textAlign:"center",color:C.textMid,fontFamily:C.sans,fontSize:12}}>Belum ada scan.<br/><span style={{fontSize:10,color:C.textSub}}>Scan pertama akan muncul di sini.</span></div>
        ):(
          <>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",minWidth:580}}>
                <thead><tr style={{background:"#0e204055"}}>
                  {["Waktu","Barcode","PO","Artikel","Fase","QTY Terima","QTY Selesai","Selisih",...(perluKaryawan?["Karyawan"]:[]),"Status"].map(h=>(
                    <th key={h} style={{padding:"8px 10px",textAlign:"left",fontSize:9,fontWeight:700,color:C.textSub,textTransform:"uppercase",letterSpacing:"0.06em",fontFamily:C.sans,whiteSpace:"nowrap"}}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {logScan.map((log,i)=>(
                    <tr key={log.id} style={{borderBottom:`1px solid ${C.border}`,background:log.fase==="reject"?`${C.red}08`:log.fase==="terima"?`${C.blue}05`:i%2===0?C.card:C.card2}}>
                      <td style={{padding:"8px 10px",fontFamily:C.mono,fontSize:9,color:C.textSub,whiteSpace:"nowrap"}}>{log.waktu}</td>
                      <td style={{padding:"8px 10px",fontFamily:C.mono,fontSize:9,color:C.cyan}}>{log.barcode?.split("-").slice(0,3).join("-")}...</td>
                      <td style={{padding:"8px 10px",fontFamily:C.mono,fontSize:10,fontWeight:700}}>{log.po}</td>
                      <td style={{padding:"8px 10px",fontSize:10,color:C.text,fontFamily:C.sans,whiteSpace:"nowrap"}}>{log.artikel}</td>
                      <td style={{padding:"8px 10px"}}>
                        {log.fase==="terima"&&<span style={{fontSize:8,padding:"2px 7px",borderRadius:99,fontFamily:C.mono,fontWeight:700,background:`${C.blue}15`,color:C.blue}}>TERIMA</span>}
                        {log.fase==="selesai"&&<span style={{fontSize:8,padding:"2px 7px",borderRadius:99,fontFamily:C.mono,fontWeight:700,background:`${C.green}15`,color:C.green}}>SELESAI</span>}
                        {log.fase==="reject"&&<span style={{fontSize:8,padding:"2px 7px",borderRadius:99,fontFamily:C.mono,fontWeight:700,background:`${C.red}15`,color:C.red}}>REJECT</span>}
                        {log.status==="error"&&<span style={{fontSize:8,padding:"2px 7px",borderRadius:99,fontFamily:C.mono,fontWeight:700,background:`${C.red}15`,color:C.red}}>ERROR</span>}
                      </td>
                      <td style={{padding:"8px 10px",fontFamily:C.mono,fontSize:11,color:C.textSub,textAlign:"center"}}>{log.qtyTerima??"-"}</td>
                      <td style={{padding:"8px 10px",fontFamily:C.mono,fontSize:11,fontWeight:700,textAlign:"center",color:log.qtySelesai!=null?(log.qtySelesai<(log.qtyTerima||0)?C.yellow:C.green):C.textMid}}>{log.qtySelesai??"-"}</td>
                      <td style={{padding:"8px 10px",fontFamily:C.mono,fontSize:11,fontWeight:700,textAlign:"center",color:!log.selisih?C.textMid:log.selisih<0?C.red:C.yellow}}>{log.selisih!=null?(log.selisih>0?"+":"")+log.selisih:"-"}</td>
                      {perluKaryawan&&<td style={{padding:"8px 10px",fontSize:10,color:C.textSub}}>{log.karyawan}</td>}
                      <td style={{padding:"8px 10px"}}>
                        {log.status==="override"&&<div><span style={{fontSize:8,padding:"2px 6px",borderRadius:99,fontFamily:C.mono,fontWeight:700,background:`${C.yellow}15`,color:C.yellow}}>OVERRIDE</span><div style={{fontSize:7,color:C.yellow,marginTop:1}}>koreksi</div></div>}
                        {log.status==="error"&&<span style={{fontSize:9,color:C.red,fontFamily:C.sans}}>{log.msg}</span>}
                        {log.status==="info"&&<span style={{fontSize:9,color:C.textSub,fontFamily:C.sans}}>{log.msg}</span>}
                        {log.jenisReject&&<div style={{fontSize:8,color:C.red,fontFamily:C.sans}}>{log.jenisReject}</div>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{padding:"8px 14px",borderTop:`1px solid ${C.border}`,display:"flex",gap:14,flexWrap:"wrap"}}>
              <span style={{fontSize:9,color:C.blue,fontFamily:C.mono}}>{logScan.filter(x=>x.fase==="terima").length} terima</span>
              <span style={{fontSize:9,color:C.green,fontFamily:C.mono}}>{logScan.filter(x=>x.fase==="selesai").length} selesai</span>
              <span style={{fontSize:9,color:C.red,fontFamily:C.mono}}>{logScan.filter(x=>x.fase==="reject").length} reject</span>
              <span style={{fontSize:9,color:C.textMid,fontFamily:C.mono,marginLeft:"auto"}}>Total SELESAI: {logScan.filter(x=>x.fase==="selesai"&&x.qtySelesai!=null).reduce((s,x)=>s+(x.qtySelesai||0),0)} pcs</span>
            </div>
          </>
        )}
      </Panel>

      {modalSelesai&&<ModalQtySelesai bundle={modalSelesai} tahapKey={tahapKey} onConfirm={handleSelesaiConfirm} onCancel={()=>{setModalSelesai(null);setOwnerDone(false);}} ownerAuthDone={ownerDone} onOwnerAuth={()=>setOwnerDone(true)}/>}
      {modalReject&&<ModalReject bundle={modalReject} onConfirm={handleRejectConfirm} onCancel={()=>setModalReject(null)}/>}
    </div>
  );
}


// ── MODAL DETAIL TAHAP ────────────────────────────────────────────────────────
function ModalDetailTahap({tahap,artikel,bundleDB,onClose}) {
  const col = {cutting:C.yellow,jahit:C.blue,lkancing:C.purple,bbenang:C.cyan,qc:C.orange,steam:C.green,packing:C.green,kirim:C.cyan}[tahap]||C.cyan;
  const label = {cutting:"CUTTING",jahit:"JAHIT",lkancing:"L.KANCING",bbenang:"BUANG BB",qc:"QC",steam:"STEAM",packing:"PACKING",kirim:"KIRIM"}[tahap]||tahap.toUpperCase();
  const URUTAN = ["cutting","jahit","lkancing","bbenang","qc","steam","packing"];
  const perluKaryawan = ["cutting","jahit"].includes(tahap);

  // Group bundles by skuKlien
  const byArtikel = {};
  Object.values(bundleDB).forEach(b => {
    if(!byArtikel[b.skuKlien]) byArtikel[b.skuKlien] = {nama:`${b.model} ${b.warna} ${b.size}`,skuKlien:b.skuKlien,bundles:[]};
    byArtikel[b.skuKlien].bundles.push(b);
  });

  return (
    <div style={{position:"fixed",inset:0,background:"#000000cc",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{background:C.card,border:`1px solid ${col}55`,borderRadius:16,width:"100%",maxWidth:720,maxHeight:"80vh",display:"flex",flexDirection:"column"}}>
        {/* Header */}
        <div style={{padding:"14px 20px",borderBottom:`1px solid ${col}33`,background:C.card2,display:"flex",alignItems:"center",justifyContent:"space-between",borderRadius:"16px 16px 0 0"}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <MacDots/>
            <span style={{fontSize:13,fontWeight:700,color:col,fontFamily:"'Instrument Sans',sans-serif",letterSpacing:"0.04em"}}>DETAIL — {label}</span>
          </div>
          <button onClick={onClose} style={{background:"transparent",border:`1px solid ${C.border}`,borderRadius:6,color:C.textSub,cursor:"pointer",fontSize:16,width:28,height:28,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
        </div>

        <div style={{overflowY:"auto",padding:"16px 20px"}}>
          {Object.values(byArtikel).map(art => {
            const bundlesRel = art.bundles.filter(b => {
              const st = b.statusTahap?.[tahap];
              return st && (st.status === "terima" || st.status === "selesai");
            });
            if(bundlesRel.length === 0) return null;
            return (
              <div key={art.skuKlien} style={{marginBottom:16,background:"#050e1f",borderRadius:10,border:`1px solid ${C.border}`,overflow:"hidden"}}>
                <div style={{padding:"9px 14px",background:C.card2,borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontSize:12,fontWeight:700,color:C.text,fontFamily:"'Instrument Sans',sans-serif"}}>{art.nama}</span>
                  <span style={{fontSize:9,color:C.textSub,fontFamily:"'Geist Mono',monospace"}}>{art.skuKlien}</span>
                </div>
                <div style={{overflowX:"auto"}}>
                  <table style={{width:"100%",borderCollapse:"collapse"}}>
                    <thead>
                      <tr style={{background:"#0e204055"}}>
                        {["Bundle","No Urut","Status",perluKaryawan?"Karyawan":"","QTY Terima","QTY Selesai","Selisih"].filter(Boolean).map(h=>(
                          <th key={h} style={{padding:"7px 12px",textAlign:"left",fontSize:9,fontWeight:700,color:C.textSub,textTransform:"uppercase",letterSpacing:"0.07em",fontFamily:"'Instrument Sans',sans-serif",whiteSpace:"nowrap"}}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {bundlesRel.map((b,i) => {
                        const st = b.statusTahap[tahap];
                        const selisih = st.qtySelesai != null ? st.qtySelesai - (st.qtyTerima||b.qtyBundle) : null;
                        return (
                          <tr key={b.kodeBarcode} style={{borderBottom:`1px solid ${C.border}`,background:i%2===0?C.card:"#050e1f"}}>
                            <td style={{padding:"9px 12px"}}>
                              <span style={{fontSize:9,fontFamily:"'Geist Mono',monospace",color:C.cyan,wordBreak:"break-all"}}>{b.kodeBarcode}</span>
                            </td>
                            <td style={{padding:"9px 12px"}}>
                              <span style={{fontSize:11,fontFamily:"'Geist Mono',monospace",color:C.textSub}}>BDL{String(b.noUrut).padStart(2,"0")}/{b.totalBundle}</span>
                            </td>
                            <td style={{padding:"9px 12px"}}>
                              {st.status==="terima"
                                ? <span style={{fontSize:9,padding:"2px 7px",borderRadius:99,fontFamily:"'Geist Mono',monospace",fontWeight:700,background:`${C.blue}15`,color:C.blue,border:`1px solid ${C.blue}33`}}>● DIKERJAKAN</span>
                                : <span style={{fontSize:9,padding:"2px 7px",borderRadius:99,fontFamily:"'Geist Mono',monospace",fontWeight:700,background:`${C.green}15`,color:C.green,border:`1px solid ${C.green}33`}}>✓ SELESAI</span>
                              }
                            </td>
                            {perluKaryawan && (
                              <td style={{padding:"9px 12px"}}>
                                <span style={{fontSize:11,color:st.karyawan?C.text:C.textMid,fontFamily:"'Instrument Sans',sans-serif",fontWeight:st.karyawan?600:400}}>{st.karyawan||"—"}</span>
                              </td>
                            )}
                            <td style={{padding:"9px 12px"}}>
                              <span style={{fontFamily:"'Geist Mono',monospace",fontWeight:700,fontSize:12,color:C.yellow}}>{st.qtyTerima??b.qtyBundle}</span>
                            </td>
                            <td style={{padding:"9px 12px"}}>
                              <span style={{fontFamily:"'Geist Mono',monospace",fontWeight:700,fontSize:12,color:st.qtySelesai!=null?C.green:C.textMid}}>{st.qtySelesai??"-"}</span>
                            </td>
                            <td style={{padding:"9px 12px"}}>
                              {selisih!=null
                                ? <span style={{fontFamily:"'Geist Mono',monospace",fontWeight:700,fontSize:12,color:selisih<0?C.red:selisih>0?C.yellow:C.textMid}}>{selisih>0?"+":""}{selisih}</span>
                                : <span style={{color:C.textMid,fontFamily:"'Geist Mono',monospace"}}>—</span>
                              }
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── MONITORING ────────────────────────────────────────────────────────────────
function Monitoring() {
  const poKeys=Object.keys(PO_META);
  const [selectedPO,setSelectedPO]=useState(poKeys[0]);
  const [artikelDB]=useState(()=>JSON.parse(JSON.stringify(initArtikelDB)));
  const [bundleDBLocal]=useState(()=>JSON.parse(JSON.stringify(initBundleDB)));
  const [modalTahap,setModalTahap]=useState(null); // tahapKey yg diklik

  const po=PO_META[selectedPO];
  const artikel=artikelDB[selectedPO]||[];
  const today=new Date();
  const deadline=new Date(po?.deadline);
  const sisaHari=Math.ceil((deadline-today)/(1000*60*60*24));
  const isUrgent=po?.urgent||sisaHari<=7;

  const totalOrder  =artikel.reduce((s,a)=>s+a.qtyOrder,0);
  const totalCutting=artikel.reduce((s,a)=>s+(a.cutting||0),0);
  const totalPacking=artikel.reduce((s,a)=>s+(a.packing||0),0);
  const totalKirim  =artikel.reduce((s,a)=>s+(a.kirim||0),0);
  const totalSisa   =totalOrder-totalKirim;
  const totalReject =artikel.reduce((s,a)=>s+(a.reject||0),0);

  const URUTAN_ALL=[...URUTAN_TAHAP,"kirim"];
  const LABEL_ALL={...TAHAP_LABEL,kirim:"KIRIM"};
  const COL_ALL={...TAHAP_COL,kirim:C.cyan};

  // Untuk setiap tahap: hitung qty SELESAI dan qty TERIMA (sedang dikerjakan)
  function getQtyTahap(tahapKey) {
    const bundles = Object.values(bundleDBLocal).filter(b=>b.po===selectedPO);
    const selesai = bundles.reduce((s,b)=>{
      const st=b.statusTahap[tahapKey];
      return s+(st?.status==="selesai"?(st.qtySelesai||0):0);
    },0);
    const dikerjakan = bundles.reduce((s,b)=>{
      const st=b.statusTahap[tahapKey];
      return s+(st?.status==="terima"?(st.qtyTerima||0):0);
    },0);
    return {selesai,dikerjakan};
  }

  // Qty belum disentuh cutting
  const qtyAntriBelumCutting = totalOrder - totalCutting;

  // Double box component
  function TahapDoubleBox({tahapKey,label,color,onClick}) {
    const {selesai,dikerjakan}=getQtyTahap(tahapKey);
    const pctSelesai=totalOrder>0?Math.round((selesai/totalOrder)*100):0;
    const pctDikerjakan=totalOrder>0?Math.round((dikerjakan/totalOrder)*100):0;
    const hasData=selesai>0||dikerjakan>0;
    return (
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2,minWidth:72,cursor:"pointer"}} onClick={onClick}>
        {/* Kotak atas — selesai/menunggu */}
        <div style={{width:68,height:52,borderRadius:"8px 8px 4px 4px",
          background:selesai>0?`${color}18`:"transparent",
          border:`2px solid ${selesai>0?color:C.border}`,
          display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
          transition:"all 0.15s"}}
          onMouseEnter={e=>{e.currentTarget.parentElement.querySelectorAll("div").forEach(d=>d.style.borderColor=color);}}
          onMouseLeave={e=>{e.currentTarget.parentElement.querySelectorAll("div").forEach(d=>d.style.borderColor="");}}
        >
          <span style={{fontSize:15,fontWeight:800,color:selesai>0?color:C.textMid,fontFamily:"'Syne',sans-serif",lineHeight:1}}>{selesai}</span>
          <span style={{fontSize:7,color:selesai>0?color+"aa":C.textMid,fontFamily:"'Geist Mono',monospace"}}>{pctSelesai}%</span>
        </div>
        {/* Panah tengah */}
        <div style={{fontSize:10,color:hasData?color:C.textMid,lineHeight:1}}>▼</div>
        {/* Kotak bawah — sedang dikerjakan */}
        <div style={{width:68,height:44,borderRadius:"4px 4px 8px 8px",
          background:dikerjakan>0?`${color}10`:"transparent",
          border:`2px solid ${dikerjakan>0?color+"88":C.border+"66"}`,
          display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
          <span style={{fontSize:13,fontWeight:700,color:dikerjakan>0?color:C.textMid,fontFamily:"'Syne',sans-serif",lineHeight:1}}>{dikerjakan}</span>
          <span style={{fontSize:7,color:dikerjakan>0?color+"88":C.textMid,fontFamily:"'Geist Mono',monospace"}}>{pctDikerjakan}%</span>
        </div>
        {/* Label + keterangan */}
        <div style={{textAlign:"center",marginTop:4}}>
          <div style={{fontSize:8,color:hasData?color:C.textMid,fontFamily:"'Geist Mono',monospace",fontWeight:700,letterSpacing:"0.04em"}}>{label}</div>
          <div style={{fontSize:7,color:C.textMid,fontFamily:"'Instrument Sans',sans-serif",marginTop:1}}>↑selesai ↓proses</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Pilih PO */}
      <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
        {poKeys.map(k=>{
          const p=PO_META[k];const dl=new Date(p.deadline);
          const sisa=Math.ceil((dl-today)/(1000*60*60*24));const urgent=p.urgent||sisa<=7;
          return (
            <button key={k} onClick={()=>setSelectedPO(k)}
              style={{padding:"7px 14px",fontSize:10,fontWeight:700,fontFamily:"'Geist Mono',monospace",
                background:selectedPO===k?C.cyan:"transparent",
                color:selectedPO===k?"#000":urgent?C.red:C.textSub,
                border:`1px solid ${selectedPO===k?C.cyan:urgent?C.red+"55":C.border}`,
                borderRadius:8,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>
              {urgent&&"⚠"}{k} — {p.model}
            </button>
          );
        })}
      </div>

      {/* Header PO */}
      <div style={{padding:"14px 20px",background:C.card,border:`1px solid ${isUrgent?C.red+"44":C.border}`,borderRadius:12,marginBottom:16,display:"flex",flexWrap:"wrap",gap:20,alignItems:"center"}}>
        <div><div style={{fontSize:9,color:C.textMid,fontFamily:"'Instrument Sans',sans-serif"}}>Purchase Order</div><div style={{fontSize:20,fontWeight:800,color:C.cyan,fontFamily:"'Syne',sans-serif"}}>{selectedPO}</div></div>
        <div><div style={{fontSize:9,color:C.textMid,fontFamily:"'Instrument Sans',sans-serif"}}>Klien</div><div style={{fontSize:12,fontWeight:600,color:C.text}}>{po?.klien}</div></div>
        <div><div style={{fontSize:9,color:C.textMid,fontFamily:"'Instrument Sans',sans-serif"}}>Deadline</div><div style={{fontSize:12,fontWeight:700,color:isUrgent?C.red:C.text,fontFamily:"'Geist Mono',monospace"}}>{po?.deadline}</div></div>
        <div><div style={{fontSize:9,color:C.textMid,fontFamily:"'Instrument Sans',sans-serif"}}>Sisa Hari</div><div style={{fontSize:18,fontWeight:800,color:isUrgent?C.red:C.green,fontFamily:"'Syne',sans-serif"}}>{sisaHari>0?`${sisaHari} hari`:"LEWAT"}</div></div>
        {isUrgent&&<div style={{marginLeft:"auto",padding:"7px 14px",background:`${C.red}15`,border:`1px solid ${C.red}44`,borderRadius:8,fontSize:10,fontWeight:700,color:C.red,fontFamily:"'Geist Mono',monospace"}}>⚠ URGENT</div>}
      </div>

      {/* KPI */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:10,marginBottom:16}}>
        {[
          {label:"QTY ORDER",value:totalOrder,color:C.cyan},
          {label:"CUTTING",value:totalCutting,color:C.yellow,unit:`${totalOrder>0?Math.round(totalCutting/totalOrder*100):0}%`},
          {label:"PACKING",value:totalPacking,color:C.green,unit:`${totalOrder>0?Math.round(totalPacking/totalOrder*100):0}%`},
          {label:"TERKIRIM",value:totalKirim,color:C.cyan,unit:`${totalOrder>0?Math.round(totalKirim/totalOrder*100):0}%`},
          {label:"SISA",value:totalSisa,color:totalSisa>0?C.orange:C.green,unit:"pcs"},
          {label:"REJECT",value:totalReject,color:totalReject>0?C.red:C.textMid,unit:"pcs"},
        ].map(k=>(
          <div key={k.label} style={{background:C.card,border:`1px solid ${k.label==="REJECT"&&k.value>0?C.red+"44":C.border}`,borderRadius:10,padding:"11px 13px",borderLeft:`3px solid ${k.color}`}}>
            <div style={{fontSize:8,color:C.textSub,fontFamily:"'Instrument Sans',sans-serif",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:3}}>{k.label}</div>
            <div style={{fontSize:20,fontWeight:800,color:k.color,fontFamily:"'Syne',sans-serif",lineHeight:1}}>{k.value}</div>
            {k.unit&&<div style={{fontSize:9,color:C.textSub,fontFamily:"'Geist Mono',monospace",marginTop:2}}>{k.unit}</div>}
          </div>
        ))}
      </div>

      {/* Alur produksi — double box */}
      <Panel title="ALUR PRODUKSI — KESELURUHAN PO">
        <div style={{padding:"14px 10px 6px",overflowX:"auto"}}>
          {/* Legend */}
          <div style={{display:"flex",gap:16,marginBottom:12,paddingLeft:8}}>
            <div style={{display:"flex",alignItems:"center",gap:5}}>
              <div style={{width:12,height:8,borderRadius:2,background:`${C.cyan}30`,border:`1.5px solid ${C.cyan}`}}/>
              <span style={{fontSize:8,color:C.textSub,fontFamily:"'Instrument Sans',sans-serif"}}>kotak atas = selesai / menunggu tahap berikutnya</span>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:5}}>
              <div style={{width:12,height:8,borderRadius:2,background:`${C.cyan}15`,border:`1.5px solid ${C.cyan}66`}}/>
              <span style={{fontSize:8,color:C.textSub,fontFamily:"'Instrument Sans',sans-serif"}}>kotak bawah = sedang dikerjakan</span>
            </div>
            <div style={{fontSize:8,color:C.textMid,fontFamily:"'Instrument Sans',sans-serif",marginLeft:"auto"}}>klik kotak untuk detail</div>
          </div>

          <div style={{display:"flex",gap:0,alignItems:"flex-start",minWidth:"max-content",paddingBottom:8}}>

            {/* ANTRI CUTTING — kotak besar */}
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2,marginRight:4,cursor:"pointer"}}
              onClick={()=>setModalTahap("antri")}>
              <div style={{width:84,height:100,borderRadius:10,
                background:qtyAntriBelumCutting>0?`${C.textSub}15`:"transparent",
                border:`2px solid ${qtyAntriBelumCutting>0?C.textSub:C.border}`,
                display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4}}>
                <span style={{fontSize:20,fontWeight:800,color:qtyAntriBelumCutting>0?C.text:C.textMid,fontFamily:"'Syne',sans-serif",lineHeight:1}}>{qtyAntriBelumCutting}</span>
                <span style={{fontSize:8,color:C.textSub,fontFamily:"'Geist Mono',monospace"}}>{totalOrder>0?Math.round(qtyAntriBelumCutting/totalOrder*100):0}%</span>
              </div>
              <div style={{textAlign:"center",marginTop:4}}>
                <div style={{fontSize:8,color:C.textSub,fontFamily:"'Geist Mono',monospace",fontWeight:700}}>ANTRI</div>
                <div style={{fontSize:8,color:C.textSub,fontFamily:"'Geist Mono',monospace",fontWeight:700}}>CUTTING</div>
              </div>
            </div>

            {/* Panah → ke Cutting */}
            <div style={{display:"flex",alignItems:"center",paddingBottom:24,marginTop:12}}>
              <div style={{width:14,height:2,background:C.textMid}}/>
              <div style={{fontSize:10,color:C.textMid}}>▶</div>
            </div>

            {/* Semua tahap dengan double box */}
            {URUTAN_TAHAP.map((t,i)=>(
              <div key={t} style={{display:"flex",alignItems:"center"}}>
                <TahapDoubleBox
                  tahapKey={t}
                  label={TAHAP_LABEL[t]}
                  color={TAHAP_COL[t]}
                  onClick={()=>setModalTahap(t)}/>
                {i<URUTAN_TAHAP.length-1&&(
                  <div style={{display:"flex",alignItems:"center",paddingBottom:24,margin:"0 2px"}}>
                    <div style={{width:10,height:2,background:C.border}}/>
                    <div style={{fontSize:9,color:C.textMid}}>▶</div>
                  </div>
                )}
              </div>
            ))}

            {/* Panah → ke KIRIM */}
            <div style={{display:"flex",alignItems:"center",paddingBottom:24,margin:"0 2px"}}>
              <div style={{width:10,height:2,background:C.border}}/>
              <div style={{fontSize:9,color:C.textMid}}>▶</div>
            </div>

            {/* KIRIM */}
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2,minWidth:72,cursor:"pointer"}}
              onClick={()=>setModalTahap("kirim")}>
              <div style={{width:68,height:100,borderRadius:10,
                background:totalKirim>0?`${C.cyan}18`:"transparent",
                border:`2px solid ${totalKirim>0?C.cyan:C.cyanDim}`,
                display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4}}>
                <span style={{fontSize:18,fontWeight:800,color:totalKirim>0?C.cyan:C.textMid,fontFamily:"'Syne',sans-serif",lineHeight:1}}>{totalKirim}</span>
                <span style={{fontSize:8,color:totalKirim>0?C.cyan+"aa":C.textMid,fontFamily:"'Geist Mono',monospace"}}>{totalOrder>0?Math.round(totalKirim/totalOrder*100):0}%</span>
              </div>
              <div style={{textAlign:"center",marginTop:4}}>
                <div style={{fontSize:8,color:C.cyan,fontFamily:"'Geist Mono',monospace",fontWeight:700}}>KIRIM</div>
                <div style={{fontSize:7,color:C.textMid,fontFamily:"'Instrument Sans',sans-serif",marginTop:1}}>terkirim ke klien</div>
              </div>
            </div>

          </div>
        </div>
      </Panel>

      {/* Tabel detail per artikel */}
      <Panel title="DETAIL PER ARTIKEL — PROGRESS & TERKIRIM">
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",minWidth:1040}}>
            <thead><tr style={{background:"#0e204055"}}>
              <th style={{padding:"9px 14px",textAlign:"left",fontSize:9,fontWeight:700,color:C.textSub,textTransform:"uppercase",letterSpacing:"0.07em",fontFamily:"'Instrument Sans',sans-serif",whiteSpace:"nowrap"}}>Artikel</th>
              <th style={{padding:"9px 10px",textAlign:"center",fontSize:9,fontWeight:700,color:C.textSub,textTransform:"uppercase",fontFamily:"'Instrument Sans',sans-serif"}}>Order</th>
              {URUTAN_TAHAP.map(t=>(<th key={t} style={{padding:"9px 7px",textAlign:"center",fontSize:8,fontWeight:700,color:TAHAP_COL[t],textTransform:"uppercase",letterSpacing:"0.04em",fontFamily:"'Geist Mono',monospace"}}>{TAHAP_LABEL[t]}</th>))}
              <th style={{padding:"9px 7px",textAlign:"center",fontSize:9,fontWeight:700,color:C.cyan,textTransform:"uppercase",fontFamily:"'Geist Mono',monospace"}}>KIRIM</th>
              <th style={{padding:"9px 7px",textAlign:"center",fontSize:9,fontWeight:700,color:C.orange,textTransform:"uppercase",fontFamily:"'Geist Mono',monospace"}}>SISA</th>
              <th style={{padding:"9px 7px",textAlign:"center",fontSize:9,fontWeight:700,color:C.red,textTransform:"uppercase",fontFamily:"'Instrument Sans',sans-serif"}}>Reject</th>
            </tr></thead>
            <tbody>
              {artikel.map((art,i)=>{
                const sisa=art.qtyOrder-(art.kirim||0);
                return (
                  <tr key={art.skuKlien} style={{borderBottom:`1px solid ${C.border}`,background:i%2===0?C.card:C.card2}}>
                    <td style={{padding:"11px 14px"}}>
                      <div style={{fontWeight:600,fontSize:11,color:C.text,fontFamily:"'Instrument Sans',sans-serif"}}>{art.nama}</div>
                      <div style={{fontSize:9,color:C.textSub,fontFamily:"'Geist Mono',monospace",marginTop:1}}>{art.skuKlien}</div>
                    </td>
                    <td style={{padding:"10px",textAlign:"center"}}><span style={{fontFamily:"'Geist Mono',monospace",fontWeight:700,fontSize:12}}>{art.qtyOrder}</span></td>
                    {URUTAN_TAHAP.map(t=>{
                      const val=art[t]||0;const col=TAHAP_COL[t];
                      return (
                        <td key={t} style={{padding:"7px 5px",textAlign:"center",cursor:"pointer"}} onClick={()=>setModalTahap(t)}>
                          <div style={{width:40,height:40,borderRadius:7,margin:"0 auto",background:val>0?`${col}15`:"transparent",border:`2px solid ${val>0?col:C.border}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",transition:"border-color 0.1s"}}
                            onMouseEnter={e=>e.currentTarget.style.borderColor=col}
                            onMouseLeave={e=>e.currentTarget.style.borderColor=val>0?col:C.border}>
                            <span style={{fontSize:12,fontWeight:800,color:val>0?col:C.textMid,fontFamily:"'Syne',sans-serif",lineHeight:1}}>{val}</span>
                            {val>0&&art.qtyOrder>0&&<span style={{fontSize:7,color:col+"99",fontFamily:"'Geist Mono',monospace"}}>{Math.round(val/art.qtyOrder*100)}%</span>}
                          </div>
                        </td>
                      );
                    })}
                    <td style={{padding:"7px 5px",textAlign:"center"}}>
                      <div style={{width:40,height:40,borderRadius:7,margin:"0 auto",background:(art.kirim||0)>0?`${C.cyan}18`:"transparent",border:`2px solid ${(art.kirim||0)>0?C.cyan:C.cyanDim}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                        <span style={{fontSize:12,fontWeight:800,color:(art.kirim||0)>0?C.cyan:C.textMid,fontFamily:"'Syne',sans-serif",lineHeight:1}}>{art.kirim||0}</span>
                        {(art.kirim||0)>0&&<span style={{fontSize:7,color:C.cyan+"99",fontFamily:"'Geist Mono',monospace"}}>{Math.round((art.kirim||0)/art.qtyOrder*100)}%</span>}
                      </div>
                    </td>
                    <td style={{padding:"7px 5px",textAlign:"center"}}>
                      <div style={{width:40,height:40,borderRadius:7,margin:"0 auto",background:sisa>0?`${C.orange}15`:`${C.green}15`,border:`2px solid ${sisa>0?C.orange:C.green}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                        <span style={{fontSize:12,fontWeight:800,color:sisa>0?C.orange:C.green,fontFamily:"'Syne',sans-serif",lineHeight:1}}>{sisa}</span>
                        <span style={{fontSize:7,color:(sisa>0?C.orange:C.green)+"99",fontFamily:"'Geist Mono',monospace"}}>{sisa===0?"LUNAS":"sisa"}</span>
                      </div>
                    </td>
                    <td style={{padding:"7px 5px",textAlign:"center"}}>
                      {(art.reject||0)>0?<span style={{fontFamily:"'Geist Mono',monospace",fontWeight:800,fontSize:13,color:C.red}}>{art.reject}</span>:<span style={{fontFamily:"'Geist Mono',monospace",fontSize:11,color:C.textMid}}>—</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr style={{background:"#0e204055",borderTop:`2px solid ${C.border}`}}>
                <td style={{padding:"10px 14px",fontSize:10,fontWeight:700,color:C.textSub,fontFamily:"'Instrument Sans',sans-serif"}}>TOTAL</td>
                <td style={{padding:"10px",textAlign:"center",fontFamily:"'Geist Mono',monospace",fontWeight:800,fontSize:12}}>{totalOrder}</td>
                {URUTAN_TAHAP.map(t=>(<td key={t} style={{padding:"10px 5px",textAlign:"center",fontFamily:"'Geist Mono',monospace",fontWeight:700,fontSize:11,color:TAHAP_COL[t]}}>{artikel.reduce((s,a)=>s+(a[t]||0),0)}</td>))}
                <td style={{padding:"10px 5px",textAlign:"center",fontFamily:"'Geist Mono',monospace",fontWeight:700,fontSize:11,color:C.cyan}}>{totalKirim}</td>
                <td style={{padding:"10px 5px",textAlign:"center",fontFamily:"'Geist Mono',monospace",fontWeight:700,fontSize:11,color:totalSisa>0?C.orange:C.green}}>{totalSisa}</td>
                <td style={{padding:"10px 5px",textAlign:"center",fontFamily:"'Geist Mono',monospace",fontWeight:700,fontSize:11,color:totalReject>0?C.red:C.textMid}}>{totalReject||"—"}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Panel>

      {/* Modal detail tahap */}
      {modalTahap&&(
        <ModalDetailTahap
          tahap={modalTahap}
          artikel={artikel}
          bundleDB={bundleDBLocal}
          onClose={()=>setModalTahap(null)}/>
      )}
    </div>
  );
}

function WarningProses() {
  const [settings,setSettings]=useState({...initWarningSettings});
  const [editSettings,setEditSettings]=useState(false);
  const [tmpSettings,setTmpSettings]=useState({...initWarningSettings});

  const dummyWarnings=[
    {id:"W001",kodeBarcode:"PO0001-Air-blck-s-0001-BDL01-01-03-25",po:"PO-0001",artikel:"Airflow Black S",tahap:"jahit",waktuTerima:"2025-04-01 08:00",hariDitahap:6,batasHari:settings.jahit,perpanjangan:0},
    {id:"W002",kodeBarcode:"PO0001-Air-blck-m-0002-BDL01-01-03-25",po:"PO-0001",artikel:"Airflow Black M",tahap:"lkancing",waktuTerima:"2025-04-03 10:00",hariDitahap:3,batasHari:settings.lkancing,perpanjangan:0},
  ].filter(w=>w.hariDitahap>(w.batasHari+w.perpanjangan));

  const [warnings,setWarnings]=useState(dummyWarnings);
  function tambahWaktu(id){setWarnings(ws=>ws.map(w=>w.id===id?{...w,perpanjangan:w.perpanjangan+3}:w).filter(w=>w.hariDitahap<=(w.batasHari+w.perpanjangan+3)));}

  const TH={padding:"9px 14px",textAlign:"left",fontSize:9,fontWeight:700,color:C.textSub,textTransform:"uppercase",letterSpacing:"0.07em",fontFamily:C.sans,whiteSpace:"nowrap"};
  const TD=(i)=>({padding:"11px 14px",fontSize:11,color:C.text,fontFamily:C.sans,background:i%2===0?C.card:C.card2});

  return (
    <div>
      <Panel title="SETTING BATAS WAKTU PER TAHAP" accent={C.yellow}
        action={editSettings?"SIMPAN":"EDIT SETTING"}
        onAction={()=>{if(editSettings)setSettings({...tmpSettings});else setTmpSettings({...settings});setEditSettings(!editSettings);}}>
        <div style={{padding:"14px 18px",display:"flex",gap:12,flexWrap:"wrap"}}>
          {URUTAN_TAHAP.map(t=>(
            <div key={t} style={{background:"#050e1f",border:`1px solid ${TAHAP_COL[t]}33`,borderRadius:8,padding:"10px 14px",minWidth:100,textAlign:"center"}}>
              <div style={{fontSize:9,color:TAHAP_COL[t],fontFamily:C.mono,fontWeight:700,textTransform:"uppercase",marginBottom:6}}>{TAHAP_LABEL[t]}</div>
              {editSettings?(
                <div style={{display:"flex",alignItems:"center",gap:4,justifyContent:"center"}}>
                  <input type="number" min="1" value={tmpSettings[t]} onChange={e=>setTmpSettings(s=>({...s,[t]:Number(e.target.value)||1}))}
                    style={{width:50,background:"#070f1f",border:`1px solid ${TAHAP_COL[t]}44`,borderRadius:5,padding:"4px",fontSize:13,color:TAHAP_COL[t],fontFamily:C.syne,fontWeight:800,outline:"none",textAlign:"center"}}/>
                  <span style={{fontSize:9,color:C.textMid,fontFamily:C.sans}}>hari</span>
                </div>
              ):(
                <div><span style={{fontSize:18,fontWeight:800,color:TAHAP_COL[t],fontFamily:C.syne}}>{settings[t]}</span><span style={{fontSize:9,color:C.textMid,fontFamily:C.sans,marginLeft:3}}>hari</span></div>
              )}
            </div>
          ))}
        </div>
      </Panel>

      <Panel title={`WARNING PROSES — ${warnings.length} BUNDLE TERLAMBAT`} accent={C.red}>
        {warnings.length===0?(
          <div style={{padding:"40px",textAlign:"center",color:C.green,fontFamily:C.sans,fontSize:13}}>✓ Semua proses dalam batas waktu normal.</div>
        ):(
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",minWidth:680}}>
              <thead><tr style={{background:"#0e204055"}}>
                {["Bundle","PO","Artikel","Tahap","Terima Sejak","Hari di Tahap","Batas","Lebih","Aksi"].map(h=>(
                  <th key={h} style={{...TH,textAlign:h==="Aksi"?"center":TH.textAlign}}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {warnings.map((w,i)=>{
                  const lebih=w.hariDitahap-(w.batasHari+w.perpanjangan);const col=TAHAP_COL[w.tahap]||C.cyan;
                  return (
                    <tr key={w.id} style={{borderBottom:`1px solid ${C.border}`,background:i%2===0?C.card:C.card2}}>
                      <td style={TD(i)}><span style={{fontFamily:C.mono,fontSize:9,color:C.cyan}}>{w.kodeBarcode.split("-").slice(0,3).join("-")}...</span></td>
                      <td style={TD(i)}><span style={{fontFamily:C.mono,fontWeight:700,color:C.cyan}}>{w.po}</span></td>
                      <td style={TD(i)}><span style={{fontWeight:600}}>{w.artikel}</span></td>
                      <td style={TD(i)}><span style={{fontSize:9,padding:"2px 8px",borderRadius:99,fontFamily:C.mono,fontWeight:700,background:`${col}15`,color:col,border:`1px solid ${col}33`}}>{TAHAP_LABEL[w.tahap]}</span></td>
                      <td style={TD(i)}><span style={{fontFamily:C.mono,fontSize:10,color:C.textSub}}>{w.waktuTerima}</span></td>
                      <td style={TD(i)}><span style={{fontFamily:C.syne,fontWeight:800,fontSize:14,color:C.red}}>{w.hariDitahap}</span><span style={{fontSize:9,color:C.textSub,fontFamily:C.sans,marginLeft:3}}>hari</span></td>
                      <td style={TD(i)}><span style={{fontFamily:C.mono,fontSize:11,color:C.textSub}}>{w.batasHari+w.perpanjangan} hari</span>{w.perpanjangan>0&&<span style={{fontSize:8,color:C.yellow,fontFamily:C.mono,marginLeft:4}}>(+{w.perpanjangan})</span>}</td>
                      <td style={TD(i)}><span style={{fontFamily:C.syne,fontWeight:800,fontSize:14,color:C.red}}>+{lebih}</span><span style={{fontSize:9,color:C.red,fontFamily:C.sans,marginLeft:3}}>hari</span></td>
                      <td style={{...TD(i),textAlign:"center"}}><BtnProd6 small onClick={()=>tambahWaktu(w.id)} color="yellow" outline>+3 Hari</BtnProd6></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        <div style={{padding:"10px 18px",borderTop:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between"}}>
          <span style={{fontSize:9,color:C.textMid,fontFamily:C.sans}}>Bundle melewati batas waktu per tahap akan muncul otomatis.</span>
          <span style={{fontSize:9,color:warnings.length>0?C.red:C.green,fontFamily:C.mono}}>{warnings.length} WARNING AKTIF</span>
        </div>
      </Panel>
    </div>
  );
}

const SUB_TABS_PROD6=[
  {id:"cutting",label:"Cutting",color:C.yellow},
  {id:"jahit",label:"Jahit",color:C.blue},
  {id:"lkancing",label:"Lubang Kancing",color:C.purple},
  {id:"bbenang",label:"Buang Benang",color:C.cyan},
  {id:"qc",label:"QC",color:C.orange},
  {id:"steam",label:"Steam",color:C.green},
  {id:"packing",label:"Packing",color:C.green},
  {id:"monitoring",label:"Monitoring",color:C.textSub},
  {id:"warning",label:"⚠ Warning Proses",color:C.red},
];
const TAB_TO_TAHAP={cutting:"Cutting",jahit:"Jahit",lkancing:"Lubang Kancing",bbenang:"Buang Benang",qc:"QC",steam:"Steam",packing:"Packing"};

function TabProduksi({defaultTab="cutting",sharedBundleDB,setSharedBundleDB,koreksiQueue,setKoreksiQueue}) {
  const [activeTab,setActiveTab]=useState(defaultTab);
  const cur=SUB_TABS_PROD6.find(t=>t.id===activeTab);
  return (
    <div>
      <div style={{marginBottom:14}}><div style={{fontSize:10,color:C.textSub,fontFamily:C.mono,letterSpacing:"0.07em"}}>PRODUKSI / {cur?.label.toUpperCase()}</div></div>
      {activeTab==="monitoring"?<Monitoring/>:activeTab==="warning"?<WarningProses/>:activeTab==="cutting"?<CuttingStation/>:<ScanStation tahap={TAB_TO_TAHAP[activeTab]} sharedBundleDB={sharedBundleDB} setSharedBundleDB={setSharedBundleDB} koreksiQueue={koreksiQueue} setKoreksiQueue={setKoreksiQueue}/>}
    </div>
  );
}


// --- TAB PENGIRIMAN ---





function BtnKirim({children,onClick,color="cyan",small=false,outline=false,disabled=false,full=false}) {
  const colMap={cyan:C.cyan,green:C.green,red:C.red,yellow:C.yellow,purple:C.purple,orange:C.orange,blue:C.blue};
  const col=colMap[color]||C.cyan;
  return (
    <button onClick={onClick} disabled={disabled}
      style={{padding:small?"5px 12px":"9px 20px",fontSize:small?9:11,fontWeight:700,fontFamily:C.mono,
        background:disabled?"#1a2030":outline?"transparent":col,
        color:disabled?C.textMid:outline?col:"#000",
        border:`1px solid ${disabled?"#1a2030":col}`,
        borderRadius:7,cursor:disabled?"not-allowed":"pointer",
        letterSpacing:"0.05em",whiteSpace:"nowrap",opacity:disabled?0.5:1,
        width:full?"100%":"auto"}}>
      {children}
    </button>
  );
}

const TH_KIRIM = {padding:"9px 14px",textAlign:"left",fontSize:9,fontWeight:700,
  color:C.textSub,textTransform:"uppercase",letterSpacing:"0.07em",fontFamily:C.sans,whiteSpace:"nowrap"};
const TD_KIRIM = (i) => ({padding:"11px 14px",fontSize:11,color:C.text,fontFamily:C.sans,
  background:i%2===0?C.card:C.card2});

// ── DUMMY DATA ─────────────────────────────────────────────────────────────────


// Pool bundle yang sudah selesai Packing — siap kirim
// Di sistem real, ini dari bundleDB yang statusTahap.packing.status === "selesai"
const initPoolSiapKirim = [
  {
    kodeBarcode:"PO0001-Air-blck-l-0003-BDL01-01-03-25",
    po:"PO-0001",idKlien:"KLN-001",
    skuKlien:"ely291",skuInternal:"LYX-0003-KOU",
    namaArtikel:"Airflow Black L",model:"Airflow",size:"L",warna:"Black",
    qtyBundle:8,noUrut:1,totalBundle:2,
    waktuPackingSelesai:"14:30",tanggal:"2025-04-01",
  },
  {
    kodeBarcode:"PO0001-Air-blck-l-0003-BDL02-01-03-25",
    po:"PO-0001",idKlien:"KLN-001",
    skuKlien:"ely291",skuInternal:"LYX-0003-KOU",
    namaArtikel:"Airflow Black L",model:"Airflow",size:"L",warna:"Black",
    qtyBundle:7,noUrut:2,totalBundle:2,
    waktuPackingSelesai:"14:45",tanggal:"2025-04-01",
  },
  {
    kodeBarcode:"PO0001-Air-blck-m-0002-BDL01-01-03-25",
    po:"PO-0001",idKlien:"KLN-001",
    skuKlien:"ely290",skuInternal:"LYX-0002-KOU",
    namaArtikel:"Airflow Black M",model:"Airflow",size:"M",warna:"Black",
    qtyBundle:6,noUrut:1,totalBundle:2,
    waktuPackingSelesai:"15:00",tanggal:"2025-04-01",
  },
  {
    kodeBarcode:"PO0001-Air-blck-m-0002-BDL02-01-03-25",
    po:"PO-0001",idKlien:"KLN-001",
    skuKlien:"ely290",skuInternal:"LYX-0002-KOU",
    namaArtikel:"Airflow Black M",model:"Airflow",size:"M",warna:"Black",
    qtyBundle:6,noUrut:2,totalBundle:2,
    waktuPackingSelesai:"15:10",tanggal:"2025-04-01",
  },
  {
    kodeBarcode:"PO0002-Nec-blck-s-0004-BDL01-10-03-25",
    po:"PO-0002",idKlien:"KLN-001",
    skuKlien:"ely330",skuInternal:"LYX-0011-KOU",
    namaArtikel:"Neck Black S",model:"Neck",size:"S",warna:"Black",
    qtyBundle:9,noUrut:1,totalBundle:2,
    waktuPackingSelesai:"09:00",tanggal:"2025-04-02",
  },
  {
    kodeBarcode:"PO0002-Nec-blck-s-0004-BDL02-10-03-25",
    po:"PO-0002",idKlien:"KLN-001",
    skuKlien:"ely330",skuInternal:"LYX-0011-KOU",
    namaArtikel:"Neck Black S",model:"Neck",size:"S",warna:"Black",
    qtyBundle:8,noUrut:2,totalBundle:2,
    waktuPackingSelesai:"09:15",tanggal:"2025-04-02",
  },
];

const initRiwayatSJ = [
  {
    noSJ:"SJ-0001",idKlien:"KLN-001",tanggal:"2025-03-20",
    totalBundle:4,totalQty:42,status:"Terkirim",
    detail:[
      {kodeBarcode:"PO0001-Air-blck-s-0001-BDL01-01-03-25",po:"PO-0001",skuKlien:"ely289",namaArtikel:"Airflow Black S",qtyBundle:6,noUrut:1},
      {kodeBarcode:"PO0001-Air-blck-s-0001-BDL02-01-03-25",po:"PO-0001",skuKlien:"ely289",namaArtikel:"Airflow Black S",qtyBundle:5,noUrut:2},
      {kodeBarcode:"PO0001-Air-blck-m-0002-BDL01-01-03-25",po:"PO-0001",skuKlien:"ely290",namaArtikel:"Airflow Black M",qtyBundle:6,noUrut:1},
      {kodeBarcode:"PO0001-Air-blck-m-0002-BDL02-01-03-25",po:"PO-0001",skuKlien:"ely290",namaArtikel:"Airflow Black M",qtyBundle:6,noUrut:2},
    ],
  },
];

function genNoSJ(arr) {
  const nums=arr.map(x=>parseInt(x.noSJ.replace("SJ-","")||0));
  return `SJ-${String(Math.max(0,...nums)+1).padStart(4,"0")}`;
}

function formatTanggal(tgl) {
  return new Date(tgl).toLocaleDateString("id-ID",{day:"numeric",month:"short",year:"numeric"});
}

// ── MODAL DETAIL SURAT JALAN ──────────────────────────────────────────────────
function ModalDetailSJ({sj,onClose,onPrint}) {
  const klien=MASTER_KLIEN.find(k=>k.id===sj.idKlien);
  const grouped={};
  sj.detail.forEach(d=>{
    if(!grouped[d.skuKlien]) grouped[d.skuKlien]={namaArtikel:d.namaArtikel,skuKlien:d.skuKlien,po:d.po,bundles:[]};
    grouped[d.skuKlien].bundles.push(d);
  });

  function handlePrint() {
    const rows = Object.values(grouped).map(g=>`
      <tr>
        <td>${g.po}</td>
        <td>${g.skuKlien}</td>
        <td><strong>${g.namaArtikel}</strong></td>
        <td style="text-align:center">${g.bundles.length}</td>
        <td style="text-align:center"><strong>${g.bundles.reduce((s,b)=>s+b.qtyBundle,0)}</strong></td>
      </tr>`).join("");

    const html=`<!DOCTYPE html><html><head><meta charset="utf-8">
    <style>
      body{font-family:Arial,sans-serif;padding:24px;font-size:12px}
      .header{display:flex;justify-content:space-between;margin-bottom:16px}
      .title{font-size:18px;font-weight:700;margin-bottom:4px}
      .sub{color:#666;font-size:11px}
      .info{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px;padding:12px;border:1px solid #ddd;border-radius:4px}
      .info-item{font-size:11px}
      .info-label{color:#888;margin-bottom:2px}
      .info-value{font-weight:700}
      table{width:100%;border-collapse:collapse;margin-bottom:16px}
      th{background:#f5f5f5;padding:8px;text-align:left;border:1px solid #ddd;font-size:11px}
      td{padding:8px;border:1px solid #eee;font-size:11px}
      .footer{display:grid;grid-template-columns:1fr 1fr 1fr;gap:20px;margin-top:24px;font-size:11px}
      .sign{border-top:1px solid #999;padding-top:8px;text-align:center;color:#666}
      .total{font-weight:700;background:#f9f9f9}
    </style></head><body>
    <div class="header">
      <div><div class="title">SURAT JALAN</div><div class="sub">STITCHLYX.SYNCORE — Garment Operating System</div></div>
      <div style="text-align:right"><div style="font-size:16px;font-weight:700;color:#333">${sj.noSJ}</div><div class="sub">Tanggal: ${formatTanggal(sj.tanggal)}</div></div>
    </div>
    <div class="info">
      <div class="info-item"><div class="info-label">Kepada Yth.</div><div class="info-value">${klien?.nama||sj.idKlien}</div></div>
      <div class="info-item"><div class="info-label">Total Bundle</div><div class="info-value">${sj.totalBundle} bundle</div></div>
      <div class="info-item"><div class="info-label">Total QTY</div><div class="info-value">${sj.totalQty} pcs</div></div>
      <div class="info-item"><div class="info-label">Status</div><div class="info-value">${sj.status}</div></div>
    </div>
    <table>
      <thead><tr><th>Kode PO</th><th>SKU Klien</th><th>Nama Artikel</th><th style="text-align:center">Bundle</th><th style="text-align:center">QTY</th></tr></thead>
      <tbody>
        ${rows}
        <tr class="total"><td colspan="3" style="text-align:right;padding-right:12px">TOTAL</td><td style="text-align:center">${sj.totalBundle}</td><td style="text-align:center">${sj.totalQty}</td></tr>
      </tbody>
    </table>
    <div class="footer">
      <div><div class="sign">Pengirim<br/><br/>( _______________ )</div></div>
      <div><div class="sign">Pengemudi<br/><br/>( _______________ )</div></div>
      <div><div class="sign">Penerima<br/><br/>( _______________ )</div></div>
    </div>
    </body></html>`;

    const w=window.open("","_blank","width=900,height=600");
    w.document.write(html);w.document.close();
    w.onload=()=>{w.focus();w.print();};
  }

  return (
    <div style={{position:"fixed",inset:0,background:"#000000cc",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{background:C.card,border:`1px solid ${C.cyan}44`,borderRadius:16,width:"100%",maxWidth:680,maxHeight:"85vh",display:"flex",flexDirection:"column"}}>
        <div style={{padding:"14px 20px",borderBottom:`1px solid ${C.border}`,background:C.card2,display:"flex",alignItems:"center",justifyContent:"space-between",borderRadius:"16px 16px 0 0"}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <MacDots/>
            <span style={{fontSize:13,fontWeight:700,color:C.cyan,fontFamily:C.sans}}>DETAIL — {sj.noSJ}</span>
          </div>
          <div style={{display:"flex",gap:8}}>
            <BtnKirim small onClick={handlePrint} color="cyan" outline>🖨 PRINT ULANG</BtnKirim>
            <button onClick={onClose} style={{background:"transparent",border:`1px solid ${C.border}`,borderRadius:6,color:C.textSub,cursor:"pointer",fontSize:16,width:28,height:28,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
          </div>
        </div>

        <div style={{overflowY:"auto",padding:"16px 20px"}}>
          {/* Info SJ */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:16}}>
            {[
              {label:"No Surat Jalan",value:sj.noSJ,color:C.cyan},
              {label:"Klien",value:klien?.nama||sj.idKlien,color:C.text},
              {label:"Tanggal",value:formatTanggal(sj.tanggal),color:C.textSub},
              {label:"Status",value:sj.status,color:sj.status==="Terkirim"?C.green:C.yellow},
            ].map(k=>(
              <div key={k.label} style={{background:"#050e1f",borderRadius:8,padding:"10px 12px",border:`1px solid ${C.border}`}}>
                <div style={{fontSize:8,color:C.textSub,fontFamily:C.sans,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:3}}>{k.label}</div>
                <div style={{fontSize:12,fontWeight:700,color:k.color,fontFamily:C.mono}}>{k.value}</div>
              </div>
            ))}
          </div>

          {/* Detail per artikel */}
          {Object.values(grouped).map(g=>(
            <div key={g.skuKlien} style={{marginBottom:12,background:"#050e1f",borderRadius:10,border:`1px solid ${C.border}`,overflow:"hidden"}}>
              <div style={{padding:"8px 14px",background:C.card2,borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:11,fontWeight:700,color:C.text,fontFamily:C.sans}}>{g.namaArtikel}</span>
                <div style={{display:"flex",gap:12}}>
                  <span style={{fontSize:9,color:C.textSub,fontFamily:C.mono}}>{g.skuKlien}</span>
                  <span style={{fontSize:9,color:C.cyan,fontFamily:C.mono}}>{g.po}</span>
                </div>
              </div>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse"}}>
                  <thead><tr style={{background:"#0e204055"}}>
                    {["Kode Barcode","Bundle","QTY"].map(h=>(
                      <th key={h} style={{padding:"7px 12px",textAlign:h==="QTY"?"center":"left",fontSize:9,fontWeight:700,color:C.textSub,textTransform:"uppercase",letterSpacing:"0.07em",fontFamily:C.sans}}>{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {g.bundles.map((b,i)=>(
                      <tr key={b.kodeBarcode} style={{borderBottom:`1px solid ${C.border}`,background:i%2===0?C.card:"#050e1f"}}>
                        <td style={{padding:"8px 12px"}}><span style={{fontSize:9,fontFamily:C.mono,color:C.cyan}}>{b.kodeBarcode}</span></td>
                        <td style={{padding:"8px 12px"}}><span style={{fontFamily:C.mono,fontSize:10,color:C.textSub}}>BDL{String(b.noUrut).padStart(2,"0")}</span></td>
                        <td style={{padding:"8px 12px",textAlign:"center"}}><span style={{fontFamily:C.mono,fontWeight:700,fontSize:12,color:C.green}}>{b.qtyBundle} pcs</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{padding:"7px 14px",borderTop:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",fontSize:9}}>
                <span style={{color:C.textSub,fontFamily:C.sans}}>{g.bundles.length} bundle</span>
                <span style={{color:C.green,fontFamily:C.mono,fontWeight:700}}>{g.bundles.reduce((s,b)=>s+b.qtyBundle,0)} pcs</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{padding:"12px 20px",borderTop:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontSize:10,color:C.textSub,fontFamily:C.mono}}>{sj.totalBundle} bundle · {sj.totalQty} pcs total</span>
          <BtnKirim onClick={onClose} outline>TUTUP</BtnKirim>
        </div>
      </div>
    </div>
  );
}

// ── BUAT SURAT JALAN ──────────────────────────────────────────────────────────
function BuatSuratJalan({riwayatSJ,onSimpan}) {
  const [poolSiapKirim,setPoolSiapKirim] = useState([...initPoolSiapKirim]);
  const [filterKlien,setFilterKlien]     = useState("");
  const [barcode,setBarcode]             = useState("");
  const [barisSJ,setBarisSJ]             = useState([]); // bundle yang sudah ditambah ke SJ
  const [scanError,setScanError]         = useState("");
  const [scanSuccess,setScanSuccess]     = useState("");
  const [showDrop,setShowDrop]           = useState(false);
  const inputRef = useRef(null);

  const noSJ = genNoSJ(riwayatSJ);

  const poolFiltered = poolSiapKirim.filter(b=>
    (!filterKlien||b.idKlien===filterKlien) &&
    !barisSJ.find(x=>x.kodeBarcode===b.kodeBarcode)
  );

  const suggestions = barcode.trim().length>=2
    ? poolFiltered.filter(b=>b.kodeBarcode.toLowerCase().includes(barcode.trim().toLowerCase())).slice(0,6)
    : [];

  function highlight(text,query) {
    if(!query) return text;
    const idx=text.toLowerCase().indexOf(query.toLowerCase());
    if(idx<0) return text;
    return <>{text.slice(0,idx)}<span style={{color:C.cyan,fontWeight:800}}>{text.slice(idx,idx+query.length)}</span>{text.slice(idx+query.length)}</>;
  }

  function handleScan() {
    const kode=barcode.trim();if(!kode) return;
    setBarcode("");setScanError("");setScanSuccess("");

    // Cek apakah sudah ada di SJ
    if(barisSJ.find(x=>x.kodeBarcode===kode)){
      setScanError(`Bundle ${kode} sudah ada di surat jalan ini.`);
      return;
    }

    // Cari di pool siap kirim
    const bundle = poolSiapKirim.find(b=>b.kodeBarcode===kode);
    if(!bundle){
      setScanError(`⚠ Barcode "${kode}" tidak ada di pool Siap Kirim. Bundle belum selesai Packing atau sudah dikirim.`);
      return;
    }

    // Cek klien cocok jika sudah ada filter
    if(filterKlien && bundle.idKlien!==filterKlien){
      const klienBundle=MASTER_KLIEN.find(k=>k.id===bundle.idKlien)?.nama||bundle.idKlien;
      const klienFilter=MASTER_KLIEN.find(k=>k.id===filterKlien)?.nama||filterKlien;
      setScanError(`⚠ Bundle ini milik ${klienBundle}, bukan ${klienFilter}. 1 surat jalan hanya untuk 1 klien.`);
      return;
    }

    // Auto-set klien dari bundle pertama
    if(!filterKlien) setFilterKlien(bundle.idKlien);

    setBarisSJ(b=>[...b,bundle]);
    setScanSuccess(`✓ ${bundle.namaArtikel} — BDL${String(bundle.noUrut).padStart(2,"0")} (${bundle.qtyBundle} pcs) ditambahkan.`);
    setTimeout(()=>setScanSuccess(""),3000);
    setShowDrop(false);
  }

  function hapusBaris(kode) {
    setBarisSJ(b=>b.filter(x=>x.kodeBarcode!==kode));
  }

  function handleSimpan() {
    if(barisSJ.length===0||!filterKlien) return;
    const totalQty=barisSJ.reduce((s,b)=>s+b.qtyBundle,0);
    const newSJ={
      noSJ,idKlien:filterKlien,
      tanggal:new Date().toISOString().split("T")[0],
      totalBundle:barisSJ.length,totalQty,
      status:"Terkirim",
      detail:barisSJ.map(b=>({kodeBarcode:b.kodeBarcode,po:b.po,skuKlien:b.skuKlien,namaArtikel:b.namaArtikel,qtyBundle:b.qtyBundle,noUrut:b.noUrut})),
    };
    // Hapus dari pool
    setPoolSiapKirim(p=>p.filter(b=>!barisSJ.find(x=>x.kodeBarcode===b.kodeBarcode)));
    onSimpan(newSJ);
  }

  function handlePrintSJ() {
    if(barisSJ.length===0) return;
    const totalQty=barisSJ.reduce((s,b)=>s+b.qtyBundle,0);
    const klien=MASTER_KLIEN.find(k=>k.id===filterKlien);
    const grouped={};
    barisSJ.forEach(b=>{
      if(!grouped[b.skuKlien]) grouped[b.skuKlien]={namaArtikel:b.namaArtikel,skuKlien:b.skuKlien,po:b.po,bundles:[]};
      grouped[b.skuKlien].bundles.push(b);
    });
    const rows=Object.values(grouped).map(g=>`
      <tr><td>${g.po}</td><td>${g.skuKlien}</td><td><strong>${g.namaArtikel}</strong></td>
      <td style="text-align:center">${g.bundles.length}</td>
      <td style="text-align:center"><strong>${g.bundles.reduce((s,b)=>s+b.qtyBundle,0)}</strong></td></tr>`).join("");
    const html=`<!DOCTYPE html><html><head><meta charset="utf-8">
    <style>body{font-family:Arial,sans-serif;padding:24px;font-size:12px}.header{display:flex;justify-content:space-between;margin-bottom:16px}.title{font-size:18px;font-weight:700;margin-bottom:4px}.sub{color:#666;font-size:11px}.info{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px;padding:12px;border:1px solid #ddd;border-radius:4px}.info-item{font-size:11px}.info-label{color:#888;margin-bottom:2px}.info-value{font-weight:700}table{width:100%;border-collapse:collapse;margin-bottom:16px}th{background:#f5f5f5;padding:8px;text-align:left;border:1px solid #ddd;font-size:11px}td{padding:8px;border:1px solid #eee;font-size:11px}.total{font-weight:700;background:#f9f9f9}.footer{display:grid;grid-template-columns:1fr 1fr 1fr;gap:20px;margin-top:24px;font-size:11px}.sign{border-top:1px solid #999;padding-top:8px;text-align:center;color:#666}</style></head><body>
    <div class="header"><div><div class="title">SURAT JALAN</div><div class="sub">STITCHLYX.SYNCORE — Garment Operating System</div></div><div style="text-align:right"><div style="font-size:16px;font-weight:700">${noSJ} (DRAFT)</div><div class="sub">Tanggal: ${new Date().toLocaleDateString("id-ID",{day:"numeric",month:"long",year:"numeric"})}</div></div></div>
    <div class="info"><div class="info-item"><div class="info-label">Kepada Yth.</div><div class="info-value">${klien?.nama||filterKlien}</div></div><div class="info-item"><div class="info-label">Total Bundle</div><div class="info-value">${barisSJ.length} bundle</div></div><div class="info-item"><div class="info-label">Total QTY</div><div class="info-value">${totalQty} pcs</div></div><div class="info-item"><div class="info-label">Status</div><div class="info-value">DRAFT</div></div></div>
    <table><thead><tr><th>Kode PO</th><th>SKU Klien</th><th>Nama Artikel</th><th style="text-align:center">Bundle</th><th style="text-align:center">QTY</th></tr></thead><tbody>${rows}<tr class="total"><td colspan="3" style="text-align:right;padding-right:12px">TOTAL</td><td style="text-align:center">${barisSJ.length}</td><td style="text-align:center">${totalQty}</td></tr></tbody></table>
    <div class="footer"><div><div class="sign">Pengirim<br/><br/>( _______________ )</div></div><div><div class="sign">Pengemudi<br/><br/>( _______________ )</div></div><div><div class="sign">Penerima<br/><br/>( _______________ )</div></div></div>
    </body></html>`;
    const w=window.open("","_blank","width=900,height=600");w.document.write(html);w.document.close();w.onload=()=>{w.focus();w.print();};
  }

  const totalQty=barisSJ.reduce((s,b)=>s+b.qtyBundle,0);
  const klienAktif=MASTER_KLIEN.find(k=>k.id===filterKlien);

  return (
    <div style={{display:"grid",gridTemplateColumns:"360px 1fr",gap:16}}>
      {/* KIRI — Input */}
      <div>
        {/* Info SJ */}
        <div style={{marginBottom:14,padding:"14px 16px",background:"#050e1f",borderRadius:10,border:`1px solid ${C.cyan}33`}}>
          <div style={{fontSize:9,color:C.textSub,fontFamily:C.sans,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:4}}>Nomor Surat Jalan (Auto)</div>
          <div style={{fontSize:22,fontWeight:800,color:C.cyan,fontFamily:C.syne}}>{noSJ}</div>
          <div style={{fontSize:9,color:C.textMid,fontFamily:C.mono,marginTop:4}}>{new Date().toLocaleDateString("id-ID",{day:"numeric",month:"long",year:"numeric"})}</div>
        </div>

        {/* Filter klien */}
        <Panel title="KLIEN" accent={filterKlien?C.green:C.border}>
          <div style={{padding:"12px"}}>
            {filterKlien?(
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 12px",background:`${C.green}10`,border:`1px solid ${C.green}44`,borderRadius:8}}>
                <div>
                  <div style={{fontSize:9,color:C.green,fontFamily:C.mono,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:2}}>KLIEN TERPILIH</div>
                  <div style={{fontSize:13,fontWeight:700,color:C.text,fontFamily:C.sans}}>{klienAktif?.nama}</div>
                </div>
                <button onClick={()=>{if(barisSJ.length===0){setFilterKlien("");}}} title="Hapus pilihan klien (hanya jika belum ada bundle)"
                  style={{background:"transparent",border:`1px solid ${C.border}`,borderRadius:5,color:C.textSub,cursor:"pointer",fontSize:12,width:24,height:24}}>×</button>
              </div>
            ):(
              <div style={{display:"flex",flexDirection:"column",gap:7}}>
                <div style={{fontSize:9,color:C.textSub,fontFamily:C.sans,marginBottom:4}}>Pilih klien, atau akan otomatis terisi dari bundle pertama yang di-scan.</div>
                {MASTER_KLIEN.map(k=>(
                  <div key={k.id} onClick={()=>setFilterKlien(k.id)}
                    style={{padding:"9px 12px",borderRadius:8,cursor:"pointer",background:"#050e1f",
                      border:`1px solid ${C.border2}`,fontSize:11,color:C.text,fontFamily:C.sans,
                      transition:"all 0.1s"}}
                    onMouseEnter={e=>e.currentTarget.style.borderColor=C.cyan+"66"}
                    onMouseLeave={e=>e.currentTarget.style.borderColor=C.border2}>
                    {k.nama}
                  </div>
                ))}
              </div>
            )}
          </div>
        </Panel>

        {/* Input scan */}
        <Panel title="SCAN BARCODE BUNDLE" accent={C.cyan}>
          <div style={{padding:"14px"}}>
            <div style={{position:"relative",marginBottom:10}}>
              <div style={{fontSize:9,color:C.textSub,fontFamily:C.sans,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:5}}>KODE BARCODE</div>
              <input ref={inputRef} value={barcode}
                onChange={e=>{setBarcode(e.target.value);setShowDrop(true);setScanError("");setScanSuccess("");}}
                onKeyDown={e=>{if(e.key==="Enter") handleScan(); if(e.key==="Escape") setShowDrop(false);}}
                onFocus={()=>setShowDrop(true)}
                onBlur={()=>setTimeout(()=>setShowDrop(false),150)}
                placeholder="Scan atau ketik kode barcode..."
                style={{width:"100%",background:"#050e1f",border:`1px solid ${C.cyanDim}`,
                  borderRadius:showDrop&&suggestions.length>0?"7px 7px 0 0":"7px",
                  padding:"9px 12px",fontSize:12,color:C.text,fontFamily:C.mono,outline:"none"}}/>

              {showDrop&&suggestions.length>0&&(
                <div style={{position:"absolute",top:"100%",left:0,right:0,zIndex:50,
                  background:"#070f1f",border:`1px solid ${C.cyan}44`,borderTop:"none",
                  borderRadius:"0 0 8px 8px",overflow:"hidden",boxShadow:"0 8px 24px #00000088"}}>
                  {suggestions.map((b,idx)=>(
                    <div key={b.kodeBarcode} onMouseDown={()=>{setBarcode(b.kodeBarcode);setShowDrop(false);setTimeout(()=>inputRef.current?.focus(),50);}}
                      style={{padding:"9px 12px",cursor:"pointer",borderBottom:`1px solid ${C.border}`,
                        background:idx===0?`${C.cyan}10`:"transparent"}}>
                      <div style={{fontSize:10,fontFamily:C.mono,fontWeight:700,color:C.cyan,marginBottom:3}}>
                        {highlight(b.kodeBarcode,barcode.trim())}
                      </div>
                      <div style={{display:"flex",gap:10,fontSize:9,color:C.textSub,fontFamily:C.sans}}>
                        <span>{b.po}</span>
                        <span>{b.namaArtikel}</span>
                        <span style={{marginLeft:"auto",color:C.green,fontFamily:C.mono,fontWeight:700}}>BDL{String(b.noUrut).padStart(2,"0")} · {b.qtyBundle} pcs</span>
                      </div>
                    </div>
                  ))}
                  <div style={{padding:"4px 10px",fontSize:8,color:C.textMid,fontFamily:C.sans,background:"#050e1f"}}>
                    {poolFiltered.length} bundle siap kirim{filterKlien?` untuk ${klienAktif?.nama}`:""}
                  </div>
                </div>
              )}

              {showDrop&&barcode.trim().length>=2&&suggestions.length===0&&(
                <div style={{position:"absolute",top:"100%",left:0,right:0,zIndex:50,padding:"10px 12px",background:"#070f1f",border:`1px solid ${C.border}`,borderTop:"none",borderRadius:"0 0 8px 8px",fontSize:10,color:C.red,fontFamily:C.sans}}>
                  ✗ Tidak ada bundle cocok di pool Siap Kirim
                </div>
              )}
            </div>

            <div style={{marginBottom:10,fontSize:9,color:C.textMid,fontFamily:C.sans}}>Tekan Enter untuk scan · hanya bundle selesai Packing yang bisa diproses</div>

            <BtnKirim onClick={handleScan} disabled={!barcode.trim()} color="cyan" full>📦 TAMBAH KE SURAT JALAN</BtnKirim>

            {scanError&&(
              <div style={{marginTop:10,padding:"9px 12px",background:"#1a0505",borderRadius:7,border:`1px solid ${C.red}44`,fontSize:10,color:C.red,fontFamily:C.sans,lineHeight:1.5}}>{scanError}</div>
            )}
            {scanSuccess&&(
              <div style={{marginTop:10,padding:"9px 12px",background:"#001a0f",borderRadius:7,border:`1px solid ${C.green}44`,fontSize:10,color:C.green,fontFamily:C.sans}}>{scanSuccess}</div>
            )}
          </div>
        </Panel>

        {/* Pool siap kirim */}
        <Panel title={`POOL SIAP KIRIM — ${poolFiltered.length} BUNDLE`} accent={C.orange}>
          <div style={{maxHeight:200,overflowY:"auto"}}>
            {poolFiltered.length===0?(
              <div style={{padding:"20px",textAlign:"center",fontSize:10,color:C.textMid,fontFamily:C.sans}}>
                {filterKlien?"Semua bundle klien ini sudah ditambahkan.":"Tidak ada bundle siap kirim."}
              </div>
            ):(
              poolFiltered.map((b,i)=>(
                <div key={b.kodeBarcode} onClick={()=>{setBarcode(b.kodeBarcode);handleScanWithBundle(b);}}
                  style={{padding:"9px 14px",borderBottom:`1px solid ${C.border}`,cursor:"pointer",
                    background:i%2===0?C.card:C.card2,display:"flex",justifyContent:"space-between",alignItems:"center"}}
                  onMouseEnter={e=>e.currentTarget.style.background=`${C.orange}08`}
                  onMouseLeave={e=>e.currentTarget.style.background=i%2===0?C.card:C.card2}>
                  <div>
                    <div style={{fontSize:10,fontFamily:C.mono,color:C.cyan,marginBottom:2}}>{b.kodeBarcode.split("-").slice(0,4).join("-")}...</div>
                    <div style={{fontSize:10,color:C.text,fontFamily:C.sans}}>{b.namaArtikel} · BDL{String(b.noUrut).padStart(2,"0")}</div>
                  </div>
                  <span style={{fontSize:11,fontWeight:700,color:C.green,fontFamily:C.mono}}>{b.qtyBundle} pcs</span>
                </div>
              ))
            )}
          </div>
        </Panel>
      </div>

      {/* KANAN — Isi Surat Jalan */}
      <div>
        <Panel title={`ISI SURAT JALAN — ${noSJ}`} accent={barisSJ.length>0?C.green:C.border}>
          {barisSJ.length===0?(
            <div style={{padding:"60px 20px",textAlign:"center"}}>
              <div style={{fontSize:32,marginBottom:12,opacity:0.3}}>📦</div>
              <div style={{fontSize:13,color:C.textMid,fontFamily:C.sans}}>Belum ada bundle.</div>
              <div style={{fontSize:10,color:C.textMid,fontFamily:C.sans,marginTop:4}}>Scan barcode bundle yang sudah selesai Packing.</div>
            </div>
          ):(
            <>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",minWidth:580}}>
                  <thead><tr style={{background:"#0e204055"}}>
                    {["No","Barcode","PO","SKU Klien","Artikel","Bundle","QTY","Hapus"].map(h=>(
                      <th key={h} style={{...TH_KIRIM,textAlign:["No","QTY","Bundle","Hapus"].includes(h)?"center":TH_KIRIM.textAlign}}>{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {barisSJ.map((b,i)=>(
                      <tr key={b.kodeBarcode} style={{borderBottom:`1px solid ${C.border}`}}>
                        <td style={{...TD_KIRIM(i),textAlign:"center"}}><span style={{fontFamily:C.mono,fontSize:10,color:C.textMid}}>{i+1}</span></td>
                        <td style={TD_KIRIM(i)}><span style={{fontFamily:C.mono,fontSize:9,color:C.cyan}}>{b.kodeBarcode.split("-").slice(0,4).join("-")}...</span></td>
                        <td style={TD_KIRIM(i)}><span style={{fontFamily:C.mono,fontWeight:700}}>{b.po}</span></td>
                        <td style={TD_KIRIM(i)}><span style={{fontFamily:C.mono,fontSize:10,color:C.textSub}}>{b.skuKlien}</span></td>
                        <td style={TD_KIRIM(i)}><span style={{fontWeight:600}}>{b.namaArtikel}</span></td>
                        <td style={{...TD_KIRIM(i),textAlign:"center"}}><span style={{fontFamily:C.mono,color:C.orange}}>BDL{String(b.noUrut).padStart(2,"0")}/{b.totalBundle}</span></td>
                        <td style={{...TD_KIRIM(i),textAlign:"center"}}><span style={{fontFamily:C.mono,fontWeight:700,fontSize:13,color:C.green}}>{b.qtyBundle}</span></td>
                        <td style={{...TD_KIRIM(i),textAlign:"center"}}>
                          <button onClick={()=>hapusBaris(b.kodeBarcode)}
                            style={{background:"transparent",border:`1px solid ${C.red}44`,borderRadius:5,color:C.red,cursor:"pointer",fontSize:13,width:26,height:26,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto"}}>×</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary */}
              <div style={{padding:"12px 18px",borderTop:`1px solid ${C.border}`,background:"#050e1f",display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:12}}>
                <div><div style={{fontSize:8,color:C.textSub,fontFamily:C.sans,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:2}}>Klien</div><div style={{fontSize:12,fontWeight:700,color:C.text,fontFamily:C.sans}}>{klienAktif?.nama||"—"}</div></div>
                <div><div style={{fontSize:8,color:C.textSub,fontFamily:C.sans,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:2}}>Total Bundle</div><div style={{fontSize:18,fontWeight:800,color:C.orange,fontFamily:C.syne}}>{barisSJ.length}</div></div>
                <div><div style={{fontSize:8,color:C.textSub,fontFamily:C.sans,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:2}}>Total QTY</div><div style={{fontSize:18,fontWeight:800,color:C.green,fontFamily:C.syne}}>{totalQty} <span style={{fontSize:10,fontWeight:400,color:C.textSub}}>pcs</span></div></div>
                <div><div style={{fontSize:8,color:C.textSub,fontFamily:C.sans,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:2}}>No SJ</div><div style={{fontSize:14,fontWeight:700,color:C.cyan,fontFamily:C.mono}}>{noSJ}</div></div>
              </div>

              {/* Tombol aksi */}
              <div style={{padding:"12px 18px",borderTop:`1px solid ${C.border}`,display:"flex",gap:10,justifyContent:"flex-end"}}>
                <BtnKirim onClick={handlePrintSJ} outline color="blue">🖨 PREVIEW & PRINT</BtnKirim>
                <BtnKirim onClick={handleSimpan} disabled={barisSJ.length===0||!filterKlien} color="green">
                  ✓ SIMPAN & KIRIM — {noSJ}
                </BtnKirim>
              </div>
            </>
          )}
        </Panel>
      </div>
    </div>
  );

  function handleScanWithBundle(b) {
    setScanError("");setScanSuccess("");
    if(barisSJ.find(x=>x.kodeBarcode===b.kodeBarcode)){
      setScanError(`Bundle ini sudah ada di surat jalan.`);return;
    }
    if(filterKlien && b.idKlien!==filterKlien){
      setScanError(`Bundle ini bukan milik klien yang dipilih.`);return;
    }
    if(!filterKlien) setFilterKlien(b.idKlien);
    setBarisSJ(prev=>[...prev,b]);
    setScanSuccess(`✓ ${b.namaArtikel} — BDL${String(b.noUrut).padStart(2,"0")} ditambahkan.`);
    setTimeout(()=>setScanSuccess(""),3000);
  }
}

// ── RIWAYAT KIRIM ─────────────────────────────────────────────────────────────
function RiwayatKirim({data}) {
  const [detailSJ,setDetailSJ] = useState(null);
  const [filterKlien,setFilterKlien] = useState("");

  const filtered = data.filter(sj=>!filterKlien||sj.idKlien===filterKlien);

  return (
    <div>
      {/* Filter */}
      <div style={{display:"flex",gap:8,marginBottom:14,alignItems:"center"}}>
        <span style={{fontSize:9,color:C.textSub,fontFamily:C.sans,textTransform:"uppercase",letterSpacing:"0.07em"}}>Filter Klien:</span>
        <button onClick={()=>setFilterKlien("")}
          style={{padding:"5px 12px",fontSize:9,fontWeight:700,fontFamily:C.mono,
            background:!filterKlien?C.cyan:"transparent",color:!filterKlien?"#000":C.textSub,
            border:`1px solid ${!filterKlien?C.cyan:C.border}`,borderRadius:6,cursor:"pointer"}}>SEMUA</button>
        {MASTER_KLIEN.map(k=>(
          <button key={k.id} onClick={()=>setFilterKlien(k.id)}
            style={{padding:"5px 12px",fontSize:9,fontWeight:700,fontFamily:C.mono,
              background:filterKlien===k.id?C.cyan:"transparent",color:filterKlien===k.id?"#000":C.textSub,
              border:`1px solid ${filterKlien===k.id?C.cyan:C.border}`,borderRadius:6,cursor:"pointer"}}>
            {k.nama}
          </button>
        ))}
        <span style={{marginLeft:"auto",fontSize:9,color:C.textMid,fontFamily:C.mono}}>{filtered.length} surat jalan</span>
      </div>

      <Panel title="RIWAYAT SURAT JALAN">
        {filtered.length===0?(
          <div style={{padding:"40px",textAlign:"center",color:C.textMid,fontFamily:C.sans,fontSize:12}}>Belum ada surat jalan.</div>
        ):(
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",minWidth:600}}>
              <thead><tr style={{background:"#0e204055"}}>
                {["No SJ","Klien","Tanggal","Bundle","Total QTY","Status","Aksi"].map(h=>(
                  <th key={h} style={{...TH_KIRIM,textAlign:h==="Aksi"?"center":TH_KIRIM.textAlign}}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {filtered.map((sj,i)=>{
                  const klien=MASTER_KLIEN.find(k=>k.id===sj.idKlien);
                  return (
                    <tr key={sj.noSJ} style={{borderBottom:`1px solid ${C.border}`}}>
                      <td style={TD_KIRIM(i)}><span style={{fontFamily:C.mono,fontWeight:700,color:C.cyan}}>{sj.noSJ}</span></td>
                      <td style={TD_KIRIM(i)}><span style={{fontWeight:600}}>{klien?.nama||sj.idKlien}</span></td>
                      <td style={TD_KIRIM(i)}><span style={{fontFamily:C.mono,fontSize:10,color:C.textSub}}>{formatTanggal(sj.tanggal)}</span></td>
                      <td style={TD_KIRIM(i)}><span style={{fontFamily:C.mono,fontWeight:700,color:C.orange}}>{sj.totalBundle} bundle</span></td>
                      <td style={TD_KIRIM(i)}><span style={{fontFamily:C.mono,fontWeight:700,color:C.green}}>{sj.totalQty} pcs</span></td>
                      <td style={TD_KIRIM(i)}>
                        <span style={{display:"inline-flex",alignItems:"center",gap:5,padding:"2px 8px",borderRadius:99,fontSize:9,fontWeight:700,fontFamily:C.mono,
                          background:sj.status==="Terkirim"?"#001a20":"#1a1a00",
                          color:sj.status==="Terkirim"?C.green:C.yellow,
                          border:`1px solid ${sj.status==="Terkirim"?C.green+"33":C.yellow+"33"}`}}>
                          <span style={{width:5,height:5,borderRadius:"50%",background:sj.status==="Terkirim"?C.green:C.yellow,display:"inline-block"}}/>
                          {sj.status}
                        </span>
                      </td>
                      <td style={{...TD_KIRIM(i),textAlign:"center"}}>
                        <BtnKirim small onClick={()=>setDetailSJ(sj)} outline>DETAIL →</BtnKirim>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        <div style={{padding:"10px 18px",borderTop:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between"}}>
          <span style={{fontSize:9,color:C.textMid,fontFamily:C.mono}}>
            Total terkirim: {filtered.reduce((s,sj)=>s+sj.totalQty,0)} pcs
          </span>
          <span style={{fontSize:9,color:C.textMid,fontFamily:C.mono}}>{filtered.length} SURAT JALAN</span>
        </div>
      </Panel>

      {detailSJ&&<ModalDetailSJ sj={detailSJ} onClose={()=>setDetailSJ(null)}/>}
    </div>
  );
}

// ── MAIN EXPORT ───────────────────────────────────────────────────────────────
function TabPengiriman({defaultTab="buat"}) {
  const [activeTab,setActiveTab] = useState(defaultTab);
  const [riwayatSJ,setRiwayatSJ] = useState(initRiwayatSJ);
  const [sukses,setSukses]        = useState(null);

  function handleSimpan(sj) {
    setRiwayatSJ(r=>[sj,...r]);
    setSukses(sj);
    setActiveTab("riwayat");
  }

  const TABS=[
    {id:"buat",    label:"Buat Surat Jalan", color:C.cyan},
    {id:"riwayat", label:"Riwayat Kirim",    color:C.green},
  ];

  return (
    <div>
      {/* Sub-tab */}
      <div style={{display:"flex",gap:6,marginBottom:20,paddingBottom:16,borderBottom:`1px solid ${C.border}`}}>
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>{setActiveTab(t.id);setSukses(null);}}
            style={{padding:"7px 16px",fontSize:10,fontWeight:700,fontFamily:C.mono,
              background:activeTab===t.id?`${t.color}22`:"transparent",
              color:activeTab===t.id?t.color:C.textSub,
              border:`1px solid ${activeTab===t.id?t.color+"55":C.border}`,
              borderRadius:8,cursor:"pointer",transition:"all 0.1s"}}>
            {t.label}
            {t.id==="riwayat"&&riwayatSJ.length>0&&(
              <span style={{marginLeft:6,fontSize:8,padding:"1px 6px",borderRadius:99,
                background:`${C.green}22`,color:C.green,fontFamily:C.mono}}>
                {riwayatSJ.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notif sukses */}
      {sukses&&activeTab==="riwayat"&&(
        <div style={{marginBottom:16,padding:"12px 18px",background:"#001a0f",borderRadius:10,
          border:`1px solid ${C.green}44`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <span style={{fontSize:11,fontWeight:700,color:C.green,fontFamily:C.sans}}>✓ Surat Jalan {sukses.noSJ} berhasil disimpan.</span>
            <div style={{fontSize:9,color:C.textSub,fontFamily:C.sans,marginTop:2}}>
              {MASTER_KLIEN.find(k=>k.id===sukses.idKlien)?.nama} · {sukses.totalBundle} bundle · {sukses.totalQty} pcs
            </div>
          </div>
          <button onClick={()=>setSukses(null)} style={{background:"transparent",border:"none",color:C.textSub,cursor:"pointer",fontSize:16}}>×</button>
        </div>
      )}

      {activeTab==="buat"&&<BuatSuratJalan riwayatSJ={riwayatSJ} onSimpan={handleSimpan}/>}
      {activeTab==="riwayat"&&<RiwayatKirim data={riwayatSJ}/>}
    </div>
  );
}






// --- TAB PENGGAJIAN (v2) ---





function BtnGaji({children,onClick,color="cyan",small=false,outline=false,disabled=false,full=false}) {
  const colMap={cyan:C.cyan,green:C.green,red:C.red,yellow:C.yellow,purple:C.purple,orange:C.orange,blue:C.blue};
  const col=colMap[color]||C.cyan;
  return (
    <button onClick={onClick} disabled={disabled}
      style={{padding:small?"5px 12px":"9px 20px",fontSize:small?9:11,fontWeight:700,fontFamily:C.mono,
        background:disabled?"#1a2030":outline?"transparent":col,
        color:disabled?C.textMid:outline?col:"#000",
        border:`1px solid ${disabled?"#1a2030":col}`,
        borderRadius:7,cursor:disabled?"not-allowed":"pointer",
        letterSpacing:"0.05em",whiteSpace:"nowrap",opacity:disabled?0.5:1,
        width:full?"100%":"auto"}}>
      {children}
    </button>
  );
}

const TH_GAJI={padding:"9px 14px",textAlign:"left",fontSize:9,fontWeight:700,
  color:C.textSub,textTransform:"uppercase",letterSpacing:"0.07em",fontFamily:C.sans,whiteSpace:"nowrap"};
const TD_GAJI=(i)=>({padding:"11px 14px",fontSize:11,color:C.text,fontFamily:C.sans,
  background:i%2===0?C.card:C.card2});

// ── POSISI BARANG REAL-TIME ───────────────────────────────────────────────────
const POSISI_BUNDLE = {
  "PO0001-Air-blck-s-0001-BDL01-01-03-25": "Jahit (sedang dikerjakan)",
  "PO0001-Air-blck-s-0001-BDL02-01-03-25": "Cutting (selesai)",
  "PO0001-Air-blck-m-0002-BDL01-01-03-25": "Lubang Kancing (sedang dikerjakan)",
  "PO0001-Air-blck-m-0002-BDL02-01-03-25": "Jahit (selesai)",
  "PO0001-Air-blck-l-0003-BDL01-01-03-25": "Packing (selesai) — Siap Kirim",
  "PO0001-Air-blck-l-0003-BDL02-01-03-25": "Packing (selesai) — Siap Kirim",
  "PO0002-Nec-blck-s-0004-BDL01-10-03-25": "QC (rework — menunggu)",
  "PO0002-Nec-blck-s-0004-BDL02-10-03-25": "Cutting (selesai)",
};

function getPosisiColor(posisi) {
  if(!posisi) return C.textMid;
  if(posisi.includes("Siap Kirim")) return C.cyan;
  if(posisi.includes("rework")) return C.orange;
  if(posisi.includes("sedang")) return C.blue;
  if(posisi.includes("selesai")) return C.green;
  return C.textSub;
}

// ── DUMMY DATA ─────────────────────────────────────────────────────────────────
const PERIODE_LIST = [
  {id:"P001",label:"01 Apr — 07 Apr 2025",dari:"2025-04-01",sampai:"2025-04-07"},
  {id:"P002",label:"08 Apr — 14 Apr 2025",dari:"2025-04-08",sampai:"2025-04-14"},
];

// Ledger gaji per karyawan — dari hasil scan SELESAI + rework
const initLedger = [
  // Budi Santoso
  {id:"L001",idKaryawan:"KRY-001",nama:"Budi Santoso",tipe:"borongan",periodeId:"P001",
   entri:[
     {kodeBarcode:"PO0001-Air-blck-s-0001-BDL01-01-03-25",po:"PO-0001",artikel:"Airflow Black S",tahap:"Cutting",qty:6,upahPerPcs:8000,total:48000,tipe:"selesai",waktu:"08:00",tanggal:"2025-04-01"},
     {kodeBarcode:"PO0001-Air-blck-s-0001-BDL01-01-03-25",po:"PO-0001",artikel:"Airflow Black S",tahap:"Jahit",qty:6,upahPerPcs:22000,total:132000,tipe:"selesai",waktu:"10:00",tanggal:"2025-04-01"},
     {kodeBarcode:"PO0001-Air-blck-m-0002-BDL01-01-03-25",po:"PO-0001",artikel:"Airflow Black M",tahap:"Jahit",qty:6,upahPerPcs:22000,total:132000,tipe:"selesai",waktu:"14:00",tanggal:"2025-04-01"},
     {kodeBarcode:"PO0001-Air-blck-s-0001-BDL01-01-03-25",po:"PO-0001",artikel:"Airflow Black S",tahap:"Jahit",qty:-1,upahPerPcs:22000,total:-22000,tipe:"reject_potong",jenisReject:"Jahitan Loncat",waktu:"10:30",tanggal:"2025-04-01"},
     {kodeBarcode:"PO0001-Air-blck-s-0001-BDL01-01-03-25",po:"PO-0001",artikel:"Airflow Black S",tahap:"Jahit",qty:1,upahPerPcs:22000,total:22000,tipe:"rework",waktu:"15:00",tanggal:"2025-04-02"},
   ],
   kasbon:150000,kasbonSisa:150000,lunas:false,
  },
  // Ahmad Fauzi
  {id:"L002",idKaryawan:"KRY-003",nama:"Ahmad Fauzi",tipe:"borongan",periodeId:"P001",
   entri:[
     {kodeBarcode:"PO0001-Air-blck-s-0001-BDL02-01-03-25",po:"PO-0001",artikel:"Airflow Black S",tahap:"Cutting",qty:5,upahPerPcs:8000,total:40000,tipe:"selesai",waktu:"08:05",tanggal:"2025-04-01"},
     {kodeBarcode:"PO0002-Nec-blck-s-0004-BDL01-10-03-25",po:"PO-0002",artikel:"Neck Black S",tahap:"Cutting",qty:9,upahPerPcs:6000,total:54000,tipe:"selesai",waktu:"08:00",tanggal:"2025-04-02"},
     {kodeBarcode:"PO0002-Nec-blck-s-0004-BDL02-10-03-25",po:"PO-0002",artikel:"Neck Black S",tahap:"Cutting",qty:8,upahPerPcs:6000,total:48000,tipe:"selesai",waktu:"08:05",tanggal:"2025-04-02"},
   ],
   kasbon:0,kasbonSisa:0,lunas:false,
  },
  // Siti Rahayu
  {id:"L003",idKaryawan:"KRY-002",nama:"Siti Rahayu",tipe:"borongan",periodeId:"P001",
   entri:[
     {kodeBarcode:"PO0001-Air-blck-m-0002-BDL01-01-03-25",po:"PO-0001",artikel:"Airflow Black M",tahap:"Lubang Kancing",qty:6,upahPerPcs:2000,total:12000,tipe:"selesai",waktu:"14:30",tanggal:"2025-04-01"},
     {kodeBarcode:"PO0001-Air-blck-m-0002-BDL02-01-03-25",po:"PO-0001",artikel:"Airflow Black M",tahap:"Buang Benang",qty:5,upahPerPcs:1500,total:7500,tipe:"selesai",waktu:"15:00",tanggal:"2025-04-01"},
   ],
   kasbon:75000,kasbonSisa:75000,lunas:false,
  },
  // Dewi Lestari
  {id:"L004",idKaryawan:"KRY-004",nama:"Dewi Lestari",tipe:"borongan",periodeId:"P001",
   entri:[
     {kodeBarcode:"PO0001-Air-blck-l-0003-BDL01-01-03-25",po:"PO-0001",artikel:"Airflow Black L",tahap:"Packing",qty:8,upahPerPcs:1000,total:8000,tipe:"selesai",waktu:"14:30",tanggal:"2025-04-01"},
     {kodeBarcode:"PO0001-Air-blck-l-0003-BDL02-01-03-25",po:"PO-0001",artikel:"Airflow Black L",tahap:"Steam",qty:7,upahPerPcs:1500,total:10500,tipe:"selesai",waktu:"14:00",tanggal:"2025-04-01"},
   ],
   kasbon:0,kasbonSisa:0,lunas:false,
  },
  // Karyawan tetap
  {id:"L005",idKaryawan:"KRY-006",nama:"Rudi Hartono",tipe:"tetap",periodeId:"P001",
   entri:[],upahTetap:750000,
   kasbon:200000,kasbonSisa:100000,lunas:false,
  },
];

const initKasbon = [
  {id:"KB001",idKaryawan:"KRY-001",nama:"Budi Santoso",jumlah:150000,tanggal:"2025-03-25",sisa:150000,status:"aktif",cicilan:[],keterangan:"Keperluan mendadak"},
  {id:"KB002",idKaryawan:"KRY-002",nama:"Siti Rahayu",jumlah:75000,tanggal:"2025-03-28",sisa:75000,status:"aktif",cicilan:[],keterangan:"Uang sekolah"},
  {id:"KB003",idKaryawan:"KRY-006",nama:"Rudi Hartono",jumlah:200000,tanggal:"2025-03-20",sisa:100000,status:"aktif",cicilan:[{tanggal:"2025-03-27",jumlah:100000,periodeId:"P000"}],keterangan:"Kebutuhan rumah"},
  {id:"KB004",idKaryawan:"KRY-003",nama:"Ahmad Fauzi",jumlah:50000,tanggal:"2025-02-10",sisa:0,status:"lunas",cicilan:[{tanggal:"2025-02-17",jumlah:50000,periodeId:"P-99"}],keterangan:""},
];

const initSlipHistory = [
  {id:"SL001",idKaryawan:"KRY-001",nama:"Budi Santoso",periodeId:"P000",periodeLabel:"25 Mar — 31 Mar 2025",
   totalUpah:285000,potonganKasbon:50000,bonus:0,totalBersih:235000,
   tanggalBayar:"2025-04-01",status:"lunas"},
];

// ── MODAL DETAIL GAJI ─────────────────────────────────────────────────────────
function ModalDetailGaji({ledger,onClose}) {
  const totalUpah = ledger.tipe==="tetap"
    ? (ledger.upahTetap||0)
    : ledger.entri.filter(e=>e.tipe==="selesai").reduce((s,e)=>s+e.total,0);
  const totalPotongan = ledger.entri.filter(e=>e.tipe==="reject_potong").reduce((s,e)=>s+Math.abs(e.total),0);
  const totalRework = ledger.entri.filter(e=>e.tipe==="rework").reduce((s,e)=>s+e.total,0);
  const subtotal = totalUpah - totalPotongan;
  const bersih = subtotal - (ledger.kasbonSisa||0);

  return (
    <div style={{position:"fixed",inset:0,background:"#000000cc",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{background:C.card,border:`1px solid ${C.purple}44`,borderRadius:16,width:"100%",maxWidth:760,maxHeight:"85vh",display:"flex",flexDirection:"column"}}>
        <div style={{padding:"14px 20px",borderBottom:`1px solid ${C.border}`,background:C.card2,display:"flex",alignItems:"center",justifyContent:"space-between",borderRadius:"16px 16px 0 0"}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <MacDots/>
            <span style={{fontSize:13,fontWeight:700,color:C.purple,fontFamily:C.sans}}>DETAIL GAJI — {ledger.nama}</span>
          </div>
          <button onClick={onClose} style={{background:"transparent",border:`1px solid ${C.border}`,borderRadius:6,color:C.textSub,cursor:"pointer",fontSize:16,width:28,height:28,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
        </div>

        <div style={{overflowY:"auto",padding:"16px 20px"}}>
          {/* Ringkasan */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:16}}>
            {[
              {label:"Total Upah",value:rp(totalUpah),color:C.green},
              {label:"Potongan Reject",value:`-${rp(totalPotongan)}`,color:C.red},
              {label:"Tambah Rework",value:`+${rp(totalRework)}`,color:C.orange},
              {label:"Kasbon Dipotong",value:`-${rp(ledger.kasbonSisa||0)}`,color:C.yellow},
            ].map(k=>(
              <div key={k.label} style={{background:"#050e1f",borderRadius:8,padding:"10px 12px",border:`1px solid ${C.border}`}}>
                <div style={{fontSize:8,color:C.textSub,fontFamily:C.sans,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:3}}>{k.label}</div>
                <div style={{fontSize:13,fontWeight:700,color:k.color,fontFamily:C.mono}}>{k.value}</div>
              </div>
            ))}
          </div>

          {/* Tabel entri */}
          {ledger.tipe==="borongan"&&(
            <div style={{marginBottom:16,background:"#050e1f",borderRadius:10,border:`1px solid ${C.border}`,overflow:"hidden"}}>
              <div style={{padding:"9px 14px",background:C.card2,borderBottom:`1px solid ${C.border}`}}>
                <span style={{fontSize:11,fontWeight:700,color:C.text,fontFamily:C.sans}}>Rincian Pekerjaan</span>
              </div>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse"}}>
                  <thead><tr style={{background:"#0e204055"}}>
                    {["Tanggal","Waktu","Barcode","Artikel","Tahap","QTY","Upah/pcs","Total","Posisi Sekarang","Keterangan"].map(h=>(
                      <th key={h} style={{padding:"7px 10px",textAlign:"left",fontSize:9,fontWeight:700,color:C.textSub,textTransform:"uppercase",letterSpacing:"0.06em",fontFamily:C.sans,whiteSpace:"nowrap"}}>{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {ledger.entri.map((e,i)=>{
                      const posisi=POSISI_BUNDLE[e.kodeBarcode];
                      const isPotongan=e.tipe==="reject_potong";
                      const isRework=e.tipe==="rework";
                      return (
                        <tr key={i} style={{borderBottom:`1px solid ${C.border}`,
                          background:isPotongan?`${C.red}08`:isRework?`${C.orange}08`:i%2===0?C.card:"#050e1f"}}>
                          <td style={{padding:"8px 10px",fontFamily:C.mono,fontSize:9,color:C.textSub,whiteSpace:"nowrap"}}>{e.tanggal}</td>
                          <td style={{padding:"8px 10px",fontFamily:C.mono,fontSize:9,color:C.textSub}}>{e.waktu}</td>
                          <td style={{padding:"8px 10px"}}><span style={{fontFamily:C.mono,fontSize:8,color:C.cyan}}>{e.kodeBarcode.split("-").slice(0,3).join("-")}...</span></td>
                          <td style={{padding:"8px 10px",fontSize:10,color:C.text,fontFamily:C.sans,whiteSpace:"nowrap"}}>{e.artikel}</td>
                          <td style={{padding:"8px 10px"}}><span style={{fontSize:9,fontFamily:C.mono,color:C.blue}}>{e.tahap}</span></td>
                          <td style={{padding:"8px 10px",textAlign:"center"}}>
                            <span style={{fontFamily:C.mono,fontWeight:700,fontSize:12,color:isPotongan?C.red:isRework?C.orange:C.green}}>
                              {isPotongan?e.qty:`+${e.qty}`}
                            </span>
                          </td>
                          <td style={{padding:"8px 10px",textAlign:"right"}}><span style={{fontFamily:C.mono,fontSize:10,color:C.textSub}}>{rp(e.upahPerPcs)}</span></td>
                          <td style={{padding:"8px 10px",textAlign:"right"}}>
                            <span style={{fontFamily:C.mono,fontWeight:700,fontSize:11,color:isPotongan?C.red:isRework?C.orange:C.green}}>
                              {isPotongan?`-${rp(Math.abs(e.total))}`:rp(e.total)}
                            </span>
                          </td>
                          <td style={{padding:"8px 10px"}}>
                            <span style={{fontSize:9,color:getPosisiColor(posisi),fontFamily:C.sans}}>{posisi||"—"}</span>
                          </td>
                          <td style={{padding:"8px 10px"}}>
                            {isPotongan&&<span style={{fontSize:8,padding:"1px 6px",borderRadius:3,background:`${C.red}15`,color:C.red,fontFamily:C.mono}}>POTONG — {e.jenisReject}</span>}
                            {isRework&&<span style={{fontSize:8,padding:"1px 6px",borderRadius:3,background:`${C.orange}15`,color:C.orange,fontFamily:C.mono}}>REWORK +{rp(e.total)}</span>}
                            {e.tipe==="selesai"&&e.terkunci&&<span style={{fontSize:8,padding:"1px 6px",borderRadius:3,background:`${C.textMid}15`,color:C.textMid,fontFamily:C.mono,marginLeft:4}}>🔒 LUNAS</span>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Total bersih */}
          <div style={{padding:"14px 18px",background:"#050e1f",borderRadius:10,border:`1px solid ${C.green}33`,
            display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontSize:9,color:C.textSub,fontFamily:C.sans,marginBottom:4}}>Subtotal ({rp(totalUpah)} - potongan {rp(totalPotongan)})</div>
              <div style={{fontSize:9,color:C.textSub,fontFamily:C.sans}}>Kasbon dipotong: -{rp(ledger.kasbonSisa||0)}</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:9,color:C.textSub,fontFamily:C.sans,marginBottom:2}}>TOTAL BERSIH</div>
              <div style={{fontSize:22,fontWeight:800,color:C.green,fontFamily:C.syne}}>{rp(bersih)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


// ── MODAL KONFIRMASI KASBON ────────────────────────────────────────────────────
function ModalKonfirmasiKasbon({ledger,onConfirm,onCancel}) {
  const [potongan,setPotongan] = useState(String(ledger.kasbonSisa||0));
  const maxPotong = ledger.kasbonSisa||0;
  const pot = Number(potongan.replace(/\D/g,""))||0;
  const upahModal = ledger.tipe==="tetap"?(ledger.upahTetap||0):ledger.entri.filter(e=>e.tipe==="selesai").reduce((s,e)=>s+e.total,0);
  const potonganReject = ledger.entri.filter(e=>e.tipe==="reject_potong").reduce((s,e)=>s+Math.abs(e.total),0);
  const reworkModal = ledger.entri.filter(e=>e.tipe==="rework").reduce((s,e)=>s+e.total,0);
  const upahBersih = upahModal - potonganReject + reworkModal;
  const bersih = upahBersih - pot;

  return (
    <div style={{position:"fixed",inset:0,background:"#000000cc",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{background:C.card,border:`1px solid ${C.yellow}55`,borderRadius:14,padding:"24px",width:420,maxWidth:"92vw"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}><MacDots/><span style={{fontSize:12,fontWeight:700,color:C.yellow,fontFamily:C.sans}}>KONFIRMASI PEMBAYARAN GAJI</span></div>
        <div style={{padding:"10px 14px",background:"#050e1f",borderRadius:8,border:`1px solid ${C.border}`,marginBottom:14}}>
          <div style={{fontSize:11,fontWeight:700,color:C.text,fontFamily:C.sans,marginBottom:8}}>{ledger.nama}</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,fontSize:10,marginBottom:8}}>
            <div><span style={{color:C.textMid}}>Upah Kotor: </span><span style={{color:C.green,fontFamily:C.mono,fontWeight:700}}>{rp(upahModal)}</span></div>
            <div><span style={{color:C.textMid}}>Potongan Reject: </span><span style={{color:C.red,fontFamily:C.mono,fontWeight:700}}>{potonganReject>0?`-${rp(potonganReject)}`:"—"}</span></div>
            {reworkModal>0&&<div><span style={{color:C.textMid}}>Rework Tambah: </span><span style={{color:C.orange,fontFamily:C.mono,fontWeight:700}}>+{rp(reworkModal)}</span></div>}
            <div style={{gridColumn:reworkModal>0?"1":"1/3"}}><span style={{color:C.textMid}}>Sisa Kasbon: </span><span style={{color:C.yellow,fontFamily:C.mono,fontWeight:700}}>{rp(maxPotong)}</span></div>
          </div>
          <div style={{padding:"8px 12px",background:"#001a0f",borderRadius:7,border:`1px solid ${C.green}33`,marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontSize:10,color:C.textSub,fontFamily:C.sans}}>Upah Bersih (sebelum kasbon)</span>
            <span style={{fontSize:16,fontWeight:800,color:C.green,fontFamily:C.syne}}>{rp(upahBersih)}</span>
          </div>
        </div>
        <div style={{marginBottom:14}}>
          <div style={{fontSize:9,color:C.textSub,fontFamily:C.sans,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:5}}>
            Potongan Kasbon (ubah jika perlu) <span style={{color:C.red}}>*</span>
          </div>
          <div style={{display:"flex"}}>
            <span style={{padding:"7px 9px",background:C.border,borderRadius:"6px 0 0 6px",fontSize:11,color:C.textSub,fontFamily:C.mono,border:`1px solid ${C.border2}`,borderRight:"none"}}>Rp</span>
            <input value={potongan} onChange={e=>setPotongan(e.target.value.replace(/\D/g,""))}
              style={{flex:1,background:"#050e1f",border:`1px solid ${pot>maxPotong?C.red+"66":C.yellow+"44"}`,borderRadius:"0 6px 6px 0",padding:"7px 10px",fontSize:14,color:C.yellow,fontFamily:C.mono,outline:"none",fontWeight:700}}/>
          </div>
          <div style={{fontSize:9,color:C.textMid,fontFamily:C.sans,marginTop:3}}>Maks: {rp(maxPotong)} · Boleh 0 jika tidak dipotong periode ini</div>
          {pot>maxPotong&&<div style={{fontSize:9,color:C.red,fontFamily:C.sans,marginTop:3}}>⚠ Melebihi sisa kasbon ({rp(maxPotong)})</div>}
        </div>
        <div style={{padding:"10px 14px",background:bersih>=0?"#001a0f":"#1a0505",borderRadius:8,border:`1px solid ${bersih>=0?C.green:C.red}33`,marginBottom:14,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontSize:10,color:C.textSub,fontFamily:C.sans}}>Yang Dibayarkan (Upah Bersih - Kasbon)</span>
          <span style={{fontSize:20,fontWeight:800,color:bersih>=0?C.green:C.red,fontFamily:C.syne}}>{rp(Math.max(0,bersih))}</span>
        </div>
        <div style={{display:"flex",gap:8}}>
          <BtnGaji onClick={onCancel} outline full>BATAL</BtnGaji>
          <BtnGaji onClick={()=>pot<=maxPotong&&onConfirm(pot)} disabled={pot>maxPotong} color="green" full>✓ KONFIRMASI & BAYAR</BtnGaji>
        </div>
      </div>
    </div>
  );
}

// ── REKAP GAJI ────────────────────────────────────────────────────────────────
function RekapGaji() {
  // ── semua useState wajib di atas ──
  const [ledger,setLedger]           = useState(initLedger);
  const [periode,setPeriode]         = useState("P001");
  const [detailLedger,setDetailLedger] = useState(null);
  const [konfirmasiAll,setKonfirmasiAll] = useState(false);
  const [slipHistory,setSlipHistory] = useState(initSlipHistory);
  const [modalKasbon,setModalKasbon] = useState(null);

  const filtered    = ledger.filter(l=>l.periodeId===periode);
  const periodeInfo = PERIODE_LIST.find(p=>p.id===periode);

  function hitungGaji(l) {
    if(l.tipe==="tetap") return {upah:l.upahTetap||0,potongan:0,rework:0};
    const upah    = l.entri.filter(e=>e.tipe==="selesai").reduce((s,e)=>s+e.total,0);
    const potongan= l.entri.filter(e=>e.tipe==="reject_potong").reduce((s,e)=>s+Math.abs(e.total),0);
    const rework  = l.entri.filter(e=>e.tipe==="rework").reduce((s,e)=>s+e.total,0);
    return {upah,potongan,rework};
  }

  function prosessBayar(l, potonganKasbon) {
    const {upah,potongan,rework} = hitungGaji(l);
    const bersih = upah - potongan + rework - potonganKasbon;
    const slip = {
      id:`SL${Date.now()}`,idKaryawan:l.idKaryawan,nama:l.nama,
      periodeId:l.periodeId,periodeLabel:periodeInfo?.label||l.periodeId,
      totalUpah:upah,potonganKasbon,bonus:0,totalBersih:bersih,
      tanggalBayar:new Date().toISOString().split("T")[0],status:"lunas",
    };
    setSlipHistory(sh=>[slip,...sh]);
    setLedger(d=>d.map(x=>x.id===l.id?{...x,lunas:true,kasbonSisa:Math.max(0,(x.kasbonSisa||0)-potonganKasbon)}:x));
  }

  function bayarKaryawan(l) {
    if((l.kasbonSisa||0)>0) {
      setModalKasbon(l);
    } else {
      prosessBayar(l,0);
    }
  }

  function bayarSemua() {
    const pending = filtered.filter(l=>!l.lunas);
    const adaKasbon = pending.some(l=>(l.kasbonSisa||0)>0);
    if(adaKasbon) {
      alert("Beberapa karyawan memiliki kasbon. Proses pembayaran satu per satu untuk menentukan potongan kasbon.");
      setKonfirmasiAll(false);
      return;
    }
    pending.forEach(l=>prosessBayar(l,0));
    setKonfirmasiAll(false);
  }

  const totalUpahPeriode = filtered.reduce((s,l)=>{
    const {upah,potongan,rework}=hitungGaji(l);
    const bersihAwal = upah-potongan+rework;
    const slip = l.lunas ? slipHistory.find(sh=>sh.idKaryawan===l.idKaryawan && sh.periodeId===l.periodeId) : null;
    return s + (slip ? slip.totalBersih : bersihAwal);
  }, 0);
  const belumLunas = filtered.filter(l=>!l.lunas).length;

  return (
    <div>
      {/* Pilih periode + summary */}
      <div style={{display:"flex",gap:12,marginBottom:16,flexWrap:"wrap",alignItems:"flex-start"}}>
        <div style={{flex:1}}>
          <div style={{fontSize:9,color:C.textSub,fontFamily:C.sans,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:6}}>Periode Penggajian</div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {PERIODE_LIST.map(p=>(
              <button key={p.id} onClick={()=>setPeriode(p.id)}
                style={{padding:"8px 16px",fontSize:10,fontWeight:700,fontFamily:C.mono,
                  background:periode===p.id?C.purple:"transparent",
                  color:periode===p.id?"#000":C.textSub,
                  border:`1px solid ${periode===p.id?C.purple:C.border}`,
                  borderRadius:8,cursor:"pointer"}}>
                {p.label}
              </button>
            ))}
          </div>
        </div>
        <div style={{display:"flex",gap:10,alignItems:"flex-end"}}>
          {belumLunas>0&&!konfirmasiAll&&(
            <BtnGaji onClick={()=>setKonfirmasiAll(true)} color="green">💰 BAYAR SEMUA ({belumLunas})</BtnGaji>
          )}
          {konfirmasiAll&&(
            <div style={{display:"flex",gap:8,alignItems:"center",padding:"8px 14px",background:`${C.green}10`,border:`1px solid ${C.green}44`,borderRadius:8}}>
              <span style={{fontSize:10,color:C.green,fontFamily:C.sans}}>Bayar semua {belumLunas} karyawan?</span>
              <BtnGaji small onClick={bayarSemua} color="green">YA, BAYAR</BtnGaji>
              <BtnGaji small onClick={()=>setKonfirmasiAll(false)} outline>BATAL</BtnGaji>
            </div>
          )}
        </div>
      </div>

      {/* KPI */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:16}}>
        {[
          {label:"Total Karyawan",value:filtered.length,color:C.cyan},
          {label:"Sudah Lunas",value:filtered.filter(l=>l.lunas).length,color:C.green},
          {label:"Belum Lunas",value:belumLunas,color:belumLunas>0?C.red:C.textMid},
          {label:"Total Upah Bersih",value:rp(totalUpahPeriode),color:C.green},
        ].map(k=>(
          <div key={k.label} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 16px",borderLeft:`3px solid ${k.color}`}}>
            <div style={{fontSize:8,color:C.textSub,fontFamily:C.sans,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:3}}>{k.label}</div>
            <div style={{fontSize:k.label==="Total Upah Bersih"?14:22,fontWeight:800,color:k.color,fontFamily:C.syne,lineHeight:1}}>{k.value}</div>
          </div>
        ))}
      </div>

      <Panel title={`REKAP GAJI — ${periodeInfo?.label||periode}`} accent={C.purple}>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",minWidth:700}}>
            <thead><tr style={{background:"#0e204055"}}>
              {["Karyawan","Tipe","Upah Kotor","Potongan Reject","Rework Tambah","Upah Bersih","Kasbon","Status","Aksi"].map(h=>(
                <th key={h} style={{...TH_GAJI,textAlign:["Upah Kotor","Potongan Reject","Rework Tambah","Upah Bersih","Kasbon","Aksi"].includes(h)?"center":TH_GAJI.textAlign}}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filtered.map((l,i)=>{
                const {upah,potongan,rework}=hitungGaji(l);
                const bersihAwal=upah-potongan+rework;
                const slip = l.lunas ? slipHistory.find(s=>s.idKaryawan===l.idKaryawan && s.periodeId===l.periodeId) : null;
                const bersih = slip ? slip.totalBersih : bersihAwal;
                return (
                  <tr key={l.id} style={{borderBottom:`1px solid ${C.border}`,background:l.lunas?`${C.green}05`:i%2===0?C.card:C.card2}}>
                    <td style={TD_GAJI(i)}>
                      <div style={{fontWeight:700,fontSize:12}}>{l.nama}</div>
                      <div style={{fontSize:9,color:C.textSub,fontFamily:C.mono,marginTop:1}}>{l.idKaryawan}</div>
                    </td>
                    <td style={TD_GAJI(i)}>
                      <span style={{fontSize:9,padding:"2px 8px",borderRadius:99,fontFamily:C.mono,fontWeight:700,
                        background:l.tipe==="borongan"?`${C.orange}18`:`${C.blue}18`,
                        color:l.tipe==="borongan"?C.orange:C.blue}}>
                        {l.tipe==="borongan"?"BORONGAN":"TETAP"}
                      </span>
                    </td>
                    <td style={{...TD_GAJI(i),textAlign:"center"}}>
                      <span style={{fontFamily:C.mono,fontWeight:700,color:C.green}}>{rp(upah)}</span>
                    </td>
                    <td style={{...TD_GAJI(i),textAlign:"center"}}>
                      {potongan>0
                        ?<span style={{fontFamily:C.mono,fontWeight:700,color:C.red}}>-{rp(potongan)}</span>
                        :<span style={{color:C.textMid,fontFamily:C.mono}}>—</span>}
                    </td>
                    <td style={{...TD_GAJI(i),textAlign:"center"}}>
                      {rework>0
                        ?<span style={{fontFamily:C.mono,fontWeight:700,color:C.orange}}>+{rp(rework)}</span>
                        :<span style={{color:C.textMid,fontFamily:C.mono}}>—</span>}
                    </td>
                    <td style={{...TD_GAJI(i),textAlign:"center"}}>
                      <span style={{fontFamily:C.mono,fontWeight:800,fontSize:13,color:C.green}}>{rp(bersih)}</span>
                    </td>
                    <td style={{...TD_GAJI(i),textAlign:"center"}}>
                      {(l.kasbonSisa||0)>0
                        ?<span style={{fontFamily:C.mono,fontWeight:700,color:C.yellow}}>{rp(l.kasbonSisa)}</span>
                        :<span style={{color:C.textMid,fontFamily:C.mono}}>—</span>}
                    </td>
                    <td style={TD_GAJI(i)}>
                      <span style={{display:"inline-flex",alignItems:"center",gap:5,padding:"2px 8px",borderRadius:99,fontSize:9,fontWeight:700,fontFamily:C.mono,
                        background:l.lunas?"#001a20":"#1a1040",
                        color:l.lunas?C.green:C.purple,
                        border:`1px solid ${l.lunas?C.green+"33":C.purple+"33"}`}}>
                        <span style={{width:5,height:5,borderRadius:"50%",background:l.lunas?C.green:C.purple,display:"inline-block"}}/>
                        {l.lunas?"LUNAS":"BELUM"}
                      </span>
                    </td>
                    <td style={{...TD_GAJI(i),textAlign:"center"}}>
                      <div style={{display:"flex",gap:6,justifyContent:"center"}}>
                        <BtnGaji small onClick={()=>setDetailLedger(l)} outline>DETAIL</BtnGaji>
                        {!l.lunas&&<BtnGaji small onClick={()=>bayarKaryawan(l)} color="green">BAYAR</BtnGaji>}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{padding:"10px 18px",borderTop:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between"}}>
          <span style={{fontSize:9,color:C.textMid,fontFamily:C.mono}}>{filtered.filter(l=>l.lunas).length}/{filtered.length} karyawan lunas</span>
          <span style={{fontSize:9,color:C.green,fontFamily:C.mono,fontWeight:700}}>Total: {rp(totalUpahPeriode)}</span>
        </div>
      </Panel>

      {detailLedger&&<ModalDetailGaji ledger={detailLedger} onClose={()=>setDetailLedger(null)}/>}
      {modalKasbon&&<ModalKonfirmasiKasbon ledger={modalKasbon} onConfirm={(pot)=>{prosessBayar(modalKasbon,pot);setModalKasbon(null);}} onCancel={()=>setModalKasbon(null)}/>}
    </div>
  );
}

// ── KASBON ────────────────────────────────────────────────────────────────────
function Kasbon() {
  const [data,setData] = useState(initKasbon);
  const [showForm,setShowForm] = useState(false);
  const [form,setForm] = useState({idKaryawan:"",nama:"",jumlah:"",keterangan:""});
  const [detailKasbon,setDetailKasbon] = useState(null);

  const KARYAWAN_LIST = [
    {id:"KRY-001",nama:"Budi Santoso"},{id:"KRY-002",nama:"Siti Rahayu"},
    {id:"KRY-003",nama:"Ahmad Fauzi"},{id:"KRY-004",nama:"Dewi Lestari"},
    {id:"KRY-006",nama:"Rudi Hartono"},
  ];

  function tambahKasbon(){
    if(!form.idKaryawan||!form.jumlah) return;
    const jumlah=Number(form.jumlah.replace(/\D/g,""));
    if(jumlah<=0) return;
    setData(d=>[{
      id:`KB${Date.now()}`,idKaryawan:form.idKaryawan,
      nama:KARYAWAN_LIST.find(k=>k.id===form.idKaryawan)?.nama||"",
      jumlah,tanggal:new Date().toISOString().split("T")[0],
      sisa:jumlah,status:"aktif",cicilan:[],keterangan:form.keterangan,
    },...d]);
    setForm({idKaryawan:"",nama:"",jumlah:"",keterangan:""});
    setShowForm(false);
  }

  const totalKasbon=data.filter(k=>k.status==="aktif").reduce((s,k)=>s+k.sisa,0);

  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:16}}>
        {[
          {label:"Total Kasbon Aktif",value:rp(totalKasbon),color:C.yellow},
          {label:"Karyawan Berkasbon",value:data.filter(k=>k.status==="aktif").length,color:C.orange},
          {label:"Kasbon Lunas",value:data.filter(k=>k.status==="lunas").length,color:C.green},
        ].map(k=>(
          <div key={k.label} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 16px",borderLeft:`3px solid ${k.color}`}}>
            <div style={{fontSize:8,color:C.textSub,fontFamily:C.sans,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:3}}>{k.label}</div>
            <div style={{fontSize:k.label==="Total Kasbon Aktif"?16:22,fontWeight:800,color:k.color,fontFamily:C.syne}}>{k.value}</div>
          </div>
        ))}
      </div>

      <Panel title="DAFTAR KASBON" action="+ TAMBAH KASBON" onAction={()=>setShowForm(!showForm)}>
        {showForm&&(
          <div style={{padding:"16px 20px",borderBottom:`1px solid ${C.border}`,background:"#050e1f"}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:12,marginBottom:12}}>
              <div>
                <div style={{fontSize:9,color:C.textSub,fontFamily:C.sans,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:5}}>Karyawan <span style={{color:C.red}}>*</span></div>
                <select value={form.idKaryawan} onChange={e=>setForm(f=>({...f,idKaryawan:e.target.value}))}
                  style={{width:"100%",background:"#070f1f",border:`1px solid ${C.border2}`,borderRadius:6,padding:"7px 10px",fontSize:11,color:form.idKaryawan?C.text:C.textMid,fontFamily:C.sans,outline:"none"}}>
                  <option value="">-- Pilih Karyawan --</option>
                  {KARYAWAN_LIST.map(k=><option key={k.id} value={k.id}>{k.nama}</option>)}
                </select>
              </div>
              <div>
                <div style={{fontSize:9,color:C.textSub,fontFamily:C.sans,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:5}}>Jumlah <span style={{color:C.red}}>*</span></div>
                <div style={{display:"flex"}}>
                  <span style={{padding:"7px 9px",background:C.border,borderRadius:"6px 0 0 6px",fontSize:11,color:C.textSub,fontFamily:C.mono,border:`1px solid ${C.border2}`,borderRight:"none"}}>Rp</span>
                  <input value={form.jumlah} onChange={e=>setForm(f=>({...f,jumlah:e.target.value.replace(/\D/g,"")}))}
                    placeholder="0" style={{flex:1,background:"#070f1f",border:`1px solid ${C.border2}`,borderRadius:"0 6px 6px 0",padding:"7px 10px",fontSize:11,color:C.text,fontFamily:C.mono,outline:"none"}}/>
                </div>
              </div>
              <div>
                <div style={{fontSize:9,color:C.textSub,fontFamily:C.sans,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:5}}>Keterangan</div>
                <input value={form.keterangan} onChange={e=>setForm(f=>({...f,keterangan:e.target.value}))}
                  placeholder="Keperluan..."
                  style={{width:"100%",background:"#070f1f",border:`1px solid ${C.border2}`,borderRadius:6,padding:"7px 10px",fontSize:11,color:C.text,fontFamily:C.sans,outline:"none"}}/>
              </div>
              <div style={{display:"flex",alignItems:"flex-end",gap:8}}>
                <BtnGaji onClick={tambahKasbon} disabled={!form.idKaryawan||!form.jumlah} color="green" full>SIMPAN</BtnGaji>
                <BtnGaji onClick={()=>setShowForm(false)} outline small>✕</BtnGaji>
              </div>
            </div>
          </div>
        )}

        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",minWidth:600}}>
            <thead><tr style={{background:"#0e204055"}}>
              {["Karyawan","Tanggal","Jumlah","Sisa","Keterangan","Status","Aksi"].map(h=>(
                <th key={h} style={{...TH_GAJI,textAlign:["Jumlah","Sisa","Aksi"].includes(h)?"center":TH_GAJI.textAlign}}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {data.map((kb,i)=>(
                <tr key={kb.id} style={{borderBottom:`1px solid ${C.border}`}}>
                  <td style={TD_GAJI(i)}><span style={{fontWeight:600}}>{kb.nama}</span></td>
                  <td style={TD_GAJI(i)}><span style={{fontFamily:C.mono,fontSize:10,color:C.textSub}}>{kb.tanggal}</span></td>
                  <td style={{...TD_GAJI(i),textAlign:"center"}}><span style={{fontFamily:C.mono,fontWeight:700,color:C.yellow}}>{rp(kb.jumlah)}</span></td>
                  <td style={{...TD_GAJI(i),textAlign:"center"}}><span style={{fontFamily:C.mono,fontWeight:700,color:kb.sisa>0?C.orange:C.green}}>{rp(kb.sisa)}</span></td>
                  <td style={{...TD_GAJI(i),color:C.textSub,fontSize:10}}>{kb.keterangan||"—"}</td>
                  <td style={TD_GAJI(i)}>
                    <span style={{fontSize:9,padding:"2px 8px",borderRadius:99,fontFamily:C.mono,fontWeight:700,
                      background:kb.status==="lunas"?"#001a20":"#1a1500",
                      color:kb.status==="lunas"?C.green:C.yellow,
                      border:`1px solid ${kb.status==="lunas"?C.green+"33":C.yellow+"33"}`}}>
                      {kb.status==="lunas"?"✓ LUNAS":"AKTIF"}
                    </span>
                  </td>
                  <td style={{...TD_GAJI(i),textAlign:"center"}}>
                    <BtnGaji small onClick={()=>setDetailKasbon(kb)} outline>DETAIL</BtnGaji>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{padding:"10px 18px",borderTop:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between"}}>
          <span style={{fontSize:9,color:C.textMid,fontFamily:C.mono}}>Kasbon dipotong otomatis saat penggajian</span>
          <span style={{fontSize:9,color:C.yellow,fontFamily:C.mono,fontWeight:700}}>Total sisa: {rp(totalKasbon)}</span>
        </div>
      </Panel>

      {/* Modal detail kasbon */}
      {detailKasbon&&(
        <div style={{position:"fixed",inset:0,background:"#000000cc",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
          <div style={{background:C.card,border:`1px solid ${C.yellow}44`,borderRadius:14,padding:"24px",width:480,maxWidth:"92vw"}}>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}><MacDots/><span style={{fontSize:12,fontWeight:700,color:C.yellow,fontFamily:C.sans}}>DETAIL KASBON — {detailKasbon.nama}</span></div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:16}}>
              {[{label:"Total Kasbon",value:rp(detailKasbon.jumlah),color:C.yellow},{label:"Sisa",value:rp(detailKasbon.sisa),color:detailKasbon.sisa>0?C.orange:C.green},{label:"Terbayar",value:rp(detailKasbon.jumlah-detailKasbon.sisa),color:C.green}].map(k=>(
                <div key={k.label} style={{background:"#050e1f",borderRadius:8,padding:"10px 12px",border:`1px solid ${C.border}`}}>
                  <div style={{fontSize:8,color:C.textSub,fontFamily:C.sans,marginBottom:3}}>{k.label}</div>
                  <div style={{fontSize:14,fontWeight:700,color:k.color,fontFamily:C.mono}}>{k.value}</div>
                </div>
              ))}
            </div>
            {detailKasbon.cicilan.length>0&&(
              <div style={{marginBottom:16}}>
                <div style={{fontSize:9,color:C.textSub,fontFamily:C.sans,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:8}}>Riwayat Cicilan</div>
                {detailKasbon.cicilan.map((c,i)=>(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"7px 10px",background:"#050e1f",borderRadius:6,marginBottom:4,border:`1px solid ${C.border}`}}>
                    <span style={{fontSize:10,color:C.textSub,fontFamily:C.mono}}>{c.tanggal}</span>
                    <span style={{fontSize:11,fontWeight:700,color:C.green,fontFamily:C.mono}}>{rp(c.jumlah)}</span>
                  </div>
                ))}
              </div>
            )}
            <div style={{padding:"8px 10px",background:C.cyanBg,borderRadius:6,border:`1px solid ${C.cyanDim}`,fontSize:9,color:C.cyan,fontFamily:C.sans,marginBottom:14}}>
              ℹ Cicilan dipotong otomatis saat proses penggajian. Hanya Owner yang bisa mengubah.
            </div>
            <BtnGaji onClick={()=>setDetailKasbon(null)} outline full>TUTUP</BtnGaji>
          </div>
        </div>
      )}
    </div>
  );
}

// ── SLIP GAJI ─────────────────────────────────────────────────────────────────
function SlipGaji() {
  const [data] = useState(initSlipHistory);
  const [detailSlip,setDetailSlip] = useState(null);
  const [filterKaryawan,setFilterKaryawan] = useState("");

  const filtered = data.filter(s=>!filterKaryawan||s.idKaryawan===filterKaryawan);

  function printSlip(slip) {
    const html=`<!DOCTYPE html><html><head><meta charset="utf-8">
    <style>body{font-family:Arial,sans-serif;padding:24px;font-size:12px;max-width:400px;margin:0 auto}.title{font-size:16px;font-weight:700;text-align:center;margin-bottom:4px}.sub{text-align:center;color:#666;font-size:10px;margin-bottom:16px}.divider{border-top:1px dashed #999;margin:10px 0}.row{display:flex;justify-content:space-between;padding:4px 0;font-size:11px}.row.total{font-weight:700;font-size:13px;border-top:2px solid #333;margin-top:8px;padding-top:8px}.label{color:#666}.value{font-weight:600}.ttd{display:flex;justify-content:space-between;margin-top:24px;font-size:10px;text-align:center}</style></head><body>
    <div class="title">SLIP GAJI KARYAWAN</div>
    <div class="sub">STITCHLYX.SYNCORE · ${slip.periodeLabel}</div>
    <div class="divider"></div>
    <div class="row"><span class="label">Nama</span><span class="value">${slip.nama}</span></div>
    <div class="row"><span class="label">ID Karyawan</span><span class="value">${slip.idKaryawan}</span></div>
    <div class="row"><span class="label">Tanggal Bayar</span><span class="value">${slip.tanggalBayar}</span></div>
    <div class="divider"></div>
    <div class="row"><span class="label">Total Upah Kotor</span><span class="value">Rp ${slip.totalUpah.toLocaleString("id-ID")}</span></div>
    <div class="row"><span class="label">Potongan Kasbon</span><span class="value">- Rp ${slip.potonganKasbon.toLocaleString("id-ID")}</span></div>
    <div class="row"><span class="label">Bonus</span><span class="value">+ Rp ${(slip.bonus||0).toLocaleString("id-ID")}</span></div>
    <div class="row total"><span>TOTAL DITERIMA</span><span>Rp ${slip.totalBersih.toLocaleString("id-ID")}</span></div>
    <div class="divider"></div>
    <div class="ttd"><div>Karyawan<br/><br/>( _______________ )<br/>${slip.nama}</div><div>Owner<br/><br/>( _______________ )<br/>STITCHLYX</div></div>
    </body></html>`;
    const w=window.open("","_blank","width=500,height=700");
    w.document.write(html);w.document.close();w.onload=()=>{w.focus();w.print();};
  }

  return (
    <div>
      {/* Filter */}
      <div style={{display:"flex",gap:8,marginBottom:14,alignItems:"center",flexWrap:"wrap"}}>
        <span style={{fontSize:9,color:C.textSub,fontFamily:C.sans,textTransform:"uppercase",letterSpacing:"0.07em"}}>Filter:</span>
        <button onClick={()=>setFilterKaryawan("")}
          style={{padding:"5px 12px",fontSize:9,fontWeight:700,fontFamily:C.mono,
            background:!filterKaryawan?C.cyan:"transparent",color:!filterKaryawan?"#000":C.textSub,
            border:`1px solid ${!filterKaryawan?C.cyan:C.border}`,borderRadius:6,cursor:"pointer"}}>SEMUA</button>
        {["KRY-001","KRY-002","KRY-003","KRY-004","KRY-006"].map(id=>{
          const nama=initLedger.find(l=>l.idKaryawan===id)?.nama||id;
          return (
            <button key={id} onClick={()=>setFilterKaryawan(id)}
              style={{padding:"5px 12px",fontSize:9,fontWeight:700,fontFamily:C.mono,
                background:filterKaryawan===id?C.cyan:"transparent",color:filterKaryawan===id?"#000":C.textSub,
                border:`1px solid ${filterKaryawan===id?C.cyan:C.border}`,borderRadius:6,cursor:"pointer"}}>
              {nama}
            </button>
          );
        })}
      </div>

      <Panel title="HISTORY SLIP GAJI">
        {filtered.length===0?(
          <div style={{padding:"40px",textAlign:"center",color:C.textMid,fontFamily:C.sans,fontSize:12}}>
            Belum ada slip gaji yang dibayarkan.
          </div>
        ):(
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",minWidth:620}}>
              <thead><tr style={{background:"#0e204055"}}>
                {["Karyawan","Periode","Tgl Bayar","Upah Kotor","Kasbon","Bonus","Total Bersih","Status","Aksi"].map(h=>(
                  <th key={h} style={{...TH_GAJI,textAlign:["Upah Kotor","Kasbon","Bonus","Total Bersih","Aksi"].includes(h)?"center":TH_GAJI.textAlign}}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {filtered.map((slip,i)=>(
                  <tr key={slip.id} style={{borderBottom:`1px solid ${C.border}`}}>
                    <td style={TD_GAJI(i)}><span style={{fontWeight:600}}>{slip.nama}</span></td>
                    <td style={TD_GAJI(i)}><span style={{fontSize:10,color:C.textSub,fontFamily:C.sans}}>{slip.periodeLabel}</span></td>
                    <td style={TD_GAJI(i)}><span style={{fontFamily:C.mono,fontSize:10,color:C.textSub}}>{slip.tanggalBayar}</span></td>
                    <td style={{...TD_GAJI(i),textAlign:"center"}}><span style={{fontFamily:C.mono,fontWeight:700,color:C.green}}>{rp(slip.totalUpah)}</span></td>
                    <td style={{...TD_GAJI(i),textAlign:"center"}}>{slip.potonganKasbon>0?<span style={{fontFamily:C.mono,color:C.yellow}}>-{rp(slip.potonganKasbon)}</span>:<span style={{color:C.textMid}}>—</span>}</td>
                    <td style={{...TD_GAJI(i),textAlign:"center"}}>{(slip.bonus||0)>0?<span style={{fontFamily:C.mono,color:C.cyan}}>+{rp(slip.bonus)}</span>:<span style={{color:C.textMid}}>—</span>}</td>
                    <td style={{...TD_GAJI(i),textAlign:"center"}}><span style={{fontFamily:C.mono,fontWeight:800,fontSize:13,color:C.green}}>{rp(slip.totalBersih)}</span></td>
                    <td style={TD_GAJI(i)}>
                      <span style={{fontSize:9,padding:"2px 8px",borderRadius:99,fontFamily:C.mono,fontWeight:700,background:"#001a20",color:C.green,border:`1px solid ${C.green}33`}}>✓ LUNAS</span>
                    </td>
                    <td style={{...TD_GAJI(i),textAlign:"center"}}>
                      <div style={{display:"flex",gap:6,justifyContent:"center"}}>
                        <BtnGaji small onClick={()=>setDetailSlip(slip)} outline>DETAIL</BtnGaji>
                        <BtnGaji small onClick={()=>printSlip(slip)} color="cyan" outline>🖨 PRINT</BtnGaji>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div style={{padding:"10px 18px",borderTop:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between"}}>
          <span style={{fontSize:9,color:C.textMid,fontFamily:C.mono}}>Slip bisa di-print ulang kapan saja</span>
          <span style={{fontSize:9,color:C.textMid,fontFamily:C.mono}}>{filtered.length} SLIP</span>
        </div>
      </Panel>

      {/* Modal detail slip */}
      {detailSlip&&(
        <div style={{position:"fixed",inset:0,background:"#000000cc",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
          <div style={{background:C.card,border:`1px solid ${C.cyan}44`,borderRadius:16,padding:"24px",width:480,maxWidth:"92vw"}}>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}><MacDots/><span style={{fontSize:12,fontWeight:700,color:C.cyan,fontFamily:C.sans}}>DETAIL SLIP — {detailSlip.nama}</span></div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
              {[{label:"Periode",value:detailSlip.periodeLabel,color:C.text},{label:"Tanggal Bayar",value:detailSlip.tanggalBayar,color:C.textSub},{label:"Total Upah",value:rp(detailSlip.totalUpah),color:C.green},{label:"Potongan Kasbon",value:`-${rp(detailSlip.potonganKasbon)}`,color:C.yellow},{label:"Bonus",value:`+${rp(detailSlip.bonus||0)}`,color:C.cyan},{label:"Total Bersih",value:rp(detailSlip.totalBersih),color:C.green}].map(k=>(
                <div key={k.label} style={{background:"#050e1f",borderRadius:8,padding:"10px 12px",border:`1px solid ${C.border}`}}>
                  <div style={{fontSize:8,color:C.textSub,fontFamily:C.sans,marginBottom:3}}>{k.label}</div>
                  <div style={{fontSize:13,fontWeight:700,color:k.color,fontFamily:C.mono}}>{k.value}</div>
                </div>
              ))}
            </div>
            <div style={{display:"flex",gap:8}}>
              <BtnGaji onClick={()=>setDetailSlip(null)} outline full>TUTUP</BtnGaji>
              <BtnGaji onClick={()=>printSlip(detailSlip)} color="cyan" full>🖨 PRINT SLIP</BtnGaji>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- TAB INVENTORY DATA ---
const initInventory = [
  {id:"INV-001",nama:"Kain Airflow",satuan:"METER",stok:450,minimum:100,hargaSatuan:30000,keterangan:"Kain utama Airflow"},
  {id:"INV-002",nama:"Kain Neck",satuan:"METER",stok:280,minimum:80,hargaSatuan:25000,keterangan:"Kain utama Neck"},
  {id:"INV-003",nama:"Benang Hitam",satuan:"KG",stok:12,minimum:5,hargaSatuan:45000,keterangan:"Benang jahit hitam"},
  {id:"INV-004",nama:"Kancing",satuan:"PCS",stok:2400,minimum:500,hargaSatuan:250,keterangan:"Kancing baju standar"},
  {id:"INV-005",nama:"Label Merek",satuan:"PCS",stok:800,minimum:200,hargaSatuan:150,keterangan:"Label STITCHLYX"},
  {id:"INV-006",nama:"Plastik Pack",satuan:"PCS",stok:350,minimum:100,hargaSatuan:200,keterangan:"Plastik packing"},
  {id:"INV-007",nama:"Benang Putih",satuan:"KG",stok:3,minimum:5,hargaSatuan:45000,keterangan:"Benang jahit putih"},
  {id:"INV-008",nama:"Resleting",satuan:"PCS",stok:45,minimum:100,hargaSatuan:3500,keterangan:"Resleting jaket"},
];

const initTrxKeluar = [
  {id:"TK001",idInventory:"INV-001",namaItem:"Kain Airflow",qty:200,satuan:"METER",tanggal:"2025-04-01",keterangan:"Pemakaian cutting PO-0001",idPO:"PO-0001"},
  {id:"TK002",idInventory:"INV-002",namaItem:"Kain Neck",qty:150,satuan:"METER",tanggal:"2025-04-03",keterangan:"Pemakaian cutting PO-0002",idPO:"PO-0002"},
  {id:"TK003",idInventory:"INV-004",namaItem:"Kancing",qty:600,satuan:"PCS",tanggal:"2025-04-04",keterangan:"Pemakaian LK PO-0001",idPO:"PO-0001"},
  {id:"TK004",idInventory:"INV-003",namaItem:"Benang Hitam",qty:3,satuan:"KG",tanggal:"2025-04-05",keterangan:"Pemakaian jahit PO-0001 & PO-0002",idPO:null},
  {id:"TK005",idInventory:"INV-005",namaItem:"Label Merek",qty:200,satuan:"PCS",tanggal:"2025-04-06",keterangan:"Pemakaian packing PO-0001",idPO:"PO-0001"},
];

const initTrxMasuk = [
  {id:"TM001",idInventory:"INV-001",namaItem:"Kain Airflow",qty:200,satuan:"METER",tanggal:"2025-04-01",keterangan:"Beli kain airflow 200 meter",idPO:"PO-0001",jumlah:6000000},
  {id:"TM002",idInventory:"INV-002",namaItem:"Kain Neck",qty:150,satuan:"METER",tanggal:"2025-04-03",keterangan:"Beli kain neck 150 meter",idPO:"PO-0002",jumlah:3750000},
];

const TH_PROD = {padding:"9px 14px",textAlign:"left",fontSize:9,fontWeight:700,color:C.textSub,textTransform:"uppercase",letterSpacing:"0.07em",fontFamily:C.sans,whiteSpace:"nowrap"};
const TD_PROD = (i) => ({padding:"10px 14px",fontSize:11,color:C.text,fontFamily:C.sans});

// --- TAB KEUANGAN DATA ---
const KATEGORI_TRX = [
  {id:"KTR-001",nama:"Pembelian Bahan Baku",tipe:"keluar",tambahStok:true},
  {id:"KTR-002",nama:"Upah Karyawan",tipe:"keluar",tambahStok:false},
  {id:"KTR-003",nama:"Operasional Listrik",tipe:"keluar",tambahStok:false},
  {id:"KTR-004",nama:"Operasional Rumah",tipe:"keluar",tambahStok:false},
  {id:"KTR-005",nama:"Penerimaan PO",tipe:"masuk",tambahStok:false},
  {id:"KTR-006",nama:"Uang Makan",tipe:"keluar",tambahStok:false},
  {id:"KTR-007",nama:"Pembelian Aksesori",tipe:"keluar",tambahStok:true},
  {id:"KTR-008",nama:"Pinjaman",tipe:"masuk",tambahStok:false},
];

const PO_LIST_KEU = [
  {kode:"PO-0001",klien:"PT. Elysian Garment",model:"Airflow",totalOrder:163,totalHargaJual:29540000,hpp:21800000},
  {kode:"PO-0002",klien:"PT. Elysian Garment",model:"Neck",totalOrder:144,totalHargaJual:23760000,hpp:17600000},
  {kode:"PO-0003",klien:"CV. Maju Bersama",model:"Storma",totalOrder:96,totalHargaJual:17280000,hpp:12800000},
];

const initJurnal = [
  {id:"J001",tanggal:"2025-04-01",idKategori:"KTR-005",keterangan:"Pembayaran DP PO-0001 dari PT. Elysian",idPO:"PO-0001",jumlah:14770000,tipe:"masuk",tambahStok:false,namaKategori:"Penerimaan PO"},
  {id:"J002",tanggal:"2025-04-01",idKategori:"KTR-001",keterangan:"Beli kain airflow 200 meter",idPO:"PO-0001",jumlah:6000000,tipe:"keluar",tambahStok:true,namaKategori:"Pembelian Bahan Baku",namaItem:"Kain Airflow",qty:200,satuan:"METER",hargaSatuan:30000},
  {id:"J003",tanggal:"2025-04-02",idKategori:"KTR-003",keterangan:"Tagihan listrik April",idPO:null,jumlah:850000,tipe:"keluar",tambahStok:false,namaKategori:"Operasional Listrik"},
  {id:"J007",tanggal:"2025-04-05",idKategori:"KTR-005",keterangan:"Pelunasan PO-0002",idPO:"PO-0002",jumlah:23760000,tipe:"masuk",tambahStok:false,namaKategori:"Penerimaan PO"},
];

const TABS_GAJI=[
  {id:"rekap",  label:"Rekap Gaji",  color:C.purple},
  {id:"kasbon", label:"Kasbon",      color:C.yellow},
  {id:"slip",   label:"Slip Gaji",   color:C.cyan},
];

function TabPenggajian({defaultTab="rekap"}) {
  const [activeTab,setActiveTab] = useState(defaultTab);
  return (
    <div>
      <div style={{marginBottom:14}}>
        <div style={{fontSize:10,color:C.textSub,fontFamily:C.mono,letterSpacing:"0.07em"}}>
          PENGGAJIAN / {TABS_GAJI.find(t=>t.id===activeTab)?.label.toUpperCase()}
        </div>
      </div>
      {activeTab==="rekap"  && <RekapGaji/>}
      {activeTab==="kasbon" && <Kasbon/>}
      {activeTab==="slip"   && <SlipGaji/>}
    </div>
  );
}




function genIdTrx(prefix,arr) {
  const nums=arr.map(x=>parseInt(x.id.replace(prefix,""))||0);
  return `${prefix}${String(Math.max(0,...nums)+1).padStart(3,"0")}`;
}

// ── OVERVIEW STOK ─────────────────────────────────────────────────────────────
function OverviewStok({inventory,setInventory}) {
  const [editId,setEditId] = useState(null);
  const [editVal,setEditVal] = useState({});
  const [showAdd,setShowAdd] = useState(false);
  const [newItem,setNewItem] = useState({nama:"",satuan:"",stok:"",minimum:"",hargaSatuan:"",keterangan:""});

  const alertItems = inventory.filter(i=>i.stok<=i.minimum);
  const totalNilai = inventory.reduce((s,i)=>s+(i.stok*i.hargaSatuan),0);

  function startEdit(item) {
    setEditId(item.id);
    setEditVal({minimum:item.minimum,hargaSatuan:item.hargaSatuan,keterangan:item.keterangan});
  }
  function saveEdit() {
    setInventory(inv=>inv.map(i=>i.id===editId?{...i,...editVal,minimum:Number(editVal.minimum),hargaSatuan:Number(editVal.hargaSatuan)}:i));
    setEditId(null);
  }
  function addItem() {
    if(!newItem.nama||!newItem.satuan||!newItem.stok) return;
    setInventory(inv=>[...inv,{
      id:genIdTrx("INV-",inv),nama:newItem.nama,satuan:newItem.satuan,
      stok:Number(newItem.stok),minimum:Number(newItem.minimum)||0,
      hargaSatuan:Number(newItem.hargaSatuan)||0,keterangan:newItem.keterangan,
    }]);
    setNewItem({nama:"",satuan:"",stok:"",minimum:"",hargaSatuan:"",keterangan:""});
    setShowAdd(false);
  }

  const inputStyle={background:"#050e1f",border:`1px solid ${C.cyanDim}`,borderRadius:6,
    padding:"5px 8px",fontSize:11,color:C.text,fontFamily:C.mono,outline:"none",width:"100%"};

  function StokBar({stok,minimum}) {
    if(minimum<=0) return null;
    const pct = Math.min(100,Math.round((stok/minimum)*100));
    const col = stok<=minimum?C.red:stok<=minimum*1.5?C.yellow:C.green;
    return (
      <div style={{marginTop:4}}>
        <div style={{height:3,background:C.border,borderRadius:99,overflow:"hidden"}}>
          <div style={{width:`${Math.min(pct,100)}%`,height:"100%",background:col,borderRadius:99}}/>
        </div>
        <div style={{fontSize:7,color:col,fontFamily:C.mono,marginTop:1}}>{pct}% dari minimum</div>
      </div>
    );
  }

  return (
    <div>
      {/* KPI */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:16}}>
        {[
          {label:"Total Item",value:inventory.length,color:C.cyan},
          {label:"Stok Normal",value:inventory.filter(i=>i.stok>i.minimum).length,color:C.green},
          {label:"Alert / Habis",value:alertItems.length,color:alertItems.length>0?C.red:C.textMid},
          {label:"Nilai Total Stok",value:rp(totalNilai),color:C.yellow},
        ].map(k=>(
          <div key={k.label} style={{background:C.card,border:`1px solid ${k.label==="Alert / Habis"&&k.value>0?C.red+"44":C.border}`,borderRadius:10,padding:"12px 16px",borderLeft:`3px solid ${k.color}`}}>
            <div style={{fontSize:8,color:C.textSub,fontFamily:C.sans,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:3}}>{k.label}</div>
            <div style={{fontSize:k.label==="Nilai Total Stok"?14:22,fontWeight:800,color:k.color,fontFamily:C.syne}}>{k.value}</div>
          </div>
        ))}
      </div>

      <Panel title="DAFTAR STOK" action="+ TAMBAH ITEM" onAction={()=>setShowAdd(!showAdd)}>
        {showAdd&&(
          <div style={{padding:"14px 18px",borderBottom:`1px solid ${C.border}`,background:"#050e1f"}}>
            <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr 2fr",gap:10,marginBottom:10}}>
              {[
                {label:"Nama Item *",key:"nama",ph:"Nama bahan..."},
                {label:"Satuan *",key:"satuan",ph:"METER/KG/PCS..."},
                {label:"Stok Awal *",key:"stok",ph:"0"},
                {label:"Stok Minimum",key:"minimum",ph:"0"},
                {label:"Harga/Satuan",key:"hargaSatuan",ph:"0"},
                {label:"Keterangan",key:"keterangan",ph:"Opsional..."},
              ].map(f=>(
                <div key={f.key}>
                  <div style={{fontSize:8,color:C.textSub,fontFamily:C.sans,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:4}}>{f.label}</div>
                  <input value={newItem[f.key]} onChange={e=>setNewItem(n=>({...n,[f.key]:e.target.value}))}
                    placeholder={f.ph} style={inputStyle}/>
                </div>
              ))}
            </div>
            <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
              <Btn small onClick={()=>setShowAdd(false)} outline>BATAL</Btn>
              <Btn small onClick={addItem} disabled={!newItem.nama||!newItem.satuan||!newItem.stok} color="green">SIMPAN</Btn>
            </div>
          </div>
        )}

        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",minWidth:700}}>
            <thead><tr style={{background:"#0e204055"}}>
              {["Item","Satuan","Stok Saat Ini","Minimum","Nilai Stok","Keterangan","Aksi"].map(h=>(
                <th key={h} style={{...TH_PROD,textAlign:["Stok Saat Ini","Minimum","Nilai Stok","Aksi"].includes(h)?"center":TH_PROD.textAlign}}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {inventory.map((item,i)=>{
                const isAlert=item.stok<=item.minimum;
                const isLow=item.stok<=item.minimum*1.5&&item.stok>item.minimum;
                return (
                  <tr key={item.id} style={{borderBottom:`1px solid ${C.border}`,
                    background:isAlert?`${C.red}08`:isLow?`${C.yellow}05`:i%2===0?C.card:C.card2}}>
                    <td style={TD_PROD(i)}>
                      <div style={{fontWeight:600,fontSize:11,color:C.text}}>{item.nama}</div>
                      <div style={{fontSize:8,color:C.textSub,fontFamily:C.mono,marginTop:1}}>{item.id}</div>
                    </td>
                    <td style={TD_PROD(i)}><span style={{fontFamily:C.mono,fontSize:10,color:C.textSub}}>{item.satuan}</span></td>
                    <td style={{...TD_PROD(i),textAlign:"center"}}>
                      <div>
                        <span style={{fontSize:16,fontWeight:800,fontFamily:C.syne,
                          color:isAlert?C.red:isLow?C.yellow:C.green}}>{item.stok}</span>
                        <span style={{fontSize:9,color:C.textSub,fontFamily:C.sans,marginLeft:4}}>{item.satuan}</span>
                        <StokBar stok={item.stok} minimum={item.minimum}/>
                      </div>
                    </td>
                    <td style={{...TD_PROD(i),textAlign:"center"}}>
                      {editId===item.id?(
                        <input type="number" value={editVal.minimum} onChange={e=>setEditVal(v=>({...v,minimum:e.target.value}))}
                          style={{...inputStyle,width:70,textAlign:"center"}}/>
                      ):(
                        <span style={{fontFamily:C.mono,fontSize:11,color:C.textSub}}>{item.minimum}</span>
                      )}
                    </td>
                    <td style={{...TD_PROD(i),textAlign:"center"}}>
                      <span style={{fontFamily:C.mono,fontSize:11,color:C.yellow}}>{rp(item.stok*item.hargaSatuan)}</span>
                    </td>
                    <td style={TD_PROD(i)}>
                      {editId===item.id?(
                        <input value={editVal.keterangan} onChange={e=>setEditVal(v=>({...v,keterangan:e.target.value}))}
                          style={{...inputStyle}}/>
                      ):(
                        <span style={{fontSize:10,color:C.textSub}}>{item.keterangan||"—"}</span>
                      )}
                    </td>
                    <td style={{...TD_PROD(i),textAlign:"center"}}>
                      {editId===item.id?(
                        <div style={{display:"flex",gap:5,justifyContent:"center"}}>
                          <Btn small onClick={saveEdit} color="green">SIMPAN</Btn>
                          <Btn small onClick={()=>setEditId(null)} outline>BATAL</Btn>
                        </div>
                      ):(
                        <div style={{display:"flex",gap:5,justifyContent:"center"}}>
                          {isAlert&&<span style={{fontSize:8,padding:"2px 6px",borderRadius:4,background:`${C.red}15`,color:C.red,fontFamily:C.mono,fontWeight:700}}>⚠ ALERT</span>}
                          <Btn small onClick={()=>startEdit(item)} outline>EDIT</Btn>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{padding:"10px 18px",borderTop:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between"}}>
          <span style={{fontSize:9,color:C.textMid,fontFamily:C.sans}}>Stok bertambah otomatis dari Jurnal Umum kategori Pembelian Bahan Baku / Aksesori</span>
          <span style={{fontSize:9,color:C.textMid,fontFamily:C.mono}}>{inventory.length} item</span>
        </div>
      </Panel>
    </div>
  );
}

// ── TRANSAKSI KELUAR ──────────────────────────────────────────────────────────
function TransaksiKeluar({inventory,setInventory}) {
  const [trxKeluar,setTrxKeluar] = useState(initTrxKeluar);
  const [showForm,setShowForm]   = useState(false);
  const [form,setForm]           = useState({idInventory:"",qty:"",keterangan:"",idPO:"",tanggal:new Date().toISOString().split("T")[0]});
  const [error,setError]         = useState("");

  const itemTerpilih = inventory.find(i=>i.id===form.idInventory);
  const qtyNum       = Number(form.qty)||0;
  const kurang       = itemTerpilih&&qtyNum>itemTerpilih.stok;

  function simpanKeluar() {
    if(!form.idInventory||qtyNum<=0||kurang) return;
    const item=inventory.find(i=>i.id===form.idInventory);
    const newTrx={
      id:genIdTrx("TK",trxKeluar),idInventory:form.idInventory,
      namaItem:item.nama,qty:qtyNum,satuan:item.satuan,
      tanggal:form.tanggal,keterangan:form.keterangan,idPO:form.idPO||null,
    };
    setTrxKeluar(t=>[newTrx,...t]);
    setInventory(inv=>inv.map(i=>i.id===form.idInventory?{...i,stok:i.stok-qtyNum}:i));
    setForm({idInventory:"",qty:"",keterangan:"",idPO:"",tanggal:new Date().toISOString().split("T")[0]});
    setShowForm(false);
    setError("");
  }

  const sel={padding:"7px 10px",fontSize:11,color:C.text,fontFamily:C.sans,outline:"none",
    background:"#050e1f",border:`1px solid ${C.border2}`,borderRadius:6,width:"100%"};

  const totalKeluar = trxKeluar.reduce((s,t)=>{
    const item=inventory.find(i=>i.id===t.idInventory);
    return s+(item?(t.qty*(item.hargaSatuan||0)):0);
  },0);

  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:16}}>
        {[
          {label:"Total Transaksi Keluar",value:trxKeluar.length,color:C.orange},
          {label:"Total QTY Keluar",value:trxKeluar.reduce((s,t)=>s+t.qty,0)+" unit",color:C.red},
          {label:"Estimasi Nilai Keluar",value:rp(totalKeluar),color:C.yellow},
        ].map(k=>(
          <div key={k.label} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 16px",borderLeft:`3px solid ${k.color}`}}>
            <div style={{fontSize:8,color:C.textSub,fontFamily:C.sans,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:3}}>{k.label}</div>
            <div style={{fontSize:k.label==="Estimasi Nilai Keluar"?14:22,fontWeight:800,color:k.color,fontFamily:C.syne}}>{k.value}</div>
          </div>
        ))}
      </div>

      <Panel title="TRANSAKSI KELUAR" action="+ INPUT KELUAR" onAction={()=>setShowForm(!showForm)}>
        {showForm&&(
          <div style={{padding:"16px 20px",borderBottom:`1px solid ${C.border}`,background:"#050e1f"}}>
            <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 2fr",gap:12,marginBottom:12}}>
              <div>
                <div style={{fontSize:9,color:C.textSub,fontFamily:C.sans,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:5}}>Item <span style={{color:C.red}}>*</span></div>
                <select value={form.idInventory} onChange={e=>setForm(f=>({...f,idInventory:e.target.value,qty:""}))} style={sel}>
                  <option value="">-- Pilih Item --</option>
                  {inventory.map(i=>(
                    <option key={i.id} value={i.id}>{i.nama} (stok: {i.stok} {i.satuan})</option>
                  ))}
                </select>
              </div>
              <div>
                <div style={{fontSize:9,color:C.textSub,fontFamily:C.sans,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:5}}>QTY <span style={{color:C.red}}>*</span></div>
                <input type="number" min="1" value={form.qty}
                  onChange={e=>setForm(f=>({...f,qty:e.target.value}))}
                  style={{...sel,borderColor:kurang?C.red+"66":C.border2,color:kurang?C.red:C.text}}
                  placeholder="0"/>
                {itemTerpilih&&<div style={{fontSize:8,color:kurang?C.red:C.green,fontFamily:C.mono,marginTop:2}}>
                  {kurang?`⚠ Melebihi stok (${itemTerpilih.stok})`:`Stok: ${itemTerpilih.stok} ${itemTerpilih.satuan}`}
                </div>}
              </div>
              <div>
                <div style={{fontSize:9,color:C.textSub,fontFamily:C.sans,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:5}}>Tanggal</div>
                <input type="date" value={form.tanggal} onChange={e=>setForm(f=>({...f,tanggal:e.target.value}))} style={sel}/>
              </div>
              <div>
                <div style={{fontSize:9,color:C.textSub,fontFamily:C.sans,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:5}}>Tag PO</div>
                <select value={form.idPO} onChange={e=>setForm(f=>({...f,idPO:e.target.value}))} style={sel}>
                  <option value="">-- Tanpa PO --</option>
                  {PO_LIST.map((p,idx)=><option key={idx} value={p.kode}>{p.kode}</option>)}
                </select>
              </div>
              <div>
                <div style={{fontSize:9,color:C.textSub,fontFamily:C.sans,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:5}}>Keterangan <span style={{color:C.red}}>*</span></div>
                <input value={form.keterangan} onChange={e=>setForm(f=>({...f,keterangan:e.target.value}))}
                  placeholder="Dipakai untuk..." style={sel}/>
              </div>
            </div>
            {itemTerpilih&&qtyNum>0&&!kurang&&(
              <div style={{marginBottom:10,padding:"8px 12px",background:"#050e1f",borderRadius:6,
                border:`1px solid ${C.orange}33`,display:"flex",justifyContent:"space-between",fontSize:10}}>
                <span style={{color:C.textSub,fontFamily:C.sans}}>Sisa stok setelah keluar:</span>
                <span style={{fontFamily:C.mono,fontWeight:700,color:itemTerpilih.stok-qtyNum<=itemTerpilih.minimum?C.red:C.green}}>
                  {itemTerpilih.stok-qtyNum} {itemTerpilih.satuan}
                  {itemTerpilih.stok-qtyNum<=itemTerpilih.minimum&&" ⚠ DI BAWAH MINIMUM"}
                </span>
              </div>
            )}
            <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
              <Btn small onClick={()=>setShowForm(false)} outline>BATAL</Btn>
              <Btn small onClick={simpanKeluar}
                disabled={!form.idInventory||qtyNum<=0||kurang||!form.keterangan}
                color="orange">SIMPAN KELUAR</Btn>
            </div>
          </div>
        )}

        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",minWidth:620}}>
            <thead><tr style={{background:"#0e204055"}}>
              {["Tanggal","Item","QTY","Satuan","Tag PO","Keterangan"].map(h=>(
                <th key={h} style={{...TH_PROD,textAlign:h==="QTY"?"center":TH_PROD.textAlign}}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {trxKeluar.map((t,i)=>(
                <tr key={t.id} style={{borderBottom:`1px solid ${C.border}`}}>
                  <td style={TD_PROD(i)}><span style={{fontFamily:C.mono,fontSize:10,color:C.textSub}}>{t.tanggal}</span></td>
                  <td style={TD_PROD(i)}><span style={{fontWeight:600}}>{t.namaItem}</span></td>
                  <td style={{...TD_PROD(i),textAlign:"center"}}>
                    <span style={{fontFamily:C.mono,fontWeight:700,fontSize:13,color:C.orange}}>-{t.qty}</span>
                  </td>
                  <td style={TD_PROD(i)}><span style={{fontFamily:C.mono,fontSize:10,color:C.textSub}}>{t.satuan}</span></td>
                  <td style={TD_PROD(i)}>{t.idPO?<span style={{fontFamily:C.mono,fontSize:10,color:C.blue,fontWeight:700}}>{t.idPO}</span>:<span style={{color:C.textMid}}>—</span>}</td>
                  <td style={{...TD_PROD(i),color:C.textSub,fontSize:10}}>{t.keterangan}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{padding:"10px 18px",borderTop:`1px solid ${C.border}`,display:"flex",justifyContent:"flex-end"}}>
          <span style={{fontSize:9,color:C.textMid,fontFamily:C.mono}}>{trxKeluar.length} transaksi keluar</span>
        </div>
      </Panel>
    </div>
  );
}

// ── ALERT ORDER ───────────────────────────────────────────────────────────────
function AlertOrder({inventory,setInventory}) {
  const [editMinimum,setEditMinimum] = useState(null);
  const [editVal,setEditVal]         = useState("");

  const alertItems  = inventory.filter(i=>i.stok<=i.minimum).sort((a,b)=>a.stok-b.stok);
  const lowItems    = inventory.filter(i=>i.stok>i.minimum&&i.stok<=i.minimum*1.5);
  const normalItems = inventory.filter(i=>i.stok>i.minimum*1.5);

  function saveMinimum(id) {
    setInventory(inv=>inv.map(i=>i.id===id?{...i,minimum:Number(editVal)||0}:i));
    setEditMinimum(null);
  }

  function AlertRow({item,level}) {
    const col=level==="alert"?C.red:level==="low"?C.yellow:C.green;
    const pct=item.minimum>0?Math.min(200,Math.round((item.stok/item.minimum)*100)):100;
    return (
      <div style={{padding:"14px 18px",borderBottom:`1px solid ${C.border}`,
        background:level==="alert"?`${C.red}08`:level==="low"?`${C.yellow}05`:C.card,
        display:"flex",gap:16,alignItems:"center"}}>
        <div style={{flex:1}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
            <div>
              <span style={{fontSize:12,fontWeight:700,color:C.text,fontFamily:C.sans}}>{item.nama}</span>
              <span style={{fontSize:9,color:C.textSub,fontFamily:C.mono,marginLeft:8}}>{item.id}</span>
            </div>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              {level==="alert"&&<span style={{fontSize:9,padding:"2px 8px",borderRadius:99,fontFamily:C.mono,fontWeight:700,background:`${C.red}15`,color:C.red,border:`1px solid ${C.red}33`}}>⚠ PERLU ORDER</span>}
              {level==="low"&&<span style={{fontSize:9,padding:"2px 8px",borderRadius:99,fontFamily:C.mono,fontWeight:700,background:`${C.yellow}15`,color:C.yellow,border:`1px solid ${C.yellow}33`}}>⚡ HAMPIR HABIS</span>}
            </div>
          </div>
          <div style={{display:"flex",gap:20,alignItems:"center"}}>
            <div>
              <div style={{fontSize:8,color:C.textSub,fontFamily:C.sans,marginBottom:2}}>Stok Sekarang</div>
              <div style={{fontSize:18,fontWeight:800,color:col,fontFamily:C.syne}}>{item.stok} <span style={{fontSize:10,fontWeight:400,color:C.textSub}}>{item.satuan}</span></div>
            </div>
            <div>
              <div style={{fontSize:8,color:C.textSub,fontFamily:C.sans,marginBottom:2}}>Stok Minimum</div>
              {editMinimum===item.id?(
                <div style={{display:"flex",gap:6,alignItems:"center"}}>
                  <input type="number" value={editVal} onChange={e=>setEditVal(e.target.value)}
                    style={{width:70,background:"#050e1f",border:`1px solid ${C.cyanDim}`,borderRadius:5,padding:"4px 7px",fontSize:12,color:C.text,fontFamily:C.mono,outline:"none",textAlign:"center"}}/>
                  <Btn small onClick={()=>saveMinimum(item.id)} color="green">✓</Btn>
                  <Btn small onClick={()=>setEditMinimum(null)} outline>✗</Btn>
                </div>
              ):(
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <div style={{fontSize:16,fontWeight:700,color:C.textSub,fontFamily:C.syne}}>{item.minimum} <span style={{fontSize:10,fontWeight:400}}>{item.satuan}</span></div>
                  <button onClick={()=>{setEditMinimum(item.id);setEditVal(String(item.minimum));}}
                    style={{background:"transparent",border:`1px solid ${C.border}`,borderRadius:4,color:C.textSub,cursor:"pointer",fontSize:9,padding:"2px 6px",fontFamily:C.mono}}>EDIT</button>
                </div>
              )}
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:8,color:C.textSub,fontFamily:C.sans,marginBottom:4}}>Progress stok vs minimum</div>
              <div style={{height:8,background:C.border,borderRadius:99,overflow:"hidden"}}>
                <div style={{width:`${Math.min(pct,100)}%`,height:"100%",background:col,borderRadius:99,transition:"width 0.3s"}}/>
              </div>
              <div style={{fontSize:8,color:col,fontFamily:C.mono,marginTop:2}}>{pct}%</div>
            </div>
            <div>
              <div style={{fontSize:8,color:C.textSub,fontFamily:C.sans,marginBottom:2}}>Nilai Stok</div>
              <div style={{fontSize:12,fontWeight:700,color:C.yellow,fontFamily:C.mono}}>{rp(item.stok*item.hargaSatuan)}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* KPI */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:16}}>
        {[
          {label:"Perlu Order Sekarang",value:alertItems.length,color:alertItems.length>0?C.red:C.green,desc:alertItems.length>0?"stok ≤ minimum":"semua aman"},
          {label:"Hampir Habis",value:lowItems.length,color:lowItems.length>0?C.yellow:C.green,desc:"stok ≤ 150% minimum"},
          {label:"Stok Normal",value:normalItems.length,color:C.green,desc:"stok > 150% minimum"},
        ].map(k=>(
          <div key={k.label} style={{background:C.card,border:`1px solid ${k.color==="red"?C.red+"44":k.color==="yellow"?C.yellow+"33":C.border}`,borderRadius:10,padding:"12px 16px",borderLeft:`3px solid ${k.color}`}}>
            <div style={{fontSize:8,color:C.textSub,fontFamily:C.sans,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:3}}>{k.label}</div>
            <div style={{fontSize:22,fontWeight:800,color:k.color,fontFamily:C.syne}}>{k.value}</div>
            <div style={{fontSize:9,color:C.textSub,fontFamily:C.sans,marginTop:2}}>{k.desc}</div>
          </div>
        ))}
      </div>

      {alertItems.length>0&&(
        <Panel title={`⚠ PERLU ORDER SEGERA — ${alertItems.length} ITEM`} accent={C.red}>
          {alertItems.map(item=><AlertRow key={item.id} item={item} level="alert"/>)}
        </Panel>
      )}

      {lowItems.length>0&&(
        <Panel title={`⚡ HAMPIR HABIS — ${lowItems.length} ITEM`} accent={C.yellow}>
          {lowItems.map(item=><AlertRow key={item.id} item={item} level="low"/>)}
        </Panel>
      )}

      {alertItems.length===0&&lowItems.length===0&&(
        <div style={{padding:"40px",textAlign:"center",background:C.card,border:`1px solid ${C.green}44`,borderRadius:14,marginBottom:16}}>
          <div style={{fontSize:32,marginBottom:12}}>✓</div>
          <div style={{fontSize:16,fontWeight:700,color:C.green,fontFamily:C.syne}}>Semua Stok Aman</div>
          <div style={{fontSize:10,color:C.textSub,fontFamily:C.sans,marginTop:4}}>Tidak ada item yang perlu di-reorder saat ini.</div>
        </div>
      )}

      {normalItems.length>0&&(
        <Panel title={`STOK NORMAL — ${normalItems.length} ITEM`} accent={C.green}>
          {normalItems.map(item=><AlertRow key={item.id} item={item} level="normal"/>)}
        </Panel>
      )}
    </div>
  );
}

// ── MAIN EXPORT ───────────────────────────────────────────────────────────────
const TABS_INV=[
  {id:"overview",  label:"Overview Stok",    color:C.cyan},
  {id:"keluar",    label:"Transaksi Keluar",  color:C.orange},
  {id:"masuk",     label:"Transaksi Masuk",   color:C.green},
  {id:"alert",     label:"Alert Order",       color:C.red},
];

function TabInventory({defaultTab="overview", inventory, setInventory, trxKeluar, setTrxKeluar, trxMasuk, setTrxMasuk}) {
  const [activeTab,setActiveTab]   = useState(defaultTab);

  return (
    <div>
      <div style={{display:"flex",gap:6,marginBottom:20,paddingBottom:16,borderBottom:`1px solid ${C.border}`}}>
        {TABS_INV.map(t=>(
          <button key={t.id} onClick={()=>setActiveTab(t.id)}
            style={{padding:"7px 16px",fontSize:10,fontWeight:700,fontFamily:C.mono,
              background:activeTab===t.id?`${t.color}22`:"transparent",
              color:activeTab===t.id?t.color:C.textSub,
              border:`1px solid ${activeTab===t.id?t.color+"55":C.border}`,
              borderRadius:8,cursor:"pointer",transition:"all 0.1s",display:"flex",alignItems:"center",gap:6}}>
            {t.id==="alert"&&inventory.filter(i=>i.stok<=i.minimum).length>0&&(
              <span style={{background:C.red,color:"#000",borderRadius:"50%",width:16,height:16,
                display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,fontWeight:800}}>
                {inventory.filter(i=>i.stok<=i.minimum).length}
              </span>
            )}
            {t.label}
          </button>
        ))}
      </div>
      <div style={{marginBottom:14}}>
        <div style={{fontSize:10,color:C.textSub,fontFamily:C.mono,letterSpacing:"0.07em"}}>
          INVENTORY / {TABS_INV.find(t=>t.id===activeTab)?.label.toUpperCase()}
        </div>
      </div>
      {activeTab==="overview" && <OverviewStok inventory={inventory} setInventory={setInventory}/>}
      {activeTab==="keluar"   && <TransaksiKeluar inventory={inventory} setInventory={setInventory} trxKeluar={trxKeluar} setTrxKeluar={setTrxKeluar}/>}
      {activeTab==="masuk"    && <TransaksiMasuk  trxMasuk={trxMasuk}/>}
      {activeTab==="alert"    && <AlertOrder inventory={inventory} setInventory={setInventory}/>}
    </div>
  );
}

// ── SUB-TAB: TRANSAKSI MASUK ────────────────────────────────────────────────
function TransaksiMasuk({trxMasuk}) {
  return (
    <Panel title="RIWAYAT BARANG MASUK (DARI PEMBELIAN)">
      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",minWidth:600}}>
          <thead><tr style={{background:"#0e204055"}}>
            {["Tanggal","Item","QTY","Satuan","Tag PO","Keterangan"].map(h=>(
              <th key={h} style={{...TH_PROD,textAlign:h==="QTY"?"center":TH_PROD.textAlign}}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {trxMasuk.length===0 && (
              <tr><td colSpan={6} style={{padding:20,textAlign:"center",color:C.textMid,fontSize:11}}>Belum ada data barang masuk.</td></tr>
            )}
            {trxMasuk.map((t,i)=>(
              <tr key={t.id} style={{borderBottom:`1px solid ${C.border}`,background:i%2===0?C.card:C.card2}}>
                <td style={TD_PROD(i)}><span style={{fontFamily:C.mono,fontSize:10,color:C.textSub}}>{t.tanggal}</span></td>
                <td style={TD_PROD(i)}><span style={{fontWeight:600}}>{t.namaItem}</span></td>
                <td style={{...TD_PROD(i),textAlign:"center"}}><span style={{fontFamily:C.mono,color:C.green,fontWeight:700}}>+{t.qty}</span></td>
                <td style={TD_PROD(i)}><span style={{fontFamily:C.mono,fontSize:10,color:C.textSub}}>{t.satuan}</span></td>
                <td style={TD_PROD(i)}>{t.idPO?<span style={{fontFamily:C.mono,fontSize:10,color:C.blue,fontWeight:700}}>{t.idPO}</span>:<span style={{color:C.textMid}}>-</span>}</td>
                <td style={{...TD_PROD(i),color:C.textSub,fontSize:10}}>{t.keterangan}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}


// ── TAB KEUANGAN ─────────────────────────────────────────────────────────────

const TH_KEU={padding:"9px 14px",textAlign:"left",fontSize:9,fontWeight:700,
  color:C.textSub,textTransform:"uppercase",letterSpacing:"0.07em",fontFamily:C.sans,whiteSpace:"nowrap"};
const TD_KEU=(i)=>({padding:"11px 14px",fontSize:11,color:C.text,fontFamily:C.sans,
  background:i%2===0?C.card:C.card2});

function BtnKeu({children,onClick,color="cyan",small=false,outline=false,disabled=false,full=false}) {
  const colMap={cyan:C.cyan,green:C.green,red:C.red,yellow:C.yellow,purple:C.purple,orange:C.orange,blue:C.blue};
  const col=colMap[color]||C.cyan;
  return (
    <button onClick={onClick} disabled={disabled}
      style={{padding:small?"5px 12px":"9px 20px",fontSize:small?9:11,fontWeight:700,fontFamily:C.mono,
        background:disabled?"#1a2030":outline?"transparent":col,
        color:disabled?C.textMid:outline?col:"#000",
        border:`1px solid ${disabled?"#1a2030":col}`,
        borderRadius:7,cursor:disabled?"not-allowed":"pointer",
        letterSpacing:"0.05em",whiteSpace:"nowrap",opacity:disabled?0.5:1,
        width:full?"100%":"auto"}}>
      {children}
    </button>
  );
}


// ── SUB-TAB: JURNAL UMUM ─────────────────────────────────────────────────────
function JurnalUmum({jurnal,setJurnal,inventory,setInventory,trxMasuk,setTrxMasuk}) {
  const [showForm,setShowForm] = useState(false);
  const [filterBulan,setFilterBulan] = useState("");
  const [filterTipe,setFilterTipe] = useState("semua");

  const emptyForm = {tanggal:new Date().toISOString().split("T")[0],idKategori:"",keterangan:"",idPO:"",jumlah:"",namaItem:"",qty:"",satuan:"",hargaSatuan:""};
  const [form,setForm] = useState(emptyForm);
  const [notif,setNotif] = useState("");

  const kategori = KATEGORI_TRX.find(k=>k.id===form.idKategori);
  const perluStok = kategori?.tambahStok;
  const qtyNum = Number(form.qty)||0;
  const hargaNum = Number(form.hargaSatuan)||0;
  const jumlahAuto = perluStok&&qtyNum>0&&hargaNum>0 ? qtyNum*hargaNum : Number(form.jumlah)||0;

  function simpanJurnal() {
    if(!form.idKategori||!form.keterangan||jumlahAuto<=0) return;
    if(perluStok&&(!form.namaItem||!form.qty||!form.satuan)) return;

    const kat = KATEGORI_TRX.find(k=>k.id===form.idKategori);
    const newJ = {
      id:`J${Date.now()}`,
      tanggal:form.tanggal,
      idKategori:form.idKategori,
      namaKategori:kat?.nama||"",
      keterangan:form.keterangan,
      idPO:form.idPO||null,
      jumlah:jumlahAuto,
      tipe:kat?.tipe||"keluar",
      tambahStok:kat?.tambahStok||false,
      ...(perluStok?{namaItem:form.namaItem,qty:qtyNum,satuan:form.satuan,hargaSatuan:hargaNum}:{}),
    };
    setJurnal(j=>[newJ,...j]);

    // Auto tambah stok & riwayat jika kategori tambahStok
    if(perluStok&&form.namaItem&&qtyNum>0) {
      setInventory(inv=>{
        const existing = inv.find(i=>i.nama.toLowerCase()===form.namaItem.toLowerCase());
        if(existing) {
          return inv.map(i=>i.nama.toLowerCase()===form.namaItem.toLowerCase()
            ?{...i,stok:i.stok+qtyNum}:i);
        } else {
          return [...inv,{
            id:`INV-${Date.now()}`,
            nama:form.namaItem,
            satuan:form.satuan,
            stok:qtyNum,
            minimum:0,
            hargaSatuan:hargaNum
          }];
        }
      });
      // CATAT RIWAYAT TRANSAKSI KE INVENTORY
      const newTM = {
        id:`TM${Date.now()}`,
        idInventory: inventory.find(i=>i.nama.toLowerCase()===form.namaItem.toLowerCase())?.id || `INV-${Date.now()}`,
        namaItem: form.namaItem,
        qty: qtyNum,
        satuan: form.satuan,
        tanggal: form.tanggal,
        keterangan: "DARI KEUANGAN: " + form.keterangan,
        idPO: form.idPO||null,
        jumlah: jumlahAuto
      };
      setTrxMasuk(prev=>[newTM, ...prev]);

      setNotif(`✓ Stok & Riwayat "${form.namaItem}" otomatis ditambah ${qtyNum} ${form.satuan}`);
      setTimeout(()=>setNotif(""),4000);
    }

    setForm(emptyForm);
    setShowForm(false);
  }

  const filtered = jurnal.filter(j=>{
    const cocokBulan = !filterBulan||j.tanggal.startsWith(filterBulan);
    const cocokTipe  = filterTipe==="semua"||(filterTipe==="masuk"&&j.tipe==="masuk")||(filterTipe==="keluar"&&j.tipe==="keluar"&&j.namaKategori!=="Pinjaman")||(filterTipe==="pinjaman"&&j.namaKategori==="Pinjaman");
    return cocokBulan&&cocokTipe;
  });

  const totalMasuk    = filtered.filter(j=>j.tipe==="masuk"&&j.namaKategori!=="Pinjaman").reduce((s,j)=>s+j.jumlah,0);
  const totalKeluar   = filtered.filter(j=>j.tipe==="keluar").reduce((s,j)=>s+j.jumlah,0);
  const totalPinjaman = filtered.filter(j=>j.namaKategori==="Pinjaman").reduce((s,j)=>s+j.jumlah,0);
  const saldo         = totalMasuk - totalKeluar;

  const sel = {padding:"7px 14px",fontSize:11,color:C.text,fontFamily:C.sans,outline:"none",
    background:"#050e1f",border:`1px solid ${C.border2}`,borderRadius:6,width:"100%"};

  return (
    <div>
      {notif&&(
        <div style={{marginBottom:12,padding:"10px 16px",background:"#001a0f",borderRadius:8,
          border:`1px solid ${C.green}44`,fontSize:10,color:C.green,fontFamily:C.sans}}>
          {notif}
        </div>
      )}

      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:16}}>
        {[
          {label:"Total Masuk",value:rp(totalMasuk),color:C.green},
          {label:"Total Keluar",value:rp(totalKeluar),color:C.red},
          {label:"Saldo Periode",value:rp(saldo),color:saldo>=0?C.cyan:C.red},
          {label:"Pinjaman",value:rp(totalPinjaman),color:C.yellow},
        ].map(k=>(
          <div key={k.label} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 16px",borderLeft:`3px solid ${k.color}`}}>
            <div style={{fontSize:8,color:C.textSub,fontFamily:C.sans,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:3}}>{k.label}</div>
            <div style={{fontSize:15,fontWeight:800,color:k.color,fontFamily:C.syne}}>{k.value}</div>
          </div>
        ))}
      </div>

      <Panel title="JURNAL UMUM" action="+ INPUT TRANSAKSI" onAction={()=>setShowForm(!showForm)}>
        {showForm&&(
          <div style={{padding:"18px 20px",borderBottom:`1px solid ${C.border}`,background:"#050e1f"}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14,marginBottom:14}}>
              <div>
                <div style={{fontSize:9,color:C.textSub,fontFamily:C.sans,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:5}}>Tanggal <span style={{color:C.red}}>*</span></div>
                <input type="date" value={form.tanggal} onChange={e=>setForm(f=>({...f,tanggal:e.target.value}))} style={{...sel}}/>
              </div>
              <div>
                <div style={{fontSize:9,color:C.textSub,fontFamily:C.sans,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:5}}>Kategori <span style={{color:C.red}}>*</span></div>
                <select value={form.idKategori} onChange={e=>setForm(f=>({...f,idKategori:e.target.value,jumlah:"",namaItem:"",qty:"",satuan:"",hargaSatuan:""}))} style={sel}>
                  <option value="">-- Pilih Kategori --</option>
                  {KATEGORI_TRX.map(k=>(
                    <option key={k.id} value={k.id}>[{k.tipe==="masuk"?"↑ MASUK":"↓ KELUAR"}] {k.nama}{k.tambahStok?" 📦":""}</option>
                  ))}
                </select>
              </div>
              <div>
                <div style={{fontSize:9,color:C.textSub,fontFamily:C.sans,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:5}}>Tag PO (opsional)</div>
                <select value={form.idPO} onChange={e=>setForm(f=>({...f,idPO:e.target.value}))} style={sel}>
                  <option value="">-- Tanpa PO --</option>
                  {PO_LIST_KEU.map(p=><option key={p.kode} value={p.kode}>{p.kode} — {p.model}</option>)}
                </select>
              </div>
            </div>

            <div style={{marginBottom:14}}>
              <div style={{fontSize:9,color:C.textSub,fontFamily:C.sans,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:5}}>Keterangan <span style={{color:C.red}}>*</span></div>
              <input value={form.keterangan} onChange={e=>setForm(f=>({...f,keterangan:e.target.value}))}
                placeholder="Deskripsi transaksi..." style={{...sel,width:"100%"}}/>
            </div>

            {perluStok?(
              <div style={{padding:"12px 14px",background:C.cyanBg,borderRadius:8,border:`1px solid ${C.cyanDim}`,marginBottom:14}}>
                <div style={{fontSize:9,color:C.cyan,fontFamily:C.mono,fontWeight:700,marginBottom:10,letterSpacing:"0.07em"}}>📦 OTOMATIS TAMBAH STOK & RIWAYAT INVENTORY</div>
                <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:12}}>
                  <div>
                    <div style={{fontSize:9,color:C.textSub,fontFamily:C.sans,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:5}}>Nama Item <span style={{color:C.red}}>*</span></div>
                    <input value={form.namaItem} onChange={e=>setForm(f=>({...f,namaItem:e.target.value}))}
                      placeholder="Nama bahan/item..." list="inventory-list" style={sel}/>
                    <datalist id="inventory-list">
                      {inventory.map(i=><option key={i.id} value={i.nama}/>)}
                    </datalist>
                  </div>
                  <div>
                    <div style={{fontSize:9,color:C.textSub,fontFamily:C.sans,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:5}}>QTY <span style={{color:C.red}}>*</span></div>
                    <input type="number" min="1" value={form.qty} onChange={e=>setForm(f=>({...f,qty:e.target.value}))}
                      placeholder="0" style={sel}/>
                  </div>
                  <div>
                    <div style={{fontSize:9,color:C.textSub,fontFamily:C.sans,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:5}}>Satuan <span style={{color:C.red}}>*</span></div>
                    <select value={form.satuan} onChange={e=>setForm(f=>({...f,satuan:e.target.value}))} style={sel}>
                      <option value="">--</option>
                      {["METER","PCS","KG","LUSIN"].map(s=><option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <div style={{fontSize:9,color:C.textSub,fontFamily:C.sans,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:5}}>Harga/Satuan <span style={{color:C.red}}>*</span></div>
                    <input type="number" min="0" value={form.hargaSatuan} onChange={e=>setForm(f=>({...f,hargaSatuan:e.target.value}))}
                      placeholder="0" style={sel}/>
                  </div>
                </div>
                {qtyNum>0&&hargaNum>0&&(
                  <div style={{marginTop:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span style={{fontSize:9,color:C.cyan,fontFamily:C.sans}}>Total otomatis: {qtyNum} {form.satuan} × {rp(hargaNum)}</span>
                    <span style={{fontSize:14,fontWeight:800,color:C.cyan,fontFamily:C.syne}}>{rp(jumlahAuto)}</span>
                  </div>
                )}
              </div>
            ):(
              <div style={{marginBottom:14}}>
                <div style={{fontSize:9,color:C.textSub,fontFamily:C.sans,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:5}}>Jumlah (Rp) <span style={{color:C.red}}>*</span></div>
                <div style={{display:"flex"}}>
                  <span style={{padding:"7px 10px",background:C.border,borderRadius:"6px 0 0 6px",fontSize:11,color:C.textSub,fontFamily:C.mono,border:`1px solid ${C.border2}`,borderRight:"none"}}>Rp</span>
                  <input type="number" min="0" value={form.jumlah} onChange={e=>setForm(f=>({...f,jumlah:e.target.value}))}
                    placeholder="0" style={{...sel,borderRadius:"0 6px 6px 0"}}/>
                </div>
              </div>
            )}

            <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
              <BtnKeu onClick={()=>{setShowForm(false);setForm(emptyForm);}} outline>BATAL</BtnKeu>
              <BtnKeu onClick={simpanJurnal}
                disabled={!form.idKategori||!form.keterangan||jumlahAuto<=0||(perluStok&&(!form.namaItem||!form.qty||!form.satuan))}
                color={kategori?.tipe==="masuk"?"green":"red"}>
                {kategori?.tipe==="masuk"?"↑ SIMPAN MASUK":"↓ SIMPAN KELUAR"}
              </BtnKeu>
            </div>
          </div>
        )}

        {/* Filter */}
        <div style={{padding:"10px 18px",borderBottom:`1px solid ${C.border}`,display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
          <input type="month" value={filterBulan} onChange={e=>setFilterBulan(e.target.value)}
            style={{background:"#050e1f",border:`1px solid ${C.border2}`,borderRadius:6,padding:"5px 9px",fontSize:11,color:C.text,fontFamily:C.mono,outline:"none"}}/>
          {[{v:"semua",l:"Semua"},{v:"masuk",l:"↑ Masuk"},{v:"keluar",l:"↓ Keluar"},{v:"pinjaman",l:"Pinjaman"}].map(f=>(
            <button key={f.v} onClick={()=>setFilterTipe(f.v)}
              style={{padding:"4px 12px",fontSize:9,fontWeight:700,fontFamily:C.mono,
                background:filterTipe===f.v?C.cyan:"transparent",
                color:filterTipe===f.v?"#000":C.textSub,
                border:`1px solid ${filterTipe===f.v?C.cyan:C.border}`,
                borderRadius:6,cursor:"pointer"}}>
              {f.l}
            </button>
          ))}
          <span style={{marginLeft:"auto",fontSize:9,color:C.textMid,fontFamily:C.mono}}>{filtered.length} transaksi</span>
        </div>

        {/* Tabel */}
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",minWidth:720}}>
            <thead><tr style={{background:"#0e204055"}}>
              {["Tanggal","Kategori","Keterangan","PO","Item/Stok","Jumlah","Tipe"].map(h=>(
                <th key={h} style={{...TH_KEU,textAlign:h==="Jumlah"?"right":TH_KEU.textAlign}}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filtered.map((j,i)=>(
                <tr key={j.id} style={{borderBottom:`1px solid ${C.border}`,
                  background:j.tipe==="masuk"&&j.namaKategori!=="Pinjaman"?`${C.green}05`:j.namaKategori==="Pinjaman"?`${C.yellow}05`:i%2===0?C.card:C.card2}}>
                  <td style={TD_KEU(i)}><span style={{fontFamily:C.mono,fontSize:10,color:C.textSub}}>{j.tanggal}</span></td>
                  <td style={TD_KEU(i)}>
                    <span style={{fontSize:10,fontWeight:600,color:j.tambahStok?C.cyan:C.text}}>{j.namaKategori}</span>
                    {j.tambahStok&&<span style={{fontSize:8,color:C.cyan,fontFamily:C.mono,marginLeft:4}}>📦</span>}
                  </td>
                  <td style={TD_KEU(i)}><span style={{fontSize:10,color:C.textSub}}>{j.keterangan}</span></td>
                  <td style={TD_KEU(i)}>{j.idPO?<span style={{fontFamily:C.mono,fontSize:10,color:C.blue,fontWeight:700}}>{j.idPO}</span>:<span style={{color:C.textMid}}>—</span>}</td>
                  <td style={TD_KEU(i)}>
                    {j.tambahStok&&j.namaItem?(
                      <div>
                        <div style={{fontSize:10,fontWeight:600,color:C.cyan}}>{j.namaItem}</div>
                        <div style={{fontSize:9,color:C.textSub,fontFamily:C.mono}}>+{j.qty} {j.satuan} @ {rp(j.hargaSatuan)}</div>
                      </div>
                    ):<span style={{color:C.textMid}}>—</span>}
                  </td>
                  <td style={{...TD_KEU(i),textAlign:"right"}}>
                    <span style={{fontFamily:C.mono,fontWeight:700,fontSize:12,
                      color:j.tipe==="masuk"?C.green:C.red}}>
                      {j.tipe==="masuk"?"+":"-"}{rp(j.jumlah)}
                    </span>
                  </td>
                  <td style={TD_KEU(i)}>
                    <span style={{fontSize:9,padding:"2px 8px",borderRadius:99,fontFamily:C.mono,fontWeight:700,
                      background:j.namaKategori==="Pinjaman"?`${C.yellow}15`:j.tipe==="masuk"?`${C.green}15`:`${C.red}15`,
                      color:j.namaKategori==="Pinjaman"?C.yellow:j.tipe==="masuk"?C.green:C.red,
                      border:`1px solid ${j.namaKategori==="Pinjaman"?C.yellow+"33":j.tipe==="masuk"?C.green+"33":C.red+"33"}`}}>
                      {j.namaKategori==="Pinjaman"?"PINJAMAN":j.tipe==="masuk"?"↑ MASUK":"↓ KELUAR"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{padding:"10px 18px",borderTop:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between"}}>
          <span style={{fontSize:9,color:C.textMid,fontFamily:C.mono}}>📦 = otomatis tambah stok inventory</span>
          <span style={{fontSize:9,color:saldo>=0?C.green:C.red,fontFamily:C.mono,fontWeight:700}}>
            Saldo: {saldo>=0?"+":""}{rp(saldo)}
          </span>
        </div>
      </Panel>
    </div>
  );
}

// ── SUB-TAB: RINGKASAN ───────────────────────────────────────────────────────
function KeuRingkasan({jurnal}) {
  const totalPenjualan = PO_LIST_KEU.reduce((s,p)=>s+p.totalHargaJual,0);
  const totalHPP       = PO_LIST_KEU.reduce((s,p)=>s+p.hpp,0);
  const totalKeluar    = jurnal.filter(j=>j.tipe==="keluar").reduce((s,j)=>s+j.jumlah,0);
  const totalMasuk     = jurnal.filter(j=>j.tipe==="masuk"&&j.namaKategori!=="Pinjaman").reduce((s,j)=>s+j.jumlah,0);
  const totalPinjaman  = jurnal.filter(j=>j.namaKategori==="Pinjaman").reduce((s,j)=>s+j.jumlah,0);
  const marginEst      = totalPenjualan - totalHPP;
  const marginReal     = totalPenjualan - totalKeluar;
  const saldoKas       = totalMasuk - totalKeluar;

  const perKategori = {};
  jurnal.filter(j=>j.tipe==="keluar").forEach(j=>{
    if(!perKategori[j.namaKategori]) perKategori[j.namaKategori]=0;
    perKategori[j.namaKategori]+=j.jumlah;
  });
  const kategoriList = Object.entries(perKategori).sort((a,b)=>b[1]-a[1]);

  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:16}}>
        {[
          {label:"Total Penjualan (Est)",value:rp(totalPenjualan),color:C.green,sub:"dari semua PO aktif"},
          {label:"Margin Estimasi",value:rp(marginEst),color:C.cyan,sub:pct(marginEst,totalPenjualan)+" dari penjualan"},
          {label:"Margin Real",value:rp(marginReal),color:marginReal>=marginEst?C.green:C.red,sub:pct(marginReal,totalPenjualan)+" aktual"},
        ].map(k=>(
          <div key={k.label} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"16px 18px",borderLeft:`3px solid ${k.color}`}}>
            <div style={{fontSize:9,color:C.textSub,fontFamily:C.sans,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:4}}>{k.label}</div>
            <div style={{fontSize:20,fontWeight:800,color:k.color,fontFamily:C.syne,lineHeight:1,marginBottom:4}}>{k.value}</div>
            <div style={{fontSize:9,color:C.textSub,fontFamily:C.sans}}>{k.sub}</div>
          </div>
        ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <Panel title="RINGKASAN KAS" accent={C.cyan}>
          <div style={{padding:"16px"}}>
            {[
              {label:"Total Masuk",value:totalMasuk,color:C.green,prefix:"+"},
              {label:"Total Keluar",value:totalKeluar,color:C.red,prefix:"-"},
              {label:"Saldo Kas",value:saldoKas,color:saldoKas>=0?C.cyan:C.red,prefix:""},
              {label:"Pinjaman (terpisah)",value:totalPinjaman,color:C.yellow,prefix:""},
            ].map((k,i)=>(
              <div key={k.label} style={{display:"flex",justifyContent:"space-between",alignItems:"center",
                padding:"10px 0",borderBottom:i<3?`1px solid ${C.border}`:"none"}}>
                <span style={{fontSize:11,color:C.textSub,fontFamily:C.sans}}>{k.label}</span>
                <span style={{fontSize:14,fontWeight:700,color:k.color,fontFamily:C.mono}}>
                  {k.prefix}{rp(k.value)}
                </span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="PENGELUARAN PER KATEGORI" accent={C.red}>
          <div style={{padding:"12px 0"}}>
            {kategoriList.map(([nama,jumlah])=>{
              const persen = totalKeluar>0?Math.round((jumlah/totalKeluar)*100):0;
              return (
                <div key={nama} style={{padding:"8px 16px",borderBottom:`1px solid ${C.border}`}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                    <span style={{fontSize:11,color:C.text,fontFamily:C.sans}}>{nama}</span>
                    <span style={{fontSize:11,fontWeight:700,color:C.red,fontFamily:C.mono}}>{rp(jumlah)}</span>
                  </div>
                  <div style={{height:3,background:C.border,borderRadius:99,overflow:"hidden"}}>
                    <div style={{width:`${persen}%`,height:"100%",background:C.red,borderRadius:99}}/>
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>
      </div>
    </div>
  );
}

// ── SUB-TAB: LAPORAN PO ──────────────────────────────────────────────────────
function KeuLaporanPO({jurnal}) {
  const [selectedPO,setSelectedPO] = useState("semua");
  const poJurnal = (kode) => jurnal.filter(j=>j.idPO===kode);
  return (
    <div>
      <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
        <button onClick={()=>setSelectedPO("semua")}
          style={{padding:"7px 14px",fontSize:10,fontWeight:700,fontFamily:C.mono,
            background:selectedPO==="semua"?C.cyan:"transparent",color:selectedPO==="semua"?"#000":C.textSub,
            border:`1px solid ${selectedPO==="semua"?C.cyan:C.border}`,borderRadius:8,cursor:"pointer"}}>SEMUA PO</button>
        {PO_LIST_KEU.map(p=>(
          <button key={p.kode} onClick={()=>setSelectedPO(p.kode)}
            style={{padding:"7px 14px",fontSize:10,fontWeight:700,fontFamily:C.mono,
              background:selectedPO===p.kode?C.cyan:"transparent",color:selectedPO===p.kode?"#000":C.textSub,
              border:`1px solid ${selectedPO===p.kode?C.cyan:C.border}`,borderRadius:8,cursor:"pointer"}}>
            {p.kode}
          </button>
        ))}
      </div>
      {(selectedPO==="semua"?PO_LIST_KEU:[PO_LIST_KEU.find(p=>p.kode===selectedPO)].filter(Boolean)).map(po=>{
        const jPO = poJurnal(po.kode);
        const biayaPO = jPO.filter(j=>j.tipe==="keluar").reduce((s,j)=>s+j.jumlah,0);
        const marginE = po.totalHargaJual-po.hpp;
        const marginR = po.totalHargaJual-biayaPO;
        const gap = marginR-marginE;
        return (
          <Panel key={po.kode} title={`${po.kode} — ${po.klien} — ${po.model}`} accent={gap>=0?C.green:C.red}>
            <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10,padding:"14px 18px",borderBottom:`1px solid ${C.border}`}}>
              {[
                {label:"Harga Jual",value:rp(po.totalHargaJual),color:C.text},
                {label:"Margin Est",value:rp(marginE),color:C.cyan},
                {label:"Biaya Realisasi",value:rp(biayaPO),color:C.red},
                {label:"Margin Real",value:rp(marginR),color:marginR>=marginE?C.green:C.red},
                {label:"Gap",value:(gap>=0?"+":"")+rp(gap),color:gap>=0?C.green:C.red},
              ].map(k=>(
                <div key={k.label}>
                  <div style={{fontSize:8,color:C.textSub,fontFamily:C.sans,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:3}}>{k.label}</div>
                  <div style={{fontSize:14,fontWeight:700,color:k.color,fontFamily:C.mono}}>{k.value}</div>
                </div>
              ))}
            </div>
            {jPO.length>0 && (
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead><tr style={{background:"#0e204055"}}>
                  {["Tanggal","Kategori","Keterangan","Jumlah"].map(h=>(
                    <th key={h} style={{...TH_KEU,textAlign:h==="Jumlah"?"right":TH_KEU.textAlign}}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {jPO.map((j,i)=>(
                    <tr key={j.id} style={{borderBottom:`1px solid ${C.border}`}}>
                      <td style={TD_KEU(i)}><span style={{fontFamily:C.mono,fontSize:10,color:C.textSub}}>{j.tanggal}</span></td>
                      <td style={TD_KEU(i)}>{j.namaKategori}</td>
                      <td style={TD_KEU(i)}><span style={{fontSize:10,color:C.textSub}}>{j.keterangan}</span></td>
                      <td style={{...TD_KEU(i),textAlign:"right"}}><span style={{fontFamily:C.mono,fontWeight:700,color:j.tipe==="masuk"?C.green:C.red}}>{j.tipe==="masuk"?"+":"-"}{rp(j.jumlah)}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Panel>
        );
      })}
    </div>
  );
}

// ── SUB-TAB: LAPORAN MARGIN ──────────────────────────────────────────────────
function KeuLaporanMargin({jurnal}) {
  const totalPenjualan = PO_LIST_KEU.reduce((s,p)=>s+p.totalHargaJual,0);
  const totalHPP = PO_LIST_KEU.reduce((s,p)=>s+p.hpp,0);
  const totalKeluar = jurnal.filter(j=>j.tipe==="keluar").reduce((s,j)=>s+j.jumlah,0);
  const mE = totalPenjualan-totalHPP;
  const mR = totalPenjualan-totalKeluar;
  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:16}}>
        {[
          {label:"Total Penjualan",value:rp(totalPenjualan),color:C.text},
          {label:"Margin Estimasi",value:rp(mE),color:C.cyan,sub:pct(mE,totalPenjualan)},
          {label:"Margin Real",value:rp(mR),color:mR>=mE?C.green:C.red,sub:pct(mR,totalPenjualan)},
          {label:"Gap Est vs Real",value:(mR-mE>=0?"+":"")+rp(mR-mE),color:mR>=mE?C.green:C.red},
        ].map(k=>(
          <div key={k.label} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 16px",borderLeft:`3px solid ${k.color}`}}>
            <div style={{fontSize:8,color:C.textSub,fontFamily:C.sans,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:3}}>{k.label}</div>
            <div style={{fontSize:15,fontWeight:800,color:k.color,fontFamily:C.syne}}>{k.value}</div>
            {k.sub && <div style={{fontSize:9,color:C.textSub,fontFamily:C.mono,marginTop:2}}>{k.sub}</div>}
          </div>
        ))}
      </div>
      <Panel title="MARGIN PER PO — ESTIMASI VS REAL">
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",minWidth:650}}>
            <thead><tr style={{background:"#0e204055"}}>
              {["PO","Model","Penjualan","HPP","Margin Est","Margin Real","Gap"].map(h=>(
                <th key={h} style={{...TH_KEU,textAlign:h==="PO"||h==="Model"?"left":"right"}}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {PO_LIST_KEU.map((po,i)=>{
                const biaya = jurnal.filter(j=>j.idPO===po.kode&&j.tipe==="keluar").reduce((s,j)=>s+j.jumlah,0);
                const me = po.totalHargaJual-po.hpp;
                const mr = po.totalHargaJual-biaya;
                return (
                  <tr key={po.kode} style={{borderBottom:`1px solid ${C.border}`}}>
                    <td style={TD_KEU(i)}><span style={{fontFamily:C.mono,fontWeight:700,color:C.cyan}}>{po.kode}</span></td>
                    <td style={TD_KEU(i)}>{po.model}</td>
                    <td style={{...TD_KEU(i),textAlign:"right"}}>{rp(po.totalHargaJual)}</td>
                    <td style={{...TD_KEU(i),textAlign:"right",color:C.textSub}}>{rp(po.hpp)}</td>
                    <td style={{...TD_KEU(i),textAlign:"right",color:C.cyan}}>{rp(me)}</td>
                    <td style={{...TD_KEU(i),textAlign:"right",color:mr>=me?C.green:C.red}}>{rp(mr)}</td>
                    <td style={{...TD_KEU(i),textAlign:"right",fontWeight:700,color:mr>=me?C.green:C.red}}>{(mr-me>=0?"+":"")+rp(mr-me)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

// ── MAIN EXPORT: TAB KEUANGAN ────────────────────────────────────────────────
const TABS_KEU=[
  {id:"ringkasan",   label:"Ringkasan",      color:C.cyan},
  {id:"jurnal",      label:"Jurnal Umum",    color:C.green},
  {id:"laporan_po",  label:"Laporan PO",     color:C.blue},
  {id:"laporan_margin",label:"Laporan Margin",color:C.yellow},
];

function TabKeuangan({defaultTab="ringkasan", jurnal, setJurnal, inventory, setInventory, trxMasuk, setTrxMasuk}) {
  const [activeTab,setActiveTab] = useState(defaultTab);
  return (
    <div>
      <div style={{display:"flex",gap:6,marginBottom:20,paddingBottom:16,borderBottom:`1px solid ${C.border}`}}>
        {TABS_KEU.map(t=>(
          <button key={t.id} onClick={()=>setActiveTab(t.id)}
            style={{padding:"7px 16px",fontSize:10,fontWeight:700,fontFamily:C.mono,
              background:activeTab===t.id?`${t.color}22`:"transparent",
              color:activeTab===t.id?t.color:C.textSub,
              border:`1px solid ${activeTab===t.id?t.color+"55":C.border}`,
              borderRadius:8,cursor:"pointer",transition:"all 0.1s"}}>
            {t.label}
          </button>
        ))}
      </div>
      <div style={{marginBottom:14}}>
        <div style={{fontSize:10,color:C.textSub,fontFamily:C.mono,letterSpacing:"0.07em"}}>
          KEUANGAN / {TABS_KEU.find(t=>t.id===activeTab)?.label.toUpperCase()}
        </div>
      </div>
      {activeTab==="ringkasan"      && <KeuRingkasan jurnal={jurnal}/>}
      {activeTab==="jurnal"         && <JurnalUmum jurnal={jurnal} setJurnal={setJurnal} inventory={inventory} setInventory={setInventory} trxMasuk={trxMasuk} setTrxMasuk={setTrxMasuk}/>}
      {activeTab==="laporan_po"     && <KeuLaporanPO jurnal={jurnal}/>}
      {activeTab==="laporan_margin" && <KeuLaporanMargin jurnal={jurnal}/>}
    </div>
  );
}

// --- TAB LAPORAN ---


const TH_LAP={padding:"9px 14px",textAlign:"left",fontSize:9,fontWeight:700,color:C.textSub,textTransform:"uppercase",letterSpacing:"0.07em",fontFamily:C.sans,whiteSpace:"nowrap"};
const TD_LAP=(i)=>({padding:"11px 14px",fontSize:11,color:C.text,fontFamily:C.sans,background:i%2===0?C.card:C.card2});

const PO_DATA=[
  {kode:"PO-0001",klien:"PT. Elysian Garment",model:"Airflow",totalPCS:163,totalHargaJual:29540000,hppEst:21800000,bulanAktif:["2025-03","2025-04"],pcsKirimPerBulan:{"2025-03":34,"2025-04":129},biayaBahan:8500000,biayaUpah:3200000},
  {kode:"PO-0002",klien:"PT. Elysian Garment",model:"Neck",totalPCS:144,totalHargaJual:23760000,hppEst:17600000,bulanAktif:["2025-03","2025-04"],pcsKirimPerBulan:{"2025-03":16,"2025-04":128},biayaBahan:6200000,biayaUpah:2800000},
  {kode:"PO-0003",klien:"CV. Maju Bersama",model:"Storma",totalPCS:96,totalHargaJual:17280000,hppEst:12800000,bulanAktif:["2025-04"],pcsKirimPerBulan:{"2025-04":0},biayaBahan:4100000,biayaUpah:0},
];
const OVERHEAD_PER_BULAN={
  "2025-03":[{id:"OH-001",keterangan:"Listrik Maret",jumlah:850000},{id:"OH-002",keterangan:"Sewa Tempat Maret",jumlah:2500000},{id:"OH-003",keterangan:"Uang Makan Maret",jumlah:1260000}],
  "2025-04":[{id:"OH-004",keterangan:"Listrik April",jumlah:920000},{id:"OH-005",keterangan:"Sewa Tempat April",jumlah:2500000},{id:"OH-006",keterangan:"Uang Makan April",jumlah:1400000},{id:"OH-007",keterangan:"Operasional Lain",jumlah:350000}],
};
const PEMAKAIAN_BAHAN=[
  {po:"PO-0001",artikel:"Airflow Black S",modelSize:"Airflow S",qtyPcs:12,pemakaianPerPcs:1.2,satuan:"meter",hargaBahan:30000},
  {po:"PO-0001",artikel:"Airflow Black M",modelSize:"Airflow M",qtyPcs:12,pemakaianPerPcs:1.3,satuan:"meter",hargaBahan:30000},
  {po:"PO-0001",artikel:"Airflow Black L",modelSize:"Airflow L",qtyPcs:15,pemakaianPerPcs:1.4,satuan:"meter",hargaBahan:30000},
  {po:"PO-0001",artikel:"Airflow Black XL",modelSize:"Airflow XL",qtyPcs:15,pemakaianPerPcs:1.5,satuan:"meter",hargaBahan:30000},
  {po:"PO-0002",artikel:"Neck Black S",modelSize:"Neck S",qtyPcs:18,pemakaianPerPcs:0.9,satuan:"meter",hargaBahan:25000},
  {po:"PO-0002",artikel:"Neck Black M",modelSize:"Neck M",qtyPcs:18,pemakaianPerPcs:1.0,satuan:"meter",hargaBahan:25000},
];
const GAJI_REKAP=[{periode:"01 Apr — 07 Apr 2025",periodeId:"P001",totalDibayar:1850000,detail:[{karyawan:"Budi Santoso",upah:712000,po:"PO-0001"},{karyawan:"Ahmad Fauzi",upah:398000,po:"PO-0001"},{karyawan:"Siti Rahayu",upah:345000,po:"PO-0001"},{karyawan:"Dewi Lestari",upah:395000,po:"PO-0002"}]}];
const REJECT_DATA=[
  {po:"PO-0001",artikel:"Airflow Black S",tahap:"Jahit",jenisReject:"Jahitan Loncat",qty:1,bisaRework:true,statusRework:"selesai"},
  {po:"PO-0001",artikel:"Airflow Black L",tahap:"QC",jenisReject:"Ukuran Tidak Sesuai",qty:2,bisaRework:true,statusRework:"menunggu"},
  {po:"PO-0002",artikel:"Neck Black M",tahap:"QC",jenisReject:"Noda / Kotor",qty:1,bisaRework:false,statusRework:null},
  {po:"PO-0002",artikel:"Neck Black S",tahap:"Cutting",jenisReject:"Cacat Bahan",qty:1,bisaRework:false,statusRework:null},
];
const BULAN_LIST=["2025-03","2025-04"];

function hitungOverheadPO(kodePO,bulan){
  const po=PO_DATA.find(p=>p.kode===kodePO);if(!po) return 0;
  const overheads=OVERHEAD_PER_BULAN[bulan]||[];if(!overheads.length) return 0;
  const totalOH=overheads.reduce((s,o)=>s+o.jumlah,0);
  const totalPCS=PO_DATA.reduce((s,p)=>s+(p.pcsKirimPerBulan[bulan]||0),0);
  if(!totalPCS) return 0;
  return Math.round(totalOH*((po.pcsKirimPerBulan[bulan]||0)/totalPCS));
}
function totalOverheadPO(kodePO){return BULAN_LIST.reduce((s,b)=>s+hitungOverheadPO(kodePO,b),0);}
function totalRealisasiPO(kodePO){const po=PO_DATA.find(p=>p.kode===kodePO);if(!po) return 0;return(po.biayaBahan||0)+(po.biayaUpah||0)+totalOverheadPO(kodePO);}

function LaporanPerBulan() {
  const [bulan,setBulan]=useState("2025-04");
  const overheads=OVERHEAD_PER_BULAN[bulan]||[];
  const totalOH=overheads.reduce((s,o)=>s+o.jumlah,0);
  const totalPCSBulan=PO_DATA.reduce((s,p)=>s+(p.pcsKirimPerBulan[bulan]||0),0);
  const ohPerPCS=totalPCSBulan>0?Math.round(totalOH/totalPCSBulan):0;
  const poAktif=PO_DATA.filter(p=>p.bulanAktif.includes(bulan));
  const bulanLabel=(b)=>new Date(b+"-01").toLocaleDateString("id-ID",{month:"long",year:"numeric"});
  return (
    <div>
      <div style={{display:"flex",gap:8,marginBottom:16,alignItems:"center"}}>
        <span style={{fontSize:9,color:C.textSub,fontFamily:C.sans,textTransform:"uppercase",letterSpacing:"0.07em"}}>Bulan:</span>
        {BULAN_LIST.map(b=>(<button key={b} onClick={()=>setBulan(b)} style={{padding:"7px 16px",fontSize:10,fontWeight:700,fontFamily:C.mono,background:bulan===b?C.cyan:"transparent",color:bulan===b?"#000":C.textSub,border:`1px solid ${bulan===b?C.cyan:C.border}`,borderRadius:8,cursor:"pointer"}}>{bulanLabel(b)}</button>))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:16}}>
        {[{label:"Total PCS Terkirim",value:totalPCSBulan+" pcs",color:C.cyan},{label:"Total Overhead",value:rp(totalOH),color:C.orange},{label:"Overhead/PCS",value:rp(ohPerPCS),color:C.yellow,sub:"rata-rata per baju"},{label:"PO Aktif",value:poAktif.length+" PO",color:C.blue}].map(k=>(
          <div key={k.label} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 16px",borderLeft:`3px solid ${k.color}`}}>
            <div style={{fontSize:8,color:C.textSub,fontFamily:C.sans,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:3}}>{k.label}</div>
            <div style={{fontSize:16,fontWeight:800,color:k.color,fontFamily:C.syne}}>{k.value}</div>
            {k.sub&&<div style={{fontSize:9,color:C.textSub,fontFamily:C.sans,marginTop:2}}>{k.sub}</div>}
          </div>
        ))}
      </div>
      <Panel title={`RINCIAN OVERHEAD — ${bulanLabel(bulan)}`} accent={C.orange}>
        <div style={{padding:"14px 18px",borderBottom:`1px solid ${C.border}`,display:"flex",gap:12,flexWrap:"wrap"}}>
          {overheads.map(o=>(<div key={o.id} style={{background:"#050e1f",borderRadius:8,padding:"10px 14px",border:`1px solid ${C.border}`}}><div style={{fontSize:9,color:C.textSub,fontFamily:C.sans,marginBottom:3}}>{o.keterangan}</div><div style={{fontSize:14,fontWeight:700,color:C.orange,fontFamily:C.mono}}>{rp(o.jumlah)}</div></div>))}
          <div style={{background:`${C.orange}10`,borderRadius:8,padding:"10px 14px",border:`1px solid ${C.orange}44`}}><div style={{fontSize:9,color:C.orange,fontFamily:C.sans,marginBottom:3,fontWeight:700}}>TOTAL</div><div style={{fontSize:16,fontWeight:800,color:C.orange,fontFamily:C.syne}}>{rp(totalOH)}</div></div>
        </div>
        <div style={{padding:"10px 18px",background:"#050e1f",borderBottom:`1px solid ${C.border}`}}>
          <span style={{fontSize:11,color:C.text,fontFamily:C.mono}}>{rp(totalOH)} ÷ {totalPCSBulan} pcs = <span style={{color:C.yellow,fontWeight:700}}>{rp(ohPerPCS)} / pcs</span></span>
          <div style={{fontSize:9,color:C.textMid,fontFamily:C.sans,marginTop:3}}>Overhead dibagi ke semua PCS terkirim bulan ini secara proporsional</div>
        </div>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",minWidth:500}}>
            <thead><tr style={{background:"#0e204055"}}>{["PO","Model","PCS Kirim","% dari Total","Alokasi Overhead"].map(h=>(<th key={h} style={{...TH_LAP,textAlign:["PCS Kirim","% dari Total","Alokasi Overhead"].includes(h)?"center":TH_LAP.textAlign}}>{h}</th>))}</tr></thead>
            <tbody>
              {poAktif.map((po,i)=>{const pcs=po.pcsKirimPerBulan[bulan]||0;const alok=hitungOverheadPO(po.kode,bulan);const prop=totalPCSBulan>0?((pcs/totalPCSBulan)*100).toFixed(1):0;return(
                <tr key={po.kode} style={{borderBottom:`1px solid ${C.border}`}}>
                  <td style={TD_LAP(i)}><span style={{fontFamily:C.mono,fontWeight:700,color:C.cyan}}>{po.kode}</span></td>
                  <td style={TD_LAP(i)}><span style={{fontWeight:600}}>{po.model}</span></td>
                  <td style={{...TD_LAP(i),textAlign:"center"}}><span style={{fontFamily:C.syne,fontWeight:800,fontSize:14,color:C.blue}}>{pcs} <span style={{fontSize:10,color:C.textSub,fontWeight:400}}>pcs</span></span></td>
                  <td style={{...TD_LAP(i),textAlign:"center"}}><div><span style={{fontFamily:C.mono,color:C.textSub}}>{prop}%</span><div style={{height:3,background:C.border,borderRadius:99,marginTop:3,overflow:"hidden",width:80,margin:"3px auto 0"}}><div style={{width:`${prop}%`,height:"100%",background:C.orange,borderRadius:99}}/></div></div></td>
                  <td style={{...TD_LAP(i),textAlign:"center"}}><span style={{fontFamily:C.mono,fontWeight:700,color:C.orange}}>{rp(alok)}</span></td>
                </tr>
              );})}
            </tbody>
            <tfoot><tr style={{background:"#0e204055",borderTop:`2px solid ${C.border}`}}><td colSpan={2} style={{padding:"10px 14px",fontSize:10,fontWeight:700,color:C.textSub,fontFamily:C.sans}}>TOTAL</td><td style={{padding:"10px 14px",textAlign:"center",fontFamily:C.mono,fontWeight:800,color:C.blue}}>{totalPCSBulan} pcs</td><td style={{padding:"10px 14px",textAlign:"center",fontFamily:C.mono,color:C.textSub}}>100%</td><td style={{padding:"10px 14px",textAlign:"center",fontFamily:C.mono,fontWeight:800,color:C.orange}}>{rp(totalOH)}</td></tr></tfoot>
          </table>
        </div>
      </Panel>
      <Panel title="BUDGET VS REALISASI PER PO — BULAN INI" accent={C.yellow}>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",minWidth:820}}>
            <thead><tr style={{background:"#0e204055"}}>{["PO","Model","HPP Est","Bahan","Upah","Overhead","Total Real","Gap","Status"].map(h=>(<th key={h} style={{...TH_LAP,textAlign:["HPP Est","Bahan","Upah","Overhead","Total Real","Gap"].includes(h)?"right":TH_LAP.textAlign}}>{h}</th>))}</tr></thead>
            <tbody>
              {poAktif.map((po,i)=>{
                const pcs=po.pcsKirimPerBulan[bulan]||0;const rasio=po.totalPCS>0?pcs/po.totalPCS:0;
                const bhn=Math.round((po.biayaBahan||0)*rasio);const upah=Math.round((po.biayaUpah||0)*rasio);const oh=hitungOverheadPO(po.kode,bulan);const hpp=Math.round((po.hppEst||0)*rasio);const real=bhn+upah+oh;const gap=real-hpp;const boncos=gap>0;
                return(
                  <tr key={po.kode} style={{borderBottom:`1px solid ${C.border}`,background:boncos?`${C.red}06`:i%2===0?C.card:C.card2}}>
                    <td style={TD_LAP(i)}><span style={{fontFamily:C.mono,fontWeight:700,color:C.cyan}}>{po.kode}</span></td>
                    <td style={TD_LAP(i)}><span style={{fontWeight:600}}>{po.model}</span><div style={{fontSize:8,color:C.textSub}}>{pcs} pcs bulan ini</div></td>
                    <td style={{...TD_LAP(i),textAlign:"right"}}><span style={{fontFamily:C.mono,color:C.textSub}}>{rp(hpp)}</span></td>
                    <td style={{...TD_LAP(i),textAlign:"right"}}><span style={{fontFamily:C.mono,color:C.blue}}>{rp(bhn)}</span></td>
                    <td style={{...TD_LAP(i),textAlign:"right"}}><span style={{fontFamily:C.mono,color:C.purple}}>{rp(upah)}</span></td>
                    <td style={{...TD_LAP(i),textAlign:"right"}}><span style={{fontFamily:C.mono,color:C.orange}}>{rp(oh)}</span></td>
                    <td style={{...TD_LAP(i),textAlign:"right"}}><span style={{fontFamily:C.mono,fontWeight:700,color:boncos?C.red:C.green}}>{rp(real)}</span></td>
                    <td style={{...TD_LAP(i),textAlign:"right"}}><span style={{fontFamily:C.mono,fontWeight:700,color:boncos?C.red:C.green}}>{gap>0?"+":""}{rp(gap)}</span></td>
                    <td style={TD_LAP(i)}><span style={{fontSize:9,padding:"2px 8px",borderRadius:99,fontFamily:C.mono,fontWeight:700,background:boncos?`${C.red}15`:`${C.green}15`,color:boncos?C.red:C.green,border:`1px solid ${boncos?C.red+"33":C.green+"33"}`}}>{boncos?"⚠ BONCOS":"✓ AMAN"}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{padding:"10px 18px",borderTop:`1px solid ${C.border}`,fontSize:9,color:C.textMid,fontFamily:C.sans}}>Realisasi bulan ini = proporsi biaya bahan + upah + overhead berdasarkan PCS terkirim bulan ini</div>
      </Panel>
    </div>
  );
}

function LaporanPerPO() {
  const [selectedPO,setSelectedPO]=useState("PO-0001");
  const [showPemakaian,setShowPemakaian]=useState(false);
  const po=PO_DATA.find(p=>p.kode===selectedPO);
  const totalOH=totalOverheadPO(selectedPO);const totalReal=totalRealisasiPO(selectedPO);const gap=totalReal-po.hppEst;
  const marginEst=po.totalHargaJual-po.hppEst;const marginReal=po.totalHargaJual-totalReal;
  const pemakaianPO=PEMAKAIAN_BAHAN.filter(p=>p.po===selectedPO);
  const ohPerBulan=BULAN_LIST.map(b=>({bulan:b,label:new Date(b+"-01").toLocaleDateString("id-ID",{month:"long",year:"numeric"}),pcsKirim:po.pcsKirimPerBulan[b]||0,alokasi:hitungOverheadPO(selectedPO,b),overheads:OVERHEAD_PER_BULAN[b]||[]})).filter(b=>po.bulanAktif.includes(b.bulan));
  return (
    <div>
      <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
        {PO_DATA.map(p=>(<button key={p.kode} onClick={()=>setSelectedPO(p.kode)} style={{padding:"7px 16px",fontSize:10,fontWeight:700,fontFamily:C.mono,background:selectedPO===p.kode?C.cyan:"transparent",color:selectedPO===p.kode?"#000":C.textSub,border:`1px solid ${selectedPO===p.kode?C.cyan:C.border}`,borderRadius:8,cursor:"pointer"}}>{p.kode} — {p.model}</button>))}
      </div>
      <div style={{padding:"16px 20px",background:C.card,border:`1px solid ${gap>0?C.red+"44":C.green+"44"}`,borderRadius:12,marginBottom:16,display:"flex",flexWrap:"wrap",gap:20,alignItems:"center"}}>
        <div><div style={{fontSize:9,color:C.textMid,fontFamily:C.sans}}>Purchase Order</div><div style={{fontSize:22,fontWeight:800,color:C.cyan,fontFamily:C.syne}}>{po.kode}</div><div style={{fontSize:11,color:C.textSub,fontFamily:C.sans}}>{po.klien} · {po.model}</div></div>
        <div><div style={{fontSize:9,color:C.textMid}}>Total PCS</div><div style={{fontSize:18,fontWeight:800,color:C.text,fontFamily:C.syne}}>{po.totalPCS} pcs</div></div>
        <div><div style={{fontSize:9,color:C.textMid}}>Harga Jual</div><div style={{fontSize:14,fontWeight:700,color:C.green,fontFamily:C.mono}}>{rp(po.totalHargaJual)}</div></div>
        <div><div style={{fontSize:9,color:C.textMid}}>HPP Est</div><div style={{fontSize:14,fontWeight:700,color:C.textSub,fontFamily:C.mono}}>{rp(po.hppEst)}</div></div>
        <div><div style={{fontSize:9,color:C.textMid}}>Total Realisasi</div><div style={{fontSize:14,fontWeight:700,color:gap>0?C.red:C.green,fontFamily:C.mono}}>{rp(totalReal)}</div></div>
        <div style={{marginLeft:"auto",padding:"8px 16px",background:gap>0?`${C.red}15`:`${C.green}15`,border:`1px solid ${gap>0?C.red:C.green}44`,borderRadius:8}}>
          <div style={{fontSize:9,color:gap>0?C.red:C.green,fontFamily:C.mono,fontWeight:700}}>{gap>0?"⚠ OVER BUDGET":"✓ DALAM BUDGET"}</div>
          <div style={{fontSize:16,fontWeight:800,color:gap>0?C.red:C.green,fontFamily:C.syne}}>{gap>0?"+":""}{rp(gap)}</div>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:16}}>
        {[{label:"Margin Est",value:rp(marginEst),sub:pct(marginEst,po.totalHargaJual),color:C.cyan},{label:"Margin Real",value:rp(marginReal),sub:pct(marginReal,po.totalHargaJual),color:marginReal>=marginEst?C.green:C.red},{label:"Gap Margin",value:(marginReal-marginEst>=0?"+":"")+rp(marginReal-marginEst),color:marginReal>=marginEst?C.green:C.red},{label:"Status",value:gap>0?"BONCOS":"PROFIT",color:gap>0?C.red:C.green}].map(k=>(
          <div key={k.label} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 16px",borderLeft:`3px solid ${k.color}`}}>
            <div style={{fontSize:8,color:C.textSub,fontFamily:C.sans,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:3}}>{k.label}</div>
            <div style={{fontSize:15,fontWeight:800,color:k.color,fontFamily:C.syne}}>{k.value}</div>
            {k.sub&&<div style={{fontSize:9,color:C.textSub,fontFamily:C.mono,marginTop:2}}>{k.sub}</div>}
          </div>
        ))}
      </div>
      <Panel title="BREAKDOWN BIAYA REALISASI" accent={C.yellow}>
        <div style={{padding:"16px 20px"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:16}}>
            {[{label:"Biaya Bahan Baku",value:po.biayaBahan||0,color:C.blue,icon:"🧵",desc:"dari data cutting"},{label:"Biaya Upah",value:po.biayaUpah||0,color:C.purple,icon:"👷",desc:"dari rekap gaji terbayar"},{label:"Overhead Dialokasi",value:totalOH,color:C.orange,icon:"⚡",desc:"dibagi proporsional PCS"}].map(k=>{
              const p=totalReal>0?((k.value/totalReal)*100).toFixed(1):0;
              return(<div key={k.label} style={{background:"#050e1f",borderRadius:10,padding:"14px 16px",border:`1px solid ${k.color}33`}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{fontSize:11,color:C.textSub,fontFamily:C.sans}}>{k.icon} {k.label}</span><span style={{fontSize:9,color:k.color,fontFamily:C.mono,fontWeight:700}}>{p}%</span></div>
                <div style={{fontSize:18,fontWeight:800,color:k.color,fontFamily:C.syne,marginBottom:4}}>{rp(k.value)}</div>
                <div style={{height:4,background:C.border,borderRadius:99,overflow:"hidden",marginBottom:4}}><div style={{width:`${p}%`,height:"100%",background:k.color,borderRadius:99}}/></div>
                <div style={{fontSize:9,color:C.textMid,fontFamily:C.sans}}>{k.desc}</div>
              </div>);
            })}
          </div>
          <div style={{background:"#050e1f",borderRadius:8,border:`1px solid ${C.border}`,overflow:"hidden"}}>
            {[{label:"Biaya Bahan Baku",value:po.biayaBahan||0,color:C.blue},{label:"Biaya Upah (terbayar)",value:po.biayaUpah||0,color:C.purple},{label:"Total Overhead Dialokasi",value:totalOH,color:C.orange}].map((k,i)=>(
              <div key={k.label} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 16px",borderBottom:`1px solid ${C.border}`,background:i%2===0?"transparent":"#070f1f"}}>
                <span style={{fontSize:11,color:C.textSub,fontFamily:C.sans}}>{k.label}</span>
                <span style={{fontFamily:C.mono,fontWeight:700,color:k.color}}>{rp(k.value)}</span>
              </div>
            ))}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 16px",background:`${gap>0?C.red:C.green}08`,borderTop:`2px solid ${gap>0?C.red:C.green}44`}}>
              <span style={{fontSize:12,fontWeight:700,color:C.text,fontFamily:C.sans}}>TOTAL REALISASI</span>
              <div style={{textAlign:"right"}}>
                <div style={{fontFamily:C.mono,fontWeight:800,fontSize:16,color:gap>0?C.red:C.green}}>{rp(totalReal)}</div>
                <div style={{fontSize:9,color:C.textSub,fontFamily:C.mono}}>vs HPP Est: {rp(po.hppEst)}</div>
              </div>
            </div>
          </div>
        </div>
      </Panel>
      <Panel title="DETAIL OVERHEAD PER BULAN" accent={C.orange}>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",minWidth:600}}>
            <thead><tr style={{background:"#0e204055"}}>{["Bulan","PCS Terkirim","Total OH Bulan","Alokasi ke PO","Rincian"].map(h=>(<th key={h} style={{...TH_LAP,textAlign:["PCS Terkirim","Total OH Bulan","Alokasi ke PO"].includes(h)?"center":TH_LAP.textAlign}}>{h}</th>))}</tr></thead>
            <tbody>
              {ohPerBulan.map((b,i)=>{const totalOHB=b.overheads.reduce((s,o)=>s+o.jumlah,0);return(
                <tr key={b.bulan} style={{borderBottom:`1px solid ${C.border}`}}>
                  <td style={TD_LAP(i)}><span style={{fontWeight:600}}>{b.label}</span></td>
                  <td style={{...TD_LAP(i),textAlign:"center"}}><span style={{fontFamily:C.syne,fontWeight:800,color:C.blue}}>{b.pcsKirim} pcs</span></td>
                  <td style={{...TD_LAP(i),textAlign:"center"}}><span style={{fontFamily:C.mono,color:C.textSub}}>{rp(totalOHB)}</span></td>
                  <td style={{...TD_LAP(i),textAlign:"center"}}><span style={{fontFamily:C.mono,fontWeight:700,color:C.orange}}>{rp(b.alokasi)}</span></td>
                  <td style={TD_LAP(i)}><div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{b.overheads.map(o=>(<span key={o.id} style={{fontSize:8,padding:"1px 6px",borderRadius:3,background:`${C.orange}15`,color:C.orange,fontFamily:C.sans}}>{o.keterangan}: {rp(o.jumlah)}</span>))}</div></td>
                </tr>
              );})}
            </tbody>
            <tfoot><tr style={{background:"#0e204055",borderTop:`2px solid ${C.border}`}}><td style={{padding:"10px 14px",fontSize:10,fontWeight:700,color:C.textSub,fontFamily:C.sans}}>TOTAL</td><td style={{padding:"10px 14px",textAlign:"center",fontFamily:C.mono,fontWeight:700,color:C.blue}}>{ohPerBulan.reduce((s,b)=>s+b.pcsKirim,0)} pcs</td><td/><td style={{padding:"10px 14px",textAlign:"center",fontFamily:C.mono,fontWeight:800,color:C.orange}}>{rp(totalOH)}</td><td/></tr></tfoot>
          </table>
        </div>
      </Panel>
      <Panel title="PEMAKAIAN BAHAN DARI CUTTING" action={showPemakaian?"▾ TUTUP":"▸ DETAIL"} onAction={()=>setShowPemakaian(!showPemakaian)} accent={C.blue}>
        {showPemakaian&&(pemakaianPO.length>0?(
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",minWidth:580}}>
              <thead><tr style={{background:"#0e204055"}}>{["Artikel","Model/Size","QTY","Pemakaian/Pcs","Total Pakai","Harga Bahan","Total Biaya"].map(h=>(<th key={h} style={{...TH_LAP,textAlign:["QTY","Total Pakai","Harga Bahan","Total Biaya"].includes(h)?"right":TH_LAP.textAlign}}>{h}</th>))}</tr></thead>
              <tbody>
                {pemakaianPO.map((p,i)=>{const tp=p.qtyPcs*p.pemakaianPerPcs;const tb=tp*p.hargaBahan;return(
                  <tr key={p.artikel} style={{borderBottom:`1px solid ${C.border}`}}>
                    <td style={TD_LAP(i)}><span style={{fontWeight:600}}>{p.artikel}</span></td>
                    <td style={TD_LAP(i)}><span style={{fontFamily:C.mono,fontSize:10,color:C.blue}}>{p.modelSize}</span></td>
                    <td style={{...TD_LAP(i),textAlign:"right"}}><span style={{fontFamily:C.mono,fontWeight:700}}>{p.qtyPcs}</span></td>
                    <td style={{...TD_LAP(i),textAlign:"right"}}><span style={{fontFamily:C.mono,color:C.textSub}}>{p.pemakaianPerPcs} {p.satuan}</span></td>
                    <td style={{...TD_LAP(i),textAlign:"right"}}><span style={{fontFamily:C.mono,fontWeight:700,color:C.cyan}}>{tp.toFixed(2)} {p.satuan}</span></td>
                    <td style={{...TD_LAP(i),textAlign:"right"}}><span style={{fontFamily:C.mono,color:C.textSub}}>{rp(p.hargaBahan)}/{p.satuan}</span></td>
                    <td style={{...TD_LAP(i),textAlign:"right"}}><span style={{fontFamily:C.mono,fontWeight:700,color:C.green}}>{rp(tb)}</span></td>
                  </tr>
                );})}
              </tbody>
              <tfoot><tr style={{background:"#0e204055",borderTop:`2px solid ${C.border}`}}><td colSpan={5} style={{padding:"10px 14px",fontSize:10,fontWeight:700,color:C.textSub,fontFamily:C.sans}}>TOTAL BIAYA BAHAN</td><td/><td style={{padding:"10px 14px",textAlign:"right",fontFamily:C.mono,fontWeight:800,color:C.green}}>{rp(pemakaianPO.reduce((s,p)=>s+p.qtyPcs*p.pemakaianPerPcs*p.hargaBahan,0))}</td></tr></tfoot>
            </table>
          </div>
        ):<div style={{padding:"20px",textAlign:"center",fontSize:10,color:C.textMid,fontFamily:C.sans}}>Belum ada data pemakaian bahan dari Cutting untuk PO ini.</div>)}
      </Panel>
    </div>
  );
}

function LaporanGaji() {
  const totalGaji=GAJI_REKAP.reduce((s,p)=>s+p.totalDibayar,0);
  const totalPerPO={};GAJI_REKAP.forEach(p=>p.detail.forEach(d=>{if(!totalPerPO[d.po])totalPerPO[d.po]=0;totalPerPO[d.po]+=d.upah;}));
  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:16}}>
        {[{label:"Total Gaji Dibayar",value:rp(totalGaji),color:C.green},{label:"Periode Tercatat",value:GAJI_REKAP.length+" periode",color:C.cyan},{label:"Total Karyawan",value:GAJI_REKAP.reduce((s,p)=>s+p.detail.length,0)+" orang",color:C.purple}].map(k=>(
          <div key={k.label} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 16px",borderLeft:`3px solid ${k.color}`}}>
            <div style={{fontSize:8,color:C.textSub,fontFamily:C.sans,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:3}}>{k.label}</div>
            <div style={{fontSize:16,fontWeight:800,color:k.color,fontFamily:C.syne}}>{k.value}</div>
          </div>
        ))}
      </div>
      <Panel title="ALOKASI UPAH PER PO" accent={C.purple}>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr style={{background:"#0e204055"}}>{["PO","Model","Total Upah","% dari Total"].map(h=>(<th key={h} style={{...TH_LAP,textAlign:["Total Upah","% dari Total"].includes(h)?"right":TH_LAP.textAlign}}>{h}</th>))}</tr></thead>
            <tbody>{Object.entries(totalPerPO).map(([po,total],i)=>{const pd=PO_DATA.find(p=>p.kode===po);return(<tr key={po} style={{borderBottom:`1px solid ${C.border}`}}><td style={TD_LAP(i)}><span style={{fontFamily:C.mono,fontWeight:700,color:C.cyan}}>{po}</span></td><td style={TD_LAP(i)}><span style={{fontWeight:600}}>{pd?.model||"—"}</span></td><td style={{...TD_LAP(i),textAlign:"right"}}><span style={{fontFamily:C.mono,fontWeight:700,color:C.purple}}>{rp(total)}</span></td><td style={{...TD_LAP(i),textAlign:"right"}}><span style={{fontFamily:C.mono,color:C.textSub}}>{pct(total,totalGaji)}</span></td></tr>);})}</tbody>
          </table>
        </div>
      </Panel>
      {GAJI_REKAP.map(p=>(<Panel key={p.periodeId} title={`REKAP — ${p.periode}`} accent={C.green}>
        <div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr style={{background:"#0e204055"}}>{["Karyawan","PO","Upah"].map(h=>(<th key={h} style={{...TH_LAP,textAlign:h==="Upah"?"right":TH_LAP.textAlign}}>{h}</th>))}</tr></thead>
          <tbody>{p.detail.map((d,i)=>(<tr key={d.karyawan} style={{borderBottom:`1px solid ${C.border}`}}><td style={TD_LAP(i)}><span style={{fontWeight:600}}>{d.karyawan}</span></td><td style={TD_LAP(i)}><span style={{fontFamily:C.mono,fontSize:10,color:C.blue,fontWeight:700}}>{d.po}</span></td><td style={{...TD_LAP(i),textAlign:"right"}}><span style={{fontFamily:C.mono,fontWeight:700,color:C.green}}>{rp(d.upah)}</span></td></tr>))}</tbody>
          <tfoot><tr style={{background:"#0e204055",borderTop:`2px solid ${C.border}`}}><td colSpan={2} style={{padding:"10px 14px",fontSize:10,fontWeight:700,color:C.textSub,fontFamily:C.sans}}>TOTAL</td><td style={{padding:"10px 14px",textAlign:"right",fontFamily:C.mono,fontWeight:800,color:C.green}}>{rp(p.totalDibayar)}</td></tr></tfoot>
        </table></div>
      </Panel>))}
    </div>
  );
}

function LaporanReject() {
  const totalR=REJECT_DATA.reduce((s,r)=>s+r.qty,0);const bisaR=REJECT_DATA.filter(r=>r.bisaRework);const tidakR=REJECT_DATA.filter(r=>!r.bisaRework);const sudahR=bisaR.filter(r=>r.statusRework==="selesai");
  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:16}}>
        {[{label:"Total Reject",value:totalR+" pcs",color:C.red},{label:"Bisa Rework",value:bisaR.reduce((s,r)=>s+r.qty,0)+" pcs",color:C.yellow},{label:"Sudah Dirework",value:sudahR.reduce((s,r)=>s+r.qty,0)+" pcs",color:C.green},{label:"Tidak Bisa",value:tidakR.reduce((s,r)=>s+r.qty,0)+" pcs",color:C.red}].map(k=>(
          <div key={k.label} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 16px",borderLeft:`3px solid ${k.color}`}}>
            <div style={{fontSize:8,color:C.textSub,fontFamily:C.sans,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:3}}>{k.label}</div>
            <div style={{fontSize:18,fontWeight:800,color:k.color,fontFamily:C.syne}}>{k.value}</div>
          </div>
        ))}
      </div>
      <Panel title="DETAIL REJECT PER PO" accent={C.red}>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",minWidth:640}}>
            <thead><tr style={{background:"#0e204055"}}>{["PO","Artikel","Tahap","Jenis Reject","QTY","Bisa Rework","Status Rework"].map(h=>(<th key={h} style={{...TH_LAP,textAlign:h==="QTY"?"center":TH_LAP.textAlign}}>{h}</th>))}</tr></thead>
            <tbody>{REJECT_DATA.map((r,i)=>(<tr key={i} style={{borderBottom:`1px solid ${C.border}`}}>
              <td style={TD_LAP(i)}><span style={{fontFamily:C.mono,fontWeight:700,color:C.cyan}}>{r.po}</span></td>
              <td style={TD_LAP(i)}><span style={{fontWeight:600,fontSize:10}}>{r.artikel}</span></td>
              <td style={TD_LAP(i)}><span style={{fontSize:9,fontFamily:C.mono,color:C.blue}}>{r.tahap}</span></td>
              <td style={TD_LAP(i)}><span style={{color:C.orange,fontSize:10}}>{r.jenisReject}</span></td>
              <td style={{...TD_LAP(i),textAlign:"center"}}><span style={{fontFamily:C.syne,fontWeight:800,fontSize:14,color:C.red}}>{r.qty}</span></td>
              <td style={TD_LAP(i)}><span style={{fontSize:9,padding:"2px 7px",borderRadius:99,fontFamily:C.mono,fontWeight:700,background:r.bisaRework?`${C.green}15`:`${C.red}15`,color:r.bisaRework?C.green:C.red}}>{r.bisaRework?"BISA":"TIDAK"}</span></td>
              <td style={TD_LAP(i)}>{r.statusRework?(<span style={{fontSize:9,padding:"2px 7px",borderRadius:99,fontFamily:C.mono,fontWeight:700,background:r.statusRework==="selesai"?`${C.green}15`:`${C.yellow}15`,color:r.statusRework==="selesai"?C.green:C.yellow}}>{r.statusRework==="selesai"?"✓ SELESAI":"⏳ MENUNGGU"}</span>):<span style={{color:C.textMid}}>—</span>}</td>
            </tr>))}</tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

const TABS_LAP=[{id:"per_bulan",label:"Budget vs Realisasi — Per Bulan",color:C.orange},{id:"per_po",label:"Budget vs Realisasi — Per PO",color:C.cyan},{id:"laporan_gaji",label:"Laporan Gaji",color:C.purple},{id:"laporan_reject",label:"Laporan Reject",color:C.red}];

function TabLaporan({defaultTab="per_bulan"}) {
  const [activeTab,setActiveTab]=useState(defaultTab);
  return (
    <div>
      <div style={{marginBottom:14}}><div style={{fontSize:10,color:C.textSub,fontFamily:C.mono,letterSpacing:"0.07em"}}>LAPORAN / {TABS_LAP.find(t=>t.id===activeTab)?.label.toUpperCase()}</div></div>
      {activeTab==="per_bulan"&&<LaporanPerBulan/>}
      {activeTab==="per_po"&&<LaporanPerPO/>}
      {activeTab==="laporan_gaji"&&<LaporanGaji/>}
      {activeTab==="laporan_reject"&&<LaporanReject/>}
    </div>
  );
}



// --- TAB KOREKSI DATA ---
function TabKoreksi({koreksiQueue,setKoreksiQueue,sharedBundleDB,setSharedBundleDB}) {
  const [filterStatus,setFilterStatus]=useState("semua");
  const [filterTipe,setFilterTipe]=useState("semua");
  const [modalDetail,setModalDetail]=useState(null);
  const [confirmAction,setConfirmAction]=useState(null);
  const [authCode,setAuthCode]=useState("");
  const [authError,setAuthError]=useState(false);

  const pending=koreksiQueue.filter(k=>k.status==="pending");
  const approved=koreksiQueue.filter(k=>k.status==="approved");
  const rejected=koreksiQueue.filter(k=>k.status==="rejected");

  const filtered=koreksiQueue.filter(k=>{
    if(filterStatus!=="semua"&&k.status!==filterStatus) return false;
    if(filterTipe!=="semua"&&k.tipe!==filterTipe) return false;
    return true;
  });

  function handleApprove(kor){
    setKoreksiQueue(q=>q.map(k=>k.id===kor.id?{...k,status:"approved",reviewWaktu:new Date().toLocaleString("sv-SE").replace("T"," ").slice(0,16),reviewBy:"Owner"}:k));
    // Update bundleDB: unblock — keep qtySelesai as-is (approved)
    setSharedBundleDB(db=>{
      const b=db[kor.barcode];if(!b) return db;
      const st={...b.statusTahap[kor.tahap],koreksiStatus:"approved"};
      return {...db,[kor.barcode]:{...b,statusTahap:{...b.statusTahap,[kor.tahap]:st}}};
    });
    setConfirmAction(null);setAuthCode("");setAuthError(false);
  }

  function handleReject(kor){
    setKoreksiQueue(q=>q.map(k=>k.id===kor.id?{...k,status:"rejected",reviewWaktu:new Date().toLocaleString("sv-SE").replace("T"," ").slice(0,16),reviewBy:"Owner"}:k));
    // Update bundleDB: revert qtySelesai back to qtyTarget, unblock
    setSharedBundleDB(db=>{
      const b=db[kor.barcode];if(!b) return db;
      const st={...b.statusTahap[kor.tahap],koreksiStatus:"rejected",qtySelesai:kor.qtyTarget};
      return {...db,[kor.barcode]:{...b,statusTahap:{...b.statusTahap,[kor.tahap]:st}}};
    });
    setConfirmAction(null);setAuthCode("");setAuthError(false);
  }

  function handleAuth(){
    if(authCode!==OWNER_CODE){setAuthError(true);return;}
    if(confirmAction.action==="approve") handleApprove(confirmAction.kor);
    else handleReject(confirmAction.kor);
  }

  const selectStyle={background:"#050e1f",border:`1px solid ${C.border2}`,borderRadius:6,padding:"6px 10px",fontSize:10,color:C.text,fontFamily:C.sans,outline:"none"};
  const TH2={padding:"8px 12px",textAlign:"left",fontSize:9,fontWeight:700,color:C.textSub,textTransform:"uppercase",letterSpacing:"0.06em",fontFamily:C.sans,whiteSpace:"nowrap"};
  const TD2=(i)=>({padding:"10px 12px",fontSize:11,color:C.text,fontFamily:C.sans,background:i%2===0?C.card:C.card2});

  return (
    <div>
      {/* KPI Cards */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:"14px 18px",borderLeft:`3px solid ${C.yellow}`}}>
          <div style={{fontSize:8,color:C.textSub,fontFamily:C.sans,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:4}}>Menunggu Review</div>
          <div style={{fontSize:24,fontWeight:800,color:C.yellow,fontFamily:C.syne}}>{pending.length}</div>
          {pending.length>0&&<div style={{fontSize:9,color:C.yellow,fontFamily:C.sans,marginTop:2}}>⚠ Perlu tindakan Owner</div>}
        </div>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:"14px 18px",borderLeft:`3px solid ${C.green}`}}>
          <div style={{fontSize:8,color:C.textSub,fontFamily:C.sans,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:4}}>Disetujui</div>
          <div style={{fontSize:24,fontWeight:800,color:C.green,fontFamily:C.syne}}>{approved.length}</div>
        </div>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:"14px 18px",borderLeft:`3px solid ${C.red}`}}>
          <div style={{fontSize:8,color:C.textSub,fontFamily:C.sans,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:4}}>Ditolak</div>
          <div style={{fontSize:24,fontWeight:800,color:C.red,fontFamily:C.syne}}>{rejected.length}</div>
        </div>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:"14px 18px",borderLeft:`3px solid ${C.cyan}`}}>
          <div style={{fontSize:8,color:C.textSub,fontFamily:C.sans,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:4}}>Total Koreksi</div>
          <div style={{fontSize:24,fontWeight:800,color:C.cyan,fontFamily:C.syne}}>{koreksiQueue.length}</div>
        </div>
      </div>

      {/* Filter */}
      <Panel title="FILTER KOREKSI" accent={C.textSub}>
        <div style={{padding:"12px 18px",display:"flex",gap:14,alignItems:"flex-end"}}>
          <div>
            <div style={{fontSize:9,color:C.textSub,fontFamily:C.sans,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:4}}>Status</div>
            <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} style={selectStyle}>
              <option value="semua">Semua</option>
              <option value="pending">Menunggu</option>
              <option value="approved">Disetujui</option>
              <option value="rejected">Ditolak</option>
            </select>
          </div>
          <div>
            <div style={{fontSize:9,color:C.textSub,fontFamily:C.sans,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:4}}>Tipe</div>
            <select value={filterTipe} onChange={e=>setFilterTipe(e.target.value)} style={selectStyle}>
              <option value="semua">Semua</option>
              <option value="lebih">QTY Lebih</option>
              <option value="kurang">QTY Kurang</option>
            </select>
          </div>
          {(filterStatus!=="semua"||filterTipe!=="semua")&&(
            <button onClick={()=>{setFilterStatus("semua");setFilterTipe("semua");}}
              style={{padding:"6px 14px",fontSize:9,fontWeight:700,fontFamily:C.mono,background:`${C.red}15`,color:C.red,border:`1px solid ${C.red}33`,borderRadius:6,cursor:"pointer"}}>
              ✗ RESET
            </button>
          )}
        </div>
      </Panel>

      {/* Pending Section */}
      {pending.length > 0 && (
        <Panel title={`⚠ PENDING REVIEW OWNER — ${pending.length} ITEM`} accent={C.yellow}>
          <div style={{ padding: "12px 24px", fontSize: 11, color: C.yellow, background: `${C.yellow}08`, borderBottom: `1px solid ${C.yellow}22`, fontWeight: 600 }}>
            Bundle di bawah ini memerlukan otorisasi Owner untuk melanjutkan ke tahap berikutnya.
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 1000 }}>
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.02)" }}>
                  {["WAKTU", "PO", "ARTIKEL", "TAHAP", "KARYAWAN", "TARGET", "AKTUAL", "SELISIH", "ALASAN", "AKSI"].map(h => (
                    <th key={h} style={TH2}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pending.map((k, i) => (
                  <tr key={k.id} style={{ borderBottom: `1px solid ${C.border}`, background: i % 2 === 0 ? "rgba(255,255,255,0.01)" : "transparent" }}>
                    <td style={TD2(i)}><span style={{ fontFamily: C.mono, fontSize: 11, color: C.textSub }}>{k.waktu}</span></td>
                    <td style={TD2(i)}><span style={{ fontFamily: C.mono, fontSize: 12, fontWeight: 700, color: C.cyan }}>{k.po}</span></td>
                    <td style={TD2(i)}><span style={{ fontWeight: 600, fontSize: 13 }}>{k.model} {k.warna} {k.size}</span></td>
                    <td style={TD2(i)}>
                      <span style={{ fontSize: 9, fontWeight: 800, padding: "4px 10px", borderRadius: 8, fontFamily: C.mono, background: `${TAHAP_COL[k.tahap]}15`, color: TAHAP_COL[k.tahap] || C.textSub, border: `1px solid ${TAHAP_COL[k.tahap]}22` }}>
                        {k.tahapLabel}
                      </span>
                    </td>
                    <td style={TD2(i)}><span style={{ fontSize: 12, color: C.textMid }}>{k.karyawan}</span></td>
                    <td style={{ ...TD2(i), textAlign: "center" }}><span style={{ fontFamily: C.mono, fontWeight: 700, color: C.textSub }}>{k.qtyTarget}</span></td>
                    <td style={{ ...TD2(i), textAlign: "center" }}><span style={{ fontFamily: C.mono, fontWeight: 800, color: k.tipe === "lebih" ? C.red : C.yellow }}>{k.qtyAktual}</span></td>
                    <td style={{ ...TD2(i), textAlign: "center" }}><span style={{ fontFamily: C.mono, fontWeight: 800, color: k.selisih > 0 ? C.red : C.yellow }}>{k.selisih > 0 ? "+" : ""}{k.selisih}</span></td>
                    <td style={TD2(i)}><span style={{ fontSize: 12, fontStyle: "italic", color: C.textMid }}>{k.alasan || "-"}</span></td>
                    <td style={TD2(i)}>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={() => setConfirmAction({ action: "approve", kor: k })}
                          style={{ padding: "6px 12px", fontSize: 10, fontWeight: 800, background: C.green, color: "#000", border: "none", borderRadius: 8, cursor: "pointer", transition: "all 0.2s" }}>✓ APPROVE</button>
                        {k.tipe === "lebih" && (
                          <button onClick={() => setConfirmAction({ action: "reject", kor: k })}
                            style={{ padding: "6px 12px", fontSize: 10, fontWeight: 800, background: C.red, color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", transition: "all 0.2s" }}>✗ REJECT</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}

      {/* Riwayat */}
      <Panel title={`HISTORI KOREKSI — ${filtered.filter(k => k.status !== "pending").length} ENTRI`} accent={C.textSub}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 1000 }}>
            <thead>
              <tr style={{ background: "rgba(255,255,255,0.02)" }}>
                {["STATUS", "WAKTU", "PO", "ARTIKEL", "TAHAP", "KARYAWAN", "TARGET", "AKTUAL", "SELISIH", "REVIEW BY"].map(h => (
                  <th key={h} style={TH2}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.filter(k => k.status !== "pending").length === 0 ? (
                <tr><td colSpan={10} style={{ padding: "60px", textAlign: "center", color: C.textMid, fontFamily: C.sans, fontSize: 13, opacity: 0.6 }}>Belum ada histori koreksi untuk filter ini.</td></tr>
              ) : filtered.filter(k => k.status !== "pending").map((k, i) => {
                const st = k.status === "approved" ? { col: C.green, bg: `${C.green}15`, label: "APPROVED" } : { col: C.red, bg: `${C.red}15`, label: "REJECTED" };
                return (
                  <tr key={k.id} style={{ borderBottom: `1px solid ${C.border}`, background: i % 2 === 0 ? "rgba(255,255,255,0.01)" : "transparent" }}>
                    <td style={TD2(i)}>
                      <span style={{ fontSize: 9, fontWeight: 800, padding: "4px 10px", borderRadius: 8, fontFamily: C.mono, background: st.bg, color: st.col, border: `1px solid ${st.col}22` }}>{st.label}</span>
                    </td>
                    <td style={TD2(i)}><span style={{ fontFamily: C.mono, fontSize: 11, color: C.textSub }}>{k.waktu}</span></td>
                    <td style={TD2(i)}><span style={{ fontFamily: C.mono, fontSize: 12, fontWeight: 700 }}>{k.po}</span></td>
                    <td style={TD2(i)}><span style={{ fontSize: 13, color: C.textMid }}>{k.model} {k.warna} {k.size}</span></td>
                    <td style={TD2(i)}>
                      <span style={{ fontSize: 9, fontWeight: 700, opacity: 0.7 }}>{k.tahapLabel}</span>
                    </td>
                    <td style={TD2(i)}><span style={{ fontSize: 12 }}>{k.karyawan}</span></td>
                    <td style={{ ...TD2(i), textAlign: "center" }}><span style={{ fontFamily: C.mono }}>{k.qtyTarget}</span></td>
                    <td style={{ ...TD2(i), textAlign: "center" }}><span style={{ fontFamily: C.mono, fontWeight: 700, color: k.status === "rejected" ? C.textSub : C.text }}>{k.status === "rejected" ? k.qtyTarget : k.qtyAktual}</span></td>
                    <td style={{ ...TD2(i), textAlign: "center" }}><span style={{ fontFamily: C.mono, color: k.selisih > 0 ? C.red : C.yellow }}>{k.selisih > 0 ? "+" : ""}{k.selisih}</span></td>
                    <td style={TD2(i)}>
                      <div style={{ fontSize: 10, color: C.textSub, fontFamily: C.mono }}>
                        {k.reviewBy && <div>{k.reviewBy}</div>}
                        {k.reviewWaktu && <div style={{ opacity: 0.5 }}>{k.reviewWaktu}</div>}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* Modal Konfirmasi dengan Auth */}
      {confirmAction && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(8px)" }}>
          <div style={{ background: C.card, border: `1px solid ${confirmAction.action === "approve" ? C.green : C.red}44`, borderRadius: 20, padding: "32px", width: 480, maxWidth: "92vw", boxShadow: "0 20px 40px rgba(0,0,0,0.4)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
              <MacDots />
              <span style={{ fontSize: 13, fontWeight: 800, color: confirmAction.action === "approve" ? C.green : C.red, fontFamily: C.syne, letterSpacing: "0.05em" }}>
                {confirmAction.action === "approve" ? "APPROVE KOREKSI" : "REJECT KOREKSI"}
              </span>
            </div>
            
            <div style={{ padding: "16px 20px", background: "rgba(0,0,0,0.3)", borderRadius: 12, border: `1px solid ${C.border}`, marginBottom: 20 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                <div><div style={{ fontSize: 9, color: C.textSub, fontFamily: C.sans, textTransform: "uppercase", letterSpacing: "0.05em" }}>PO</div><div style={{ fontSize: 12, color: C.cyan, fontFamily: C.mono, fontWeight: 700 }}>{confirmAction.kor.po}</div></div>
                <div><div style={{ fontSize: 9, color: C.textSub, fontFamily: C.sans, textTransform: "uppercase", letterSpacing: "0.05em" }}>Artikel</div><div style={{ fontSize: 12, color: C.text, fontFamily: C.sans, fontWeight: 700 }}>{confirmAction.kor.model} {confirmAction.kor.warna} {confirmAction.kor.size}</div></div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, borderTop: `1px solid ${C.border}`, paddingTop: 12 }}>
                <div><div style={{ fontSize: 9, color: C.textSub, fontFamily: C.sans }}>TAHAP</div><div style={{ fontSize: 12, color: TAHAP_COL[confirmAction.kor.tahap] || C.text, fontWeight: 700 }}>{confirmAction.kor.tahapLabel}</div></div>
                <div><div style={{ fontSize: 9, color: C.textSub, fontFamily: C.sans }}>KARYAWAN</div><div style={{ fontSize: 12, color: C.text, fontWeight: 700 }}>{confirmAction.kor.karyawan}</div></div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, borderTop: `1px solid ${C.border}`, marginTop: 12, paddingTop: 12 }}>
                <div style={{ textAlign: "center" }}><div style={{ fontSize: 8, color: C.textSub }}>TARGET</div><div style={{ fontSize: 18, fontWeight: 800, color: C.textMid, fontFamily: C.syne }}>{confirmAction.kor.qtyTarget}</div></div>
                <div style={{ textAlign: "center" }}><div style={{ fontSize: 8, color: C.textSub }}>AKTUAL</div><div style={{ fontSize: 18, fontWeight: 800, color: confirmAction.kor.tipe === "lebih" ? C.red : C.yellow, fontFamily: C.syne }}>{confirmAction.kor.qtyAktual}</div></div>
                <div style={{ textAlign: "center" }}><div style={{ fontSize: 8, color: C.textSub }}>SELISIH</div><div style={{ fontSize: 18, fontWeight: 800, color: confirmAction.kor.selisih > 0 ? C.red : C.yellow, fontFamily: C.syne }}>{confirmAction.kor.selisih > 0 ? "+" : ""}{confirmAction.kor.selisih}</div></div>
              </div>
            </div>

            {confirmAction.kor.alasan && (
              <div style={{ padding: "10px 14px", background: `${C.yellow}08`, borderRadius: 10, border: `1px solid ${C.yellow}22`, marginBottom: 20 }}>
                <div style={{ fontSize: 9, color: C.yellow, fontWeight: 700, marginBottom: 4 }}>ALASAN KARYAWAN:</div>
                <div style={{ fontSize: 11, color: C.text, lineHeight: 1.4 }}>{confirmAction.kor.alasan}</div>
              </div>
            )}

            <div style={{ padding: "14px 18px", background: confirmAction.action === "approve" ? `${C.green}08` : `${C.red}08`, borderRadius: 10, border: `1px solid ${confirmAction.action === "approve" ? C.green : C.red}22`, marginBottom: 24 }}>
              <div style={{ fontSize: 11, color: confirmAction.action === "approve" ? C.green : C.red, fontWeight: 600, lineHeight: 1.4 }}>
                {confirmAction.action === "approve"
                  ? (confirmAction.kor.tipe === "lebih"
                    ? `✓ Hasil produksi akan dicatat ${confirmAction.kor.qtyAktual} pcs. Upah dibayar penuh. Bundle dibuka otomatis.`
                    : `✓ Kekurangan (${confirmAction.kor.qtyAktual} pcs) telah divalidasi. Bundle dapat dilanjutkan.`)
                  : `✗ Kelebihan +${confirmAction.kor.selisih} pcs tidak dihitung. QTY dikembalikan ke ${confirmAction.kor.qtyTarget}. Upah dibayar ${confirmAction.kor.qtyTarget} pcs.`}
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 10, color: C.textSub, fontFamily: C.sans, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8, fontWeight: 700 }}>Otorisasi Owner <span style={{ color: C.red }}>*</span></div>
              <input type="password" value={authCode} onChange={e => { setAuthCode(e.target.value); setAuthError(false); }} onKeyDown={e => e.key === "Enter" && handleAuth()}
                placeholder="••••••"
                style={{ width: "100%", background: "rgba(0,0,0,0.2)", border: `1px solid ${authError ? C.red : C.border2}`, borderRadius: 12, padding: "12px", fontSize: 20, color: C.text, fontFamily: C.mono, outline: "none", textAlign: "center", letterSpacing: "0.5em" }} />
              {authError && <div style={{ fontSize: 10, color: C.red, fontFamily: C.sans, marginTop: 6, fontWeight: 600 }}>⚠ KODE OTORISASI SALAH</div>}
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => { setConfirmAction(null); setAuthCode(""); setAuthError(false); }}
                style={{ flex: 1, padding: "12px", borderRadius: 12, background: "rgba(255,255,255,0.05)", border: `1px solid ${C.border}`, color: C.textSub, fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}>BATAL</button>
              <button onClick={handleAuth}
                style={{ flex: 1, padding: "12px", borderRadius: 12, background: confirmAction.action === "approve" ? C.green : C.red, border: "none", color: "#000", fontWeight: 800, cursor: "pointer", transition: "all 0.2s", boxShadow: `0 8px 20px ${confirmAction.action === "approve" ? C.green : C.red}44` }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "none"}>
                {confirmAction.action === "approve" ? "✓ APPROVE" : "✗ REJECT"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// --- AUDIT LOG ---
const AUDIT_DATA = [
  { id: "A001", waktu: "2026-04-10 14:02", user: "EPUL", modul: "Produksi", aksi: "Scan Terima", detail: "Jahit — PO-0001 Airflow Navy XL, BDL-03, 5 pcs", severity: "info" },
  { id: "A002", waktu: "2026-04-10 14:04", user: "EPUL", modul: "Produksi", aksi: "Scan Selesai", detail: "Jahit — PO-0001 Airflow Navy XL, BDL-03, QTY selesai: 5 pcs", severity: "success" },
  { id: "A003", waktu: "2026-04-10 14:08", user: "ABQI", modul: "Produksi", aksi: "Scan Selesai", detail: "Cutting — PO-0004 Dravo Black M, BDL-01, QTY selesai: 8 pcs (target: 6, +2 OVERRIDE)", severity: "warning" },
  { id: "A004", waktu: "2026-04-10 14:10", user: "Owner", modul: "Koreksi", aksi: "Override Approve", detail: "Cutting PO-0004 Dravo Black M BDL-01 — kelebihan +2 pcs disetujui Owner", severity: "warning" },
  { id: "A005", waktu: "2026-04-10 14:12", user: "ABQI", modul: "Penggajian", aksi: "Kasbon Diajukan", detail: "Kasbon Rp 50.000 diajukan oleh ABQI", severity: "info" },
  { id: "A006", waktu: "2026-04-10 14:15", user: "Owner", modul: "Penggajian", aksi: "Bayar Gaji", detail: "EPUL — Upah Bersih Rp 630.000, potong kasbon Rp 0, dibayar Rp 630.000", severity: "success" },
  { id: "A007", waktu: "2026-04-10 14:18", user: "Owner", modul: "Produksi", aksi: "Scan Selesai", detail: "QC — PO-0001 Airflow Black XL, BDL-02, QTY: 5 pcs cleared", severity: "success" },
  { id: "A008", waktu: "2026-04-10 14:20", user: "Owner", modul: "Pengiriman", aksi: "Surat Jalan Dibuat", detail: "SJ-001 — PO-0001 Elyon Store, 34 pcs, kurir: JNE", severity: "info" },
  { id: "A009", waktu: "2026-04-10 14:25", user: "Owner", modul: "Master Data", aksi: "Tambah Data", detail: "Karyawan baru: RUDI — posisi Jahit", severity: "info" },
  { id: "A010", waktu: "2026-04-10 14:30", user: "Owner", modul: "Produksi", aksi: "Input PO", detail: "PO-0008 dibuat — Klien: Elyon Store, Model: Zuno, 80 pcs", severity: "info" },
  { id: "A011", waktu: "2026-04-09 09:15", user: "UJANG", modul: "Produksi", aksi: "Scan Selesai", detail: "Jahit — PO-0002 Neck Navy XXL, BDL-01, QTY selesai: 2 pcs (target: 3, -1 KURANG, alasan: Jahitan loncat)", severity: "error" },
  { id: "A012", waktu: "2026-04-09 09:18", user: "UJANG", modul: "Produksi", aksi: "Reject Ditandai", detail: "Jahit — PO-0002 Neck Navy XXL, BDL-01 — Jahitan loncat, potong upah", severity: "error" },
  { id: "A013", waktu: "2026-04-09 10:00", user: "Owner", modul: "Penggajian", aksi: "Bayar Gaji", detail: "UJANG — Upah Bersih Rp 357.000, potong kasbon Rp 100.000, dibayar Rp 257.000", severity: "success" },
  { id: "A014", waktu: "2026-04-09 10:05", user: "BB", modul: "Produksi", aksi: "Scan Selesai", detail: "Buang Benang — PO-0001 Airflow Navy L, BDL-02, QTY: 3 pcs", severity: "success" },
  { id: "A015", waktu: "2026-04-08 08:30", user: "Owner", modul: "Koreksi", aksi: "Override Reject", detail: "Cutting PO-0001 Airflow Black S BDL-05 — kelebihan +3 pcs DITOLAK oleh Owner", severity: "error" },
  { id: "A016", waktu: "2026-04-08 11:00", user: "Owner", modul: "Pengiriman", aksi: "Surat Jalan Dibuat", detail: "SJ-002 — PO-0002 Elyon Store, 16 pcs, kurir: SiCepat", severity: "info" },
  { id: "A017", waktu: "2026-04-08 13:00", user: "Packing", modul: "Produksi", aksi: "Scan Selesai", detail: "Packing — PO-0001 Airflow Black XL, BDL-01, QTY: 5 pcs", severity: "success" },
  { id: "A018", waktu: "2026-04-07 09:00", user: "Owner", modul: "Master Data", aksi: "Edit Data", detail: "HPP Model Airflow — Upah Jahit diubah dari Rp 20.000 → Rp 22.000", severity: "info" },
  { id: "A019", waktu: "2026-04-07 14:00", user: "QC", modul: "Produksi", aksi: "Reject Ditandai", detail: "QC — PO-0001 Airflow Black XXL, BDL-03 — Noda, bisa rework", severity: "warning" },
  { id: "A020", waktu: "2026-04-06 16:00", user: "Owner", modul: "Sistem", aksi: "Login", detail: "Owner login dari 192.168.1.10", severity: "info" },
];

const MODUL_LIST_AL = ["Semua", "Produksi", "Penggajian", "Pengiriman", "Koreksi", "Master Data", "Sistem"];
const AKSI_LIST_AL = ["Semua", "Scan Terima", "Scan Selesai", "Reject Ditandai", "Override Approve", "Override Reject", "Bayar Gaji", "Kasbon Diajukan", "Surat Jalan Dibuat", "Input PO", "Tambah Data", "Edit Data", "Login"];
const USER_LIST_AL = ["Semua", "Owner", "EPUL", "ABQI", "UJANG", "BB", "QC", "Packing"];

function AuditLog() {
  const [filterModul, setFilterModul] = useState("Semua");
  const [filterUser, setFilterUser] = useState("Semua");
  const [filterAksi, setFilterAksi] = useState("Semua");
  const [search, setSearch] = useState("");

  const filtered = AUDIT_DATA.filter(a => {
    if (filterModul !== "Semua" && a.modul !== filterModul) return false;
    if (filterUser !== "Semua" && a.user !== filterUser) return false;
    if (filterAksi !== "Semua" && a.aksi !== filterAksi) return false;
    if (search.trim() && !a.detail.toLowerCase().includes(search.trim().toLowerCase()) && !a.aksi.toLowerCase().includes(search.trim().toLowerCase())) return false;
    return true;
  });

  const sevColor = { info: C.blue, success: C.green, warning: C.yellow, error: C.red };
  const sevIcon = { info: "ℹ", success: "✓", warning: "⚠", error: "✗" };

  const countBySeverity = { info: 0, success: 0, warning: 0, error: 0 };
  AUDIT_DATA.forEach(a => { countBySeverity[a.severity]++; });
  const countByModul = {};
  AUDIT_DATA.forEach(a => { countByModul[a.modul] = (countByModul[a.modul] || 0) + 1; });

  const THL = { padding: "12px 16px", textAlign: "left", fontSize: 10, fontWeight: 700, color: C.textSub, textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: C.sans, borderBottom: `1px solid ${C.border}` };
  const TDL = (i) => ({ padding: "14px 16px", fontSize: 13, color: C.text, fontFamily: C.sans, background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent", borderBottom: `1px solid ${C.border}` });
  const selectStyle = { background: "rgba(0,0,0,0.3)", border: `1px solid ${C.border}`, borderRadius: 10, padding: "8px 14px", fontSize: 12, color: C.text, fontFamily: C.sans, outline: "none", transition: "all 0.2s" };

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16, marginBottom: 24 }}>
        <div style={{ background: C.card, backdropFilter: "blur(10px)", border: `1px solid ${C.border}`, borderRadius: 16, padding: "20px", borderLeft: `4px solid ${C.cyan}`, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
          <div style={{ fontSize: 9, color: C.textSub, fontFamily: C.sans, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6, fontWeight: 700 }}>Total Entri Log</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: C.cyan, fontFamily: C.syne, letterSpacing: "-0.02em" }}>{AUDIT_DATA.length}</div>
        </div>
        {[{ label: "Info", sev: "info" }, { label: "Success", sev: "success" }, { label: "Warning", sev: "warning" }, { label: "Error", sev: "error" }].map(k => (
          <div key={k.sev} style={{ background: C.card, backdropFilter: "blur(10px)", border: `1px solid ${C.border}`, borderRadius: 16, padding: "20px", borderLeft: `4px solid ${sevColor[k.sev]}`, transition: "all 0.2s" }}>
            <div style={{ fontSize: 9, color: C.textSub, fontFamily: C.sans, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6, fontWeight: 700 }}>{k.label}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: sevColor[k.sev], fontFamily: C.syne }}>{countBySeverity[k.sev]}</div>
          </div>
        ))}
      </div>

      <Panel title="AUDIT LOG EXPLORER" accent={C.textSub}>
        <div style={{ padding: "16px 24px", display: "flex", gap: 16, flexWrap: "wrap", alignItems: "flex-end", borderBottom: `1px solid ${C.border}` }}>
          <div>
            <div style={{ fontSize: 9, color: C.textSub, fontFamily: C.sans, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6, fontWeight: 700 }}>Modul</div>
            <select value={filterModul} onChange={e => setFilterModul(e.target.value)} style={selectStyle}>
              {MODUL_LIST_AL.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <div style={{ fontSize: 9, color: C.textSub, fontFamily: C.sans, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6, fontWeight: 700 }}>User</div>
            <select value={filterUser} onChange={e => setFilterUser(e.target.value)} style={selectStyle}>
              {USER_LIST_AL.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          <div>
            <div style={{ fontSize: 9, color: C.textSub, fontFamily: C.sans, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6, fontWeight: 700 }}>Aksi</div>
            <select value={filterAksi} onChange={e => setFilterAksi(e.target.value)} style={selectStyle}>
              {AKSI_LIST_AL.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div style={{ flex: 1, minWidth: 240 }}>
            <div style={{ fontSize: 9, color: C.textSub, fontFamily: C.sans, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6, fontWeight: 700 }}>Cari Aktivitas</div>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tulis aksi atau detail..."
              style={{ ...selectStyle, width: "100%" }} />
          </div>
          {(filterModul !== "Semua" || filterUser !== "Semua" || filterAksi !== "Semua" || search.trim()) && (
            <button onClick={() => { setFilterModul("Semua"); setFilterUser("Semua"); setFilterAksi("Semua"); setSearch(""); }}
              style={{ padding: "10px 18px", fontSize: 10, fontWeight: 800, fontFamily: C.mono, background: "rgba(248, 113, 113, 0.1)", color: C.red, border: `1px solid ${C.red}44`, borderRadius: 10, cursor: "pointer", transition: "all 0.2s" }}>
              ✗ RESET FILTER
            </button>
          )}
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
            <thead>
              <tr style={{ background: "rgba(255,255,255,0.02)" }}>
                {["", "TIMESTAMP", "ACTOR", "MODULE", "ACTION", "DETAIL"].map(h => (
                  <th key={h} style={THL}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: "60px", textAlign: "center", color: C.textMid, fontFamily: C.sans, fontSize: 13, opacity: 0.6 }}>Tidak ada log yang ditemukan dalam kriteria filter ini.</td></tr>
              ) : filtered.map((a, i) => {
                const sc = sevColor[a.severity];
                return (
                  <tr key={a.id} style={{
                    transition: "all 0.1s",
                    background: a.severity === "error" ? "rgba(248, 113, 113, 0.05)" : "transparent"
                  }}>
                    <td style={{ ...TDL(i), textAlign: "center", width: 40 }}>
                      <span style={{ fontSize: 14, color: sc, fontWeight: 900 }}>{sevIcon[a.severity]}</span>
                    </td>
                    <td style={{ ...TDL(i), whiteSpace: "nowrap" }}>
                      <span style={{ fontFamily: C.mono, fontSize: 11, color: C.textSub, fontWeight: 500 }}>{a.waktu}</span>
                    </td>
                    <td style={TDL(i)}>
                      <span style={{
                        fontSize: 10, fontWeight: 800, padding: "4px 10px", borderRadius: 8, fontFamily: C.mono,
                        background: a.user === "Owner" ? "rgba(34, 211, 238, 0.1)" : "rgba(167, 139, 250, 0.1)",
                        color: a.user === "Owner" ? C.cyan : C.purple,
                        border: `1px solid ${a.user === "Owner" ? C.cyan + "22" : C.purple + "22"}`
                      }}>
                        {a.user}
                      </span>
                    </td>
                    <td style={TDL(i)}>
                      <span style={{
                        fontSize: 9, fontWeight: 800, padding: "4px 10px", borderRadius: 8, fontFamily: C.mono, textTransform: "uppercase",
                        background: "rgba(255,255,255,0.05)",
                        color: C.textSub,
                        border: "1px solid rgba(255,255,255,0.1)"
                      }}>
                        {a.modul}
                      </span>
                    </td>
                    <td style={{ ...TDL(i), whiteSpace: "nowrap" }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: sc, fontFamily: C.sans }}>{a.aksi}</span>
                    </td>
                    <td style={TDL(i)}>
                      <span style={{ fontSize: 12, color: C.text, fontFamily: C.sans, lineHeight: 1.5, opacity: 0.9 }}>{a.detail}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

// --- MAIN APP ---
export default function StitchlixApp() {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [activeSub, setActiveSub] = useState("Produksi");
  const [openNav, setOpenNav] = useState("dashboard");
  const curNav = NAV.find(n => n.id === activeNav);
  const [sharedBundleDB, setSharedBundleDB] = useState(() => JSON.parse(JSON.stringify(initBundleDB)));
  const [koreksiQueue, setKoreksiQueue] = useState(() => [...initKoreksiQueue]);
  const [inventory, setInventory] = useState(initInventory);
  const [trxKeluar, setTrxKeluar] = useState(initTrxKeluar);
  const [trxMasuk, setTrxMasuk] = useState(initTrxMasuk);
  const [jurnal, setJurnal] = useState(initJurnal);

  function navTo(navId, subLabel) {
    setActiveNav(navId);
    setOpenNav(navId);
    setActiveSub(subLabel);
  }

  function renderContent() {
    if (activeNav === "keuangan") {
      if (activeSub === "Ringkasan")      return <TabKeuangan key="k_ringkas" defaultTab="ringkasan" jurnal={jurnal} setJurnal={setJurnal} inventory={inventory} setInventory={setInventory} trxMasuk={trxMasuk} setTrxMasuk={setTrxMasuk} />;
      if (activeSub === "Laporan PO")     return <TabKeuangan key="k_po" defaultTab="laporan_po" jurnal={jurnal} setJurnal={setJurnal} inventory={inventory} setInventory={setInventory} trxMasuk={trxMasuk} setTrxMasuk={setTrxMasuk} />;
      if (activeSub === "Laporan Margin") return <TabKeuangan key="k_margin" defaultTab="laporan_margin" jurnal={jurnal} setJurnal={setJurnal} inventory={inventory} setInventory={setInventory} trxMasuk={trxMasuk} setTrxMasuk={setTrxMasuk} />;
      if (activeSub === "Jurnal Umum")    return <TabKeuangan key="k_jurnal" defaultTab="jurnal" jurnal={jurnal} setJurnal={setJurnal} inventory={inventory} setInventory={setInventory} trxMasuk={trxMasuk} setTrxMasuk={setTrxMasuk} />;
    }

    if (activeNav === "master") {
      if (activeSub === "Master Detail") return <MasterDetail />;
      if (activeSub === "Produk & HPP") return <MasterProduk />;
      if (activeSub === "Karyawan") return <MasterKaryawan />;
      if (activeSub === "Klien") return <MasterKlien />;
      if (activeSub === "Jenis Reject") return <MasterLainnya key="m4" defaultTab="reject" />;
      if (activeSub === "Kategori Transaksi") return <MasterLainnya key="m5" defaultTab="trx" />;
      if (activeSub === "Satuan (UOM)") return <MasterLainnya key="m6" defaultTab="satuan" />;
      if (activeSub === "User & Role") return <MasterLainnya key="m7" defaultTab="user" />;
    }

    if (activeNav === "pengiriman") {
      if (activeSub === "Buat Surat Jalan") return <TabPengiriman defaultTab="buat" />;
      if (activeSub === "Riwayat Kirim") return <TabPengiriman defaultTab="riwayat" />;
    }

    if (activeNav === "penggajian") {
      if (activeSub === "Rekap Gaji") return <TabPenggajian key="p_rekap" defaultTab="rekap" />;
      if (activeSub === "Kasbon")     return <TabPenggajian key="p_kasbon" defaultTab="kasbon" />;
      if (activeSub === "Slip Gaji")  return <TabPenggajian key="p_slip" defaultTab="slip" />;
    }

    if (activeNav === "inventory") {
      if (activeSub === "Overview Stok") return <TabInventory key="i_overview" defaultTab="overview" inventory={inventory} setInventory={setInventory} trxKeluar={trxKeluar} setTrxKeluar={setTrxKeluar} trxMasuk={trxMasuk} setTrxMasuk={setTrxMasuk} />;
      if (activeSub === "Transaksi Keluar") return <TabInventory key="i_keluar" defaultTab="keluar" inventory={inventory} setInventory={setInventory} trxKeluar={trxKeluar} setTrxKeluar={setTrxKeluar} trxMasuk={trxMasuk} setTrxMasuk={setTrxMasuk} />;
      if (activeSub === "Alert Order") return <TabInventory key="i_alert" defaultTab="alert" inventory={inventory} setInventory={setInventory} trxKeluar={trxKeluar} setTrxKeluar={setTrxKeluar} trxMasuk={trxMasuk} setTrxMasuk={setTrxMasuk} />;
    }

    if (activeNav === "laporan") {
      if (activeSub === "Budget vs Realisasi") return <TabLaporan key="l_bulan" defaultTab="per_bulan" />;
      if (activeSub === "Laporan PO") return <TabLaporan key="l_po" defaultTab="per_po" />;
      if (activeSub === "Laporan Gaji") return <TabLaporan key="l_gaji" defaultTab="laporan_gaji" />;
      if (activeSub === "Laporan Reject") return <TabLaporan key="l_reject" defaultTab="laporan_reject" />;
      if (activeSub === "Keuangan") return <TabLaporan key="l_keu" defaultTab="keuangan" />;
    }

    if (activeNav === "produksi") {
      if (activeSub === "Input PO") return <InputPO />;
      if (activeSub === "Cutting") return <TabProduksi key="cutting" defaultTab="cutting" sharedBundleDB={sharedBundleDB} setSharedBundleDB={setSharedBundleDB} koreksiQueue={koreksiQueue} setKoreksiQueue={setKoreksiQueue} />;
      if (activeSub === "Jahit") return <TabProduksi key="jahit" defaultTab="jahit" sharedBundleDB={sharedBundleDB} setSharedBundleDB={setSharedBundleDB} koreksiQueue={koreksiQueue} setKoreksiQueue={setKoreksiQueue} />;
      if (activeSub === "Lubang Kancing") return <TabProduksi key="lkancing" defaultTab="lkancing" sharedBundleDB={sharedBundleDB} setSharedBundleDB={setSharedBundleDB} koreksiQueue={koreksiQueue} setKoreksiQueue={setKoreksiQueue} />;
      if (activeSub === "Buang Benang") return <TabProduksi key="bbenang" defaultTab="bbenang" sharedBundleDB={sharedBundleDB} setSharedBundleDB={setSharedBundleDB} koreksiQueue={koreksiQueue} setKoreksiQueue={setKoreksiQueue} />;
      if (activeSub === "QC") return <TabProduksi key="qc" defaultTab="qc" sharedBundleDB={sharedBundleDB} setSharedBundleDB={setSharedBundleDB} koreksiQueue={koreksiQueue} setKoreksiQueue={setKoreksiQueue} />;
      if (activeSub === "Steam") return <TabProduksi key="steam" defaultTab="steam" sharedBundleDB={sharedBundleDB} setSharedBundleDB={setSharedBundleDB} koreksiQueue={koreksiQueue} setKoreksiQueue={setKoreksiQueue} />;
      if (activeSub === "Packing") return <TabProduksi key="packing" defaultTab="packing" sharedBundleDB={sharedBundleDB} setSharedBundleDB={setSharedBundleDB} koreksiQueue={koreksiQueue} setKoreksiQueue={setKoreksiQueue} />;
      if (activeSub === "Monitoring") return <TabProduksi key="monitoring" defaultTab="monitoring" sharedBundleDB={sharedBundleDB} setSharedBundleDB={setSharedBundleDB} koreksiQueue={koreksiQueue} setKoreksiQueue={setKoreksiQueue} />;
    }

    if (activeNav === "koreksi") {
      return <TabKoreksi koreksiQueue={koreksiQueue} setKoreksiQueue={setKoreksiQueue} sharedBundleDB={sharedBundleDB} setSharedBundleDB={setSharedBundleDB} />;
    }

    if (activeNav === "auditlog") {
      return <AuditLog />;
    }

    if (activeNav === "dashboard") {
      if (activeSub === "Produksi")   return <DashProduksi onNavTo={navTo} />;
      if (activeSub === "Keuangan")   return <DashKeuangan />;
      if (activeSub === "Penggajian") return <DashPenggajian />;
    }

    return <Placeholder label={activeSub || curNav?.label} />;
  }

  return (
    <div style={{
      display: "flex",
      height: "100vh",
      background: C.bg,
      color: C.text,
      overflow: "hidden",
      fontFamily: C.sans,
      position: "relative"
    }}>
      <PremiumBackground />
      
      {/* Sidebar */}
      <div style={{
        width: 280,
        background: "rgba(6, 13, 31, 0.45)",
        backdropFilter: "blur(50px)",
        borderRight: `1px solid rgba(255,255,255,0.08)`,
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        zIndex: 100,
        boxShadow: "20px 0 50px rgba(0,0,0,0.3)",
        userSelect: "none"
      }}>
        <div style={{ padding: "40px 16px 32px", userSelect: "none", cursor: "default" }}>
          <div style={{ 
            fontSize: 18, 
            fontWeight: 800, 
            color: "#fff", 
            fontFamily: C.syne, 
            letterSpacing: "-0.04em", 
            lineHeight: 1,
            display: "flex",
            alignItems: "center",
            gap: 10
          }}>
            <div style={{ 
              width: 30, height: 30, borderRadius: 10, 
              background: `linear-gradient(135deg, ${C.cyan}, ${C.blue})`, 
              display: "flex", alignItems: "center", justifyContent: "center", 
              fontSize: 14, border: "1px solid rgba(255,255,255,0.2)",
              boxShadow: `0 0 20px ${C.cyan}44`
            }}>S</div>
            STITCHLYX<span style={{ color: C.cyan, opacity: 0.8 }}>.SYNCORE</span>
          </div>
          <div style={{ fontSize: 8, color: C.cyan, opacity: 0.5, marginTop: 10, letterSpacing: "0.4em", textTransform: "uppercase", fontFamily: C.mono, fontWeight: 700 }}>GARMENT OS // v1.0</div>
          
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 24, padding: "8px 14px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 12 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.green, boxShadow: `0 0 15px ${C.green}` }} />
            <span style={{ fontSize: 9, color: C.textSub, fontFamily: C.mono, fontWeight: 700, letterSpacing: "0.05em" }}>SERVER: OPERATIONAL</span>
          </div>
        </div>

        
        <nav style={{ flex: 1, overflowY: "auto", padding: "16px 16px", scrollbarWidth: "none" }}>
          {NAV.map(n => {
            const isActive = activeNav === n.id, isOpen = openNav === n.id;
            return (
              <div key={n.id} style={{ marginBottom: 6 }}>
                <div onClick={() => { setActiveNav(n.id); setOpenNav(isOpen && n.subs.length ? null : n.id); if (n.subs.length) setActiveSub(n.subs[0].label); else setActiveSub(n.label); }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    padding: "12px 16px",
                    borderRadius: 16,
                    cursor: "pointer",
                    background: isActive ? `linear-gradient(90deg, ${n.color}22 0%, transparent 100%)` : "transparent",
                    border: `1px solid ${isActive ? n.color + "33" : "transparent"}`,
                    transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                    transform: isActive ? "translateX(6px)" : "none",
                    position: "relative"
                  }}
                  onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.transform = "translateX(6px)"; } }}
                  onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.transform = "none"; } }}>

                  <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: 12,
                    flexShrink: 0,
                    background: isActive ? n.color : "rgba(255,255,255,0.03)",
                    border: `1px solid ${isActive ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.06)"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                    color: isActive ? "#000" : C.textSub,
                    boxShadow: isActive ? `0 8px 20px ${n.color}33` : "none",
                    transition: "all 0.4s"
                  }}>{n.icon}</div>
                  <span style={{ 
                    fontSize: 14, 
                    fontWeight: isActive ? 700 : 500, 
                    color: isActive ? "#fff" : C.textSub, 
                    flex: 1,
                    letterSpacing: isActive ? "0.02em" : "0"
                  }}>{n.label}</span>
                  {n.subs.length > 0 && <span style={{ fontSize: 10, color: C.textMid, transition: "transform 0.3s", transform: isOpen ? "rotate(90deg)" : "none" }}>▸</span>}
                </div>
                {isOpen && n.subs.length > 0 && (
                  <div style={{ marginLeft: 34, marginTop: 6, marginBottom: 12, borderLeft: `1px solid rgba(255,255,255,0.08)`, paddingLeft: 18, userSelect: "none" }}>
                    {n.subs.map(s => (
                      <div key={s.id} onClick={() => setActiveSub(s.label)}
                        style={{
                          padding: "10px 0",
                          cursor: "pointer",
                          userSelect: "none",
                          fontSize: 13,
                          color: activeSub === s.label ? "#fff" : C.textSub,
                          fontWeight: activeSub === s.label ? 700 : 400,
                          transition: "all 0.2s",
                          position: "relative"
                        }}
                        onMouseEnter={e => { e.currentTarget.style.color = "#fff"; }}
                        onMouseLeave={e => { e.currentTarget.style.color = activeSub === s.label ? "#fff" : C.textSub; }}>
                        {activeSub === s.label && <div style={{ position: "absolute", left: -19, top: "50%", transform: "translateY(-50%)", width: 6, height: 6, borderRadius: "50%", background: C.cyan, boxShadow: `0 0 10px ${C.cyan}` }} />}
                        {s.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
        
        <div style={{ padding: "24px 32px", borderTop: `1px solid rgba(255,255,255,0.08)`, background: "rgba(0,0,0,0.15)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ 
              width: 42, height: 42, borderRadius: 14, 
              background: `linear-gradient(135deg, ${C.cyan}44, ${C.blue}44)`, 
              border: `1px solid rgba(255,255,255,0.1)`, 
              display: "flex", alignItems: "center", justifyContent: "center", 
              fontSize: 18, fontWeight: 800, color: "#fff", flexShrink: 0, fontFamily: C.syne 
            }}>A</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", fontFamily: C.syne, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Administrator</div>
              <div style={{ fontSize: 10, color: C.textSub, fontFamily: C.mono, opacity: 0.6 }}>root@syncore</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>
        <header style={{
          padding: "32px 48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "transparent",
          flexShrink: 0,
          zIndex: 10,
          userSelect: "none",
          cursor: "default"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <MacDots />
            <div style={{ width: 1, height: 32, background: "rgba(255,255,255,0.1)" }} />
            <div>
              <div style={{ fontSize: 11, color: C.textMid, fontFamily: C.mono, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700 }}>
                {curNav?.label} <span style={{ color: "rgba(255,255,255,0.1)", margin: "0 8px" }}>/</span> {activeSub}
              </div>
              <div style={{ fontSize: 32, fontWeight: 800, color: "#fff", fontFamily: C.syne, letterSpacing: "-0.04em", marginTop: 4 }}>
                {activeSub || curNav?.label}
              </div>
            </div>
          </div>
          
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <div style={{ 
              background: "rgba(255,255,255,0.03)", 
              border: `1px solid rgba(255,255,255,0.08)`, 
              padding: "10px 20px", borderRadius: 16,
              display: "flex", alignItems: "center", gap: 12
            }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.cyan, boxShadow: `0 0 15px ${C.cyan}` }} />
              <span style={{ fontSize: 11, color: "#fff", fontFamily: C.mono, fontWeight: 700 }}>SYSTEM LIVE</span>
            </div>
            <div style={{ 
              fontSize: 11, color: C.textSub, fontFamily: C.mono, 
              background: "rgba(0,0,0,0.2)", border: `1px solid rgba(255,255,255,0.06)`, 
              padding: "10px 20px", borderRadius: 16, fontWeight: 700
            }}>
              {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }).toUpperCase()}
            </div>
          </div>
        </header>

        <main style={{ flex: 1, overflowY: "auto", padding: "0 48px 48px", scrollBehavior: "smooth" }}>
          <div style={{ maxWidth: 1600, margin: "0 auto" }}>
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}



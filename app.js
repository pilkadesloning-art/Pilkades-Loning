// URL Web App Google Apps Script
const API_URL = "PASTE_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";
let session = null;

const $ = id => document.getElementById(id);
const fmt = n => Number(n||0).toLocaleString("id-ID");

function toast(msg){const e=$("toast");e.textContent=msg;e.classList.add("show");setTimeout(()=>e.classList.remove("show"),2500)}
function apiUrl(params){return API_URL+"?"+new URLSearchParams(params).toString()}

$("role").addEventListener("change",()=>{$("tpsWrap").hidden=$("role").value!=="tps"});
document.querySelectorAll(".logout").forEach(b=>b.addEventListener("click",logout));

async function request(url, options={}) {
  const r=await fetch(url,options);
  if(!r.ok) throw new Error("HTTP "+r.status);
  const d=await r.json();
  if(d.ok===false) throw new Error(d.error||"Permintaan gagal");
  return d;
}

async function login(){
  const role=$("role").value, tps=Number($("tps").value), password=$("password").value.trim();
  if(!password) return toast("Masukkan password");
  try{
    const d=await request(apiUrl({action:"login",role,tps,password}));
    session={role,tps,token:d.token};
    $("loginCard").hidden=true;
    if(role==="tps"){ $("tpsPanel").hidden=false; $("tpsBadge").textContent="TPS "+tps; await loadTps(); }
    else { $("adminPanel").hidden=false; await loadAdmin(); }
  }catch(e){toast(e.message)}
}
$("loginBtn").addEventListener("click",login);
$("password").addEventListener("keydown",e=>{if(e.key==="Enter")login()});

async function loadTps(){
  try{
    const d=await request(apiUrl({action:"getTps",tps:session.tps,token:session.token}));
    $("c1Label").firstChild.textContent=d.candidate1+" ";
    $("c2Label").firstChild.textContent=d.candidate2+" ";
    $("c1").value=d.row.c1; $("c2").value=d.row.c2; $("invalid").value=d.row.invalid;
    $("entryStatus").textContent=d.row.updatedAt ? "Terakhir disimpan: "+d.row.updatedAt : "Belum ada data.";
    updateTpsTotal();
  }catch(e){toast(e.message)}
}
function updateTpsTotal(){ $("tpsTotal").textContent=fmt(Number($("c1").value||0)+Number($("c2").value||0)+Number($("invalid").value||0)); }
["c1","c2","invalid"].forEach(id=>$(id).addEventListener("input",updateTpsTotal));

$("saveTps").addEventListener("click",async()=>{
  const body={action:"saveTps",tps:session.tps,token:session.token,c1:Number($("c1").value||0),c2:Number($("c2").value||0),invalid:Number($("invalid").value||0)};
  $("saveTps").disabled=true;
  try{const d=await request(API_URL,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(body)});toast("Hasil TPS berhasil disimpan");$("entryStatus").textContent="Terakhir disimpan: "+d.updatedAt}catch(e){toast(e.message)}
  finally{$("saveTps").disabled=false}
});

async function loadAdmin(){
  try{
    const d=await request(apiUrl({action:"getAll",token:session.token}));
    applyNames(d.candidate1,d.candidate2); renderAdmin(d.rows);
    $("lastUpdate").textContent="Pembaruan: "+(d.updatedAt||"-");
  }catch(e){toast(e.message)}
}
function applyNames(a,b){
  a=a||"Calon 1";b=b||"Calon 2";
  ["label1","th1","barL1"].forEach(id=>$(id).textContent=a);
  ["label2","th2","barL2"].forEach(id=>$(id).textContent=b);
}
function renderAdmin(rows){
  let s1=0,s2=0,inv=0,total=0,done=0;
  $("adminRows").innerHTML="";
  rows.forEach(r=>{
    const t=r.c1+r.c2+r.invalid;s1+=r.c1;s2+=r.c2;inv+=r.invalid;total+=t;if(r.updatedAt)done++;
    const tr=document.createElement("tr");
    tr.innerHTML=`<th>TPS ${r.tps}</th><td>${fmt(r.c1)}</td><td>${fmt(r.c2)}</td><td>${fmt(r.invalid)}</td><td>${fmt(t)}</td><td class="${r.updatedAt?'ok':'pending'}">${r.updatedAt?'Sudah masuk':'Belum masuk'}</td>`;
    $("adminRows").appendChild(tr);
  });
  const valid=s1+s2,p1=valid?s1/valid*100:0,p2=valid?s2/valid*100:0;
  $("sum1").textContent=fmt(s1);$("sum2").textContent=fmt(s2);$("sumInvalid").textContent=fmt(inv);$("sumTotal").textContent=fmt(total);
  $("pct1").textContent=p1.toFixed(2)+"% suara sah";$("pct2").textContent=p2.toFixed(2)+"% suara sah";
  $("ft1").textContent=fmt(s1);$("ft2").textContent=fmt(s2);$("fti").textContent=fmt(inv);$("ftt").textContent=fmt(total);$("fts").textContent=done+"/6 TPS";
  $("barV1").textContent=fmt(s1);$("barV2").textContent=fmt(s2);$("bar1").style.width=p1+"%";$("bar2").style.width=p2+"%";
}
$("refresh").addEventListener("click",loadAdmin);

function logout(){session=null;$("loginCard").hidden=false;$("tpsPanel").hidden=true;$("adminPanel").hidden=true;$("password").value="";}

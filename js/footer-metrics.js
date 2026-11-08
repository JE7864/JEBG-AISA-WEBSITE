// Public footer activity: aggregate counts only; no form contents are transmitted.
(async function(){
 if(location.hostname!=='aisa.jamilaexim.com')return;
 const strip=document.getElementById('footer-metrics'),base='https://countapi.mileshilliard.com/api/v1/';
 const keys={"visits":"jebg_aisa_visits_20261108","enquiries":"jebg_aisa_enquiry_starts_20261108","demos":"jebg_aisa_demo_plays_20261108","engaged":"jebg_aisa_engaged_depth75_20261108"};
 const values={},sent=new Set();
 const fields=[["aisa-metric-visits","visits","Recorded page visits"],["aisa-metric-daily","average","Average page visits per IST calendar day"],["aisa-metric-enquiries","enquiries","Visits with an enquiry form start"],["aisa-metric-enquiry-rate","enquiries","Enquiry form-start rate",true],["aisa-metric-demos","demos","Visits with a product demo play"],["aisa-metric-demo-rate","demos","Demo play rate",true],["aisa-metric-engaged","engaged","Visits reaching 75% page depth"],["aisa-metric-engagement-rate","engaged","Engagement rate",true]];
 function render(){
  if(!Object.keys(keys).every(key=>Number.isSafeInteger(values[key])&&values[key]>=0))return;
  const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Kolkata',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
  const part=type=>Number(parts.find(p=>p.type===type).value),today=Date.UTC(part('year'),part('month')-1,part('day')),launchDay=Date.UTC(2026,10,8);
  if(today<launchDay)return;
  const days=Math.floor((today-launchDay)/86400000)+1,average=Math.round(values.visits/days*10)/10;
  fields.forEach(([id,key,label,rate])=>{
   const number=key==='average'?average:rate?(values.visits>0?values[key]/values.visits:0):values[key];
   const element=document.getElementById(id),text=new Intl.NumberFormat('en-IN',{style:rate?'percent':'decimal',maximumFractionDigits:!rate&&key==='average'?1:0,useGrouping:false}).format(number).replace('%','');
   element.textContent=text;element.title=label+': '+text+(rate?' percent':'');element.setAttribute('aria-label',element.title);
  });
  strip.hidden=false;
 }
 function apply(kind,number){values[kind]=Math.max(values[kind]===undefined?0:values[kind],number);render();}
 async function requestCount(kind,readOnly){
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),10000);
  try{
   const response=await fetch(base+(readOnly?'get/':'hit/')+keys[kind],{mode:'cors',credentials:'omit',referrerPolicy:'no-referrer',cache:'no-store',signal:controller.signal});
   const data=await response.json();
   // A confirmed unused key represents zero; network failures never do.
   if(!response.ok){if(readOnly&&response.status===404&&data&&data.error==='Key not found')apply(kind,0);return;}
   const raw=data&&data.value;
   if((typeof raw!=='number'&&typeof raw!=='string')||!/^\d+$/.test(String(raw)))return;
   const number=Number(raw);if(!Number.isSafeInteger(number)||number<0)return;
   apply(kind,number);
  }catch(ignore){/* Do not invent values or retry an ambiguous increment. */}
  finally{clearTimeout(timer);}
 }
 function track(kind){
  if(sent.has(kind))return;
  sent.add(kind);void requestCount(kind,false);
 }
 const form=document.getElementById('enquiry-form');
 if(form){
  const started=event=>{
   const field=event.target;
   if(event.isTrusted!==true||!field||!['INPUT','SELECT','TEXTAREA'].includes(field.tagName)||!field.name||field.name==='website'||field.disabled||['hidden','checkbox','radio'].includes(field.type)||typeof field.value!=='string'||!field.value.trim())return;
   track('enquiries');
  };
  form.addEventListener('input',started);form.addEventListener('change',started);
 }
 document.querySelectorAll('video').forEach(video=>video.addEventListener('play',()=>{if(document.visibilityState!=='hidden')track('demos')}));
 let queued=false;
 function checkDepth(){
  queued=false;if(document.visibilityState==='hidden')return;
  const height=Math.max(document.documentElement.scrollHeight,document.body.scrollHeight);
  if(height>0&&(Math.max(0,window.scrollY)+window.innerHeight)/height>=0.75)track('engaged');
 }
 function queueDepth(){if(queued||sent.has('engaged'))return;queued=true;requestAnimationFrame(checkDepth);}
 window.addEventListener('scroll',queueDepth,{passive:true});window.addEventListener('resize',queueDepth);
 document.addEventListener('visibilitychange',queueDepth);queueDepth();
 // Only visits increment on load. Event counters are read without creating events.
 await Promise.all(Object.keys(keys).map(kind=>requestCount(kind,kind!=='visits')));
})();

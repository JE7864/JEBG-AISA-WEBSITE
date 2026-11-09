(() => {
'use strict';
const form=document.getElementById('enquiry-form');
if(!form)return;
let googleWebAppUrl="https://script.google.com/macros/s/AKfycbyfyt1mkqeaUgLu0b-nKTYIUXi4CvJn3GXwfyb7aU5WFbS-cbtf3ef1AYrQ6J_vcaVu/exec";
fetch('https://jebg.jamilaexim.com/backend-config.json',{cache:'no-store',credentials:'omit'})
 .then(response=>{if(!response.ok)throw new Error('Connection file unavailable');return response.json();})
 .then(config=>{if(config.schemaVersion===1&&typeof config.submissionUrl==='string'&&/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]{20,200}\/exec$/.test(config.submissionUrl))googleWebAppUrl=config.submissionUrl;})
 .catch(()=>{/* Keep the same working public submission endpoint as the JEBG website. */});
const pendingGoogleRequests=new WeakMap();
function saveSubmission(){
 if(!form.reportValidity())return;
 const values=Object.fromEntries(new FormData(form));
 const data={...values,kind:'customer',consent:form.elements.updates.checked,agreement:form.elements.agreement.checked};
 delete data.updates;
 const fingerprint=JSON.stringify(data),previous=pendingGoogleRequests.get(form);
 const requestId=previous&&previous.fingerprint===fingerprint?previous.id:crypto.randomUUID();
 pendingGoogleRequests.set(form,{fingerprint,id:requestId});
 data.requestId=requestId;
 const post=document.createElement('form');
 post.method='POST';post.action=googleWebAppUrl;post.target='_blank';
 post.enctype='application/x-www-form-urlencoded';post.style.display='none';post.rel='noopener';
 const input=document.createElement('input');
 input.type='hidden';input.name='payload';input.value=JSON.stringify(data);
 post.appendChild(input);document.body.appendChild(post);
 const status=document.getElementById('enquiry-status');
 status.textContent='Opening your confirmation in a new tab. Your submission is saved only when that page displays a reference number. If no tab opens, allow this form to open a confirmation tab and try again.';
 try{post.submit();}catch(error){status.textContent='We could not open the confirmation tab. Your entries remain here. Please try again or contact jamilaexim786vector@gmail.com.';}finally{post.remove();}
}
form.addEventListener('submit',event=>{event.preventDefault();saveSubmission();});
})();

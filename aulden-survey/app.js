(() => {
  'use strict';
  const apiOrigin=window.AULDEN_API_ORIGIN||window.location.origin;
  const apiUrl=path=>new URL(path,apiOrigin).href;
  const instrument=window.AULDEN_SURVEY;
  const questions=[...instrument.core,...instrument.optional];
  const host=document.getElementById('questions');
  const quantumHost=document.getElementById('quantum-questions');
  const quantumSection=document.getElementById('quantum-section');
  const form=document.getElementById('survey-form');
  const count=document.getElementById('question-count');
  const note=document.getElementById('branch-note');
  const message=document.getElementById('finish-message');
  const button=document.getElementById('finish-button');
  const consent=document.getElementById('consent');
  let state={collectionEnabled:false,available:false}; let busy=false; let saved=false;
  const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function field(q){return `<fieldset class="question ${q.wide?'question-wide':''}" data-question="${q.id}"><legend><span class="question-number">${Number(q.number)}.</span>${escape(q.title)}</legend>${q.help?`<p class="question-help" id="help-${q.id}">${escape(q.help)}</p>`:''}<div class="answers">${q.options.map(([value,label])=>`<label class="answer"><input type="${q.type==='multi'?'checkbox':'radio'}" name="${q.id}" value="${value}" autocomplete="off" ${q.help?`aria-describedby="help-${q.id}"`:''}><span>${escape(label)}</span></label>`).join('')}</div></fieldset>`;}
  host.innerHTML=instrument.core.map(field).join('');
  quantumHost.innerHTML=instrument.optional.map(field).join('');
  const value=id=>form.querySelector(`input[name="${id}"]:checked`)?.value;
  const toggle=(id,show)=>{const field=form.querySelector(`[data-question="${id}"]`);field.hidden=!show;field.disabled=!show;if(!show)field.querySelectorAll('input').forEach(input=>input.checked=false);};
  function branches(){
    const eligible=value('q1')!=='no';
    ['q2','q3','q4','q5','q6','q7','q8'].forEach(id=>toggle(id,true));
    quantumSection.hidden=false;
    button.hidden=!eligible;
    document.getElementById('participant-info').hidden=!eligible||!state.collectionEnabled;
    count.textContent='6 AI questions + 2 optional';
    if(!eligible){note.textContent='These questions are for business owners and people who help choose business technology. You can view all questions, but please do not submit if this does not describe your role.';note.hidden=false;}
    else if(['none','unsure'].includes(value('q2'))){note.textContent='You can skip questions 3–6 if they do not apply to your business. The quantum questions are optional too.';note.hidden=false;}
    else{note.hidden=true;}
  }
  form.addEventListener('change',event=>{
    const input=event.target;if(!(input instanceof HTMLInputElement))return;
    message.hidden=true;
    const q=questions.find(item=>item.id===input.name);if(!q)return;
    if(q.type==='multi'&&input.checked){const exclusive=q.exclusive||[];form.querySelectorAll(`input[name="${q.id}"]`).forEach(other=>{if(other!==input&&(exclusive.includes(input.value)||exclusive.includes(other.value)))other.checked=false;});}
    if(input.name==='q1'||input.name==='q2')branches();
  });
  form.addEventListener('submit',async event=>{
    event.preventDefault(); if(busy||saved)return;
    message.hidden=false;
    if(!state.available){message.textContent='Saving is temporarily unavailable. Please reload this page and try again.';return;}
    if(!state.collectionEnabled){message.textContent='Response collection is currently closed. Your answers have not been saved.';return;}
    if(!consent.checked){message.textContent='Please confirm that you are 18 or older and choose to take part, or leave without submitting.';consent.focus();return;}
    const answers={};
    for(const q of questions){const selected=[...form.querySelectorAll(`input[name="${q.id}"]:checked:not(:disabled)`)].map(input=>input.value);if(selected.length)answers[q.id]=q.type==='multi'?selected:selected[0];}
    busy=true;button.disabled=true;button.textContent='Saving…';message.textContent='';
    try{
      const response=await fetch(apiUrl('/api/responses'),{method:'POST',credentials:'omit',headers:{'Content-Type':'application/json','X-Survey-Token':state.formToken},body:JSON.stringify({idempotencyKey:state.nonce,instrumentVersion:instrument.version,consent:true,answers,honey:form.elements.website.value})});
      const result=await response.json();if(!response.ok)throw new Error(result.error||'The response could not be saved.');
      saved=true;message.textContent='Thank you! Your answers have been saved.';form.querySelectorAll('input').forEach(input=>input.disabled=true);button.textContent='Saved';
    }catch(error){message.textContent=error.message+' Your answers are still on this page.';button.disabled=false;button.textContent='Submit answers';}
    finally{busy=false;message.scrollIntoView({block:'nearest',behavior:'smooth'});}
  });
  async function loadStatus(){
    button.disabled=true;
    try{const response=await fetch(apiUrl('/api/status'),{cache:'no-store',credentials:'omit'});if(!response.ok)throw new Error('unavailable');state={...await response.json(),available:true};}
    catch{state={collectionEnabled:false,available:false};}
    const notice=document.getElementById('collection-notice');
    notice.hidden=state.collectionEnabled;
    notice.textContent=state.available?'Response collection is currently closed.':'Saving is temporarily unavailable. Please reload this page and try again.';
    button.disabled=!state.collectionEnabled;
    button.textContent=state.collectionEnabled?'Submit answers':state.available?'Collection closed':'Saving unavailable';branches();
  }
  branches();loadStatus();
})();

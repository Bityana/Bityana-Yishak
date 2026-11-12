(() => {
  'use strict';
  const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  document.getElementById('review-questions').innerHTML = [...window.AULDEN_SURVEY.core,...window.AULDEN_SURVEY.optional].map(q => `<article class="review-question"><div class="question-meta"><span>Q${Number(q.number)} · ${escape(q.topic)}</span><span>${q.type === 'multi' ? 'Choose all that apply' : 'Choose one'}</span></div><h3>${escape(q.title)}</h3>${q.help ? `<p class="question-help">${escape(q.help)}</p>` : ''}<ul class="review-options">${q.options.map(([,label]) => `<li>${escape(label)}</li>`).join('')}</ul><div class="rationale"><strong>Reviewer note</strong><p>${escape(q.note)}</p></div></article>`).join('');
})();

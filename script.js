'use strict';
const form = document.querySelector('#quote-form');
const titleInput = document.querySelector('#service-title');
const descriptionInput = document.querySelector('#service-description');
const statusBox = document.querySelector('#status');
const result = document.querySelector('#pdf-result');
let services = [], editing = -1, generatedFile = null, pdfUrl = null;
const $ = selector => document.querySelector(selector);
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function today() {const now = new Date(); return [now.getFullYear(),String(now.getMonth()+1).padStart(2,'0'),String(now.getDate()).padStart(2,'0')].join('-');}
form.elements.date.value = today();
function data() {const values=Object.fromEntries(new FormData(form)); for(const key in values) values[key]=values[key].trim(); values.amount=QuotePDF.parseMoney(values.amount);return values;}
function invalidate() { result.hidden=true; generatedFile=null;if(pdfUrl){URL.revokeObjectURL(pdfUrl);pdfUrl=null;}statusBox.textContent=''; }
function preview() {
  const d=data();
  const datum=(label,value)=>value?`<div class="datum"><small>${label}</small><span>${escapeHtml(value)}</span></div>`:'';
  $('#preview').innerHTML=`<header class="paper-header"><img src="assets/logo.jpeg" alt="Start Náutica"><div><h2>ORÇAMENTO</h2><p>SERVIÇOS NÁUTICOS</p></div></header><div class="paper-body"><p class="paper-title">DADOS DO ORÇAMENTO</p><div class="paper-data">${datum('Embarcação',d.boat||'Nome da embarcação')}${datum('Modelo',d.model)}${datum('Cliente',d.client)}${datum('Local',d.location||'Local do serviço')}${datum('Data',QuotePDF.displayDate(d.date))}</div><p class="paper-title">SERVIÇOS</p>${services.length?services.map(s=>`<section class="paper-service"><h3>${escapeHtml(s.title)}</h3><p>${escapeHtml(s.description)}</p></section>`).join(''):'<p class="empty-preview">Os serviços adicionados aparecerão aqui.</p>'}<div class="paper-total"><small>INVESTIMENTO TOTAL</small><strong>${Number.isFinite(d.amount)?QuotePDF.money(d.amount):'R$ —'}</strong></div><div class="paper-conditions">${d.deadline?`<small>PRAZO</small><p>${escapeHtml(d.deadline)}</p>`:''}${d.notes?`<small>OBSERVAÇÕES</small><p>${escapeHtml(d.notes)}</p>`:''}<small>RESPONSÁVEL TÉCNICO</small><p>${escapeHtml(d.responsible)}</p></div></div><footer class="paper-footer"><span>START NÁUTICA<br>Restauração e Valorização de Embarcações</span><span>Seu barco, sempre em seu melhor.</span></footer>`;
}
function renderServices() {
  $('#service-count').textContent=services.length+' adicionado'+(services.length===1?'':'s');
  $('#service-list').innerHTML=services.map((s,i)=>`<div class="service-card"><strong>${escapeHtml(s.title)}</strong><p>${escapeHtml(s.description)}</p><button type="button" class="text-button" data-edit="${i}" aria-label="Editar ${escapeHtml(s.title)}">Editar</button><button type="button" class="text-button" data-remove="${i}" aria-label="Remover ${escapeHtml(s.title)}">Remover</button></div>`).join('');
  preview();
}
function clearEditor() {editing=-1;titleInput.value='';descriptionInput.value='';titleInput.setCustomValidity('');descriptionInput.setCustomValidity('');$('#cancel-edit').hidden=true;$('#add-service').textContent='+ Adicionar serviço';$('#char-count').textContent='0 / 5.000';}
function saveService() {
  const title=titleInput.value.trim(),description=descriptionInput.value.trim();
  titleInput.setCustomValidity(title?'':'Informe o título do serviço.');descriptionInput.setCustomValidity(description?'':'Descreva o serviço.');
  if(!titleInput.reportValidity() || !descriptionInput.reportValidity())return;
  if(editing<0)services.push({title,description});else services[editing]={title,description};
  invalidate();clearEditor();renderServices();statusBox.textContent='Serviço adicionado ao orçamento.';
}
$('#add-service').addEventListener('click',saveService);
$('#cancel-edit').addEventListener('click',()=>{clearEditor();invalidate();});
$('#service-list').addEventListener('click',event=>{
  const button=event.target.closest('button');if(!button)return;
  if(button.hasAttribute('data-edit')){
    if((titleInput.value.trim()||descriptionInput.value.trim())&&!confirm('Descartar o texto em edição e abrir este serviço?'))return;
    editing=Number(button.dataset.edit);titleInput.value=services[editing].title;descriptionInput.value=services[editing].description;$('#cancel-edit').hidden=false;$('#add-service').textContent='Salvar alteração';$('#char-count').textContent=descriptionInput.value.length+' / 5.000';titleInput.focus();invalidate();
  }else if(button.hasAttribute('data-remove')){
    const index=Number(button.dataset.remove);if(!confirm('Remover este serviço do orçamento?'))return;
    services.splice(index,1);if(editing===index)clearEditor();else if(editing>index)editing--;invalidate();renderServices();
  }
});
form.addEventListener('input',event=>{event.target.setCustomValidity?.('');invalidate();$('#char-count').textContent=descriptionInput.value.length+' / 5.000';preview();});
form.elements.amount.addEventListener('blur',()=>{const value=QuotePDF.parseMoney(form.elements.amount.value);if(Number.isFinite(value))form.elements.amount.value=new Intl.NumberFormat('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2}).format(value);});
form.addEventListener('submit',event=>{
  event.preventDefault();invalidate();
  if(titleInput.value.trim()||descriptionInput.value.trim()||editing>=0){statusBox.textContent='Há um serviço em edição. Toque em Adicionar serviço ou Salvar alteração antes de gerar o PDF.';titleInput.focus();return;}
  const d=data();
  for(const key of ['boat','location','responsible','deadline'])if(!d[key]){form.elements[key].setCustomValidity('Preencha este campo.');form.elements[key].reportValidity();return;}
  if(!Number.isFinite(d.amount)||d.amount<=0||d.amount>999999999.99){form.elements.amount.setCustomValidity('Informe um valor entre R$ 0,01 e R$ 999.999.999,99. Ex.: 15.300,00.');form.elements.amount.reportValidity();return;}
  if(!services.length){statusBox.textContent='Adicione pelo menos um serviço para gerar o PDF.';titleInput.focus();return;}
  try{
    const doc=QuotePDF.createQuotePdf(d,services,globalThis.START_LOGO);
    const blob=doc.output('blob');const safeName=d.boat.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9_-]+/g,'-').replace(/^-|-$/g,'').slice(0,70)||'embarcacao';
    const filename=`Orcamento-Start-Nautica-${safeName}-${d.date}.pdf`;
    generatedFile=new File([blob],filename,{type:'application/pdf'});pdfUrl=URL.createObjectURL(blob);
    const link=$('#download');link.href=pdfUrl;link.download=filename;
    $('#share').hidden=!(navigator.canShare&&navigator.canShare({files:[generatedFile]}));result.hidden=false;
    statusBox.textContent=`PDF gerado com ${doc.getNumberOfPages()} página(s). Use Baixar PDF ou Compartilhar PDF.`;
    link.click();result.scrollIntoView({behavior:'smooth',block:'nearest'});
  }catch(error){console.error(error);statusBox.textContent='Não foi possível gerar o PDF. Seus dados continuam na tela. Tente novamente.';}
});
$('#share').addEventListener('click',async()=>{
  if(!generatedFile)return;
  try{await navigator.share({files:[generatedFile],title:'Orçamento Start Náutica'});}catch(error){if(error.name!=='AbortError')statusBox.textContent='Não foi possível compartilhar diretamente. Baixe o PDF e anexe no WhatsApp.';}
});
window.addEventListener('beforeunload',event=>{if(services.length||form.elements.boat.value||titleInput.value||descriptionInput.value){event.preventDefault();event.returnValue='';}});
preview();

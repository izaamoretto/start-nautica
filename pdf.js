/* Geração local: nenhum dado do orçamento é enviado a um servidor. */
(function (root) {
  'use strict';
  const money = value => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  function parseMoney(raw) {
    const value = String(raw).trim().replace(/^R\$\s*/, '').replace(/\s/g, '');
    if (!/^(?:\d+|\d{1,3}(?:\.\d{3})+)(?:,\d{1,2})?$/.test(value)) return NaN;
    return Number(value.replace(/\./g, '').replace(',', '.'));
  }
  function displayDate(value) { return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value.split('-').reverse().join('/') : value; }
  function createQuotePdf(data, services, logo) {
    const doc = new root.jspdf.jsPDF({ unit: 'mm', format: 'a4', compress: true });
    const navy = [6,25,54], gold = [184,145,58], ink = [30,43,60];
    let y = 0;
    doc.setProperties({ title: 'Orçamento - ' + data.boat, author: 'Start Náutica', subject: 'Orçamento de serviços náuticos' });
    function header(first) {
      doc.setFillColor(...navy); doc.rect(0,0,210,first ? 47 : 24,'F');
      if (first && logo) doc.addImage(logo,'JPEG',15,4,38,38);
      doc.setTextColor(234,208,140); doc.setFont('helvetica','bold'); doc.setFontSize(first ? 23 : 12);
      doc.text(first ? 'ORÇAMENTO' : 'START NÁUTICA',first ? 65 : 16,first ? 22 : 15);
      doc.setFont('helvetica','normal'); doc.setFontSize(9); doc.setTextColor(255,255,255);
      doc.text(first ? 'SERVIÇOS NÁUTICOS' : 'ORÇAMENTO DE SERVIÇOS',first ? 66 : 135,first ? 31 : 15);
      doc.setDrawColor(...gold); doc.setLineWidth(.65); doc.line(0,first ? 47 : 24,210,first ? 47 : 24);
      y = first ? 59 : 36;
    }
    function space(height) { if(y + height > 275) {doc.addPage(); header(false);} }
    function textLines(text, {size=10,bold=false,color=ink,width=178,lineHeight=5.3}={}) {
      doc.setFont('helvetica',bold?'bold':'normal'); doc.setFontSize(size);
      const lines = doc.splitTextToSize(String(text).replace(/\t/g,'    '),width);
      for(const line of lines) {const advance=line.trim()?lineHeight:lineHeight*.55;space(advance); doc.setFont('helvetica',bold?'bold':'normal'); doc.setFontSize(size); doc.setTextColor(...color); doc.text(line,16,y); y+=advance;}
    }
    function section(label) { space(18); y+=3; textLines(label,{size:10,bold:true,color:navy}); doc.setDrawColor(...gold); doc.setLineWidth(.25); doc.line(16,y-2,194,y-2); y+=5; }
    function field(label,value) { if(!value) return; space(15); textLines(label.toUpperCase(),{size:7.5,color:[100,112,128],lineHeight:4}); textLines(value); y+=3; }
    header(true);
    section('DADOS DO ORÇAMENTO');
    function metadataRow(leftLabel,leftValue,rightLabel,rightValue) {
      doc.setFont('helvetica','normal');doc.setFontSize(10);
      const leftLines=doc.splitTextToSize(leftValue||'-',108),rightLines=doc.splitTextToSize(rightValue||'-',60);
      const height=7+Math.max(leftLines.length,rightLines.length)*5.3;space(height);
      doc.setFontSize(7.5);doc.setTextColor(100,112,128);doc.text(leftLabel,16,y);doc.text(rightLabel,132,y);y+=5;
      doc.setFontSize(10);doc.setTextColor(...ink);doc.text(leftLines,16,y,{lineHeightFactor:1.5});doc.text(rightLines,132,y,{lineHeightFactor:1.5});y+=height-5;
    }
    metadataRow('EMBARCAÇÃO',data.boat,'MODELO',data.model);
    metadataRow('LOCAL',data.location,'DATA',displayDate(data.date));
    if(data.client)field('Cliente',data.client);
    section('SERVIÇOS');
    services.forEach(service => {space(24); textLines(service.title,{size:11,bold:true,color:navy,lineHeight:5.7}); y+=2; textLines(service.description); y+=7;});
    space(34); y+=3; doc.setFillColor(...navy);doc.roundedRect(16,y-3,178,24,2,2,'F');
    doc.setFont('helvetica','bold');doc.setTextColor(234,208,140);doc.setFontSize(12);doc.text('INVESTIMENTO TOTAL',22,y+11);
    doc.setFont('helvetica','normal');doc.setTextColor(255,255,255);doc.setFontSize(16);doc.text(money(data.amount),188,y+11,{align:'right'});y+=31;
    field('Prazo',data.deadline); field('Observações',data.notes); field('Responsável técnico',data.responsible);
    const total=doc.getNumberOfPages();
    for(let p=1;p<=total;p++) {doc.setPage(p);doc.setDrawColor(...gold);doc.setLineWidth(.25);doc.line(16,282,194,282);doc.setFont('helvetica','bold');doc.setFontSize(8);doc.setTextColor(...navy);doc.text('START NÁUTICA',16,288);doc.setFont('helvetica','normal');doc.setFontSize(7);doc.setTextColor(100,112,128);doc.text('Restauração e Valorização de Embarcações',16,292);doc.text(p+' / '+total,194,289,{align:'right'});}
    return doc;
  }
  root.QuotePDF = { createQuotePdf, parseMoney, money, displayDate };
})(globalThis);

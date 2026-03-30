import html2pdf from 'html2pdf.js';

export async function exportPDF(elementId, filename = 'reboot-audit.pdf') {
  const element = document.getElementById(elementId);
  if (!element) throw new Error('Élément PDF introuvable');

  const opt = {
    margin: [10, 10, 10, 10],
    filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, letterRendering: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
  };

  await html2pdf().set(opt).from(element).save();
}

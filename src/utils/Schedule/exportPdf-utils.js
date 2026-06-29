import * as htmlToImage from 'html-to-image';
import { jsPDF } from 'jspdf';
import dayjs from 'dayjs';
import { getFortnightInfo } from './schedule-utils';

export const exportScheduleToPDF = async ({ elementId, scheduleData, departments, setIsExporting }) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  setIsExporting?.(true);

  try {
    const start = scheduleData?.start;
    const referenceDate = start ? dayjs(start) : dayjs();
    const department = departments.find((d) => Number(d.id) === Number(scheduleData?.departmentId));
    const fortnightInfo = getFortnightInfo(start);

    const departmentName = `DEPARTAMENTO DE ${department?.departmentName?.toUpperCase() ?? 'SIN DEPARTAMENTO'}`;
    const fortnightNumber = fortnightInfo?.number ?? 1;
    const monthString = referenceDate.month((scheduleData?.monthNumber || 1) - 1).format('MMMM').toUpperCase();
    const year = referenceDate.year();

    const headerDiv = document.createElement('div');
    headerDiv.id = 'pdf-dynamic-header';
    headerDiv.className = 'w-full flex flex-col gap-1 pb-4 mb-4 border-b border-gray-600 text-white';
    headerDiv.innerHTML = `
      <div class="flex justify-between items-end mt-8 uppercase">
        <div>
          <h1 class="text-xl font-black tracking-tight text-gray-400 pl-8">MERULINK — CONTROL DE HORARIOS</h1>
          <p class="text-sm font-bold text-gray-300 pl-8">${departmentName}</p>
        </div>
        <div class="text-right mr-5">
          <span class="text-xs bg-cyan-950 text--gray-400 font-bold px-2.5 py-1 rounded-md border border-gray-800">
            QUINCENA Nº ${fortnightNumber}
          </span>
          <p class="text-xs font-semibold text-gray-400 mt-1.5">${monthString} ${year}</p>
        </div>
      </div>
    `;

    element.insertBefore(headerDiv, element.firstChild);

    await new Promise((resolve) => setTimeout(resolve, 150));

    const canvas = await htmlToImage.toCanvas(element, {
      quality: 1,
      pixelRatio: 2,
      backgroundColor: '#535557',
    });

    const addedHeader = element.querySelector('#pdf-dynamic-header');
    if (addedHeader) element.removeChild(addedHeader);

    const imgData = canvas.toDataURL('image/png');
    const pdfWidth = 297;
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [pdfWidth, pdfHeight],
    });

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

    const fileName = `Horario_${departmentName.replace(/\s+/g, '_')}_Q_N°${fortnightNumber}_${monthString}_${year}.pdf`;
    pdf.save(fileName);
  } catch (error) {
    console.error('Error generando el reporte PDF:', error);
    const addedHeader = element?.querySelector('#pdf-dynamic-header');
    if (addedHeader) element.removeChild(addedHeader);
  } finally {
    setIsExporting?.(false);
  }
};

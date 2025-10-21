import { message } from "antd";
import imageCompression from "browser-image-compression";
import { PDFDocument } from 'pdf-lib';
import dayjs from "dayjs";
export const defaultDateFormat = "DD/MM/BBBB";
export const defaultDatePickerFormat = "DD/MM/YYYY";
export const dateTimeFormatBB = "DD/MM/YYYY , HH:mm";
export const dateTimeFormat = "DD/MM/YYYY , HH:mm";
export const dateTimeFormatNoTime = "DD/MM/YYYY";

// import { dateTimeFormatBB, dateTimeFormat, defaultDatePickerFormat, defaultDateFormat } from "../configs";
// import { differenceInYears } from "date-fns";

// export const age = (text: any) => {
//   const [day, month, year] = text.split("/");
//   const birthDate = new Date(`${year}-${month}-${day}`);
//   const dateNow = new Date();
//   const age = differenceInYears(dateNow, birthDate);
//   return age;
// };
export const convertDate = (text: any) => {
  const [day, month, year] = text?.split("/");
  const birthDate = new Date(`${year}-${month}-${day}`);
  return dayjs(birthDate).add(543, "year");
};
export const dateFormatdate = (date: any) => {
  const [day, month, year] = date.split("/");
  const birthDate = new Date(`${year}-${month}-${day}`);
  return birthDate ? dayjs(birthDate).format(defaultDateFormat) : "-";
};
export const dateFormat = (date: string) =>
  date ? dayjs(date).add(543, "year").format(dateTimeFormatBB) : "-";

export const dateFormatTime = (date: string) =>
  date ? `${dayjs(date).format(dateTimeFormat)} น.` : "-";
export const dateFormatTimeNoTIme = (date: string | Date) => {
  return date ? `${dayjs(date).format(dateTimeFormatNoTime)} น.` : "-";
};

export const numberFormat = (n: number): string =>
  n && !isNaN(n)
    ? (Math.round(n * 100) / 100).toLocaleString("th-TH", {
      // minimumFractionDigits: 2,
    })
    : "-";

export const phoneFormat = (input: any) => {
  if (!input || isNaN(input)) return `input must be a number was sent ${input}`;
  if (typeof input !== "string") input = input.toString();
  if (input.length === 10) {
    return input.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
  } else if (input.length < 10) {
    return "was not supplied enough numbers please pass a 10 digit number";
  } else if (input.length > 10) {
    return "was supplied too many numbers please pass a 10 digit number";
  } else {
    return "something went wrong";
  }
};

export const diffDayDate = (startDate: Date, endDate: Date) => {
  const sday = new Date(startDate);
  const eday = new Date(endDate);
  return Math.floor(
    (Date.UTC(eday.getFullYear(), eday.getMonth(), eday.getDate()) -
      Date.UTC(sday.getFullYear(), sday.getMonth(), sday.getDate())) /
    (1000 * 60 * 60 * 24)
  );
};
export const diffHourBetweenDate = (startDate: Date, endDate: Date) => {
  return dayjs(endDate).diff(dayjs(startDate), "hours");
};

export const diffHourBetweenHour = (start: string, end: string) => {
  //HH:mm
  // Parse the time strings into hours and minutes
  const [startHour, startMinute] = start.split(":").map(Number);
  const [endHour, endMinute] = end.split(":").map(Number);

  // Convert times to total minutes from midnight
  const startTotalMinutes = startHour * 60 + startMinute;
  let endTotalMinutes = endHour * 60 + endMinute;

  // Handle time ranges spanning midnight
  if (endTotalMinutes < startTotalMinutes) {
    endTotalMinutes += 24 * 60; // Add 24 hours in minutes
  }

  // Calculate the difference in minutes
  const diffMinutes = endTotalMinutes - startTotalMinutes;

  // Convert minutes to hours
  return parseFloat((diffMinutes / 60).toFixed(2)); // Round to 2 decimal places
};
const Formatter = (value: any) => {
  if (!value) {
    return "";
  }
  const inputValue = value.replace(/\D/g, "");
  let formattedValue = "";
  for (let i = 0; i < inputValue.length; i++) {
    if (i === 1 || i === 6 || i === 12) {
      formattedValue += "-";
    }
    formattedValue += inputValue.charAt(i);
  }
  return formattedValue;
};
// handleCompress
export async function handleCompress(file: File): Promise<File> {
  try {
    if (typeof window === 'undefined') return file;

    const mime = file.type.toLowerCase();

    // ============================
    // 📄 PDF
    // ============================
    if (mime === 'application/pdf') {
      console.log('🔹 กำลังบีบ PDF...');
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);

      // ลบ metadata และ re-save
      pdfDoc.setTitle('');
      pdfDoc.setAuthor('');
      pdfDoc.setSubject('');
      pdfDoc.setKeywords([]);
      pdfDoc.setProducer('');
      pdfDoc.setCreator('');
      pdfDoc.setCreationDate(new Date());
      pdfDoc.setModificationDate(new Date());

      const compressedPdfBytes: any = await pdfDoc.save({ useObjectStreams: true });

      // แปลงเป็น Blob ก่อนสร้าง File
      const blob = new Blob([compressedPdfBytes], { type: 'application/pdf' });
      const compressedPdf = new File([blob], file.name, { type: 'application/pdf' });

      console.log(
        `PDF: ${(file.size / 1024 / 1024).toFixed(2)}MB → ${(compressedPdf.size / 1024 / 1024).toFixed(2)}MB`
      );

      return compressedPdf;
    }

    // ============================
    // 📸 รูปภาพ (JPEG / PNG)
    // ============================
    if (mime.startsWith('image/')) {
      console.log('🔹 กำลังบีบรูป...');
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };

      const compressedImage = await imageCompression(file, options);

      console.log(
        `Image: ${(file.size / 1024 / 1024).toFixed(2)}MB → ${(compressedImage.size / 1024 / 1024).toFixed(2)}MB`
      );

      return compressedImage;
    }

    // ============================
    // 🗂️ ไฟล์อื่น ๆ → ส่งเดิม
    // ============================
    console.log('ไม่ใช่ PDF หรือรูปภาพ ข้ามการบีบอัด');
    return file;
  } catch (err) {
    console.error('บีบอัดไฟล์ไม่สำเร็จ:', err);
    message.warning('บีบอัดไฟล์ไม่สำเร็จ — จะใช้ไฟล์เดิมแทน');
    return file; // fallback
  }
}

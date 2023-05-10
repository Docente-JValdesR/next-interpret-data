import { useId, useState } from "react";
import * as XLSX from "xlsx";

export function useExcelFile() {
  const [data, setData] = useState(null);
  const [filename, setFilename] = useState(null);

  const id = useId();
  function handleFileUpload(event) {
    const file = event.target.files[0];
    const filename = file.name.split(".")[0];
    const reader = new FileReader();

    // Verificar que file es un objeto Blob válido
    if (file instanceof Blob) {
      reader.readAsArrayBuffer(file);
      reader.onload = function (event) {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        const header = {};
        rows[0].forEach((column, index) => {
          header[XLSX.utils.encode_col(index)] = column;
        });
        const result = XLSX.utils
          .sheet_to_json(worksheet, { header })
          .map((obj) => {
            return { ...obj, id };
          });
        setData(result);
      };
    }
    setFilename(filename);
  }
  return { data, filename, handleFileUpload };
}

import { useEffect, useState } from "react";
import { useExcelFile } from "../components/readExcel";
import Table from "../components/reactTable";
import { App } from "../components/reactChart";
import CustomHeader from "../components/customHeader";

export default function Home() {
  const [excel, setExcel] = useState([]);
  const [inputState, setInputState] = useState(true);
  const { data, filename, handleFileUpload } = useExcelFile();
  const [response, setResponse] = useState([]);
  const [customHeader, setCustomHeader] = useState([]);
  [];
  const [selectedLabel, setSelectedLabel] = useState("");
  const [selectedDataset, setSelectedDataset] = useState([]);
  const [colors, setColors] = useState();

  const handleColorsChange = (newColors) => {
    setColors(newColors);
  };

  const handleCustomHeaderChange = (newHeader) => {
    setCustomHeader(newHeader);
  };

  const handleSetLabel = (header) => {
    setSelectedLabel(header);
  };
  const handleSetDataset = (header) => {
    setSelectedDataset(header);
  };

  useEffect(() => {
    setExcel(data);
    setInputState(!inputState);
  }, [data]);

  const reset = () => {
    window.location.reload();
  };

  const analyze = async () => {
    const response = await fetch("/api/generate", {
      method: "POST",
      body: JSON.stringify({ excel }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    setResponse(data);
  };

  return (
    <div className="container-fluid container-sm my-5 py-5">
      <div className="row">
        <div className="col-md-4 col-12">
          <h1>OpenAI - Análisis de Datos</h1>
          <input
            type="file"
            className="form-control bg-primary text-white"
            onChange={handleFileUpload}
            disabled={inputState}
          />
          <>
            <div className="d-grid gap-2 mt-2">
              <button className="btn btn-primary" onClick={reset}>
                Limpiar Datos
              </button>
              <button onClick={analyze} className="btn btn-success">
                Analizar el Grafico
              </button>
            </div>
            <CustomHeader
              excel={excel}
              onCustomHeaderChange={handleCustomHeaderChange}
              onSetLabel={handleSetLabel}
              onSetDataset={handleSetDataset}
              onColorPicker={handleColorsChange}
            />
          </>
        </div>
        <div className="col-12 col-md-8">
          <>
            <App
              excel={excel}
              selectedLabel={selectedLabel || ""}
              selectedDataset={selectedDataset}
              colors={colors || []}
              filename={filename || ""}
            />
            <Table excel={excel} customHeader={customHeader} />
          </>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { GithubPicker } from "react-color";

export default function CustomHeader({
  excel,
  onCustomHeaderChange,
  onSetLabel,
  onSetDataset,
  onColorPicker,
}) {
  const [customHeader, setCustomHeader] = useState([]);
  const [allHeaders, setAllHeaders] = useState([]);
  const [selectedLabel, setSelectedLabel] = useState("");
  const [selectedDataset, setSelectedDataset] = useState([]);
  const [colors, setColors] = useState([]);
  const [showColorPicker, setShowColorPicker] = useState([]);

  const handleColorChange = (color, header) => {
    const newColors = { ...colors, [header]: color.rgb };
    setColors(newColors);
    onColorPicker(newColors);
    setShowColorPicker((prevShow) => ({ ...prevShow, [header]: false }));
  };

  const handleResetDataset = () => {
    setSelectedDataset([]);
    setSelectedLabel("");
    setColors({});
  };

  const handleLabelChange = (header) => {
    // Eliminar el color del estado si el encabezado cambia a label
    setColors((prevColors) => {
      const newColors = { ...prevColors };
      delete newColors[header];
      return newColors;
    });

    setSelectedLabel(header);
    onSetLabel(header);
  };

  const handleDatasetChange = (header) => {
    // Agregar un color predeterminado al estado si el encabezado cambia a dataset
    setColors((prevColors) => ({
      ...prevColors,
      [header]: prevColors[header] || { r: 0, g: 0, b: 0 },
    }));

    const updatedDataset = selectedDataset.includes(header)
      ? selectedDataset.filter((h) => h !== header)
      : [...selectedDataset, header];
    setSelectedDataset(updatedDataset);
    onSetDataset(updatedDataset);
  };

  useEffect(() => {
    const header = Object.keys(excel?.[0] || {});
    setCustomHeader(header);
    setAllHeaders(header);
    onCustomHeaderChange(header);
  }, [excel]);

  const handleCheckboxChange = (header) => {
    const updatedHeader = customHeader.includes(header)
      ? customHeader.filter((h) => h !== header)
      : [...customHeader, header];
    setCustomHeader(updatedHeader);
    onCustomHeaderChange(updatedHeader);

    // Actualizar el estado de label y dataset cuando se desmarca una casilla de verificación
    if (!updatedHeader.includes(header)) {
      if (selectedLabel === header) {
        setSelectedLabel("");
        onSetLabel("");
      } else if (selectedDataset.includes(header)) {
        const updatedDataset = selectedDataset.filter((h) => h !== header);
        setSelectedDataset(updatedDataset);
        onSetDataset(updatedDataset);
      }
    }

    if (!colors[header]) {
      setColors((prevColors) => ({
        ...prevColors,
        [header]: { r: 0, g: 0, b: 0 },
      }));
    }
  };
  return (
    <div>
      <h3>Todos los Headers</h3>
      <div className="row">
        {allHeaders.map((header, i) => (
          <div key={i} className="form-check form-check-inline">
            <input
              type="checkbox"
              checked={customHeader.includes(header)}
              onChange={() => handleCheckboxChange(header)}
              className="form-check-input"
            />
            <label className="form-check-label">{header}</label>
          </div>
        ))}
      </div>
      <div className="mt-3">
        <h3>Headers seleccionados</h3>
        <ul className="list-group">
          {customHeader.map((header, i) => (
            <li key={i} className="list-group-item">
              <div className="input-group input-group-sm">
                <label className="input-group-text">{header}</label>
                <select
                  className="form-select"
                  value={
                    selectedLabel === header
                      ? "label"
                      : selectedDataset.includes(header)
                      ? "dataset"
                      : ""
                  }
                  onChange={(e) => {
                    if (e.target.value === "label") {
                      handleLabelChange(header);
                    } else if (e.target.value === "dataset") {
                      handleDatasetChange(header);
                    } else {
                      handleLabelChange("");
                      handleResetDataset;
                    }
                  }}
                >
                  <option value="">Seleccione una opción</option>
                  <option value="label">Label</option>
                  <option value="dataset">Dataset</option>
                </select>
                {selectedDataset.includes(header) && ( // Mostrar el selector de colores solo si es parte del dataset
                  <>
                    <button
                      className="btn btn-secondary"
                      onClick={() =>
                        setShowColorPicker((prevShow) => ({
                          ...prevShow,
                          [header]: !prevShow[header],
                        }))
                      }
                    >
                      <div
                        style={{
                          backgroundColor: `rgba(${colors[header]?.r || 0}, ${
                            colors[header]?.g || 0
                          }, ${colors[header]?.b || 0}`,
                          width: "20px",
                          height: "20px",
                          borderRadius: "50%",
                        }}
                      ></div>
                    </button>
                    {showColorPicker[header] && (
                      <div style={{ position: "absolute", zIndex: "2" }}>
                        <GithubPicker
                          color={colors[header] || { r: 246, g: 118, b: 192 }}
                          onChangeComplete={(color) =>
                            handleColorChange(color, header)
                          }
                          Alpha={true}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
        <button className="btn btn-danger" onClick={handleResetDataset}>
          limpiar dataset
        </button>
      </div>
    </div>
  );
}

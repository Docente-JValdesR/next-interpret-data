import { useMemo, useState } from "react";
import { GithubPicker } from "react-color";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const preparedGraph = ({
  excel,
  selectedDataset,
  selectedLabel,
  colors,
  opacity,
  borderCustomColor,
  borderWidth,
  filename,
  axis,
  legendColor,
  checkStacker,
  datasetStacker,
}) => {
  let columnLabels = selectedLabel;
  let columnData = selectedDataset;
  let label = filename;

  const labels = excel?.map((item) => {
    const words =
      typeof item[columnLabels] === "string"
        ? item[columnLabels].split(" ")
        : [];
    const firstThreeWords = words?.slice(0, 3).join(" ");
    return firstThreeWords;
  });
  const options = {
    responsive: true,
    indexAxis: axis,

    plugins: {
      legend: {
        position: "top",
        display: true,
        labels: {
          color: legendColor,
        },
      },
      title: {
        display: true,
        text: label,
        color: legendColor,
      },
    },
    //propiedades para configurar
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: legendColor,
        },
        stacked: checkStacker,
      },
      x: {
        beginAtZero: false,
        ticks: {
          color: legendColor,
        },
        stacked: checkStacker,
      },
    },
  };

  const data = useMemo(
    () => ({
      labels,
      datasets: columnData.map((item, i) => ({
        label: item,
        data: excel?.map((item) => item[columnData[i]]),
        backgroundColor: `rgba(${colors[item]?.r || 0}, ${
          colors[item]?.g || 0
        }, ${colors[item]?.b || 0}, ${opacity || 1})`,
        borderColor: `rgba(${colors[item]?.r || 0}, ${colors[item]?.g || 0}, ${
          colors[item]?.b || 0
        }, ${borderCustomColor || 0})`,
        borderWidth: borderWidth || 0,
        stack: checkStacker ? datasetStacker[item] : undefined,
      })),
    }),
    [
      excel,
      columnData,
      colors,
      opacity,
      borderCustomColor,
      borderWidth,
      filename,
      axis,
      legendColor,
      checkStacker,
      datasetStacker,
    ]
  );

  return { options, data };
};

export function App({
  excel,
  selectedDataset,
  selectedLabel,
  colors,
  filename,
}) {
  const [opacity, setOpacity] = useState(1);
  const handlerOpacity = (e) => {
    setOpacity(e.target.value);
  };
  const [borderCustomColor, setBorderCustomColor] = useState(1);
  const handlerBorderCustomColor = (e) => {
    setBorderCustomColor(e.target.value);
  };
  const [borderWidth, setBorderWidth] = useState(1);
  const handlerBorderWidht = (e) => {
    setBorderWidth(e.target.value);
  };
  const [axis, setAxis] = useState("x");
  const handlerAxisChange = (e) => {
    setAxis(e.target.value);
  };
  const [legendColor, setLegendColor] = useState("#ffffff");
  const handlerLegendChange = (e) => {
    setLegendColor(e.hex);
    setShowLengedColor(false);
  };
  const [showLengedColor, setShowLengedColor] = useState(false);
  const handlerShowLengedColor = () => {
    setShowLengedColor(!showLengedColor);
  };
  const [checkStacker, setCheckStacker] = useState(false);
  const [datasetStacker, setDatasetStacker] = useState([]);
  const handlerDatasetStacker = (e, name) => {
    const value = parseInt(e.target.value);
    setDatasetStacker((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const { options, data } = preparedGraph({
    excel,
    selectedDataset,
    selectedLabel,
    colors,
    opacity,
    borderCustomColor,
    borderWidth,
    filename,
    axis,
    legendColor,
    checkStacker,
    datasetStacker,
  });

  return (
    <>
      <div className="col-4">
        <ul className="list-group">
          <li className="list-group-item">
            <div className="input-group input-group-sm">
              <label className="input-group-text">Opacidad del gráfico</label>
              <input
                className="form-control form-control-sm"
                type="number"
                value={opacity}
                onChange={handlerOpacity}
              />
            </div>
          </li>
          <li className="list-group-item">
            <div className="input-group input-group-sm">
              <label className="input-group-text">Opacidad del borde</label>
              <input
                className="form-control form-control-sm"
                type="number"
                value={borderCustomColor}
                onChange={handlerBorderCustomColor}
              />
            </div>
          </li>
          <li className="list-group-item">
            <div className="input-group input-group-sm">
              <label className="input-group-text">Ancho del Border</label>
              <input
                className="form-control form-control-sm"
                type="number"
                value={borderWidth}
                onChange={handlerBorderWidht}
              />
            </div>
          </li>
          <li className="list-group-item">
            <div className="input-group input-group-sm">
              <label className="input-group-text">eje</label>
              <select
                className="form-select"
                value={axis}
                onChange={handlerAxisChange}
              >
                <option value="x">x</option>
                <option value="y">y</option>
              </select>
            </div>
          </li>
          <li className="list-group-item">
            <div className="input-group input-group-sm">
              <label className="input-group-text">Color de la leyenda</label>
              <button
                className="btn btn-light m-auto"
                onClick={handlerShowLengedColor}
              >
                <div
                  style={{
                    borderRadius: "50%",
                    width: "20px",
                    height: "20px",
                    backgroundColor: legendColor,
                  }}
                ></div>
              </button>
            </div>
          </li>
          <li className="list-group-item">
            <div className="input-group input-group-sm  ">
              <label className="input-group-text">Apilar Dataset</label>
              <div className="form-check form-switch m-auto">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value=""
                  role="switch"
                  checked={checkStacker}
                  onChange={(e) => setCheckStacker(e.target.checked)}
                />
              </div>
            </div>
          </li>
        </ul>
        <div style={{ position: "absolute", zIndex: "2" }}>
          {showLengedColor && (
            <GithubPicker color={legendColor} onChange={handlerLegendChange} />
          )}
        </div>
        <div style={{ position: "absolute", zIndex: "2" }}>
          {checkStacker && (
            <ul className="list-group">
              {selectedDataset?.map((item, i) => {
                const value = datasetStacker[item] || "";
                return (
                  <li className="list-group-item" key={i}>
                    <div className="input-group input-group-sm">
                      <label className="input-group-text">{item}</label>
                      <input
                        className="form-control form-control-sm"
                        type="number"
                        value={value}
                        onChange={(e) => handlerDatasetStacker(e, item)}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
      <Bar options={options} data={data} />
    </>
  );
}

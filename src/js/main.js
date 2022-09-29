import "../css/main.scss";
import DungeonGenerator from "./dungeonGenerator.js";

var generator;

window.onload = function () {
  generator = new DungeonGenerator();
  updateMapCSS();
  updateMap();

  document.getElementById("seed").addEventListener("input", () => {
    updateMap();
  });

  document.getElementById("floorW").addEventListener("input", () => {
    updateMapCSS();
    updateMap();
  });

  document.getElementById("floorH").addEventListener("input", () => {
    updateMap();
  });
};

const updateMap = () => {
  const startTime = performance.now(); // 開始時間

  let seed = parseInt(document.getElementById("seed").value);
  let floorW = parseInt(document.getElementById("floorW").value);
  let floorH = parseInt(document.getElementById("floorH").value);
  document.getElementById("map").innerHTML = generator.generate(
    seed,
    floorW,
    floorH
  );

  const endTime = performance.now(); // 終了時間
  console.log(endTime - startTime); // 何ミリ秒かかったかを表示する
};

const updateMapCSS = () => {
  let floorW = parseInt(document.getElementById("floorW").value);
  floorW = Math.max(floorW, 12);

  const map = document.getElementById("mapContainer");
  const width = Math.min(map.clientWidth, document.documentElement.clientWidth);
  const fontSize = width / (floorW * 2.37);

  map.style.fontSize = fontSize + "px";
};

import DungeonGenerator from "./dungeonGenerator.js";

var generator;

window.onload = function() {
  generator = new DungeonGenerator();
  updateMap();

  document.getElementById("seed").addEventListener("input", () => {
    updateMap();
  });
};

const updateMap = () => {
  const startTime = performance.now(); // 開始時間
  let seed = parseInt(document.getElementById("seed").value);
  document.getElementById("map").innerHTML = generator.generate(seed);

  const endTime = performance.now(); // 終了時間
  console.log(endTime - startTime); // 何ミリ秒かかったかを表示する
};

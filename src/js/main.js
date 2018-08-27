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
  let seed = parseInt(document.getElementById("seed").value);
  let map = generator.generate(seed);

  document.getElementById("map").innerHTML = map;
};

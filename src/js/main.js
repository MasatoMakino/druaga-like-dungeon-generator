import DungeonGenerator from "./dungeonGenerator.js";

window.onload = function() {
  const generator = new DungeonGenerator();
  let map = generator.generate(0);

  document.getElementById("map").innerHTML = map;
};

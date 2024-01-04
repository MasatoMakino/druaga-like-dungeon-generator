import { test, describe, expect, vi } from "vitest";
import DungeonGenerator from "../src/js/dungeonGenerator.js";

describe("dungeonGenerator", () => {
  const verifyDungeonSize = (dungeon: string, sizeW: number, sizeH: number) => {
    const expectedBrCount = sizeH * 2 + 3;
    const actualBrCount = dungeon.match(/<br>/g)?.length;
    expect(actualBrCount).toBe(expectedBrCount);

    const firstLine = dungeon.split("<br>")[0];
    const expectedFirstLine = firstLine.match(/■️/g)?.length;
    expect(expectedFirstLine).toBe(sizeW * 2 + 3);
  };

  test("dungeonGenerator should generate a valid dungeon", () => {
    const generator = new DungeonGenerator();
    const dungeon = generator.generate(0);

    const defaultSizeH = 8;
    const defaultSizeW = 17;
    verifyDungeonSize(dungeon, defaultSizeW, defaultSizeH);
  });

  test("dungeonGenerator should generate a dungeon of different size", () => {
    const generator = new DungeonGenerator();
    const seed = 0;
    const sizeH = 5;
    const sizeW = 10;
    const dungeon = generator.generate(seed, sizeW, sizeH);
    verifyDungeonSize(dungeon, sizeW, sizeH);
  });

  test("dungeonGenerator should generate the same dungeon with seed 128", () => {
    const generator = new DungeonGenerator();
    const seed = 128;
    const dungeon1 = generator.generate(seed);
    const dungeon2 = generator.generate(seed);

    expect(dungeon1).toBe(dungeon2);
  });

  test("dungeonGenerator should return an empty string and log a warning when seed is not number", () => {
    const generator = new DungeonGenerator();
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    const testCases = [null, undefined, "0", "test", NaN];
    testCases.forEach((testCase) => {
      const dungeon = generator.generate(testCase);
      expect(dungeon).toBe("");
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockClear();
    });
    consoleSpy.mockRestore();
  });

  const isAccessibleFrom = (start, dungeon: string[][]) => {
    const visited = new Set();
    const queue = [start];

    while (queue.length > 0) {
      const [y, x] = queue.shift();
      const key = `${y},${x}`;

      if (!visited.has(key)) {
        visited.add(key);

        for (const [dy, dx] of [
          [-1, 0],
          [1, 0],
          [0, -1],
          [0, 1],
        ]) {
          const nx = x + dx;
          const ny = y + dy;

          if (dungeon[ny] && dungeon[ny][nx] === " ") {
            queue.push([ny, nx]);
          }
        }
      }
    }

    return visited;
  };

  test("all tiles should be accessible from any tile", () => {
    const generator = new DungeonGenerator();
    const dungeon = generator.generate(0);
    const dungeonArray = dungeon
      .split("<br>")
      .map((line) => line.replace(/&emsp;/g, " ")) // Convert "&emsp;" to " "
      .map((line) => line.replace(/■️/g, "W")) // Convert "&emsp;" to " "
      .map((line) => line.split(""));

    const start = [1, 1]; // Assuming the top-left tile is always accessible
    const visited = isAccessibleFrom(start, dungeonArray);

    console.log(dungeonArray);
    for (let y = 0; y < dungeonArray.length; y++) {
      for (let x = 0; x < dungeonArray[y].length; x++) {
        if (dungeonArray[y][x] === " ") {
          expect(visited.has(`${y},${x}`)).toBe(true);
        } else {
          expect(visited.has(`${y},${x}`)).toBe(false);
        }
      }
    }
  });
});

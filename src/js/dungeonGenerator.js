"use strict";

import xorshift from "./xorshift.js";

export default class {
  constructor() {}

  generate(seed, floorSizeW = 17, floorSizeH = 8) {
    //擬似乱数生成器を初期化
    if (seed === undefined) {
      console.log("seed値を指定してください");
      return "";
    }
    this.xor = new xorshift(seed);
    console.log(this.xor.rnd(), this.xor.rnd(), this.xor.rnd());
    console.log(this.xor.rnd() % 16, this.xor.rnd() % 16, this.xor.rnd() % 16);

    //柱配列を初期化　dangeon[y][x]で状態にアクセス　壁未生成の初期値は-1
    this.dungeon = Array.from(new Array(floorSizeH), () =>
      new Array(floorSizeW).fill(-1)
    );

    for (let cY = 0; cY < floorSizeH; cY++) {
      for (let cX = 0; cX < floorSizeW; cX++) {
        let openLoopFlag = false;
        do {
          openLoopFlag = this.startCreateWall(cX, cY);
          console.log(openLoopFlag);
        } while (openLoopFlag);
      }
    }
    console.log(this.dungeon);

    let map = this.printDungeon(this.dungeon);
    console.log(map);
    return map;
  }

  startCreateWall(x, y) {
    //既に壁がある場合はスキップ
    if (this.dungeon[y][x] !== -1) {
      return false;
    }

    let routeX = [];
    let routeY = [];
    routeX[0] = x;
    routeY[0] = y;

    //壁生成(0:上,1:右,2:下,3:左)
    this.dungeon[y][x] = this.xor.rnd() % 4;
    let nextPos = this.getNextPosition(x, y);

    return this.createWall(nextPos, routeX, routeY);
  }

  /**
   * 方向から次の座標を取得する
   * @param cX
   * @param cY
   * @returns {x,y}
   */
  getNextPosition(cX, cY) {
    switch (this.dungeon[cY][cX]) {
      case 0:
        return { x: cX, y: cY - 1 };
      case 1:
        return { x: cX + 1, y: cY };
      case 2:
        return { x: cX, y: cY + 1 };
      case 3:
        return { x: cX - 1, y: cY };
    }
  }

  createWall(pos, routeX, routeY) {
    //開ループ判定
    if (this.checkOpenLoop(pos.x, pos.y, routeX, routeY)) {
      this.clearRoute(routeX, routeY);
      return true;
    }

    //外壁に到達したら終了
    if (pos.x < 0 || pos.x >= this.dungeon[0].length) return false;
    if (pos.y < 0 || pos.y >= this.dungeon.length) return false;

    //既にその地点に壁がある場合は終了
    if (this.dungeon[pos.y][pos.x] !== -1) {
      return false;
    }

    const direction = this.xor.rnd() % 3;
    // const

    return false;
  }

  checkCloseLoop(nextX, nextY, routeX, routeY) {
    const n = routeX.length;
    for (let i = 0; i < n; i++) {
      if (routeX[i] === nextX && routeY[i] === nextY) {
        return true;
      }
    }
    return false;
  }
  /**
   * 開ループ判定
   * @param x
   * @param y
   * @param routeX
   * @param routeY
   * @returns {*|boolean}
   */
  checkOpenLoop(x, y, routeX, routeY) {
    let hitL,
      hitR,
      hitT,
      hitB = false;

    const n = routeX.length;

    for (let i = 0; i < n; i++) {
      if (routeX[i] === x - 1 && routeY[i] === y) hitL = true;
      if (routeX[i] === x + 1 && routeY[i] === y) hitR = true;
      if (routeX[i] === x && routeY[i] === y - 1) hitT = true;
      if (routeX[i] === x && routeY[i] === y + 1) hitB = true;
    }

    if (hitL && hitR && hitT && hitB) {
      console.log("開ループが発生しました");
    }
    return hitL && hitR && hitT && hitB;
  }

  clearRoute(routeX, routeY) {
    console.log("現在のルートを消去します");
    const n = routeX.length;
    for (let i = 0; i < n; i++) {
      this.dungeon[routeY[i]][routeX[i]] = -1;
    }
  }

  /**
   * ダンジョンマップ配列からhtml用のstringを生成する
   * @param dungeon
   */
  printDungeon(dungeon) {
    let map = "";

    this.mapH = dungeon.length * 2 + 1 + 2;
    this.mapW = dungeon[0].length * 2 + 1 + 2;

    for (let i = 0; i < this.mapH; i++) {
      const line = this.printDungeonLine(dungeon, i);
      map += line;
    }
    return map;
  }

  printDungeonLine(dungeon, lineNum) {
    if (lineNum === 0 || lineNum === this.mapH - 1) {
      return this.printDungeonLineOutWall();
    } else if (lineNum % 2 == 0) {
      return this.printDungeonLinePillarAndWall(dungeon, lineNum);
    } else {
      return this.printDungeonLineFloorAndWall(dungeon, lineNum);
    }
  }

  printDungeonLineOutWall() {
    let wall = "■️";
    let line = wall.repeat(this.mapW);
    line += "<br>";
    return line;
  }

  printDungeonLineFloorAndWall(dungeon, lineNum) {
    let line = "";
    const y = (lineNum - 1) / 2;

    for (let i = 0; i < this.mapW; i++) {
      //外壁
      if (i === 0 || i === this.mapW - 1) {
        line += "■";
        continue;
      }

      if (i % 2 === 1) {
        line += "&nbsp;";
        continue;
      }

      let x = i / 2 - 1;
      //上の柱から下方向に壁が伸びている場合
      if (y - 1 >= 0 && dungeon[y - 1][x] === 2) {
        line += "┃";
        continue;
      }
      //下の柱から上方向に壁が伸びている場合
      if (y < dungeon.length && dungeon[y][x] === 0) {
        line += "┃";
        continue;
      }
      line += "&nbsp;";
    }

    line += "<br>";
    return line;
  }

  printDungeonLinePillarAndWall(dungeon, lineNum) {
    let line = "";
    const y = lineNum / 2 - 1;

    for (let i = 0; i < this.mapW; i++) {
      //外壁
      if (i === 0 || i === this.mapW - 1) {
        line += "■";
        continue;
      }

      //柱の描画
      if (i % 2 === 0) {
        line += "●";
        continue;
      }

      //壁の描画
      let x = (i - 1) / 2;
      if (x - 1 >= 0 && dungeon[y][x - 1] === 1) {
        line += "━";
        continue;
      }
      if (x < dungeon[0].length && dungeon[y][x] === 3) {
        line += "━";
        continue;
      }

      line += "&nbsp;";
    }

    line += "<br>";
    return line;
  }
}

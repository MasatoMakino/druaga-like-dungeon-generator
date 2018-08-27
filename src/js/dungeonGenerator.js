"use strict";

import xorshift from "./xorshift.js";

export default class {
  constructor() {}

  generate(seed, floorSizeW = 17, floorSizeH = 8) {
    const startTime = performance.now(); // 開始時間

    //擬似乱数生成器を初期化
    if (seed === undefined) {
      console.log("seed値を指定してください");
      return "";
    }

    this.xor = new xorshift(seed);

    //柱配列を初期化　dungeon[y][x]で状態にアクセス　壁未生成の初期値は-1
    this.dungeon = Array.from(new Array(floorSizeH), () =>
      new Array(floorSizeW).fill(-1)
    );

    for (let cY = 0; cY < floorSizeH; cY++) {
      for (let cX = 0; cX < floorSizeW; cX++) {
        let openLoopFlag = false;
        do {
          openLoopFlag = this.startCreateWall(cX, cY);
        } while (openLoopFlag);
        // document.getElementById("map").innerHTML += this.printDungeon(this.dungeon);
      }
    }

    const endTime = performance.now(); // 終了時間
    console.log(endTime - startTime); // 何ミリ秒かかったかを表示する

    return this.printDungeon(this.dungeon);
  }

  startCreateWall(x, y) {
    //既に壁がある場合はスキップ
    if (this.dungeon[y][x] !== -1) {
      // console.log("既に壁があります", x, y);
      return false;
    }

    let routeX = [];
    let routeY = [];
    routeX.push(x);
    routeY.push(y);

    //壁生成(0:上,1:右,2:下,3:左)
    this.dungeon[y][x] = this.xor.rnd() % 4;
    let nextPos = this.getNextPosition(x, y);

    return this.createWall(nextPos, routeX, routeY);
  }

  /**
   * 方向から次の座標を取得する
   * @param cX
   * @param cY
   * @returns {*}
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
    //ルート記録
    routeX.push(pos.x);
    routeY.push(pos.y);

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

    const forwardWall = () => {
      //壁を伸ばす方向を決める
      //(0:進行方向左、1:まっすぐ、2:進行方向右)の方向に壁を伸ばす
      const direction = this.xor.rnd() % 3;

      //一つ手前のルートを取り出す。
      const pastIndex = routeX.length - 2;
      const past = this.dungeon[routeY[pastIndex]][routeX[pastIndex]];

      //方向と手前の壁の方向を合成して壁を追加。
      let next = (direction + past - 1) % 4;
      if (next === -1) {
        next = 3;
      }
      this.dungeon[pos.y][pos.x] = next;

      //次の柱を取得
      let nextPos = this.getNextPosition(pos.x, pos.y);
      return nextPos;
    };

    //閉ループチェック
    let closeLoopFlag = false;
    let nextPos;
    do {
      nextPos = forwardWall();
      closeLoopFlag = this.checkCloseLoop(nextPos, routeX, routeY);
    } while (closeLoopFlag);

    return this.createWall(nextPos, routeX, routeY);
  }

  checkCloseLoop(nextPos, routeX, routeY) {
    const n = routeX.length;
    for (let i = 0; i < n; i++) {
      if (routeX[i] === nextPos.x && routeY[i] === nextPos.y) {
        // console.log("閉ループが発生しました", nextPos, routeX, routeY);
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
      // console.log("開ループが発生しました");
    }
    return hitL && hitR && hitT && hitB;
  }

  clearRoute(routeX, routeY) {
    // console.log("現在のルートを消去します");
    const n = routeX.length;
    for (let i = 0; i < n; i++) {
      this.dungeon[routeY[i]][routeX[i]] = -1;
    }
  }

  /**
   * ダンジョンマップ配列からhtml用のstringを生成する
   * @param dungeon
   */
  printDungeon(dungeon, CR = "<br>", space = "&nbsp;") {
    let map = "";

    this.mapH = dungeon.length * 2 + 1 + 2;
    this.mapW = dungeon[0].length * 2 + 1 + 2;

    for (let i = 0; i < this.mapH; i++) {
      map += this.printDungeonLine(dungeon, i, CR, space);
    }
    return map;
  }

  /**
   * string一行分を生成する
   * @param dungeon
   * @param lineNum
   * @param CR 改行コード
   * @param space 空白フロアの文字
   * @returns {*} 生成された文字列
   */
  printDungeonLine(dungeon, lineNum, CR, space) {
    if (lineNum === 0 || lineNum === this.mapH - 1) {
      return this.printDungeonLineOutWall(CR);
    } else if (lineNum % 2 === 0) {
      return this.printDungeonLinePillarAndWall(dungeon, lineNum, CR, space);
    } else {
      return this.printDungeonLineFloorAndWall(dungeon, lineNum, CR, space);
    }
  }

  /**
   * 外壁の行を生成する
   * @param CR 改行コード
   * @returns {string}
   */
  printDungeonLineOutWall(CR) {
    let wall = "■️";
    let line = wall.repeat(this.mapW);
    line += CR;
    return line;
  }

  printDungeonLineFloorAndWall(dungeon, lineNum, CR, space) {
    let line = "";
    const y = (lineNum - 1) / 2;

    for (let i = 0; i < this.mapW; i++) {
      //外壁
      if (i === 0 || i === this.mapW - 1) {
        line += "■";
        continue;
      }

      if (i % 2 === 1) {
        line += space;
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
      line += space;
    }

    line += CR;
    return line;
  }

  /**
   * 柱のある行を生成する
   * @param dungeon
   * @param lineNum
   * @returns {string}
   */
  printDungeonLinePillarAndWall(dungeon, lineNum, CR, space) {
    let line = "";
    const y = lineNum / 2 - 1;

    for (let i = 0; i < this.mapW; i++) {
      //外壁
      if (i === 0 || i === this.mapW - 1) {
        line += "■";
        continue;
      }

      let x = (i - 1) / 2;

      //柱の描画
      if (i % 2 === 0) {
        line += "●";
        //   line += dungeon[y][x];
        continue;
      }

      //壁の描画
      if (x - 1 >= 0 && dungeon[y][x - 1] === 1) {
        line += "━";
        continue;
      }
      if (x < dungeon[0].length && dungeon[y][x] === 3) {
        line += "━";
        continue;
      }

      line += space;
    }

    line += CR;
    return line;
  }
}

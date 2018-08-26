"use strict";

export default class {
  // Xorshift | シード付き擬似乱数
  constructor(n) {
    let x, y, z, w;

    // シード
    this.seed = function(n) {
      x = 123456789;
      y = 362436069;
      z = 521288629;
      w = 88675123;
      if (typeof n === "number") {
        w = n;
      }
    };

    // ランダム
    this.rnd = function() {
      const t = x ^ (x << 11);
      x = y;
      y = z;
      z = w;
      return (w = w ^ (w >> 19) ^ (t ^ (t >> 8)));
    };

    // 初回実行
    this.seed(n);
  }
}

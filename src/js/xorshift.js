"use strict";

/**
 * Xorshift | シード付き擬似乱数
 */
export default class {
  /**
   * コンストラクタ
   * @param {number} n - シード値
   */
  constructor(n) {
    this.seed(n);
  }

  /**
   * シードを設定する
   * @param {number} n - シード値
   */
  seed(n) {
    this.x = 123456789;
    this.y = 362436069;
    this.z = 521288629;
    this.w = 88675123;
    if (typeof n === "number") {
      this.w = n;
    }
  }

  /**
   * 擬似乱数を生成する
   * @returns {number} - 生成された擬似乱数
   */
  rnd() {
    const t = this.x ^ (this.x << 11);
    this.x = this.y;
    this.y = this.z;
    this.z = this.w;
    return (this.w = this.w ^ (this.w >> 19) ^ (t ^ (t >> 8)));
  }
}

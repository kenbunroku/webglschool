/**
 * ジオメトリ情報を生成する
 * @class
 */
export class WebGLGeometry {
  /**
   * 板ポリゴンの頂点情報を生成する
   * @param {number} width - 板ポリゴンの一辺の幅
   * @param {number} height - 板ポリゴンの一辺の高さ
   * @param {Array.<number>} color - RGBA を 0.0 から 1.0 の範囲で指定した配列
   * @return {object}
   * @property {Array.<number>} position - 頂点座標
   * @property {Array.<number>} normal - 頂点法線
   * @property {Array.<number>} color - 頂点カラー
   * @property {Array.<number>} texCoord - テクスチャ座標
   * @property {Array.<number>} index - 頂点インデックス（gl.TRIANGLES）
   * @example
   * const planeData = WebGLGeometry.plane(2.0, 2.0, [1.0, 1.0, 1.0, 1.0]);
   */
  static plane(width, height, color) {
    const w = width / 2;
    const h = height / 2;
    const pos = [-w, h, 0.0, w, h, 0.0, -w, -h, 0.0, w, -h, 0.0];
    const nor = [0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0];
    const col = [
      color[0],
      color[1],
      color[2],
      color[3],
      color[0],
      color[1],
      color[2],
      color[3],
      color[0],
      color[1],
      color[2],
      color[3],
      color[0],
      color[1],
      color[2],
      color[3],
    ];
    const st = [0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0];
    const idx = [0, 2, 1, 1, 2, 3];
    return { position: pos, normal: nor, color: col, texCoord: st, index: idx };
  }

  /**
   * 円（XY 平面展開）の頂点情報を生成する
   * @param {number} split - 円の円周の分割数
   * @param {number} rad - 円の半径
   * @param {Array.<number>} color - RGBA を 0.0 から 1.0 の範囲で指定した配列
   * @return {object}
   * @property {Array.<number>} position - 頂点座標
   * @property {Array.<number>} normal - 頂点法線
   * @property {Array.<number>} color - 頂点カラー
   * @property {Array.<number>} texCoord - テクスチャ座標
   * @property {Array.<number>} index - 頂点インデックス（gl.TRIANGLES）
   * @example
   * const circleData = WebGLGeometry.circle(64, 1.0, [1.0, 1.0, 1.0, 1.0]);
   */
  static circle(split, rad, color) {
    const pos = [];
    const nor = [];
    const col = [];
    const st = [];
    const idx = [];
    pos.push(0.0, 0.0, 0.0);
    nor.push(0.0, 0.0, 1.0);
    col.push(color[0], color[1], color[2], color[3]);
    st.push(0.5, 0.5);
    let j = 0;
    for (let i = 0; i < split; i++) {
      const r = ((Math.PI * 2.0) / split) * i;
      const rx = Math.cos(r);
      const ry = Math.sin(r);
      pos.push(rx * rad, ry * rad, 0.0);
      nor.push(0.0, 0.0, 1.0);
      col.push(color[0], color[1], color[2], color[3]);
      st.push((rx + 1.0) * 0.5, 1.0 - (ry + 1.0) * 0.5);
      if (i === split - 1) {
        idx.push(0, j + 1, 1);
      } else {
        idx.push(0, j + 1, j + 2);
      }
      ++j;
    }
    return { position: pos, normal: nor, color: col, texCoord: st, index: idx };
  }

  /**
   * キューブの頂点情報を生成する
   * @param {number} side - 正立方体の一辺の長さ
   * @param {Array.<number>} color - RGBA を 0.0 から 1.0 の範囲で指定した配列
   * @return {object}
   * @property {Array.<number>} position - 頂点座標
   * @property {Array.<number>} normal - 頂点法線 ※キューブの中心から各頂点に向かって伸びるベクトルなので注意
   * @property {Array.<number>} color - 頂点カラー
   * @property {Array.<number>} texCoord - テクスチャ座標
   * @property {Array.<number>} index - 頂点インデックス（gl.TRIANGLES）
   * @example
   * const cubeData = WebGLGeometry.cube(2.0, [1.0, 1.0, 1.0, 1.0]);
   */
  static cube(side, color) {
    const hs = side * 0.5;
    const pos = [
      -hs,
      -hs,
      hs,
      hs,
      -hs,
      hs,
      hs,
      hs,
      hs,
      -hs,
      hs,
      hs,
      -hs,
      -hs,
      -hs,
      -hs,
      hs,
      -hs,
      hs,
      hs,
      -hs,
      hs,
      -hs,
      -hs,
      -hs,
      hs,
      -hs,
      -hs,
      hs,
      hs,
      hs,
      hs,
      hs,
      hs,
      hs,
      -hs,
      -hs,
      -hs,
      -hs,
      hs,
      -hs,
      -hs,
      hs,
      -hs,
      hs,
      -hs,
      -hs,
      hs,
      hs,
      -hs,
      -hs,
      hs,
      hs,
      -hs,
      hs,
      hs,
      hs,
      hs,
      -hs,
      hs,
      -hs,
      -hs,
      -hs,
      -hs,
      -hs,
      hs,
      -hs,
      hs,
      hs,
      -hs,
      hs,
      -hs,
    ];
    const v = 1.0 / Math.sqrt(3.0);
    const nor = [
      -v,
      -v,
      v,
      v,
      -v,
      v,
      v,
      v,
      v,
      -v,
      v,
      v,
      -v,
      -v,
      -v,
      -v,
      v,
      -v,
      v,
      v,
      -v,
      v,
      -v,
      -v,
      -v,
      v,
      -v,
      -v,
      v,
      v,
      v,
      v,
      v,
      v,
      v,
      -v,
      -v,
      -v,
      -v,
      v,
      -v,
      -v,
      v,
      -v,
      v,
      -v,
      -v,
      v,
      v,
      -v,
      -v,
      v,
      v,
      -v,
      v,
      v,
      v,
      v,
      -v,
      v,
      -v,
      -v,
      -v,
      -v,
      -v,
      v,
      -v,
      v,
      v,
      -v,
      v,
      -v,
    ];
    const col = [];
    for (let i = 0; i < pos.length / 3; i++) {
      col.push(color[0], color[1], color[2], color[3]);
    }
    const st = [
      0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0,
      1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0,
      0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0,
      1.0, 0.0, 1.0,
    ];
    const idx = [
      0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12,
      14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23,
    ];
    return { position: pos, normal: nor, color: col, texCoord: st, index: idx };
  }

  /**
   * 三角錐の頂点情報を生成する
   * @param {number} split - 底面円の円周の分割数
   * @param {number} rad - 底面円の半径
   * @param {number} height - 三角錐の高さ
   * @param {Array.<number>} color - RGBA を 0.0 から 1.0 の範囲で指定した配列
   * @return {object}
   * @property {Array.<number>} position - 頂点座標
   * @property {Array.<number>} normal - 頂点法線
   * @property {Array.<number>} color - 頂点カラー
   * @property {Array.<number>} texCoord - テクスチャ座標
   * @property {Array.<number>} index - 頂点インデックス（gl.TRIANGLES）
   * @example
   * const coneData = WebGLGeometry.cone(64, 1.0, 2.0, [1.0, 1.0, 1.0, 1.0]);
   */
  static cone(split, rad, height, color) {
    const pos = [];
    const nor = [];
    const col = [];
    const st = [];
    const idx = [];
    const h = height / 2.0;
    pos.push(0.0, -h, 0.0);
    nor.push(0.0, -1.0, 0.0);
    col.push(color[0], color[1], color[2], color[3]);
    st.push(0.5, 0.5);
    let j = 0;
    for (let i = 0; i <= split; i++) {
      const r = ((Math.PI * 2.0) / split) * i;
      const rx = Math.cos(r);
      const rz = Math.sin(r);
      pos.push(rx * rad, -h, rz * rad, rx * rad, -h, rz * rad);
      nor.push(0.0, -1.0, 0.0, rx, 0.0, rz);
      col.push(
        color[0],
        color[1],
        color[2],
        color[3],
        color[0],
        color[1],
        color[2],
        color[3]
      );
      st.push(
        (rx + 1.0) * 0.5,
        1.0 - (rz + 1.0) * 0.5,
        (rx + 1.0) * 0.5,
        1.0 - (rz + 1.0) * 0.5
      );
      if (i !== split) {
        idx.push(0, j + 1, j + 3);
        idx.push(j + 4, j + 2, split * 2 + 3);
      }
      j += 2;
    }
    pos.push(0.0, h, 0.0);
    nor.push(0.0, 1.0, 0.0);
    col.push(color[0], color[1], color[2], color[3]);
    st.push(0.5, 0.5);
    return { position: pos, normal: nor, color: col, texCoord: st, index: idx };
  }

  /**
   * 円柱の頂点情報を生成する
   * @param {number} split - 円柱の円周の分割数
   * @param {number} topRad - 円柱の天面の半径
   * @param {number} bottomRad - 円柱の底面の半径
   * @param {number} height - 円柱の高さ
   * @param {Array.<number>} color - RGBA を 0.0 から 1.0 の範囲で指定した配列
   * @return {object}
   * @property {Array.<number>} position - 頂点座標
   * @property {Array.<number>} normal - 頂点法線
   * @property {Array.<number>} color - 頂点カラー
   * @property {Array.<number>} texCoord - テクスチャ座標
   * @property {Array.<number>} index - 頂点インデックス（gl.TRIANGLES）
   * @example
   * const cylinderData = WebGLGeometry.cylinder(64, 0.5, 1.0, 2.0, [1.0, 1.0, 1.0, 1.0]);
   */
  static cylinder(split, topRad, bottomRad, height, color) {
    const pos = [];
    const nor = [];
    const col = [];
    const st = [];
    const idx = [];
    const h = height / 2.0;
    pos.push(0.0, h, 0.0, 0.0, -h, 0.0);
    nor.push(0.0, 1.0, 0.0, 0.0, -1.0, 0.0);
    col.push(
      color[0],
      color[1],
      color[2],
      color[3],
      color[0],
      color[1],
      color[2],
      color[3]
    );
    st.push(0.5, 0.5, 0.5, 0.5);
    let j = 2;
    for (let i = 0; i <= split; i++) {
      const r = ((Math.PI * 2.0) / split) * i;
      const rx = Math.cos(r);
      const rz = Math.sin(r);
      pos.push(
        rx * topRad,
        h,
        rz * topRad,
        rx * topRad,
        h,
        rz * topRad,
        rx * bottomRad,
        -h,
        rz * bottomRad,
        rx * bottomRad,
        -h,
        rz * bottomRad
      );
      nor.push(0.0, 1.0, 0.0, rx, 0.0, rz, 0.0, -1.0, 0.0, rx, 0.0, rz);
      col.push(
        color[0],
        color[1],
        color[2],
        color[3],
        color[0],
        color[1],
        color[2],
        color[3],
        color[0],
        color[1],
        color[2],
        color[3],
        color[0],
        color[1],
        color[2],
        color[3]
      );
      st.push(
        (rx + 1.0) * 0.5,
        1.0 - (rz + 1.0) * 0.5,
        1.0 - i / split,
        0.0,
        (rx + 1.0) * 0.5,
        1.0 - (rz + 1.0) * 0.5,
        1.0 - i / split,
        1.0
      );
      if (i !== split) {
        idx.push(
          0,
          j + 4,
          j,
          1,
          j + 2,
          j + 6,
          j + 5,
          j + 7,
          j + 1,
          j + 1,
          j + 7,
          j + 3
        );
      }
      j += 4;
    }
    return { position: pos, normal: nor, color: col, texCoord: st, index: idx };
  }

  /**
   * 球体の頂点情報を生成する
   * @param {number} row - 球の縦方向（緯度方向）の分割数
   * @param {number} column - 球の横方向（経度方向）の分割数
   * @param {number} rad - 球の半径
   * @param {Array.<number>} color - RGBA を 0.0 から 1.0 の範囲で指定した配列
   * @return {object}
   * @property {Array.<number>} position - 頂点座標
   * @property {Array.<number>} normal - 頂点法線
   * @property {Array.<number>} color - 頂点カラー
   * @property {Array.<number>} texCoord - テクスチャ座標
   * @property {Array.<number>} index - 頂点インデックス（gl.TRIANGLES）
   * @example
   * const sphereData = WebGLGeometry.sphere(64, 64, 1.0, [1.0, 1.0, 1.0, 1.0]);
   */
  static sphere(row, column, rad, color) {
    const pos = [];
    const nor = [];
    const col = [];
    const st = [];
    const idx = [];
    for (let i = 0; i <= row; i++) {
      const r = (Math.PI / row) * i;
      const ry = Math.cos(r);
      const rr = Math.sin(r);
      for (let j = 0; j <= column; j++) {
        const tr = ((Math.PI * 2) / column) * j;
        const tx = rr * rad * Math.cos(tr);
        const ty = ry * rad;
        const tz = rr * rad * Math.sin(tr);
        const rx = rr * Math.cos(tr);
        const rz = rr * Math.sin(tr);
        pos.push(tx, ty, tz);
        nor.push(rx, ry, rz);
        col.push(color[0], color[1], color[2], color[3]);
        st.push(1 - (1 / column) * j, (1 / row) * i);
      }
    }
    for (let i = 0; i < row; i++) {
      for (let j = 0; j < column; j++) {
        const r = (column + 1) * i + j;
        idx.push(r, r + 1, r + column + 2);
        idx.push(r, r + column + 2, r + column + 1);
      }
    }
    return { position: pos, normal: nor, color: col, texCoord: st, index: idx };
  }

  /**
   * トーラスの頂点情報を生成する
   * @param {number} row - 輪の分割数
   * @param {number} column - パイプ断面の分割数
   * @param {number} irad - パイプ断面の半径
   * @param {number} orad - パイプ全体の半径
   * @param {Array.<number>} color - RGBA を 0.0 から 1.0 の範囲で指定した配列
   * @return {object}
   * @property {Array.<number>} position - 頂点座標
   * @property {Array.<number>} normal - 頂点法線
   * @property {Array.<number>} color - 頂点カラー
   * @property {Array.<number>} texCoord - テクスチャ座標
   * @property {Array.<number>} index - 頂点インデックス（gl.TRIANGLES）
   * @example
   * const torusData = WebGLGeometry.torus(64, 64, 0.25, 0.75, [1.0, 1.0, 1.0, 1.0]);
   */
  static torus(row, column, irad, orad, color) {
    const pos = [];
    const nor = [];
    const col = [];
    const st = [];
    const idx = [];
    for (let i = 0; i <= row; i++) {
      const r = ((Math.PI * 2) / row) * i;
      const rr = Math.cos(r);
      const ry = Math.sin(r);
      for (let j = 0; j <= column; j++) {
        const tr = ((Math.PI * 2) / column) * j;
        const tx = (rr * irad + orad) * Math.cos(tr);
        const ty = ry * irad;
        const tz = (rr * irad + orad) * Math.sin(tr);
        const rx = rr * Math.cos(tr);
        const rz = rr * Math.sin(tr);
        const rs = (1 / column) * j;
        let rt = (1 / row) * i + 0.5;
        if (rt > 1.0) {
          rt -= 1.0;
        }
        rt = 1.0 - rt;
        pos.push(tx, ty, tz);
        nor.push(rx, ry, rz);
        col.push(color[0], color[1], color[2], color[3]);
        st.push(rs, rt);
      }
    }
    for (let i = 0; i < row; i++) {
      for (let j = 0; j < column; j++) {
        const r = (column + 1) * i + j;
        idx.push(r, r + column + 1, r + 1);
        idx.push(r + column + 1, r + column + 2, r + 1);
      }
    }
    return { position: pos, normal: nor, color: col, texCoord: st, index: idx };
  }

  /**
   * 正二十面体の頂点情報を生成する
   * @param {number} rad - サイズ（黄金比に対する比率）
   * @param {Array.<number>} color - RGBA を 0.0 から 1.0 の範囲で指定した配列
   * @return {object}
   * @property {Array.<number>} position - 頂点座標
   * @property {Array.<number>} normal - 頂点法線
   * @property {Array.<number>} color - 頂点カラー
   * @property {Array.<number>} texCoord - テクスチャ座標
   * @property {Array.<number>} index - 頂点インデックス（gl.TRIANGLES）
   * @example
   * const icosaData = WebGLGeometry.icosahedron(1.0, [1.0, 1.0, 1.0, 1.0]);
   */
  static icosahedron(rad, color) {
    const c = (1.0 + Math.sqrt(5.0)) / 2.0;
    const t = c * rad;
    const l = Math.sqrt(1.0 + c * c);
    const r = [1.0 / l, c / l];
    const pos = [
      -rad,
      t,
      0.0,
      rad,
      t,
      0.0,
      -rad,
      -t,
      0.0,
      rad,
      -t,
      0.0,
      0.0,
      -rad,
      t,
      0.0,
      rad,
      t,
      0.0,
      -rad,
      -t,
      0.0,
      rad,
      -t,
      t,
      0.0,
      -rad,
      t,
      0.0,
      rad,
      -t,
      0.0,
      -rad,
      -t,
      0.0,
      rad,
    ];
    const nor = [
      -r[0],
      r[1],
      0.0,
      r[0],
      r[1],
      0.0,
      -r[0],
      -r[1],
      0.0,
      r[0],
      -r[1],
      0.0,
      0.0,
      -r[0],
      r[1],
      0.0,
      r[0],
      r[1],
      0.0,
      -r[0],
      -r[1],
      0.0,
      r[0],
      -r[1],
      r[1],
      0.0,
      -r[0],
      r[1],
      0.0,
      r[0],
      -r[1],
      0.0,
      -r[0],
      -r[1],
      0.0,
      r[0],
    ];
    const col = [
      color[0],
      color[1],
      color[2],
      color[3],
      color[0],
      color[1],
      color[2],
      color[3],
      color[0],
      color[1],
      color[2],
      color[3],
      color[0],
      color[1],
      color[2],
      color[3],
      color[0],
      color[1],
      color[2],
      color[3],
      color[0],
      color[1],
      color[2],
      color[3],
      color[0],
      color[1],
      color[2],
      color[3],
      color[0],
      color[1],
      color[2],
      color[3],
      color[0],
      color[1],
      color[2],
      color[3],
      color[0],
      color[1],
      color[2],
      color[3],
      color[0],
      color[1],
      color[2],
      color[3],
      color[0],
      color[1],
      color[2],
      color[3],
    ];
    const st = [];
    for (let i = 0, j = nor.length; i < j; i += 3) {
      const u = (Math.atan2(nor[i + 2], -nor[i]) + Math.PI) / (Math.PI * 2.0);
      const v = 1.0 - (nor[i + 1] + 1.0) / 2.0;
      st.push(u, v);
    }
    const idx = [
      0, 11, 5, 0, 5, 1, 0, 1, 7, 0, 7, 10, 0, 10, 11, 1, 5, 9, 5, 11, 4, 11,
      10, 2, 10, 7, 6, 7, 1, 8, 3, 9, 4, 3, 4, 2, 3, 2, 6, 3, 6, 8, 3, 8, 9, 4,
      9, 5, 2, 4, 11, 6, 2, 10, 8, 6, 7, 9, 8, 1,
    ];
    return { position: pos, normal: nor, color: col, texCoord: st, index: idx };
  }

  static icosphere(order = 0, color = [1.0, 1.0, 1.0, 1.0], uvMap = false) {
    if (order > 10) throw new Error(`Max order is 10, but given ${order}.`);

    // set up a 20-triangle icosahedron
    const f = (1 + Math.sqrt(5)) / 2;
    const T = Math.pow(4, order);

    const numVertices = 10 * T + 2;
    const numDuplicates = !uvMap
      ? 0
      : order === 0
      ? 3
      : Math.pow(2, order) * 3 + 9;

    const vertices = new Float32Array((numVertices + numDuplicates) * 3);
    const normals = new Float32Array(vertices.length);
    const colors = new Float32Array(numVertices * 4);

    vertices.set(
      Float32Array.of(
        -1,
        f,
        0,
        1,
        f,
        0,
        -1,
        -f,
        0,
        1,
        -f,
        0,
        0,
        -1,
        f,
        0,
        1,
        f,
        0,
        -1,
        -f,
        0,
        1,
        -f,
        f,
        0,
        -1,
        f,
        0,
        1,
        -f,
        0,
        -1,
        -f,
        0,
        1
      )
    );
    let triangles = Uint32Array.of(
      0,
      11,
      5,
      0,
      5,
      1,
      0,
      1,
      7,
      0,
      7,
      10,
      0,
      10,
      11,
      11,
      10,
      2,
      5,
      11,
      4,
      1,
      5,
      9,
      7,
      1,
      8,
      10,
      7,
      6,
      3,
      9,
      4,
      3,
      4,
      2,
      3,
      2,
      6,
      3,
      6,
      8,
      3,
      8,
      9,
      9,
      8,
      1,
      4,
      9,
      5,
      2,
      4,
      11,
      6,
      2,
      10,
      8,
      6,
      7
    );

    let v = 12;
    const midCashe = order ? new Map() : null; // midpoint vertices cache to avoid duplicating shared vertices

    function addMidPoint(a, b) {
      const key = Math.floor(((a + b) * (a + b + 1)) / 2 + Math.min(a, b));
      let i = midCashe.get(key);
      if (i !== undefined) {
        midCashe.delete(key);
        return i;
      }
      midCashe.set(key, v);
      vertices[3 * v + 0] = (vertices[3 * a + 0] + vertices[3 * b + 0]) * 0.5;
      vertices[3 * v + 1] = (vertices[3 * a + 1] + vertices[3 * b + 1]) * 0.5;
      vertices[3 * v + 2] = (vertices[3 * a + 2] + vertices[3 * b + 2]) * 0.5;
      return v++;
    }

    let trianglesPrev = triangles;
    const IndexArray = order > 5 ? Uint32Array : Uint16Array;

    for (let i = 0; i < order; i++) {
      const prevLen = trianglesPrev.length;
      triangles = new IndexArray(prevLen * 4);

      for (let k = 0; k < prevLen; k += 3) {
        const v1 = trianglesPrev[k + 0];
        const v2 = trianglesPrev[k + 1];
        const v3 = trianglesPrev[k + 2];
        const a = addMidPoint(v1, v2);
        const b = addMidPoint(v2, v3);
        const c = addMidPoint(v3, v1);
        let t = k * 4;
        triangles[t++] = v1;
        triangles[t++] = a;
        triangles[t++] = c;
        triangles[t++] = v2;
        triangles[t++] = b;
        triangles[t++] = a;
        triangles[t++] = v3;
        triangles[t++] = c;
        triangles[t++] = b;
        triangles[t++] = a;
        triangles[t++] = b;
        triangles[t++] = c;
      }
      trianglesPrev = triangles;
    }

    // normalize vertices
    for (let i = 0; i < numVertices * 3; i += 3) {
      const x = vertices[i + 0];
      const y = vertices[i + 1];
      const z = vertices[i + 2];

      const m = 1 / Math.hypot(x, y, z);
      vertices[i + 0] *= m;
      vertices[i + 1] *= m;
      vertices[i + 2] *= m;

      // Set normals
      normals[i + 0] = vertices[i + 0];
      normals[i + 1] = vertices[i + 1];
      normals[i + 2] = vertices[i + 2];

      // Set colors
      colors[(i / 3) * 4 + 0] = color[0];
      colors[(i / 3) * 4 + 1] = color[1];
      colors[(i / 3) * 4 + 2] = color[2];
      colors[(i / 3) * 4 + 3] = color[3];
    }

    if (!uvMap)
      return {
        position: vertices,
        normal: normals,
        color: colors,
        index: triangles,
      };

    // uv mapping
    const uv = new Float32Array((numVertices + numDuplicates) * 2);
    for (let i = 0; i < numVertices; i++) {
      uv[2 * i + 0] =
        Math.atan2(vertices[3 * i + 2], vertices[3 * i]) / (2 * Math.PI) + 0.5;
      uv[2 * i + 1] = Math.asin(vertices[3 * i + 1]) / Math.PI + 0.5;
    }

    const duplicates = new Map();

    function addDuplicate(i, uvx, uvy, cached) {
      if (cached) {
        const dupe = duplicates.get(i);
        if (dupe !== undefined) return dupe;
      }
      vertices[3 * v + 0] = vertices[3 * i + 0];
      vertices[3 * v + 1] = vertices[3 * i + 1];
      vertices[3 * v + 2] = vertices[3 * i + 2];
      uv[2 * v + 0] = uvx;
      uv[2 * v + 1] = uvy;
      if (cached) duplicates.set(i, v);
      return v++;
    }

    for (let i = 0; i < triangles.length; i += 3) {
      const a = triangles[i + 0];
      const b = triangles[i + 1];
      const c = triangles[i + 2];
      let ax = uv[2 * a];
      let bx = uv[2 * b];
      let cx = uv[2 * c];
      const ay = uv[2 * a + 1];
      const by = uv[2 * b + 1];
      const cy = uv[2 * c + 1];

      // uv fixing code; don't ask me how I got here
      if (bx - ax >= 0.5 && ay !== 1) bx -= 1;
      if (cx - bx > 0.5) cx -= 1;
      if ((ax > 0.5 && ax - cx > 0.5) || (ax === 1 && cy === 0)) ax -= 1;
      if (bx > 0.5 && bx - ax > 0.5) bx -= 1;

      if (ay === 0 || ay === 1) {
        ax = (bx + cx) / 2;
        if (ay === bx) uv[2 * a] = ax;
        else triangles[i + 0] = addDuplicate(a, ax, ay, false);
      } else if (by === 0 || by === 1) {
        bx = (ax + cx) / 2;
        if (by === ax) uv[2 * b] = bx;
        else triangles[i + 1] = addDuplicate(b, bx, by, false);
      } else if (cy === 0 || cy === 1) {
        cx = (ax + bx) / 2;
        if (cy === ax) uv[2 * c] = cx;
        else triangles[i + 2] = addDuplicate(c, cx, cy, false);
      }
      if (ax !== uv[2 * a] && ay !== 0 && ay !== 1)
        triangles[i + 0] = addDuplicate(a, ax, ay, true);
      if (bx !== uv[2 * b] && by !== 0 && by !== 1)
        triangles[i + 1] = addDuplicate(b, bx, by, true);
      if (cx !== uv[2 * c] && cy !== 0 && cy !== 1)
        triangles[i + 2] = addDuplicate(c, cx, cy, true);
    }

    return {
      position: vertices,
      normal: normals,
      color: colors,
      texCoord: uv,
      index: triangles,
    };
  }
}

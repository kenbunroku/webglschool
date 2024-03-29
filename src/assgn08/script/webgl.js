/**
 * WebGL の API を目的別にまとめたユーティリティクラス
 * @class
 */
export class WebGLUtility {
  /**
   * ファイルをプレーンテキストとして読み込む
   * @static
   * @param {string} path - 読み込むファイルのパス
   * @return {Promise}
   */
  static loadFile(path) {
    return new Promise((resolve, reject) => {
      // fetch を使ってファイルにアクセスする
      fetch(path)
        .then((res) => {
          // テキストとして処理する
          return res.text();
        })
        .then((text) => {
          // テキストを引数に Promise を解決する
          resolve(text);
        })
        .catch((err) => {
          // なんらかのエラー
          reject(err);
        });
    });
  }

  /**
   * ファイルを画像として読み込む
   * @param {string} path - 読み込むファイルのパス
   * @return {Promise}
   */
  static loadImage(path) {
    return new Promise((resolve) => {
      // Image オブジェクトの生成
      const img = new Image();
      // ロード完了を検出したいので、先にイベントを設定する
      img.addEventListener(
        "load",
        () => {
          // 画像を引数に Promise を解決する
          resolve(img);
        },
        false
      );

      img.addEventListener(
        "error",
        (err) => {
          reject(new Error(`Failed to load image at path: ${path}`));
        },
        false
      );

      // 読み込む画像のパスを設定する
      img.src = path;
    });
  }

  static loadImages(paths) {
    return Promise.all(paths.map((path) => WebGLUtility.loadImage(path)));
  }

  /**
   * canvas を受け取り WebGL コンテキストを初期化する
   * @param {HTMLCanvasElement} canvas - WebGL コンテキストを取得する canvas 要素
   * @return {WebGLRenderingContext}
   */
  static createWebGLContext(canvas) {
    // canvas から WebGL コンテキスト取得を試みる
    const gl = canvas.getContext("webgl");
    if (gl == null) {
      // WebGL コンテキストが取得できない場合はエラー
      throw new Error("webgl not supported");
      return null;
    } else {
      return gl;
    }
  }

  /**
   * ソースコードからシェーダオブジェクトを生成する
   * @param {WebGLRenderingContext} gl - WebGL コンテキスト
   * @param {string} source - シェーダのソースコード
   * @param {number} type - gl.VERTEX_SHADER or gl.FRAGMENT_SHADER
   * @return {WebGLShader}
   */
  static createShaderObject(gl, source, type) {
    // 空のシェーダオブジェクトを生成する
    const shader = gl.createShader(type);
    // シェーダオブジェクトにソースコードを割り当てる
    gl.shaderSource(shader, source);
    // シェーダをコンパイルする
    gl.compileShader(shader);
    // コンパイル後のステータスを確認し問題なければシェーダオブジェクトを返す
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      return shader;
    } else {
      throw new Error(gl.getShaderInfoLog(shader));
      return null;
    }
  }

  /**
   * シェーダオブジェクトからプログラムオブジェクトを生成する
   * @param {WebGLRenderingContext} gl - WebGL コンテキスト
   * @param {WebGLShader} vs - 頂点シェーダのシェーダオブジェクト
   * @param {WebGLShader} fs - フラグメントシェーダのシェーダオブジェクト
   * @return {WebGLProgram}
   */
  static createProgramObject(gl, vs, fs) {
    // 空のプログラムオブジェクトを生成する
    const program = gl.createProgram();
    // ２つのシェーダをアタッチ（関連付け）する
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    // シェーダオブジェクトをリンクする
    gl.linkProgram(program);
    // リンクが完了するとシェーダオブジェクトは不要になるので削除する
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    // リンク後のステータスを確認し問題なければプログラムオブジェクトを返す
    if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.useProgram(program);
      return program;
    } else {
      throw new Error(gl.getProgramInfoLog(program));
      return null;
    }
  }

  /**
   * JavaScript の配列から VBO（Vertex Buffer Object）を生成する
   * @param {WebGLRenderingContext} gl - WebGL コンテキスト
   * @param {Array.<number>} vertexArray - 頂点属性情報の配列
   * @return {WebGLBuffer}
   */
  static createVBO(gl, vertexArray) {
    // 空のバッファオブジェクトを生成する
    const vbo = gl.createBuffer();
    // バッファを gl.ARRAY_BUFFER としてバインドする
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    // バインドしたバッファに Float32Array オブジェクトに変換した配列を設定する
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(vertexArray),
      gl.STATIC_DRAW
    );
    // 安全のために最後にバインドを解除してからバッファオブジェクトを返す
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    return vbo;
  }

  /**
   * JavaScript の配列から IBO（Index Buffer Object）を生成する
   * @param {WebGLRenderingContext} gl - WebGL コンテキスト
   * @param {Array.<number>} indexArray - 頂点インデックスの結び順の配列
   * @return {WebGLBuffer}
   */
  static createIBO(gl, indexArray) {
    // 空のバッファオブジェクトを生成する
    const ibo = gl.createBuffer();
    // バッファを gl.ELEMENT_ARRAY_BUFFER としてバインドする
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    // バインドしたバッファに Int16Array オブジェクトに変換した配列を設定する
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Int16Array(indexArray),
      gl.STATIC_DRAW
    );
    // 安全のために最後にバインドを解除してからバッファオブジェクトを返す
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    return ibo;
  }

  /**
   * VBO と IBO をバインドして有効化する
   * @param {WebGLRenderingContext} gl - WebGL コンテキスト
   * @param {Array.<WebGLBuffer>} vbo - 頂点属性を格納した頂点バッファの配列
   * @param {Array.<number>} attLocation - 頂点属性ロケーションの配列
   * @param {Array.<number>} attStride - 頂点属性のストライドの配列
   * @param {WebGLBuffer} [ibo] - インデックスバッファ
   */
  static enableBuffer(gl, vbo, attLocation, attStride, ibo) {
    for (let i = 0; i < vbo.length; ++i) {
      // 有効化したいバッファをまずバインドする
      gl.bindBuffer(gl.ARRAY_BUFFER, vbo[i]);
      // 頂点属性ロケーションの有効化を行う
      gl.enableVertexAttribArray(attLocation[i]);
      // 対象のロケーションのストライドやデータ型を設定する
      gl.vertexAttribPointer(
        attLocation[i],
        attStride[i],
        gl.FLOAT,
        false,
        0,
        0
      );
    }
    if (ibo != null) {
      // IBO が与えられている場合はバインドする
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    }
  }

  /**
   * テクスチャ用のリソースからテクスチャを生成する
   * @param {WebGLRenderingContext} gl - WebGL コンテキスト
   * @param {any} resource - 画像や HTMLCanvasElement などのテクスチャ用リソース
   * @return {WebGLTexture}
   */
  static createTexture(gl, resource) {
    // テクスチャオブジェクトを生成
    const texture = gl.createTexture();
    // アクティブなテクスチャユニット番号を指定する
    gl.activeTexture(gl.TEXTURE0);
    // テクスチャをアクティブなユニットにバインドする
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // バインドしたテクスチャにデータを割り当て
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      resource
    );
    // ミップマップを自動生成する
    gl.generateMipmap(gl.TEXTURE_2D);
    // テクスチャパラメータを設定する
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
    // 安全の為にテクスチャのバインドを解除してから返す
    gl.bindTexture(gl.TEXTURE_2D, null);
    return texture;
  }

  static createTextures(gl, resources) {
    const textures = [];
    for (let i = 0; i < resources.length; ++i) {
      textures.push(this.createTexture(gl, resources[i]));
    }
    return textures;
  }

  /**
   * フレームバッファを生成する
   * @param {WebGLRenderingContext} gl - WebGL コンテキスト
   * @param {number} width - フレームバッファの幅
   * @param {number} height - フレームバッファの高さ
   * @return {object}
   * @property {WebGLFramebuffer} framebuffer - フレームバッファオブジェクト
   * @property {WebGLRenderbuffer} depthRenderBuffer - 深度バッファ用のレンダーバッファ
   * @property {WebGLTexture} texture - カラーバッファ用のテクスチャオブジェクト
   */
  static createFramebuffer(gl, width, height) {
    const framebuffer = gl.createFramebuffer(); // フレームバッファ
    const depthRenderBuffer = gl.createRenderbuffer(); // レンダーバッファ
    const texture = gl.createTexture(); // テクスチャ
    // フレームバッファをバインド
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    // レンダーバッファをバインド
    gl.bindRenderbuffer(gl.RENDERBUFFER, depthRenderBuffer);
    // レンダーバッファを深度バッファとして設定する
    gl.renderbufferStorage(
      gl.RENDERBUFFER,
      gl.DEPTH_COMPONENT16,
      width,
      height
    );
    // フレームバッファにレンダーバッファを関連付けする
    gl.framebufferRenderbuffer(
      gl.FRAMEBUFFER,
      gl.DEPTH_ATTACHMENT,
      gl.RENDERBUFFER,
      depthRenderBuffer
    );
    // テクスチャをユニット０にバインド
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // テクスチャにサイズなどを設定する（ただし中身は null）
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      width,
      height,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      null
    );
    // テクスチャパラメータを設定
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    // フレームバッファにテクスチャを関連付けする
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      texture,
      0
    );
    // すべてのオブジェクトは念の為バインドを解除しておく
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    // 各オブジェクトを、JavaScript のオブジェクトに格納して返す
    return {
      framebuffer: framebuffer,
      depthRenderbuffer: depthRenderBuffer,
      texture: texture,
    };
  }

  /**
   * フレームバッファ関連リソースを削除する
   * @param {WebGLRenderingContext} gl - WebGL コンテキスト
   * @param {WebGLFramebuffer} framebuffer - フレームバッファ
   * @param {WebGLRenderbuffer} renderbuffer - レンダーバッファ
   * @param {WebGLTexture} texture - テクスチャ
   */
  static deleteFramebuffer(gl, framebuffer, renderbuffer, texture) {
    gl.deleteFramebuffer(framebuffer);
    gl.deleteRenderbuffer(renderbuffer);
    gl.deleteTexture(texture);
    framebuffer = null;
    renderbuffer = null;
    texture = null;
  }
}

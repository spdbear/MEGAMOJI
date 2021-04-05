/*
 * An effect takes a 2d rendering context and makes modifications to it.
 * These functions are called just before rendering an animation frame.
 * Note that users can enable multiple effects at the same time.
 *
 * [arguments]
 * - keyframe   ... a 0.0 - 1.0 progress of the animation
 * - ctx        ... the rendering context to be modified
 * - cellWidth  ... width of the image to be rendered
 * - cellHeight ... height of the image to be rendered
 */

// eslint-disable-next-line no-unused-vars
const EFFECTS = [
    {
        label: "フィルタ (Chrome のみ動作確認)",
        effects: [
            { label: "キラ", fn: effectKira },
            { label: "もやもや", fn: effectMoyamoya },
            { label: "Foil", fn: effectFoil },
        ],
    }, {
        label: "変形",
        effects: [
            { label: "ガタガタ", fn: effectGatagata },
            { label: "びょいんびょいん", fn: effectZoom },
            { label: "ルーレット", fn: effectRotate },
            { label: "ねるねる", fn: effectKurukuru },
            { label: "ゆらゆら", fn: effectYurayura },
            { label: "ぱたぱた", fn: effectPatapata },
            { label: "ドカベン", fn: effectDokaben },
            { label: "ヤッタ", fn: effectYatta },
            { label: "ぽよーん", fn: effectPoyon },
            { label: "もちもち", fn: effectMotimoti },
            { label: "BLINK", fn: effectBlink },
            { label: "直球", fn: effectStraight },
        ],
    }, {
        label: "シャドウ",
        effects: [
            { label: "ぐるぐる", fn: effectShadowRotate },
            { label: "ブラー", fn: effectNaturalBlur },
            { label: "ネオン", fn: effectNeon },
        ],
    },
];

// eslint-disable-next-line no-unused-vars
const STATIC_EFFECTS = [
    { label: "左右を反転", fn: effectFlipHoriz },
    { label: "上下を反転", fn: effectFlipVert },
];

// eslint-disable-next-line no-unused-vars
const PRO_EFFECTS = [
    {
        label: "背景エフェクト",
        effects: [
            { label: "チリチリ", fn: effectTiritiri },
            { label: "ディスコ", fn: effectPsych },
            { label: "サイケ", fn: effectDizzy },
        ],
    },
];

/* ---- utils */

// taken from https://qiita.com/hachisukansw/items/633d1bf6baf008e82847
function HSV2RGB(H, S, V) {
    // see also: https://en.wikipedia.org/wiki/HSL_and_HSV#From_HSV

    const C = V * S;
    const Hp = (H % 360) / 60;
    const X = C * (1 - Math.abs(Hp % 2 - 1));

    const RGB = Hp < 1 ? (
        [C, X, 0]
    ) : Hp < 2 ? (
        [X, C, 0]
    ) : Hp < 3 ? (
        [0, C, X]
    ) : Hp < 4 ? (
        [0, X, C]
    ) : Hp < 5 ? (
        [X, 0, C]
    ) : (
        [C, 0, X]
    );

    const m = V - C;
    return {
        r: Math.floor((RGB[0] + m) * 255),
        g: Math.floor((RGB[1] + m) * 255),
        b: Math.floor((RGB[2] + m) * 255),
    };
}

/* ---- utils */

function scaleCentered(ctx, cellWidth, cellHeight, hScale, vScale) {
    ctx.transform(
        hScale,
        0, 0,
        vScale,
        cellWidth * (1 - hScale) / 2, cellHeight * (1 - vScale) / 2,
    );
}

/* ---- effects */

function effectFlipHoriz(keyframe, ctx, cellWidth) {
    ctx.translate(cellWidth, 0);
    ctx.scale(-1, 1);
}

function effectFlipVert(keyframe, ctx, cellWidth, cellHeight) {
    ctx.translate(0, cellHeight);
    ctx.scale(1, -1);
}

function effectKira(keyframe, ctx) {
    const currentFilter = ctx.filter === "none" ? "" : `${ctx.filter} `;
    ctx.filter = `${currentFilter}saturate(1000%) hue-rotate(${keyframe * 360}deg)`;
}

function effectMoyamoya(keyframe, ctx) {
    const currentFilter = ctx.filter === "none" ? "" : `${ctx.filter} `;
    ctx.filter = `${currentFilter}blur(${6 + 1 * Math.cos(2 * Math.PI * keyframe)}px)`;
}

function effectFoil(keyframe, ctx) {
    const currentFilter = ctx.filter === "none" ? "" : `${ctx.filter} `;
    ctx.filter = `${currentFilter}brightness(${120 + Math.floor(20 * Math.sin(2 * Math.PI * keyframe))}%)`;
}

function effectBlink(keyframe, ctx, cellWidth) {
    if (keyframe >= 0.5) {
        ctx.translate(-cellWidth * 2, 0); /* hide */
    }
}

function effectNaturalBlur(keyframe, ctx) {
    const HSVColor = HSV2RGB(0, 0, keyframe);
    ctx.shadowColor = `rgb(${HSVColor.r}, ${HSVColor.g}, ${HSVColor.b})`;
    ctx.shadowBlur = 50 * keyframe;
}

function effectNeon(keyframe, ctx) {
    const HSVColor = HSV2RGB(Math.floor(keyframe * 360 * 4) % 360, 1, 1);
    ctx.shadowColor = `rgb(${HSVColor.r}, ${HSVColor.g}, ${HSVColor.b})`;
    ctx.shadowBlur = 10;
}

function effectShadowRotate(keyframe, ctx) {
    ctx.shadowColor = "black";
    ctx.shadowOffsetY = Math.cos(2 * Math.PI * keyframe) * 5;
    ctx.shadowOffsetX = Math.sin(2 * Math.PI * keyframe) * 5;
}

function effectPatapata(keyframe, ctx, cellWidth) {
    ctx.transform(
        Math.cos(2 * Math.PI * keyframe),
        0, 0,
        1,
        cellWidth * (0.5 - 0.5 * Math.cos(2 * Math.PI * keyframe)), 0,
    );
}

function effectDokaben(keyframe, ctx, cellWidth) {
    ctx.transform(
        Math.cos(2 * Math.PI * keyframe),
        0, 0,
        1,
        cellWidth * (0.5 - 0.5 * Math.cos(2 * Math.PI * keyframe)), 0,
    );
}

function effectRotate(keyframe, ctx, cellWidth, cellHeight) {
    ctx.translate(cellWidth / 2, cellHeight / 2);
    ctx.rotate(Math.PI * 2 * keyframe);
    ctx.translate(-cellWidth / 2, -cellHeight / 2);
}

function effectKurukuru(keyframe, ctx, cellWidth, cellHeight) {
    ctx.translate(
        Math.cos(Math.PI * 2 * keyframe) * 0.05 * cellWidth,
        Math.sin(Math.PI * 2 * keyframe) * 0.05 * cellHeight,
    );
}

let lastGata = false;
function effectGatagata(keyframe, ctx, cellWidth, cellHeight) {
    lastGata = !lastGata;
    ctx.translate(
        cellWidth / 2 + (Math.random() - 0.5) * 4,
        cellHeight / 2 + (Math.random() - 0.5) * 4,
    );
    ctx.rotate(lastGata ? -0.05 : 0.05);
    ctx.translate(-cellWidth / 2, -cellHeight / 2);
}

function effectYatta(keyframe, ctx, cellWidth, cellHeight) {
    if (keyframe >= 0.5) {
        /* flip */
        ctx.translate(cellWidth, 0);
        ctx.scale(-1, 1);
    }
    ctx.translate(cellWidth / 2, cellHeight / 2);
    ctx.rotate(0.1);
    ctx.translate(-cellWidth / 2, -cellHeight / 2);
    ctx.translate(0, cellHeight / 16 * Math.sin(8 * Math.PI * keyframe));
}

function effectPoyon(keyframe, ctx, cellWidth, cellHeight) {
    if (keyframe < 0.6) {
        ctx.translate(0, -cellHeight / 6 * Math.sin(Math.PI * keyframe / 0.6));
    } else {
        const ratio = Math.sin(Math.PI * (keyframe - 0.6) / 0.4) / 2;
        ctx.transform(
            1 + ratio,
            0, 0,
            1 - ratio,
            -ratio * cellWidth / 2, ratio * cellHeight * 3 / 4,
        );
    }
}

function effectMotimoti(keyframe, ctx, cellWidth, cellHeight) {
    const ratio = Math.sin(Math.PI * Math.abs(keyframe - 0.5) / 0.5) / 4;
    ctx.transform(1 + ratio, 0, 0, 1 - ratio, -ratio * cellWidth / 2, ratio * cellHeight * 3 / 4);
}

function effectYurayura(keyframe, ctx, cellWidth, cellHeight) {
    ctx.translate(cellWidth / 2, cellHeight * 3 / 4);
    ctx.rotate(Math.PI * Math.abs(keyframe - 0.5) / 2 - Math.PI / 8);
    ctx.translate(-cellWidth / 2, -cellHeight * 3 / 4);
}

function effectZoom(keyframe, ctx, cellWidth, cellHeight) {
    const zoom = Math.abs(keyframe - 0.5) * 2 - 0.5;
    ctx.transform(1 + zoom, 0, 0, 1 + zoom, -cellWidth / 2 * zoom, -cellHeight / 2 * zoom);
}

function effectStraight(keyframe, ctx, cellWidth, cellHeight) {
    if (keyframe < 0.5) {
        scaleCentered(ctx, cellWidth, cellHeight, keyframe * 2, keyframe * 2);
    }
}

function effectTiritiri(keyframe, ctx, cellWidth, cellHeight) {
    const imageData = ctx.getImageData(0, 0, cellWidth, cellHeight);
    const { data } = imageData;
    for (let row = 0; row < cellHeight; row += 1) {
        for (let col = 0; col < cellWidth; col += 1) {
            data[(row * cellWidth + col) * 4 + 3] = Math.floor(255 * Math.random());
        }
    }
    ctx.putImageData(imageData, 0, 0);
}

function effectPsych(keyframe, ctx, cellWidth, cellHeight) {
    const imageData = ctx.getImageData(0, 0, cellWidth, cellHeight);
    const { data } = imageData;
    for (let row = 0; row < cellHeight; row += 1) {
        for (let col = 0; col < cellWidth; col += 1) {
            if (row % 10 <= 5 && col % 10 >= 5) {
                const color = HSV2RGB(Math.floor(keyframe * 360 * 4 + 180) % 360, 1, 1);
                data[(row * cellWidth + col) * 4] = color.r;
                data[(row * cellWidth + col) * 4 + 1] = color.g;
                data[(row * cellWidth + col) * 4 + 2] = color.b;
                data[(row * cellWidth + col) * 4 + 3] = 255;
            } else if (row % 10 < 5 ^ col % 10 < 5) {
                const color = HSV2RGB(Math.floor(keyframe * 360 * 4 + 90) % 360, 1, 1);
                data[(row * cellWidth + col) * 4] = color.r;
                data[(row * cellWidth + col) * 4 + 1] = color.g;
                data[(row * cellWidth + col) * 4 + 2] = color.b;
                data[(row * cellWidth + col) * 4 + 3] = 255;
            } else {
                const color = HSV2RGB(Math.floor(keyframe * 360 * 4) % 360, 1, 1);
                data[(row * cellWidth + col) * 4] = color.r;
                data[(row * cellWidth + col) * 4 + 1] = color.g;
                data[(row * cellWidth + col) * 4 + 2] = color.b;
                data[(row * cellWidth + col) * 4 + 3] = 255;
            }
        }
    }
    ctx.putImageData(imageData, 0, 0);
}

function effectDizzy(keyframe, ctx, cellWidth, cellHeight) {
    const imageData = ctx.getImageData(0, 0, cellWidth, cellHeight);
    const { data } = imageData;
    for (let row = 0; row < (cellHeight * cellWidth * 4); row += 4) {
        if (Math.floor(row / 4 + (keyframe * 40)) % 40 < 40
            && Math.floor(row / 4 + (keyframe * 40)) % 40 > 20) {
            const color = HSV2RGB(Math.floor(keyframe * 360 * 4) % 360 + 180, 1, 1);
            data[row] = color.r;
            data[row + 1] = color.g;
            data[row + 2] = color.b;
            data[row + 3] = 255;
        }
    }
    ctx.putImageData(imageData, 0, 0);
}

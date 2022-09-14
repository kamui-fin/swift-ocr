// import * as ocr from "@paddlejs-models/ocr";
import textFit from "textfit";

// in px
const MIN_WIDTH = 500;
const MIN_HEIGHT = 500;

const loading = document.getElementById("isLoading");

const vertical = true;

let images = [];
let overlayToImage = {};

const positionToElm = (parent, overlay) => {
    const rect = parent.getBoundingClientRect();
    overlay.style.position = "absolute";
    overlay.style.left = `${rect.left}px`;
    overlay.style.top = `${rect.top}px`;
    overlay.style.width = `${parent.clientWidth}px`;
};

window.addEventListener(
    "resize",
    () => {
        overlayToImage.keys().map((overlay) => {
            positionToElm(overlayToImage[overlay], overlay);
        });
    },
    true
);

const getMatchedImages = () => {
    const images = document.getElementsByTagName("img");
    const list = [];
    for (let image of images) {
        if (
            image.clientWidth >= MIN_WIDTH &&
            image.clientHeight >= MIN_HEIGHT
        ) {
            if (!image.complete) {
                // unsure whether this causes issues
                /* image.onload = () => {
                    images = getMatchedImages();
                }; */
            }
            list.push(image);
        }
    }
    return list;
};

images = getMatchedImages();

const processImage = async (img) => {
    // const res = await ocr.recognize(img, { canvas });
    const res = {
        text: [
            "",
            "昨天谢谢你。",
            "对了：",
            "没影响吧？",
            "美术杜那边",
            "美",
            "社团的啊*$.．",
            "知道我是哪个",
            "野崎君·",
            "啊",
            "对啊·",
        ],
        points: [
            [
                [79.99375, 56.065625],
                [136.13125, 56.065625],
                [136.13125, 139.990625],
                [79.99375, 139.990625],
            ],
            [
                [567.046875, 51.434375],
                [610.0625, 51.434375],
                [610.834375, 211.775],
                [567.81875, 211.775],
            ],
            [
                [637.2875, 60.696875000000006],
                [681.075, 60.696875000000006],
                [681.075, 139.21875],
                [637.2875, 139.21875],
            ],
            [
                [443.546875, 185.740625],
                [490.421875, 185.740625],
                [490.421875, 331.415625],
                [443.546875, 331.415625],
            ],
            [
                [472.10625, 185.740625],
                [519.753125, 185.740625],
                [519.753125, 335.275],
                [472.10625, 335.275],
            ],
            [
                [472.10625, 195.003125],
                [493.509375, 195.003125],
                [493.509375, 219.49375],
                [472.10625, 219.49375],
            ],
            [
                [494.490625, 423.478125],
                [541.365625, 423.478125],
                [541.365625, 596.940625],
                [494.490625, 596.940625],
            ],
            [
                [523.821875, 424.25],
                [571.46875, 424.25],
                [571.46875, 600.028125],
                [523.821875, 600.028125],
            ],
            [
                [607.95625, 429.653125],
                [653.2875, 430.425],
                [650.971875, 544.453125],
                [605.640625, 543.68125],
            ],
            [
                [82.309375, 452.809375],
                [120.69375, 455.896875],
                [117.60625, 492.7375],
                [79.221875, 489.65],
            ],
            [
                [62.240624999999994, 551.609375],
                [106.028125, 551.609375],
                [106.028125, 624.728125],
                [62.240624999999994, 624.728125],
            ],
        ],
    };
    /* const res = {
        text: ["邮命。", "我不是", "灰飞烟灭了吗？", "身．", "这是棺樟？"],
        points: [
            [
                [308.64479166666666, 0],
                [564.1697916666667, 0],
                [561.4479166666666, 96.91458333333334],
                [305.92291666666665, 89.65625],
            ],
            [
                [478.30833333333334, 160.75625],
                [595.0177083333333, 160.75625],
                [595.0177083333333, 211.23333333333332],
                [478.30833333333334, 211.23333333333332],
            ],
            [
                [480.12291666666664, 203.39895833333333],
                [710.24375, 203.39895833333333],
                [710.24375, 249.33958333333334],
                [480.12291666666664, 249.33958333333334],
            ],
            [
                [353.1020833333333, 400.28125],
                [431.70520833333336, 393.9302083333333],
                [446.221875, 543.3020833333334],
                [367.61875, 549.653125],
            ],
            [
                [147.146875, 730.5354166666667],
                [314.6645833333333, 730.5354166666667],
                [314.6645833333333, 780.1052083333333],
                [147.146875, 780.1052083333333],
            ],
        ],
    }; */

    // setup overlay container
    let overlayContainer = document.createElement("div");
    overlayContainer.style.height = `${img.clientHeight}px`;
    overlayContainer.style.zIndex = 99;
    overlayContainer.style.background = "transparent";
    overlayContainer.style.color = "transparent";

    positionToElm(img, overlayContainer);
    document.body.appendChild(overlayContainer);

    for (let i = 0; i < res.text.length; i++) {
        const currText = res.text[i];
        const currRect = Array.from(res.points[i].values()); // topleft topright bottomright bottomleft
        // construct a span of currText
        // such that it is bounded by the currRect with the appropriate font size
        // need to dynamically calculate font size
        const textSpan = document.createElement("span");
        textSpan.style.position = "absolute";
        textSpan.style.left = `${currRect[0][0]}px`;
        textSpan.style.top = `${currRect[0][1]}px`;
        textSpan.style.width = `${currRect[1][0] - currRect[0][0]}px`;
        textSpan.style.height = `${currRect[3][1] - currRect[0][1]}px`;

        if (vertical) {
            textSpan.style.display = "flex";
            textSpan.style.justifyContent = "center";
            textSpan.style.alignItems = "center";

            textSpan.style.writingMode = "vertical-rl";
            textSpan.style.textOrientation = "mixed";
        }

        textSpan.innerHTML = currText;
        overlayContainer.appendChild(textSpan);

        if (vertical) {
            textFit(textSpan, {
                detectMultiLine: true,
                alignHoriz: true,
                alignVertWithFlexbox: true,
            });
        } else {
            textFit(textSpan, {
                widthOnly: true,
                detectMultiLine: false,
            });
        }
    }

    return overlayContainer;
};

async function load() {
    // await ocr.init();
    loading.style.display = "none";
    images.forEach(async (img) => {
        if (img.complete) {
            const overlay = await processImage(img);
            overlayToImage[overlay] = img;
        } else {
            img.addEventListener("load", async () => {
                overlayToImage[await processImage(img)] = img;
            });
            img.addEventListener("error", () => console.log("error"));
        }
    });
}

load();

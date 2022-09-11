// import * as ocr from "@paddlejs-models/ocr";
import textFit from "textfit";

const loading = document.getElementById("isLoading");
const imgElement = document.getElementById("image");
const txt = document.getElementById("txt");
const canvas = document.getElementById("canvas");

const processImage = async () => {
    // const res = await ocr.recognize(imgElement, { canvas });
    const res = {
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
    };

    const rect = imgElement.getBoundingClientRect();

    // setup overlay container
    let overlayContainer = document.createElement("div");
    overlayContainer.style.position = "absolute";
    overlayContainer.style.left = `${rect.left}px`;
    overlayContainer.style.top = `${rect.top}px`;
    overlayContainer.style.zIndex = 99;
    overlayContainer.style.width = `${imgElement.clientWidth}px`;
    overlayContainer.style.height = `${imgElement.clientHeight}px`;
    overlayContainer.style.background = "transparent";
    overlayContainer.style.color = "transparent";

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
        textSpan.innerHTML = currText;
        overlayContainer.appendChild(textSpan);
        textFit(textSpan, { widthOnly: true, detectMultiLine: false });
    }

    if (res.text?.length) {
        txt.innerHTML = res.text.reduce(
            (total, cur) => total + `<p>${cur}</p>`
        );
    }
};

async function load() {
    // await ocr.init();
    loading.style.display = "none";

    if (imgElement.complete) {
        processImage();
    } else {
        imgElement.addEventListener("load", processImage);
        imgElement.addEventListener("error", () => console.log("error"));
    }
}

load();

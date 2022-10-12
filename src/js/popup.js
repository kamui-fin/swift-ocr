import * as ocr from "@paddlejs-models/ocr";
import textFit from "textfit";

// in px
const MIN_WIDTH = 500;
const MIN_HEIGHT = 500;

const loading = document.getElementById("isLoading");
const canvasContainer = document.querySelector(".canvas");

const vertical = true;

let images = [];
let overlayToImage = {};

const positionToElm = (parent, overlay) => {
    console.log(overlay);
    const rect = parent.getBoundingClientRect();
    overlay.style.position = "absolute";
    overlay.style.left = `${rect.left}px`;
    overlay.style.top = `${rect.top}px`;
    overlay.style.width = `${parent.clientWidth}px`;
};

window.addEventListener(
    "resize",
    () => {
        Object.keys(overlayToImage).map((overlay) => {
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
    const debugCanvas = document.createElement("canvas");
    canvasContainer.appendChild(debugCanvas);
    const res = await ocr.recognize(img, { canvas: debugCanvas });
    console.log(res);

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

let workerImage = 0;

const iterProcess = async () => {
    if (workerImage >= images.length) {
        return;
    }

    const a = performance.now();
    const overlay = await processImage(images[workerImage]);
    overlayToImage[overlay] = images[workerImage];
    workerImage++;
    const b = performance.now();
    console.log(b - a + " ms for worker " + workerImage);

    await iterProcess();
};

async function load() {
    await ocr.init();
    loading.style.display = "none";
    iterProcess();
    // old code needs to be take into consideration to make the iterProcess bug-free in the case of new image renders
    /* images.forEach(async (img) => {
        if (img.complete) {
            const overlay = await processImage(img);
            overlayToImage[overlay] = img;
        } else {
            img.addEventListener("load", async () => {
                const overlay = await processImage(img);
                overlayToImage[overlay] = img;
            });
            img.addEventListener("error", () => console.log("error"));
        }
    }); */
}

load();

var EResourceState;
(function (EResourceState) {
    EResourceState[EResourceState["created"] = 0] = "created";
    EResourceState[EResourceState["error"] = 1] = "error";
    EResourceState[EResourceState["loading"] = 2] = "loading";
    EResourceState[EResourceState["ready"] = 3] = "ready";
    EResourceState[EResourceState["playing"] = 4] = "playing";
})(EResourceState || (EResourceState = {}));
;
var EAllowedFormats;
(function (EAllowedFormats) {
    EAllowedFormats["PNG"] = ".png";
    EAllowedFormats["GIF"] = ".gif";
    // TODO
    EAllowedFormats["SVG"] = ".svg";
})(EAllowedFormats || (EAllowedFormats = {}));
;
var EViewerTypes;
(function (EViewerTypes) {
    EViewerTypes[EViewerTypes["HTML"] = 0] = "HTML";
    EViewerTypes[EViewerTypes["Canvas"] = 1] = "Canvas";
    //TODO
    EViewerTypes[EViewerTypes["WebGL"] = 2] = "WebGL";
    EViewerTypes[EViewerTypes["PIXI"] = 3] = "PIXI";
})(EViewerTypes || (EViewerTypes = {}));
;
;
;
;
;
;
;
;
function isAnAllowedFormat(str, formats) {
    const l = formats.length;
    let i;
    for (i = 0; i < l; i += 1) {
        const format = formats[i];
        if (str.endsWith(format)) {
            return format; //true;
        }
    }
    return false;
}
class Sprite {
    constructor(path) {
        this.type = "sprite";
        this.image = undefined;
        this.state = EResourceState.created;
        // check path : resource shall be .png .gif TODO : add VIDEO, SVG
        const format = isAnAllowedFormat(path, [EAllowedFormats.PNG, EAllowedFormats.GIF]);
        if (!format) {
            throw new Error("This file format is not accepted for Sprite");
        }
        // Load image using path
        // if .png or .gif
        if (format === EAllowedFormats.PNG) {
            this.loadMatrixImage(path, format);
        }
    }
    loadMatrixImage(path, format) {
        new Promise((resolve, reject) => {
            this.image = new Image();
            console.log("setting onload");
            this.image.onload = resolve;
            this.image.onerror = reject;
            this.image.src = path;
            this.state = EResourceState.loading;
        }).then(val => {
            this.state = EResourceState.ready;
            console.log("matrix image is now loaded");
        }).catch(reason => {
            throw new Error("Couldn't load image : " + reason);
        });
    }
    loadVectorImage(path, format) {
    }
    loadInlineVectorImage(svg, format) {
    }
    loadVideo(path, format) {
    }
}
class SpriteSheet extends Sprite {
    constructor(path, nbLines, nbColumns) {
        super(path);
        this.type = "spritesheet";
    }
}
class Referential {
    constructor(origin) {
        if (Reflect.has(origin, "theta")) {
            this.setOrientation(origin.theta);
        }
        else {
            this.setOrientation(0);
        }
        this.x = origin.x;
        this.y = origin.y;
        if (origin.hasOwnProperty("z")) {
            this.z = origin.z;
        }
        else {
            this.z = 0;
        }
    }
    getOrientation() {
        return this.orientation;
    }
    setOrientation(orientation) {
        this.orientation = orientation;
        this.cos = Math.cos(this.orientation);
        this.sin = Math.sin(this.orientation);
    }
    // Transforms a world point into a point from this referential
    transform(point) {
        const dx = point.x - this.x;
        const dy = point.y - this.y;
        return {
            x: dx * this.cos + dy * this.sin,
            y: dx * -this.sin + dy * this.cos,
            // if z undefined, then the point has the same z coordinate as the referential
            z: Reflect.has(point, "z") ? point.z - this.z : 0,
            theta: this.orientation
        };
    }
    // Transforms a point from this referential into a world point
    invTransform(point) {
        return {
            x: this.x + point.x * this.cos - point.y * this.sin,
            y: this.y + point.x * this.sin + point.y * this.cos,
            // if z undefined, then the point has the same z coordinate as the referential
            z: Reflect.has(point, "z") ? point.z + this.z : 0,
            theta: 0
        };
    }
}
class Viewer {
    constructor(HTMLContainer, type, width, height) {
        this.type = type;
        if (type === EViewerTypes.Canvas) {
            const context = HTMLContainer.getContext('2d');
        }
    }
}
class Scene {
    constructor(resources) {
        // init
        this.type = "scene";
        this.state = EResourceState.loading;
        // load resources
    }
    addResource() {
    }
}

const g = {};
function main() {
    console.log("Welcome in Belvederes");
    const s = new Sprite("./assets/imgs/test.png");
    g.s=s;
}

enum EResourceState {
    created,
    error,
    loading,
    ready,
    playing
};

enum EAllowedFormats {
    PNG = ".png",
    GIF = ".gif",
    // TODO
    SVG = ".svg",
    
};

enum EViewerTypes {
    HTML,
    Canvas,
    //TODO
    WebGL,
    PIXI,
};

interface HashOf<T> {
    [key : string] : T;
};

interface ILoadable {
    type : string;
    path : string;
    state : EResourceState;
};

interface IInput {
    // TODO
};

type TLoadables = HashOf<ILoadable>;
type TInputs = HashOf<IInput>;

type TCanvasImageSource = HTMLImageElement | HTMLCanvasElement | SVGImageElement | HTMLVideoElement;

interface IGraphics {
    width : number;
    height : number;
    anchor : IPoint2D;
    coordinates : TCoordinates;
};

interface IPoint2D {
    x : number;
    y : number;
};

interface IPoint3D {
    x : number;
    y : number;
    z : number;
};

interface IAngle {
    theta : number;
};

type TCoordinates = (IPoint2D | IPoint3D) & (IAngle | undefined);

function isAnAllowedFormat(str : string, formats : EAllowedFormats[]) : boolean | EAllowedFormats {
    const l = formats.length
    let i;
    for (i = 0; i < l; i += 1) {
        const format = formats[i];
        if (str.endsWith(format)) {
            return format; //true;
        }
    }

    return false;
}

class Sprite implements ILoadable {
    public type : string;
    public path : string;
    public state : EResourceState;
    
    public image ?: TCanvasImageSource;

    constructor (path : string) {
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
            this.loadMatrixImage(path, format as string);
        }
    }

    loadMatrixImage(path : string, format ?: string) : void {
        new Promise((resolve, reject) => {
            this.image = new Image();

            console.log("setting onload");
            this.image.onload = resolve;
            this.image.onerror = reject;

            (this.image as HTMLImageElement).src = path;
            this.state = EResourceState.loading;
        }).then(val => {
            this.state = EResourceState.ready;
            console.log("matrix image is now loaded")
        }).catch(reason => {
            throw new Error("Couldn't load image : " + reason);
        });
    }

    loadVectorImage(path : string, format ?: string) : void {

    }

    loadInlineVectorImage(svg : object, format ?: string) : void {

    }

    loadVideo(path : string, format ?: string) : void {

    }
}

class SpriteSheet extends Sprite implements ILoadable {
    public type : string;
    public path : string;
    
    constructor (path : string, nbLines : number, nbColumns : number) {
        super(path);
        this.type = "spritesheet";

    }
}

class Referential {
    private x : number;
    private y : number;
    private z : number;

    private orientation : number;
    private cos : number;
    private sin : number;

    constructor(origin : TCoordinates) {
        if (Reflect.has(origin, "theta")) {
            this.setOrientation((origin as IAngle).theta);
        } else {
            this.setOrientation(0);
        }

        this.x = origin.x;
        this.y = origin.y;
        if (origin.hasOwnProperty("z")) {
            this.z = (origin as IPoint3D).z;
        } else {
            this.z = 0;
        }
    }

    public getOrientation() {
        return this.orientation;
    }
    public setOrientation(orientation : number) {
        this.orientation = orientation;
        this.cos = Math.cos(this.orientation);
        this.sin = Math.sin(this.orientation);
    }

    // Transforms a world point into a point from this referential
    public transform(point : IPoint2D | IPoint3D) : (IPoint3D & IAngle) {
        const dx = point.x - this.x;
        const dy = point.y - this.y;
        
        return {
            x: dx * this.cos + dy * this.sin,
            y: dx * - this.sin  + dy * this.cos,
            // if z undefined, then the point has the same z coordinate as the referential
            z: Reflect.has(point, "z") ? (point as IPoint3D).z - this.z : 0,
            theta: this.orientation
        };
    }
    // Transforms a point from this referential into a world point
    public invTransform(point : IPoint2D | IPoint3D) {
        return {
            x: this.x + point.x * this.cos - point.y * this.sin,
            y: this.y + point.x * this.sin  + point.y * this.cos ,
            // if z undefined, then the point has the same z coordinate as the referential
            z: Reflect.has(point, "z") ? (point as IPoint3D).z + this.z : 0,
            theta: 0
        };
    }
}

interface IViewer {
    getType() : EViewerTypes;
    init(HTMLContainer ?: HTMLElement) : Promise<any>;
    destroy(): Promise<boolean>;

    draw() : void;
    clear() : void;
    resize(width : number, height : number) : void;
};

class CanvasViewer implements IViewer {
    constructor() {
        
    }
    public getType() : EViewerTypes {
        return EViewerTypes.Canvas;
    }
    
    public async init(HTMLContainer : HTMLElement) {

        const canvas = document.createElement("canvas");
        HTMLContainer.appendChild(canvas);

        const ctx = canvas.getContext("2d");
        //ctx.drawImage(g.s.image, 0,0,212,288);

        return;
    };
    public async destroy() {

        return true;
    }
    public draw() {

    }
    public clear() {
        
    }
    public resize(width : number, height : number) {

    }
}

class Scene implements ILoadable {
    public path : string;
    public type : string;

    public state : EResourceState;
    public resources : TLoadables;
    public config : {
        [key : string] : any;
    }

    private time : number;
    private viewer : IViewer;
    private inputs : TInputs

    constructor(resources ?: TLoadables) {
        // init
        this.type = "scene";
        this.state = EResourceState.loading;

        // load resources
        
    }


    makeViewer(type : EViewerTypes, width : number, height : number, HTMLContainer : HTMLElement) {
        if (type === EViewerTypes.Canvas) {    
            this.viewer = new CanvasViewer();
            this.viewer.init(HTMLContainer);

            const context = (HTMLContainer as HTMLCanvasElement).getContext('2d');

       }

       this.resize(width, height);
    }

    redraw() {
        this.viewer.clear();
        this.viewer.draw();
    }

    resize(width : number, height : number) {
        this.viewer.resize(width, height);
    }


    addResource() {

    }
}




function main() {
    console.log("Welcome in Belvederes");

    const s = new Sprite("../assets/imgs/test.png");

}
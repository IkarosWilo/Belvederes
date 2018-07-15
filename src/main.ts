enum EResourceState {
    created,
    error,
    loading,
    ready,
    playing
};

interface ILoadable {
    type : string;
    path : string;
    state : EResourceState;
};

interface ILoadables {
    [key : string] : ILoadable;
};

type TCanvasImageSource = HTMLImageElement | HTMLCanvasElement | SVGImageElement | HTMLVideoElement;

interface IGraphics {
    width : number;
    height : number;
};

function isAnAllowedFormat(str : string, formats : string[]) : boolean | string {
    formats.forEach(format => {
        if (str.endsWith(format)) {
            return format;//true;
        }
    });

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
        const format = isAnAllowedFormat(path, [".png", ".gif"]);
        if (!format) {
            throw new Error("This file format is not accepted for Sprite");
        }

        // Load image using path
        // if .png or .gif
        this.loadMatrixImage(path, format as string);
    }

    loadMatrixImage(path : string, format ?: string) : void {
        new Promise((resolve, reject) => {
            this.image = new Image();

            this.image.onload = resolve;
            this.image.onerror = reject;

            (this.image as HTMLImageElement).src = path;
            this.state = EResourceState.loading;
        }).then(val => {
            this.state = EResourceState.ready;
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

class Scene implements ILoadable {
    public path : string;
    public type : string;

    public state : EResourceState;
    public resources : ILoadables;
    public config : {
        [key : string] : any;
    }

    private time : number;

    constructor (resources ?: ILoadables) {
        // init
        this.type = "scene";
        this.state = EResourceState.loading;

        // load resources
        
    }

    addResource () {

    }
}


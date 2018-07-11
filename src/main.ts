enum EResourceState {
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

class Sprite implements ILoadable {
    public type : string;
    public path : string;
    public state : EResourceState;
    
    public image : HTMLImageElement;

    constructor (path : string) {
        this.type = "sprite";
        this.image = new Image();
        
        // check path
        if (!path.endsWith(".png") && !path.endsWith(".gif")) {
            throw new Error("Only .png and .gif are accepted for Sprite");
        }
        // load image using path
        this.image = new Image()

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

    public state : ESceneState;
    public resources : ILoadables;
    public config : {
        [key : string] : any;
    }

    private time : number;

    constructor (resources ?: ILoadables) {
        // init
        this.type = "scene";
        this.state = ESceneState.loading;

        // load resources
        
    }

    addResource () {

    }
}


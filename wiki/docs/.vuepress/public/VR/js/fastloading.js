var tpanoAutoLoad = Array();

for (let i = 0; i < document.getElementsByTagName('tpano').length; i++) {
    tpanoAutoLoad[i] = new TPano({
        el: document.getElementsByTagName('tpano')[i].id,//照片查看器根节点dom的id
        photo: [
            //全景照片数组，每项为一张照片
            {
                url: document.getElementsByTagName('tpano')[i].attributes.src.value,
                name: 'auto'
            }
        ],
        rotateAnimateController: true,//镜头自转
        MouseController: false
    });
}

var el = window.document.body;
window.document.body.onmouseover = function (event) {
    el = event.target;
    if (el.tagName == "CANVAS") {
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';

        console.log(tpanoAutoLoad);
        for (let i = 0; i < tpanoAutoLoad.length; i++) {
            tpanoAutoLoad[i].re.seitchMouseController(true);
        }
    } else {
        document.documentElement.style.overflow = 'auto';
        document.body.style.overflow = 'auto';

        for (let i = 0; i < tpanoAutoLoad.length; i++) {
            tpanoAutoLoad[i].re.seitchMouseController(false);
        }
    }
}

window.document.body.addEventListener('touchstart', function (event) {
    el = event.target;
    console.log(el);
    if (el.tagName == "CANVAS") {
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';

        console.log(tpanoAutoLoad);
        for (let i = 0; i < tpanoAutoLoad.length; i++) {
            tpanoAutoLoad[i].re.seitchMouseController(true);
        }
    } else {
        document.documentElement.style.overflow = 'auto';
        document.body.style.overflow = 'auto';

        for (let i = 0; i < tpanoAutoLoad.length; i++) {
            tpanoAutoLoad[i].re.seitchMouseController(false);
        }
    }
});
const canvas = $('canvas')[0];
const ctx = canvas.getContext('2d');
let images = [];
let selectLayer = 0;
let isDrag = false;
let beforePos = [];
let UIOpacity = 0.5;
let isPreview = false;
let textureUI = [];
let selectUI = 0;

ctx.mozImageSmoothingEnabled = false;
ctx.webkitImageSmoothingEnabled = false;
ctx.msImageSmoothingEnabled = false;
ctx.imageSmoothingEnabled = false;

// 画像（レイヤー）のクラス
class ImageObject {
    constructor(image, x, y, name, locked) {
        this.pos = [x ?? 0, y ?? 0];
        this.image = image;
        this.name = name;
        this.locked = locked ?? false;
        this.width = image.width;
        this.height = image.height;
        this.scale = 1;
    }
    get Pos() {
        return this.pos;
    }
    set Pos(pos) {
        if (!this.locked) this.pos = pos;
    }
    get Image() {
        return this.image;
    }
    get Name() {
        return this.name;
    }
    set Name(name) {
        this.name = name;
    }
    get Locked() {
        return this.locked;
    }
    get Width() {
        return this.width;
    }
    get Height() {
        return this.height
    }
    get Scale() {
        return this.scale;
    }
    set Scale(value) {
        this.scale = value;
    }
    move(x, y) {
        if (!this.locked) this.pos = [this.pos[0] + x, this.pos[1] + y];
    }
}

// UI作成ボタン
// $('#create-inventory').click(function() {
//     console.log('happy');
//     images.unshift(new ImageObject(InventoryBottom, Number($('#X').val()), Number($('#Y').val()), `インベントリ${images.length+1}`, true));
//     updateList();
//     // console.log(images);
// });



// 画像をドラッグする
$('canvas').mousedown(function(e) {
    isDrag = true;
    beforePos = [e.offsetX, e.offsetY];
    console.log(isDrag);
});

$('body').mouseup(function() {
    isDrag = false;
    console.log(isDrag);
});

$('canvas').mousemove(function(e) {
    if (isDrag) {
        // 座標を更新
        console.log(e);
        images[selectLayer].move(e.offsetX - beforePos[0], e.offsetY - beforePos[1]);
        beforePos = [e.offsetX, e.offsetY];
        console.log(images[selectLayer].Pos);
        draw();
    }
});


// レイヤー選択時
$(document).on('click', '.layer', function() {
    selectLayer = $(this).index();
    updateList();
    // images[selectLayer].Pos = [10, 10];
});

// レイヤーを上に入れ替え
$(document).on('click', '#layer-up', function() {
    const thisLayer = $(this).parent('.move-button').parent('.layer');
    const index = thisLayer.index();

    if(index === 0 || images[index].Locked === true) return; // 入れ替えない条件
    images.splice(index-1, 2, images[index], images[index-1]); // レイヤーデータの入れ替え
    selectLayer = index-1;
    updateList(); // HTMLの更新
    return false;
});

// 下に入れ替え
$(document).on('click', '#layer-down', function() {
    const thisLayer = $(this).parent('.move-button').parent('.layer');
    const index = thisLayer.index();

    if(index === images.length -1 || images[index].Locked === true) return; // 入れ替えない条件
    images.splice(index, 2, images[index+1], images[index]); // レイヤーデータの入れ替え
    selectLayer = index+1;
    updateList(); // HTMLの更新
    return false;
});

// レイヤーを削除
$(document).on('click', '.delete-button', function() {
    const index = $(`.layer:nth-child(${selectLayer+1})`).index();
    images.splice(index, 1);
    selectLayer = 0;
    updateList();
    return false;
});

// UIの変更時
$('#select-ui').change(function() {
    selectUI = Number($(this).val());
    draw();
});

// プレビューボタン
$('.preview').click(function() {
    isPreview = !isPreview;
    console.log(isPreview);
    if(isPreview) {$(this).addClass('enable');}
    else {$(this).removeClass('enable');}
    draw();
});

// 移動
// $(document).on('keypress', function(e) {
//     if(e.key === "w") {
//         images[selectLayer].move(0, -20);
//     }
//     else if(e.key === "d") {
//         images[selectLayer].move(20, 0);
//     }
//     else if(e.key === "a") {
//         images[selectLayer].move(-20, 0);
//     }
//     else if(e.key === "s") {
//         images[selectLayer].move(0, 20);
//     }
// });

$('.import-image').click(function() {
    $('#file-uploader').click();
});

// 画像をインポート
$('#file-uploader').change(function() {
    const importImage = $('#file-uploader').prop("files")[0];
    console.log(importImage);

    let reader = new FileReader();
    reader.readAsDataURL(importImage);
    reader.onload = () => {
        let drawImage = new Image();
        drawImage.src = reader.result;
        drawImage.onload = () => {
            images.push(new ImageObject(drawImage, 0, 0, importImage.name, false));
            updateList();
        }
    }
});

// 画像を描画する
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = images.length -1; i >= 0; i--) {
        const image = images[i];
        ctx.drawImage(image.Image, image.pos[0], image.pos[1], image.Width * image.Scale, image.Height * image.Scale);
    }
    // インベントリ
    ctx.globalAlpha = UIOpacity;
    ctx.drawImage(textureUI[selectUI+1], 0, 0);
    ctx.globalAlpha = 1;
    ctx.drawImage(textureUI[selectUI], 0, 0);
    updateValue();
    if(isPreview) {
        inventoryClip();
    }
}

// 位置の表示を更新
function updateValue() {
    const image = images[selectLayer];
    $('#layerX').val(image.Pos[0]);
    $('#layerY').val(image.Pos[1]);
    $('#layerScale').val(image.Scale);
    $('#UIOpacity').val(UIOpacity);
}

// 位置を反映
$('.input-value').change(function() {
    images[selectLayer].Pos[0] = Number($('#layerX').val());
    images[selectLayer].Pos[1] = Number($('#layerY').val());
    images[selectLayer].Scale = Number($('#layerScale').val());
    UIOpacity = Number($('#UIOpacity').val());
    console.log('changed');
    draw();
});

// ダウンロードボタン
$('.download').click(function() {
    inventoryClip();
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png', 1);
    link.download = 'inventory.png';
    link.click();
});

// レイヤーを表示するHTML要素の反映
function updateList() {
    $('.object-list').empty();
    for(i = 0; i < images.length; i++) {
        $(
            `<div class='layer'>
                <div class='name'>${images[i].name}</div>
                <div class='delete-button icon'></div>
                <div class='move-button'>
                    <div class='icon' id='layer-up'></div>
                    <div class='icon' id='layer-down'></div>
                </div>
             </div>`
        ).appendTo('.object-list');
        if(images[i].Locked) $(`.layer:nth-child(${i+1})`).addClass('locked');
    }
    $(`.layer:nth-child(${selectLayer+1})`).addClass('selected');
    draw();
    console.log(selectLayer);
}

// UIからはみ出た部分を切り取る
function inventoryClip() {
    // 8x3
    if(selectUI === 0||2) {
        ctx.clearRect(0, 0, 3, 8);
        ctx.clearRect(3, 0, 4, 4);
        ctx.clearRect(691, 0, 4, 4);
        ctx.clearRect(695, 0, 4, 8);
        ctx.clearRect(699, 0, 4, 12);
        ctx.clearRect(0, 652, 3, 4);
        ctx.clearRect(0, 656, 7, 4);
        ctx.clearRect(0, 660, 11, 4);
        ctx.clearRect(695, 660, 4, 4);
        ctx.clearRect(699, 656, 4, 8);
        ctx.clearRect(703, 0, 321, 664);
        ctx.clearRect(0, 664, 1024, 360);
    }
}

function uiLoad() {
    textureUI[0] = new Image();
    textureUI[0].src = 'texture/inventory-top.png';
    textureUI[1] = new Image();
    textureUI[1].src = 'texture/inventory-bottom.png';
    textureUI[2] = new Image();
    textureUI[2].src = 'texture/crafting_table-top.png';
    textureUI[3] = new Image();
    textureUI[3].src = 'texture/crafting_table-bottom.png';
    textureUI[3].onload = () => {
        draw();
        console.log('loaded');
    }
}

uiLoad();
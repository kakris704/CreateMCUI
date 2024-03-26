const canvas = $('canvas')[0];
const ctx = canvas.getContext('2d');
let images = [];
let selectLayer = -1;

// 画像（レイヤー）のクラス
class ImageObject {
    constructor(image, x, y, name, locked) {
        this.pos = [x ?? 0, y ?? 0];
        this.image = image;
        this.name = name;
        this.locked = locked ?? false;
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

    move(x, y) {
        if (!this.locked) this.pos = [this.pos[0] + x, this.pos[1] + y];
    }
}

// UI作成ボタン
$('#create-inventory').click(function() {
    console.log('happy');

    const defaultInventoryUI = new Image();
    defaultInventoryUI.src = 'texture/inventory.png';
    defaultInventoryUI.onload = () => {
        images.push(new ImageObject(defaultInventoryUI, Number($('#X').val()), Number($('#Y').val()), `インベントリ${images.length+1}`, true));
        updateList();
        // console.log(images);
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

// 移動
$(document).on('keypress', function(e) {
    if(e.key === "w") {
        images[selectLayer].move(0, -20);
    }
    else if(e.key === "d") {
        images[selectLayer].move(20, 0);
    }
    else if(e.key === "a") {
        images[selectLayer].move(-20, 0);
    }
    else if(e.key === "s") {
        images[selectLayer].move(0, 20);
    }
});

$('.import-image').click(function() {
    $('#file-uploader').click();
});

// 画像をインポート
$('#file-uploader').change(function() {
    const importImage = $('#file-uploader').prop("files")[0];
    $('a').text(importImage.name);
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
        const pos = images[i].Pos;
        ctx.drawImage(images[i].Image, pos[0], pos[1]);
    }
}

// レイヤーを表示するHTML要素の反映
function updateList() {
    $('.object-list').empty();
    for(i = 0; i < images.length; i++) {
        $(
            `<div class='layer'>
                <div class='name'>${images[i].name}</div>
                <div class='move-button'>
                    <div class='icon' id='layer-up'></div>
                    <div class='icon' id='layer-down'></div>
                </div>
             </div>`
        ).appendTo('.object-list');
        if(images[i].Locked) $(`.layer:nth-child(${i+1})`).addClass('locked');
    }
    $(`.layer:nth-child(${selectLayer+1})`).addClass('selected');
    console.log(selectLayer);
}


setInterval(draw, 100);
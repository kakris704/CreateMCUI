const canvas = $('canvas')[0];
const ctx = canvas.getContext('2d');
let images = [];
let selectLayer = -1;

class ImageObject {
    constructor(image, x, y) {
        this.pos = [x ?? 0, y ?? 0];
        this.image = image;
    }

    get Pos() {
        return this.pos;
    }

    set Pos(pos) {
        this.pos = pos
    }

    get Image() {
        return this.image;
    }

    move(x, y) {
        this.pos = [this.pos[0] + x, this.pos[1] + y];

        console.log(this.pos);
    }
}

$('#create-inventory').click(function() {
    console.log('happy');

    const defaultInventoryUI = new Image();
    defaultInventoryUI.src = 'cursor.png';
    defaultInventoryUI.onload = () => {
        images.push(new ImageObject(defaultInventoryUI, Number($('#X').val()), Number($('#Y').val())));
        updateList($('#X').val(), $('#Y').val());
        // console.log(images);
    }
});

$(document).on('click', '.layer', function() {
    $('.selected').removeClass('selected');

    selectLayer = $(this).index();
    $(this).addClass('selected');
    // images[selectLayer].Pos = [10, 10];
});

$(document).on('keypress', function(e) {
    console.log(e.key);
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

$('#file-uploader').change(function() {
    
});

// 画像を描画する
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < images.length; i++) {
        const pos = images[i].Pos;
        ctx.drawImage(images[i].Image, pos[0], pos[1]);
    }
}

function updateList(x, y) {
    $(`<p class='layer'>${x} ${y}</p>`).appendTo('.object-list');
}

function layerSelect() {

}


setInterval(draw, 100);
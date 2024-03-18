const canvas = $('canvas')[0];
const ctx = canvas.getContext('2d');
let images = [];

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
}

$('#create-inventory').click(function() {
    console.log('happy');

    const defaultInventoryUI = new Image();
    defaultInventoryUI.src = 'cursor.png';
    defaultInventoryUI.onload = () => {
        images.push(new ImageObject(defaultInventoryUI, $('#X').val(), $('#Y').val()));
        console.log(images);
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

setInterval(draw, 100);
const tflite = require('tflite-node');

async function predictClassification(model,imageBuffer){
    try {
        const tensor = tflite.node
        .decodeImage(imageBuffer, 224, 224, 3)
        .resizeNearestNeighbor([224, 224])
        .expandsDims(0)
        .toFloat();

        const output = model.predict(tensor);
        const score = output.dataSync();
        const confidence = Math.max(...score) * 100;
        
        const classes = ['Sehat','Stunting Stadium 1','Stunting Stadium 2'];
        const classResult = classes[score.indexOf(Math.max(...score))];
        return {confidence,classResult};

    }
}
let fs = require("fs"),
    JSONStream = require("JSONStream"),
    es = require("event-stream");
let config = require("./config.json");
let { ipFilePath, opFilePath, productsCount } = config;
let count = 0;
let outputData = [];

let getStream = function() {
    let jsonData = ipFilePath,
        stream = fs.createReadStream(jsonData, { encoding: "utf8" }),
        parser = JSONStream.parse("*");
    return stream.pipe(parser);
};

getStream()
    .pipe(
        es.mapSync(function(data) {
            count++;
            if (count > productsCount) {
                fs.writeFileSync(opFilePath, JSON.stringify(outputData, null, 4));
                process.exit();
            }
            outputData.push(data);
        })
    )

#!/usr/bin/env node

const fs = require('fs');
const zlib = require('zlib');
const glob = require('glob');

function compressFile(filename) {
    return new Promise((resolve, reject) => {
        const compress = zlib.createGzip();
        const input = fs.createReadStream(filename);
        const output = fs.createWriteStream(`${filename}.gz`);

        output.on('close', resolve);
        output.on('error', reject);

        input.pipe(compress).pipe(output);
    });
}

function fail(err) {
    console.error(err);

    process.exit(1);
}

glob('build/**/!(*.gz)', { nodir: true }, (err, files) => {
    if (err) {
        fail(err);
    }

    Promise.all(files.map((file) => compressFile(file)))
            .catch(fail);    
});
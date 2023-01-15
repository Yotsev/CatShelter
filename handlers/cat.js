const url = require('url');
const fs = require('fs');
const path = require('path');
const qs = require('querystring');
const formidable = require('formidable');
const breeds = require('../data/breeds.json');
const cats = require('../data/cats.json');

module.exports = (req, res) => {
    const pathname = url.parse(req.url).pathname;
    console.log(req.method);
    if (pathname === '/cats/add-cat' && req.method === 'GET') {
        const filePath = path.normalize(path.join(__dirname, '../views/addCat.html'));

        const catsInfo = fs.createReadStream(filePath);

        catsInfo.on('data', (data) => {
            let catBreedPlaceholder = breeds.map((breed) => `<option value="${breed}">${breed}</option>`);
            let modifiedData = data.toString().replace(`{{catBreeds}}`, catBreedPlaceholder)
            res.write(modifiedData);
        });

        catsInfo.on('end', () => {
            res.end();
        });

        catsInfo.on('error', (err) => {
            console.log(err);
        });
    } else if (pathname === '/cats/add-cat' && req.method === 'POST') {
        const form = new formidable.IncomingForm();

        form.parse(req, (err, fileds, files) => {
            if (err) {
                throw err;
            }

            let oldPath = files.upload.filepath;
            let newPath = path.normalize(path.join(__dirname, '../content/images/' + files.upload.originalFilename));

            fs.copyFile(oldPath, newPath, (err) => {
                if (err) {
                    throw err;
                }
                console.log(`File was successfuly uploaded`);
            });

            fs.readFile('./data/cats.json', 'utf-8', (err, data) => {
                if (err) {
                    throw err;
                }

                let allCats = JSON.parse(data);
                allCats.push({ id: cats.length + 1, ...fileds, image: files.upload.originalFilename });
                let json = JSON.stringify(allCats);

                fs.writeFile('./data/cats.json', json, () => {
                    res.writeHead(301, { 'Location': '/' });
                    res.end();
                });
            });
        });
    } else if (pathname === '/cats/add-breed' && req.method === 'GET') {
        const filePath = path.normalize(path.join(__dirname, '../views/addBreed.html'));

        const breedsinfo = fs.createReadStream(filePath);

        breedsinfo.on('data', (data) => {
            res.write(data);
        });

        breedsinfo.on('end', () => {
            res.end();
        });

        breedsinfo.on('error', (err) => {
            console.log(err);
        });

    } else if (pathname === '/cats/add-breed' && req.method === 'POST') {
        let formData = '';

        req.on('data', (data) => {
            formData += data;
        });

        req.on('end', () => {
            let body = qs.parse(formData);

            fs.readFile('./data/breeds.json', (err, data) => {
                if (err) {
                    throw err;
                }

                let breeds = JSON.parse(data);
                breeds.push(body.breed);
                let json = JSON.stringify(breeds);

                fs.writeFile('./data/breeds.json', json, 'utf-8', () => console.log('breed added'));
            });

            res.writeHead(301, { 'Location': '/' });
            res.end();
        });
    } else if (pathname.includes('/cats-edit') && req.method === 'GET') {
        const filePath = path.normalize(path.join(__dirname, '../views/editCat.html'));
        const pathname = url.parse(req.url).pathname;
        const catId = Number(pathname.split('/').slice(-1)[0]);
        const currentCat = cats.find((cat) => cat.id === catId);

        let editPgae = fs.createReadStream(filePath)

        editPgae.on('data', (data) => {
            let modifiedData = data.toString().replace('{{id}}', currentCat.id);
            modifiedData = modifiedData.replace('{{name}}', currentCat.name);
            modifiedData = modifiedData.replace('{{description}}', currentCat.description);

            const breedsOptions = breeds.map(b => `<option value="${b}">${b}</option>`);
            modifiedData = modifiedData.replace('{{catBreeds}}', breedsOptions.join('/'));

            modifiedData = modifiedData.replace('{{breed}}', currentCat.breed);
            console.log(currentCat.breed);
            console.log(modifiedData);
            res.write(modifiedData);
        })

        editPgae.on('end', () => {
            res.end();
        })

        editPgae.on('error', (err) => {
            console.log(err);
        })

    } else if (pathname.includes('/cats-edit') && req.method === 'POST') {
        //TODO:
    } else if (pathname.includes('/cats-find-new-home') && req.method === 'GET') {
        //TODO:
    } else if (pathname.includes('/cata-find-new-home') && req.method === 'POST') {
        //TODO:
    } else {
        return true;
    }
};
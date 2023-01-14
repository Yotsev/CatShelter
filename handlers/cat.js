const url = require('url');
const fs = require('fs');
const path = require('path');
const qs = require('querystring');
//const formidable = require('formidable');
//const breeds = require('../data/breeds.json');
const cats = require('../data/cats.json');

module.exports = (req, res) => {
    const pathname = url.parse(req.url).pathname;
    console.log(req.method);
    if (pathname === '/cats/add-cat' && req.method === 'GET') {
        const filePath = path.normalize(path.join(__dirname, '../views/addCat.html'));

        const catsInfo = fs.createReadStream(filePath);

        catsInfo.on('data', (data) => {
            res.write(data);
        });

        catsInfo.on('end', () => {
            res.end();
        });

        catsInfo.on('error', (err) => {
            console.log(err);
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

    } else if (pathname === '/cats/add-cat' && req.method === 'POST') {
        //TODO:
    } else if (pathname === '/cats/add-breed' && req.method === 'POST') {
        let formData = '';

        req.on('data', (data)  => {
            formData+=data;
        });

        req.on('end', () => {
            let body = qs.parse(formData);

            fs.readFile('./data/breeds.json', (err, data)=>{
                if (err) {
                    throw err;
                }
    
                let breeds = JSON.parse(data);
                breeds.push(body.breed);
                let json = JSON.stringify(breeds);
    
               fs.writeFile('./data/breeds.json', json, 'utf-8', ()=> console.log('breed added'));
            });
    
            res.writeHead(301, {'Location': '/'});
            res.end();
        });
    }

    else {
        return true;
    }
};
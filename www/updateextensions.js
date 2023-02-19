/*globals require*/
/**
 * @author pmeijer / https://github.com/pmeijer
 *
 * Inspired by:
 * https://github.com/gruntjs/gruntjs.com
 */
var http = require('http'),
    https = require('https'),
    fs = require('fs'),
    path = require('path'),
    NPM_SEARCH_URL = 'npmsearch.com',
    NPM_URL = 'skimdb.npmjs.com',
    exludeList = [
        'webgme'
    ];

const NPM_HOST = 'registry.npmjs.com';

function queryNpmRegistry(callback) {
    var options = {
            host: NPM_HOST,
            port: 443,
            path: '/-/v1/search?text=keywords%3Awebgme&size=250',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        },
        req;

    req = https.request(options, function (res) {
        var output = '';
        res.setEncoding('utf8');

        res.on('data', function (chunk) {
            output += chunk;
        });

        res.on('end', function() {
            var obj = JSON.parse(output);
            callback(null, {statusCode: res.statusCode, modules: obj.objects});
        });
    });

    req.on('error', callback);

    req.end();
}

function getAuthor(data) {
    var author = 'unknown';
    if (data.author && data.author.name) {
        author = data.author.name;
    } else if (data.maintainers && data.maintainers.length > 0) {
        author = data.maintainers[0].username;
    }

    return author;
}

queryNpmRegistry(function (err, result) {
    var filePath = path.join(__dirname, 'static', 'extensions.json');
    if (err) {
        console.error(err);
        process.exit(1);
    } else if (result.statusCode !== 200) {
        process.exit(result.statusCode);
    } else {
        // console.log(result.modules);

        const data = result.modules.map(({package}) => ({
            name: package.name,
            description: package.description,
            version: package.version,
            modified: package.date,
            keywords: package.keywords,
            author: getAuthor(package)
        }));

        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    }
});

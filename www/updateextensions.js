/*globals require*/
/**
 * @author pmeijer / https://github.com/pmeijer
 */
var http = require('http'),
    fs = require('fs'),
    path = require('path'),
    HOST_URL = 'npmsearch.com',
    exludeList = [
        'webgme',
        ''
    ];


// https://github.com/nodesource/npmsearch#available-fields
function queryNpm(outFields, callback) {
    var options = {
            host: HOST_URL,
            port: 80,
            path: '/query?q=keywords:webgme&fields=' + outFields.join(','),
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
    },
        req;

    req = http.request(options, function (res) {
        var output = '';
        res.setEncoding('utf8');

        res.on('data', function (chunk) {
            output += chunk;
        });

        res.on('end', function() {
            var obj = JSON.parse(output);
            callback(null, {statusCode: res.statusCode, data: obj});
        });
    });

    req.on('error', callback);

    req.end();
}

function sortData(data) {
    var raw = data.results,
        result = [],
        i;

    function getEntry(rawEntry) {
        var category = 'N/A';
        if (rawEntry.keywords.indexOf('webgme-domain') > -1) {
            category = 'domain';
        } else if (rawEntry.keywords.indexOf('webgme-kuk') > -1) {
            category = 'kuk';
        }

        return {
            name: rawEntry.name[0],
            description: rawEntry.description[0],
            modified: rawEntry.modified[0],
            //keywords: rawEntry.keywords.join(' '),
            version: rawEntry.version[0],
            author: rawEntry.author[0],
            keywords: rawEntry.keywords,
            category: category
        };
    }

    for (i = 0; i < raw.length; i += 1) {
        result.push(getEntry(raw[i]));
    }

    return result;
}

queryNpm(['name', 'description', 'modified', 'keywords', 'version', 'author'], function (err, result) {
    if (err) {
        console.error(err);
        process.exit(1);
    } else if (result.statusCode !== 200) {
        process.exit(result.statusCode);
    } else {
        fs.writeFileSync(path.join(__dirname, 'static', 'extensions.json'),
            JSON.stringify(sortData(result.data), null, 2));
    }
});
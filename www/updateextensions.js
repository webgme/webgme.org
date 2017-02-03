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
        result = {
            components: [],
            domains: [],
            unclassified: []
        },
        i;

    function getEntry(rawEntry) {
        return {
            name: rawEntry.name[0],
            description: rawEntry.description[0],
            modified: rawEntry.modified[0],
            keywords: rawEntry.keywords,
            version: rawEntry.version[0],
            author: rawEntry.author[0]
        };
    }

    for (i = 0; i < raw.length; i += 1) {
        if (raw[i].keywords.indexOf('webgme-domain') > -1) {
            result.domains.push(getEntry(raw[i]));
        } else if (raw[i].keywords.indexOf('meta-agnostic') > -1 || raw[i].keywords.indexOf('meta-agnostic') > -1) {
            result.domains.push(getEntry(raw[i]));
        } else {
            result.unclassified.push(getEntry(raw[i]));
        }
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
        fs.writeFileSync(path.join(__dirname, 'extensions.json'), JSON.stringify(sortData(result.data)));
    }
});
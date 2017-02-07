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

//http://npmsearch.com
function queryNpmSearch(outFields, callback) {
    // https://github.com/nodesource/npmsearch#available-fields
    var options = {
            host: NPM_SEARCH_URL,
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

function sortSearchData(data) {
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

//https://skimdb.npmjs.com
function queryNpmRegistry(module, callback) {
    var options = {
            host: NPM_URL,
            port: 443,
            path: '/registry/' + (module ?
                module : '_design/app/_view/byKeyword?startkey=[%22webgme%22]&endkey=[%22webgme%22,{}]&group_level=3'),
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        },
        req;
console.log(options.path);
    req = https.request(options, function (res) {
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

function getFullRegistryData(rawData, callback) {
    /* Example:
     * {
     * "rows": [
     *   {
     *    "key": [
     *       "webgme",
     *       "json-to-webgme",
     *       "Allows creation of webgme objects as a subtree of a project from an exported json of another project with the same meta."
     *    ],
     *     "value": 1
     *    },
     *    ...
     */

    var moduleNames = rawData.rows.map(function (entry) {
        return entry.key[1];
    }),
        result = [],
        cnt = moduleNames.length,
        error;

    function getLightEntry(data) {
        // https://skimdb.npmjs.com/registry/webgme-finite-state-machine for example data..
        function getAuthor(data) {
            var author = 'unknown';
            if (data.author && data.author.name) {
                author = data.author.name;
            } else if (data.maintainers && data.maintainers.length > 0) {
                author = data.maintainers[0].name;
            }

            return author;
        }
        return {
            name: data.name,
            description: data.description,
            version: data['dist-tags'].latest,
            modified: data.time.modified,
            keywords: data.keywords,
            author: getAuthor(data)
        };
    }

    function addModule(err, res) {
        cnt -= 1;
        if (err) {
            error = err;
        } else if (res.statusCode !== 200) {
            error = new Error('Non 200 status code ' + res.statusCode);
        } else {
            result.push(getLightEntry(res.data));
        }

        if (cnt === 0) {
            callback(error, result);
        }
    }

    moduleNames.forEach(function (module) {
        if (exludeList.indexOf(module) > -1) {
            cnt -= 1;
            if (cnt === 0) {
                callback(error, result);
            }
        } else {
            queryNpmRegistry(module, addModule);
        }
    });

    if (cnt === 0) {
        callback(error, result);
    }
}

// Currently it seems better to query the npm registry directly (npmsearch barely updates its indices).
// queryNpmSearch(['name', 'description', 'modified', 'keywords', 'version', 'author'], function (err, result) {
//     if (err) {
//         console.error(err);
//         process.exit(1);
//     } else if (result.statusCode !== 200) {
//         process.exit(result.statusCode);
//     } else {
//         fs.writeFileSync(path.join(__dirname, 'static', 'extensions.json'),
//             JSON.stringify(sortSearchData(result.data), null, 2));
//     }
// });

queryNpmRegistry(null, function (err, result) {
    var filePath = path.join(__dirname, 'static', 'extensions.json');
    if (err) {
        console.error(err);
        process.exit(1);
    } else if (result.statusCode !== 200) {
        process.exit(result.statusCode);
    } else {
        getFullRegistryData(result.data, function (err, data) {
            if (err) {
                console.error(err);
                process.exit(1);
            } else {
                fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
                console.log('Wrote file to', filePath);
            }
        });
    }
});
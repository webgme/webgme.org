WebGME single-page website
=========================

### Updating extensions.json
```
node ./updateextensions.js
```

Will query the npmjs registry for node-modules containing the keyword `webgme`, see [webgme-wiki](https://github.com/webgme/webgme/wiki/Publish-Extensions) for details about categories.

Edit crontab to run update every 20min

```
crontab -e
```

```
*/20 * * * * /usr/bin/node /home/ubuntu/webgme.org/www/updateextensions.js
```


### Running node server

Before running `node source/server.js` install all dependencies:
```
npm install
```
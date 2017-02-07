WebGME single-page website
=========================

### Updating extensions.json
```
node ./updateextensions.js
```

Will query the npmjs registry for node-modules containing the keyword `webgme`, see [webgme-wiki](https://github.com/webgme/webgme/wiki/Publish-Extensions) for details about categories.



### Running node server

Before running `node source/server.js` install all dependencies:
```
npm install
```
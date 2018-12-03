See /aws/README.md for more aws specific directions.

### To launch the editor from docker

Create an empty directory to share with the containers (e.g. ~/dockershare)
```mkdir ~/dockershare```

Create/obtain ssl certs (`privkey.pem` and `fullchain.pem`) and put them inside
```mkdir ~/dockershare/ssl_certs```

Inside `./editor` start using docker-compose (if not running at (dev.)webgme.org modify the nginx.conf appropriately.
```docker-compose up -d```

#### Notes
The above will pull the image tagged `2.16.0` check [docker-hub/webgme](https://hub.docker.com/r/webgme/compact/tags/) for latest tag.
The tags follow the [releases of webgme](https://github.com/webgme/webgme/releases).

The env variable `GME_ADMIN` will create a siteAdmin `admin` with password `admin` if it does not exist. 
After the first launch - go to `localhost:8888/profile/login` and change password once logged in.

To overwrite configuration parameters, stop the webgme container and create a file `~/dockershare/extraconfigs.js`, see aws/extraconfigs.js for the structure.
After restart the config parameters will be picked up by the webgme app.

Typically webgme should run behind a secure proxy, see aws/nginx.conf for an example of a config for nginx.

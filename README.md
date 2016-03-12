__TODO: UPDATE THIS README__

# Deployment configurations and scripts for WebGME

This repository contains various configuration, script and data files
to deploy and run WebGME servers.

# Authentication

The authentication scheme for Json Web Token uses OpenSSL RSA256 keys. The config for the editor is set up to find a public and private key at `private_key` and `public_key` inside a folder named `token_keys` next to the webgme.org repository.
#!/usr/bin/env bash
#to add all dependencies from package.json file
rm -rf node_modules

npm install

#in case there is problem while installing bcrypt and mongoose
#npm install node-gyp -g && npm cache clean --force && rm -rf node_modules && npm install
#npm install bcrypt
#npm install mongoose

#npm rebuild
#to add anyother module <module_name> e.g. restify; replace <module_name> with restify
#npm install -g <module_name> --save



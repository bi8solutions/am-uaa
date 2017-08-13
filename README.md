# am-uaa
Angular Material User Authentication and Authorization

Seed project from https://github.com/filipesilva/angular-quickstart-lib and 
https://github.com/anjmao/ang-select

## Accessing the DEV server from outside client

#### In package.json
"serve-demo": "webpack-dev-server --https --inline --progress --port 8000 --host 192.168.88.42"

#### In webpack.config.js
publicPath: isProd ? '/' : 'https://192.168.88.42:8000/',
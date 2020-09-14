
import express from "express";
import bodyParser from "body-parser";
import settings from './config/settings';
import connectToMongoDb from './config/database.config';
import apiRouters from './router';
import http from 'http';

const port = settings.port;

const app = express();

const server = http.createServer(app)

connectToMongoDb();

app.use(bodyParser.json({
    extended: true,
    limit: '500mb'
}));
app.use(bodyParser.urlencoded({
    extended: true,
    limit: '500mb'
}));


app.use(function (req, res, next) {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  
    res.setHeader('Access-Control-Allow-Headers', 'Authorization,Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization');

    next();
  });
apiRouters.forEach(function (apiRoute) {
    app.use('/', apiRoute);
});

server.listen(port, () => {
    console.log(`Server started on port : ${port}`);
});
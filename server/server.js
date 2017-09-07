import Express from 'express';
import compression from 'compression';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import passport from 'passport';
import path from 'path';
// import IntlWrapper from '../client/modules/Intl/IntlWrapper';

// Webpack Requirements
import webpack from 'webpack';
import webpackConfig from '../webpack.config.dev';
import webpackDevMiddleware from 'webpack-dev-middleware';
// import webpackHotMiddleware from 'webpack-hot-middleware';

// Initialize the Express App
const app = new Express();

// React And Redux Setup
import { Provider } from 'react-redux';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router';
import ClientComponent from '../client/App';

// Run Webpack dev server in development mode
if (process.env.NODE_ENV === 'development') {
  const compiler = webpack(webpackConfig);
  app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: webpackConfig.output.publicPath }));
  // app.use(webpackHotMiddleware(compiler));
}

import http from 'http'
const config = require('./config/index.json'); //config DB will be delete soon
import serverConfig from './config'; //config port and DB
// connect to the database and load models
require('./models').connect(config.dbUri);


const renderFullPage = (component) => {
  return `
    <!Doctype>
    <html>
      <head>
        <link rel="stylesheet" href="../client/container/header/index.css">
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/css/bootstrap.min.css" integrity="sha384-/Y6pD6FV/Vv2HJnA6t+vslU6fwYXjCFtcEpHbNJ0lyAFsXTsjBbfaDjzALeQsN6M" crossorigin="anonymous">
        <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.11.0/umd/popper.min.js" integrity="sha384-b/U6ypiBEHpOf/4+1nzFpr53nxSS+GLCkfwBdFNTxtclqqenISfwAzpKaMNFNmj4" crossorigin="anonymous"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/js/bootstrap.min.js" integrity="sha384-h0AbiXch4ZDo7tp9hKZ4TsHbi047NrKGLO3SEJAg45jXxnGIfYzk4Si90RDIqNm1" crossorigin="anonymous"></script>
      </head>
      <div id="root">
        ${component}
      <div>
    </html>
  `;
};

// tell the app to parse HTTP body messages
app.use(bodyParser.urlencoded({ extended: false }));

// pass the passport middleware
app.use(passport.initialize());

// load passport strategies
const localSignupStrategy = require('./passport/local-signup');
const localLoginStrategy = require('./passport/local-login');
passport.use('local-signup', localSignupStrategy);
passport.use('local-login', localLoginStrategy);

// pass the authenticaion checker middleware
const authCheckMiddleware = require('./middleware/auth-check');
app.use('/api', authCheckMiddleware);

// routes
const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

app.use((req, res, next) => {
    const context = {}
    const initialView = ReactDOMServer.renderToString(
      <StaticRouter
        location={req.url}
        context={context}
      >
        <ClientComponent/>
      </StaticRouter>
    )

    if (context.url) {
      res.writeHead(301, {
        Location: context.url
      })
      res.end()
    } else {
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end(renderFullPage(initialView));
    }
});

// start app
app.listen(serverConfig.port, (error) => {
  if (!error) {
    console.log(`MERN is running on port: http://localhost:${serverConfig.port}! Build something amazing!`); // eslint-disable-line
  }
});

export default app;

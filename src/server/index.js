'use strict';
const path      = require('path'),
  express       = require('express'),
  bodyParser    = require('body-parser'),
  axios         = require('axios'),
  http          = require('http'),
  memoize       = require('memoizee'),
  cookieParser  = require('cookie-parser'),
  logger        = require('morgan'),
  log           = require('loglevel'),
  fs            = require('fs');

const PORT = process.env.PORT || 8000;
const NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : 'dev';
const SERVER_ADDRESS = process.env.EDITOR_ADDRESS;
/**********************************************************************************************************/

// Setup our Express pipeline
let app = express();
// parse cookies
app.use(cookieParser());
// Setup pipeline logging
if (NODE_ENV !== 'test') app.use(logger('dev'));
// Setup pipeline support for static pages
app.use(express.static(path.join(__dirname, '../../public')));
// Setup pipeline support for server-side templates
app.engine('pug', require('pug').__express);
app.set('views', path.join(__dirname, 'views'));
app.locals.pretty = true;
app.locals.env = process.env;

// Finish pipeline setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**********************************************************************************************************/


let getPublicProjects = memoize(() => {
  log.debug('Calling server for public projects');
  return axios({
    method: 'GET',
    url: SERVER_ADDRESS +'/api/Projects/PROJECTS'
  });
},{promise: true, maxAge: 86400  });

let getExamples = memoize(() => {
  log.debug('Calling server for example projects');
  return axios({
      url: SERVER_ADDRESS + '/api/Examples/EXAMPLES?metadata=true',
      method: 'get'
  });
}, {promise: true, maxAge: 86400 });

app.get('/', (req, res) => {
    // get the exmaples and public projects data
    // get examples data
    let examplesPromise = getExamples();
    // get projects data
    let publicProjectsPromise = getPublicProjects();
    // end of calls to get the data


    axios.all([examplesPromise,publicProjectsPromise]).then(axios.spread((examples,projects)=>{
        log.debug('Data received from server',projects.data.length)
    // this is cached by default by express if node env is set to production
        examples.data = examples.data.filter(eg => !['Weather','Star Map','Battleship','Earthquakes'].includes(eg.projectName));
        res.render('index.pug', {examples: examples.data, projects: projects.data });
    })).catch((err)=>{
    //handle errors
        log.debug('Failed to get projects data from netsblox server.',err);
        res.status(500).send();
    });

});

app.get('/tutorials*', (req,res) => {
  res.render('tutorials.pug',{});
});

app.get('*', (req,res)=>{
  res.status(404).send('Page not found. Go back to <a href="/">Home Page</a>. If you believe there is a mistake, please let us know at <a href="https://facebook.com/netsblox"> our facebook page</a>.');
});

/**********************************************************************************************************/

// Run the server itself


let httpServer = http.Server(app).listen(PORT, () => {
  log.info('listening on unsecure port: ' + PORT);
});

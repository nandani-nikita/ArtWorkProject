require('./DBs/connections');

const express= require("express");
const dotenv =require("dotenv");
dotenv.config({path:'./.env'});
const bodyParser = require("body-parser");
const cors = require('cors');
const port = process.env.PORT;

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



const routers = require('./Routers/routes');
const userRouter = require('./Routers/userRoutes');
const artWorkRouter = require('./Routers/artWorkRoutes');
const commentRouter = require('./Routers/commentRoutes');

app.use('/', routers);
app.use('/user', userRouter);
app.use('/art', artWorkRouter);
app.use('/react', commentRouter);

app.listen(port, () => {
  console.log(`Art-work app listening on port ${port}`);
});



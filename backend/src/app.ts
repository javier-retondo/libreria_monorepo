import express, {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from 'express';
import morgan from 'morgan';
import cors from 'cors';
import sequelize from './database';
import { error } from './utils/network/responses';
import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({
  path: join(__dirname, '..', '.env'),
});

const staticFolderPath = join(__dirname, '..', 'public');

export class Server {
  public app: express.Application;
  public port: number = Number(process.env.PORT) || 3000;
  public apiBaseUrlV1 = process.env.API_BASE_URL_V1 || '/api/v1';

  constructor() {
    this.app = express();
    this.config();
    this.routes();
  }

  config() {
    this.app.use(morgan('dev'));
    this.app.use(cors());
    this.app.set('view engine', 'ejs');
    this.app.set('views', join('templates'));
    this.app.use(express.json({ limit: '1mb' }));
    this.app.use(express.urlencoded({ extended: false }));
  }
  routes() {
    this.app.use('/static', express.static(staticFolderPath));
    this.app.use(
      (
        err: ErrorRequestHandler,
        req: Request,
        res: Response,
        next: NextFunction,
      ) => error({ req, res, body: err.toString(), status: 500, next }),
    );
  }

  /*
  routers_v1(): express.Router[] {
    return Routes;
  }
*/

  handleConn = async () => {
    console.log('Connecting to the database...');
    try {
      await sequelize.authenticate();
      console.log('Connected to the database: ', sequelize.getDatabaseName());
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  };

  start() {
    this.app.listen(this.port, () => {
      console.log('Environment: ', process.env.NODE_ENV);
      console.log('Server connected in port: ', this.port);
    });
  }
}

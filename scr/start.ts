import * as chalk from 'chalk';
import { server } from './server';

const cors = {
  credentials: true,
  origin:
    process.env.NODE_ENV === 'development' ? '*' : process.env.CLIENT_PORT,
};

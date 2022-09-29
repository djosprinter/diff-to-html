import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import * as Diff2Html from 'diff2html';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());  

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.post('/parse', (req: Request, res: Response) => {
  const diffJson = Diff2Html.parse(req.body.diff);
  const diffHtml = Diff2Html.html(diffJson, { drawFileList: true });
  res.send(diffHtml);
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
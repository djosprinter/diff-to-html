import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import * as Diff2Html from 'diff2html';
import { renderHtml } from './html-export';
import { parseDiffCollection } from './diff-git-impl';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.post('/parse', (req: Request, res: Response) => {
  try {
    const collection = parseDiffCollection(req.body.diff)
    res.send(renderHtml(collection))
  } catch (error) {
    // res.send(renderException(error))
    console.log(error)
  }
  // const diffJson = Diff2Html.parse(req.body.diff);
  // const diffHtml = Diff2Html.html(diffJson, { drawFileList: true });
  // res.send(diffHtml);
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
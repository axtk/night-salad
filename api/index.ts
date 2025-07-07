import {Readable} from 'node:stream';
import express, {type ErrorRequestHandler} from 'express';

const hosts = new Set([
    undefined,
    'axtk.me',
    'axtk.github.io',
]);

let app = express();

app.get('/', async (req, res) => {
    let {u} = req.query;

    if (typeof u !== 'string') {
        res.status(200).send('OK');
        return;
    }

    let refererHost = req.headers.referer?.match(/^(https?:)?\/\/([^\/]+)/)?.[2];

    if (!hosts.has(refererHost)) {
        res.status(200).send('OK');
        return;
    }

    try {
        let url = new URL(u);
        let contentType = (req.query.contentType as string | undefined) ??
            url.searchParams.get('content_type');

        if (contentType)
            res.set('Content-Type', contentType);

        let {body, status, statusText} = await fetch(url);

        if (status >= 400) {
            res.status(status).send(statusText || 'Error');
            return;
        }

        if (!body) {
            res.status(404).send('None');
            return;
        }

        // @ts-ignore
        Readable.fromWeb(body).pipe(res);
    }
    catch {
        res.status(200).send('OK');
    }
});

app.listen(3000, () => {
    console.log('Ready');
});

let handleErrors: ErrorRequestHandler = (_err, _req, res) => {
    res.status(200).send('OK');
};

app.use(handleErrors);

export default app;

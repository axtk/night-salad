import express from 'express';

export const app = express();

app.get('/', (_req, res) => {
    res.json({
        ok: true,
    });
});

app.listen(3000, () => {
    console.log('Ready');
});

import express from 'express';

const app = express();

app.use(express.json());
app.get('/', (req, res) => res.send('API OK'));

app.listen(3001, () => console.log('Server running on port 3001'));

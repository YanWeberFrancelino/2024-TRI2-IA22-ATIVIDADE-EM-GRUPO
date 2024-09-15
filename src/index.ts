import express from 'express';
import userRoutes from './routes/user.routes';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 4040;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

app.use('/api', userRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada.' });
});

app.listen(port, () => console.log(`⚡ Servidor rodando na porta ${port}`));

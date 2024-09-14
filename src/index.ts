import express, { RequestHandler } from 'express'
import * as userServices from './services/user.services'
import { randomUUID } from 'crypto'

const port = 3000
const app = express()

app.use(express.json())
app.use(express.static(__dirname + '/../public'))

type User = { 
  name: string,
  email: string,
  password: string,
  token: string
}

const logged: {
  [token: string]: User
} = {};

const isAlreadyLogged = (name: string) => {
  for (const token in logged)
    if (logged[token].name === name)
      return token;
  return false;
};

const middlewareLogged: RequestHandler = (req, res, next) => {
  const token = req.params.token
  if (!token)
    return res.status(404).json({ error: "Token não informado" })
  if (!logged[token])
    return res.status(401).json({ error: "Token inválido" })
  next()
}

//login
app.post('/user', async (req, res) => {
  const { name, password } = req.body;
  const tokenAlread = isAlreadyLogged(name);
  if (tokenAlread) {
    return res.status(401).json({
      error: "Usuário já está logado", 
      token: tokenAlread
    });
  }
  const user = await userServices.findUserByLoginPassword(name, password);
  if (!user)
    return res.status(401).json({ error: "Usuário ou senha inválidos" });
  const token = randomUUID();
  logged[token] = { ...user, token };
  return res.json({ token });
});

//cadastro
app.post('/users', async (req, res) => {
  const { name, email, password } = req.body;
  const response = await userServices.signinUser(name, email, password);
  if (!response){
    return res.status(409).json({ error: "Email already exists" });
  } else {
    return res.json({response})
  }
})

//validator de token
app.get("/token/:token", (req, res) => {
  const token = req.params.token
  if (!token)
    return res.status(401).json({ error: "Token não informado" })
  if (!logged[token])
    return res.status(401).json({ error: "Token inválido" })
  return res.json({ ...logged[token], password: undefined })
})

//deletar token
app.delete("/users/:token", (req, res) => {
  const token = req.params.token;
  if (!token) {
    return res.status(401).json({ error: "Token não informado" });
  }
  if (!logged[token]) {
    return res.status(401).json({ error: "Token inválido" });
  }
  delete logged[token];
  return res.status(204).send();
});

//atualizar info do user
app.put('/users/:token', middlewareLogged, async (req, res) => {
  const { name, email, password } = req.body;
  const token = req.params.token
  if (!token)
    return res.status(401).json({ error: "Token não informado" })
  if (!logged[token])
    return res.status(401).json({ error: "Token inválido" })
  const user = await userServices.updateUser(name, email, password);
  res.json(user);
});

app.get("/users/:token", middlewareLogged, async (req, res) => {
  const users = await userServices.getAllUsers()
  return res.json(users)
})

app.get("/user/logged/:token", middlewareLogged, (req, res) => {
  const token = req.params.token;
  const user = logged[token];
  
  if (!user) {
    return res.status(401).json({ error: "Usuário não encontrado" });
  }
  
  return res.json({ name: user.name, email: user.email });
});

app.listen(port, () => console.log(`⚡ Server is running on port ${port}`));

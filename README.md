# Autenticação de Usuários (Single Server)

## Visão Geral

O projeto **Autenticação de Usuários (Single Server)** é uma aplicação web desenvolvida pela turma **IA22** do curso de Informática, composta pelos alunos **Yan Weber Francelino**, **Nícolas Ferreira dos Santos**, **Ronald Wislley do Nascimento Santos**, **Marcos Domainski Junior** e **Eduardo Minosso de Oliveira**, sob orientação do professor **Daniel de Andrade Varela**.

Este sistema implementa um processo de autenticação e gerenciamento de usuários utilizando **JWT (JSON Web Tokens)**. Além disso, oferece funcionalidades de CRUD (Criar, Ler, Atualizar e Deletar) para gerenciamento das informações dos usuários.

Ideal para aplicações que requerem controle de acesso e gerenciamento de dados de usuários em um ambiente de servidor único.

## Características

- **Autenticação com JWT:** Geração e validação de tokens para autenticar usuários de forma segura.
- **Autorização:** Controle de acesso baseado em privilégios de usuário.
- **CRUD de Usuários:** Permite criar, visualizar, atualizar e deletar informações de usuários.
- **Validação de Dados:** Verificação de formatos e limites de caracteres para campos como nome, email e senha.
- **Interface Responsiva:** Dashboard intuitivo e adaptável para melhor experiência do usuário.
- **Segurança:** Proteção contra acessos não autorizados e gerenciamento seguro de senhas.

## Tecnologias Utilizadas

### Front-end

- **HTML5**
- **CSS3**
- **JavaScript (ES6)**
- **Fetch API** para comunicação com o backend

### Back-end

- **Node.js**
- **Express.js**
- **TypeScript**
- **JWT (JSON Web Tokens)**
- **SQLite** para banco de dados
- **dotenv** para gerenciamento de variáveis de ambiente

## Estrutura do Projeto

```
autenticacao-usuarios/
├── public/
│   ├── css/
│   │   └── main.css
│   ├── js/
│   │   └── main.js
│   ├── index.html
│   ├── cadastro.html
│   └── dashboard.html
├── src/
│   ├── controllers/
│   │   └── user.controller.ts
│   ├── middleware/
│   │   └── auth.midleware.ts
│   ├── models/
│   │   └── user.model.ts
│   ├── routes/
│   │   └── user.routes.ts
│   ├── services/
│   │   └── user.services.ts
│   ├── utils/
│   │   ├── encryption.ts
│   │   └── validation.ts
│   ├── database.ts   
│   └── index.ts
├── package.json
├── tsconfig.json
└── README.md
```

## Validação e Segurança

### Autenticação vs Autorização

1. **Autenticação** é o processo de **validar a identidade** do usuário, garantindo que apenas pessoas autorizadas possam acessar o sistema.
2. **Autorização** ocorre após a autenticação e envolve **conceder ou negar acesso** a recursos específicos com base nos privilégios do usuário.

### Autenticação com Token (JWT)

- **Funcionamento:**
  - Após o login, o sistema gera um token JWT que serve como comprovante de autenticação.
  - Esse token é enviado pelo cliente em cada requisição subsequente para validar a ação.

- **Estrutura do JWT:**
  - **Header:** Especifica o tipo de token e o algoritmo usado para assinar.
  - **Payload:** Contém informações do usuário e outros dados relevantes.
  - **Signature:** Assegura a integridade do token, garantindo que ele não foi alterado.

- **Benefícios:**
  - Reduz a necessidade de enviar credenciais a cada requisição.
  - Tokens são compactos e podem ser enviados facilmente em cabeçalhos HTTP.



## Equipe

Este projeto foi desenvolvido pela turma **IA22**, composta pelos seguintes alunos:

- **Yan Weber Francelino**
- **Nícolas Ferreira dos Santos**
- **Ronald Wislley do Nascimento Santos**
- **Marcos Domainski Junior**
- **Eduardo Minosso de Oliveira**

Sob a orientação do professor:

- **Daniel de Andrade Varela**

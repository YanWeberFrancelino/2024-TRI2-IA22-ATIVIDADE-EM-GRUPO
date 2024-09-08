# Autenticação de Usuários (single server)
É um processo que certifica que apenas pessoas autorizadas tenham acesso ao sistema. O mesmo verifica a identidade do usuário antes de conceder acesso a recursos e informações. Em um ambiente de servidor único, todas as requisições são centralizadas em um único servidor

## Autenticação VS Autorização
1. **Autenticação** é um *processo de validação* da _identidade de um usuário_, dispositivo ou sistema. O objetivo é confirmar se a entidade que tenta acessar o recurso é quem ou o que afirma ser;
2. **Autorização** é o que vem após a conclusão do processo de *AUTENTICAÇÃO*, e envolve conceder ou negar acesso a um recurso com base nos privilégios definidos para o usuário autenticado, delimitando ações dentro da aplicação ou sistema;
   
## Autenticação com Token (JWT)
Esse tipo de autenticação funciona assim: após um usuário fazer login com suas credenciais, o sistema gera um token JWT que serve como um "comprovante" da autenticação do usuário e contém informações sobre o mesmo. Toda vez que ele faz uma requisição, ele envia esse token para validar a ação

O JWT é estruturado em:
- **Header**: parte que especifica o *tipo* de token e o *algoritmo* usado para assinar o token;
- **Payload**: informações do usuário e outros dados;
- **Signature**: é a credencial do token, semelhante a uma assinatura normal, que, em tese, é única;

**OBS**: a beleza do token JWT é que o usuário não precisa enviar suas credenciais a cada ação (pois o token é o que vai ser enviado)

const express = require('express'); /* importando o express */
const { uuid } = require('uuidv4'); /* util para criar id's */

const app = express(); /* Aplicação criada */

app.use(express.json()); /* Necessário para lermos os JSON vindos no request */

/* Utilizaremos essa variável para simular nosso banco de dados */
const bd_projects = [];



/* Definindo a rota para retornar os nossos projetos(fakes) com o método GET */
app.get('/projects', (request, response) => {
  /* Pegando os parâmetros passados por query/filtros do cliente */
  const { title } = request.query;

  /* Verificando se o filtro foi preenchido pelo usuário com condição ternária */
  const results = title
    ? bd_projects.filter(project => project.title.includes(title))
    : bd_projects /* se title existir no banco, então retorna o resultado */
  

  return response.json(results); /* Reposta para o cliente com origem no banco de dados */
});

/* Simulando criação de projetos com o método post */
app.post('/projects', (request, response) => {
  /* Pegando informações do body que vem do cliente em formato JSON */
  const { title, owner } = request.body;

  const project = { id:uuid(), title, owner };/* Adiciona um ID único a cada linha do array no nosso banco de dados ficticio */

  bd_projects.push(project); /* Inserindo os dados do projeto/response em nosso array que está simulando o banco de dados */

  return response.json(project); /* Retornando a resposta para o usuário, nunca retorne a lista completa, de projetos nesse caso, mas retorne apenas aquele dado que ele inseriu */
});

/* Alterando/Atualizando informações fakes de projetos com o método PUT*/
app.put('/projects/:id', (request, response) => {
  /* Pegando os parâmetros passados pelo usuário, neste caso o id */
  const {id} = request.params;
  /* Pegando o body para montar o novo array e substituir/alterar no original */
  const { title, owner } = request.body;

  /* Percorrendo o array e resgatando a posição do projeto com o id passado no parâmetro */
  const projectIndex = bd_projects.findIndex(project => project.id == id);

  /* Verifica se encontrou o indice, caso tenha encontrado ele não encontre, retorna uma mensagem de erro e altera o status, retornando código 400*/
  if (projectIndex < 0){
    return response.status(400).json({ error: 'Project not found.' });
  }

  /* Montando o novo projeto atualizado */
  const project = {
    id,
    title,
    owner,
  };

  /* Substituindo o projeto anterior passado pelo id, através da posição dele no array */
  bd_projects[projectIndex] = project;

  /* Retorno com o projeto que foi alterado */
  return response.json(project);

});

/* Deletando informações fakes de projetos com o método DELETE*/
app.delete('/projects/:id', (request, response) => {
  const {id} = request.params;
   
  const projectIndex = bd_projects.findIndex(project => project.id == id);
  
  if (projectIndex < 0){
    return response.status(400).json({ error: 'Project not found' });
  }

  bd_projects.splice(projectIndex,1);

  return response.status(204).send();
});

/* Definindo a porta onde o node/backend será executada, e retornando uma resposta toda vez que for executado */
app.listen(3333, () => {
  console.log('🥺 Back-end started!')
}); 


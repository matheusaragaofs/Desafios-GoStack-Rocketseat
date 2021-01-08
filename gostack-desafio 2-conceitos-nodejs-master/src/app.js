const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.post("/repositories", ( request, response ) => {
  const { title, url ,techs } = request.body
  const repository =  {
    id: uuid(),
    title,
    url,
    techs,
    likes:0

  }
    repositories.push(repository)
    return response.json(repository)
    

 
});

app.put("/repositories/:id", (request, response) => {
   const {  id  } = request.params 
   const { title , url, techs} = request.body
   const repoIndex = repositories.findIndex(repo => repo.id == id)

     if (repoIndex <0){
      return response.sendStatus(400)
     }
     

     repositories[repoIndex].title = title
     repositories[repoIndex].url = url
     repositories[repoIndex].techs= techs
     

     
       return response.json(repositories[repoIndex])
});

app.delete("/repositories/:id", ( request, response ) => {
  const { id  } = request.params

  const indexRepo = repositories.findIndex(repo => repo.id == id)
    if (indexRepo<0 ) {
      return response.sendStatus(400)
    }
    repositories.splice(indexRepo, 1)
    return response.sendStatus(204).json({})

    

});

app.post("/repositories/:id/like", (request, response) => {
  const  { id } = request.params
  const indexRepo = repositories.findIndex(repo => repo.id == id)

    if (indexRepo<0){
      return response.sendStatus(400)
    }else{
      repositories[indexRepo].likes+=1
      const likes = repositories[indexRepo].likes
      return response.json({likes: likes})

    }
    

});

module.exports = app;

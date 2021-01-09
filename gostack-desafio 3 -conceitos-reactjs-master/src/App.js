import React, { useEffect, useState} from "react";
import api from './services/api'
import "./styles.css";

function App() {
  const [ repositories,  setRepository ] = useState([])

const newRepository = {
  id: 1,
  likes: 0,
  techs: ['Node', 'Javascript', 'Ruby'],
  title: `O Ano de que nasci foi ${Date.now()}`,
  url: "https://github.com/Rocketsesasaat/unform",
}

   useEffect(()=>{
     api.get('/repositories').then(results =>{
      console.log(results)
       setRepository(results.data)
    })

  },[])



 async function handleAddRepository() {
    const results = await api.post('repositories',newRepository)
    setRepository([...repositories, results.data])
  }

  async function handleRemoveRepository(id) {
   await api.delete(`repositories/${id}`)
   const newRepository=  repositories.filter(repository=> repository.id !== id)
  //  filter não altera o conceito de imutabilidade
   setRepository(newRepository)
  }

  return (
    <div>
      <ul data-testid="repository-list">
        {repositories.map(repository=>  <li
         key={repository.id}>  {repository.title} 

          <button onClick={() => handleRemoveRepository(repository.id)}>
            Remover
          </button>
          </li>)}
      </ul>

      <button onClick={handleAddRepository}>Adicionar</button>
    </div>
  );
}

export default App;

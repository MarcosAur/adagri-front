# Adagri Front

# Projeto Vue 3 + Vite com Docker Compose

Este projeto é uma aplicação frontend construída com **Vue 3** e **Vite**, servida via **Nginx** em ambiente Docker.  

---

## Tecnologias

- [Vue 3](https://vuejs.org/)
- [Vite](https://vitejs.dev/)
- [Nginx](https://nginx.org/)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

---

## Instruções de Instalação
- Executar o comando para que os containers sejam carregados
```bash
docker compose up -d
```
## Credenciais de acesso
- Acessar via terminar com a URL: [Aplicação Front](http://localhost:8001)
- email: teste@teste.com
- senha: 12345678

## Observação Importante
- É importante que os containers da API estejam funcionando e o container do nginx esteja servindo a aplicação na porta 8000. 
- Caso seja necessário alterar a porta do container nginx da API altere a constante **apiBaseUrl** no arquivo **settings.js**.


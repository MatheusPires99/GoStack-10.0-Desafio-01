const express = require("express");

const server = express();

server.use(express.json());

const projects = [];

function idExists(req, res, next) {
    const { id } = req.params;
    const project = projects.find(project => project.id == id);

    if(!project) {
        return res.status(400).json({ error: `Project with id: ${id} not found` });
    }

    return next();
}

function numberOfRequests(req, res, next) {
    console.count("Number of requests");

    return next();
}

server.use(numberOfRequests);

// Exibi todos os projetos
server.get("/projects", (req, res) => {
    return res.json(projects);
});

// Cadastrar novo projeto
server.post("/projects", (req, res) => {
    const { id, title } = req.body;

    const project = {
        id,
        title,
        tasks: []
    };

    projects.push(project);

    return res.json(project);
});

// Alterar título do projeto com o id presente nos parâmetros da rota
server.put("/projects/:id", idExists, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    const project = projects.find(project => project.id == id);

    project.title = title;

    return res.json(project)
});

// Deleta um projeto
server.delete("/projects/:id", idExists, (req, res) => {
    const { id } = req.params;

    const projectIndex = projects.find(project => project.id == id);

    projects.splice(projectIndex, 1);

    return res.json({ message: `Project with id: ${id} deleted` });
});

// Adiciona uma tarefa ao projeto com o id presente nos parâmetros da rota
server.post("projects/:id/tasks", idExists, (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    const project = projects.find(p => p.id == id);

    project.tasks.push(name);

    return res.json(project);
});



server.listen(3333);
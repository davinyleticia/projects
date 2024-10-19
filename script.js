const githubUsername = 'davinyleticia'; // Substitua pelo seu usuário do GitHub
const gitlabUsername = 'davinyleticia'; // Substitua pelo seu usuário do GitLab
document.getElementById('name').textContent = 'Daviny Letícia Vidal'; // Substitua pelo seu nome
document.getElementById('url-website').href = `https://vidal.press/`;
const reposPorPagina = 12;
let paginaAtual = 1;
const topico = 'projects'; // Tópico a ser filtrado



async function buscarRepos() {
    try {
        // Buscar repositórios do GitHub
        const githubResponse = await fetch(`https://api.github.com/users/${githubUsername}/repos?per_page=100`);
        const githubData = await githubResponse.json();


        // Buscar repositórios do GitLab
        const gitlabResponse = await fetch(`https://gitlab.com/api/v4/users/${gitlabUsername}/projects`);
        const gitlabData = await gitlabResponse.json();


        // Definir o avatar e o nome do usuário do GitHub
        document.getElementById('github-avatar').src = `https://avatars.githubusercontent.com/${githubUsername}`;
        document.getElementById('github-name').textContent = `@${githubUsername}`;

        // Combinar repositórios de ambas as plataformas
        const todosRepos = [...githubData, ...gitlabData];

        // Filtrar e ordenar repositórios por tópico e data
        const reposFiltrados = todosRepos.filter(repo => {
            // GitHub usa 'topics' e GitLab usa 'tag_list'
            const topics = repo.topics || repo.tag_list || [];
            return topics.includes(topico);
        }).sort((a, b) => {
            const dateA = new Date(a.updated_at || a.last_activity_at);
            const dateB = new Date(b.updated_at || b.last_activity_at);
            return dateB - dateA; // Ordem decrescente
        });


        exibirRepos(reposFiltrados);
    } catch (error) {
        console.error('Erro ao buscar repositórios:', error);
    }
}




function exibirRepos(repos) {
    const repoList = document.getElementById('repo-list');
    const totalRepos = repos.length;
    const totalPaginas = Math.ceil(totalRepos / reposPorPagina);

    // Limpa a lista de repositórios
    repoList.innerHTML = '';

    // Calcula o índice inicial e final para a paginação
    const indiceInicial = (paginaAtual - 1) * reposPorPagina;
    const indiceFinal = Math.min(indiceInicial + reposPorPagina, totalRepos);

    for (let i = indiceInicial; i < indiceFinal; i++) {
        const repo = repos[i];
        const listItem = document.createElement('li');
        const repoName = repo.name;
        listItem.innerHTML = `<span><a href="readme.html?repo=${repoName}">${repo.name || repo.path}</a></span><span>${repo.updated_at ? `Atualizado em: ${new Date(repo.updated_at || repo.last_activity_at).toLocaleDateString()}` : ''}</span>`;
        repoList.appendChild(listItem);
    }

    // Atualiza a contagem de repositórios
    document.getElementById('repo-count').textContent = totalRepos;

    // Atualiza a informação de paginação
    document.getElementById('page-info').textContent = `Página ${paginaAtual} de ${totalPaginas}`;

    // Habilita ou desabilita os botões de paginação
    document.getElementById('prev').disabled = paginaAtual === 1;
    document.getElementById('next').disabled = paginaAtual === totalPaginas;
}

// Funções para navegação nas páginas
document.getElementById('prev').onclick = () => {
    if (paginaAtual > 1) {
        paginaAtual--;
        buscarRepos();
    }
};

document.getElementById('next').onclick = () => {
    paginaAtual++;
    buscarRepos();
};

// Carregar repositórios ao iniciar
buscarRepos();

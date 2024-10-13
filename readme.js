async function carregarReadme() {
    // Captura o nome do repositório da URL
    const urlParams = new URLSearchParams(window.location.search);
    const repoName = urlParams.get('repo');

    // Substitua 'seu-usuario-ou-organizacao' pelo seu nome de usuário ou organização
    const username = 'davinyleticia'; // Coloque seu usuário ou organização
    const url = `https://api.github.com/repos/${username}/${repoName}/readme`;

    try {
        // Tenta buscar o README do repositório
        const response = await fetch(url, {
            headers: {
                'Accept': 'application/vnd.github.v3.raw' // Para obter o conteúdo em formato bruto
            }
        });

        // Verifica se a resposta está OK
        if (!response.ok) {
            throw new Error('Erro ao carregar o README.md: ' + response.statusText);
        }

        const textoReadme = await response.text();
        
        // Verifica se o texto do README foi obtido
        if (!textoReadme) {
            throw new Error('O README.md está vazio ou não foi encontrado.');
        }

        // Converte o Markdown para HTML usando a biblioteca marked
        const htmlReadme = marked.parse(textoReadme); // Usando marked.parse() para conversão

        // Adiciona o HTML convertido ao elemento
        document.getElementById('readme-content').innerHTML = htmlReadme;
        document.getElementById('readme-repo').href = `https://github.com/${username}/${repoName}`;
        
    } catch (error) {
        // Exibe a mensagem de erro
        document.getElementById('readme-content').textContent = error.message;
        console.error('Erro ao carregar o README:', error);
    }
}

// Carregar o conteúdo do README ao iniciar
document.addEventListener('DOMContentLoaded', () => {
    carregarReadme(); // Chama a função quando o DOM estiver totalmente carregado
});

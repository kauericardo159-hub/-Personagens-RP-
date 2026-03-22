// CONFIGURAÇÃO DO SEU GITHUB
const GITHUB_USER = "kauericardo159-hub";
const GITHUB_REPO = "-Personagens-RP--main";

async function carregarPersonagens() {
    const listContainer = document.getElementById('char-list');
    listContainer.innerHTML = "<tr><td colspan='4'>Sincronizando com o GitHub...</td></tr>";

    try {
        // 1. Busca os arquivos da pasta 'Fantasia' via API do GitHub
        const url = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/Fantasia`;
        const response = await fetch(url);
        const arquivos = await response.json();

        listContainer.innerHTML = ""; // Limpa o carregando

        // Filtra apenas arquivos .md e ignora o .gitkeep
        const fichas = arquivos.filter(file => file.name.endsWith('.md'));

        for (const file of fichas) {
            // 2. Busca detalhes do commit para pegar a DATA REAL
            const commitUrl = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/commits?path=${file.path}&per_page=1`;
            const commitRes = await fetch(commitUrl);
            const commitData = await commitRes.json();
            
            const dataAtualizacao = new Date(commitData[0].commit.committer.date).toLocaleString('pt-BR');
            
            // Remove o ".md" do nome para exibir
            const nomePersonagem = file.name.replace('.md', '');

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <img src="assets/${nomePersonagem}.png" class="img-perfil" 
                         onerror="this.src='https://via.placeholder.com/50?text=? '">
                </td>
                <td>
                    <a href="https://github.com/${GITHUB_USER}/${GITHUB_REPO}/blob/main/${file.path}" class="char-link" target="_blank">
                        ${nomePersonagem}
                    </a>
                </td>
                <td><span class="badge">Fantasia</span></td>
                <td>
                    <div class="date-container">
                        <span class="date-text"><b>Sincronizado via GitHub</b></span>
                        <span class="date-text"><b>Update:</b> ${dataAtualizacao}</span>
                    </div>
                </td>
            `;
            listContainer.appendChild(row);
        }
    } catch (error) {
        listContainer.innerHTML = "<tr><td colspan='4'>Erro ao carregar. O repositório está privado ou o nome está errado?</td></tr>";
        console.error(error);
    }
}

document.addEventListener('DOMContentLoaded', carregarPersonagens);

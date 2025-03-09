let fjh87ta = "mena"
let dgwava =  "li"
let dy768fa = "ble-su"
let jfi323fg = "nday.g"
let ahgwf3 = "ing-a"
let iauhiga = "tch.me"
let a534ff = "rumbl"
let base = "https://" + a534ff + ahgwf3 + fjh87ta + dy768fa + jfi323fg + dgwava + iauhiga + "/"
let hufdhawu = "r"
let aghidf = "g"
let ajgiwh = "a"
let aghvaw = "ck"
let dawgwva = "p"
let kfjgwag = "pe"
let kafjwaf = "a"
const API_URL_1 = base + kfjgwag + aghidf + ajgiwh + hufdhawu + "?" + dawgwva + kafjwaf + aghvaw + "=1";
const API_URL_2 = base + kfjgwag + aghidf + ajgiwh + hufdhawu + "?" + dawgwva + kafjwaf + aghvaw + "=2";
const API_URL_3 = base + kfjgwag + aghidf + ajgiwh + hufdhawu + "?" + dawgwva + kafjwaf + aghvaw + "=3";


const productList = document.getElementById("product-list");

let allProducts = [];
let currentProducts = [];
let isLoading = false;
let termoPesquisa = '';  // Variável que armazena o termo da pesquisa


document.addEventListener("DOMContentLoaded", function () {
    document.querySelector(".logo").addEventListener("click", function () {
        setTimeout(function() {
            location.reload(); // Recarrega a página após 2.2 segundos
        }, 800); // 2200 milissegundos = 2.2 segundos
    });
});



// Função para normalizar os nomes dos produtos para comparação
function normalizarNome(nome) {
    return nome.toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove os acentos
        .replace(/\b(do|de|a|an|e|para|com|em|o|a)\b/g, "") // Remove palavras de conexão
        .trim();
}

// Função para verificar se a imagem é Base64 válida e não um GIF transparente vazio
function isValidBase64Image(base64) {
    if (!base64.startsWith("data:image/")) return false;
    const transparentGif = "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    return !base64.includes(transparentGif);
}

// Função para determinar se uma imagem é válida (imagem de um link ou base64 válida)
function temImagemValida(imagem) {
    if (imagem.startsWith("http")) return true;
    if (imagem.startsWith("data:image/") && isValidBase64Image(imagem)) return false;
	if (imagem === "img/placeholder.png") return false;
    return false;
}

// Função para carregar mais produtos dinamicamente
async function carregarMaisProdutos() {
    if (isLoading || currentProducts.length >= allProducts.length) return;
    isLoading = true;

    // Calcula quantos produtos carregar (mínimo 10, ou baseado na altura da tela)
    const quantidadeParaCarregar = Math.max(10, Math.ceil(window.innerHeight / 200));
    const produtosRestantes = allProducts.slice(currentProducts.length, currentProducts.length + quantidadeParaCarregar);
    currentProducts = [...currentProducts, ...produtosRestantes];

    // Se não houver termo de pesquisa, exibe os produtos carregados
    if (!termoPesquisa) {
        exibirProdutosNaTela(currentProducts);
    }
    isLoading = false;
}

// Função para exibir um conjunto de produtos na tela
function exibirProdutosNaTela(produtosArray) {
    productList.innerHTML = "";
    const hoverTimers = new Map();
    const resetTimers = new Map();

    produtosArray.forEach(produto => {
        const productDiv = document.createElement("div");
        productDiv.classList.add("product");

        // Criando o título do produto separadamente
        const titulo = document.createElement("h3");
        titulo.dataset.fullTitle = produto.nome; // Armazena o título completo
        titulo.innerHTML = truncarTexto(produto.nome, 10); // Exibição inicial truncada

        // Adicionando eventos de hover e clique
        titulo.addEventListener("mouseenter", () => {
            clearTimeout(resetTimers.get(titulo)); // Evita que o título volte antes do tempo
            hoverTimers.set(titulo, setTimeout(() => {
                titulo.innerHTML = titulo.dataset.fullTitle; // Mostra o título completo
            }, 1700));
        });

        titulo.addEventListener("mouseleave", () => {
            clearTimeout(hoverTimers.get(titulo)); // Cancela a exibição caso o tempo não tenha passado
            resetTimers.set(titulo, setTimeout(() => {
                titulo.innerHTML = truncarTexto(titulo.dataset.fullTitle, 10); // Volta para truncado
            }, 2000));
        });

        titulo.addEventListener("click", () => {
            clearTimeout(resetTimers.get(titulo)); // Evita que volte ao estado truncado
            titulo.innerHTML = titulo.dataset.fullTitle;
        });

        // Criando o restante do HTML do produto
        productDiv.innerHTML = `
            <img src="${produto.imagem}" alt="${produto.nome}">
            <div class="price-container">
                <div class="price">
                    <img src="img/ico/${produto.icone}" alt="Ícone">
                    <span>${produto.preco}</span>
                </div>
            </div>
        `;

        // Inserindo o título antes da "price-container"
        productDiv.insertBefore(titulo, productDiv.querySelector(".price-container"));

        productList.appendChild(productDiv);
    });
}



// Função para calcular a relevância de um produto com base nas palavras-chave
function calcularRelevancia(nomeProduto) {
    let relevancia = 0;
    const nomeNormalizado = normalizarNome(nomeProduto);

    palavrasChave.forEach(palavra => {
        const palavraNormalizada = normalizarPalavraChave(palavra);
        const regex = new RegExp(`\\b${palavraNormalizada}\\b`, "gi"); // Garante que pega a palavra exata
        const ocorrencias = (nomeNormalizado.match(regex) || []).length;
        relevancia += ocorrencias; // Soma pela quantidade de vezes que aparece
    });

    return relevancia;
}



// Armazena os timers para cada produto
const hoverTimers = new Map();
const resetTimers = new Map();

// Função para truncar textos longos e adicionar "[...]"
function truncarTexto(texto, maxPalavras = 10) {
    const palavras = texto.split(" ");
    if (palavras.length > maxPalavras) {
        return palavras.slice(0, maxPalavras).join(" ") + ' <strong class="expand-text">[...]</strong>';
    }
    return texto;
}



function bloquearInput() {
    const inputBusca = document.getElementById("search"); // Pega o input pelo ID correto
    if (inputBusca) {
        inputBusca.disabled = true; // Bloqueia o input
    }
}

// Função para desbloquear o input de busca
function desbloquearInput() {
    const inputBusca = document.getElementById("search");
    if (inputBusca) {
        inputBusca.disabled = false; // Desbloqueia o input
    }
}

// Função para carregar os produtos da API
async function carregarProdutos() {
bloquearInput();
    try {
        const responses = await Promise.all([fetch(API_URL_1), fetch(API_URL_2), fetch(API_URL_3)]);
        const data = await Promise.all(responses.map(res => res.json()));

        // Verifica se alguma API retornou um erro e exibe a mensagem correspondente
        const erroApi = data.find(api => api.error);
        if (erroApi) {
            productList.innerHTML = `<p style='color: red; font-weight: bold;'>${erroApi.error}</p>`;
            return;
        }

        // Se todas as APIs estiverem vazias, exibe a mensagem "Nenhum produto encontrado."
        if (data.every(api => !api.produtos || Object.keys(api.produtos).length === 0)) {
            productList.innerHTML = "<p>Nenhum produto encontrado.</p>";
            return;
        }

        const produtosMap = new Map();

        data.forEach((apiData, index) => {
            if (!apiData.produtos) return;
            Object.entries(apiData.produtos).forEach(([dominio, produtos]) => {
                produtos.forEach(produto => {
                    const nomeCompleto = produto.nome;
                    const nomeTruncado = truncarTexto(produto.nome, 10);
                    const nomeNormalizado = normalizarNome(produto.nome);
                    const preco = produto.preco ? `R$ ${produto.preco}` : "R$ -- --";
                    const icones = ["ico_mercado1.png", "ico_mercado2.png", "ico_mercado3.png"];
                    const icone = icones[index] || "ico_padrao.png";

                    let imagem = produto.imagem;
                    if (isValidBase64Image(imagem)) {
                        imagem = produto.imagem;
                    } else if (imagem.startsWith("http")) {
                        imagem = produto.imagem;
                    } else {
                        imagem = "img/placeholder.png";
                    }

                    if (!produtosMap.has(nomeNormalizado)) {
                        produtosMap.set(nomeNormalizado, {
                            nome: nomeCompleto,
                            nomeTruncado,
                            imagem,
                            preco,
                            icone
                        });
                    }
                });
            });
        });

        allProducts = Array.from(produtosMap.values());
		desbloquearInput();
        carregarMaisProdutos();
    } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        productList.innerHTML = `
  <p style="
    position: absolute; 
    top: 50%; 
    left: 50%; 
    transform: translate(-50%, -50%); 
    color: red; 
    font-weight: bold; 
    font-size: 20px; 
    text-align: center; 
    background-color: rgba(255, 255, 255, 0.8); 
    padding: 20px; 
    border-radius: 10px; 
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2); 
    width: 80%; 
    max-width: 600px;">
    Erro ao carregar os produtos.
  </p>
`;

    }
}


// Função para normalizar as palavras-chave para comparação
function normalizarPalavraChave(palavra) {
    return palavra.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// Lista de palavras-chave relacionadas a "ovo" e "carne"
const palavrasChave = [
    "ovo", "ovos", "branco", "brancos", "vermelho", "vermelhos", 
    "galinha", "feijão", "caipira", "codorna", "bovina", "boi", "moída", "frango",
	"espaguete", "parafuso", "instantâneo", "sal", "cozinha", "refinado",
	"marinho", "grosso", "alho", "kg", "roxo", "embalagem", "tempero"
];

// Event listener para disparar a pesquisa ao pressionar "Enter"
document.getElementById("search").addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
        e.preventDefault(); // Impede o comportamento padrão do Enter
        termoPesquisa = this.value.trim().toLowerCase();
        const filtro = document.getElementById("filter").value; // Valor do combobox
        const noResultsMessage = document.getElementById("no-results-message");
        let visibleProducts = [];

        if (termoPesquisa.length === 0) {
            noResultsMessage.style.display = "none";
            visibleProducts = [...currentProducts];
        } else {
            // Tokeniza a query: junta palavras conectivas com a seguinte
            const tokens = getSearchTokens(termoPesquisa);

            if (tokens.length === 1) {
                // Se for apenas uma palavra, pega qualquer produto que contenha essa palavra
                visibleProducts = allProducts.filter(produto => 
                    produto.nome.toLowerCase().includes(tokens[0])
                );
            } else {
                // Caso haja mais de uma palavra, aplica o sistema de ranking corretamente
                visibleProducts = allProducts.filter(produto => {
                    const nome = produto.nome.toLowerCase();
                    return tokens.every(token => nome.includes(token)); // Garante que todas as palavras estejam presentes
                });

                // Para cada produto, conta quantos tokens foram encontrados no nome
                let produtosComScore = visibleProducts.map(produto => {
                    const nome = produto.nome.toLowerCase();
                    let tokenMatchCount = tokens.reduce((count, token) => {
                        return nome.includes(token) ? count + 1 : count;
                    }, 0);
                    return { produto, tokenMatchCount };
                });

                // Ordena primeiro pelo número de tokens encontrados (ranking maior primeiro)
                produtosComScore.sort((a, b) => b.tokenMatchCount - a.tokenMatchCount);
                visibleProducts = produtosComScore.map(item => item.produto);
            }
        }

        // Se o filtro de preço for aplicado, ordena SOMENTE os produtos que já passaram pela pesquisa
        if ((filtro === "menor" || filtro === "maior") && visibleProducts.length > 0) {
            visibleProducts.sort((a, b) => {
                let precoA = parseFloat(a.preco.replace("R$", "").replace(",", ".").trim()) || 0;
                let precoB = parseFloat(b.preco.replace("R$", "").replace(",", ".").trim()) || 0;

                return filtro === "menor" ? precoA - precoB : precoB - precoA;
            });
        }

        exibirProdutosNaTela(visibleProducts);
        noResultsMessage.style.display = visibleProducts.length === 0 ? "block" : "none";
    }
});





// Função auxiliar para verificar se uma palavra é conector
function isConnector(word) {
    const connectors = ["de", "da", "do", "dos", "das"];
    return connectors.includes(word);
}

// Função para tokenizar a string de busca, agrupando palavras conectivas com a seguinte
function getSearchTokens(query) {
    let words = query.trim().split(/\s+/).filter(word => word.length > 0); // Remove espaços extras e palavras vazias
    let tokens = [];

    for (let i = 0; i < words.length; i++) {
        if (i < words.length - 1 && isConnector(words[i])) {
            let combined = words[i] + " " + words[i + 1];
            tokens.push(combined);
            i++; // Pula a próxima palavra, pois já foi agrupada
        } else {
            tokens.push(words[i]);
        }
    }

    return tokens;
}




// Ao clicar no campo de pesquisa, leva a página para o topo
document.getElementById("search").addEventListener("focus", function() {
    window.scrollTo(0, 0);
});

// Exibir mensagem de 'nenhum resultado encontrado'
const body = document.querySelector("body");
const noResultsMessage = document.createElement("div");
noResultsMessage.id = "no-results-message";
noResultsMessage.style.display = "none";
noResultsMessage.style.position = "absolute";
noResultsMessage.style.top = "50%";
noResultsMessage.style.left = "50%";
noResultsMessage.style.transform = "translate(-50%, -50%)";
noResultsMessage.style.fontSize = "20px";
noResultsMessage.style.color = "gray";
noResultsMessage.textContent = "Nenhum resultado encontrado.";
body.appendChild(noResultsMessage);

// Detecta quando o usuário chega ao final da página para carregar mais produtos (se não estiver com busca ativa)
window.addEventListener('scroll', () => {
    if (!termoPesquisa && window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        carregarMaisProdutos();
    }
});

// Carregar os produtos inicialmente
carregarProdutos();

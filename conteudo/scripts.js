document.addEventListener('DOMContentLoaded', () => {
    carregarProdutos();
    configurarEventos();
});

function carregarProdutos() {
    const listaProdutosDiv = document.getElementById('lista-produtos');
    listaProdutosDiv.innerHTML = ''; // Limpa a lista antes de adicionar

    produtos.forEach(produto => {
        const card = document.createElement('div');
        card.className = 'produto-card';
        card.innerHTML = `
            <img src="${produto.imagem}" alt="${produto.nome}">
            <h3>${produto.nome}</h3>
            <p>R$ ${produto.preco.toFixed(2)}</p>
            <button class="btn-adicionar" onclick="adicionarAoCarrinho(${produto.id})">Adicionar ao Carrinho</button>
        `;
        listaProdutosDiv.appendChild(card);
    });
}

const produtos = [
    {
        id: 1,
        nome: 'Natura Kaiak Tradicional',
        marca: 'Natura',
        preco: 129.90,
        imagem: 'imagens/natura_kaiak.jpg',
        estoque: 5
    },
    {
        id: 2,
        nome: 'O Boticário Malbec Gold',
        marca: 'O Boticário',
        preco: 179.90,
        imagem: 'imagens/boticario_malbec.jpg',
        estoque: 3
    },
    {
        id: 3,
        nome: 'Natura Essencial Oud',
        marca: 'Natura',
        preco: 215.00,
        imagem: 'imagens/natura_essencial.jpg',
        estoque: 2
    }
       
];

let carrinho = [];

function adicionarAoCarrinho(idProduto) {
    const produtoExistente = carrinho.find(item => item.id === idProduto);

    if (produtoExistente) {
        // Se o produto já está no carrinho, aumenta a quantidade
        produtoExistente.quantidade++;
    } else {
        // Se não está, adiciona ao carrinho
        const produto = produtos.find(p => p.id === idProduto);
        carrinho.push({ ...produto, quantidade: 1 });
    }

    atualizarCarrinho();
}

function atualizarCarrinho() {
    const itensCarrinhoDiv = document.getElementById('itens-carrinho');
    const valorTotalSpan = document.getElementById('valor-total');
    let total = 0;

    if (carrinho.length === 0) {
        itensCarrinhoDiv.innerHTML = '<p>Seu carrinho está vazio.</p>';
        valorTotalSpan.textContent = '0.00';
        return;
    }

    itensCarrinhoDiv.innerHTML = '';
    carrinho.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item-no-carrinho';
        itemDiv.innerHTML = `
            <span>${item.quantidade}x ${item.nome}</span>
            <span>R$ ${(item.preco * item.quantidade).toFixed(2)}</span>
        `;
        itensCarrinhoDiv.appendChild(itemDiv);
        total += item.preco * item.quantidade;
    });

    valorTotalSpan.textContent = total.toFixed(2);
}

function configurarEventos() {
    const btnFinalizar = document.getElementById('finalizar-pedido');
    btnFinalizar.addEventListener('click', enviarMensagemWhatsApp);
}

function enviarMensagemWhatsApp() {
    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    const numeroTelefone = '5596000000000'; // <<<<<<< COLOQUE O NÚMERO DA SUA MÃE AQUI (com código do país e DDD)
    let mensagem = 'Olá! Gostaria de fazer o seguinte pedido:\n\n';
    let totalPedido = 0;

    carrinho.forEach(item => {
        mensagem += `${item.quantidade}x - ${item.nome}\n`;
        totalPedido += item.preco * item.quantidade;
    });

    mensagem += `\n*Total do Pedido: R$ ${totalPedido.toFixed(2)}*`;

    // Codifica a mensagem para ser usada na URL
    const mensagemCodificada = encodeURIComponent(mensagem);

    // Cria o link e abre em uma nova aba
    const urlWhatsApp = `https://api.whatsapp.com/send?phone=${numeroTelefone}&text=${mensagemCodificada}`;
    window.open(urlWhatsApp, '_blank');
}
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
        imagem: "imagens/boticario_malbec.jpg",
        estoque: 3
    },
    {
        id: 3,
        nome: 'Natura Essencial Oud',
        marca: 'Natura',
        preco: 215.00,
        imagem: 'imagens/natura_essencial.jpg',
        estoque: 2
    },
    {
        id: 4,
        nome: 'Natura Deo Parfum Una Senses Feminino - 75ml',
        marca: 'Natura',
        preco: 200.00,
        imagem: 'imagens/natura_deo_parfum_una.jpg',
        estoque: 3
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
        // NOVO: Adicionamos uma classe para estilizar melhor o item do carrinho
        itemDiv.className = 'item-no-carrinho';
        
        // ATUALIZAÇÃO AQUI: Adicionamos um botão de remover
        itemDiv.innerHTML = `
            <div class="item-info">
                <span>${item.quantidade}x ${item.nome}</span>
                <span>R$ ${(item.preco * item.quantidade).toFixed(2)}</span>
            </div>
            <button class="btn-remover" onclick="removerDoCarrinho(${item.id})">Remover</button>
        `;

        itensCarrinhoDiv.appendChild(itemDiv);
        total += item.preco * item.quantidade;
    });

    valorTotalSpan.textContent = total.toFixed(2);
}


function removerDoCarrinho(idProduto) {
    // 1. Encontra o índice do produto no array do carrinho
    const indiceProduto = carrinho.findIndex(item => item.id === idProduto);

    // Se o produto não for encontrado, não faz nada
    if (indiceProduto === -1) {
        return;
    }

    // 2. Diminui a quantidade
    carrinho[indiceProduto].quantidade--;

    // 3. Se a quantidade for 0, remove o item do array
    if (carrinho[indiceProduto].quantidade === 0) {
        // O método splice remove o item do array
        carrinho.splice(indiceProduto, 1);
    }
    
    // 4. Atualiza a exibição do carrinho
    atualizarCarrinho();
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

    const numeroTelefone = '5596991631429'; // <<<<<<< COLOQUE O NÚMERO DA SUA MÃE AQUI (com código do país e DDD)
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
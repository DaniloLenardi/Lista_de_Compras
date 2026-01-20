const item = document.getElementById("item")
const quantidade = document.getElementById("quantidade")
const unidade = document.getElementById("unidade")
const lista = document.getElementById("lista")

let itenSalvo = JSON.parse(localStorage.getItem("minhaLista")) || []

renderizarLista()

function enviar(){
    if(item.value == "" || quantidade.value == ""  || unidade.value == ""){
        alert("todos os items devem ser preenchidos!!")
        return
    }
    const listaTexto = `${quantidade.value} ${unidade.value} de ${item.value}`
    itenSalvo.push(listaTexto)

    localStorage.setItem("minhaLista", JSON.stringify(itenSalvo))
    renderizarLista()

    item.value = ""
    quantidade.value = ""
    unidade.value = ""
}

function renderizarLista(){
    lista.innerHTML = ""

    itenSalvo.forEach((texto, index) =>{
        const li = document.createElement("li")

        li.textContent = texto

        const btnDeletar = document.createElement("button")
        btnDeletar.textContent = "Deletar"
        btnDeletar.style.margin = "10px"

        btnDeletar.onclick = function(){
            deletarItem(index)
        }

        li.appendChild(btnDeletar)

        lista.appendChild(li)


    })
}

function deletarItem(posicao){
    itenSalvo.splice(posicao, 1)

    localStorage.setItem("minhaLista", JSON.stringify(itenSalvo))

    renderizarLista()
}


async function gerarPDF() {
    if (itenSalvo.length === 0) {
        alert("A lista está vazia!");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // 1. Criamos um objeto de imagem
    const img = new Image();
    img.src = 'img/lista-de-compras.png'; // Nome do arquivo que você salvou

    // Esperamos a imagem carregar para não dar erro no PDF
    img.onload = function() {
        // 2. Adicionamos a imagem (Centralizada)
        // x: 55 (meio da folha menos metade da largura da imagem)
        // y: 10 (distância do topo)
        // largura: 100, altura: 40 (você pode ajustar esses números)
        doc.addImage(img, 'PNG', 70, 15, 60, 22);

        // 3. Linha decorativa abaixo da imagem
        doc.line(20, 45, 190, 45);

        // 4. Configura a lista (ajustamos a 'linha' para começar mais baixo)
        doc.setFontSize(12);
        let linha = 70; 

        itenSalvo.forEach((texto) => {
            doc.rect(20, linha - 5, 5, 5); 
            doc.text(texto, 30, linha);
            linha += 10; 
        });

        doc.save("lista-de-compras.pdf");
    };
}
const input = document.getElementById("inputTarefa");
const lista = document.getElementById("listaTarefas");

let tarefas = [];
let filtroAtual = "todas";

function adicionarTarefa() {
    
    const texto = input.value.trim();

    if (texto === "") return;
    
    const tarefa = {
        texto: texto,
        concluida: false
    };

    tarefas.push(tarefa);

    salvarTarefas();

    renderizarTarefas();

    input.value = "";
}

function renderizarTarefas() {

    lista.innerHTML = "";

    let tarefasFiltradas = tarefas;

    if (filtroAtual === "pendentes") {
        tarefasFiltradas = tarefas.filter(t => !t.concluida);
    }

    if (filtroAtual === "concluidas") {
        tarefasFiltradas = tarefas.filter(t => t.concluida);
    }

    tarefasFiltradas.forEach((tarefa, indexOriginal) => {

        const index = tarefas.indexOf(tarefa);

        const li = document.createElement("li");
        li.innerText = tarefa.texto;

        if (tarefa.concluida){
            li.classList.add("concluida");
        }

        li.onclick = () => alternarTarefas(index);

        const btnRemover = document.createElement("button");
        btnRemover.innerText = "X";

        btnRemover.onclick = (event) => {
            event.stopPropagation();
            removerTarefa(index);
        };

        li.appendChild(btnRemover);
        lista.appendChild(li);
    });

    atualizarContador();      
}

function alternarTarefas(index) {
    
    tarefas[index].concluida = !tarefas[index].concluida;

    salvarTarefas();
    renderizarTarefas();
}

function removerTarefa(index) {

    tarefas.splice(index, 1);

    salvarTarefas();
    renderizarTarefas();
}

function salvarTarefas() {
    localStorage.setItem("tarefas", JSON.stringify(tarefas));

}

function carregarTarefas() {
    const tarefasSalvas = localStorage.getItem("tarefas");
    const filtroSalvo = localStorage.getItem("filtro");

    if (tarefasSalvas) {
        tarefas = JSON.parse(tarefasSalvas);
    }

    if (filtroSalvo) {
        filtroAtual = filtroSalvo;
    }
}

function definirFiltro(filtro) {

  filtroAtual = filtro;
  localStorage.setItem("filtro", filtro);

  atualizarBotoesFiltro();
  renderizarTarefas();

}

function atualizarContador() {
    const contador = document.getElementById("contador");
    const pendentes = tarefas.filter(t => !t.concluida).length;

    contador.innerText = `${pendentes} tarefa(s) pendente(s)`;
}

function limparConcluidas () {
    tarefas = tarefas.filter( t => !t.concluida);

    salvarTarefas();
    renderizarTarefas();
}

function atualizarBotoesFiltro() {
  const botoes = document.querySelectorAll(".filtros button");

  botoes.forEach(botao => {
    botao.classList.remove("ativo");

    if (botao.innerText.toLowerCase() === filtroAtual) {
      botao.classList.add("ativo");
    }
  });
}

//// ADICIONANDO EVENTO DE TECLADO PARA O INPUT

input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        adicionarTarefa();
    }
});

carregarTarefas();
renderizarTarefas();
atualizarBotoesFiltro();

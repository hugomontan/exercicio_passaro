var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var jogo = new Phaser.Game(config);
var passaro;
var tempo = 0; // Tempo para ajustar o movimento
var indoParaDireita = true; // Define a direção inicial do pássaro (esquerda->direita)
var contadorPontoMaximo = 0; // Contador de quantas vezes o pássaro atinge o ponto máximo da parábola
var contadorTexto; // Variável para exibir o contador na tela

// Definindo os valores fixos do ponto máximo da parábola (y=A⋅(x−h)^2 + k)
const A = 0.001; // Curvatura da parábola
const h = 400; // Ponto médio do movimento horizontal (vértice)
const k = 300; // Ponto máximo no eixo Y
const x_max = h; // X do ponto máximo
const y_max = k; // Y do ponto máximo
const velocidade = 5; // Velocidade do movimento horizontal

// Carregando os arquivos
function preload(){
    this.load.image('bg','assets/bg_space.png');
    this.load.spritesheet('passaro1', 'assets/bird-green.png', {frameWidth: 75, frameHeight: 75});
}

function create() {
    // Adiciona a imagem de fundo do jogo no centro da tela (coordenadas x=400, y=300)
    this.add.image(400, 300, 'bg');
     // Cria o sprite do pássaro, começando na posição (100, 100) e aumenta seu tamanho 1.8x
    passaro = this.add.sprite(100, 100, 'passaro1').setScale(1.8);
    // Cria a animação de voo do pássaro, pegando os frames de 0 a 7 da spritesheet, ela é nomeada como 'voar', para simplificar chamados futuros
    this.anims.create({
        key: 'voar',
        frames: this.anims.generateFrameNumbers('passaro1', {start: 0, end: 7}),
        frameRate: 5,
        repeat: -1
    });

    // Inicia a animação de voo do pássaro assim que ele aparece na tela
    passaro.anims.play('voar', true);

    // Criando um texto na tela para contar quantas vezes o pássaro atinge o ponto máximo
    contadorTexto = this.add.text(20, 20, 'Ponto Máximo: 0', {
        fontSize: '20px',
        fill: '#ffffff',
        fontFamily: 'Arial'
    });
}

function update(){
    // Atualiza o movimento do pássaro
    if (indoParaDireita) {
        tempo += velocidade;
    } else {
        tempo -= velocidade;
    }

    passaro.x = 100 + tempo;
    passaro.y = A * Math.pow((passaro.x - h), 2) + k;

    // Início do While para viabilização do contador (quantas vezes o passáro passou no PY Max da parábola)
    // Enquanto o pássaro estiver muito próximo do ponto máximo, contamos
    while (Math.abs(passaro.x - x_max) < 2 && Math.abs(passaro.y - y_max) < 2) {
        contadorPontoMaximo++;
        contadorTexto.setText('Ponto Máximo: ' + contadorPontoMaximo);
        console.log(`O pássaro atingiu o ponto máximo ${contadorPontoMaximo} vezes.`);
        break; // Impede contagens múltiplas no mesmo frame
    }

    // Se o pássaro atingir o limite direito, inverte a direção e espelha
    if (passaro.x >= 700) {
        indoParaDireita = false;
        passaro.setFlip(true, false); // Espelha o movimento
    }

    // Se o pássaro atingir o limite esquerdo, volta ao normal
    if (passaro.x <= 100) {
        indoParaDireita = true;
        passaro.setFlip(false, false); // Remove o espelhamento
    }
}

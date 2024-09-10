import  { animais } from './data/animaisData.js';

class RecintosZoo {

    analisaRecintos(animal, quantidade) {
        const animaisValidos = animais.map(animal => animal.especie);
        
        if (!animaisValidos.includes(animal)) {
            return {
                erro: "Animal inválido",
                recintosViaveis: false
            };
        }
    }
}

export { RecintosZoo as RecintosZoo };

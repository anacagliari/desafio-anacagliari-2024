import { animais } from './data/animaisData.js';
import { recintos } from './data/recintosData.js';

class RecintosZoo {

    analisaRecintos(animal, quantidade) {
        let resultado = { erro: "Não há recinto viável", recintosViaveis: false };
        
        const animaisValidos = animais.map(animalEspecie => animalEspecie.especie);
        if (!animaisValidos.includes(animal)) {
            resultado.erro = "Animal inválido";
            return resultado;
        }

        const quantidadeValida = (typeof quantidade === 'number' && quantidade > 0 && quantidade !== null);
        if (!quantidadeValida) {
            resultado.erro = "Quantidade inválida";
            return resultado;
        }

        const animalIdentificado = animais.filter(animalEspecie => animalEspecie.especie === animal)[0];
        const tamanhoTotalLote = animalIdentificado.tamanho * quantidade;

        recintos.forEach(recinto => {
            //Validações de Regras de Negócio
            const espacoDisponivel = this.calculaEspacoDisponivel(recinto, animalIdentificado)
            const espacoValido = tamanhoTotalLote <= espacoDisponivel;
            const biomaValido = this.validaBioma(recinto, animalIdentificado);
            const tipoAlimentacaoValido = this.validaTipoAlimentacao(recinto, animalIdentificado);

            // Resultado final das regras de negócio
            const recintoValido = espacoValido && biomaValido && tipoAlimentacaoValido;

            //Inclusão no resultado
            if (recintoValido) {
                if(!resultado.recintosViaveis) {
                    resultado.recintosViaveis = [`Recinto ${recinto.numero} (espaço livre: ${espacoDisponivel} total: ${recinto.tamanhoTotal})`]
                } else {
                    resultado.recintosViaveis.push(`Recinto ${recinto.numero} (espaço livre: ${espacoDisponivel} total: ${recinto.tamanhoTotal})`)
                }
            }
        });

        return resultado;
    }

    validaBioma(recinto, animal) {
        return true;
    }

    validaTipoAlimentacao(recinto, animal) {
        return true;
    }

    calculaEspacoDisponivel(recinto, animal) {
        let totalOcupado = 0;
        recinto.ocupacoes.forEach(ocupacao => {
            const animalOcupacao = animais.filter(animalEspecie => animalEspecie.especie === ocupacao.especie)[0];
            totalOcupado += ocupacao.quantidade * animalOcupacao.tamanho;
            if(animalOcupacao.especie !== animal.especie){
                totalOcupado++;
            }
        });
        return recinto.tamanhoTotal - totalOcupado;
    }
}

export { RecintosZoo as RecintosZoo };

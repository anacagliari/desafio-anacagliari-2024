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
            const espacoDisponivel = this.calculaEspacoDisponivel(recinto, animalIdentificado) - tamanhoTotalLote;
            const espacoValido = espacoDisponivel >= 0;
            const biomaValido = this.validaBioma(recinto, animalIdentificado);
            const tipoAlimentacaoValido = this.validaTipoAlimentacao(recinto, animalIdentificado);
            const ambienteMacacoValido = this.validaBiomaMacaco(recinto, animalIdentificado, quantidade);

            // Resultado final das regras de negócio
            const recintoValido = espacoValido && biomaValido && tipoAlimentacaoValido && ambienteMacacoValido;

            //Inclusão no resultado
            if (recintoValido) {
                if (!resultado.recintosViaveis) {
                    resultado.erro = null;
                    resultado.recintosViaveis = [`Recinto ${recinto.numero} (espaço livre: ${espacoDisponivel} total: ${recinto.tamanhoTotal})`]
                } else {
                    resultado.recintosViaveis.push(`Recinto ${recinto.numero} (espaço livre: ${espacoDisponivel} total: ${recinto.tamanhoTotal})`)
                }
            }
        });

        return resultado;
    }

    validaBioma(recinto, animal) {
        let biomaValido = false
        recinto.biomas.forEach(biomaRecinto => {
            if (animal.biomas.includes(biomaRecinto)) {
                biomaValido = true;
            }
        });
        return biomaValido;
    }

    validaTipoAlimentacao(recinto, animal) {
        if (recinto.ocupacoes.length === 0) {
            return true;
        }
        let tipoAlimentacaoValido = false;
        recinto.ocupacoes.forEach(ocupacao => {
            const animalOcupacao = animais.filter(animalEspecie => animalEspecie.especie === ocupacao.especie)[0];
            if (animal.carnivoro || animalOcupacao.carnivoro) {
                tipoAlimentacaoValido = animal.especie === animalOcupacao.especie;
            } else {
                tipoAlimentacaoValido = true;
            }
        });
        return tipoAlimentacaoValido;
    }

    validaBiomaMacaco(recinto, animal, quantidade) {
        // Regra dos Macacos
        if (animal.especie === 'MACACO' && quantidade === 1) {
            if (recinto.ocupacoes.length === 0) {
                return false;
            }
        }
        return true;
    }

    calculaEspacoDisponivel(recinto, animal) {
        let totalOcupado = 0;
        recinto.ocupacoes.forEach(ocupacao => {
            const animalOcupacao = animais.filter(animalEspecie => animalEspecie.especie === ocupacao.especie)[0];
            totalOcupado += ocupacao.quantidade * animalOcupacao.tamanho;
            if (animalOcupacao.especie !== animal.especie) {
                totalOcupado += 1;
            }
        });
        return recinto.tamanhoTotal - totalOcupado;
    }

}

export { RecintosZoo as RecintosZoo };

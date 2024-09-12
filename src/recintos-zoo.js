import { animais } from './data/animaisData.js';
import { recintos } from './data/recintosData.js';

class RecintosZoo {

    analisaRecintos(animal, quantidade) {
        let resultado = { erro: "Não há recinto viável", recintosViaveis: false };

        try {
            this.validaAnimalInformado(animal);
            this.validaQuantidadeInformada(quantidade);
        } catch (error) {
            resultado.erro = error.message;
            return resultado;
        }

        const animalIdentificado = animais.filter(animalEspecie => animalEspecie.especie === animal)[0];

        recintos.forEach(recinto => {
            //Validações de Regras de Negócio
            const espacoDisponivel = this.calculaEspacoDisponivel(recinto, animalIdentificado) - (animalIdentificado.tamanho * quantidade);
            const biomaEhValido = this.validaBioma(recinto, animalIdentificado);
            const tipoAlimentacaoEhValido = this.validaTipoAlimentacao(recinto, animalIdentificado);
            const ambienteMacacoEhValido = this.validaBiomaMacaco(recinto, animalIdentificado, quantidade);
            const biomaHipopotamoEhValido = this.validaBiomaHipopotamo(recinto, animalIdentificado);


            // Resultado final das regras de negócio
            const recintoEhValido = (espacoDisponivel >= 0) && biomaEhValido && tipoAlimentacaoEhValido && ambienteMacacoEhValido && biomaHipopotamoEhValido;

            //Inclusão no resultado
            if (recintoEhValido) {
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

    /**
     * Método responsável por calcular o espaço disponível dentro de um recinto.
     * Caso haja uma espécie diferente da que está sendo inserida, adiciona +1 ao espaço ocupado.
     * @param recinto 
     * @param animal 
     * @returns espacoDisponivel
     */
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

    /**
     * Método responsável por verificar se o bioma do recinto é adequado para o animal enviado.
     * @param recinto 
     * @param animal 
     * @returns biomaEhValido
     */
    validaBioma(recinto, animal) {
        let biomaValido = false
        recinto.biomas.forEach(biomaRecinto => {
            if (animal.biomas.includes(biomaRecinto)) {
                biomaValido = true;
            }
        });
        return biomaValido;
    }

    /**
     * Método responsável por garantir que animais carnívoros só possam ficar em recintos com animais de mesma espécie.
     * @param recinto 
     * @param animal 
     * @returns tipoAlimentacaoEhValido
     */
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

    /**
     * Métodos responsável por garantir que macacos não fiquem sozinhos em recinto.
     * @param recinto 
     * @param animal 
     * @param quantidade 
     * @returns ambienteMacacoEhValido
     */
    validaBiomaMacaco(recinto, animal, quantidade) {
        // Regra dos Macacos
        if (animal.especie === 'MACACO' && quantidade === 1) {
            if (recinto.ocupacoes.length === 0) {
                return false;
            }
        }
        return true;
    }

    /**
     * Método responsável por garantir que hipopótamos só estejam com outra espécie em recintos que possuam biomas de savana e rio.
     * @param recinto 
     * @param animal 
     * @returns biomaHipopotamoEhValido
     */
    validaBiomaHipopotamo(recinto, animal) {
        // Regra do Hipopótamo
        if (animal.especie === 'HIPOPOTAMO' && recinto.ocupacoes.length > 0) {
            const biomaTemSavana = recinto.biomas.includes('savana');
            const biomaTemRio = recinto.biomas.includes('rio');
            const recintoComOutraEspecie = recinto.ocupacoes.filter(ocupacao => ocupacao.especie != 'HIPOPOTAMO').length > 0;

            if (!(recintoComOutraEspecie && biomaTemSavana && biomaTemRio)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Método para validar animal informado.
     * @param animal 
     */
    validaAnimalInformado(animal) {
        const animaisValidos = animais.map(animalEspecie => animalEspecie.especie);
        if (!animaisValidos.includes(animal)) {
            throw new Error("Animal inválido");
        }
    }

    /**
     * Método para validar quantidade informada.
     * @param quantidade 
     */
    validaQuantidadeInformada(quantidade) {
        const quantidadeValida = (typeof quantidade === 'number' && quantidade > 0 && quantidade !== null);
        if (!quantidadeValida) {
            throw new Error("Quantidade inválida");
        }
    }
    
}

export { RecintosZoo as RecintosZoo };

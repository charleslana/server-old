import { Character, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const characters = [
    {
      name: 'Guerreiro',
      description:
        'A classe Warrior é o típico usuário de espada corpo a corpo . Eles usam a Força para aprimorar brutalmente suas habilidades físicas. Eles possuem a maior vitalidade inata ou valor de saúde e suas habilidades ofensivas são lentas e poderosas. Seu conjunto de equipamentos é por padrão o Conjunto de Armadura altamente defensivo , armaduras metálicas feitas de vários materiais e espadas de duas mãos, sejam Grandes Espadas ou Daikatana. Eles possuem muitas habilidades de buff de fortalecimento que podem aprimorar ainda mais suas capacidades, incluindo buffs direcionados ao grupo. Seu atributo primário é Força, que aumenta seu valor de ataque físico e sua resistência.',
      class: 'Warrior',
    },
    {
      name: 'Duelista',
      description:
        'A classe Duelista é uma classe corpo a corpo de usuário de espada rápida, conhecida por sua esquiva e precisão aprimoradas, bem como pela velocidade de suas habilidades. Eles usam a Força para aumentar sua destreza e força, dando-lhes mais flexibilidade do que um Guerreiro. Ao contrário dos guerreiros, no entanto, eles possuem apenas duas habilidades de fortalecimento para melhorar o grupo; como tal, confiando mais frequentemente em suas forças individuais, mesmo quando em grupo, ou seja, sua produção de dano e taxa de acerto crítico . Seu equipamento inclui por padrão o Martial Set , um tecido leve estilo quimono que favorece a Taxa de Defesa, ou evasão, bem como uma Blade e uma Katana , ou duas espadas de apenas um tipo se o jogador desejar.',
      class: 'Blader',
    },
    {
      name: 'Mago',
      description:
        'A terceira classe é o Mago e é o usuário mágico básico . Eles usam a Força para amplificar o poder dos elementos ao seu redor, semelhante ao que um Guerreiro faz com sua própria força. Seu atributo primário é a Inteligência, que aumenta seu poder de ataque mágico. Eles possuem várias habilidades de buff que podem afetar não apenas a si mesmos, mas a qualquer outro alvo amigável que escolherem, bem como muitos buffs de grupo. Algumas dessas habilidades são bem conhecidas, ou seja, as mais básicas que aumentam a saúde ou a defesa e geralmente são executadas em recém-chegados para ajudá-los em seu progresso inicial. Suas habilidades têm uma poderosa produção de dano; no entanto, eles têm uma diferença particular das classes corpo a corpo, que é sua área de efeito, ou AoE. Enquanto as classes corpo a corpo causam dano alto a inimigos menores com a mesma habilidade, os Wizards dispersam seu dano pela área mais alta possível para todas as classes. Combinado com a capacidade paralisante de todas as suas habilidades mais fortes, os Wizards são cruciais para controlar massas de inimigos. Sua principal desvantagem é a defesa mais baixa; ainda assim, isso pode ser superado taticamente usando o efeito de atordoamento de sua magia avançada. Seu conjunto de equipamentos é, por padrão, o Martial Set e dual Orbs , controladores em forma de globo de uma mão que geram pautas em versões recentes do jogo.',
      class: 'Wizard',
    },
    {
      name: 'Arqueiro Arcano',
      description:
        'Arqueiro Arcano são uma variação dos Magos que preferem manipular ao invés de amplificar a Força. Por causa disso, suas habilidades têm uma área de efeito menor em comparação com as habilidades do Wizard, mas, em contraste, seu dano é mais preciso, mais preciso e com uma taxa de acerto crítico maior. Eles visualizam e criam uma arma de forma semelhante ao Guardião Arcano, que é o Arco Astral; esta arma aumenta sua precisão e taxa crítica. Eles também possuem o maior alcance de ataque de todas as classes, ainda maior que o de um Mago. Exclusivos para esta classe, eles possuem magia de suporte, como habilidades poderosas de cura de alvo único e grupo, bem como muitos buffs úteis, especialmente alguns usados ​​em novos jogadores ao lado do Wizard. Suas habilidades têm o tempo de lançamento mais rápido de todos, dando-lhes um alto valor de dano por segundo.Conjunto de batalha e cristais duplos.',
      class: 'ForceArcher',
    },
    {
      name: 'Guardião Arcano',
      description:
        'Os guardiões arcanos são uma das duas classes que aprenderam a materializar a Força em uma arma real. Ao estudar magia, eles ganharam a habilidade de visualizar e criar um Escudo Astral, uma relíquia que lhes dá maior Defesa. Esta classe é o tanque básico classe que possui a maior defesa de todas as classes e, quando combinada com sua poderosa habilidade de grupo de absorção de dano, pode efetivamente proteger outros membros do grupo de uma grande quantidade de dano. Os Guardiões Arcanos também possuem uma habilidade básica de cura, ao contrário de todas as outras classes para o Arqueiro Arcano. Suas últimas habilidades também são as técnicas de dano mais críticas de todas as classes, tornando-os bons defensores e atacantes. Como o Espadachim Arcano, eles são uma classe híbrida de Espada-Magia. No entanto, ao contrário do Espadachim Arcano, que no final das contas terá que desenvolver ambas as esferas para poder usar maldições, o Guardião Arcano pode realmente se especializar em apenas uma área de especialização. Um Guardião da Força da Espada se concentrará nas habilidades físicas da Espada e valoriza brigas e danos críticos. Nesse caso, eles valorizariam Força e Destreza para poder físico e resistência. Um Guardião Arcano mágico se concentrará em habilidades mágicas, ou seja, feitiços direcionados do tipo canhão que valorizam dano por segundo em vez de alto dano instantâneo. Eles contarão com Destreza e Inteligência para obter força, resistência e esquiva. A classe também pode ser hibridizada para utilizar todo o seu potencial, geralmente fazendo uso de habilidades mágicas paralisantes ao lutar contra o meio ambiente . Seu arsenal é por padrão o Conjunto de Armadura , uma Lâmina e um Cristal , equivalente ao Orbe , embora possa depender do tipo de especialização escolhida, se o jogador assim o desejar',
      class: 'ForceShielder',
    },
    {
      name: 'Espadachim Arcano',
      description:
        'A classe Espadachim Arcano tem como tema um espadachim mágico. Eles usam a Força para fortalecer suas artes de lâmina e desenvolveram habilidades únicas de debuff que nenhuma outra classe possui. Embora eles possam usar habilidades mágicas do tipo canhão para lutar, suas habilidades de espada são as mais fortes, sua afinidade mágica sendo demonstrada apenas em suas habilidades de Espada imbuídas de Força. Seus ataques mais poderosos também são enfeitiçados com maldições, causando efeitos negativos de desvantagem em seus alvos junto com o próprio dano. Como eles alimentam uniformemente todos os três atributos principais, eles são a classe mais flexível e mais demorada para se desenvolver. Seu equipamento é por padrão o Balanced Battle Set , um traje de proteção feito de vários tipos diferentes de fibras, uma Katana e um orbe . Sua complexidade no uso de habilidades de maldição os torna uma classe melhor para jogadores avançados.',
      class: 'ForceBlader',
    },
    {
      name: 'Gladiador',
      description:
        'O Gladiator é uma poderosa classe corpo a corpo que depende do recurso Rage para causar dano de curto e longo alcance. A raiva é acumulada pelo uso contínuo de habilidades, levando o Gladiador ao frenesi. O Gladiator se destaca em causar dano de Área de Efeito e utiliza a arma Chakram exclusiva, usa armadura pesada e se beneficia muito do status de Força.',
      class: 'Gladiator',
    },
    {
      name: 'Atirador Arcano',
      description:
        'Um estilo de batalha dirigido por força especial criado em segredo, o Atirador Arcano é especializado em habilidades de tiro de longo alcance e dano poderoso em Área de Efeito. Concentrando-se em velocidades de ataque mais altas e ataques críticos, os Atiradores Arcanos tecem ataques físicos e mágicos para destruir seus inimigos à distância. Os Atiradores Arcanos usam armadura média e se beneficiam das Estatísticas de Inteligência e Destreza.',
      class: 'ForceGunner',
    },
    {
      name: 'Mago Negro',
      description:
        'O mago Negro é a última classe introduzida pelo jogo. É descrito no site oficial como um clã de magos que lidavam com a força e ansiavam pelo poder que estava além da magia mundana. Após décadas de pesquisa, eles conseguiram fundir as almas dos mortos com a Força, criando uma magia que pode convocar tanto a escuridão quanto a leveza dos seres. Esta classe utiliza Orbs e seu Stat principal é a Inteligência.',
      class: 'DarkMage',
    },
  ] as Character[];

  for (const character of characters) {
    await prisma.character.create({
      data: character,
    });
  }
}

main()
  .catch(e => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

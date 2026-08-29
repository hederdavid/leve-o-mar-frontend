import type { Beach } from '@/types/beach'

export const mockBeaches: Beach[] = [
  {
    id: 'praia-do-espelho',
    name: 'Praia do Espelho',
    slug: 'praia-do-espelho-ba',
    city: 'Trancoso',
    state: 'Bahia',
    uf: 'BA',
    region: 'Nordeste',
    coordinates: { lat: -16.7118, lng: -39.1235 },
    waterType: 'Piscinas Naturais',
    headline: 'Onde o céu e as falésias se refletem em espelhos de água cristalina.',
    description:
      'Considerada uma das praias mais encantadoras do litoral baiano, a Praia do Espelho revela piscinas naturais de tons esmeralda durante a maré baixa, emolduradas por imponentes falésias brancas e avermelhadas e coqueirais centenários.',
    history:
      'Originalmente conhecida como Curuípe, ganhou o nome carinhoso de "Espelho" pelos pescadores locais que navegavam ao amanhecer e viam as estrelas e a lua perfeitamente espelhadas na calmaria da água rasa entre os corais.',
    curiosities: [
      'As piscinas com efeito de espelho só aparecem nas luas cheia e nova durante a maré baixa.',
      'Suas falésias de argila colorida possuem formações minerais de mais de 10 mil anos.',
      'Área de preservação marinha com corais intocados e vida marinha diversa.'
    ],
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=800&q=80'
    ],
    sensory: {
      waterColor: 'Verde Esmeralda e Turquesa Translúcido',
      sandTexture: 'Areia dourada fina intercalada com sedimentos de argila nobre',
      aromaProfile: ['Brisa de coqueirais ao sol', 'Salitre morno', 'Notas de flor de laranjeira nativa'],
      temperatureAvg: '27°C'
    },
    featured: true
  },
  {
    id: 'baia-dos-porcos',
    name: 'Baía dos Porcos',
    slug: 'baia-dos-porcos-pe',
    city: 'Fernando de Noronha',
    state: 'Pernambuco',
    uf: 'PE',
    region: 'Nordeste',
    coordinates: { lat: -3.8547, lng: -32.4431 },
    waterType: 'Mar Calmo & Cristalino',
    headline: 'O santuário de águas turquesas aos pés do icônico Morro Dois Irmãos.',
    description:
      'Uma enseada quase secreta acessível por trilha sobre pedras vulcânicas. Suas águas mansas formam piscinas de um verde-água inacreditável onde tartarugas marinhas e peixes multicoloridos nadam livremente.',
    history:
      'O nome remonta ao século XVIII, derivado do comerciante de animais da ilha e da antiga fortaleza militar. Tornou-se patrimônio mundial pela UNESCO e símbolo maior da preservação ambiental oceânica no Brasil.',
    curiosities: [
      'Possui uma das maiores visibilidades subaquáticas do planeta, atingindo até 50 metros.',
      'O arquipélago é o topo de uma cordilheira vulcânica submersa de mais de 4.000 metros de altura.'
    ],
    coverImage: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=800&q=80'
    ],
    sensory: {
      waterColor: 'Turquesa e Azul Safira Intenso',
      sandTexture: 'Pequena faixa de areia amendoada entre rochas basálticas escuras',
      aromaProfile: ['Ozônio oceânico puro', 'Algas frescas oceânicas', 'Brisa de rochas vulcânicas aquecidas'],
      temperatureAvg: '28°C'
    },
    featured: true
  },
  {
    id: 'praia-do-rosa',
    name: 'Praia do Rosa',
    slug: 'praia-do-rosa-sc',
    city: 'Imbituba',
    state: 'Santa Catarina',
    uf: 'SC',
    region: 'Sul',
    coordinates: { lat: -28.1278, lng: -48.6534 },
    waterType: 'Ondas Selvagens',
    headline: 'O refúgio místico entre lagoas de água doce e a rota das Baleias-Francas.',
    description:
      'Uma baía em formato de meia-lua cercada por morros verdes da Mata Atlântica e lagoas serenas. A praia une a vibração rústica dos pescadores tradicionais com o espírito aventureiro dos amantes da natureza.',
    history:
      'Descoberta nos anos 1970 por surfistas em busca de ondas perfeitas, a praia preservou seu traçado de ruelas sem asfalto e integração com a vila açoriana do Sr. Dorvalino Rosa, pioneiro da região.',
    curiosities: [
      'Entre julho e novembro, as Baleias-Francas amamentam seus filhotes a poucos metros da arrebentação.',
      'Possui a Lagoa do Meio, com água doce e morna no centro da enseada.'
    ],
    coverImage: 'https://images.unsplash.com/photo-1515238152791-8216bfdf89a7?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&w=800&q=80'
    ],
    sensory: {
      waterColor: 'Azul Marinho Profundo com espuma branca abundante',
      sandTexture: 'Areia clara, fofa e estaladiça aos passos',
      aromaProfile: ['Maresia vigorosa do Atlântico Sul', 'Vento frio de restinga', 'Notas herbais de mata nativa'],
      temperatureAvg: '21°C'
    },
    featured: true
  },
  {
    id: 'taipu-de-fora',
    name: 'Taipu de Fora',
    slug: 'taipu-de-fora-ba',
    city: 'Península de Maraú',
    state: 'Bahia',
    uf: 'BA',
    region: 'Nordeste',
    coordinates: { lat: -13.9482, lng: -38.9329 },
    waterType: 'Piscinas Naturais',
    headline: 'Um dos maiores recifes de corais da Costa do Dendê com piscinas bioluminescentes.',
    description:
      'Com mais de 7 km de extensão de areia banhada por fileiras infinitas de coqueiros gigantes, Taipu de Fora abriga uma piscina natural de 1 km de extensão repleta de corais e peixes neon visíveis a olho nu.',
    history:
      'Na língua tupi, "Taipu" remonta a "olho d’água" ou "monte de pedras na praia". Antigo ponto de abrigo para canoas indígenas, a vila preserva a hospitalidade calma da Bahia.',
    curiosities: [
      'As piscinas naturais possuem profundidade ideal para flutuação e snorkel noturno guiado.',
      'A península separa o oceano aberto da imensa Baía de Camamu.'
    ],
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=800&q=80'
    ],
    sensory: {
      waterColor: 'Verde Água Translúcido e Azul Anil',
      sandTexture: 'Areia dourada solta com microfragmentos de conchas marinhas',
      aromaProfile: ['Coco fresco rachado', 'Brisa de maré mansa', 'Sal mineral'],
      temperatureAvg: '28°C'
    },
    featured: true
  },
  {
    id: 'praia-dos-carneiros',
    name: 'Praia dos Carneiros',
    slug: 'praia-dos-carneiros-pe',
    city: 'Tamandaré',
    state: 'Pernambuco',
    uf: 'PE',
    region: 'Nordeste',
    coordinates: { lat: -8.7058, lng: -35.0805 },
    waterType: 'Mar Calmo & Cristalino',
    headline: 'A poesia da Capela de São Benedito banhada por águas mornas e coqueirais curvados.',
    description:
      'Onde o Rio Formoso encontra o Oceano Atlântico, criando um estuário de águas calmas e mornas com bancos de areia que surgem no meio do mar durante a maré baixa.',
    history:
      'A famosa igrejinha verde e branca foi erguida no século XVIII à beira-mar, tornando-se o cartão-postal do romance e da história colonial nordestina.',
    curiosities: [
      'Os bancos de areia formam ilhotas transitórias conhecidas como "Igrejinha de Areia".',
      'Banho de argila medicinal natural nas margens do estuário.'
    ],
    coverImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=800&q=80'
    ],
    sensory: {
      waterColor: 'Verde Piscina Cristalino',
      sandTexture: 'Areia branca finíssima e aveludada',
      aromaProfile: ['Água de coco doce', 'Manguezal limpo', 'Brisa tépida'],
      temperatureAvg: '29°C'
    },
    featured: false
  },
  {
    id: 'arpoador',
    name: 'Praia do Arpoador',
    slug: 'arpoador-rj',
    city: 'Rio de Janeiro',
    state: 'Rio de Janeiro',
    uf: 'RJ',
    region: 'Sudeste',
    coordinates: { lat: -22.9886, lng: -43.1914 },
    waterType: 'Ondas Selvagens',
    headline: 'O pôr do sol mais aplaudido do mundo sob a silhueta do Morro Dois Irmãos.',
    description:
      'A rocha lendária que divide Copacabana e Ipanema é o berço do surf brasileiro e o anfiteatro natural onde o sol mergulha no horizonte em meio a aplausos diários.',
    history:
      'Recebeu esse nome porque, nos tempos do Brasil colonial, pescadores subiam na grande pedra para arpoar baleias que passavam pela costa carioca.',
    curiosities: [
      'Tradição carioca iniciada nos anos 1960 pelo jornalista Carlos Leonam de aplaudir o solpoente.',
      'Possui iluminação noturna especial que permite o surf mesmo após o anoitecer.'
    ],
    coverImage: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=800&q=80'
    ],
    sensory: {
      waterColor: 'Azul Cobalto e Turquesa Urbano',
      sandTexture: 'Areia grossa dourada e quartzosa',
      aromaProfile: ['Salitre forte do Atlântico', 'Mate com limão gelado', 'Brisa de asfalto aquecido ao entardecer'],
      temperatureAvg: '25°C'
    },
    featured: false
  },
  {
    id: 'alter-do-chao',
    name: 'Alter do Chão (Ilha do Amor)',
    slug: 'alter-do-chao-pa',
    city: 'Santarém',
    state: 'Pará',
    uf: 'PA',
    region: 'Norte',
    coordinates: { lat: -2.5053, lng: -54.9536 },
    waterType: 'Águas Doces de Rio',
    headline: 'O Caribe Amazônico de águas doces mornas e areias brancas do Rio Tapajós.',
    description:
      'Cercada pela exuberância da Floresta Amazônica, a Ilha do Amor emerge das águas límpidas e azul-esverdeadas do Tapajós durante o verão amazônico (agosto a dezembro).',
    history:
      'Aldeia original dos índios Boraris, foi fundada como vila em 1758. É palco da tradicional festa do Sairé, ritual que mescla catolicismo colonial e cosmologia indígena dos botos.',
    curiosities: [
      'O Rio Tapajós tem mais de 15 km de largura nessa região e parece um verdadeiro oceano de água doce.',
      'As areias são ricas em sílica pura, o que confere a cor branca brilhante.'
    ],
    coverImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
    ],
    sensory: {
      waterColor: 'Verde Oliva e Azul Esmeralda de Água Doce',
      sandTexture: 'Areia branca macia como farinha fina',
      aromaProfile: ['Essência de pau-rosa e copaíba', 'Brisa de rio imenso', 'Folhagem amazônica úmida'],
      temperatureAvg: '30°C'
    },
    featured: true
  },
  {
    id: 'jericoacoara',
    name: 'Praia de Jericoacoara',
    slug: 'jericoacoara-ce',
    city: 'Jijoca de Jericoacoara',
    state: 'Ceará',
    uf: 'CE',
    region: 'Nordeste',
    coordinates: { lat: -2.7957, lng: -40.5144 },
    waterType: 'Mar Calmo & Cristalino',
    headline: 'O paraíso entre dunas gigantes, a Pedra Furada e a lagoa das redes no mar.',
    description:
      'Uma vila de pescadores onde as ruas são de areia fofa e não há postes de luz para preservar o céu estrelado. Famosa pela Duna do Pôr do Sol e suas lagoas cristalinas.',
    history:
      'Na mitologia dos pescadores, "Jericoacoara" significa "toca das tartarugas". Manteve-se isolada por séculos graças ao labirinto natural de dunas móveis.',
    curiosities: [
      'É um dos raríssimos lugares do Brasil onde o sol se põe diretamente no mar no Nordeste.',
      'A Pedra Furada é esculpida pelas ondas há milênios.'
    ],
    coverImage: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=800&q=80'
    ],
    sensory: {
      waterColor: 'Verde Turquesa Brilhante',
      sandTexture: 'Areia dourada esculpida pelo vento constante',
      aromaProfile: ['Vento alísio puro', 'Notas de caju maduro', 'Salitre seco de duna'],
      temperatureAvg: '29°C'
    },
    featured: false
  }
]

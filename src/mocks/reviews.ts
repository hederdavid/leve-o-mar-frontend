import type { Review } from '@/types/review'

export const mockReviews: Review[] = [
  {
    id: 'rev-noronha-1',
    productId: 'fernando-de-noronha',
    author: 'Carolina Mendes',
    city: 'São Paulo',
    uf: 'SP',
    rating: 5,
    title: 'A água de Noronha na minha estante!',
    comment:
      'A garrafa é uma verdadeira obra de arte. A transparência e o tom turquesa da água contra a luz do sol de manhã me transportam diretamente para a Baía dos Porcos. A rolha é muito bem selada.',
    createdAt: '12 de Fevereiro de 2026',
    isVerifiedPurchase: true,
    likesCount: 14
  },
  {
    id: 'rev-noronha-2',
    productId: 'fernando-de-noronha',
    author: 'Lucas Vasconcelos',
    city: 'Belo Horizonte',
    uf: 'MG',
    rating: 5,
    title: 'Acabamento impecável e rótulo com coordenadas',
    comment:
      'Impressionante como a cor da água foi preservada. O rótulo em papel algodão com as coordenadas exatas da enseada dá um toque de coleção único. Já encomendei a segunda!',
    createdAt: '28 de Janeiro de 2026',
    isVerifiedPurchase: true,
    likesCount: 9
  },
  {
    id: 'rev-noronha-3',
    productId: 'fernando-de-noronha',
    author: 'Beatriz Fagundes',
    city: 'Curitiba',
    uf: 'PR',
    rating: 4,
    title: 'Lindíssima, embalagem muito segura',
    comment:
      'Tinha receio do vidro quebrar no transporte, mas a caixa antiimpacto é super robusta. A garrafa chegou perfeita.',
    createdAt: '15 de Janeiro de 2026',
    isVerifiedPurchase: true,
    likesCount: 4
  },
  {
    id: 'rev-maragogi-1',
    productId: 'maragogi',
    author: 'Rafael Borges',
    city: 'Recife',
    uf: 'PE',
    rating: 5,
    title: 'Melhor presente de aniversário!',
    comment:
      'Comprei pra presentear minha mãe que é apaixonada pelas galés de Maragogi. Ela chorou de emoção. A água esmeralda dentro da garrafa é idêntica à praia!',
    createdAt: '04 de Fevereiro de 2026',
    isVerifiedPurchase: true,
    likesCount: 21
  },
  {
    id: 'rev-maragogi-2',
    productId: 'maragogi',
    author: 'Juliana Paiva',
    city: 'Brasília',
    uf: 'DF',
    rating: 5,
    title: 'Coleção indispensável pra quem ama o mar',
    comment:
      'O vidro lapidado reflete a luz de um jeito mágico na mesa de centro. Recomendo demais!',
    createdAt: '20 de Janeiro de 2026',
    isVerifiedPurchase: true,
    likesCount: 7
  },
  {
    id: 'rev-jeri-1',
    productId: 'jericoacoara',
    author: 'Gabriel Antunes',
    city: 'Fortaleza',
    uf: 'CE',
    rating: 5,
    title: 'Energia pura de Jeri',
    comment:
      'A garrafa captura perfeitamente o espírito e a calmaria das lagoas de Jeri. O rótulo artesanal é lindo demais.',
    createdAt: '08 de Fevereiro de 2026',
    isVerifiedPurchase: true,
    likesCount: 11
  },
  {
    id: 'rev-jeri-2',
    productId: 'jericoacoara',
    author: 'Mariana Duarte',
    city: 'Rio de Janeiro',
    uf: 'RJ',
    rating: 4,
    title: 'Chegou rápido e muito bem protegida',
    comment:
      'A cor da água do mar de Jericoacoara na garrafa é linda. Fica incrível na decoração.',
    createdAt: '22 de Janeiro de 2026',
    isVerifiedPurchase: true,
    likesCount: 3
  },
  {
    id: 'rev-rosa-1',
    productId: 'praia-do-rosa',
    author: 'Isabela Costa',
    city: 'Porto Alegre',
    uf: 'RS',
    rating: 5,
    title: 'Colecionei 7 garrafas já!',
    comment:
      'Minha sala ficou completamente transformada com a coleção. A garrafa do Rosa com a água do Atlântico Sul tem uma presença nobre na estante.',
    createdAt: '10 de Fevereiro de 2026',
    isVerifiedPurchase: true,
    likesCount: 18
  },
  {
    id: 'rev-alter-1',
    productId: 'alter-do-chao',
    author: 'Thiago Pinheiro',
    city: 'Manaus',
    uf: 'AM',
    rating: 5,
    title: 'A magia do Tapajós em vidro fosco',
    comment:
      'O tom esmeralda suave da água doce do Rio Tapajós é impressionante. Acabamento fosco de altíssimo padrão.',
    createdAt: '14 de Fevereiro de 2026',
    isVerifiedPurchase: true,
    likesCount: 8
  },
  {
    id: 'rev-arraial-1',
    productId: 'arraial-do-cabo',
    author: 'Fernanda Lima',
    city: 'Niterói',
    uf: 'RJ',
    rating: 5,
    title: 'O azul mais transparente do Brasil',
    comment:
      'A água de Arraial é inconfundível. Coloquei perto da janela e o reflexo do sol no vidro é deslumbrante.',
    createdAt: '02 de Fevereiro de 2026',
    isVerifiedPurchase: true,
    likesCount: 12
  }
]

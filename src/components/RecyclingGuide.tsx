import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Search, Trash2, Lightbulb, BookOpen, Leaf } from 'lucide-react';
import { recyclingGuide, curiosities } from '../lib/mockData';
import { motion } from 'motion/react';

const binColors = {
  green: { bg: '#22c55e', name: 'Verde' },
  blue: { bg: '#3b82f6', name: 'Azul' },
  yellow: { bg: '#eab308', name: 'Amarelo' },
  red: { bg: '#ef4444', name: 'Vermelho' },
  gray: { bg: '#6b7280', name: 'Cinza' }
};

export function RecyclingGuide() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(recyclingGuide.map(item => item.category)));

  const filteredGuide = recyclingGuide.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Tabs defaultValue="guide" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="guide">
          <BookOpen className="w-4 h-4 mr-2" />
          Guia
        </TabsTrigger>
        <TabsTrigger value="curiosities">
          <Lightbulb className="w-4 h-4 mr-2" />
          Curiosidades
        </TabsTrigger>
        <TabsTrigger value="tips">
          <Leaf className="w-4 h-4 mr-2" />
          Dicas
        </TabsTrigger>
      </TabsList>

      {/* GUIDE TAB */}
      <TabsContent value="guide" className="space-y-6">
        {/* Header */}
        <Card className="bg-gradient-to-r from-green-500 to-blue-600 text-white">
          <CardHeader>
            <CardTitle className="text-white">Guia de Reciclagem Interativo</CardTitle>
            <CardDescription className="text-white/90">
              Aprenda como descartar corretamente cada tipo de resíduo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar item... (ex: pilhas, garrafa, papel)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white text-gray-900"
              />
            </div>
          </CardContent>
        </Card>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          <Badge
            onClick={() => setSelectedCategory(null)}
            className={`cursor-pointer ${!selectedCategory ? 'bg-blue-600' : 'bg-gray-400'}`}
          >
            Todos
          </Badge>
          {categories.map(category => (
            <Badge
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`cursor-pointer ${selectedCategory === category ? 'bg-blue-600' : 'bg-gray-400'}`}
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* Color Legend */}
        <Card>
          <CardHeader>
            <CardTitle>Legenda de Cores</CardTitle>
            <CardDescription>Significado de cada lixeira colorida</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(binColors).map(([key, { bg, name }]) => (
                <div
                  key={key}
                  className="flex items-center gap-3 p-3 rounded-lg border-2"
                  style={{ borderColor: bg }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: bg }}
                  >
                    <Trash2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p style={{ color: bg }}>{name}</p>
                    <p className="text-xs text-gray-600">
                      {key === 'green' && 'Vidro/Orgânico'}
                      {key === 'blue' && 'Papel'}
                      {key === 'yellow' && 'Metal'}
                      {key === 'red' && 'Plástico'}
                      {key === 'gray' && 'Rejeitos'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Guide Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredGuide.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <div
                  className="h-3 rounded-t-lg"
                  style={{ backgroundColor: binColors[item.bin].bg }}
                />
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{item.name}</CardTitle>
                      <Badge variant="outline" className="mt-2">{item.category}</Badge>
                    </div>
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${binColors[item.bin].bg}20` }}
                    >
                      <Trash2 className="w-6 h-6" style={{ color: binColors[item.bin].bg }} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700 mb-4">{item.description}</p>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm">💡 Dicas:</h4>
                    <ul className="space-y-1">
                      {item.tips.map((tip, i) => (
                        <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="text-green-600 flex-shrink-0">✓</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: `${binColors[item.bin].bg}15` }}>
                    <p className="text-sm text-center">
                      <span className="mr-2">🗑️</span>
                      Lixeira: <span style={{ color: binColors[item.bin].bg }}>
                        {binColors[item.bin].name}
                      </span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredGuide.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">
                Nenhum item encontrado. Tente outro termo de busca.
              </p>
            </CardContent>
          </Card>
        )}
      </TabsContent>

      {/* CURIOSITIES TAB */}
      <TabsContent value="curiosities" className="space-y-6">
        <Card className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white">
          <CardHeader>
            <CardTitle className="text-white">Curiosidades Fascinantes sobre Reciclagem</CardTitle>
            <CardDescription className="text-white/90">
              Fatos surpreendentes que vão mudar sua visão sobre resíduos
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {curiosities.map((curiosity, index) => (
            <motion.div
              key={curiosity.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-xl transition-all">
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="text-5xl">{curiosity.icon}</div>
                    <div className="flex-1">
                      <Badge className="mb-2">{curiosity.category}</Badge>
                      <CardTitle className="text-lg">{curiosity.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{curiosity.content}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </TabsContent>

      {/* TIPS TAB */}
      <TabsContent value="tips" className="space-y-6">
        <Card className="bg-gradient-to-r from-green-500 to-teal-600 text-white">
          <CardHeader>
            <CardTitle className="text-white">Dicas Práticas de Separação</CardTitle>
            <CardDescription className="text-white/90">
              Aprenda a separar resíduos urbanos corretamente no dia a dia
            </CardDescription>
          </CardHeader>
        </Card>

        {/* General Tips */}
        <Card>
          <CardHeader>
            <CardTitle>Regras de Ouro da Reciclagem</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white flex-shrink-0">
                  1
                </div>
                <div>
                  <h4 className="text-green-800 mb-1">Limpe antes de reciclar</h4>
                  <p className="text-sm text-gray-700">
                    Lave embalagens para remover restos de comida e gordura. Material sujo contamina todo o lote de reciclagem!
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white flex-shrink-0">
                  2
                </div>
                <div>
                  <h4 className="text-blue-800 mb-1">Separe em casa</h4>
                  <p className="text-sm text-gray-700">
                    Tenha pelo menos 2 lixeiras: uma para recicláveis (secos) e outra para orgânicos (úmidos)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center text-white flex-shrink-0">
                  3
                </div>
                <div>
                  <h4 className="text-yellow-800 mb-1">Reduza o volume</h4>
                  <p className="text-sm text-gray-700">
                    Amasse garrafas PET, dobre caixas de papelão. Isso economiza espaço no armazenamento e transporte
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white flex-shrink-0">
                  4
                </div>
                <div>
                  <h4 className="text-red-800 mb-1">Cuidado com contaminação</h4>
                  <p className="text-sm text-gray-700">
                    Não misture materiais recicláveis com lixo orgânico, papel higiênico usado ou fraldas
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white flex-shrink-0">
                  5
                </div>
                <div>
                  <h4 className="text-purple-800 mb-1">Remova tampas e rótulos</h4>
                  <p className="text-sm text-gray-700">
                    Separe tampas de garrafas (geralmente são de plástico diferente) e retire rótulos quando possível
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white flex-shrink-0">
                  6
                </div>
                <div>
                  <h4 className="text-orange-800 mb-1">Conheça os símbolos</h4>
                  <p className="text-sm text-gray-700">
                    Aprenda os números e símbolos de reciclagem nas embalagens plásticas (1 a 7)
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Como Separar */}
        <Card>
          <CardHeader>
            <CardTitle>Como Separar Resíduos Urbanos em Casa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-600">
                <h4 className="text-blue-900 mb-2">🔵 Secos (Recicláveis)</h4>
                <p className="text-sm text-gray-700 mb-2">
                  Papel, papelão, plásticos, metais, vidros, embalagens longa vida
                </p>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  <li>Sempre limpos e secos</li>
                  <li>Podem ser misturados na mesma sacola/lixeira</li>
                  <li>A separação por cor será feita na cooperativa</li>
                </ul>
              </div>

              <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-600">
                <h4 className="text-green-900 mb-2">🟢 Úmidos (Orgânicos)</h4>
                <p className="text-sm text-gray-700 mb-2">
                  Restos de comida, cascas de frutas e vegetais, borra de café
                </p>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  <li>Ideal para compostagem doméstica</li>
                  <li>Se não compostar, coloque em sacola biodegradável</li>
                  <li>Não misture com papel higiênico ou fraldas</li>
                </ul>
              </div>

              {/* Nova seção sobre compostagem */}
              <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-600">
                <h4 className="text-yellow-900 mb-2">🌱 Como Funciona uma Composteira</h4>
                <p className="text-sm text-gray-700 mb-3">
                  A compostagem é um processo natural que transforma resíduos orgânicos em adubo rico em nutrientes!
                </p>
                
                <div className="space-y-3 text-sm">
                  <div>
                    <h5 className="text-yellow-800 mb-1">📦 Estrutura Básica</h5>
                    <p className="text-gray-600">
                      Uma composteira doméstica pode ser feita com 3 caixas empilhadas: 2 para digestão e 1 para chorume (líquido nutritivo)
                    </p>
                  </div>

                  <div>
                    <h5 className="text-yellow-800 mb-1">🌿 Material Verde (Nitrogênio)</h5>
                    <p className="text-gray-600">
                      Cascas de frutas, restos de vegetais, borra de café, grama. Ricos em nitrogênio, aceleram a decomposição
                    </p>
                  </div>

                  <div>
                    <h5 className="text-yellow-800 mb-1">🍂 Material Marrom (Carbono)</h5>
                    <p className="text-gray-600">
                      Folhas secas, serragem, papel picado, papelão. Ricos em carbono, dão estrutura e absorvem umidade
                    </p>
                  </div>

                  <div>
                    <h5 className="text-yellow-800 mb-1">⚖️ Proporção Ideal</h5>
                    <p className="text-gray-600">
                      50% material verde + 50% material marrom. Mantenha úmido como esponja torcida, não encharcado
                    </p>
                  </div>

                  <div>
                    <h5 className="text-yellow-800 mb-1">🦠 O Processo</h5>
                    <p className="text-gray-600">
                      Microorganismos e minhocas transformam os resíduos em 60-90 dias. O resultado é um adubo escuro e cheiroso a terra
                    </p>
                  </div>

                  <div>
                    <h5 className="text-yellow-800 mb-1">❌ Não Compostar</h5>
                    <p className="text-gray-600">
                      Carne, laticínios, óleo, fezes de animais domésticos. Estes atraem pragas e podem transmitir doenças
                    </p>
                  </div>

                  <div>
                    <h5 className="text-yellow-800 mb-1">💧 Chorume</h5>
                    <p className="text-gray-600">
                      O líquido que escorre é um biofertilizante poderoso. Dilua 1:10 em água e use em plantas
                    </p>
                  </div>

                  <div className="bg-yellow-100 p-3 rounded-md mt-2">
                    <p className="text-yellow-900">
                      💡 <strong>Dica:</strong> Composteiras domésticas reduzem até 50% do lixo produzido em casa e criam adubo grátis para suas plantas!
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-red-50 rounded-lg border-l-4 border-red-600">
                <h4 className="text-red-900 mb-2">🔴 Rejeitos (Lixo comum)</h4>
                <p className="text-sm text-gray-700 mb-2">
                  Papel higiênico, fraldas, absorventes, embalagens metalizadas
                </p>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  <li>Material que não pode ser reciclado nem compostado</li>
                  <li>Vai para aterro sanitário</li>
                  <li>Tente minimizar ao máximo esta categoria</li>
                </ul>
              </div>

              <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-600">
                <h4 className="text-orange-900 mb-2">🟠 Especiais (Logística Reversa)</h4>
                <p className="text-sm text-gray-700 mb-2">
                  Pilhas, baterias, lâmpadas, eletrônicos, óleo de cozinha, remédios
                </p>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  <li>NUNCA no lixo comum!</li>
                  <li>Leve a pontos de coleta específicos</li>
                  <li>Farmácias, supermercados e fabricantes costumam aceitar</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Passo a Passo */}
        <Card>
          <CardHeader>
            <CardTitle>Passo a Passo: Preparando Materiais para Reciclagem</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white flex-shrink-0">
                  ①
                </div>
                <div>
                  <h4 className="mb-1">Garrafas PET</h4>
                  <p className="text-sm text-gray-700">
                    Retire a tampa, remova o rótulo se possível, enxágue, amasse e coloque na lixeira de plásticos (vermelha)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white flex-shrink-0">
                  ②
                </div>
                <div>
                  <h4 className="mb-1">Latas de Alumínio</h4>
                  <p className="text-sm text-gray-700">
                    Lave para remover resíduos, amasse para economizar espaço e coloque na lixeira amarela (metais)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white flex-shrink-0">
                  ③
                </div>
                <div>
                  <h4 className="mb-1">Caixas de Papelão</h4>
                  <p className="text-sm text-gray-700">
                    Remova fitas adesivas, dobre e amasse para reduzir volume, coloque na lixeira azul (papel)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white flex-shrink-0">
                  ④
                </div>
                <div>
                  <h4 className="mb-1">Vidros</h4>
                  <p className="text-sm text-gray-700">
                    Retire tampas e rótulos, lave bem, embrulhe vidros quebrados em papel, coloque na lixeira verde
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white flex-shrink-0">
                  ⑤
                </div>
                <div>
                  <h4 className="mb-1">Embalagens Tetra Pak</h4>
                  <p className="text-sm text-gray-700">
                    Lave, abra completamente a embalagem, deixe secar e amasse. Vai na lixeira azul (papel)
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Erros Comuns */}
        <Card className="bg-red-50 border-red-200">
          <CardHeader>
            <CardTitle className="text-red-800">⚠️ Erros Comuns ao Reciclar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-red-700 mb-2">❌ NÃO FAÇA:</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Colocar papel sujo de gordura na reciclagem</li>
                  <li>• Misturar materiais muito sujos</li>
                  <li>• Colocar espelhos e cerâmica com vidro</li>
                  <li>• Jogar embalagens sem lavar</li>
                  <li>• Colocar isopor com plástico comum</li>
                  <li>• Descartar pilhas no lixo comum</li>
                </ul>
              </div>
              <div>
                <h4 className="text-green-700 mb-2">✅ FAÇA:</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Lave todas as embalagens</li>
                  <li>• Separe orgânicos de recicláveis</li>
                  <li>• Leve pilhas a pontos específicos</li>
                  <li>• Amasse e reduza volume</li>
                  <li>• Pergunte se tiver dúvida</li>
                  <li>• Ensine outras pessoas</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

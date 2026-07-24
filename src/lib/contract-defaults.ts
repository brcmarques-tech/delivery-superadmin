// KAN-256: conteudo dos contratos, extraido de
// `src/app/dashboard/contracts/page.tsx`.
//
// Os quatro contratos juridicos viviam como template strings no meio do
// componente: o arquivo tinha 751 linhas e ~65% era texto juridico, o que
// tornava a pagina dificil de ler e obrigava a mexer no .tsx para qualquer
// ajuste de redacao. Aqui ficam so os DEFAULTS (o conteudo em vigor e o que
// esta salvo no backend; isto e o fallback/valor de reset).

export type ContractType = "vendor" | "customer" | "deliverer" | "subscription";

const DEFAULT_VENDOR = `TERMOS DE USO DA PLATAFORMA — VENDEDOR
BCM TECH SHOPPING

Última atualização: Março de 2026

Estes Termos de Uso, doravante denominados "Termos", regulam o acesso e o uso da plataforma bcmTech Shopping, doravante denominada "Plataforma", operada por BCM TECH, inscrita no CNPJ sob o nº 59.858.037/0001-06, com sede na Avenida Nossa Senhora da Graça, 19, Centro, CEP 96330-000, Arroio Grande – RS, doravante denominada "Empresa".

Ao criar uma conta e utilizar a Plataforma como Vendedor, você declara ter lido, compreendido e concordado integralmente com estes Termos.

1. OBJETO

1.1. A Plataforma é um marketplace que conecta vendedores (estabelecimentos comerciais) a consumidores finais, oferecendo infraestrutura tecnológica para catalogação de produtos, recebimento de pedidos, processamento de pagamentos e logística de entrega.

1.2. A Empresa atua exclusivamente como intermediária tecnológica, não sendo parte na relação de consumo entre o Vendedor e o Cliente.

2. CADASTRO E CONTA

2.1. O Vendedor declara que todas as informações fornecidas no cadastro são verdadeiras, completas e atualizadas, sob pena de suspensão ou cancelamento da conta.

2.2. O Vendedor é integralmente responsável pela segurança de suas credenciais de acesso (login e senha).

2.3. É vedado o cadastro de menores de 18 anos ou pessoas jurídicas sem representação legal válida.

3. RESPONSABILIDADES DO VENDEDOR

3.1. O Vendedor é o único e exclusivo responsável por:

a) A qualidade, segurança, legalidade e procedência dos produtos e serviços anunciados;

b) O cumprimento de todas as obrigações previstas no Código de Defesa do Consumidor (Lei nº 8.078/1990), incluindo garantias, trocas, devoluções e atendimento ao cliente;

c) O cumprimento das normas sanitárias (ANVISA), fiscais, tributárias e regulatórias aplicáveis ao seu ramo de atividade;

d) A veracidade e precisão das informações dos produtos (descrição, preço, imagens, peso, validade);

e) A emissão de nota fiscal ou cupom fiscal conforme legislação vigente;

f) O preparo e a disponibilização dos pedidos dentro do prazo informado;

g) A resolução de quaisquer disputas, reclamações ou ações judiciais movidas por clientes.

3.2. O Vendedor isenta a Empresa de toda e qualquer responsabilidade decorrente de:

a) Produtos com defeito, avariados, contaminados, fora da validade ou em desacordo com a oferta;

b) Atrasos, erros ou falhas na entrega causados pelo próprio Vendedor ou por entregadores autônomos;

c) Descumprimento de obrigações fiscais, trabalhistas ou regulatórias;

d) Danos materiais, morais ou lucros cessantes sofridos por terceiros em razão dos produtos ou serviços do Vendedor.

4. RESPONSABILIDADES DA EMPRESA

4.1. A Empresa se compromete a:

a) Manter a Plataforma disponível e funcional, ressalvados períodos de manutenção programada ou eventos de força maior;

b) Processar os pagamentos de forma segura através de intermediadores autorizados (Pagar.me);

c) Repassar os valores devidos ao Vendedor conforme as regras do plano contratado.

4.2. A Empresa não se responsabiliza por interrupções decorrentes de falhas de terceiros, provedores de internet ou eventos de força maior (art. 393 do Código Civil).

5. ENTREGADORES AUTÔNOMOS

5.1. Os entregadores que utilizam a Plataforma são profissionais autônomos, sem qualquer vínculo empregatício com a Empresa ou com o Vendedor.

5.2. A Empresa não se responsabiliza por atos, omissões, atrasos ou danos causados pelos entregadores durante o transporte dos produtos.

6. PAGAMENTOS E COMISSÕES

6.1. A Empresa cobra comissão sobre o valor dos pedidos conforme o plano contratado pelo Vendedor.

6.2. Os pagamentos dos clientes são processados pelo Pagar.me, que atua como intermediador de pagamentos nos termos da legislação vigente.

6.3. A Empresa não se responsabiliza por estornos (chargebacks) decorrentes de fraudes ou disputas entre o Vendedor e o cliente.

7. PROPRIEDADE INTELECTUAL

7.1. Todo o conteúdo da Plataforma (código-fonte, design, marca, logotipos) é de propriedade exclusiva da Empresa, protegido pela Lei nº 9.610/1998 (Direitos Autorais) e pela Lei nº 9.279/1996 (Propriedade Industrial).

7.2. O Vendedor concede à Empresa licença não exclusiva para exibir seus produtos, logotipo e informações na Plataforma para fins de divulgação.

8. PROTEÇÃO DE DADOS (LGPD)

8.1. A Empresa trata os dados pessoais dos Usuários em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).

8.2. Os dados coletados são utilizados exclusivamente para a prestação dos serviços da Plataforma, processamento de pagamentos e comunicações necessárias.

8.3. O Vendedor se compromete a tratar os dados pessoais de seus clientes em conformidade com a LGPD, sendo responsável por eventuais violações.

8.4. O Usuário pode exercer seus direitos previstos no art. 18 da LGPD (acesso, correção, eliminação, portabilidade) mediante contato pelo e-mail bcmtechdev@gmail.com.

9. SUSPENSÃO E CANCELAMENTO

9.1. A Empresa poderá suspender ou cancelar a conta do Vendedor, a qualquer tempo e sem aviso prévio, em caso de:

a) Violação destes Termos;

b) Práticas fraudulentas, ilegais ou abusivas;

c) Reiteradas reclamações de clientes;

d) Inatividade prolongada (superior a 180 dias).

9.2. O Vendedor pode cancelar sua conta a qualquer momento, desde que não possua pedidos em andamento ou valores pendentes.

10. LIMITAÇÃO DE RESPONSABILIDADE

10.1. A responsabilidade da Empresa limita-se aos valores efetivamente recebidos como comissão nos últimos 12 meses, não respondendo por danos indiretos, lucros cessantes ou danos morais.

10.2. A Empresa não garante resultados comerciais, volume de vendas ou lucratividade ao Vendedor.

11. DISPOSIÇÕES GERAIS

11.1. Estes Termos são regidos pela legislação da República Federativa do Brasil.

11.2. Fica eleito o foro da comarca de Arroio Grande, Estado do Rio Grande do Sul, para dirimir quaisquer controvérsias, com renúncia a qualquer outro, por mais privilegiado que seja.

11.3. A Empresa reserva-se o direito de alterar estes Termos a qualquer tempo, notificando o Usuário por meio da Plataforma. O uso continuado após a alteração implica aceitação dos novos Termos.

11.4. A invalidade ou nulidade de qualquer cláusula não prejudica as demais disposições destes Termos.

12. MARCO CIVIL DA INTERNET

12.1. A Plataforma opera em conformidade com a Lei nº 12.965/2014 (Marco Civil da Internet) e o Decreto nº 8.771/2016, assegurando a neutralidade de rede, a proteção dos registros de acesso e a privacidade dos usuários.

13. COMÉRCIO ELETRÔNICO

13.1. A Plataforma cumpre as disposições do Decreto nº 7.962/2013, que regulamenta o comércio eletrônico no Brasil, fornecendo informações claras sobre os serviços, meios de contato e procedimentos para resolução de problemas.

Ao clicar em "Aceitar e Continuar", você manifesta seu consentimento livre, informado e inequívoco com todos os termos acima.`;

const DEFAULT_CUSTOMER = `TERMOS DE USO DA PLATAFORMA — CLIENTE
BCM TECH SHOPPING

Última atualização: Março de 2026

Estes Termos de Uso, doravante denominados "Termos", regulam o acesso e o uso da plataforma bcmTech Shopping, doravante denominada "Plataforma", operada por BCM TECH, inscrita no CNPJ sob o nº 59.858.037/0001-06, com sede na Avenida Nossa Senhora da Graça, 19, Centro, CEP 96330-000, Arroio Grande – RS, doravante denominada "Empresa".

Ao criar uma conta e utilizar a Plataforma como Cliente, você declara ter lido, compreendido e concordado integralmente com estes Termos.

1. OBJETO

1.1. A Plataforma é um marketplace que conecta consumidores finais a vendedores (estabelecimentos comerciais), oferecendo infraestrutura tecnológica para visualização de produtos, realização de pedidos, pagamentos e logística de entrega.

1.2. A Empresa atua exclusivamente como intermediária tecnológica. A relação de consumo é estabelecida diretamente entre o Cliente e o Vendedor responsável pelo produto adquirido.

2. CADASTRO E CONTA

2.1. O Cliente declara que todas as informações fornecidas no cadastro são verdadeiras, completas e atualizadas.

2.2. O Cliente é integralmente responsável pela segurança de suas credenciais de acesso (login e senha) e por todas as atividades realizadas em sua conta.

2.3. É vedado o cadastro de menores de 18 anos sem consentimento e supervisão dos responsáveis legais.

3. PEDIDOS E COMPRAS

3.1. Ao realizar um pedido, o Cliente se compromete a fornecer informações corretas de entrega e a estar disponível para recebimento no endereço informado.

3.2. Os produtos são de inteira responsabilidade do Vendedor. A Empresa não fabrica, armazena, embala ou manipula quaisquer produtos comercializados na Plataforma.

3.3. Em caso de problemas com o produto (defeito, divergência, atraso), o Cliente deve entrar em contato diretamente com o Vendedor responsável, que é o fornecedor nos termos do Código de Defesa do Consumidor (Lei nº 8.078/1990).

3.4. O Cliente possui todos os direitos previstos no CDC, incluindo o direito de arrependimento (art. 49) em compras realizadas fora do estabelecimento comercial, quando aplicável.

4. PAGAMENTOS

4.1. Os pagamentos são processados pelo Pagar.me, intermediador de pagamentos autorizado pelo Banco Central do Brasil.

4.2. A Empresa não armazena dados de cartão de crédito ou informações bancárias do Cliente.

4.3. Em caso de cobrança indevida, o Cliente pode solicitar estorno diretamente ao Vendedor ou ao intermediador de pagamentos.

5. ENTREGAS

5.1. As entregas podem ser realizadas pelo próprio Vendedor ou por entregadores autônomos cadastrados na Plataforma.

5.2. A Empresa não se responsabiliza por atrasos decorrentes de condições climáticas, trânsito, dificuldade de acesso ao endereço ou informações incorretas fornecidas pelo Cliente.

5.3. Os entregadores autônomos não possuem vínculo empregatício com a Empresa.

6. RESPONSABILIDADES DO CLIENTE

6.1. O Cliente se compromete a:

a) Utilizar a Plataforma de forma lícita e de boa-fé;

b) Não realizar pedidos fraudulentos ou com informações falsas;

c) Tratar vendedores e entregadores com respeito e cordialidade;

d) Verificar os produtos no ato do recebimento e comunicar eventuais problemas ao Vendedor.

6.2. O uso indevido da Plataforma, incluindo fraudes, assédio ou condutas abusivas, poderá resultar em suspensão ou cancelamento da conta, sem prejuízo das medidas legais cabíveis.

7. RESPONSABILIDADES DA EMPRESA

7.1. A Empresa se compromete a:

a) Manter a Plataforma disponível e funcional, ressalvados períodos de manutenção programada ou eventos de força maior;

b) Processar os pagamentos de forma segura através de intermediadores autorizados;

c) Disponibilizar canais de comunicação para suporte ao Cliente.

7.2. A Empresa não se responsabiliza por:

a) A qualidade, segurança ou conformidade dos produtos vendidos pelos Vendedores;

b) Atrasos, erros ou falhas na entrega causados por Vendedores ou entregadores;

c) Indisponibilidade de produtos ou alterações de preço realizadas pelos Vendedores;

d) Interrupções decorrentes de falhas de terceiros, provedores de internet ou eventos de força maior (art. 393 do Código Civil).

8. PROTEÇÃO DE DADOS (LGPD)

8.1. A Empresa trata os dados pessoais dos Clientes em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).

8.2. Os dados coletados são utilizados exclusivamente para: prestação dos serviços da Plataforma, processamento de pedidos e pagamentos, e comunicações necessárias.

8.3. O endereço de entrega é compartilhado com o Vendedor e o entregador exclusivamente para fins de entrega do pedido.

8.4. O Cliente pode exercer seus direitos previstos no art. 18 da LGPD (acesso, correção, eliminação, portabilidade) mediante contato pelo e-mail bcmtechdev@gmail.com.

8.5. Os dados não são vendidos ou compartilhados com terceiros para fins de marketing.

9. CANCELAMENTO DE CONTA

9.1. O Cliente pode cancelar sua conta a qualquer momento, desde que não possua pedidos em andamento.

9.2. Após o cancelamento, os dados pessoais serão tratados conforme a LGPD, sendo mantidos pelo prazo legal quando necessário.

10. DISPOSIÇÕES GERAIS

10.1. Estes Termos são regidos pela legislação da República Federativa do Brasil.

10.2. Fica eleito o foro da comarca de Arroio Grande, Estado do Rio Grande do Sul, para dirimir quaisquer controvérsias, com renúncia a qualquer outro, por mais privilegiado que seja, sem prejuízo do foro de domicílio do consumidor (art. 101, I, do CDC).

10.3. A Empresa reserva-se o direito de alterar estes Termos a qualquer tempo, notificando o Usuário por meio da Plataforma.

10.4. A Plataforma opera em conformidade com a Lei nº 12.965/2014 (Marco Civil da Internet) e o Decreto nº 7.962/2013 (Comércio Eletrônico).

Ao clicar em "Aceitar e Continuar", você manifesta seu consentimento livre, informado e inequívoco com todos os termos acima.`;

const DEFAULT_DELIVERER = `TERMOS DE USO DA PLATAFORMA — ENTREGADOR AUTÔNOMO
BCM TECH SHOPPING

Última atualização: Março de 2026

Estes Termos de Uso, doravante denominados "Termos", regulam o acesso e o uso da plataforma bcmTech Shopping, doravante denominada "Plataforma", operada por BCM TECH, inscrita no CNPJ sob o nº 59.858.037/0001-06, com sede na Avenida Nossa Senhora da Graça, 19, Centro, CEP 96330-000, Arroio Grande – RS, doravante denominada "Empresa".

Ao criar uma conta e utilizar a Plataforma como Entregador, você declara ter lido, compreendido e concordado integralmente com estes Termos.

1. OBJETO

1.1. A Plataforma disponibiliza infraestrutura tecnológica que conecta entregadores autônomos a vendedores e consumidores, permitindo o aceite e a realização de entregas de forma independente.

1.2. A Empresa atua exclusivamente como intermediária tecnológica, disponibilizando a ferramenta para conexão entre as partes.

2. NATUREZA DA RELAÇÃO — PRESTAÇÃO AUTÔNOMA DE SERVIÇO

2.1. O Entregador é um profissional autônomo, sem qualquer vínculo empregatício, societário ou de subordinação com a Empresa, nos termos da Lei nº 13.467/2017 (Reforma Trabalhista) e do art. 442-B da CLT.

2.2. O Entregador possui total liberdade para:

a) Aceitar ou recusar qualquer entrega oferecida pela Plataforma;

b) Definir seus próprios horários e dias de trabalho;

c) Utilizar simultaneamente outras plataformas ou prestar serviços a terceiros;

d) Interromper o uso da Plataforma a qualquer momento, sem necessidade de aviso prévio.

2.3. Não há obrigação de exclusividade, habitualidade, jornada mínima ou meta de entregas.

2.4. O Entregador é responsável por seus próprios custos operacionais, incluindo combustível, manutenção do veículo, seguros e equipamentos de proteção.

3. CADASTRO E REQUISITOS

3.1. O Entregador declara que todas as informações fornecidas no cadastro são verdadeiras e atualizadas, incluindo:

a) Dados pessoais e CPF válido;

b) Tipo de veículo e placa (quando aplicável);

c) Foto de documento de identidade.

3.2. O Entregador declara possuir Carteira Nacional de Habilitação (CNH) válida e adequada ao veículo utilizado, quando exigido por lei.

3.3. O cadastro está sujeito à aprovação pela Empresa, que poderá solicitar documentação complementar.

4. RESPONSABILIDADES DO ENTREGADOR

4.1. O Entregador é o único e exclusivo responsável por:

a) A integridade dos produtos durante o transporte, desde a retirada no Vendedor até a entrega ao Cliente;

b) O cumprimento das leis de trânsito (Código de Trânsito Brasileiro — Lei nº 9.503/1997);

c) A manutenção do veículo em condições adequadas de segurança e higiene;

d) O uso de equipamentos de proteção individual (capacete, colete, etc.);

e) O pagamento de todos os tributos, contribuições previdenciárias e obrigações fiscais decorrentes de sua atividade autônoma;

f) A contratação de seguro pessoal e do veículo, caso deseje;

g) A conduta respeitosa e profissional com Vendedores e Clientes.

4.2. O Entregador isenta a Empresa de toda e qualquer responsabilidade decorrente de:

a) Acidentes de trânsito, multas, infrações ou danos ao veículo;

b) Furto, roubo, perda ou avaria dos produtos durante o transporte;

c) Lesões corporais ou danos materiais causados a terceiros;

d) Descumprimento de obrigações fiscais, previdenciárias ou trabalhistas;

e) Qualquer reclamação, ação judicial ou administrativa movida por terceiros em razão de sua atividade.

5. REMUNERAÇÃO

5.1. O Entregador receberá o valor da entrega conforme a tabela vigente na Plataforma, que leva em consideração a distância percorrida.

5.2. Os pagamentos são processados pelo Pagar.me e transferidos diretamente para a conta cadastrada pelo Entregador.

5.3. A Empresa não é responsável por atrasos nos pagamentos decorrentes de falhas do intermediador de pagamentos ou de informações bancárias incorretas fornecidas pelo Entregador.

5.4. O Entregador é responsável pela emissão de recibos ou notas fiscais de prestação de serviço, quando aplicável.

6. SUSPENSÃO E CANCELAMENTO

6.1. A Empresa poderá suspender ou cancelar a conta do Entregador em caso de:

a) Violação destes Termos;

b) Reclamações reiteradas de Vendedores ou Clientes;

c) Condutas que comprometam a segurança, a reputação ou o funcionamento da Plataforma;

d) Informações falsas ou fraudulentas;

e) Inatividade prolongada (superior a 180 dias).

6.2. O Entregador pode encerrar sua conta a qualquer momento, desde que não possua entregas em andamento ou valores pendentes.

7. PROTEÇÃO DE DADOS (LGPD)

7.1. A Empresa trata os dados pessoais do Entregador em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).

7.2. Os dados coletados são utilizados exclusivamente para: cadastro, atribuição de entregas, processamento de pagamentos e comunicações necessárias.

7.3. O nome e a localização aproximada do Entregador podem ser compartilhados com o Vendedor e o Cliente durante uma entrega ativa, exclusivamente para fins de acompanhamento.

7.4. O Entregador pode exercer seus direitos previstos no art. 18 da LGPD mediante contato pelo e-mail bcmtechdev@gmail.com.

8. PROPRIEDADE INTELECTUAL

8.1. Todo o conteúdo da Plataforma é de propriedade exclusiva da Empresa. O Entregador não adquire qualquer direito sobre a marca, logotipo ou propriedade intelectual da Empresa.

9. DISPOSIÇÕES GERAIS

9.1. Estes Termos são regidos pela legislação da República Federativa do Brasil.

9.2. Fica eleito o foro da comarca de Arroio Grande, Estado do Rio Grande do Sul, para dirimir quaisquer controvérsias.

9.3. A Empresa reserva-se o direito de alterar estes Termos a qualquer tempo, notificando o Entregador por meio da Plataforma.

9.4. A Plataforma opera em conformidade com a Lei nº 12.965/2014 (Marco Civil da Internet).

9.5. O presente Termo não cria, nem pretende criar, qualquer vínculo empregatício entre o Entregador e a Empresa, constituindo mera relação de intermediação tecnológica para prestação de serviço autônomo.

Ao clicar em "Aceitar e Continuar", você manifesta seu consentimento livre, informado e inequívoco com todos os termos acima.`;

const DEFAULT_SUBSCRIPTION = `CONTRATO DE ASSINATURA DE PLANO — VENDEDOR
BCM TECH SHOPPING

Última atualização: Março de 2026

Este Contrato de Assinatura, doravante denominado "Contrato", regula a contratação de planos pagos na plataforma bcmTech Shopping, doravante denominada "Plataforma", operada por BCM TECH, inscrita no CNPJ sob o nº 59.858.037/0001-06, com sede na Avenida Nossa Senhora da Graça, 19, Centro, CEP 96330-000, Arroio Grande – RS, doravante denominada "Empresa".

Este Contrato é complementar e não substitui os Termos de Uso da Plataforma para Vendedor, que permanecem integralmente vigentes.

1. OBJETO

1.1. O presente Contrato tem por objeto a contratação de plano de assinatura que confere ao Vendedor funcionalidades e benefícios adicionais na Plataforma, conforme descrição de cada plano.

1.2. Os planos disponíveis e seus respectivos benefícios estão descritos na página de planos da Plataforma e podem ser atualizados periodicamente.

2. PERÍODOS DE COBRANÇA

2.1. O Vendedor pode optar pelos seguintes períodos de cobrança:

a) Mensal: cobrança a cada 30 dias;

b) Trimestral: cobrança a cada 90 dias, com desconto de 10% sobre o valor mensal;

c) Semestral: cobrança a cada 180 dias, com desconto de 20% sobre o valor mensal;

d) Anual: cobrança a cada 365 dias, com desconto de 30% sobre o valor mensal.

2.2. Para períodos trimestrais, semestrais e anuais, o Vendedor poderá parcelar o valor total no cartão de crédito em até o número de meses correspondente ao período (3x, 6x ou 12x, respectivamente), conforme disponibilidade do meio de pagamento.

3. FORMA DE PAGAMENTO

3.1. Os pagamentos são processados pelo Pagar.me, intermediador de pagamentos autorizado pelo Banco Central do Brasil.

3.2. São aceitos: cartão de crédito (à vista ou parcelado), PIX e boleto bancário, conforme disponibilidade.

3.3. O Vendedor é responsável por manter seus dados de pagamento atualizados.

4. ATIVAÇÃO E VIGÊNCIA

4.1. O plano será ativado imediatamente após a confirmação do pagamento pelo intermediador.

4.2. A vigência do plano corresponde ao período contratado (1, 3, 6 ou 12 meses), contado a partir da data de ativação.

4.3. Ao término da vigência, o plano não será renovado automaticamente. O Vendedor retornará ao plano Gratuito até que realize nova contratação.

5. CANCELAMENTO E REEMBOLSO

5.1. O Vendedor poderá solicitar o cancelamento do plano a qualquer momento.

5.2. Em caso de cancelamento dentro de 7 (sete) dias corridos a partir da contratação, o Vendedor terá direito ao reembolso integral do valor pago, nos termos do art. 49 do Código de Defesa do Consumidor (direito de arrependimento).

5.3. Após o prazo de 7 dias, não haverá reembolso proporcional. O plano permanecerá ativo até o término do período contratado.

5.4. A Empresa poderá cancelar o plano em caso de violação dos Termos de Uso, sem direito a reembolso.

6. ALTERAÇÃO DE PLANO

6.1. O Vendedor poderá fazer upgrade para um plano superior a qualquer momento, sendo cobrada a diferença proporcional.

6.2. O downgrade para um plano inferior só será efetivado ao término do período vigente.

7. ALTERAÇÃO DE PREÇOS

7.1. A Empresa reserva-se o direito de alterar os valores dos planos, notificando o Vendedor com antecedência mínima de 30 (trinta) dias.

7.2. As alterações de preço não afetam planos já contratados durante sua vigência.

8. OBRIGAÇÕES FISCAIS

8.1. A Empresa emitirá nota fiscal de serviço referente à assinatura do plano, conforme legislação tributária vigente.

8.2. O Vendedor é responsável por suas próprias obrigações fiscais decorrentes de sua atividade comercial.

9. PROTEÇÃO DE DADOS

9.1. Os dados de pagamento são processados exclusivamente pelo Pagar.me e não são armazenados pela Empresa.

9.2. O tratamento de dados pessoais segue a Política de Privacidade e a LGPD (Lei nº 13.709/2018).

10. RELAÇÃO COM OUTROS TERMOS

10.1. Este Contrato de Assinatura é complementar aos Termos de Uso da Plataforma para Vendedor. Em caso de conflito entre disposições, prevalecerão os Termos de Uso no que diz respeito à relação geral com a Plataforma, e este Contrato no que diz respeito especificamente à assinatura e pagamento de planos.

11. FORO

11.1. Este Contrato é regido pela legislação brasileira. Fica eleito o foro da comarca de Arroio Grande – RS para dirimir quaisquer controvérsias.

Ao clicar em "Aceitar e Continuar", você manifesta seu consentimento livre, informado e inequívoco com todos os termos acima, nos termos do art. 8º da LGPD e do art. 49 do CDC.`;

export const DEFAULTS: Record<ContractType, string> = {
  vendor: DEFAULT_VENDOR,
  customer: DEFAULT_CUSTOMER,
  deliverer: DEFAULT_DELIVERER,
  subscription: DEFAULT_SUBSCRIPTION,
};

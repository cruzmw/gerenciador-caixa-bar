import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Trash2, Plus, RotateCcw, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { gerarPDFFechamentoCaixa, gerarCSVFechamentoCaixa, type CaixaFechamento } from '@/lib/pdf-generator';
import { VerificadorCedulas } from '@/components/VerificadorCedulas';

/**
 * Gerenciador de Caixa - Bar
 * Design: Minimalismo Funcional com Foco em Dados
 * 
 * Estrutura:
 * - Dashboard superior com 4 cards (Abertura, Saldo, Suprimento, Retirada)
 * - Duas colunas abaixo: Entradas (verde) | Saídas (vermelho)
 * - Cálculo em tempo real: Saldo = Abertura + Entradas + Suprimento - Saídas - Retirada
 * - Persistência em localStorage
 * - Exportação em PDF e CSV ao fechar caixa
 */

interface Transacao {
  id: string;
  valor: number;
  descricao?: string;
  timestamp: number;
}

export default function Home() {
  // Estado de Abertura de Caixa
  const [caixaAberto, setCaixaAberto] = useState(false);
  const [valorAbertura, setValorAbertura] = useState('');
  const [inputAbertura, setInputAbertura] = useState('');

  // Estado das Transações
  const [entradas, setEntradas] = useState<Transacao[]>([]);
  const [saidas, setSaidas] = useState<Transacao[]>([]);
  const [suprimentos, setSuprimentos] = useState<Transacao[]>([]);
  const [retiradas, setRetiradas] = useState<Transacao[]>([]);

  // Estado dos Inputs
  const [inputEntrada, setInputEntrada] = useState('');
  const [inputSaida, setInputSaida] = useState('');
  const [descricaoSaida, setDescricaoSaida] = useState('');
  const [inputSuprimento, setInputSuprimento] = useState('');
  const [inputRetirada, setInputRetirada] = useState('');

  // Carregar dados do localStorage ao montar
  useEffect(() => {
    const dados = localStorage.getItem('caixa-data');
    if (dados) {
      try {
        const parsed = JSON.parse(dados);
        setCaixaAberto(parsed.caixaAberto);
        setValorAbertura(parsed.valorAbertura);
        setEntradas(parsed.entradas || []);
        setSaidas(parsed.saidas || []);
        setSuprimentos(parsed.suprimentos || []);
        setRetiradas(parsed.retiradas || []);
      } catch (e) {
        console.error('Erro ao carregar dados:', e);
      }
    }
  }, []);

  // Salvar dados no localStorage sempre que mudam
  useEffect(() => {
    const dados = {
      caixaAberto,
      valorAbertura,
      entradas,
      saidas,
      suprimentos,
      retiradas,
    };
    localStorage.setItem('caixa-data', JSON.stringify(dados));
  }, [caixaAberto, valorAbertura, entradas, saidas, suprimentos, retiradas]);

  // Funções de Abertura de Caixa
  const abrirCaixa = () => {
    const valor = parseFloat(inputAbertura);
    if (isNaN(valor) || valor < 0) {
      toast.error('Valor de abertura inválido');
      return;
    }
    setValorAbertura(inputAbertura);
    setCaixaAberto(true);
    setInputAbertura('');
    toast.success('Caixa aberto com sucesso!');
  };

  // Funções de Transações
  const adicionarEntrada = () => {
    const valor = parseFloat(inputEntrada);
    if (isNaN(valor) || valor <= 0) {
      toast.error('Valor de entrada inválido');
      return;
    }
    const novaEntrada: Transacao = {
      id: Date.now().toString(),
      valor,
      timestamp: Date.now(),
    };
    setEntradas([novaEntrada, ...entradas]);
    setInputEntrada('');
    toast.success(`Entrada de R$ ${valor.toFixed(2)} registrada`);
  };

  const adicionarSaida = () => {
    const valor = parseFloat(inputSaida);
    if (isNaN(valor) || valor <= 0) {
      toast.error('Valor de saída inválido');
      return;
    }
    if (!descricaoSaida.trim()) {
      toast.error('Descrição da saída é obrigatória');
      return;
    }
    const novaSaida: Transacao = {
      id: Date.now().toString(),
      valor,
      descricao: descricaoSaida,
      timestamp: Date.now(),
    };
    setSaidas([novaSaida, ...saidas]);
    setInputSaida('');
    setDescricaoSaida('');
    toast.success(`Saída de R$ ${valor.toFixed(2)} registrada`);
  };

  const adicionarSuprimento = () => {
    const valor = parseFloat(inputSuprimento);
    if (isNaN(valor) || valor <= 0) {
      toast.error('Valor de suprimento inválido');
      return;
    }
    const novoSuprimento: Transacao = {
      id: Date.now().toString(),
      valor,
      timestamp: Date.now(),
    };
    setSuprimentos([novoSuprimento, ...suprimentos]);
    setInputSuprimento('');
    toast.success(`Suprimento de R$ ${valor.toFixed(2)} adicionado`);
  };

  const adicionarRetirada = () => {
    const valor = parseFloat(inputRetirada);
    if (isNaN(valor) || valor <= 0) {
      toast.error('Valor de retirada inválido');
      return;
    }
    const novaRetirada: Transacao = {
      id: Date.now().toString(),
      valor,
      timestamp: Date.now(),
    };
    setRetiradas([novaRetirada, ...retiradas]);
    setInputRetirada('');
    toast.success(`Retirada de R$ ${valor.toFixed(2)} registrada`);
  };

  // Funções de Deleção
  const deletarEntrada = (id: string) => {
    setEntradas(entradas.filter(e => e.id !== id));
    toast.success('Entrada removida');
  };

  const deletarSaida = (id: string) => {
    setSaidas(saidas.filter(s => s.id !== id));
    toast.success('Saída removida');
  };

  const deletarSuprimento = (id: string) => {
    setSuprimentos(suprimentos.filter(s => s.id !== id));
    toast.success('Suprimento removido');
  };

  const deletarRetirada = (id: string) => {
    setRetiradas(retiradas.filter(r => r.id !== id));
    toast.success('Retirada removida');
  };

  // Cálculos
  const totalEntradas = entradas.reduce((sum, e) => sum + e.valor, 0);
  const totalSaidas = saidas.reduce((sum, s) => sum + s.valor, 0);
  const totalSuprimentos = suprimentos.reduce((sum, s) => sum + s.valor, 0);
  const totalRetiradas = retiradas.reduce((sum, r) => sum + r.valor, 0);
  
  const valorAberturaNum = parseFloat(valorAbertura) || 0;
  const saldoAtual = valorAberturaNum + totalEntradas + totalSuprimentos - totalSaidas - totalRetiradas;

  // Fechar Caixa com Exportação de PDF e Salvamento em CSV
  const fecharCaixa = async () => {
    if (confirm(`Deseja fechar o caixa com saldo de R$ ${saldoAtual.toFixed(2)}?`)) {
      try {
        // Criar objeto com dados do fechamento
        const dataHora = new Date().toLocaleString('pt-BR');
        const idFechamento = `caixa_${Date.now()}`;
        
        const dadosFechamento: CaixaFechamento = {
          id: idFechamento,
          dataHora,
          valorAbertura: valorAberturaNum,
          totalEntradas,
          totalSaidas,
          totalSuprimentos,
          totalRetiradas,
          saldoFinal: saldoAtual,
          entradas: entradas.map(e => ({ valor: e.valor, timestamp: e.timestamp })),
          saidas: saidas.map(s => ({ valor: s.valor, descricao: s.descricao || '', timestamp: s.timestamp })),
          suprimentos: suprimentos.map(s => ({ valor: s.valor, timestamp: s.timestamp })),
          retiradas: retiradas.map(r => ({ valor: r.valor, timestamp: r.timestamp })),
        };

        // Gerar PDF
        await gerarPDFFechamentoCaixa(dadosFechamento);
        toast.success('PDF gerado com sucesso!');

        // Gerar CSV e salvar em localStorage (simulando banco de dados)
        const csvData = gerarCSVFechamentoCaixa(dadosFechamento);
        const historicoCSV = localStorage.getItem('caixa-historico') || 'ID;Data/Hora;Abertura;Entradas;Saidas;Suprimentos;Retiradas;Saldo Final\n';
        const novoHistorico = historicoCSV + csvData + '\n';
        localStorage.setItem('caixa-historico', novoHistorico);
        toast.success('Dados salvos no banco de dados!');

        // Limpar dados e fechar caixa
        setCaixaAberto(false);
        setValorAbertura('');
        setEntradas([]);
        setSaidas([]);
        setSuprimentos([]);
        setRetiradas([]);
        toast.success('Caixa fechado com sucesso!');
      } catch (error) {
        console.error('Erro ao fechar caixa:', error);
        toast.error('Erro ao gerar PDF ou salvar dados');
      }
    }
  };

  // Exportar histórico CSV
  const exportarHistorico = () => {
    const historico = localStorage.getItem('caixa-historico');
    if (historico) {
      const blob = new Blob([historico], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'historico_caixa.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Histórico exportado!');
    } else {
      toast.error('Nenhum histórico disponível');
    }
  };

  // Tela de Abertura de Caixa
  if (!caixaAberto) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 border border-gray-200">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Gerenciador de Caixa</h1>
            <p className="text-gray-600">Informe o valor de abertura do caixa</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="label-text block mb-2">Valor de Abertura</label>
              <Input
                type="number"
                placeholder="0.00"
                value={inputAbertura}
                onChange={(e) => setInputAbertura(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && abrirCaixa()}
                step="0.01"
                min="0"
                className="text-lg"
              />
            </div>

            <Button
              onClick={abrirCaixa}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white"
            >
              Abrir Caixa
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Tela Principal
  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gerenciador de Caixa</h1>
          <div className="flex gap-3 flex-wrap">
            <VerificadorCedulas />
            <Button
              onClick={fecharCaixa}
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Fechar Caixa
            </Button>
            <Button
              onClick={exportarHistorico}
              variant="outline"
              className="border-blue-200 text-blue-600 hover:bg-blue-50"
            >
              <FileText className="w-4 h-4 mr-2" />
              Exportar Historico
            </Button>
          </div>
        </div>

        {/* Dashboard - 4 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Card 1: Dinheiro em Caixa */}
          <Card className="dashboard-card">
            <p className="label-text mb-3">Dinheiro em Caixa</p>
            <div className={`display-number ${saldoAtual >= 0 ? 'value-positive' : 'value-negative'}`}>
              R$ {saldoAtual.toFixed(2)}
            </div>
            <div className="flex items-center mt-2 text-xs text-gray-500">
              <span className={`status-indicator ${saldoAtual >= 0 ? 'status-positive' : 'status-negative'}`}></span>
              {saldoAtual >= 0 ? 'Positivo' : 'Negativo'}
            </div>
          </Card>

          {/* Card 2: Abertura de Caixa */}
          <Card className="dashboard-card">
            <p className="label-text mb-3">Abertura de Caixa</p>
            <div className="display-number text-gray-900">
              R$ {valorAberturaNum.toFixed(2)}
            </div>
            <p className="text-xs text-gray-500 mt-2">Valor inicial</p>
          </Card>

          {/* Card 3: Suprimento */}
          <Card className="dashboard-card">
            <p className="label-text mb-3">Suprimento Total</p>
            <div className="display-number value-positive">
              R$ {totalSuprimentos.toFixed(2)}
            </div>
            <p className="text-xs text-gray-500 mt-2">{suprimentos.length} transacao(oes)</p>
          </Card>

          {/* Card 4: Retirada */}
          <Card className="dashboard-card">
            <p className="label-text mb-3">Retirada Total</p>
            <div className="display-number value-negative">
              R$ {totalRetiradas.toFixed(2)}
            </div>
            <p className="text-xs text-gray-500 mt-2">{retiradas.length} transacao(oes)</p>
          </Card>
        </div>

        {/* Divisor */}
        <div className="border-t border-gray-200 my-8"></div>

        {/* Duas Colunas: Entradas e Saídas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Coluna 1: Entradas em Dinheiro */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <span className="w-3 h-3 bg-green-600 rounded-full mr-3"></span>
              Entradas em Dinheiro
            </h2>

            {/* Input de Entrada */}
            <div className="space-y-3 mb-6">
              <div>
                <label className="label-text block mb-2">Valor da Entrada</label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={inputEntrada}
                  onChange={(e) => setInputEntrada(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && adicionarEntrada()}
                  step="0.01"
                  min="0"
                />
              </div>
              <Button
                onClick={adicionarEntrada}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Entrada
              </Button>
            </div>

            {/* Total de Entradas */}
            <div className="dashboard-card mb-4 bg-green-50 border-green-200">
              <p className="label-text mb-2">Total de Entradas</p>
              <p className="display-number value-positive">R$ {totalEntradas.toFixed(2)}</p>
            </div>

            {/* Lista de Entradas */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {entradas.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-8">Nenhuma entrada registrada</p>
              ) : (
                entradas.map((entrada) => (
                  <div key={entrada.id} className="flex justify-between items-center p-3 bg-gray-50 rounded border border-gray-200">
                    <div>
                      <p className="font-mono text-green-600 font-semibold">R$ {entrada.valor.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(entrada.timestamp).toLocaleTimeString('pt-BR')}
                      </p>
                    </div>
                    <Button
                      onClick={() => deletarEntrada(entrada.id)}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Coluna 2: Saídas de Dinheiro */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <span className="w-3 h-3 bg-red-600 rounded-full mr-3"></span>
              Saídas de Dinheiro
            </h2>

            {/* Input de Saída */}
            <div className="space-y-3 mb-6">
              <div>
                <label className="label-text block mb-2">Valor da Saída</label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={inputSaida}
                  onChange={(e) => setInputSaida(e.target.value)}
                  step="0.01"
                  min="0"
                />
              </div>
              <div>
                <label className="label-text block mb-2">Descrição</label>
                <Input
                  type="text"
                  placeholder="Ex: Diária freelance, Compra de gelo..."
                  value={descricaoSaida}
                  onChange={(e) => setDescricaoSaida(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && adicionarSaida()}
                />
              </div>
              <Button
                onClick={adicionarSaida}
                className="w-full bg-red-600 hover:bg-red-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Saída
              </Button>
            </div>

            {/* Total de Saídas */}
            <div className="dashboard-card mb-4 bg-red-50 border-red-200">
              <p className="label-text mb-2">Total de Saídas</p>
              <p className="display-number value-negative">R$ {totalSaidas.toFixed(2)}</p>
            </div>

            {/* Lista de Saídas */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {saidas.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-8">Nenhuma saída registrada</p>
              ) : (
                saidas.map((saida) => (
                  <div key={saida.id} className="flex justify-between items-center p-3 bg-gray-50 rounded border border-gray-200">
                    <div className="flex-1">
                      <p className="font-mono text-red-600 font-semibold">R$ {saida.valor.toFixed(2)}</p>
                      <p className="text-xs text-gray-600">{saida.descricao}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(saida.timestamp).toLocaleTimeString('pt-BR')}
                      </p>
                    </div>
                    <Button
                      onClick={() => deletarSaida(saida.id)}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:bg-red-50 ml-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Divisor */}
        <div className="border-t border-gray-200 my-8"></div>

        {/* Seção de Suprimentos e Retiradas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Suprimentos */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <span className="w-3 h-3 bg-green-600 rounded-full mr-3"></span>
              Suprimento de Caixa
            </h2>

            <div className="space-y-3 mb-6">
              <div>
                <label className="label-text block mb-2">Valor do Suprimento</label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={inputSuprimento}
                  onChange={(e) => setInputSuprimento(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && adicionarSuprimento()}
                  step="0.01"
                  min="0"
                />
              </div>
              <Button
                onClick={adicionarSuprimento}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Suprimento
              </Button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {suprimentos.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-8">Nenhum suprimento registrado</p>
              ) : (
                suprimentos.map((suprimento) => (
                  <div key={suprimento.id} className="flex justify-between items-center p-3 bg-gray-50 rounded border border-gray-200">
                    <div>
                      <p className="font-mono text-green-600 font-semibold">R$ {suprimento.valor.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(suprimento.timestamp).toLocaleTimeString('pt-BR')}
                      </p>
                    </div>
                    <Button
                      onClick={() => deletarSuprimento(suprimento.id)}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Retiradas */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <span className="w-3 h-3 bg-red-600 rounded-full mr-3"></span>
              Retirada para o Financeiro
            </h2>

            <div className="space-y-3 mb-6">
              <div>
                <label className="label-text block mb-2">Valor da Retirada</label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={inputRetirada}
                  onChange={(e) => setInputRetirada(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && adicionarRetirada()}
                  step="0.01"
                  min="0"
                />
              </div>
              <Button
                onClick={adicionarRetirada}
                className="w-full bg-red-600 hover:bg-red-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Retirada
              </Button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {retiradas.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-8">Nenhuma retirada registrada</p>
              ) : (
                retiradas.map((retirada) => (
                  <div key={retirada.id} className="flex justify-between items-center p-3 bg-gray-50 rounded border border-gray-200">
                    <div>
                      <p className="font-mono text-red-600 font-semibold">R$ {retirada.valor.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(retirada.timestamp).toLocaleTimeString('pt-BR')}
                      </p>
                    </div>
                    <Button
                      onClick={() => deletarRetirada(retirada.id)}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

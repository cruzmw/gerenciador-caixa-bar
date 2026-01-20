/**
 * Gerador de PDF para Fechamento de Caixa
 * Utiliza jsPDF e html2canvas para criar relatórios em PDF
 */

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface CaixaFechamento {
  id: string;
  dataHora: string;
  valorAbertura: number;
  totalEntradas: number;
  totalSaidas: number;
  totalSuprimentos: number;
  totalRetiradas: number;
  saldoFinal: number;
  entradas: Array<{ valor: number; timestamp: number }>;
  saidas: Array<{ valor: number; descricao: string; timestamp: number }>;
  suprimentos: Array<{ valor: number; timestamp: number }>;
  retiradas: Array<{ valor: number; timestamp: number }>;
}

export async function gerarPDFFechamentoCaixa(dados: CaixaFechamento): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  // Função auxiliar para adicionar texto
  const addText = (text: string, fontSize: number = 12, bold: boolean = false, color: [number, number, number] = [0, 0, 0] as [number, number, number]) => {
    doc.setFontSize(fontSize);
    doc.setTextColor(color[0], color[1], color[2]);
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    const lines = doc.splitTextToSize(text, contentWidth);
    doc.text(lines, margin, yPosition);
    yPosition += (fontSize / 2.5) * lines.length + 2;
  };

  // Função auxiliar para adicionar linha
  const addLine = () => {
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 5;
  };

  // Função para verificar se precisa de nova página
  const checkNewPage = (minSpace: number = 30) => {
    if (yPosition + minSpace > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
    }
  };

  // Cabeçalho
  doc.setFillColor(240, 240, 240);
  doc.rect(margin, yPosition - 5, contentWidth, 20, 'F');
  addText('RELATÓRIO DE FECHAMENTO DE CAIXA', 16, true, [0, 0, 0]);
  yPosition -= 5;

  // Data e Hora
  addText(`Data e Hora: ${dados.dataHora}`, 11, false, [80, 80, 80]);
  addLine();

  // Resumo Executivo
  checkNewPage(40);
  addText('RESUMO EXECUTIVO', 13, true);

  const resumoData = [
    { label: 'Valor de Abertura', valor: dados.valorAbertura },
    { label: 'Total de Entradas', valor: dados.totalEntradas },
    { label: 'Total de Suprimentos', valor: dados.totalSuprimentos },
    { label: 'Total de Saídas', valor: dados.totalSaidas },
    { label: 'Total de Retiradas', valor: dados.totalRetiradas },
  ];

  resumoData.forEach((item) => {
    const texto = `${item.label}: R$ ${item.valor.toFixed(2)}`;
    addText(texto, 11);
  });

  // Saldo Final (destaque)
  checkNewPage(15);
  doc.setFillColor(240, 250, 240);
  doc.rect(margin, yPosition - 5, contentWidth, 15, 'F');
  const corSaldo: [number, number, number] = dados.saldoFinal >= 0 ? [16, 185, 129] : [239, 68, 68];
  addText(`SALDO FINAL: R$ ${dados.saldoFinal.toFixed(2)}`, 14, true, corSaldo);

  addLine();

  // Seção de Entradas
  checkNewPage(30);
  addText('ENTRADAS EM DINHEIRO', 12, true, [16, 185, 129]);
  
  if (dados.entradas.length === 0) {
    addText('Nenhuma entrada registrada', 10, false, [150, 150, 150]);
  } else {
    dados.entradas.forEach((entrada, index) => {
      const hora = new Date(entrada.timestamp).toLocaleTimeString('pt-BR');
      addText(`${index + 1}. R$ ${entrada.valor.toFixed(2)} - ${hora}`, 10);
    });
  }
  addText(`Total de Entradas: R$ ${dados.totalEntradas.toFixed(2)}`, 11, true);
  addLine();

  // Seção de Saídas
  checkNewPage(30);
  addText('SAÍDAS DE DINHEIRO', 12, true, [239, 68, 68]);
  
  if (dados.saidas.length === 0) {
    addText('Nenhuma saída registrada', 10, false, [150, 150, 150]);
  } else {
    dados.saidas.forEach((saida, index) => {
      const hora = new Date(saida.timestamp).toLocaleTimeString('pt-BR');
      addText(`${index + 1}. R$ ${saida.valor.toFixed(2)} - ${saida.descricao}`, 10);
      addText(`   Hora: ${hora}`, 9, false, [150, 150, 150]);
    });
  }
  addText(`Total de Saídas: R$ ${dados.totalSaidas.toFixed(2)}`, 11, true);
  addLine();

  // Seção de Suprimentos
  checkNewPage(25);
  addText('SUPRIMENTOS DE CAIXA', 12, true, [16, 185, 129]);
  
  if (dados.suprimentos.length === 0) {
    addText('Nenhum suprimento registrado', 10, false, [150, 150, 150]);
  } else {
    dados.suprimentos.forEach((suprimento, index) => {
      const hora = new Date(suprimento.timestamp).toLocaleTimeString('pt-BR');
      addText(`${index + 1}. R$ ${suprimento.valor.toFixed(2)} - ${hora}`, 10);
    });
  }
  addText(`Total de Suprimentos: R$ ${dados.totalSuprimentos.toFixed(2)}`, 11, true);
  addLine();

  // Seção de Retiradas
  checkNewPage(25);
  addText('RETIRADAS PARA FINANCEIRO', 12, true, [239, 68, 68]);
  
  if (dados.retiradas.length === 0) {
    addText('Nenhuma retirada registrada', 10, false, [150, 150, 150]);
  } else {
    dados.retiradas.forEach((retirada, index) => {
      const hora = new Date(retirada.timestamp).toLocaleTimeString('pt-BR');
      addText(`${index + 1}. R$ ${retirada.valor.toFixed(2)} - ${hora}`, 10);
    });
  }
  addText(`Total de Retiradas: R$ ${dados.totalRetiradas.toFixed(2)}`, 11, true);
  addLine();

  // Cálculo da Fórmula
  checkNewPage(25);
  addText('CÁLCULO DO SALDO', 12, true);
  addText(`Abertura + Entradas + Suprimentos - Saídas - Retiradas = Saldo Final`, 10, false, [100, 100, 100]);
  addText(`${dados.valorAbertura.toFixed(2)} + ${dados.totalEntradas.toFixed(2)} + ${dados.totalSuprimentos.toFixed(2)} - ${dados.totalSaidas.toFixed(2)} - ${dados.totalRetiradas.toFixed(2)} = ${dados.saldoFinal.toFixed(2)}`, 10, true);
  addLine();

  // Rodapé
  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.text(
    `Documento gerado automaticamente em ${new Date().toLocaleString('pt-BR')}`,
    pageWidth / 2,
    pageHeight - 10,
    { align: 'center' }
  );

  // Salvar PDF
  const nomeArquivo = `fechamento_caixa_${dados.id}.pdf`;
  doc.save(nomeArquivo);
}

/**
 * Gera uma string CSV para salvar em banco de dados
 */
export function gerarCSVFechamentoCaixa(dados: CaixaFechamento): string {
  const linhas: string[] = [];

  // Cabeçalho
  linhas.push('ID;Data/Hora;Abertura;Entradas;Saídas;Suprimentos;Retiradas;Saldo Final');

  // Dados principais
  linhas.push(
    `${dados.id};${dados.dataHora};${dados.valorAbertura.toFixed(2)};${dados.totalEntradas.toFixed(2)};${dados.totalSaidas.toFixed(2)};${dados.totalSuprimentos.toFixed(2)};${dados.totalRetiradas.toFixed(2)};${dados.saldoFinal.toFixed(2)}`
  );

  return linhas.join('\n');
}

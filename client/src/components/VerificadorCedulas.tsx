import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { DollarSign, Smartphone, RotateCcw } from 'lucide-react';

/**
 * Componente para verificação de cédulas e saldo em Pix
 * Permite contar cédulas de R$200, R$100, R$50, R$20, R$10, R$5 e R$2
 * Além de registrar saldo em Pix
 */

interface CedulasData {
  cedula200: number;
  cedula100: number;
  cedula50: number;
  cedula20: number;
  cedula10: number;
  cedula5: number;
  cedula2: number;
  saldoPix: number;
}

interface VerificadorCedulasProps {
  onSave?: (dados: CedulasData) => void;
}

export function VerificadorCedulas({ onSave }: VerificadorCedulasProps) {
  const [open, setOpen] = useState(false);
  const [cedulas, setCedulas] = useState<CedulasData>({
    cedula200: 0,
    cedula100: 0,
    cedula50: 0,
    cedula20: 0,
    cedula10: 0,
    cedula5: 0,
    cedula2: 0,
    saldoPix: 0,
  });

  // Carregar dados salvos ao abrir o modal
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      const dados = localStorage.getItem('cedulas-data');
      if (dados) {
        try {
          setCedulas(JSON.parse(dados));
        } catch (e) {
          console.error('Erro ao carregar dados de cédulas:', e);
        }
      }
    }
    setOpen(newOpen);
  };

  // Cálculos
  const totalDinheiro =
    cedulas.cedula200 * 200 +
    cedulas.cedula100 * 100 +
    cedulas.cedula50 * 50 +
    cedulas.cedula20 * 20 +
    cedulas.cedula10 * 10 +
    cedulas.cedula5 * 5 +
    cedulas.cedula2 * 2;

  const totalCedulas =
    cedulas.cedula200 +
    cedulas.cedula100 +
    cedulas.cedula50 +
    cedulas.cedula20 +
    cedulas.cedula10 +
    cedulas.cedula5 +
    cedulas.cedula2;

  const totalGeral = totalDinheiro + cedulas.saldoPix;

  // Atualizar quantidade de cédula
  const atualizarCedula = (tipo: keyof CedulasData, valor: number) => {
    const novoValor = Math.max(0, valor);
    setCedulas((prev) => ({
      ...prev,
      [tipo]: novoValor,
    }));
  };

  // Salvar dados
  const salvarDados = () => {
    localStorage.setItem('cedulas-data', JSON.stringify(cedulas));
    if (onSave) {
      onSave(cedulas);
    }
    setOpen(false);
  };

  // Resetar dados
  const resetarDados = () => {
    if (confirm('Deseja limpar todos os dados de cédulas?')) {
      setCedulas({
        cedula200: 0,
        cedula100: 0,
        cedula50: 0,
        cedula20: 0,
        cedula10: 0,
        cedula5: 0,
        cedula2: 0,
        saldoPix: 0,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-green-200 text-green-600 hover:bg-green-50">
          <DollarSign className="w-4 h-4 mr-2" />
          Conferir Cédulas
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Verificador de Cédulas e Pix</DialogTitle>
          <DialogDescription>
            Conte as cédulas disponíveis no caixa e registre o saldo em Pix
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Seção de Cédulas */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-green-600" />
              Cédulas em Dinheiro
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* R$ 200 */}
              <Card className="p-4 border-gray-200">
                <label className="label-text block mb-2">R$ 200,00</label>
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    min="0"
                    value={cedulas.cedula200}
                    onChange={(e) => atualizarCedula('cedula200', parseInt(e.target.value) || 0)}
                    className="flex-1"
                  />
                  <span className="text-sm font-semibold text-gray-600 whitespace-nowrap">
                    = R$ {(cedulas.cedula200 * 200).toFixed(2)}
                  </span>
                </div>
              </Card>

              {/* R$ 100 */}
              <Card className="p-4 border-gray-200">
                <label className="label-text block mb-2">R$ 100,00</label>
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    min="0"
                    value={cedulas.cedula100}
                    onChange={(e) => atualizarCedula('cedula100', parseInt(e.target.value) || 0)}
                    className="flex-1"
                  />
                  <span className="text-sm font-semibold text-gray-600 whitespace-nowrap">
                    = R$ {(cedulas.cedula100 * 100).toFixed(2)}
                  </span>
                </div>
              </Card>

              {/* R$ 50 */}
              <Card className="p-4 border-gray-200">
                <label className="label-text block mb-2">R$ 50,00</label>
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    min="0"
                    value={cedulas.cedula50}
                    onChange={(e) => atualizarCedula('cedula50', parseInt(e.target.value) || 0)}
                    className="flex-1"
                  />
                  <span className="text-sm font-semibold text-gray-600 whitespace-nowrap">
                    = R$ {(cedulas.cedula50 * 50).toFixed(2)}
                  </span>
                </div>
              </Card>

              {/* R$ 20 */}
              <Card className="p-4 border-gray-200">
                <label className="label-text block mb-2">R$ 20,00</label>
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    min="0"
                    value={cedulas.cedula20}
                    onChange={(e) => atualizarCedula('cedula20', parseInt(e.target.value) || 0)}
                    className="flex-1"
                  />
                  <span className="text-sm font-semibold text-gray-600 whitespace-nowrap">
                    = R$ {(cedulas.cedula20 * 20).toFixed(2)}
                  </span>
                </div>
              </Card>

              {/* R$ 10 */}
              <Card className="p-4 border-gray-200">
                <label className="label-text block mb-2">R$ 10,00</label>
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    min="0"
                    value={cedulas.cedula10}
                    onChange={(e) => atualizarCedula('cedula10', parseInt(e.target.value) || 0)}
                    className="flex-1"
                  />
                  <span className="text-sm font-semibold text-gray-600 whitespace-nowrap">
                    = R$ {(cedulas.cedula10 * 10).toFixed(2)}
                  </span>
                </div>
              </Card>

              {/* R$ 5 */}
              <Card className="p-4 border-gray-200">
                <label className="label-text block mb-2">R$ 5,00</label>
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    min="0"
                    value={cedulas.cedula5}
                    onChange={(e) => atualizarCedula('cedula5', parseInt(e.target.value) || 0)}
                    className="flex-1"
                  />
                  <span className="text-sm font-semibold text-gray-600 whitespace-nowrap">
                    = R$ {(cedulas.cedula5 * 5).toFixed(2)}
                  </span>
                </div>
              </Card>

              {/* R$ 2 */}
              <Card className="p-4 border-gray-200">
                <label className="label-text block mb-2">R$ 2,00</label>
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    min="0"
                    value={cedulas.cedula2}
                    onChange={(e) => atualizarCedula('cedula2', parseInt(e.target.value) || 0)}
                    className="flex-1"
                  />
                  <span className="text-sm font-semibold text-gray-600 whitespace-nowrap">
                    = R$ {(cedulas.cedula2 * 2).toFixed(2)}
                  </span>
                </div>
              </Card>
            </div>

            {/* Resumo de Dinheiro */}
            <Card className="mt-4 p-4 bg-green-50 border-green-200">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="label-text mb-1">Total de Cédulas</p>
                  <p className="text-2xl font-bold text-gray-900">{totalCedulas}</p>
                </div>
                <div>
                  <p className="label-text mb-1">Total em Dinheiro</p>
                  <p className="text-2xl font-bold text-green-600">R$ {totalDinheiro.toFixed(2)}</p>
                </div>
                <div>
                  <p className="label-text mb-1">Saldo em Pix</p>
                  <p className="text-2xl font-bold text-blue-600">R$ {cedulas.saldoPix.toFixed(2)}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Seção de Pix */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Smartphone className="w-5 h-5 mr-2 text-blue-600" />
              Saldo em Pix
            </h3>

            <Card className="p-4 border-gray-200">
              <label className="label-text block mb-3">Saldo Total em Pix</label>
              <div className="flex items-center gap-3">
                <span className="text-lg font-semibold text-gray-600">R$</span>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={cedulas.saldoPix}
                  onChange={(e) => atualizarCedula('saldoPix', parseFloat(e.target.value) || 0)}
                  step="0.01"
                  min="0"
                  className="flex-1 text-lg"
                />
              </div>
            </Card>
          </div>

          {/* Resumo Geral */}
          <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50 border-gray-300">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo Geral</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="label-text mb-2">Dinheiro Físico</p>
                <p className="text-3xl font-bold text-green-600">R$ {totalDinheiro.toFixed(2)}</p>
              </div>
              <div className="text-center">
                <p className="label-text mb-2">Saldo Pix</p>
                <p className="text-3xl font-bold text-blue-600">R$ {cedulas.saldoPix.toFixed(2)}</p>
              </div>
              <div className="text-center">
                <p className="label-text mb-2">Total Geral</p>
                <p className="text-3xl font-bold text-purple-600">R$ {totalGeral.toFixed(2)}</p>
              </div>
            </div>
          </Card>

          {/* Botões de Ação */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={resetarDados}
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50 flex-1"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Limpar Dados
            </Button>
            <Button
              onClick={salvarDados}
              className="bg-green-600 hover:bg-green-700 text-white flex-1"
            >
              Salvar Conferência
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

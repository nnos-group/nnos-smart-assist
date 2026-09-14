import React, { useState } from "react";
import {
  Sparkles, ArrowRight, ArrowLeft, AlertTriangle, Check,
  Plus, X, ShieldAlert, Layers, HelpCircle, Info
} from "lucide-react";
import { useSalesJourney } from "@/context/SalesJourneyContext";
import { AccessoryRecommendation, RecommendationTier } from "@/types/salesJourney";
import { RecommendationReasonCard } from "./RecommendationReasonCard";

export const RecommendationReviewScreen: React.FC = () => {
  const {
    state,
    availableAccessories,
    toggleAccessory,
    removeAccessory,
    addAccessory,
    changeAccessoryTier,
    nextStep,
    prevStep,
  } = useSalesJourney();

  const { recommendations, selectedAccessoryIds, clientData, discoveryProfile } = state;

  // Estado para o alerta de remoção de item essencial
  const [essentialRemovalTarget, setEssentialRemovalTarget] = useState<AccessoryRecommendation | null>(null);
  const [removalReason, setRemovalReason] = useState<string>("cliente_nao_deseja");
  const [customRemovalText, setCustomRemovalText] = useState("");
  const [addCatalogModalOpen, setAddCatalogModalOpen] = useState(false);
  const [catalogSearch, setCatalogSearch] = useState("");

  const essentialItems = recommendations.filter((r) => r.tier === "essential");
  const recommendedItems = recommendations.filter((r) => r.tier === "recommended");
  const complementaryItems = recommendations.filter((r) => r.tier === "complementary");

  const handleInitiateRemove = (rec: AccessoryRecommendation) => {
    if (rec.tier === "essential") {
      setEssentialRemovalTarget(rec);
    } else {
      removeAccessory(rec.accessoryId, "Removido pelo consultor");
    }
  };

  const handleConfirmEssentialRemoval = () => {
    if (!essentialRemovalTarget) return;
    const finalReason = removalReason === "outro" ? customRemovalText : removalReason;
    removeAccessory(essentialRemovalTarget.accessoryId, finalReason);
    setEssentialRemovalTarget(null);
    setRemovalReason("cliente_nao_deseja");
    setCustomRemovalText("");
  };

  const unrecommendedAvailable = availableAccessories.filter(
    (acc) => !recommendations.some((r) => r.accessoryId === acc.id)
  );

  const filteredCatalogItems = unrecommendedAvailable.filter((acc) =>
    acc.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
    acc.description.toLowerCase().includes(catalogSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* HEADER DE ETAPA */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-bold mb-2 border border-sky-200/60">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            <span>Etapa 2 de 7 · Seleção Consultiva Inteligente</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-display">
            Recomendar acessórios
          </h1>
          <p className="text-sm text-slate-600 font-medium mt-1">
            Soluções selecionadas pela inteligência da plataforma e validadas pelo consultor.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setAddCatalogModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar do Catálogo</span>
          </button>
        </div>
      </div>

      {/* BANNER DE SÍNTESE DA INTELIGÊNCIA ARTIFICIAL (Cockpit Style) */}
      <div className="cockpit-panel rounded-2xl p-6 border border-sky-100 bg-gradient-to-b from-sky-50/40 via-white to-white space-y-4 shadow-card text-slate-900 animate-in fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center shadow-xs shrink-0 text-sky-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-700">Inteligência Preditiva Concluída</span>
                <span className="text-[10px] bg-sky-50 text-sky-800 border border-sky-200 px-2 py-0.5 rounded-full font-bold">
                  Proposta Calibrada para {clientData.vehicleModel}
                </span>
              </div>
              <h2 className="text-base font-bold text-slate-900 mt-0.5">
                {essentialItems.some((r) => r.hasExplicitDemandMatch)
                  ? `Priorização Automática de Demanda: ${essentialItems.filter((r) => r.hasExplicitDemandMatch).map((r) => r.accessory.name).join(", ")}`
                  : `Configuração Consultiva Otimizada para ${clientData.clientName || "Cliente"}`}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700">
            <span>Score Preditivo Médio:</span>
            <span className="text-sky-600 font-extrabold">
              {Math.round(recommendations.reduce((sum, r) => sum + r.matchScore, 0) / (recommendations.length || 1))}%
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          {discoveryProfile.specialNeeds.length > 0 ? (
            <>
              💡 <strong className="text-slate-900">Critério da IA:</strong> As necessidades diretas declaradas de{" "}
              <span className="text-slate-900 font-bold">
                {discoveryProfile.specialNeeds.map((s) => s.replace("_", " ")).join(", ")}
              </span>{" "}
              foram correlacionadas aos acessórios homologados Mopar com máxima prioridade de proteção, segurança e usabilidade na rotina do veículo.
            </>
          ) : (
            <>
              💡 <strong className="text-slate-900">Critério da IA:</strong> Acelerado para uso frequente em{" "}
              <span className="text-sky-700 font-bold">{discoveryProfile.usageLocation.replace("_", " ")}</span> e terreno com{" "}
              <span className="text-sky-700 font-bold">{discoveryProfile.dirtRoadFrequency !== "nunca" ? "estradas de terra" : "rodovias"}</span>.
            </>
          )}
        </p>
      </div>

      {/* AVISO CONSULTIVO IMPORTANTE: SEM PREÇOS NESTA ETAPA */}
      <div className="bg-amber-500/10 border border-amber-400/40 rounded-xl p-3 sm:p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs text-amber-900 font-medium">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-amber-700 shrink-0" />
          <span className="leading-snug">
            <strong>Foco nos benefícios técnicos:</strong> os valores e condições comerciais são apresentados exclusivamente a partir da Etapa 5.
          </span>
        </div>
        <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-md self-start sm:self-auto shrink-0 whitespace-nowrap">
          {selectedAccessoryIds.length} selecionados
        </span>
      </div>

      {/* SEÇÃO 1: ITENS ESSENCIAIS (Até 3 itens) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse" />
            <h2 className="text-base font-bold text-slate-900 font-display">Itens Essenciais (Até 3 itens)</h2>
          </div>
          <span className="text-xs text-slate-500">Fundamentais para proteção mecânica e rotina de uso</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {essentialItems.map((rec) => (
            <RecommendationReasonCard
              key={rec.accessoryId}
              recommendation={rec}
              isSelected={selectedAccessoryIds.includes(rec.accessoryId)}
              onToggle={() => toggleAccessory(rec.accessoryId)}
              onRemoveRequest={() => handleInitiateRemove(rec)}
              onChangeTier={(tier) => changeAccessoryTier(rec.accessoryId, tier)}
            />
          ))}
          {essentialItems.length === 0 && (
            <div className="col-span-full p-6 text-center text-xs text-slate-500 bg-white rounded-xl border border-dashed border-slate-300">
              Nenhum item classificado como essencial para este perfil.
            </div>
          )}
        </div>
      </div>

      {/* SEÇÃO 2: ITENS RECOMENDADOS (Até 3 itens) */}
      <div className="space-y-3 pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-600" />
            <h2 className="text-base font-bold text-slate-900 font-display">Itens Recomendados (Até 3 itens)</h2>
          </div>
          <span className="text-xs text-slate-500">Aumentam o conforto, usabilidade diária e ergonomia</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendedItems.map((rec) => (
            <RecommendationReasonCard
              key={rec.accessoryId}
              recommendation={rec}
              isSelected={selectedAccessoryIds.includes(rec.accessoryId)}
              onToggle={() => toggleAccessory(rec.accessoryId)}
              onRemoveRequest={() => handleInitiateRemove(rec)}
              onChangeTier={(tier) => changeAccessoryTier(rec.accessoryId, tier)}
            />
          ))}
          {recommendedItems.length === 0 && (
            <div className="col-span-full p-6 text-center text-xs text-slate-500 bg-white rounded-xl border border-dashed border-slate-300">
              Nenhum item recomendado secundário.
            </div>
          )}
        </div>
      </div>

      {/* SEÇÃO 3: ITENS COMPLEMENTARES (Até 2 itens) */}
      <div className="space-y-3 pt-4 border-t border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              <h2 className="text-base font-bold text-slate-900 font-display">Itens Complementares (Até 2 itens)</h2>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                {complementaryItems.length}/2 itens
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Estética, acabamento e personalização de alto padrão recomendados ou selecionados pelo consultor.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setAddCatalogModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-200 cursor-pointer self-start sm:self-auto transition-all"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-600" />
            <span>Adicionar / Trocar Complementar</span>
          </button>
        </div>

        {/* FONTE DE INFORMAÇÃO DOS ITENS COMPLEMENTARES */}
        <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-xl p-3 flex items-start gap-2 text-xs text-emerald-900">
          <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong>Fonte de Informação:</strong> Catálogo Oficial Mopar homologado para{" "}
            <strong>{clientData.vehicleModel}</strong>. A IA pré-seleciona até 2 itens de valorização estética, conveniência ou proteção de acabamento que completam o kit funcional sem sobrecarregar a proposta. O consultor tem total liberdade para substituir ou adicionar itens do catálogo.
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {complementaryItems.map((rec) => (
            <RecommendationReasonCard
              key={rec.accessoryId}
              recommendation={rec}
              isSelected={selectedAccessoryIds.includes(rec.accessoryId)}
              onToggle={() => toggleAccessory(rec.accessoryId)}
              onRemoveRequest={() => handleInitiateRemove(rec)}
              onChangeTier={(tier) => changeAccessoryTier(rec.accessoryId, tier)}
            />
          ))}
          {complementaryItems.length === 0 && (
            <div className="col-span-full p-6 text-center text-xs text-slate-500 bg-white rounded-xl border border-dashed border-slate-300 space-y-2">
              <p>Nenhum item complementar configurado no momento.</p>
              <button
                type="button"
                onClick={() => setAddCatalogModalOpen(true)}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 cursor-pointer"
              >
                + Escolher Item do Catálogo Mopar
              </button>
            </div>
          )}
        </div>
      </div>

      {/* NAVEGAÇÃO ENTRE ETAPAS (Cockpit Style) */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-200">
        <button
          type="button"
          onClick={prevStep}
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para Entender o Cliente</span>
        </button>

        <button
          type="button"
          onClick={nextStep}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0077E6] hover:bg-[#0066CC] text-white font-bold text-xs tracking-tight transition-all shadow-glow-blue cursor-pointer active:scale-95"
        >
          <span>Avançar para Ver no Veículo</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* MODAL DE ALERTA: REMOÇÃO DE ITEM ESSENCIAL (POSICIONADO NO TOPO DA TELA) */}
      {essentialRemovalTarget && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-start justify-center pt-6 sm:pt-12 px-4 pb-6 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-rose-200 animate-in slide-in-from-top-4 duration-200">
            <div className="flex items-center gap-2.5 text-rose-600 font-bold text-sm pb-3 border-b border-rose-100">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              <span>Atenção: Remoção de Item Classificado como Essencial</span>
            </div>

            <div className="bg-rose-50 p-3.5 rounded-xl border border-rose-200/80 text-xs text-rose-900 leading-relaxed">
              <p className="font-semibold mb-1">
                “Este item foi classificado como essencial devido ao perfil declarado de utilização em estradas de terra ou transporte de carga.”
              </p>
              <p className="text-[11px] text-rose-700">
                Item: <strong>{essentialRemovalTarget.accessory.name}</strong>
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="select-removal-reason">
                Justificativa obrigatória da remoção:
              </label>
              <select
                id="select-removal-reason"
                value={removalReason}
                onChange={(e) => setRemovalReason(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 bg-slate-50 focus:ring-2 focus:ring-rose-500/20"
              >
                <option value="cliente_ja_possui">Cliente já possui o item instalado</option>
                <option value="cliente_nao_deseja">Cliente informou expressamente que não deseja</option>
                <option value="incompatibilidade_identificada">Incompatibilidade identificada em vistoria</option>
                <option value="indisponibilidade">Indisponibilidade temporária de estoque</option>
                <option value="substituicao_outro_produto">Substituição por outro acessório da linha</option>
                <option value="outro">Outro motivo (descrever abaixo)</option>
              </select>
            </div>

            {removalReason === "outro" && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="input-custom-removal-text">Descreva o motivo:</label>
                <input
                  id="input-custom-removal-text"
                  type="text"
                  value={customRemovalText}
                  onChange={(e) => setCustomRemovalText(e.target.value)}
                  placeholder="Explique o motivo da retirada..."
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800"
                />
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEssentialRemovalTarget(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Manter no Pacote
              </button>
              <button
                type="button"
                onClick={handleConfirmEssentialRemoval}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Confirmar Remoção
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL PARA ADICIONAR ACESSÓRIOS DO CATÁLOGO COMPLETO (NO TOPO DA TELA) */}
      {addCatalogModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-start justify-center pt-4 sm:pt-8 px-4 pb-6 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 animate-in slide-in-from-top-4 duration-200 p-5 sm:p-6 flex flex-col max-h-[88vh]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-slate-900">Catálogo Completo Mopar — {clientData.vehicleModel}</h2>
                  <span className="text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200 px-2 py-0.5 rounded-full">
                    {filteredCatalogItems.length} disponíveis
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Selecione qualquer acessório homologado para adicionar como complementar ou ao pacote
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setAddCatalogModalOpen(false);
                  setCatalogSearch("");
                }}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-lg text-sm font-bold cursor-pointer transition"
                aria-label="Fechar modal"
              >
                ✕
              </button>
            </div>

            {/* Campo de Busca no Catálogo */}
            <div className="pt-2 pb-1 shrink-0">
              <input
                type="text"
                value={catalogSearch}
                onChange={(e) => setCatalogSearch(e.target.value)}
                placeholder="Buscar por nome ou descrição (ex: soleira, engate, rack, tapete)..."
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 placeholder:text-slate-400 bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                autoFocus
              />
            </div>

            {/* Lista com scroll independente no corpo do modal */}
            <div className="overflow-y-auto space-y-2 pr-1 pt-1 flex-1">
              {filteredCatalogItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300 transition-all shadow-2xs"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-3">
                    <span className="text-2xl shrink-0">{item.icon}</span>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 truncate">{item.name}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1">{item.description}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-semibold text-slate-600 bg-slate-200/70 px-2 py-0.5 rounded">
                          {(item.category || 'acessório').toUpperCase()}
                        </span>
                        <span className="text-[10px] text-emerald-700 font-medium">
                          Homologação Stellantis • 3 anos de garantia
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      addAccessory(item.id, "complementary");
                      setAddCatalogModalOpen(false);
                      setCatalogSearch("");
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-sky-600 text-white text-xs font-bold hover:bg-sky-700 cursor-pointer shrink-0 shadow-xs transition"
                  >
                    + Adicionar
                  </button>
                </div>
              ))}
              {filteredCatalogItems.length === 0 && (
                <div className="text-center p-8 text-xs text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  {catalogSearch
                    ? `Nenhum acessório encontrado para "${catalogSearch}".`
                    : "Todos os acessórios homologados deste modelo já foram adicionados."}
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end shrink-0">
              <button
                type="button"
                onClick={() => {
                  setAddCatalogModalOpen(false);
                  setCatalogSearch("");
                }}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Concluir Seleção
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Módulo de Segurança e Proteção Anti-Inspeção (DevTools Protection)
 *
 * Bloqueia atalhos de teclado do desenvolvedor (F12, Ctrl+Shift+I, etc.),
 * menu de contexto de clique direito (Inspecionar elemento) e view-source.
 */

export function initSecurityProtection() {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return;
  }

  // 1. Bloqueio de Teclas de Atalho do DevTools e Inspeção
  window.addEventListener(
    "keydown",
    (e: KeyboardEvent) => {
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;
      const isShift = e.shiftKey;
      const key = e.key ? e.key.toUpperCase() : "";
      const keyCode = e.keyCode || e.which;

      // F12
      if (key === "F12" || keyCode === 123) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl + Shift + I (DevTools Inspect)
      // Ctrl + Shift + J (Console)
      // Ctrl + Shift + C (Element Selector)
      if (isCtrlOrCmd && isShift && (key === "I" || key === "J" || key === "C")) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl + U (View Source / Código Fonte)
      if (isCtrlOrCmd && key === "U") {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl + S (Salvar Página)
      if (isCtrlOrCmd && key === "S") {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    },
    { capture: true }
  );

  // 2. Bloqueio de Botão Direito (Menu de Contexto / Inspecionar)
  document.addEventListener(
    "contextmenu",
    (e: MouseEvent) => {
      e.preventDefault();
      return false;
    },
    { capture: true }
  );

  // 3. Aviso Corporativo de Segurança no Console
  if (typeof console !== "undefined") {
    try {
      console.log(
        "%cSEGURANÇA CORPORATIVA • SMART-SELL",
        "color: #0284c7; font-size: 18px; font-weight: bold; padding: 4px;"
      );
      console.log(
        "%cAmbiente de uso restrito a consultores da concessionária autorizada. Tentativas de depuração e engenharia reversa são bloqueadas por política de conformidade.",
        "font-size: 12px; color: #64748b;"
      );
    } catch {
      // Silencioso caso console esteja protegido
    }
  }

  // 4. Anti-Debugger Trap em Produção
  if (import.meta.env?.PROD) {
    setInterval(() => {
      // Bloqueia a execução se DevTools for aberto pelo menu do navegador
      const before = Date.now();
      // eslint-disable-next-line no-debugger
      debugger;
      const after = Date.now();
      if (after - before > 100) {
        // DevTools aberto e pausado no debugger
        document.body.innerHTML = "<div style='display:flex;height:100vh;align-items:center;justify-content:center;font-family:sans-serif;background:#001E36;color:white;font-size:20px;font-weight:bold;'>Acesso de depuração não autorizado. Feche as ferramentas de desenvolvedor e recarregue a página.</div>";
      }
    }, 1500);
  }
}

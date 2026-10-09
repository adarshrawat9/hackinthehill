/* ==========================================================================
   BAYORA SOC MAIN APP CONTROLLER & ROUTER
   ========================================================================== */

class BayoraApp {
  constructor() {
    this.activePage = 'overview';
  }

  async init() {
    // 1. Initialize Crypto Ledger Genesis Block
    await window.bayoraLedger.initGenesisBlock();

    // 2. Render Top Bar & Status Strip
    renderTopBar();
    renderStatusStrip();

    // 3. Start UTC Clock Updates
    setInterval(updateUTCClock, 1000);
    updateUTCClock();

    // 4. Handle Navigation Hash
    window.addEventListener('hashchange', () => this.handleHashChange());
    if (window.location.hash) {
      const pageFromHash = window.location.hash.substring(1);
      if (['overview', 'isolationMap', 'telemetry', 'auditLedger', 'riskMatrix', 'threatModel'].includes(pageFromHash)) {
        this.activePage = pageFromHash;
      }
    }

    // 5. Render Left Rail & Active Page
    this.navigate(this.activePage);

    // 6. Start WebSocket Event Simulator
    window.bayoraSocket.start();
  }

  handleHashChange() {
    const pageFromHash = window.location.hash.substring(1);
    if (pageFromHash && pageFromHash !== this.activePage) {
      this.navigate(pageFromHash);
    }
  }

  navigate(pageId) {
    this.activePage = pageId;
    window.location.hash = `#${pageId}`;

    // Render Navigation Rail
    renderLeftRail(this.activePage, (newPage) => this.navigate(newPage));

    // Render Main Content View
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    mainContent.innerHTML = '';

    switch (pageId) {
      case 'overview':
        renderOverviewPage(mainContent);
        break;
      case 'isolationMap':
        renderIsolationMapPage(mainContent);
        break;
      case 'telemetry':
        renderTelemetryPage(mainContent);
        break;
      case 'auditLedger':
        renderAuditLedgerPage(mainContent);
        break;
      case 'riskMatrix':
        renderRiskMatrixPage(mainContent);
        break;
      case 'threatModel':
        renderThreatModelPage(mainContent);
        break;
      default:
        renderOverviewPage(mainContent);
        break;
    }
  }
}

function bootBayoraApp() {
  if (!window.bayoraApp) {
    window.bayoraApp = new BayoraApp();
    window.bayoraApp.init();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootBayoraApp);
} else {
  bootBayoraApp();
}

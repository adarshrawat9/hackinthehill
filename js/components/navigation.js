/* ==========================================================================
   NAVIGATION, TOP BAR, LEFT RAIL & APP SHELL COMPONENTS
   ========================================================================== */

function renderTopBar() {
  const topBar = document.getElementById('top-bar');
  if (!topBar) return;

  topBar.innerHTML = `
    <div id="top-bar-glow"></div>
    <!-- Logo with Mountain Ridge Glyph -->
    <div style="display:flex; align-items:center; gap:12px; position:relative; z-index:2;">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Baseline: Lichen -->
        <line x1="2" y1="20" x2="22" y2="20" stroke="#C5E063" stroke-width="2" stroke-linecap="round"/>
        <!-- Left Peak: Vermilion -->
        <path d="M3 20L7 12L11 20" stroke="#FF5A36" stroke-width="2" stroke-linejoin="round"/>
        <!-- Tall Center Peak: Saffron -->
        <path d="M7 20L13 6L19 20" stroke="#F4B73F" stroke-width="2" stroke-linejoin="round"/>
        <!-- Right Peak: Glacier -->
        <path d="M15 20L19 14L22 20" stroke="#7FC8DC" stroke-width="2" stroke-linejoin="round"/>
      </svg>
      <div style="font-family: var(--font-display); font-size: 20px; font-weight: 800; letter-spacing: -0.01em; color: var(--text-primary);">
        Bay<span style="color: var(--saffron);">o</span>ra <span style="font-size: 11px; font-weight: 600; font-family: var(--font-body); letter-spacing: 0.16em; text-transform: uppercase; color: var(--text-muted); margin-left: 6px;">SOC ENGINE v2</span>
      </div>
    </div>

    <!-- Center Status -->
    <div style="display:flex; align-items:center; gap:16px; position:relative; z-index:2;">
      <div class="chip chip-lichen">
        <span class="live-dot"></span> RUNNING (ISOLATED)
      </div>
    </div>

    <!-- Right Controls: Clock, mTLS & Operator -->
    <div style="display:flex; align-items:center; gap:16px; position:relative; z-index:2;">
      <div style="font-family: var(--font-mono); font-size: 12px; color: var(--text-secondary);" id="utc-clock">
        00:00:00 UTC
      </div>
      <div style="display:flex; align-items:center; gap:6px; font-family: var(--font-mono); font-size: 11px; color: var(--lichen);">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
        mTLS STRICT
      </div>
      <div style="width: 30px; height: 30px; background: var(--bg-raised); border: 1px solid var(--border-strong); border-radius: 2px; display:flex; align-items:center; justify-content:center; font-family: var(--font-mono); font-size: 11px; font-weight: 600; color: var(--saffron);" title="Operator Avatar">
        OP1
      </div>
    </div>
  `;
}

function updateUTCClock() {
  const clockEl = document.getElementById('utc-clock');
  if (clockEl) {
    const now = new Date();
    clockEl.textContent = `${now.toISOString().substring(11, 19)} UTC`;
  }
}

function renderLeftRail(activePage, onNavigate) {
  const leftRail = document.getElementById('left-rail');
  if (!leftRail) return;

  const items = [
    { id: 'overview', label: 'Overview', icon: 'layout-dashboard' },
    { id: 'isolationMap', label: 'Isolation Map', icon: 'network' },
    { id: 'telemetry', label: 'Live Telemetry', icon: 'activity' },
    { id: 'auditLedger', label: 'Audit Ledger', icon: 'link' },
    { id: 'riskMatrix', label: 'Risk Matrix', icon: 'grid-3x3' },
    { id: 'threatModel', label: 'Threat Model', icon: 'shield-alert' }
  ];

  leftRail.innerHTML = `
    <div style="padding: 16px 20px 8px; border-bottom: 1px solid var(--border-hair);" class="eyebrow-label">
      NAVIGATION
    </div>
    <div style="flex:1; padding-top: 8px;">
      ${items.map(item => `
        <a class="nav-item ${activePage === item.id ? 'active' : ''}" data-page="${item.id}">
          <span style="display:inline-flex; width: 20px; justify-content:center;">
            ${getIconSVG(item.icon)}
          </span>
          <span style="font-weight: 500;">${item.label}</span>
        </a>
      `).join('')}
    </div>
    <div style="padding: 12px; border-top: 1px solid var(--border-hair);">
      <button id="rail-toggle-btn" class="btn btn-ghost" style="width:100%; justify-content: flex-start;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
        <span>Collapse Rail</span>
      </button>
    </div>
  `;

  // Attach nav listeners
  leftRail.querySelectorAll('.nav-item').forEach(el => {
    el.addEventListener('click', (e) => {
      const page = el.getAttribute('data-page');
      onNavigate(page);
    });
  });

  document.getElementById('rail-toggle-btn')?.addEventListener('click', () => {
    leftRail.classList.toggle('collapsed');
  });
}

function renderStatusStrip() {
  const statusStrip = document.getElementById('status-strip');
  if (!statusStrip) return;

  statusStrip.innerHTML = `
    <div style="display:flex; align-items:center; gap:16px; position:relative; z-index:3;">
      <span style="display:flex; align-items:center; gap:6px;">
        <span class="live-dot" style="width:6px; height:6px;"></span>
        <span style="color: var(--text-secondary);">WS STATE:</span> <span style="color: var(--lichen);">CONNECTED (300ms stream)</span>
      </span>
      <span>|</span>
      <span><span style="color: var(--text-secondary);">BROKER LATENCY:</span> <span style="color: var(--bone);" id="strip-latency">48.2 ms (timing-normalized)</span></span>
    </div>

    <div style="display:flex; align-items:center; gap:16px; position:relative; z-index:3;">
      <span><span style="color: var(--text-secondary);">LEDGER HEIGHT:</span> <span style="color: var(--lichen);" id="strip-block">#18234</span></span>
      <span>|</span>
      <span><span style="color: var(--text-secondary);">LAST HASH:</span> <span style="color: var(--saffron);" id="strip-hash">a3f9c2...7e1d</span></span>
    </div>
  `;
}

function getIconSVG(name) {
  const icons = {
    'layout-dashboard': `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>`,
    'network': `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="9" y="2" width="6" height="6"/><rect x="2" y="16" width="6" height="6"/><rect x="16" y="16" width="6" height="6"/><path d="M12 8v4M5 16v-2a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v2"/></svg>`,
    'activity': `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
    'link': `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
    'grid-3x3': `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>`,
    'shield-alert': `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`
  };
  return icons[name] || icons['layout-dashboard'];
}

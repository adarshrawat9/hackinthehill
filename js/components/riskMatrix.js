/* ==========================================================================
   PAGE: RISK MATRIX (5x5 GRID, THREAT MARKERS, GUARANTEE CONDITIONS)
   ========================================================================== */

function renderRiskMatrixPage(container) {
  container.innerHTML = `
    <!-- Header -->
    <div style="margin-bottom: 20px; display:flex; align-items:center; justify-content:space-between;">
      <div>
        <div class="display-title">
          Risk <span style="color: var(--text-secondary); font-style: italic;">Matrix</span>
        </div>
        <div style="color: var(--text-secondary); margin-top: 4px;">
          Quantitative 5x5 Likelihood vs Impact threat surface quantification & residual security guarantees
        </div>
      </div>
      <div style="display:flex; gap:8px;">
        <span class="chip chip-bone" style="background: #1E3A33; color:#fff;">L1 NEGLIGIBLE</span>
        <span class="chip chip-bone" style="background: #3F7F73; color:#fff;">L2 LOW</span>
        <span class="chip chip-bone" style="background: #F4B73F; color:#000;">L3 MODERATE</span>
        <span class="chip chip-bone" style="background: #FF7A3D; color:#000;">L4 HIGH</span>
        <span class="chip chip-bone" style="background: #FF3D81; color:#fff;">L5 CRITICAL</span>
      </div>
    </div>

    <!-- Main Grid Layout: 5x5 Grid (Left Span 7) & Risk Detail Panel (Right Span 5) -->
    <div class="grid-12">
      <!-- Left Column: 5x5 Heatmap Grid -->
      <div class="col-7 card card-tick">
        <div class="card-header">
          <div class="panel-title">
            <span class="peak-marker fuchsia"></span> Threat Surface Heatmap (Likelihood Y-Axis x Impact X-Axis)
          </div>
          <span class="chip chip-fuchsia">5 EVALUATED RISKS</span>
        </div>

        <div style="display:flex; margin-top: 12px;">
          <!-- Y-Axis Label -->
          <div style="writing-mode: vertical-lr; transform: rotate(180deg); text-align:center; font-family: var(--font-body); font-size: 11px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; color: var(--text-muted); margin-right: 12px;">
            LIKELIHOOD (HIGH ↑ LOW)
          </div>

          <!-- 5x5 Grid Table Container -->
          <div style="flex:1;">
            <div class="risk-grid" id="full-risk-grid" style="grid-template-rows: repeat(5, 1fr); min-height: 400px;">
              <!-- Cells generated dynamically -->
            </div>

            <!-- X-Axis Label -->
            <div style="text-align:center; font-family: var(--font-body); font-size: 11px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; color: var(--text-muted); margin-top: 12px;">
              IMPACT (LOW → CRITICAL)
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Selected Threat Mitigation Panel -->
      <div class="col-5 card card-tick card-hero">
        <div class="card-header">
          <div class="panel-title">
            <span class="peak-marker saffron"></span> Mitigation & Residual Risk Breakdown
          </div>
        </div>

        <div id="risk-detail-panel" style="display:flex; flex-direction:column; gap:16px;">
          <div style="background: var(--bg-inset); border: 1px solid var(--border-hair); padding: 16px; border-radius: 4px;">
            <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 8px;">
              👈 Click any cell or peak triangle marker on the 5x5 risk grid to inspect threat mitigations and security failure conditions.
            </div>
          </div>

          <!-- Protections vs Non-Protections Summary -->
          <div style="background: var(--bg-inset); border: 1px solid var(--border-hair); padding: 16px; border-radius: 4px;">
            <div class="eyebrow-label" style="color: var(--lichen); margin-bottom: 8px;">PROTECTS AGAINST</div>
            <ul style="color: var(--text-secondary); font-size: 12px; padding-left: 16px; margin-bottom: 16px; line-height: 18px;">
              <li>Cross-tenant prompt payload leakage prior to trial completion</li>
              <li>Blue-team classifier reverse-engineering by Red-Team tooling</li>
              <li>Target LLM KV-cache context contamination between sessions</li>
              <li>Post-hoc audit trail tampering (SHA-256 Merkle chain enforcement)</li>
            </ul>

            <div class="eyebrow-label" style="color: var(--fuchsia); margin-bottom: 8px;">DOES NOT PROTECTED AGAINST</div>
            <ul style="color: var(--text-secondary); font-size: 12px; padding-left: 16px; line-height: 18px;">
              <li>Linux zero-day kernel breakouts (requires hardware enclave extension)</li>
              <li>Physical hardware memory bus side-channel probing (Rowhammer/Spectre v2)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `;

  // Build full 5x5 grid
  const gridEl = document.getElementById('full-risk-grid');
  if (gridEl) {
    for (let r = 5; r >= 1; r--) {
      for (let c = 1; c <= 5; c++) {
        const item = window.BAYORA_CONFIG.riskItems.find(x => x.row === r && x.col === c);
        const level = item ? item.level : (r + c <= 4 ? 1 : (r + c <= 6 ? 2 : (r + c <= 8 ? 3 : 4)));
        const cell = document.createElement('div');
        cell.className = `risk-cell risk-level-${level}`;
        cell.innerHTML = `
          <div style="font-family: var(--font-mono); font-size: 10px; font-weight: 600;">L${r}I${c}</div>
          ${item ? `
            <div style="margin-top: 4px;">
              <span class="peak-marker ${item.actor}"></span>
              <span style="font-size: 11px; font-weight: bold;">${item.id}</span>
            </div>
            <div style="font-size: 10px; opacity: 0.9; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${item.name}</div>
          ` : ''}
        `;

        if (item) {
          cell.addEventListener('click', () => showRiskDetail(item));
        }

        gridEl.appendChild(cell);
      }
    }
  }
}

function showRiskDetail(item) {
  const panel = document.getElementById('risk-detail-panel');
  if (!panel) return;

  const actorColor = item.actor === 'vermilion' ? 'var(--vermilion)' : (item.actor === 'glacier' ? 'var(--glacier)' : (item.actor === 'saffron' ? 'var(--saffron)' : 'var(--lichen)'));

  panel.innerHTML = `
    <div style="background: var(--bg-inset); border: 1px solid ${actorColor}; padding: 16px; border-radius: 4px; box-shadow: 0 0 16px rgba(0,0,0,0.5);">
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom: 8px;">
        <div style="font-family: var(--font-display); font-size: 16px; font-weight: 700; color: ${actorColor};">
          <span class="peak-marker ${item.actor}"></span> ${item.id}: ${item.name}
        </div>
        <span class="chip chip-${item.actor}">LEVEL ${item.level}</span>
      </div>

      <div style="font-family: var(--font-mono); font-size: 11px; color: var(--text-muted); margin-bottom: 12px;">
        Likelihood: <span style="color: var(--text-primary);">${item.likelihood}</span> | Impact: <span style="color: var(--text-primary);">${item.impact}</span>
      </div>

      <div style="margin-bottom: 12px;">
        <div class="eyebrow-label" style="margin-bottom: 4px;">PRIMARY MITIGATION CONTROL</div>
        <div style="font-size: 12px; color: var(--text-secondary); line-height: 18px;">
          ${item.mitigations}
        </div>
      </div>

      <div style="margin-bottom: 12px;">
        <div class="eyebrow-label" style="margin-bottom: 4px;">RESIDUAL RISK ASSESSMENT</div>
        <div style="font-size: 12px; color: var(--lichen); font-weight: 600;">
          ${item.residual}
        </div>
      </div>

      <div style="background: var(--fuchsia-dim); border: 1px solid var(--fuchsia); padding: 10px; border-radius: 2px;">
        <div class="eyebrow-label" style="color: var(--fuchsia); margin-bottom: 4px;">GUARANTEE FAILS IF...</div>
        <div style="font-size: 11px; color: var(--text-primary); font-family: var(--font-mono);">
          ${item.failsIf}
        </div>
      </div>
    </div>
  `;
}

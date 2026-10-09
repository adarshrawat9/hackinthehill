/* ==========================================================================
   PAGE: LIVE TELEMETRY (3 TERMINAL COLUMNS, REDACTION REVEAL, CHARTS)
   ========================================================================== */

function renderTelemetryPage(container) {
  container.innerHTML = `
    <!-- Header -->
    <div style="margin-bottom: 20px; display:flex; align-items:center; justify-content:space-between;">
      <div>
        <div class="display-title">
          Live <span style="color: var(--text-secondary); font-style: italic;">Telemetry</span>
        </div>
        <div style="color: var(--text-secondary); margin-top: 4px;">
          Real-time terminal execution logs across Red Team, Blue Team, and Target LLM workloads
        </div>
      </div>
      <div style="display:flex; gap:12px;">
        <button class="btn btn-secondary" id="reveal-toggle-btn">
          👁 Reveal Redacted Payloads (Auditor Only)
        </button>
      </div>
    </div>

    <!-- 3 Terminal Columns -->
    <div class="grid-12" style="margin-bottom: 24px;">
      <!-- Column 1: Red-Team Terminal -->
      <div class="col-4 card card-tick" style="border-top: 2px solid var(--vermilion); padding: 0;">
        <div class="terminal-header" style="background: var(--bg-raised);">
          <span style="font-weight:700; color: var(--vermilion);"><span class="peak-marker vermilion"></span> RED-TEAM ATTACK STREAM</span>
          <span class="chip chip-vermilion">BLIND MODE</span>
        </div>
        <div class="terminal-body" id="term-red-body" style="height: 380px;">
          <!-- Log lines injected dynamically -->
        </div>
      </div>

      <!-- Column 2: Blue-Team Terminal -->
      <div class="col-4 card card-tick" style="border-top: 2px solid var(--glacier); padding: 0;">
        <div class="terminal-header" style="background: var(--bg-raised);">
          <span style="font-weight:700; color: var(--glacier);"><span class="peak-marker glacier"></span> BLUE-TEAM DEFENSE STREAM</span>
          <span class="chip chip-glacier">FILTER ACTIVE</span>
        </div>
        <div class="terminal-body" id="term-blue-body" style="height: 380px;">
          <!-- Log lines injected dynamically -->
        </div>
      </div>

      <!-- Column 3: Target LLM Terminal -->
      <div class="col-4 card card-tick" style="border-top: 2px solid var(--saffron); padding: 0;">
        <div class="terminal-header" style="background: var(--bg-raised);">
          <span style="font-weight:700; color: var(--saffron);"><span class="peak-marker saffron"></span> TARGET LLM INFERENCE</span>
          <span class="chip chip-saffron">STATELESS</span>
        </div>
        <div class="terminal-body" id="term-target-body" style="height: 380px;">
          <!-- Log lines injected dynamically -->
        </div>
      </div>
    </div>

    <!-- Analytics Charts Row -->
    <div class="grid-12">
      <!-- Chart 1: Latency per Tenant (Raw vs Normalized) -->
      <div class="col-6 card card-tick">
        <div class="card-header">
          <div class="panel-title">
            <span class="peak-marker bone"></span> Broker Latency Normalization (Raw Jitter vs 50ms Flat)
          </div>
          <span class="chip chip-bone">TIMING DEFENSE</span>
        </div>
        <div style="height: 220px; position:relative; background: var(--bg-inset); border: 1px solid var(--border-hair); border-radius: 4px; padding: 12px;">
          <canvas id="latency-canvas" width="450" height="200"></canvas>
        </div>
      </div>

      <!-- Chart 2: Resource Fairness -->
      <div class="col-6 card card-tick">
        <div class="card-header">
          <div class="panel-title">
            <span class="peak-marker lichen"></span> Resource Fairness & Cgroups Allocation (CPU / Mem / IO)
          </div>
          <span class="chip chip-lichen">BALANCED</span>
        </div>
        <div style="height: 220px; position:relative; background: var(--bg-inset); border: 1px solid var(--border-hair); border-radius: 4px; padding: 16px; display:flex; flex-direction:column; justify-content:space-around;">
          <div>
            <div style="display:flex; justify-content:space-between; font-family: var(--font-mono); font-size: 11px; margin-bottom: 4px;">
              <span>RED SUBNET CPU (33.2%)</span> <span style="color: var(--vermilion);">2.0 Cores</span>
            </div>
            <div style="background: var(--bg-base); height: 10px; border-radius: 2px; overflow:hidden;">
              <div style="width: 33.2%; height:100%; background: var(--vermilion);"></div>
            </div>
          </div>

          <div>
            <div style="display:flex; justify-content:space-between; font-family: var(--font-mono); font-size: 11px; margin-bottom: 4px;">
              <span>BLUE SUBNET CPU (33.5%)</span> <span style="color: var(--glacier);">2.0 Cores</span>
            </div>
            <div style="background: var(--bg-base); height: 10px; border-radius: 2px; overflow:hidden;">
              <div style="width: 33.5%; height:100%; background: var(--glacier);"></div>
            </div>
          </div>

          <div>
            <div style="display:flex; justify-content:space-between; font-family: var(--font-mono); font-size: 11px; margin-bottom: 4px;">
              <span>LLM ENGINE GPU (33.3%)</span> <span style="color: var(--saffron);">8.0 vCores</span>
            </div>
            <div style="background: var(--bg-base); height: 10px; border-radius: 2px; overflow:hidden;">
              <div style="width: 33.3%; height:100%; background: var(--saffron);"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal for Auditor Payload Reveal Confirmation -->
    <div id="reveal-modal" class="modal-backdrop">
      <div class="modal-content">
        <div style="font-family: var(--font-display); font-size: 18px; font-weight: 800; color: var(--fuchsia); margin-bottom: 12px;">
          ⚠ AUDITOR CONFIRMATION REQUIRED
        </div>
        <div style="color: var(--text-secondary); margin-bottom: 20px;">
          Revealing Red-Team attack payloads overrides blind mode. All reveal actions are permanently signed into the SHA-256 Forensic Audit Ledger.
        </div>
        <div style="display:flex; justify-content:flex-end; gap:12px;">
          <button class="btn btn-secondary" id="modal-cancel-btn">Cancel</button>
          <button class="btn btn-danger" id="modal-confirm-btn">Confirm Reveal & Log Audit Event</button>
        </div>
      </div>
    </div>
  `;

  // Attach modal listeners
  const revealBtn = document.getElementById('reveal-toggle-btn');
  const modal = document.getElementById('reveal-modal');
  const cancelBtn = document.getElementById('modal-cancel-btn');
  const confirmBtn = document.getElementById('modal-confirm-btn');

  let isRevealed = false;

  revealBtn?.addEventListener('click', () => {
    if (!isRevealed) {
      modal?.classList.add('active');
    } else {
      isRevealed = false;
      revealBtn.textContent = '👁 Reveal Redacted Payloads (Auditor Only)';
      revealBtn.className = 'btn btn-secondary';
    }
  });

  cancelBtn?.addEventListener('click', () => modal?.classList.remove('active'));

  confirmBtn?.addEventListener('click', () => {
    isRevealed = true;
    modal?.classList.remove('active');
    revealBtn.textContent = '🔓 Payloads Unmasked (Auditor Mode)';
    revealBtn.className = 'btn btn-primary';

    // Unmask existing red log lines (A10 decode animation)
    const redTerm = document.getElementById('term-red-body');
    if (redTerm) {
      redTerm.querySelectorAll('.log-line').forEach(line => {
        const textSpan = line.querySelector('.payload-text');
        if (textSpan && textSpan.getAttribute('data-raw')) {
          textSpan.textContent = textSpan.getAttribute('data-raw');
          textSpan.style.color = 'var(--vermilion)';
        }
      });
    }

    // Log auditor override event to ledger
    window.bayoraSocket.generateEvent();
  });

  // Render Latency Canvas
  const canvas = document.getElementById('latency-canvas');
  if (canvas) {
    drawLatencyChart(canvas);
  }

  // Subscribe to live telemetry feed updates (using key 'telemetry')
  window.bayoraSocket.onEvent('telemetry', (evt, block) => {
    const redTerm = document.getElementById('term-red-body');
    const blueTerm = document.getElementById('term-blue-body');
    const targetTerm = document.getElementById('term-target-body');

    const timeStr = evt.ts.substring(11, 23);
    const payloadDisplay = isRevealed ? evt.payload_text : evt.payload_redacted;

    if (redTerm) {
      const redLine = document.createElement('div');
      redLine.className = 'log-line';
      redLine.innerHTML = `<span style="color: var(--text-muted);">[${timeStr}]</span> <span style="color: var(--vermilion); font-weight:bold;">[RED]</span> <span class="payload-text" data-raw="${evt.payload_text}" style="color: var(--text-primary);">${payloadDisplay}</span> <span style="color: var(--text-muted); font-size:10px;">hash:${evt.hash.substring(0, 8)}</span>`;
      redTerm.prepend(redLine);
      if (redTerm.children.length > 50) redTerm.removeChild(redTerm.lastChild);
    }

    if (blueTerm) {
      const blueLine = document.createElement('div');
      blueLine.className = 'log-line';
      blueLine.innerHTML = `<span style="color: var(--text-muted);">[${timeStr}]</span> <span style="color: var(--glacier); font-weight:bold;">[BLUE]</span> <span style="color: var(--text-primary);">${evt.defense_rule} → ${evt.defense_action}</span>`;
      blueTerm.prepend(blueLine);
      if (blueTerm.children.length > 50) blueTerm.removeChild(blueTerm.lastChild);
    }

    if (targetTerm) {
      const targetLine = document.createElement('div');
      targetLine.className = 'log-line';
      targetLine.innerHTML = `<span style="color: var(--text-muted);">[${timeStr}]</span> <span style="color: var(--saffron); font-weight:bold;">[TARGET]</span> <span style="color: var(--text-primary);">Stateless Eval Complete | KV-Flush 0.0ms</span>`;
      targetTerm.prepend(targetLine);
      if (targetTerm.children.length > 50) targetTerm.removeChild(targetTerm.lastChild);
    }

    // Redraw latency chart live
    if (canvas) {
      drawLatencyChart(canvas);
    }
  });
}

function drawLatencyChart(canvas) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);

  // Gridlines
  ctx.strokeStyle = '#24312B';
  ctx.lineWidth = 1;

  for (let y = 30; y < h; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  // Draw Raw Jittery Line (Vermilion)
  ctx.strokeStyle = '#FF5A36';
  ctx.lineWidth = 1.5;
  ctx.beginPath();

  for (let x = 0; x < w; x += 15) {
    const jitterY = 120 + (Math.sin(x * 0.1) * 30) + (Math.cos(x * 0.25) * 20);
    if (x === 0) ctx.moveTo(x, jitterY);
    else ctx.lineTo(x, jitterY);
  }
  ctx.stroke();

  // Draw Normalized Flat 50ms Line (Lichen)
  ctx.strokeStyle = '#C5E063';
  ctx.lineWidth = 2;
  ctx.beginPath();

  for (let x = 0; x < w; x += 15) {
    const normY = 100 + (Math.sin(x * 0.05) * 2);
    if (x === 0) ctx.moveTo(x, normY);
    else ctx.lineTo(x, normY);
  }
  ctx.stroke();
}

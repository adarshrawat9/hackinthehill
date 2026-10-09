/* ==========================================================================
   PAGE: THREAT MODEL (FORMAL SECURITY ARCHITECTURE SPECIFICATION)
   ========================================================================== */

function renderThreatModelPage(container) {
  const data = window.BAYORA_CONFIG.threatModelData;

  container.innerHTML = `
    <!-- Header -->
    <div style="margin-bottom: 20px;">
      <div class="display-title">
        Threat <span style="color: var(--text-secondary); font-style: italic;">Model</span> & Security Architecture
      </div>
      <div style="color: var(--text-secondary); margin-top: 4px;">
        Formal classification of system assets, adversary capabilities, trust boundaries, and verified security controls
      </div>
    </div>

    <!-- Section 1: Protected Assets Table -->
    <div class="card card-tick" style="margin-bottom: 20px;">
      <div class="card-header">
        <div class="panel-title">
          <span class="peak-marker vermilion"></span> 1. System Assets & Sensitivity Classification
        </div>
        <span class="chip chip-vermilion">ASSETS</span>
      </div>

      <table class="data-table">
        <thead>
          <tr>
            <th>Asset Description</th>
            <th>Asset Owner</th>
            <th>Sensitivity</th>
            <th>Isolation Boundary</th>
          </tr>
        </thead>
        <tbody>
          ${data.assets.map(a => `
            <tr>
              <td><span style="font-weight:600; color: var(--text-primary);">${a.asset}</span></td>
              <td>${a.owner}</td>
              <td><span class="chip ${a.sensitivity === 'Critical' ? 'chip-fuchsia' : 'chip-saffron'}">${a.sensitivity}</span></td>
              <td><code>${a.boundary}</code></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <!-- Section 2: Adversary Capabilities Table -->
    <div class="card card-tick" style="margin-bottom: 20px;">
      <div class="card-header">
        <div class="panel-title">
          <span class="peak-marker glacier"></span> 2. Threat Actors & Adversary Profiles
        </div>
        <span class="chip chip-glacier">ADVERSARIES</span>
      </div>

      <table class="data-table">
        <thead>
          <tr>
            <th>Adversary Profile</th>
            <th>Attack Objective</th>
            <th>Assumed Capabilities</th>
          </tr>
        </thead>
        <tbody>
          ${data.adversaries.map(ad => `
            <tr>
              <td><span style="font-weight:600; color: var(--glacier);">${ad.adversary}</span></td>
              <td>${ad.goal}</td>
              <td><code>${ad.capability}</code></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <!-- Section 3: Verified Security Protections Table -->
    <div class="card card-tick" style="margin-bottom: 20px;">
      <div class="card-header">
        <div class="panel-title">
          <span class="peak-marker lichen"></span> 3. Implemented Technical Security Controls
        </div>
        <span class="chip chip-lichen">PROTECTIONS</span>
      </div>

      <table class="data-table">
        <thead>
          <tr>
            <th>Security Capability</th>
            <th>Technical Enforcement Mechanism</th>
          </tr>
        </thead>
        <tbody>
          ${data.protections.map(p => `
            <tr>
              <td><span style="font-weight:600; color: var(--lichen);">${p.capability}</span></td>
              <td><code>${p.mechanism}</code></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <!-- Section 4: Future Work Roadmap -->
    <div class="card card-tick">
      <div class="card-header">
        <div class="panel-title">
          <span class="peak-marker bone"></span> 4. Hardening Roadmap & Future Work
        </div>
        <span class="chip chip-bone">ROADMAP</span>
      </div>
      <div style="font-size: 12px; color: var(--text-secondary); line-height: 20px;">
        <p style="margin-bottom: 8px;">• <strong>Hardware Enclave Integration</strong>: Port Zero-Trust Broker into AWS Nitro Enclaves / AMD SEV for hardware memory encryption.</p>
        <p style="margin-bottom: 8px;">• <strong>eBPF Runtime Network Audit</strong>: Deploy Cilium / eBPF kernel probes for zero-overhead packet inspection across subnets.</p>
        <p>• <strong>Formal Verification</strong>: Formally prove seccomp syscall filter invariants using SMT solvers.</p>
      </div>
    </div>
  `;
}

/* ═══════════════════════════════════════════════════════════
   MapLeads — script.js
   Lead generation logic, view switching, CSV export
═══════════════════════════════════════════════════════════ */

'use strict';

// ─── CONSTANTS & STATE ───────────────────────────────────────
const FREE_LIMIT = 20;
let allLeads  = [];
let usedLeads = 0;

// ─── MOCK LEAD DATABASE ──────────────────────────────────────
const MOCK = {
  Restaurants: [
    { name: "Tony's Pizza Co.",   phone: '(512) 555-0198', email: 'hello@tonyspizza.com',   website: 'tonyspizza.com',   rating: 4.6, reviews: 142 },
    { name: 'The Burger Lab',     phone: '(512) 555-0231', email: 'orders@burgerlab.com',   website: 'burgerlab.com',    rating: 4.4, reviews: 89  },
    { name: 'Fresh Bowl Cafe',    phone: '(512) 555-0076', email: null,                      website: null,               rating: 4.1, reviews: 34  },
    { name: 'Metro Bistro LLC',   phone: '(512) 555-0312', email: 'info@metrobistro.com',   website: 'metrobistro.com',  rating: 4.8, reviews: 211 },
    { name: 'Urban Tacos Group',  phone: '(512) 555-0445', email: 'hi@urbantacos.io',       website: 'urbantacos.io',    rating: 4.3, reviews: 67  },
  ],
  Plumbers: [
    { name: 'Prime Plumbing Co.',  phone: '(713) 555-0144', email: 'service@primeplumbing.com', website: 'primeplumbing.com', rating: 4.9, reviews: 67 },
    { name: 'Elite Pipes LLC',     phone: '(713) 555-0289', email: null,                         website: null,               rating: 4.5, reviews: 43 },
    { name: 'Central Flow Group',  phone: '(713) 555-0321', email: 'jobs@centralflow.com',       website: 'centralflow.com',  rating: 4.7, reviews: 91 },
  ],
  Dentists: [
    { name: 'Downtown Dental Studio', phone: '(310) 555-0167', email: 'schedule@dtstudio.com',   website: 'dtstudio.com',    rating: 4.8, reviews: 203 },
    { name: 'Bright Smiles Clinic',   phone: '(310) 555-0099', email: 'hello@brightsmiles.com',  website: 'brightsmiles.com', rating: 4.6, reviews: 138 },
    { name: 'Metro Dental Group',     phone: '(310) 555-0245', email: null,                       website: null,              rating: 4.4, reviews: 76  },
  ],
  HVAC: [
    { name: 'CoolAir Solutions',   phone: '(512) 555-0388', email: 'service@coolair.com',        website: 'coolair.com',        rating: 4.5, reviews: 88  },
    { name: 'Austin Climate Pros', phone: '(512) 555-0142', email: 'info@austinclimate.com',     website: 'austinclimate.com',  rating: 4.7, reviews: 114 },
  ],
  'Coffee Shops': [
    { name: 'Bean & Brew Co.',   phone: '(404) 555-0033', email: 'hi@beanandbrew.com',       website: 'beanandbrew.com',   rating: 4.9, reviews: 334 },
    { name: 'Morning Cup LLC',   phone: '(404) 555-0099', email: null,                        website: null,                rating: 4.2, reviews: 58  },
    { name: 'The Roastery Club', phone: '(404) 555-0177', email: 'hello@theroastery.com',    website: 'theroastery.com',   rating: 4.7, reviews: 190 },
  ],
  _default: [
    { name: 'Prime Services Co.',  phone: '(555) 555-0101', email: 'hello@primeservices.com', website: 'primeservices.com', rating: 4.5, reviews: 85  },
    { name: 'Downtown Pros LLC',   phone: '(555) 555-0202', email: 'info@downtownpros.com',   website: 'downtownpros.com',  rating: 4.3, reviews: 62  },
    { name: 'Metro Solutions Inc.',phone: '(555) 555-0303', email: null,                       website: null,                rating: 4.6, reviews: 119 },
    { name: 'City Experts Group',  phone: '(555) 555-0404', email: 'help@cityexperts.com',    website: 'cityexperts.com',   rating: 4.8, reviews: 231 },
  ],
};

// ─── VIEW SWITCHING ──────────────────────────────────────────
function switchView(id, tabEl) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.ptab').forEach(t => t.classList.remove('active'));
  document.getElementById('view-' + id).classList.add('active');
  if (tabEl) tabEl.classList.add('active');
  window.scrollTo(0, 0);
}

// ─── MODAL ───────────────────────────────────────────────────
function openModal()  { document.getElementById('modal-backdrop').classList.add('open');    }
function closeModal() { document.getElementById('modal-backdrop').classList.remove('open'); }

// Close modal on backdrop click
document.addEventListener('DOMContentLoaded', () => {
  const backdrop = document.getElementById('modal-backdrop');
  if (backdrop) {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeModal();
    });
  }
});

// ─── GENERATE LEADS ──────────────────────────────────────────
function generateLeads() {
  const biz  = document.getElementById('biz-select').value;
  const city = document.getElementById('city-input').value.trim();
  const err  = document.getElementById('err-bar');

  // Clear previous error
  err.classList.remove('show');

  // Validation
  if (!biz)  { document.getElementById('err-text').textContent = 'Please select a business type.'; err.classList.add('show'); return; }
  if (!city) { document.getElementById('err-text').textContent = 'Please enter a city name.';      err.classList.add('show'); return; }

  // Free plan limit check
  if (usedLeads >= FREE_LIMIT) { openModal(); return; }

  // Loading state
  const btn = document.getElementById('gen-btn');
  btn.classList.add('loading');
  btn.disabled = true;

  // Simulate async scrape (1.6s)
  setTimeout(() => {
    const pool    = MOCK[biz] || MOCK._default;
    const canAdd  = FREE_LIMIT - usedLeads;
    const newLeads = pool
      .slice(0, Math.min(pool.length, canAdd))
      .map(l => ({ ...l, city, type: biz, _id: Math.random() }));

    allLeads   = [...newLeads, ...allLeads];
    usedLeads += newLeads.length;

    updateUI();
    renderTable();

    // Reset button
    btn.classList.remove('loading');
    btn.disabled = false;

    // Update sub-text
    const sub = document.getElementById('search-sub');
    if (usedLeads >= FREE_LIMIT) {
      sub.textContent   = 'Free limit reached — upgrade to Pro for unlimited leads.';
      sub.style.color   = '#ea4335';
    } else {
      sub.textContent   = `${FREE_LIMIT - usedLeads} free leads remaining.`;
      sub.style.color   = '';
    }
  }, 1600);
}

// ─── UPDATE STATS & USAGE BAR ────────────────────────────────
function updateUI() {
  // Stat cards
  document.getElementById('sc-total').textContent  = allLeads.length;
  document.getElementById('sc-cities').textContent = new Set(allLeads.map(l => l.city)).size;
  document.getElementById('sc-cats').textContent   = new Set(allLeads.map(l => l.type)).size;

  // Free leads left
  const left   = Math.max(0, FREE_LIMIT - usedLeads);
  const leftEl = document.getElementById('sc-left');
  leftEl.textContent  = left;
  leftEl.style.color  = left <= 5 ? '#ea4335' : '#34a853';

  // Usage progress bar
  const pct = Math.min((usedLeads / FREE_LIMIT) * 100, 100);
  const fill = document.getElementById('usage-fill');
  fill.style.width      = pct + '%';
  fill.style.background = pct >= 80 ? '#ea4335' : '#1a73e8';
  document.getElementById('usage-count').textContent = `${usedLeads} / ${FREE_LIMIT} leads`;

  // Export button
  const eb = document.getElementById('export-btn');
  if (allLeads.length > 0) {
    eb.disabled     = false;
    eb.style.opacity = '1';
  }

  // Table headline
  document.getElementById('table-headline').textContent = allLeads.length > 0 ? 'Leads Found' : 'Your Leads';
  document.getElementById('table-sub').textContent      = allLeads.length > 0
    ? `${allLeads.length} result${allLeads.length > 1 ? 's' : ''}`
    : '';
}

// ─── HELPERS ─────────────────────────────────────────────────
function getInitials(name) {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

// ─── RENDER LEADS TABLE ──────────────────────────────────────
function renderTable() {
  const container = document.getElementById('leads-container');

  if (!allLeads.length) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--text3)" stroke-width="1.8" stroke-linecap="round">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </div>
        <div class="empty-title">No leads yet</div>
        <div class="empty-sub">Choose a business type and city above, then click Generate Leads.</div>
      </div>`;
    return;
  }

  const rows = allLeads.map((l, i) => `
    <tr style="animation-delay:${i * 40}ms">
      <td>
        <div class="td-biz">
          <div class="td-biz-init">${getInitials(l.name)}</div>
          <div>
            <div class="td-biz-name">${l.name}</div>
            <div class="td-biz-type">${l.type}</div>
          </div>
        </div>
      </td>
      <td style="font-size:13px;color:#aaa;">
        ${l.phone || '<span style="color:var(--text3)">—</span>'}
      </td>
      <td>
        ${l.email
          ? `<a href="mailto:${l.email}" style="color:#669df6;text-decoration:none;font-size:13px;">${l.email}</a>`
          : '<span style="color:var(--text3);font-size:13px;">—</span>'}
      </td>
      <td>
        ${l.website
          ? '<span class="badge-green">Available</span>'
          : '<span class="badge-gray">No website</span>'}
      </td>
      <td><span class="td-city">${l.city}</span></td>
      <td>
        <div class="td-rating">
          <span class="td-star">★</span>${l.rating}
          <span style="color:var(--text3);font-size:11px;">(${l.reviews})</span>
        </div>
      </td>
    </tr>`).join('');

  container.innerHTML = `
    <div style="overflow-x:auto;">
      <table>
        <thead>
          <tr>
            <th>Business</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Website</th>
            <th>City</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

// ─── CSV EXPORT ───────────────────────────────────────────────
function exportCSV() {
  if (!allLeads.length) return;

  const headers = ['Business', 'Type', 'Phone', 'Email', 'Website', 'City', 'Rating', 'Reviews'];
  const rows    = allLeads.map(l => [
    l.name, l.type, l.phone || '', l.email || '',
    l.website || '', l.city, l.rating, l.reviews
  ]);

  const csv = [headers, ...rows]
    .map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  const a    = document.createElement('a');
  a.href     = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  a.download = `mapleads-${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
}

/**
 * animations.js - Sequential animated SVG Handshake diagrams & Head-of-Line blocking demo
 */

document.addEventListener('DOMContentLoaded', () => {
  initHandshakeAnimation();
  initHOLBlockingDemo();
  initFAQAccordion();
});

/* ==========================================================================
   Handshake Diagram Sequencer (TCP+TLS vs QUIC 1-RTT)
   ========================================================================== */
function initHandshakeAnimation() {
  const tcpSvg = document.getElementById('tcp-handshake-svg');
  const quicSvg = document.getElementById('quic-handshake-svg');
  const replayBtn = document.getElementById('replay-handshake-btn');

  if (!tcpSvg || !quicSvg) return;

  function runHandshakeSequence() {
    // Reset any ongoing animations
    resetHandshakeSVG(tcpSvg);
    resetHandshakeSVG(quicSvg);

    // TCP + TLS 1.3 Sequence (Total: ~3 RTTs: SYN -> SYN-ACK -> ACK/ClientHello -> ServerHello/Finished -> AppData)
    const tcpSteps = [
      { from: 'client', to: 'server', y1: 70, y2: 105, label: '1. TCP SYN', color: '#ffd166', delay: 200 },
      { from: 'server', to: 'client', y1: 105, y2: 140, label: '2. TCP SYN-ACK', color: '#ffd166', delay: 1000 },
      { from: 'client', to: 'server', y1: 140, y2: 175, label: '3. TCP ACK', color: '#ffd166', delay: 1800 },
      { from: 'client', to: 'server', y1: 185, y2: 220, label: '4. TLS ClientHello', color: '#9d4edd', delay: 2600 },
      { from: 'server', to: 'client', y1: 220, y2: 260, label: '5. TLS ServerHello + Encrypted', color: '#9d4edd', delay: 3400 },
      { from: 'client', to: 'server', y1: 265, y2: 305, label: '6. TLS Finished + HTTP GET', color: '#00d4ff', delay: 4200 },
      { from: 'server', to: 'client', y1: 305, y2: 345, label: '7. HTTP 200 OK (Data)', color: '#06d6a0', delay: 5000 }
    ];

    // QUIC 1-RTT Sequence (TLS 1.3 over UDP crypto combined)
    const quicSteps = [
      { from: 'client', to: 'server', y1: 70, y2: 140, label: '1. Initial (QUIC Handshake + ClientHello)', color: '#00d4ff', delay: 200 },
      { from: 'server', to: 'client', y1: 140, y2: 210, label: '2. Handshake Done + ServerHello', color: '#9d4edd', delay: 1200 },
      { from: 'client', to: 'server', y1: 210, y2: 280, label: '3. 1-RTT Protected Stream Data (GET)', color: '#00d4ff', delay: 2200 },
      { from: 'server', to: 'client', y1: 280, y2: 345, label: '4. Stream Data Response (200 OK)', color: '#06d6a0', delay: 3000 }
    ];

    tcpSteps.forEach(step => animateArrow(tcpSvg, step));
    quicSteps.forEach(step => animateArrow(quicSvg, step));
  }

  function resetHandshakeSVG(svg) {
    const dynamicGroup = svg.querySelector('.dynamic-arrows');
    if (dynamicGroup) {
      dynamicGroup.innerHTML = '';
    }
  }

  function animateArrow(svg, { from, to, y1, y2, label, color, delay }) {
    setTimeout(() => {
      const dynamicGroup = svg.querySelector('.dynamic-arrows');
      if (!dynamicGroup) return;

      const clientX = 65;
      const serverX = 285;

      const x1 = from === 'client' ? clientX : serverX;
      const x2 = to === 'server' ? serverX : clientX;

      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.classList.add('arrow-group');

      // Line
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', x1);
      line.setAttribute('y1', y1);
      line.setAttribute('x2', x1);
      line.setAttribute('y2', y1);
      line.setAttribute('stroke', color);
      line.setAttribute('stroke-width', '2.5');
      line.setAttribute('stroke-linecap', 'round');
      line.style.transition = 'all 0.65s cubic-bezier(0.2, 0.8, 0.2, 1)';

      // Marker Head
      const marker = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      marker.setAttribute('cx', x1);
      marker.setAttribute('cy', y1);
      marker.setAttribute('r', '4');
      marker.setAttribute('fill', color);
      marker.style.transition = 'all 0.65s cubic-bezier(0.2, 0.8, 0.2, 1)';

      // Label
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      const textX = (clientX + serverX) / 2;
      const textY = (y1 + y2) / 2 - 6;
      text.setAttribute('x', textX);
      text.setAttribute('y', textY);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('fill', color);
      text.setAttribute('font-size', '11px');
      text.setAttribute('font-family', 'Inter, sans-serif');
      text.setAttribute('font-weight', '600');
      text.setAttribute('opacity', '0');
      text.style.transition = 'opacity 0.4s ease 0.3s';
      text.textContent = label;

      g.appendChild(line);
      g.appendChild(marker);
      g.appendChild(text);
      dynamicGroup.appendChild(g);

      // Trigger animation frame
      requestAnimationFrame(() => {
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        marker.setAttribute('cx', x2);
        marker.setAttribute('cy', y2);
        text.setAttribute('opacity', '1');
      });
    }, delay);
  }

  // Trigger on load and on click
  runHandshakeSequence();
  if (replayBtn) {
    replayBtn.addEventListener('click', runHandshakeSequence);
  }
}

/* ==========================================================================
   Head-of-Line (HoL) Blocking Interactive Simulation
   ========================================================================== */
function initHOLBlockingDemo() {
  const triggerBtn = document.getElementById('simulate-loss-btn');
  const h2Container = document.getElementById('h2-hol-stream');
  const h3Container = document.getElementById('h3-hol-stream');
  const statusNote = document.getElementById('hol-status-note');

  if (!triggerBtn || !h2Container || !h3Container) return;

  triggerBtn.addEventListener('click', () => {
    // Inject packet loss animation
    triggerBtn.disabled = true;
    triggerBtn.textContent = 'Simulating Packet Loss...';

    // In HTTP/2: Packet 2 in Stream A is lost -> All subsequent packets in Stream A and Stream B wait for TCP retransmission
    h2Container.innerHTML = `
      <div class="packet-pill packet-ok">Stream A (Pkt 1) ✓</div>
      <div class="packet-pill packet-lost">Stream A (Pkt 2) ❌ LOST</div>
      <div class="packet-pill packet-blocked">Stream A (Pkt 3) ⏳ BLOCKED</div>
      <div class="packet-pill packet-blocked">Stream B (Pkt 1) ⏳ BLOCKED (TCP HOL)</div>
    `;

    // In HTTP/3: Packet 2 in Stream A is lost -> Stream A waits, but Stream B processes completely independently!
    h3Container.innerHTML = `
      <div class="packet-pill packet-ok">Stream A (Pkt 1) ✓</div>
      <div class="packet-pill packet-lost">Stream A (Pkt 2) ❌ LOST</div>
      <div class="packet-pill packet-ok" style="border-style:dashed;">Stream A (Pkt 3) ⏳ Buffering</div>
      <div class="packet-pill packet-ok" style="background:rgba(0,212,255,0.25); border-color:#00d4ff;">Stream B (Pkt 1) 🚀 DELIVERED!</div>
      <div class="packet-pill packet-ok" style="background:rgba(0,212,255,0.25); border-color:#00d4ff;">Stream B (Pkt 2) 🚀 DELIVERED!</div>
    `;

    if (statusNote) {
      statusNote.innerHTML = `<strong>Result:</strong> In HTTP/2, a single TCP packet loss freezes <em>all</em> multiplexed streams until retransmitted. In HTTP/3 (QUIC), Stream B was completely delivered without delay because streams are independent at the transport layer!`;
      statusNote.style.borderColor = 'var(--accent-cyan)';
    }

    setTimeout(() => {
      // Retransmission arrives
      const lostH2 = h2Container.querySelector('.packet-lost');
      if (lostH2) {
        lostH2.className = 'packet-pill packet-ok';
        lostH2.textContent = 'Stream A (Pkt 2) ↻ Retransmitted';
      }
      h2Container.querySelectorAll('.packet-blocked').forEach(el => {
        el.className = 'packet-pill packet-ok';
        el.textContent = el.textContent.replace('⏳ BLOCKED (TCP HOL)', '✓ Resumed').replace('⏳ BLOCKED', '✓ Resumed');
      });

      triggerBtn.disabled = false;
      triggerBtn.textContent = 'Re-simulate Packet Loss';
    }, 3500);
  });
}

/* ==========================================================================
   Accordion FAQ Controller
   ========================================================================== */
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;
    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(i => i.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

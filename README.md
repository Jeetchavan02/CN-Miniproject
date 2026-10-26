# QUICLAB: Performance Comparison of HTTP/1.1 vs HTTP/2 vs HTTP/3 (QUIC)

An experimental performance analysis and educational laboratory comparing application-layer protocol and transport-layer evolution (**HTTP/1.1**, **HTTP/2**, and **HTTP/3 over QUIC**). This project grounds its empirical analysis and evaluation in the landmark measurement study published at **ACM CoNEXT 2025**:

> **"Waiting for QUIC: Passive Measurements to Understand QUIC Deployments"**  
> *Jonas Mücke, Marcin Nawrocki, Raphael Hiesgen, Patrick Sattler, Johannes Zirngibl, Georg Carle, Jan Luxemburk, Thomas C. Schmidt, and Matthias Wählisch*  
> *Proceedings of the ACM on Networking (PACMNET / ACM CoNEXT '25)*, Vol. 3, No. CoNEXT4, Art. 41, Dec. 2025.  
> **DOI:** [10.1145/3768988](https://doi.org/10.1145/3768988) | **Scholar:** [View on Google Scholar](https://scholar.google.com/scholar?q=Waiting+for+QUIC+Passive+Measurements+to+Understand+QUIC+Deployments+M%C3%BCcke+2025)

---

## Academic Context

- **Institution:** Fr. Conceicao Rodrigues College of Engineering (FR. CRCE), Bandra (West), Mumbai – 400050
- **Department:** Department of Computer Engineering
- **Course:** Computer Networks Laboratory
- **Academic Year:** 2025–2026
- **Class / Semester:** Third Year Computer Engineering (TE-A)
- **Project Team Members:**
  - **Jeet Chavan** (Roll No: 10584)
  - **Ritu Ahirwar** (Roll No: 10578)
  - **Jeshrun Dehte** (Roll No: 10593)

---

## Project Overview & Motivation

Over the past three decades, web protocols evolved from static document retrieval to multi-asset applications loading hundreds of resources simultaneously:
- **HTTP/1.1 (RFC 2616)** introduced persistent connections and pipelining, but suffered from sequential Head-of-Line (HoL) blocking across separate TCP connections.
- **HTTP/2 (RFC 7540)** introduced binary framing and multiplexed concurrent streams over a single TCP socket, resolving application-level blocking. However, it created a severe bottleneck: **Transport-Layer HoL Blocking** — where a single dropped TCP packet halts *all* multiplexed streams while the kernel waits for retransmission.
- **HTTP/3 (RFC 9000, RFC 9114)** replaces TCP entirely with **QUIC** (*Quick UDP Internet Connections*). Built on UDP in user space, QUIC introduces independent, encrypted streams with built-in TLS 1.3 cryptography, zero-round-trip time (0-RTT) connection resumption, and connection migration across network interfaces.

This mini-project evaluates these performance characteristics through an interactive web-based experimental testbed, passive measurement synthesis, and formal technical documentation.

---

## Key Modules & Features

### 1. Protocol Architecture & Sequence Visualizer (`background.html`)
- **Step-by-Step Handshake Diagrams:** Visualizes the sequential handshake progression:
  - *HTTP/1.1 & HTTP/2:* TCP 3-Way Handshake (`SYN` -> `SYN-ACK` -> `ACK`) followed by separate TLS 1.3 negotiation (2 to 3 RTTs before HTTP `GET`).
  - *HTTP/3 (QUIC):* Unified transport + cryptographic parameter exchange in a single round trip (1-RTT initial, 0-RTT resumption).
- **Interactive Head-of-Line (HoL) Blocking Simulator:** A live demonstration dropping a single packet in Stream A to visualize how TCP stalls all concurrent streams (Stream B buffered) while QUIC streams proceed without interruption.

### 2. Live Browser Measurement Testbed (`live-demo.html`)
- **High-Resolution Resource Timing Telemetry:** Uses the browser's `window.performance.getEntriesByType('resource')` API to measure and dissect:
  - DNS Lookup duration (`domainLookupEnd - domainLookupStart`)
  - TCP Connect duration (`connectEnd - connectStart`)
  - TLS Handshake duration (`secureConnectionStart > 0 ? connectEnd - secureConnectionStart : 0`)
  - Time-to-First-Byte / TTFB (`responseStart - requestStart`)
  - Total resource transfer duration
- **Dynamic Session History Table:** Logs measurement runs with timestamped protocol breakdowns and highlights the lowest-latency protocol in real time.

### 3. Empirical Benchmark Visualization (`results.html`)
- **Comparative Data Engine:** Visualizes benchmark datasets toggleable between:
  - **Our Experimental Benchmark Run** (Standardized testbed loading multi-asset pages across 0%, 1%, 2%, and 5% packet loss).
  - **Paper Baseline Figures** (Mücke et al., ACM CoNEXT 2025).
- **Interactive Charts (Chart.js):**
  - Average Page Load Time (Bar Chart)
  - Load Time vs. Packet Loss (Multi-line Chart showcasing TCP degradation vs. QUIC resilience)
  - Connection Setup Latency (Horizontal Bar Chart)
  - 5-Axis Radar Chart comparing Speed, Loss Resilience, Low Latency, Multiplexing, and Security.

### 4. ACM CoNEXT 2025 Research Paper Analysis (`research.html`)
- **Literature Review & Methodology Critique:** In-depth breakdown of the passive measurement approach used by Mücke et al.:
  - 5-year longitudinal analysis using unsolicited backscatter traffic on the UCSD Network Telescope (/9 and /10 IPv4 darknets).
  - Stack fingerprinting revealing configuration differences among hypergiants (e.g., Meta's aggressive 0.1s Initial RTO vs. Google's 0.3s and Cloudflare's 1.0s with packet coalescence).
  - Layer-7 load balancer enumeration through unencrypted QUIC Connection IDs (CIDs).

### 5. Departmental Evaluation Report (`conclusion.html`)
- **Comprehensive Project Documentation:** Structured specifically for academic grading and departmental submission.
  - Section 1: Executive Abstract & Motivation
  - Section 2: Problem Statement & Technical Objectives
  - Section 3: Protocol Architectural Comparison Matrix (RFC standards)
  - Section 4: Quantitative Degradation Findings
  - Section 5: Literature Synthesis of Mücke et al. (2025)
  - Section 6: Core Takeaways & Real-World Engineering Limitations (UDP middlebox filtering, user-space CPU load, cross-origin timing security)
  - Section 7: Conclusions & Future Scope (Multipath QUIC, XDP/eBPF acceleration)
  - Section 8: Formal References in IEEE Citation Format
- **Print / PDF Generation (`@media print`):** Custom high-contrast print stylesheet optimized for A4 portrait export via the in-browser **"Print / Save as PDF"** action.

---

## Key Experimental Findings

| Evaluated Condition | HTTP/1.1 (TCP) | HTTP/2 (TCP Multiplexed) | HTTP/3 (QUIC over UDP) | Speedup (H3 vs H2) |
| :--- | :---: | :---: | :---: | :---: |
| **0% Loss (Clean Gigabit Link)** | 1,850 ms | 920 ms | **640 ms** | 1.44x faster |
| **1% Loss (Light Wi-Fi Jitter)** | 2,900 ms | 1,400 ms | **680 ms** | 2.06x faster |
| **2% Loss (Typical Cellular 4G/5G)** | 4,100 ms | 2,100 ms | **720 ms** | 2.92x faster |
| **5% Loss (Impaired / Congested Link)** | 7,200 ms | 3,800 ms | **810 ms** | **4.69x faster (~78% reduction)** |
| **Connection Setup Latency (Handshake)** | 320 ms | 180 ms | **45 ms (1-RTT) / ~0 ms (0-RTT)** | **75%–86% setup acceleration** |

> **Primary Takeaway:** While HTTP/2 remains competitive with HTTP/3 on pristine zero-loss networks (920 ms vs 640 ms), its completion time surges by **+313% under 5% packet loss** due to transport-layer head-of-line blocking. HTTP/3 load times increase by only **+26%** under identical impairment, demonstrating its decisive advantage for edge and mobile networks.

---

## Technology Stack

- **Markup & Layout:** Semantic HTML5 (`index.html`, `background.html`, `live-demo.html`, `results.html`, `research.html`, `conclusion.html`)
- **Styling Architecture:** Modern Vanilla CSS3
  - CSS Custom Properties (Design tokens)
  - CSS Grid & Flexbox responsive layouts
  - Custom SVG graphics & micro-animations
  - Dedicated `@media print` styling rules for academic PDF generation
- **Client-Side Scripting:** Vanilla JavaScript (ES6+)
  - `js/nav.js`: Navigation logic, active state tracking, scroll observers, and particle backgrounds
  - `js/live-demo.js`: Resource Timing API telemetry, latency delta calculation, session history logging
  - `js/animations.js`: Head-of-Line blocking simulation engine and interactive state management
  - `js/charts.js`: Data rendering and dataset toggles via Chart.js
- **Visualization Library:** [Chart.js](https://www.chartjs.org/) (CDN-delivered for Bar, Line, and Radar charts)
- **Data Layer:** Standalone JSON (`data/results.json`) for benchmark profiles

---

## Project Structure

```text
CN-Miniproject/
├── index.html            # Landing page: overview, research motivation & team
├── background.html       # Handshake comparison & interactive HoL blocking simulator
├── live-demo.html        # Live browser telemetry testbed (Resource Timing API)
├── results.html          # Benchmark visualizations & data toggle (Chart.js)
├── research.html         # Research paper synthesis (Mücke et al., ACM CoNEXT 2025)
├── conclusion.html       # Formal Departmental Evaluation Report & PDF export
├── data/
│   └── results.json      # Structured benchmark data (experimental vs paper)
├── css/
│   └── style.css         # Unified stylesheet, design system tokens & print styles
├── js/
│   ├── animations.js     # HoL blocking interactive animations
│   ├── charts.js         # Chart.js rendering, scales, and dataset switching
│   ├── live-demo.js      # Timing API telemetry engine & fastest highlighter
│   └── nav.js            # Navbar routing, responsive drawer & visual effects
└── README.md             # Complete project documentation
```

---

## How to Run Locally

Because the project uses standard web technologies and JSON data fetching, it can be served using any local HTTP static server:

### Option 1: Python 3 (Recommended)
```bash
# Clone the repository
git clone https://github.com/Jeetchavan02/CN-Miniproject.git
cd CN-Miniproject

# Start a local HTTP server
python3 -m http.server 8080
```
Open your browser and navigate to:  
`http://localhost:8080`

### Option 2: Node.js (`npx serve`)
```bash
npx serve .
```

### Option 3: VS Code Live Server
Right-click on `index.html` and select **"Open with Live Server"**.

---

## References & RFC Standards

1. **J. Mücke et al.**, *"Waiting for QUIC: Passive Measurements to Understand QUIC Deployments,"* in *Proceedings of the ACM on Networking (ACM CoNEXT '25)*, vol. 3, no. CoNEXT4, Art. 41, Dec. 2025. [DOI: 10.1145/3768988](https://doi.org/10.1145/3768988)
2. **RFC 9000:** *QUIC: A UDP-Based Multiplexed and Secure Transport* (IETF, May 2021) — [RFC 9000](https://www.rfc-editor.org/rfc/rfc9000.html)
3. **RFC 9114:** *HTTP/3* (IETF Standards Track, June 2022) — [RFC 9114](https://www.rfc-editor.org/rfc/rfc9114.html)
4. **RFC 7540:** *Hypertext Transfer Protocol Version 2 (HTTP/2)* (IETF, May 2015) — [RFC 7540](https://www.rfc-editor.org/rfc/rfc7540.html)
5. **RFC 8446:** *The Transport Layer Security (TLS) Protocol Version 1.3* (IETF, Aug. 2018) — [RFC 8446](https://www.rfc-editor.org/rfc/rfc8446.html)

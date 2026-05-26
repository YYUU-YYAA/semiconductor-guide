// ── STATE ──────────────────────────────────────────────────────────────
let currentLevel = 'device';
let currentDevice = 'smartphone';
let newsFilter = 'ALL';

// ── INIT ───────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  setupNavigation();
  buildDeviceSection();
  buildProcessFlowSection();
  buildSupplyChainFlow();
  buildUnifiedRoadmap();
  buildNewsSection();
  showSection('device');
});

// ── NAVIGATION ─────────────────────────────────────────────────────────
function setupNavigation() {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      showSection(link.dataset.section);
    });
  });
}

function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.add('hidden'));
  const target = document.getElementById('sec-' + id);
  if (target) target.classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function jumpToSection(id) {
  document.querySelectorAll('.nav-link').forEach(l => {
    l.classList.toggle('active', l.dataset.section === id);
  });
  showSection(id);
}

// ── HIERARCHY SYSTEM ────────────────────────────────────────────────────
const LEVELS = ['device', 'board', 'package', 'chip'];
const LEVEL_LABELS = {
  device: '📱 デバイス全体',
  board: '🖥️ システム基板',
  package: '📦 パッケージ断面',
  chip: '🔬 チップ断面'
};

function renderHierarchyLevel(level, device) {
  currentLevel = level;
  if (device) currentDevice = device;

  // Update breadcrumb if present
  const bc = document.getElementById('breadcrumb');
  if (bc) bc.innerHTML = LEVELS.map((l, i) => {
    const active = l === level;
    const past = LEVELS.indexOf(l) < LEVELS.indexOf(level);
    return `<span class="bc-item ${active ? 'bc-active' : ''} ${past ? 'bc-past' : ''}"
      onclick="${(active || past) ? `renderHierarchyLevel('${l}', '${currentDevice}')` : ''}"
      style="cursor:${(active || past) ? 'pointer' : 'default'}"
    >${LEVEL_LABELS[l]}</span>${i < LEVELS.length - 1 ? '<span class="bc-sep">›</span>' : ''}`;
  }).join('');

  // Clear info panel if present (old structure viewer)
  const panel = document.getElementById('layer-panel');
  if (panel) panel.innerHTML = `<div class="panel-placeholder"><div class="hint-arrow">←</div><p>要素をクリックして詳細を表示</p></div>`;

  // Render SVG into drill modal wrap (only used from modal context now)
  const wrap = document.getElementById('drill-wrap') || document.getElementById('diagram-wrap');
  if (wrap) {
    wrap.innerHTML = '';
    if (level === 'device') renderDeviceSVG(wrap, currentDevice);
    else if (level === 'board') renderBoardSVG(wrap, currentDevice);
    else if (level === 'package') renderPackageSVG(wrap, currentDevice);
    else if (level === 'chip') renderChipSVG(wrap);
  }
}

// ── LEVEL 0: DEVICE SVG ─────────────────────────────────────────────────
function renderDeviceSVG(wrap, device) {
  const W = 680, H = 400;
  const svg = makeSVG(W, H);

  if (device === 'smartphone') drawSmartphone(svg, W, H);
  else if (device === 'pc') drawPC(svg, W, H);
  else if (device === 'server') drawServer(svg, W, H);

  const hint = el('p', 'svg-hint', '← コンポーネントをクリックして詳細。「システム基板を見る」で内部に進む。');
  wrap.appendChild(svg);
  wrap.appendChild(hint);
}

function drawSmartphone(svg, W, H) {
  // Phone body
  addRect(svg, 215, 15, 250, 370, '#1a2535', 22, 'phone-body', null, null, 1, '#334155');
  // Screen
  addRect(svg, 228, 55, 224, 240, '#0f172a', 6, 'screen', null, null, 1, '#1e3a5f');
  addText(svg, 340, 178, '画面 (OLED)', '#64748b', 11, 'middle');

  // Battery
  addRect(svg, 231, 305, 218, 60, '#0d2d1a', 4, 'battery', null, null, 1, '#1a4731');
  addText(svg, 340, 338, '🔋 バッテリー (Li-ion)', '#4ade80', 10, 'middle');

  // PCB area
  addRect(svg, 231, 296, 218, 8, '#064e3b', 2, null, null, null, 1, '#065f46');
  addText(svg, 340, 295, 'メインボード (SLP)', '#06b6d4', 9, 'middle');

  // Camera module
  addRect(svg, 350, 25, 65, 28, '#0f172a', 8, 'camera', null, null, 1, '#1e3a5f');
  addText(svg, 382, 42, '📷 カメラ', '#94a3b8', 9, 'middle');

  // Side labels with lines
  const components = [
    { label: 'AP SoC + LPDDR5 (InFO PoP)', x: 50, y: 180, tx: 228 },
    { label: '5G RF モジュール', x: 50, y: 240, tx: 228 },
    { label: 'UFS フラッシュ', x: 50, y: 270, tx: 228 },
    { label: 'PMU / 電源 IC', x: 50, y: 300, tx: 228 },
  ];
  components.forEach(c => {
    addLine(svg, c.x + 120, c.y, c.tx, c.y, '#334155', 1, [3,3]);
    addText(svg, c.x + 60, c.y + 4, c.label, '#94a3b8', 9, 'middle');
  });

  // Right labels
  const rcomps = [
    { label: 'OLED ディスプレイ', x: 620, y: 175, tx: 452 },
    { label: 'バッテリー 3500mAh', x: 620, y: 340, tx: 452 },
  ];
  rcomps.forEach(c => {
    addLine(svg, c.tx, c.y, c.x - 80, c.y, '#334155', 1, [3,3]);
    addText(svg, c.x - 40, c.y + 4, c.label, '#94a3b8', 9, 'middle');
  });

  // Clickable zone
  const soc = makeClickGroup(svg, 'AP/SoC エリア (InFO パッケージ)');
  addRect(soc, 240, 155, 90, 130, 'rgba(6,182,212,0.08)', 4, null, null, null, 1.5, '#06b6d4');
  addText(soc, 285, 225, 'SoC', '#06b6d4', 9, 'middle');
  soc.addEventListener('click', () => {
    showLayerDetail({
      name: 'AP SoC (Application Processor)',
      nameEn: 'A18 / Snapdragon 8 Elite — InFO PoP Package',
      role: 'スマートフォンの頭脳。CPU・GPU・NPU・ISP・Modemなどを1チップに統合。TSMCのInFO (Fan-out WLP) でLPDDR5 DRAMとPoP積層。',
      materials: [
        { name: 'Si (N3/N2 logic)', role: 'チップ本体', supplier: ['TSMC'] },
        { name: 'LPDDR5X DRAM', role: 'PoP積層メモリ', supplier: ['Samsung', 'SK Hynix', 'Micron'] },
        { name: 'InFO RDL', role: 'ファンアウト配線', supplier: ['TSMC'] },
      ],
      equipment: [
        { name: 'EUV/DUV露光装置', maker: ['ASML'] },
        { name: 'TC Bonding (PoP)', maker: ['BESI', 'Toray Engineering'] },
      ],
      processes: ['TSMC N3/N2製造', 'InFO PoP実装', 'TC Bonding'],
      challenges: ['発熱管理 (薄型筐体)', 'DRAM帯域 (AI処理)', 'Gen AI NPU性能'],
      newsQuery: 'Apple A18 Snapdragon 8 Elite SoC InFO 2025'
    });
    renderHierarchyLevel('package', currentDevice);
  });

  addText(svg, 340, 395, '📱 スマートフォン内部構造 — クリックで各部詳細を表示', '#475569', 10, 'middle');
}

function drawPC(svg, W, H) {
  // Laptop body
  addRect(svg, 60, 20, 560, 320, '#1a2535', 8, null, null, null, 1, '#334155');
  // Screen
  addRect(svg, 75, 35, 530, 230, '#0f172a', 4, null, null, null, 1, '#1e2d45');
  addText(svg, 340, 155, 'LCD/OLED ディスプレイ', '#475569', 13, 'middle');
  // Keyboard
  addRect(svg, 75, 275, 530, 55, '#0d1525', 2, null, null, null, 1, '#1e2d45');
  addText(svg, 340, 304, 'キーボード', '#475569', 11, 'middle');
  // Base (motherboard)
  addRect(svg, 60, 340, 560, 50, '#0d1f3a', 4, null, null, null, 1, '#1e3a5f');
  addText(svg, 340, 368, '🖥️ マザーボード (メインボード)', '#06b6d4', 11, 'middle');

  // CPU zone
  const cpu = makeClickGroup(svg, 'CPU (Meteor Lake / M4)');
  addRect(cpu, 110, 348, 80, 35, 'rgba(6,182,212,0.12)', 4, null, null, null, 1.5, '#06b6d4');
  addText(cpu, 150, 369, 'CPU', '#06b6d4', 10, 'middle');
  cpu.addEventListener('click', () => renderHierarchyLevel('package', currentDevice));

  // GPU zone
  const gpu = makeClickGroup(svg, 'GPU (RTX / Arc)');
  addRect(gpu, 200, 348, 80, 35, 'rgba(99,102,241,0.12)', 4, null, null, null, 1.5, '#818cf8');
  addText(gpu, 240, 369, 'GPU', '#818cf8', 10, 'middle');
  gpu.addEventListener('click', () => renderHierarchyLevel('package', currentDevice));

  // DDR
  addRect(svg, 300, 348, 50, 35, 'rgba(245,158,11,0.1)', 4, null, null, null, 1, '#d97706');
  addText(svg, 325, 369, 'DDR5', '#d97706', 10, 'middle');

  // SSD
  addRect(svg, 360, 348, 50, 35, 'rgba(16,185,129,0.1)', 4, null, null, null, 1, '#059669');
  addText(svg, 385, 369, 'SSD', '#059669', 10, 'middle');

  addText(svg, 340, 395, '💻 ノートPC内部構造 — クリックで各部詳細を表示', '#475569', 10, 'middle');
}

function drawServer(svg, W, H) {
  // Server chassis
  addRect(svg, 40, 30, 600, 340, '#0d1525', 4, null, null, null, 1, '#1e2d45');
  // Front panel
  addRect(svg, 40, 30, 600, 35, '#111827', 0, null, null, null, 1, '#1e2d45');
  addText(svg, 340, 52, '● SERVER RACK UNIT (2U) ●', '#22d3ee', 10, 'middle');

  // GPU boards
  const gpuColors = ['#7c3aed', '#6d28d9', '#5b21b6', '#4c1d95'];
  ['GPU #1\nH200', 'GPU #2\nH200', 'GPU #3\nH200', 'GPU #4\nH200'].forEach((label, i) => {
    const gpuG = makeClickGroup(svg, `NVIDIA H200 GPU SXM (CoWoS-L + HBM3e ×8)`);
    addRect(gpuG, 60 + i * 145, 80, 130, 180, gpuColors[i], 6, null, null, null, 1.5, '#8b5cf6');
    addText(gpuG, 125 + i * 145, 155, 'H200 GPU', '#e2e8f0', 10, 'middle');
    addText(gpuG, 125 + i * 145, 170, 'CoWoS+HBM3e', '#a78bfa', 9, 'middle');
    gpuG.addEventListener('click', () => {
      showLayerDetail({
        name: 'NVIDIA H200 SXM GPU',
        nameEn: 'CoWoS-L + HBM3e ×8 — AI Accelerator',
        role: 'AIトレーニング・推論用GPU。TSMC CoWoS-Lインターポーザー上にGPU Dieと8個のHBM3eメモリを搭載。メモリ帯域3.35TB/s。',
        materials: [
          { name: 'GH100 GPU Die (N4/TSMC)', role: 'AI演算コア', supplier: ['TSMC'] },
          { name: 'HBM3e ×8 (SK Hynix)', role: '高帯域メモリ', supplier: ['SK Hynix', 'Micron'] },
          { name: 'Si インターポーザー (CoWoS-L)', role: 'GPU-HBM横配線', supplier: ['TSMC'] },
          { name: 'ABF FC-BGA 基板', role: 'インターポーザー支持', supplier: ['IBIDEN', 'Shinko Electric'] },
        ],
        equipment: [
          { name: 'EUV露光 (N4)', maker: ['ASML'] },
          { name: 'TC Bonding (HBM→インターポーザー)', maker: ['BESI', 'Toray Eng.'] },
          { name: 'Flip Chip Bonding', maker: ['BESI'] },
        ],
        processes: ['TSMC N4 GPU Wafer Fab', 'CoWoS-L インターポーザー形成', 'HBM3eボンディング', 'FC-BGA実装'],
        challenges: ['消費電力700W+冷却', 'CoWoS供給ボトルネック', 'HBM容量/帯域向上 (HBM4)'],
        newsQuery: 'NVIDIA H200 B200 CoWoS HBM3e 2025'
      });
      renderHierarchyLevel('package', 'server');
    });
  });

  // CPU
  addRect(svg, 60, 275, 150, 80, '#1e3a5f', 6, null, null, null, 1, '#1e40af');
  addText(svg, 135, 312, '⚙️ CPU (AMD EPYC)', '#60a5fa', 11, 'middle');
  addText(svg, 135, 328, 'DDR5 / PCIe 5.0', '#475569', 9, 'middle');

  // NVLink / NIC
  addRect(svg, 220, 275, 120, 80, '#14532d', 6, null, null, null, 1, '#166534');
  addText(svg, 280, 312, '🌐 NVLink / NIC', '#4ade80', 11, 'middle');
  addText(svg, 280, 328, '800G Ethernet', '#475569', 9, 'middle');

  // Storage
  addRect(svg, 350, 275, 100, 80, '#1c1917', 6, null, null, null, 1, '#292524');
  addText(svg, 400, 315, '💾 NVMe SSD', '#a8a29e', 11, 'middle');

  // PSU
  addRect(svg, 460, 275, 175, 80, '#1a1a2e', 6, null, null, null, 1, '#2d2b55');
  addText(svg, 547, 315, '⚡ PSU (3000W)', '#818cf8', 11, 'middle');

  addText(svg, 340, 395, '🖥️ AIサーバー内部構造 — GPUをクリックしてパッケージ詳細へ', '#475569', 10, 'middle');
}

// ── LEVEL 1: BOARD SVG ──────────────────────────────────────────────────
function renderBoardSVG(wrap, device) {
  const W = 680, H = 420;
  const svg = makeSVG(W, H);

  if (device === 'smartphone') drawSmartphoneBoard(svg, W, H);
  else if (device === 'pc') drawPCBoard(svg, W, H);
  else drawServerBoard(svg, W, H);

  wrap.appendChild(svg);
  wrap.appendChild(el('p', 'svg-hint', '← チップ・パッケージをクリックしてパッケージ断面へ'));
}

function drawSmartphoneBoard(svg, W, H) {
  // SLP board
  addRect(svg, 30, 20, 620, 380, '#1a3320', 6, null, null, null, 1.5, '#166534');
  addText(svg, 340, 12, 'スマートフォン メインボード (SLP — Sequential Lamination PCB)', '#94a3b8', 10, 'middle');

  // InFO PoP (AP + DRAM)
  const info = makeClickGroup(svg, 'AP SoC (InFO PoP) — N3/N2プロセス');
  addRect(info, 60, 60, 200, 200, '#1e3a5f', 8, null, null, null, 2, '#06b6d4');
  addText(info, 160, 125, '📦 AP SoC', '#06b6d4', 13, 'middle');
  addText(info, 160, 145, 'InFO Fan-out WLP', '#94a3b8', 9, 'middle');
  addText(info, 160, 162, 'TSMC N3E', '#60a5fa', 9, 'middle');
  addRect(info, 75, 175, 170, 60, '#0c2340', 4, null, null, null, 1, '#1e40af');
  addText(info, 160, 200, 'LPDDR5X PoP積層', '#60a5fa', 9, 'middle');
  addText(info, 160, 215, 'SK Hynix / Samsung', '#475569', 8, 'middle');
  info.addEventListener('click', () => renderHierarchyLevel('package', device));

  // 5G Modem
  const modem = makeClickGroup(svg, '5G RF/モデム モジュール');
  addRect(modem, 280, 60, 140, 90, '#1a2535', 6, null, null, null, 1.5, '#818cf8');
  addText(modem, 350, 100, '📡 5G Sub-6/mmWave', '#818cf8', 10, 'middle');
  addText(modem, 350, 115, 'QTM547 / AiP', '#64748b', 9, 'middle');
  modem.addEventListener('click', () => showLayerDetail({
    name: '5G RF Front-End Module (AiP)',
    nameEn: 'Antenna-in-Package — mmWave / Sub-6GHz',
    role: 'アンテナを内蔵したRFモジュール。mmWave (28GHz) はAiP構造でアンテナと一体化。Sub-6はLTCC基板上に実装。',
    materials: [
      { name: 'PA (GaAs/GaN)', role: 'パワーアンプ', supplier: ['Skyworks', 'Qorvo', 'Murata'] },
      { name: 'LNA/Filter (SAW/BAW)', role: 'ローノイズアンプ/フィルタ', supplier: ['Murata', 'TDK', 'Qualcomm'] },
      { name: 'LTCC/Rogers基板', role: 'RF低損失基板', supplier: ['Kyocera', 'Murata', 'Rogers Corp'] },
    ],
    equipment: [{ name: 'LTCC焼成炉', maker: ['Kyocera', 'NGK'] }],
    processes: ['LTCC多層焼成', 'チップ実装 (SMT)', 'AiP アンテナ一体化'],
    challenges: ['mmWave伝送損失', '小型化と放射効率の両立'],
    newsQuery: 'AiP antenna in package 5G mmWave 2025'
  }));

  // UFS Flash
  addRect(svg, 280, 165, 140, 65, '#1a2535', 6, null, null, null, 1, '#334155');
  addText(svg, 350, 195, '💾 UFS 4.0 フラッシュ', '#94a3b8', 10, 'middle');
  addText(svg, 350, 210, 'Samsung / SK Hynix', '#64748b', 8, 'middle');

  // PMU
  addRect(svg, 440, 60, 120, 80, '#1a2535', 6, null, null, null, 1, '#334155');
  addText(svg, 500, 103, '⚡ PMU / PMIC', '#fbbf24', 10, 'middle');

  // NFC/BT/WiFi
  addRect(svg, 440, 155, 120, 70, '#1a2535', 6, null, null, null, 1, '#334155');
  addText(svg, 500, 192, '📶 WiFi 7 / BT 5.4', '#34d399', 10, 'middle');

  // Board layers annotation (right side)
  const layers = ['SR (ソルダーレジスト)', 'Cu L1 (配線)', 'Prepreg', 'Cu L2', 'コア', 'Cu L3', 'Prepreg', 'Cu L4', 'SR (下面)'];
  addText(svg, 610, 50, 'SLP基板 断面層', '#94a3b8', 9, 'middle');
  layers.forEach((l, i) => {
    const colors = ['#065f46','#dc2626','#1e3a5f','#dc2626','#374151','#dc2626','#1e3a5f','#dc2626','#065f46'];
    addRect(svg, 565, 65 + i * 24, 100, 18, colors[i], 2, null, null, null, 0, 'transparent');
    addText(svg, 615, 78 + i * 24, l, '#94a3b8', 7.5, 'middle');
  });

  addText(svg, 340, 415, '基板内部 AnyLayer IVH (インタースティシャルビアホール) 構造', '#475569', 9, 'middle');
}

function drawPCBoard(svg, W, H) {
  addRect(svg, 20, 20, 640, 380, '#0d2010', 6, null, null, null, 1.5, '#14532d');
  addText(svg, 340, 12, 'PC マザーボード (ATX) — FR-4 多層基板', '#94a3b8', 10, 'middle');

  // CPU socket
  const cpu = makeClickGroup(svg, 'CPU ソケット (LGA 1851)');
  addRect(cpu, 40, 40, 180, 180, '#1e3a5f', 8, null, null, null, 2, '#2563eb');
  addText(cpu, 130, 120, '⚙️ CPU', '#60a5fa', 14, 'middle');
  addText(cpu, 130, 140, 'Intel Core Ultra / AMD Ryzen', '#94a3b8', 8, 'middle');
  addText(cpu, 130, 156, 'FC-BGA パッケージ', '#475569', 8, 'middle');
  cpu.addEventListener('click', () => renderHierarchyLevel('package', device));

  // DDR5 slots
  [0,1,2,3].forEach(i => {
    addRect(svg, 240 + i * 42, 40, 35, 200, '#0c1a0c', 2, null, null, null, 1, '#166534');
    addText(svg, 257 + i * 42, 145, `DDR5`, '#4ade80', 7, 'middle');
    addText(svg, 257 + i * 42, 158, `DIMM`, '#4ade80', 7, 'middle');
  });

  // GPU slot
  const gpu = makeClickGroup(svg, 'GPU (PCIe 5.0 x16) FC-BGA');
  addRect(gpu, 40, 240, 580, 100, '#1a1040', 6, null, null, null, 1.5, '#6d28d9');
  addText(gpu, 330, 295, '🎮 GPU / AI アクセラレータ (PCIe 5.0 x16)', '#a78bfa', 12, 'middle');
  addText(gpu, 330, 315, 'FC-BGA パッケージ — ABF基板', '#64748b', 9, 'middle');
  gpu.addEventListener('click', () => renderHierarchyLevel('package', device));

  // Chipset
  addRect(svg, 430, 40, 100, 80, '#1a2535', 6, null, null, null, 1, '#334155');
  addText(svg, 480, 83, '🔧 Chipset', '#94a3b8', 10, 'middle');

  // Storage
  addRect(svg, 430, 135, 100, 45, '#1c1917', 6, null, null, null, 1, '#292524');
  addText(svg, 480, 160, 'M.2 NVMe', '#a8a29e', 9, 'middle');

  // PSU connector
  addRect(svg, 545, 40, 90, 170, '#1a1a2e', 4, null, null, null, 1, '#2d2b55');
  addText(svg, 590, 128, '⚡ ATX電源', '#818cf8', 9, 'middle');

  addText(svg, 340, 410, 'PCIe 5.0 / DDR5 / USB4 バス接続', '#475569', 9, 'middle');
}

function drawServerBoard(svg, W, H) {
  addRect(svg, 20, 20, 640, 380, '#0a1628', 4, null, null, null, 1.5, '#1e3a5f');
  addText(svg, 340, 12, 'AIサーバー GPU ベースボード — CoWoS + HBM3e', '#94a3b8', 10, 'middle');

  // NVLink switch board
  addRect(svg, 20, 20, 640, 55, '#0d1a33', 0, null, null, null, 1, '#1e40af');
  addText(svg, 340, 50, '🔗 NVLink / PCIe スイッチ基板 (上部)', '#60a5fa', 10, 'middle');

  // 4 GPU packages with CoWoS detail
  [0,1,2,3].forEach(i => {
    const g = makeClickGroup(svg, `H200 SXM GPU #${i+1} — CoWoS-L インターポーザー`);
    addRect(g, 30 + i * 155, 90, 140, 230, '#1a0d33', 8, null, null, null, 2, '#7c3aed');
    // GPU Die
    addRect(g, 45 + i * 155, 105, 110, 80, '#4c1d95', 4, null, null, null, 0, 'transparent');
    addText(g, 100 + i * 155, 148, 'GPU Die', '#c4b5fd', 9, 'middle');
    addText(g, 100 + i * 155, 162, 'N4 / TSMC', '#818cf8', 8, 'middle');
    // CoWoS interposer
    addRect(g, 45 + i * 155, 190, 110, 18, '#312e81', 2, null, null, null, 0, 'transparent');
    addText(g, 100 + i * 155, 202, 'Si Interposer (CoWoS-L)', '#6366f1', 7, 'middle');
    // HBM stacks
    [0,1].forEach(h => {
      addRect(g, 45 + i * 155 + h * 58, 212, 48, 75, '#1e1b4b', 4, null, null, null, 1, '#4338ca');
      addText(g, 69 + i * 155 + h * 58, 252, 'HBM3e', '#818cf8', 7.5, 'middle');
      addText(g, 69 + i * 155 + h * 58, 265, '×4', '#6366f1', 7, 'middle');
    });
    // ABF substrate
    addRect(g, 30 + i * 155, 290, 140, 20, '#0f172a', 2, null, null, null, 1, '#1e2d45');
    addText(g, 100 + i * 155, 303, 'ABF基板 (FC-BGA)', '#334155', 7, 'middle');
    g.addEventListener('click', () => renderHierarchyLevel('package', 'server'));
  });

  // CPU zone
  addRect(svg, 30, 335, 120, 55, '#1e3a5f', 6, null, null, null, 1, '#1e40af');
  addText(svg, 90, 366, '⚙️ CPU (AMD EPYC)', '#60a5fa', 9, 'middle');

  // Memory
  addRect(svg, 160, 335, 200, 55, '#14532d', 4, null, null, null, 1, '#166534');
  addText(svg, 260, 366, '💾 DDR5 RDIMM × 12', '#4ade80', 9, 'middle');

  // NIC
  addRect(svg, 370, 335, 120, 55, '#1c2031', 4, null, null, null, 1, '#374151');
  addText(svg, 430, 366, '🌐 800G NIC', '#94a3b8', 9, 'middle');

  addText(svg, 340, 415, 'GPU SXMをクリックしてCoWoS+HBM パッケージ断面へ', '#475569', 9, 'middle');
}

// ── LEVEL 2: PACKAGE SUBSTRATE CROSS-SECTION SVG ────────────────────────
const PKG_LAYERS = [
  // Die on top (not part of substrate, but shown for context)
  { id: 'die_logic', name: 'ロジックダイ (GPU/SoC)', nameEn: 'Logic Die — N3/N4 Process',
    y:8, h:52, color:'#4c1d95', colorL:'#7c3aed', type:'die',
    role: 'TSMCのN3/N4などで製造されたチップ本体。Cu Pillarバンプでパッケージ基板 (インターポーザーまたはABF基板) と接続。',
    materials:[
      {name:'Si (N3/N4)', role:'チップ本体',supplier:['TSMC','Samsung Foundry']},
      {name:'Cu Pillar Bump', role:'外部接続',supplier:['JX金属','Atotech']},
      {name:'SnAg はんだキャップ', role:'接合',supplier:['Alpha Assembly','千住金属']},
    ],
    equipment:[{name:'EUV露光装置',maker:['ASML']},{name:'Cu Pillarめっき装置',maker:['Ebara','Lam Research']}],
    processes:['ウェーハファブ (TSMC)','Wafer Bumping (Cu Pillar形成)','ダイシング'],
    challenges:['歩留まり管理','熱管理 (TDP 300W+)','Cu Pillarピッチ微細化'],
    newsQuery:'logic die N3 N4 TSMC GPU SoC packaging 2025' },

  { id: 'cu_pillar', name: 'Cu Pillar / μBump', nameEn: 'Controlled Collapse Chip Connection (C4 / Cu Pillar)',
    y:60, h:20, color:'#b45309', colorL:'#d97706', type:'bump',
    specs: 'C4: ピッチ100-200μm, h=80-100μm | μBump: ピッチ40μm, h=20-30μm | Hybrid Bond: ピッチ<10μm (バンプレス)',
    role: 'ダイとインターポーザー/基板を接続するCuバンプ。高さ20〜80μm。ピッチは従来C4で100〜200μm、先端μBumpで10〜40μm。リフローまたはTC Bondingで接合。2nm世代以降はHybrid Bonding (バンプレス、Cu-Cu直接接合) へ移行が加速中。',
    materials:[
      {name:'Cu (銅)',role:'バンプ本体',supplier:['JX金属','DOWA','Umicore']},
      {name:'SnAg はんだ (Pb-free)',role:'はんだキャップ',supplier:['Alpha Assembly','Indium Corp','千住金属']},
      {name:'UBM (Ti/TiW/Ni/Cu)',role:'Under Bump Metallurgy',supplier:['Tosoh','Materion','ULVAC']},
    ],
    equipment:[{name:'電解Cuめっき装置',maker:['Ebara','Lam Research','Atotech']},{name:'PVDスパッタ (UBM)',maker:['AMAT','ULVAC']},{name:'リフロー炉',maker:['Heller','ERSA']}],
    processes:['PVD UBM成膜','厚膜レジスト露光','電解Cuめっき','SnAgリフロー/TC Bonding'],
    challenges:['ピッチ微細化 (<10μm → Hybrid Bonding移行)','ボイド欠陥抑制','熱サイクル信頼性'],
    newsQuery:'Cu pillar micro bump hybrid bonding advanced packaging 2025' },

  { id: 'underfill', name: 'アンダーフィル (NCF/CUF)', nameEn: 'Underfill — NCF / Capillary Underfill',
    y:80, h:14, color:'#7c2d12', colorL:'#9a3412', type:'bump',
    role: 'バンプ間の空隙をエポキシで充填し熱サイクル信頼性を確保。先端パッケージではNCF (Non-Conductive Film) をバンプ前に貼り付けTC Bondingで一括接合するプロセスも主流。',
    materials:[
      {name:'NCF (Non-Conductive Film)',role:'フィルム型アンダーフィル',supplier:['味の素ファインテクノ (AFC)','レゾナック (旧日立化成)']},
      {name:'CUF (Capillary Underfill)',role:'毛細管型充填',supplier:['Namics','Henkel','Shin-Etsu MicroSi']},
    ],
    equipment:[{name:'TC Bonding装置',maker:['BESI','Toray Engineering','日立パワーデバイス']},{name:'アンダーフィルディスペンサー',maker:['Nordson','Asymtek']}],
    processes:['NCF貼付 (ウェーハレベル)','TC Bonding (熱圧着)','硬化 (キュア)'],
    challenges:['μBump間 (<10μm) 充填','ボイド欠陥','高温信頼性 (Junction Temp >150°C)'],
    newsQuery:'underfill NCF TC bonding advanced packaging HBM 2025' },

  { id: 'sr_top', name: 'ソルダーレジスト (上面)', nameEn: 'Solder Resist / Solder Mask (Top)',
    y:94, h:16, color:'#14532d', colorL:'#166534', type:'substrate',
    role: '基板表面を保護する感光性樹脂。PAD部のみ開口し、はんだのブリッジ防止と絶縁性を確保。緑色が代表的だがBlack/Blueも使用される。',
    materials:[
      {name:'感光性ソルダーレジスト (液状)',role:'スクリーン印刷用',supplier:['太陽インキ (Taiyo Holdings)','Tamura Corp','互応化学']},
      {name:'ドライフィルムソルダーレジスト (DFSR)',role:'ラミネート用',supplier:['Asahi Kasei','Hitachi Chemical (レゾナック)','太陽インキ']},
    ],
    equipment:[{name:'露光装置 (LDI)',maker:['Orbotech (KLA)','ESI','日立ビアメカニクス']},{name:'現像/硬化装置',maker:['各社汎用']}],
    processes:['SR塗布/ラミネート','UV露光 (パターニング)','アルカリ現像','熱硬化'],
    challenges:['L/S微細化 (SM解像度)','耐薬品性','PAD開口精度'],
    newsQuery:'solder resist solder mask substrate advanced packaging 2025' },

  { id: 'enig_top', name: 'ENIG 表面処理 (上面)', nameEn: 'Surface Finish: ENIG (Electroless Ni / Immersion Au)',
    y:110, h:9, color:'#854d0e', colorL:'#b45309', type:'substrate',
    specs: 'ENIG: Ni=3-5μm, Au=0.05-0.1μm | ENEPIG: +Pd=0.05-0.15μm | OSP: 有機皮膜t=0.2-0.5μm',
    role: 'Cu PADを酸化から守りはんだ接合性を確保する表面処理。ENIG: Ni (3〜5μm) + Au (0.05〜0.1μm) 2層構造。ENEPIG: さらにPd (0.05〜0.15μm) を追加しワイヤーボンドにも対応。OSP: イミダゾール系有機皮膜で低コスト。Black Pad (Ni腐食) が業界課題。',
    materials:[
      {name:'ENIG (無電解Ni/置換Au)',role:'標準表面処理',supplier:['MacDermid Enthone (Element)','Atotech','奥野製薬']},
      {name:'OSP (Organic Solderability Preservative)',role:'Cu面保護 (低コスト)',supplier:['四国化成','Entegris']},
      {name:'ENEPIG (Ni/Pd/Au)',role:'ワイヤーボンド対応',supplier:['MacDermid','Atotech']},
    ],
    equipment:[{name:'無電解めっきライン',maker:['Atotech','MacDermid Enthone','奥野製薬']}],
    processes:['PAD開口確認','無電解Niめっき','置換Auめっき','リンス・乾燥'],
    challenges:['Black Pad不良 (Ni腐食)','Au厚均一性','コスト管理'],
    newsQuery:'ENIG surface finish PCB substrate advanced packaging 2025' },

  { id: 'cu_l1', name: 'Cu配線 L1 (最表層)', nameEn: 'Copper Trace Layer 1 — Surface RDL / Build-up',
    y:119, h:14, color:'#b91c1c', colorL:'#dc2626', type:'substrate',
    specs: 'mSAP: L/S=2/2μm, t_Cu=8-12μm | SAP: L/S=5/5μm | インピーダンス: 50Ω (シングル) / 100Ω (差動)',
    role: '最表層のCu配線。半加法 (mSAP/SAP) で形成される超微細配線。AI向けABF基板では L/S=2μm/2μm 以下が要求される。mSAP (Modified SAP) は無電解Cu薄膜シードを使用し、SAP比で微細化・低プロファイル化を実現。',
    materials:[
      {name:'電解Cu (配線)',role:'配線本体',supplier:['JX金属','古河電工','Mitsui Mining & Smelting']},
      {name:'無電解Cu (シード層)',role:'電解めっき下地',supplier:['MacDermid','Atotech','奥野製薬']},
    ],
    equipment:[{name:'SAP/mSAP めっきライン',maker:['Atotech','MacDermid']},{name:'LDI露光装置 (配線)',maker:['Orbotech (KLA)','ESI']},{name:'Cu エッチングライン',maker:['Telic','各社']}],
    processes:['無電解Cu シード成膜','ドライフィルムレジスト ラミネート','LDI露光/現像','電解Cu充填','レジスト剥離/フラッシュエッチング'],
    challenges:['L/S=2μm以下 (mSAP)','均一めっき厚','高周波信号損失'],
    newsQuery:'mSAP SAP fine line ABF substrate 2um 2025' },

  { id: 'abf1', name: 'ABF ビルドアップ層 (L2)', nameEn: 'Ajinomoto Build-up Film (ABF) — Insulation Layer',
    y:133, h:32, color:'#1e3a5f', colorL:'#1e40af', type:'substrate',
    specs: 'GZ41: Dk=3.4 Df=0.008 t=35μm | GX13: Dk=3.2 Df=0.005 t=30μm | GX92: Dk=3.0 Df=0.003 t=25μm | ビア径: 60-80μm (CO₂) / 20-40μm (UV)',
    role: '味の素ファインテクノ製のビルドアップ絶縁フィルム。低誘電率 (Dk≈3.0〜3.4)・低損失 (Df≈0.005)・微細ビア形成性が特徴。AI需要急増で世界的に供給不足。グレード別: GZ41 (汎用HPC) / GX13 (高速信号) / GX92 (ミリ波対応) 。',
    materials:[
      {name:'ABF-GZ41',specs:'Dk=3.4, Df=0.008, t=35μm, CTE=55ppm/°C',role:'汎用HPC・GPU向け標準グレード',supplier:['味の素ファインテクノ (AFC)']},
      {name:'ABF-GX13',specs:'Dk=3.2, Df=0.005, t=30μm',role:'高速信号・AI推論向け低損失グレード',supplier:['味の素ファインテクノ (AFC)']},
      {name:'ABF-GX92',specs:'Dk=3.0, Df=0.003, t=25μm',role:'ミリ波・次世代HPC向け超低損失グレード',supplier:['味の素ファインテクノ (AFC)']},
      {name:'MEGTRON 7N / FR-4 変形',role:'代替低損失材',supplier:['Panasonic CM','Isola','Rogers']},
    ],
    equipment:[{name:'真空ラミネータ',maker:['Nikko Materials','各社']},{name:'レーザーCD-ROM (ビア形成)',maker:['Mitsubishi Electric','ESI (MKS)','日立ビアメカニクス']},{name:'デスミア処理装置',maker:['TEL','SCREEN']}],
    processes:['ABFラミネート','レーザーマイクロビア形成','デスミア (樹脂除去)','無電解Cu めっき→電解Cu充填 (ビア充填)'],
    challenges:['AFC供給逼迫 (AI需要)','ABF Dk/Dfのさらなる低減','ビア径20μm以下','ワーページ (反り) 管理'],
    newsQuery:'ABF Ajinomoto build-up film shortage AI server substrate 2025' },

  { id: 'cu_l2', name: 'Cu配線 L2 (内層)', nameEn: 'Copper Trace Layer 2 — Inner Build-up',
    y:165, h:12, color:'#b91c1c', colorL:'#dc2626', type:'substrate',
    role: '内層のCu配線。SAP (Semi-Additive Process) で形成。電源/グラウンド層や信号配線。先端基板では5〜6μm L/S程度。',
    materials:[{name:'電解Cu',role:'配線',supplier:['JX金属','古河電工']}],
    equipment:[{name:'SAP めっきライン',maker:['Atotech','MacDermid']},{name:'LDI露光',maker:['Orbotech']}],
    processes:['ABFビア充填後 SAP配線形成'],
    challenges:['内層配線クロストーク','インピーダンス制御'],
    newsQuery:'inner layer copper trace build-up substrate 2025' },

  { id: 'abf2', name: 'ABF ビルドアップ層 (L3)', nameEn: 'ABF Build-up Film Layer 3',
    y:177, h:32, color:'#1e3a5f', colorL:'#1e40af', type:'substrate',
    role: '2層目のABFビルドアップ絶縁層。スタックドビアでL1〜L2間を接続。多層化するほどビア位置精度が要求される。',
    materials:[{name:'ABF フィルム',role:'絶縁層',supplier:['味の素ファインテクノ (AFC)']}],
    equipment:[{name:'真空ラミネータ',maker:['各社']},{name:'CO₂レーザードリル',maker:['Mitsubishi Electric','ESI']}],
    processes:['ABFラミネート','CO₂レーザービア形成','デスミア','Cu電解充填'],
    challenges:['スタックドビア精度','多層ABFのワーページ'],
    newsQuery:'ABF buildup multi-layer via stacked 2025' },

  { id: 'core', name: 'コア基材 (BT樹脂/ガラスクロス)', nameEn: 'Core Substrate — BT Resin + E-glass / FR-4',
    y:209, h:50, color:'#374151', colorL:'#4b5563', type:'substrate',
    specs: 'BT-200G: Tg=200°C, Dk=3.6, Df=0.006, CTE=12-14ppm/°C, t=0.1-0.8mm | PTH径: 0.1-0.2mm | ドリルピッチ: 0.2-0.4mm',
    role: '基板の機械強度を担う中心層。ビスマレイミドトリアジン (BT) 樹脂 + Eガラスクロス積層体。PTH (スルーホールめっき) で上下ビルドアップを接続。高Tg (200°C) で実装信頼性を確保。FC-BGA向けでは薄コア化 (0.1〜0.3mm) が進行中。',
    materials:[
      {name:'ガラスクロス (Eガラス)',role:'強化材',supplier:['日東紡 (Nittobo)','旭化成 (Asahi Kasei)','AGY','Owens Corning']},
      {name:'エポキシ樹脂/BT樹脂',role:'マトリックス',supplier:['Mitsubishi Gas Chemical (MGC)','Isola','Shengyi','ITEQ']},
      {name:'銅箔 (電解/圧延)',role:'コア配線層',supplier:['JX金属 (JXMTC)','古河電工','Mitsui Mining']},
    ],
    equipment:[{name:'プリプレグ含浸ライン',maker:['各社']},{name:'PTHドリル・めっき',maker:['SCHMOLL','Posalux','日立ビアメカニクス']}],
    processes:['ガラスクロス+樹脂含浸 (プリプレグ)','コア銅箔ラミネート','ドリル (メカ/レーザー)','PTH (スルーホールめっき)','コアエッチング'],
    challenges:['CTE管理 (Si基板とのミスマッチ)','高Tgコア材料','薄コア化とワーページ'],
    newsQuery:'core substrate FR-4 BT resin glass cloth PCB substrate 2025' },

  { id: 'abf3', name: 'ABF ビルドアップ層 (L4, 下側)', nameEn: 'ABF Build-up Film Layer 4 (Bottom Side)',
    y:259, h:32, color:'#1e3a5f', colorL:'#1e40af', type:'substrate',
    role: 'コア下側のビルドアップ層。BGA接続PADへの配線を形成。上側と対称に形成し基板の反りを抑制。',
    materials:[{name:'ABF フィルム',role:'絶縁層',supplier:['味の素ファインテクノ (AFC)']}],
    equipment:[{name:'真空ラミネータ+CO₂レーザー',maker:['各社']}],
    processes:['ABFラミネート','レーザービア','デスミア','Cu充填'],
    challenges:['上下対称形成によるワーページ抑制'],
    newsQuery:'ABF buildup bottom side substrate warpage 2025' },

  { id: 'cu_l3', name: 'Cu配線 L4 (下側内層)', nameEn: 'Copper Trace Layer — Bottom Inner Build-up',
    y:291, h:12, color:'#b91c1c', colorL:'#dc2626', type:'substrate',
    role: '下側内層のCu配線。電源・グラウンド配線やBGA PADへの引き出し配線。',
    materials:[{name:'電解Cu',role:'配線',supplier:['JX金属','古河電工']}],
    equipment:[{name:'SAP めっきライン',maker:['Atotech']}],
    processes:['SAP配線形成'],
    challenges:['電源分配ネットワーク (PDN) 設計'],
    newsQuery:'power delivery network PDN substrate design 2025' },

  { id: 'abf4', name: 'ABF ビルドアップ層 (L5, 下側)', nameEn: 'ABF Build-up Film Layer 5 (Bottom)',
    y:303, h:32, color:'#1e3a5f', colorL:'#1e40af', type:'substrate',
    role: '最下層ビルドアップ。BGAボール接続パッドを形成。',
    materials:[{name:'ABF フィルム',role:'絶縁層',supplier:['味の素ファインテクノ (AFC)']}],
    equipment:[{name:'真空ラミネータ',maker:['各社']}],
    processes:['ABFラミネート','レーザービア','デスミア','Cu充填'],
    challenges:['BGA PAD平坦性'],
    newsQuery:'ABF substrate BGA pad 2025' },

  { id: 'cu_bot', name: 'Cu PAD (BGA 接続面)', nameEn: 'BGA Landing Pad — Bottom Copper',
    y:335, h:14, color:'#b91c1c', colorL:'#dc2626', type:'substrate',
    role: 'BGAボールが着地するCuパッド。サイズとピッチがBGAボール径に対応。FC-BGAでは0.65〜1.0mmピッチが多い。',
    materials:[{name:'電解Cu + ENIG/OSP',role:'BGA接続パッド',supplier:['JX金属 + Atotech']}],
    equipment:[{name:'めっきライン + エッチング',maker:['Atotech','MacDermid']}],
    processes:['パターン形成','ENIG/OSP表面処理'],
    challenges:['PAD平坦性','ハンダ接合信頼性'],
    newsQuery:'BGA pad design substrate reliability 2025' },

  { id: 'enig_bot', name: 'ENIG 表面処理 (下面)', nameEn: 'Surface Finish Bottom (ENIG)',
    y:349, h:9, color:'#854d0e', colorL:'#b45309', type:'substrate',
    role: '下面BGA PADの表面処理。上面と同様にENIG (Ni/Au) またはOSP。はんだ接合性と酸化防止。',
    materials:[{name:'ENIG / OSP',role:'表面処理',supplier:['MacDermid Enthone','Atotech','奥野製薬']}],
    equipment:[{name:'無電解めっきライン',maker:['Atotech']}],
    processes:['無電解Ni','置換Au'],
    challenges:['BGA接合均一性'],
    newsQuery:'ENIG OSP BGA substrate surface finish 2025' },

  { id: 'sr_bot', name: 'ソルダーレジスト (下面)', nameEn: 'Solder Resist Bottom',
    y:358, h:16, color:'#14532d', colorL:'#166534', type:'substrate',
    role: '下面のソルダーレジスト。BGA PAD部を開口し、それ以外を絶縁保護。',
    materials:[{name:'感光性SR',role:'表面保護絶縁',supplier:['太陽インキ','Tamura Corp']}],
    equipment:[{name:'LDI露光装置',maker:['Orbotech']}],
    processes:['SR塗布→LDI露光→現像→熱硬化'],
    challenges:['PAD開口精度','耐薬品性'],
    newsQuery:'solder resist bottom substrate BGA 2025' },

  { id: 'bga', name: 'BGAはんだボール (Pb-free)', nameEn: 'BGA Solder Balls — SnAgCu (SAC305)',
    y:374, h:42, color:'#92400e', colorL:'#b45309', type:'pcb',
    specs: 'SAC305: Sn96.5/Ag3.0/Cu0.5, Tm=217-220°C, ピッチ0.65-1.0mm, 球径0.45-0.76mm',
    role: 'パッケージ基板とマザーボードを接続するはんだボール。Pb-free SAC305 (Sn96.5/Ag3.0/Cu0.5) が標準。融点217〜220°C。ピッチ0.65〜1.0mm。Cu Coreボール (Sn外装) でワーページ対策。高AI GPU向けでは電流容量増大のためボール径拡大傾向。',
    materials:[
      {name:'SAC305 はんだボール (SnAgCu)',role:'BGA接続',supplier:['Alpha Assembly Solutions','千住金属','Senju Metal Industry','Indium Corp']},
      {name:'フラックス',role:'リフロー時酸化防止',supplier:['Alpha Assembly','Senju Metal']},
    ],
    equipment:[{name:'ボールマウンター',maker:['SHIBUYA Corp','Athlete FA','Pac Tech']},{name:'リフロー炉',maker:['Heller Industries','ERSA','光洋サーモシステム']},{name:'AOI検査装置',maker:['Koh Young','Camtek','Orbotech']}],
    processes:['フラックス印刷','BGAボール搭載','リフロー (220〜260°C)','外観検査 (AOI)','X線検査'],
    challenges:['熱サイクル信頼性 (BGA joint crack)','ファインピッチ化 (<0.5mm)','Cu Core入りボール (ワーページ対策)'],
    newsQuery:'BGA solder ball SAC305 reliability substrate 2025' },
];

function renderPackageSVG(wrap, device) {
  const W = 680, H = 440;
  const svg = makeSVG(W, H);

  // Title
  addText(svg, 340, 6, 'FC-BGA パッケージ基板 全断面 — クリックで各層の詳細を表示', '#64748b', 9.5, 'middle');

  // Draw vias (decorative) before layers
  drawPackageVias(svg);

  PKG_LAYERS.forEach(layer => {
    const g = makeSVGGroup(svg);
    g.style.cursor = 'pointer';

    const rect = makeSVGEl('rect', {
      x:0, y:layer.y, width:W, height:layer.h,
      fill:layer.color, rx:layer.type === 'die' ? 6 : 0
    });
    g.appendChild(rect);

    // Decorative internal content
    if (layer.id === 'cu_l1' || layer.id === 'cu_l2' || layer.id === 'cu_l3' || layer.id === 'cu_bot') {
      const count = 18;
      const step = W / count;
      for (let i = 0; i < count; i++) {
        g.appendChild(makeSVGEl('rect', {
          x: i * step + step * 0.1, y: layer.y + 2,
          width: step * 0.8, height: layer.h - 4,
          fill: layer.colorL, rx: 1,
          'pointer-events': 'none'
        }));
      }
    }

    if (layer.id === 'die_logic') {
      // Die internal schematic
      const cells = [['CPU Core', '#6d28d9'], ['GPU', '#7c3aed'], ['NPU', '#5b21b6'], ['Cache', '#4c1d95']];
      cells.forEach((c, i) => {
        g.appendChild(makeSVGEl('rect', { x: 30 + i * 155, y: layer.y + 6, width: 140, height: layer.h - 12, fill: c[1], rx: 3, 'pointer-events': 'none' }));
        const t = makeSVGEl('text', { x: 100 + i * 155, y: layer.y + layer.h/2 + 4, fill: '#c4b5fd', 'font-size': 9, 'text-anchor': 'middle', 'pointer-events': 'none', 'font-family': 'Noto Sans JP, sans-serif', 'font-weight': '600' });
        t.textContent = c[0];
        g.appendChild(t);
      });
    }

    if (layer.id === 'cu_pillar') {
      const count = 16;
      const step = W / count;
      for (let i = 0; i < count; i++) {
        g.appendChild(makeSVGEl('rect', { x: i * step + step * 0.3, y: layer.y + 1, width: step * 0.4, height: layer.h - 2, fill: '#d97706', rx: 2, 'pointer-events': 'none' }));
      }
    }

    if (layer.id === 'bga') {
      const count = 20;
      const step = W / (count + 1);
      for (let i = 0; i < count; i++) {
        g.appendChild(makeSVGEl('ellipse', { cx: step + i * step, cy: layer.y + layer.h / 2, rx: 16, ry: 18, fill: '#d97706', 'pointer-events': 'none' }));
      }
    }

    if (layer.id === 'sr_top' || layer.id === 'sr_bot') {
      // Cross-hatch for SR
      for (let i = 0; i < W / 20; i++) {
        g.appendChild(makeSVGEl('line', { x1: i * 20, y1: layer.y, x2: i * 20 + layer.h, y2: layer.y + layer.h, stroke: layer.colorL, 'stroke-width': 0.8, 'stroke-opacity': 0.4, 'pointer-events': 'none' }));
      }
    }

    if (layer.id === 'enig_top' || layer.id === 'enig_bot') {
      // Gold sheen effect
      for (let i = 0; i < 6; i++) {
        g.appendChild(makeSVGEl('rect', { x: 0, y: layer.y + i * (layer.h / 6), width: W, height: layer.h / 6, fill: i % 2 === 0 ? '#a16207' : '#ca8a04', 'pointer-events': 'none' }));
      }
    }

    if (layer.id === 'core') {
      // Glass cloth pattern
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 20; col++) {
          g.appendChild(makeSVGEl('rect', { x: col * 34, y: layer.y + 4 + row * 11, width: 30, height: 7, fill: '#4b5563', rx: 1, 'pointer-events': 'none' }));
        }
      }
    }

    if (layer.id === 'underfill') {
      for (let i = 0; i < W / 12; i++) {
        g.appendChild(makeSVGEl('rect', { x: i * 12, y: layer.y + 2, width: 8, height: layer.h - 4, fill: '#9a3412', rx: 1, 'pointer-events': 'none' }));
      }
    }

    // Hover border
    const border = makeSVGEl('rect', { x: 1, y: layer.y + 1, width: W - 2, height: layer.h - 2, fill: 'none', stroke: 'transparent', 'stroke-width': 2.5, rx: 2 });
    border.classList.add('layer-border');
    border.style.pointerEvents = 'none';
    g.appendChild(border);

    // Label
    const labelX = 8, labelY = layer.y + layer.h / 2 + 4;
    const textEl = makeSVGEl('text', { x: labelX, y: labelY, fill: '#fff', 'font-size': Math.max(8, Math.min(11, layer.h * 0.45)), 'font-family': 'Noto Sans JP, sans-serif', 'font-weight': '700', opacity: 0.9 });
    textEl.style.pointerEvents = 'none';
    textEl.textContent = layer.name;
    g.appendChild(textEl);

    // Type tag on right
    if (layer.type) {
      const typeColors = { die: '#7c3aed', bump: '#b45309', substrate: '#1d4ed8', pcb: '#065f46' };
      const typeLabels = { die: 'DIE', bump: 'BUMP', substrate: 'SUBSTRATE', pcb: 'PCB I/F' };
      const tg = makeSVGEl('rect', { x: W - 80, y: layer.y + 2, width: 75, height: layer.h - 4, fill: typeColors[layer.type] + '30', rx: 3 });
      tg.style.pointerEvents = 'none';
      g.appendChild(tg);
      const tgText = makeSVGEl('text', { x: W - 42, y: layer.y + layer.h / 2 + 4, fill: typeColors[layer.type], 'font-size': 8, 'text-anchor': 'middle', 'font-family': 'sans-serif', 'font-weight': '700' });
      tgText.style.pointerEvents = 'none';
      tgText.textContent = typeLabels[layer.type];
      g.appendChild(tgText);
    }

    g.addEventListener('mouseenter', () => { border.setAttribute('stroke', '#06b6d4'); rect.style.filter = 'brightness(1.25)'; });
    g.addEventListener('mouseleave', () => { border.setAttribute('stroke', 'transparent'); rect.style.filter = ''; });
    g.addEventListener('click', () => {
      showLayerDetail(layer);
      if (layer.id === 'die_logic') renderHierarchyLevel('chip', currentDevice);
    });
  });

  // Separator lines between types
  [[93,'Die / Bump'], [374,'Substrate / PCB I/F']].forEach(([y, label]) => {
    svg.appendChild(makeSVGEl('line', { x1: 0, y1: y, x2: W, y2: y, stroke: '#06b6d4', 'stroke-width': 1.5, 'stroke-dasharray': '6,3' }));
    const t = makeSVGEl('text', { x: W / 2, y: y - 3, fill: '#06b6d4', 'font-size': 8, 'text-anchor': 'middle', 'font-family': 'sans-serif' });
    t.textContent = '── ' + label + ' ──';
    svg.appendChild(t);
  });

  wrap.appendChild(svg);
  wrap.appendChild(el('p', 'svg-hint', '← 各層をクリックして材料・装置・サプライヤー詳細を表示。ダイをクリックするとチップ断面へ。'));
}

function drawPackageVias(svg) {
  const W = 680;
  // Blind vias (top): L1 to L2
  for (let i = 0; i < 14; i++) {
    const x = 30 + i * 47;
    svg.appendChild(makeSVGEl('line', { x1: x, y1: 110, x2: x, y2: 177, stroke: '#ef4444', 'stroke-width': 3, 'pointer-events': 'none' }));
    svg.appendChild(makeSVGEl('ellipse', { cx: x, cy: 110, rx: 4, ry: 3, fill: '#ef4444', 'pointer-events': 'none' }));
    svg.appendChild(makeSVGEl('ellipse', { cx: x, cy: 177, rx: 4, ry: 3, fill: '#ef4444', 'pointer-events': 'none' }));
  }
  // PTH vias (core)
  for (let i = 0; i < 8; i++) {
    const x = 60 + i * 82;
    svg.appendChild(makeSVGEl('rect', { x: x - 4, y: 209, width: 8, height: 50, fill: '#ef4444', rx: 1, 'pointer-events': 'none' }));
    svg.appendChild(makeSVGEl('ellipse', { cx: x, cy: 209, rx: 7, ry: 5, fill: '#fca5a5', 'pointer-events': 'none' }));
    svg.appendChild(makeSVGEl('ellipse', { cx: x, cy: 259, rx: 7, ry: 5, fill: '#fca5a5', 'pointer-events': 'none' }));
  }
  // Blind vias (bottom): L4 to L5
  for (let i = 0; i < 14; i++) {
    const x = 30 + i * 47;
    svg.appendChild(makeSVGEl('line', { x1: x, y1: 259, x2: x, y2: 335, stroke: '#ef4444', 'stroke-width': 3, 'pointer-events': 'none' }));
    svg.appendChild(makeSVGEl('ellipse', { cx: x, cy: 259, rx: 4, ry: 3, fill: '#ef4444', 'pointer-events': 'none' }));
    svg.appendChild(makeSVGEl('ellipse', { cx: x, cy: 335, rx: 4, ry: 3, fill: '#ef4444', 'pointer-events': 'none' }));
  }
}

// ── LEVEL 3: CHIP SVG ───────────────────────────────────────────────────
const CHIP_LAYERS = [
  { id:'bump', name:'Cu Pillar / Bump', nameEn:'Controlled-Collapse Cu Pillar', y:5, h:58, color:'#b45309', colorL:'#d97706',
    role:'チップとパッケージ基板を電気的・機械的に接続する微細Cu柱状バンプ。先端2nmではピッチ<40μmのμBumpからHybrid Bondingへの移行が進む。',
    materials:[{name:'Cu',role:'バンプ本体',supplier:['JX金属','DOWA','Umicore']},{name:'SnAg',role:'はんだキャップ',supplier:['Alpha Assembly','千住金属']},{name:'UBM (Ti/Ni/Cu)',role:'下地',supplier:['Tosoh','Materion']}],
    equipment:[{name:'電解Cuめっき装置',maker:['Ebara','Lam Research','Atotech']},{name:'PVDスパッタ (UBM)',maker:['AMAT','ULVAC']}],
    processes:['UBM PVD成膜','厚膜フォトレジスト露光','電解Cuめっき','SnAgリフロー'],
    challenges:['ピッチ<10μm → Hybrid Bonding移行','バンプ高さ均一性','ストレス管理'],
    newsQuery:'Cu pillar bump hybrid bonding 2nm 2025' },
  { id:'passivation', name:'パッシベーション (SiN/PI)', nameEn:'Passivation Layer — SiN + Polyimide', y:63, h:28, color:'#065f46', colorL:'#047857',
    role:'チップ最表面を水分・汚染・機械的損傷から保護。SiN + ポリイミド (PI) 2層構造が標準。',
    materials:[{name:'SiN',role:'バリア保護膜',supplier:['Versum (Merck)','Air Liquide','大陽日酸']},{name:'Polyimide (PI)',role:'ストレスバッファ',supplier:['東レ','HD Micro Systems','レゾナック']}],
    equipment:[{name:'PECVD装置',maker:['AMAT','Lam Research']},{name:'スピンコーター',maker:['TEL','SCREEN']}],
    processes:['PECVD SiN成膜','PIスピンコート→露光→現像→硬化'],
    challenges:['ピンホール欠陥','パッド開口精度'],
    newsQuery:'semiconductor passivation SiN polyimide 2025' },
  { id:'metal_top', name:'上層金属配線 (M5-M9+)', nameEn:'Upper Metal Layers — Global Interconnect (Cu)', y:91, h:32, color:'#b91c1c', colorL:'#ef4444',
    role:'グローバル配線。電源・クロック・長距離信号を伝達。ライン幅が広くなり抵抗値を低減。SiOCH低誘電率膜で絶縁。',
    materials:[{name:'Cu (銅)',role:'配線主材料',supplier:['JX金属','Honeywell']},{name:'SiOCH / Low-k',role:'絶縁体 (k≈2.5)',supplier:['Air Products','Merck','JSR']},{name:'TaN/Ta バリア',role:'Cu拡散防止',supplier:['Materion','Plansee']}],
    equipment:[{name:'Cu電解めっき',maker:['Lam Research','Ebara']},{name:'CMP装置',maker:['AMAT','Ebara']}],
    processes:['Low-k CVD成膜','デュアルダマシン加工','Cu電解めっき','CMP平坦化'],
    challenges:['Low-k機械強度','RC遅延','エレクトロマイグレーション'],
    newsQuery:'BEOL copper interconnect low-k 2025' },
  { id:'imd', name:'層間絶縁膜 (Low-k IMD)', nameEn:'Inter-Metal Dielectric — Low-k (k≈2.4~2.6)', y:123, h:24, color:'#374151', colorL:'#4b5563',
    role:'金属配線層間の絶縁材料。RC遅延低減のためk値を下げる。2nm世代はAir-gap技術でk≈1.6まで低減。',
    materials:[{name:'SiOCH (Porous Low-k)',role:'主絶縁層',supplier:['Air Products','Merck','JSR']},{name:'SiCN / SiCOH',role:'Etch Stop Layer',supplier:['Versum','Air Liquide']}],
    equipment:[{name:'PECVD装置',maker:['AMAT (Producer)','ASM Int\'l']},{name:'UV硬化装置',maker:['Mattson','AMAT']}],
    processes:['PECVD低誘電率膜成膜','UV硬化 (ポロシティ付与)'],
    challenges:['k値と機械強度のトレードオフ','Air-gap形成制御'],
    newsQuery:'low-k dielectric air-gap IMD 2nm 2025' },
  { id:'m1', name:'M1 ローカル配線 (Co/Ru)', nameEn:'M1 / Local Interconnect — Co / Ru (Next Gen)', y:147, h:26, color:'#c2410c', colorL:'#ea580c',
    role:'最下層かつ最微細配線。2nm以降はCuから低抵抗のRu (ルテニウム) またはCo (コバルト) への転換が進行中。バリア不要でライン抵抗を大幅低減。',
    materials:[{name:'Ru (ルテニウム)',role:'次世代配線材料 (2nm以降)',supplier:['田中貴金属','Materion','Umicore']},{name:'Co (コバルト)',role:'M0/ライナー',supplier:['Umicore','Glencore']},{name:'Cu',role:'従来材料',supplier:['JX金属','Entegris']}],
    equipment:[{name:'ALD装置 (Ru)',maker:['ASM Int\'l','Lam Research']},{name:'Cu電解めっき',maker:['Lam Research','Ebara']}],
    processes:['ALD Ruバリア+配線成膜','ダマシン+CMP'],
    challenges:['Ru ALD成膜速度','晶粒界散乱によるライン抵抗増大'],
    newsQuery:'ruthenium interconnect M1 2nm 3nm 2025' },
  { id:'contact', name:'コンタクト (Co/W)', nameEn:'Contact Plug — Co / W (High Aspect Ratio)', y:173, h:28, color:'#1d4ed8', colorL:'#2563eb',
    role:'ゲートとS/Dから配線層への垂直接続。高アスペクト比 (AR>15:1) 。先端ではWからCoへ、更にRuへ転換。コンタクト抵抗の低減が重要課題。',
    materials:[{name:'Co (コバルト)',role:'先端コンタクト充填材',supplier:['Umicore','Glencore','Entegris']},{name:'W (タングステン)',role:'従来充填材',supplier:['Plansee','H.C. Starck']},{name:'TiN ライナー',role:'バリア・接着層',supplier:['Entegris','Tosoh']}],
    equipment:[{name:'ALD/CVD装置',maker:['ASM Int\'l','Lam Research','Kokusai Electric']},{name:'高ARエッチング',maker:['Lam Research','TEL']}],
    processes:['コンタクトホール高ARエッチング','TiN ALD','Co/W CVD充填','CMP'],
    challenges:['AR>20:1の均一充填','コンタクト抵抗<10Ω','ボイド欠陥'],
    newsQuery:'contact resistance cobalt tungsten ruthenium 2nm 2025' },
  { id:'gate', name:'ゲートスタック (HK-MG / GAA)', nameEn:'Gate Stack: HfO₂ / TiN / W — GAA Nanosheet', y:201, h:45, color:'#7c3aed', colorL:'#8b5cf6',
    role:'トランジスタのスイッチングを制御する核心部。HfO₂ (High-k) + TiN/TiAlC (Metal Gate)。GAAではナノシートを包む構造になりゲート制御性が大幅向上。',
    materials:[{name:'HfO₂ (k≈22)',role:'High-kゲート絶縁膜',supplier:['Air Liquide','Entegris','大陽日酸 (前駆体)']},{name:'TiN / TiAlC',role:'Work Function Metal',supplier:['Tosoh','Entegris','Merck']},{name:'W / WN',role:'Gate Fill Metal',supplier:['Plansee','H.C. Starck']}],
    equipment:[{name:'ALD装置 (HfO₂)',maker:['ASM Int\'l','Jusung','Kokusai Electric']},{name:'W CVD (Gate Fill)',maker:['Kokusai Electric','Lam Research']}],
    processes:['Dummy Gate→Gate-Last置換','HfO₂ ALD','Work Function Metal ALD','W Gate Fill','Gate CMP'],
    challenges:['GAA Nanosheet全周ゲート均一制御','PBTI/NBTI信頼性','Vt均一性'],
    newsQuery:'high-k metal gate GAA nanosheet 2nm TSMC 2025' },
  { id:'sd', name:'ソース/ドレイン + Fin/Nanosheet', nameEn:'Source / Drain Epitaxy + Nanosheet Channel', y:246, h:36, color:'#92400e', colorL:'#b45309',
    role:'GAAではSi/SiGeの交互積層をエッチングして解放したナノシートがチャネル。S/DにはSiGe (PMOS) /SiP (NMOS) をエピ成長しストレスで移動度向上。',
    materials:[{name:'Si Nanosheet',role:'チャネル層',supplier:['SUMCO / 信越化学 (ウェーハ)']},{name:'SiGe (エピ)',role:'PMOSストレッサー / GAA犠牲層',supplier:['Air Liquide','Merck (GeH₄)']},{name:'SiP (エピ)',role:'NMOSストレッサー',supplier:['Air Products','Lam (プロセス)']}],
    equipment:[{name:'CVDエピ装置',maker:['AMAT (Centura Epi)','ASM Int\'l (Epsilon)','TEL']},{name:'Nanosheet解放エッチング',maker:['Lam Research','TEL']}],
    processes:['Si/SiGe多層エピ成長','Nanosheet パターニング','Selective SiGe Etch (解放)','SiGe/SiP S/Dエピ成長','ドーパント活性化アニール'],
    challenges:['Nanosheet幅均一制御','短チャネル効果','DIBL低減'],
    newsQuery:'nanosheet GAA source drain epitaxy 2nm 2025' },
  { id:'sti', name:'STI (浅溝素子分離)', nameEn:'Shallow Trench Isolation — SiO₂', y:282, h:28, color:'#065f46', colorL:'#047857',
    role:'隣接トランジスタ間を絶縁するSiO₂充填トレンチ。FinFET/GAAではFin間・Nanosheet間の空間も含め均一に充填が必要。',
    materials:[{name:'SiO₂ (HDP/ALD)',role:'トレンチ充填絶縁体',supplier:['Merck','Versum','Air Products']},{name:'SiN ハードマスク',role:'エッチングマスク',supplier:['Versum','Air Liquide']}],
    equipment:[{name:'プラズマエッチング (Si RIE)',maker:['Lam Research','TEL','AMAT']},{name:'HDP-CVD / ALD SiO₂',maker:['Lam Research','AMAT','ASM']}],
    processes:['SiNハードマスク成膜','STIトレンチRIE','ライナー酸化','HDP-CVD/ALD充填','CMP平坦化'],
    challenges:['ナローチャネル効果','STIエッジストレス','GAA nanosheet間充填'],
    newsQuery:'STI isolation FinFET GAA nanosheet 2025' },
  { id:'substrate', name:'Si基板 (ウェーハ)', nameEn:'Silicon Substrate — 300mm CZ Wafer', y:310, h:80, color:'#1e3a5f', colorL:'#1e40af',
    role:'単結晶Siウェーハ。300mm径 (主流)。CZ法で育成。超高純度 (ppb〜ppt汚染レベル)。一枚から数千個のチップを製造。',
    materials:[{name:'Si (単結晶 CZ法)',role:'ウェーハ本体',supplier:['信越化学 (世界シェア1位)','SUMCO (2位)','SK Siltron','Siltronic','GlobalWafers']},{name:'エピタキシャル Si層',role:'品質向上 (一部)',supplier:['信越化学','SUMCO']},{name:'BOX (SiO₂)',role:'SOIウェーハ絶縁層',supplier:['Soitec']}],
    equipment:[{name:'CZ引き上げ装置',maker:['Kayex','Ferrotec']},{name:'ワイヤーソー',maker:['Meyer Burger','Takatori']},{name:'CMP/ポリッシュ装置',maker:['DISCO','Speed Fam']}],
    processes:['CZ法結晶育成','インゴットスライシング','研削→CMP→洗浄→検査'],
    challenges:['450mm化停滞','完全欠陥フリー (COP)','SOI均一膜厚'],
    newsQuery:'silicon wafer 300mm supply SUMCO Shin-Etsu 2025' },
];

function renderChipSVG(wrap) {
  const W = 680, H = 410;
  const svg = makeSVG(W, H);
  addText(svg, 340, 5, 'ロジックチップ断面 (FinFET / GAA) — 上: Cu Pillar → 下: Si基板', '#64748b', 9.5, 'middle');

  CHIP_LAYERS.forEach(layer => {
    const g = makeSVGGroup(svg);
    g.style.cursor = 'pointer';

    const rect = makeSVGEl('rect', { x:0, y:layer.y, width:W, height:layer.h, fill:layer.color, rx: layer.id === 'substrate' ? 0 : 2 });
    g.appendChild(rect);

    if (layer.id === 'metal_top' || layer.id === 'm1') {
      const cnt = 12; const step = W / cnt;
      for (let i = 0; i < cnt; i++) g.appendChild(makeSVGEl('rect', { x: i*step+step*.12, y: layer.y+3, width: step*.76, height: layer.h-6, fill: layer.colorL, rx: 2, 'pointer-events':'none' }));
    }
    if (layer.id === 'contact') {
      const cnt = 20; const step = W / cnt;
      for (let i = 0; i < cnt; i++) g.appendChild(makeSVGEl('rect', { x: i*step+step*.35, y: layer.y+2, width: step*.3, height: layer.h-4, fill: layer.colorL, rx: 2, 'pointer-events':'none' }));
    }
    if (layer.id === 'gate') {
      const cnt = 10; const step = W / cnt;
      for (let i = 0; i < cnt; i++) g.appendChild(makeSVGEl('rect', { x: i*step+step*.25, y: layer.y, width: step*.5, height: layer.h, fill: layer.colorL, rx: 3, 'pointer-events':'none' }));
    }
    if (layer.id === 'sd') {
      const cnt = 10; const step = W / cnt;
      for (let i = 0; i < cnt; i++) {
        g.appendChild(makeSVGEl('ellipse', { cx: i*step+step*.15, cy: layer.y+layer.h*.5, rx: step*.12, ry: layer.h*.4, fill: '#c2410c', 'pointer-events':'none' }));
        g.appendChild(makeSVGEl('ellipse', { cx: i*step+step*.85, cy: layer.y+layer.h*.5, rx: step*.12, ry: layer.h*.4, fill: '#1e40af', 'pointer-events':'none' }));
      }
    }
    if (layer.id === 'sti') {
      const cnt = 10; const step = W / cnt;
      for (let i = 0; i < cnt; i++) g.appendChild(makeSVGEl('rect', { x: i*step, y: layer.y, width: step*.35, height: layer.h, fill: layer.colorL, 'pointer-events':'none' }));
    }
    if (layer.id === 'bump') {
      const cnt = 8; const step = W / cnt;
      for (let i = 0; i < cnt; i++) g.appendChild(makeSVGEl('ellipse', { cx: i*step+step*.5, cy: layer.y+layer.h*.6, rx: step*.28, ry: layer.h*.5, fill: layer.colorL, 'pointer-events':'none' }));
    }
    if (layer.id === 'imd') {
      for (let i = 0; i < W/15; i++) g.appendChild(makeSVGEl('rect', { x: i*15, y: layer.y, width: 8, height: layer.h, fill: layer.colorL, opacity: 0.3, 'pointer-events':'none' }));
    }

    const border = makeSVGEl('rect', { x:1, y:layer.y+1, width:W-2, height:layer.h-2, fill:'none', stroke:'transparent', 'stroke-width':2.5, rx:2 });
    border.classList.add('layer-border');
    border.style.pointerEvents = 'none';
    g.appendChild(border);

    const t = makeSVGEl('text', { x:8, y:layer.y+layer.h/2+4, fill:'#fff', 'font-size': Math.max(8, Math.min(11, layer.h*0.38)), 'font-family':'Noto Sans JP,sans-serif', 'font-weight':'700', opacity:0.9 });
    t.style.pointerEvents = 'none';
    t.textContent = layer.name;
    g.appendChild(t);

    g.addEventListener('mouseenter', () => { border.setAttribute('stroke', '#06b6d4'); rect.style.filter = 'brightness(1.25)'; });
    g.addEventListener('mouseleave', () => { border.setAttribute('stroke', 'transparent'); rect.style.filter = ''; });
    g.addEventListener('click', () => showLayerDetail(layer));
  });

  wrap.appendChild(svg);
  wrap.appendChild(el('p', 'svg-hint', '← 各層をクリックして材料・装置・サプライヤー・技術課題を表示'));
}

// ── LAYER DETAIL PANEL ───────────────────────────────────────────────────
function showLayerDetail(layer) {
  const panel = document.getElementById('drill-panel') || document.getElementById('layer-panel');
  if (!panel) return;

  const matCards = (layer.materials||[]).map(m=>{
    const suppliers = (Array.isArray(m.supplier)?m.supplier:[m.supplier]);
    const specsLine = m.specs ? `<span class="mat-specs-inline">${m.specs}</span>` : '';
    return `<div class="mat-card">
      <span class="mat-name">${m.name}</span>
      ${specsLine}
      <div class="mat-role-text">${m.role||''}</div>
      <div class="mat-suppliers">${suppliers.map(s=>`<span class="badge">${s}</span>`).join('')}</div>
    </div>`;
  }).join('');

  const eqCards = (layer.equipment||[]).map(e=>{
    const makers = (e.maker||[]);
    return `<div class="eq-card">
      <div class="eq-name">${e.name}</div>
      <div class="mat-suppliers">${makers.map(m=>`<span class="badge badge-blue">${m}</span>`).join('')}</div>
    </div>`;
  }).join('');

  const specsBar = layer.specs ? `<div class="panel-specs">${layer.specs}</div>` : '';
  const newsUrl = `https://www.google.com/search?q=${encodeURIComponent(layer.newsQuery||layer.name+' semiconductor 2025')}&tbm=nws`;

  panel.innerHTML = `
    <div class="panel-header">
      <div>
        <h3 class="panel-title">${layer.name}</h3>
        <p class="panel-subtitle">${layer.nameEn||''}</p>
      </div>
      <button class="panel-close" onclick="(document.getElementById('drill-panel')||document.getElementById('layer-panel')||{}).innerHTML='<div class=panel-placeholder><div class=hint-arrow>←</div><p>要素をクリックして詳細を表示</p></div>'">✕</button>
    </div>
    ${specsBar}
    <div class="panel-role">${layer.role||''}</div>
    ${matCards?`<div class="panel-section"><h4 class="panel-section-title">🧪 材料 & サプライヤー</h4><div class="mat-list">${matCards}</div></div>`:''}
    ${eqCards?`<div class="panel-section"><h4 class="panel-section-title">⚙️ 装置 & メーカー</h4><div class="eq-list">${eqCards}</div></div>`:''}
    ${(layer.processes||[]).length?`<div class="panel-section"><h4 class="panel-section-title">🔄 主要プロセス</h4><ol class="process-list">${layer.processes.map(p=>`<li>${p}</li>`).join('')}</ol></div>`:''}
    ${(layer.challenges||[]).length?`<div class="panel-section"><h4 class="panel-section-title">⚠️ 技術課題</h4><ul class="challenge-list">${layer.challenges.map(c=>`<li>${c}</li>`).join('')}</ul></div>`:''}
    <div class="panel-section"><a href="${newsUrl}" target="_blank" rel="noopener" class="news-link-btn">📰 関連ニュースを検索 →</a></div>`;
}

// ── PROCESS CARDS ─────────────────────────────────────────────────────────
function buildProcessCards() {
  const el = document.getElementById('process-cards');
  if (!el) return;
  el.innerHTML = DATA.processes.map(p=>`
    <div class="process-card" onclick="showProcessDetail('${p.id}')">
      <div class="process-icon">${p.icon}</div>
      <h3 class="process-name">${p.name}</h3>
      <p class="process-desc">${p.description}</p>
      <div class="process-suppliers">${p.keySuppliers.slice(0,4).map(s=>`<span class="badge">${s}</span>`).join('')}</div>
      <div class="process-cta">詳細 →</div>
    </div>`).join('');
}

function showProcessDetail(id) {
  const p = DATA.processes.find(x=>x.id===id);
  if(!p) return;
  const matRows = p.materials.map(m=>`<tr><td class="td-name">${m.name}</td><td>${(Array.isArray(m.supplier)?m.supplier:[m.supplier]).map(s=>`<span class="badge">${s}</span>`).join('')}</td></tr>`).join('');
  const eqRows = p.equipment.map(e=>`<tr><td class="td-name">${e.name}</td><td>${(Array.isArray(e.supplier)?e.supplier:[e.supplier]).map(s=>`<span class="badge badge-blue">${s}</span>`).join('')}</td></tr>`).join('');
  const newsUrl = `https://www.google.com/search?q=${encodeURIComponent(p.newsQuery)}&tbm=nws`;
  showModal(`
    <h2 class="modal-title">${p.icon} ${p.name}</h2>
    <p class="modal-desc">${p.description}</p>
    <h4 class="modal-section-title">🧪 材料 & サプライヤー</h4>
    <div class="table-wrap"><table class="info-table"><thead><tr><th>材料</th><th>主要サプライヤー</th></tr></thead><tbody>${matRows}</tbody></table></div>
    <h4 class="modal-section-title">⚙️ 装置 & メーカー</h4>
    <div class="table-wrap"><table class="info-table"><thead><tr><th>装置</th><th>主要メーカー</th></tr></thead><tbody>${eqRows}</tbody></table></div>
    <a href="${newsUrl}" target="_blank" rel="noopener" class="news-link-btn" style="margin-top:1rem;display:inline-flex">📰 関連ニュースを検索 →</a>`);
}

// ── SUPPLY CHAIN ──────────────────────────────────────────────────────────
// ── DEVICE SECTION — 芋づる式デバイス構造 ─────────────────────────────────
const CHAIN_APP_META = {
  'ai-server':       { icon: '🖥️', name: 'AIサーバー GPU',        desc: 'NVIDIA B200/H100 — CoWoS + HBM3e + FC-BGA (ABF 8L+)', device: 'server' },
  'smartphone':      { icon: '📱', name: 'スマートフォン',          desc: 'Apple A18 Pro / Snapdragon 8 Elite — InFO PoP + SLP基板', device: 'smartphone' },
  'automotive':      { icon: '🚗', name: '車載 ADAS / EV',         desc: 'NVIDIA Orin + SiCパワーモジュール — AEC-Q100高信頼性基板', device: 'server' },
  'antenna':         { icon: '📡', name: 'RF / 5G LTCC・Rogers',   desc: 'RFIC + LTCC基板 + Rogers高周波基板 (セラミック・PTFE系)', device: 'smartphone' },
  'antenna-organic': { icon: '📶', name: 'AiP 有機基板 (mmWave)',  desc: '低損失有機多層基板 (Megtron 7N/ABF-GX92) にRFICをFC実装', device: 'smartphone' },
  'antenna-glass':   { icon: '🔷', name: 'AiP ガラス基板 (TGV)',   desc: '次世代ガラスコア基板 — TGV貫通電極+Dk=3.7-5.5 超低損失', device: 'smartphone' },
  'datacenter':      { icon: '🔌', name: 'DC スイッチ / 光',       desc: 'Broadcom Tomahawk5 + シリコンフォトニクス', device: 'server' },
  'wearable':        { icon: '⌚', name: 'ウェアラブル SiP',        desc: 'Apple Watch S9 — FOWLP + コアレス超薄型 SiP', device: 'smartphone' },
  'coreless':        { icon: '🔲', name: 'コアレス FC-BGA 3Chiplet', desc: 'Compute+GPU+IO — BTコアなし ABFのみの次世代基板 (Intel Meteor Lake型)', device: 'server' },
  'memory-dimm':     { icon: '🧮', name: 'DDR5 RDIMM',             desc: 'DDR5 DRAM — FBGA + RDIMMモジュール PCB + エッジコネクタ', device: 'server' },
  'fpc':             { icon: '📏', name: 'フレキシブル基板 (FPC)',   desc: 'PI ベースフィルム + Cu 配線 + カバーレイ — スマートフォン内配線', device: 'smartphone' },
};

// ── VIS TYPE HELPERS ────────────────────────────────────────────────────────
function deriveVis(layer) {
  if (layer.vis) return layer.vis;
  const id = layer.id, cat = layer.category;
  if (cat === 'memory') return 'memory';
  if (cat === 'die') return 'die';
  if (cat === 'interposer') return 'interposer';
  if (cat === 'underfill') return 'underfill';
  if (cat === 'rdl') return 'rdl';
  if (id.includes('bga') || id.includes('lga') || id.includes('ball') || id.includes('pad')) return 'bga';
  if (id.includes('enig')) return 'enig';
  if (id.startsWith('sr_') || (id.includes('_sr') && !id.includes('enig'))) return 'sr';
  if (id.startsWith('cu_') && !id.includes('abf')) return 'cu';
  if (id.includes('abf')) return 'abf';
  if (id.includes('core') || id === 'slp_substrate' || id === 'fc_bga_auto') return 'core';
  if (id.includes('pcb')) return 'pcb';
  if (id.includes('ltcc')) return 'ltcc';
  if (id.includes('glass')) return 'glass';
  if (id.includes('rogers') || id.includes('ptfe')) return 'rogers';
  if (id.includes('bump') || cat === 'bump') return 'bump';
  if (id.includes('patch') || id.includes('antenna')) return 'antenna';
  if (id.startsWith('fpc_')) return 'fpc';
  if (cat === 'pcb') return 'pcb';
  if (cat === 'substrate') return 'abf';
  return 'abf';
}

const XS_VH = {
  die:58, memory:52, interposer:42, underfill:11, rdl:24,
  cu:13, abf:28, sr:11, enig:8, core:56, bga:30, pcb:48,
  ltcc:40, glass:40, rogers:30, bump:14, antenna:20, fpc:18
};

function buildDeviceSection() {
  if (!EXTENDED_DATA?.substrateLayers) return;
  const root = document.getElementById('device-section-root');
  const keys = Object.keys(EXTENDED_DATA.substrateLayers);

  root.innerHTML = `
    <div class="chain-app-bar" id="chain-app-list">
      ${keys.map((k, i) => `
        <button class="chain-app-btn ${i===0?'active':''}" data-appid="${k}">
          <span class="chain-app-icon">${CHAIN_APP_META[k]?.icon||'📦'}</span>
          ${CHAIN_APP_META[k]?.name||k}
        </button>`).join('')}
    </div>
    <div class="device-main-grid">
      <div class="device-schematic-col">
        <div class="device-schematic-label">📐 デバイス全体像
          <span style="font-size:0.65rem;color:var(--muted);font-weight:400"> — コンポーネントをクリックで断面へ</span>
        </div>
        <div id="device-schematic-wrap" class="device-schematic-wrap"></div>
        <div class="device-schematic-hint">↑ クリック → 断面ドリルダウン (モーダル)</div>
      </div>
      <div class="chain-center" id="chain-center">
        <div class="chain-app-header" id="chain-header"></div>
        <div class="chain-stack" id="chain-stack"></div>
      </div>
      <div class="chain-detail-panel" id="chain-detail-panel">
        <div class="panel-placeholder">
          <div class="hint-arrow">←</div>
          <p>レイヤーをクリックすると<br>詳細を表示</p>
          <p style="font-size:0.72rem;color:var(--muted);margin-top:0.25rem">材料・スペック・<br>サプライヤー・プロセス</p>
        </div>
      </div>
    </div>`;

  root.querySelector('#chain-app-list').addEventListener('click', e => {
    const btn = e.target.closest('.chain-app-btn');
    if (!btn || !btn.dataset.appid) return;
    root.querySelectorAll('.chain-app-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const id = btn.dataset.appid;
    showChainApp(id);
    updateDeviceSchematic(id);
  });

  root.querySelector('#chain-center').addEventListener('click', e => {
    const row = e.target.closest('.chain-layer');
    if (!row) return;
    showChainLayerDetail(row.dataset.appid, row.dataset.layerid);
  });

  showChainApp('ai-server');
  updateDeviceSchematic('ai-server');
}

function updateDeviceSchematic(appId) {
  const wrap = document.getElementById('device-schematic-wrap');
  if (!wrap) return;
  wrap.innerHTML = '';
  const meta = CHAIN_APP_META[appId] || {};
  const device = meta.device || 'smartphone';
  const W = 680, H = 400;
  const svg = makeSVG(W, H);
  if (device === 'server') drawServer(svg, W, H);
  else if (device === 'smartphone') drawSmartphone(svg, W, H);
  else drawPC(svg, W, H);
  wrap.appendChild(svg);
}

function showChainApp(id) {
  const layers = EXTENDED_DATA.substrateLayers[id];
  if (!layers) return;
  const meta = CHAIN_APP_META[id] || { icon: '📦', name: id, desc: '' };

  document.getElementById('chain-header').innerHTML = `
    <h3>${meta.icon} ${meta.name}</h3>
    <p>${meta.desc}</p>`;

  const stackEl = document.getElementById('chain-stack');
  stackEl.style.cssText = 'padding:0;background:transparent;overflow:hidden';
  stackEl.innerHTML = '<div id="xs-wrap" style="overflow-y:auto;max-height:650px;border-radius:8px;background:#0d1520"></div>';
  drawSubstrateCrossSection(id, layers, document.getElementById('xs-wrap'));

  document.getElementById('chain-detail-panel').innerHTML = `
    <div class="panel-placeholder">
      <div class="hint-arrow">←</div>
      <p>レイヤーをクリックすると<br>詳細を表示</p>
      <p style="font-size:0.72rem;color:var(--muted);margin-top:0.25rem">材料・スペック・<br>サプライヤー・プロセス</p>
    </div>`;
}

// ── SVG CROSS-SECTION RENDERER ──────────────────────────────────────────────
function drawSubstrateCrossSection(appId, layers, container) {
  const NS = 'http://www.w3.org/2000/svg';
  const W = 520, CS_X0 = 6, CS_X1 = 312, LBL_X = 320;
  const CS_W = CS_X1 - CS_X0;

  function lh(l) { return XS_VH[deriveVis(l)] || 28; }

  // Group adjacent die/memory layers to render side-by-side (like reference images)
  const groups = [];
  let i = 0;
  while (i < layers.length) {
    const v = deriveVis(layers[i]);
    if ((v === 'die' || v === 'memory') && i + 2 < layers.length) {
      const v2 = deriveVis(layers[i + 1]), v3 = deriveVis(layers[i + 2]);
      if ((v2 === 'die' || v2 === 'memory') && (v3 === 'die' || v3 === 'memory')) {
        groups.push({ type: 'triple', a: layers[i], b: layers[i + 1], c: layers[i + 2] });
        i += 3; continue;
      }
    }
    if ((v === 'die' || v === 'memory') && i + 1 < layers.length) {
      const v2 = deriveVis(layers[i + 1]);
      if (v2 === 'die' || v2 === 'memory') {
        groups.push({ type: 'pair', a: layers[i], b: layers[i + 1] });
        i += 2; continue;
      }
    }
    groups.push({ type: 'single', layer: layers[i] });
    i++;
  }

  // Calculate Y for each group
  const groupY = [];
  let cy = 24;
  function groupH(g) {
    if (g.type === 'triple') return Math.max(lh(g.a), lh(g.b), lh(g.c)) + 2;
    if (g.type === 'pair')   return Math.max(lh(g.a), lh(g.b)) + 2;
    return lh(g.layer);
  }
  groups.forEach(g => {
    groupY.push(cy);
    cy += groupH(g);
  });
  const totalH = cy + 18;

  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', `0 0 ${W} ${totalH}`);
  svg.style.cssText = 'width:100%;display:block;background:#0d1520';

  // ── Draw via columns through substrate zone (background) ──────────────────
  const subVis = new Set(['abf','cu','sr','enig','core','glass','rdl','ltcc','rogers','antenna']);
  let svY1 = null, svY2 = null;
  groups.forEach((g, gi) => {
    const v = g.type === 'single' ? deriveVis(g.layer) : 'die';
    if (subVis.has(v)) { if (svY1 === null) svY1 = groupY[gi]; svY2 = groupY[gi] + groupH(g); }
  });
  if (svY1 !== null) {
    [0.22, 0.5, 0.78].forEach(f => {
      const vx = CS_X0 + CS_W * f;
      const viaLine = document.createElementNS(NS, 'line');
      viaLine.setAttribute('x1', vx); viaLine.setAttribute('y1', svY1);
      viaLine.setAttribute('x2', vx); viaLine.setAttribute('y2', svY2);
      viaLine.setAttribute('stroke', '#f97316'); viaLine.setAttribute('stroke-width', '1.5');
      viaLine.setAttribute('stroke-opacity', '0.28');
      viaLine.style.pointerEvents = 'none';
      svg.appendChild(viaLine);
    });
  }

  // ── Track rects for highlight ────────────────────────────────────────────
  const rects = {};
  const labelData = [];

  function addLayerGroup(layer, x, y, w, h) {
    const v = deriveVis(layer);
    const g = document.createElementNS(NS, 'g');
    g.style.cursor = 'pointer';

    if (v === 'bga') {
      // Render as actual solder ball spheres
      const nBalls = Math.max(5, Math.floor(w / 26));
      const sp = w / nBalls, bR = 10;
      for (let b = 0; b < nBalls; b++) {
        const bx = x + (b + 0.5) * sp;
        const bcy = y + bR + 2;
        const shadow = document.createElementNS(NS, 'ellipse');
        shadow.setAttribute('cx', bx + 1.5); shadow.setAttribute('cy', bcy + 4);
        shadow.setAttribute('rx', bR - 1); shadow.setAttribute('ry', 4);
        shadow.setAttribute('fill', 'rgba(0,0,0,0.35)'); shadow.style.pointerEvents = 'none';
        g.appendChild(shadow);
        const ball = document.createElementNS(NS, 'circle');
        ball.setAttribute('cx', bx); ball.setAttribute('cy', bcy);
        ball.setAttribute('r', bR); ball.setAttribute('fill', '#94a3b8');
        ball.setAttribute('stroke', '#cbd5e1'); ball.setAttribute('stroke-width', '0.8');
        g.appendChild(ball);
        const hl = document.createElementNS(NS, 'circle');
        hl.setAttribute('cx', bx - 3); hl.setAttribute('cy', bcy - 4);
        hl.setAttribute('r', 3.5); hl.setAttribute('fill', 'rgba(255,255,255,0.38)');
        hl.style.pointerEvents = 'none'; g.appendChild(hl);
      }
      // invisible hit area
      const hit = document.createElementNS(NS, 'rect');
      hit.setAttribute('x', x); hit.setAttribute('y', y);
      hit.setAttribute('width', w); hit.setAttribute('height', h);
      hit.setAttribute('fill', 'rgba(0,0,0,0.01)'); hit.setAttribute('rx', '0');
      rects[layer.id] = hit; g.appendChild(hit);
      g.addEventListener('mouseenter', () => hit.setAttribute('fill', 'rgba(34,211,238,0.07)'));
      g.addEventListener('mouseleave', () => { if (svg.dataset.sel !== layer.id) hit.setAttribute('fill', 'rgba(0,0,0,0.01)'); });
    } else {
      const rect = document.createElementNS(NS, 'rect');
      rect.setAttribute('x', x); rect.setAttribute('y', y);
      rect.setAttribute('width', w); rect.setAttribute('height', h);
      rect.setAttribute('fill', layer.color || '#334155'); rect.setAttribute('rx', '2');
      rect.setAttribute('stroke', 'rgba(255,255,255,0.14)'); rect.setAttribute('stroke-width', '1');
      rects[layer.id] = rect; g.appendChild(rect);

      drawXsPattern(g, v, x, x + w, y, h, layer.color || '#334155', NS);

      if (h >= 16) {
        const nm = layer.name.length > 16 ? layer.name.slice(0, 15) + '…' : layer.name;
        const ft = document.createElementNS(NS, 'text');
        ft.setAttribute('x', x + 6); ft.setAttribute('y', y + h / 2 + 4);
        ft.setAttribute('fill', 'rgba(255,255,255,0.88)');
        ft.setAttribute('font-size', h >= 30 ? '9' : '8');
        ft.setAttribute('font-family', 'Noto Sans JP,sans-serif');
        ft.setAttribute('font-weight', '700'); ft.style.pointerEvents = 'none';
        ft.textContent = nm; g.appendChild(ft);
      }
      g.addEventListener('mouseenter', () => {
        rect.setAttribute('stroke', '#22d3ee'); rect.setAttribute('stroke-width', '2');
        rect.style.filter = 'brightness(1.28)';
      });
      g.addEventListener('mouseleave', () => {
        const sel = svg.dataset.sel === layer.id;
        rect.setAttribute('stroke', sel ? '#22d3ee' : 'rgba(255,255,255,0.14)');
        rect.setAttribute('stroke-width', sel ? '2' : '1');
        rect.style.filter = '';
      });
    }

    g.addEventListener('click', () => {
      Object.values(rects).forEach(r => {
        r.setAttribute('stroke', 'rgba(255,255,255,0.14)'); r.setAttribute('stroke-width', '1');
        r.style.filter = '';
      });
      const r = rects[layer.id];
      r.setAttribute('stroke', '#22d3ee'); r.setAttribute('stroke-width', '2');
      svg.dataset.sel = layer.id;
      showChainLayerDetail(appId, layer.id);
    });

    return g;
  }

  // ── Render each group ──────────────────────────────────────────────────────
  groups.forEach((grp, gi) => {
    const gy = groupY[gi];

    if (grp.type === 'triple') {
      const [a, b, c] = [grp.a, grp.b, grp.c];
      const gh = Math.max(lh(a), lh(b), lh(c)) + 2;
      const gap = 3, dieW = Math.floor((CS_W - 2 * gap) / 3);
      const cW = CS_W - 2 * dieW - 2 * gap;
      const aX = CS_X0, bX = CS_X0 + dieW + gap, cX = CS_X0 + 2 * (dieW + gap);
      svg.appendChild(addLayerGroup(a, aX, gy + Math.round((gh - lh(a)) / 2), dieW, lh(a)));
      svg.appendChild(addLayerGroup(b, bX, gy + Math.round((gh - lh(b)) / 2), dieW, lh(b)));
      svg.appendChild(addLayerGroup(c, cX, gy + Math.round((gh - lh(c)) / 2), cW, lh(c)));
      [a, b, c].forEach(l => labelData.push({ srcY: gy + lh(l) / 2, name: l.name.length > 22 ? l.name.slice(0, 21) + '…' : l.name }));
    } else if (grp.type === 'pair') {
      const [a, b] = [grp.a, grp.b];
      const gh = Math.max(lh(a), lh(b)) + 2;
      // Memory (40%) | gap | Logic die (60%)
      const isAMem = deriveVis(a) === 'memory';
      const [memL, dieL] = isAMem ? [a, b] : [b, a];
      const memW = Math.round(CS_W * 0.38), gap = 4, dieW = CS_W - memW - gap;
      const memX = CS_X0, dieX = CS_X0 + memW + gap;
      const memY = gy + Math.round((gh - lh(memL)) / 2);
      const dieY = gy + Math.round((gh - lh(dieL)) / 2);
      svg.appendChild(addLayerGroup(memL, memX, memY, memW, lh(memL)));
      svg.appendChild(addLayerGroup(dieL, dieX, dieY, dieW, lh(dieL)));
      labelData.push({ srcY: gy + lh(memL) / 2, name: memL.name.length > 22 ? memL.name.slice(0, 21) + '…' : memL.name });
      labelData.push({ srcY: gy + lh(dieL) / 2, name: dieL.name.length > 22 ? dieL.name.slice(0, 21) + '…' : dieL.name });
    } else {
      const layer = grp.layer;
      svg.appendChild(addLayerGroup(layer, CS_X0, gy, CS_W, lh(layer)));
      labelData.push({ srcY: gy + lh(layer) / 2, name: layer.name.length > 22 ? layer.name.slice(0, 21) + '…' : layer.name });
    }
  });

  // ── Right-side labels with collision avoidance ──────────────────────────
  const resolved = labelData.map(l => ({ ...l, y: l.srcY }));
  for (let pass = 0; pass < 12; pass++) {
    for (let j = 1; j < resolved.length; j++) {
      if (resolved[j].y - resolved[j - 1].y < 11) {
        const mid = (resolved[j].y + resolved[j - 1].y) / 2;
        resolved[j - 1].y = mid - 5.5; resolved[j].y = mid + 5.5;
      }
    }
  }
  resolved.forEach((lb, idx) => {
    const sy = labelData[idx].srcY;
    const path = document.createElementNS(NS, 'path');
    path.setAttribute('d', `M${CS_X1 + 2},${sy} C${CS_X1 + 12},${sy} ${LBL_X + 2},${lb.y} ${LBL_X + 5},${lb.y}`);
    path.setAttribute('fill', 'none'); path.setAttribute('stroke', '#2d3f56'); path.setAttribute('stroke-width', '0.9');
    path.style.pointerEvents = 'none'; svg.appendChild(path);
    const lt = document.createElementNS(NS, 'text');
    lt.setAttribute('x', LBL_X + 8); lt.setAttribute('y', lb.y + 3.5);
    lt.setAttribute('fill', '#8da0b8'); lt.setAttribute('font-size', '8');
    lt.setAttribute('font-family', 'Noto Sans JP,sans-serif'); lt.style.pointerEvents = 'none';
    lt.textContent = lb.name; svg.appendChild(lt);
  });

  // ── Title ─────────────────────────────────────────────────────────────────
  const title = document.createElementNS(NS, 'text');
  title.setAttribute('x', CS_X0 + CS_W / 2); title.setAttribute('y', 13);
  title.setAttribute('text-anchor', 'middle'); title.setAttribute('fill', '#64748b');
  title.setAttribute('font-size', '8.5'); title.setAttribute('font-family', 'sans-serif');
  title.style.pointerEvents = 'none';
  title.textContent = '← クリックで材料・サプライヤー詳細を表示';
  svg.insertBefore(title, svg.firstChild);

  container.innerHTML = '';
  container.appendChild(svg);
}

// ── LAYER VISUAL PATTERN DRAWING ───────────────────────────────────────────
function drawXsPattern(g, vis, x0, x1, y, h, baseColor, NS) {
  const W = x1 - x0;
  const add = el => { el.style.pointerEvents = 'none'; g.appendChild(el); };

  function line(x1_, y1_, x2_, y2_, stroke, sw, dasharray) {
    const el = document.createElementNS(NS, 'line');
    el.setAttribute('x1', x1_); el.setAttribute('y1', y1_);
    el.setAttribute('x2', x2_); el.setAttribute('y2', y2_);
    el.setAttribute('stroke', stroke); el.setAttribute('stroke-width', sw);
    if (dasharray) el.setAttribute('stroke-dasharray', dasharray);
    add(el);
  }
  function rect(rx, ry, rw, rh, fill, rx2, stroke, sw) {
    const el = document.createElementNS(NS, 'rect');
    el.setAttribute('x', rx); el.setAttribute('y', ry);
    el.setAttribute('width', rw); el.setAttribute('height', rh);
    el.setAttribute('fill', fill); if (rx2) el.setAttribute('rx', rx2);
    if (stroke) { el.setAttribute('stroke', stroke); el.setAttribute('stroke-width', sw || '1'); }
    add(el);
  }
  function circle(cx, cy, r, fill, stroke, sw) {
    const el = document.createElementNS(NS, 'circle');
    el.setAttribute('cx', cx); el.setAttribute('cy', cy); el.setAttribute('r', r);
    el.setAttribute('fill', fill);
    if (stroke) { el.setAttribute('stroke', stroke); el.setAttribute('stroke-width', sw || '1'); }
    add(el);
  }
  function text(tx, ty, txt, fill, fs) {
    const el = document.createElementNS(NS, 'text');
    el.setAttribute('x', tx); el.setAttribute('y', ty);
    el.setAttribute('fill', fill); el.setAttribute('font-size', fs || '8');
    el.setAttribute('font-family', 'sans-serif'); el.setAttribute('text-anchor', 'middle');
    el.textContent = txt; add(el);
  }

  if (vis === 'die' || vis === 'interposer') {
    // Horizontal IC metal layer lines
    const nL = Math.max(2, Math.floor(h / 9));
    for (let j = 1; j <= nL; j++) line(x0 + 4, y + j * h / (nL + 1), x1 - 4, y + j * h / (nL + 1), 'rgba(255,255,255,0.1)', 0.8);
    if (vis === 'die' && h > 28) {
      // IC cell blocks
      for (let cx = x0 + 8; cx < x1 - 20; cx += 22) {
        for (let cy2 = y + 7; cy2 < y + h - 10; cy2 += 13)
          rect(cx, cy2, 18, 9, 'rgba(255,255,255,0.07)', '1');
      }
    }
    if (vis === 'interposer') {
      // TSV columns
      for (let t = 0.18; t <= 0.85; t += 0.16) {
        const tx2 = x0 + W * t;
        line(tx2, y + 2, tx2, y + h - 2, '#f97316', 1.2, '');
        circle(tx2, y + 4, 2.5, '#f97316', null);
        circle(tx2, y + h - 4, 2.5, '#f97316', null);
      }
    }
  }

  if (vis === 'memory') {
    // Stacked die separators
    const nD = 4;
    for (let d = 1; d < nD; d++) {
      const dy = y + d * h / nD;
      line(x0, dy, x1, dy, 'rgba(255,255,255,0.22)', 0.8, '3,2');
    }
    // TSV columns
    for (let t = 0.15; t <= 0.9; t += 0.15) {
      const tx2 = x0 + W * t;
      line(tx2, y + 2, tx2, y + h - 2, '#f97316', 1, '');
    }
  }

  if (vis === 'cu') {
    // Copper trace zigzag pattern
    const nT = Math.floor(W / 20);
    for (let t = 0; t < nT; t++) {
      const tx2 = x0 + 8 + t * 20;
      const my = y + h / 2;
      const el = document.createElementNS(NS, 'path');
      el.setAttribute('d', `M${tx2},${my - 3} L${tx2 + 5},${my} L${tx2 + 10},${my - 3} L${tx2 + 15},${my}`);
      el.setAttribute('fill', 'none'); el.setAttribute('stroke', '#f97316');
      el.setAttribute('stroke-width', '1.5'); el.setAttribute('opacity', '0.85');
      add(el);
    }
  }

  if (vis === 'abf') {
    // Via hole circles at 3 positions
    [0.22, 0.5, 0.78].forEach(f => {
      const vx = x0 + W * f;
      circle(vx, y + 3.5, 3, '#f97316', null); circle(vx, y + 3.5, 3, 'none', '#f97316', '0.8');
      circle(vx, y + h - 3.5, 3, '#f97316', null); circle(vx, y + h - 3.5, 3, 'none', '#f97316', '0.8');
      // Via fill column
      const vEl = document.createElementNS(NS, 'rect');
      vEl.setAttribute('x', vx - 1.5); vEl.setAttribute('y', y + 3.5);
      vEl.setAttribute('width', 3); vEl.setAttribute('height', h - 7);
      vEl.setAttribute('fill', '#f97316'); vEl.setAttribute('opacity', '0.5');
      add(vEl);
    });
  }

  if (vis === 'core') {
    // PTH circles
    [0.18, 0.38, 0.62, 0.82].forEach(f => {
      const px = x0 + W * f;
      rect(px - 3, y + 4, 6, h - 8, '#0f172a', '1', null);
      circle(px, y + 4, 3.5, '#0f172a', '#f97316', '1.5');
      circle(px, y + h - 4, 3.5, '#0f172a', '#f97316', '1.5');
      line(px, y + 4, px, y + h - 4, '#f97316', 1.2);
    });
    // Horizontal prepreg lines
    [0.33, 0.67].forEach(f => line(x0 + 2, y + h * f, x1 - 2, y + h * f, 'rgba(255,255,255,0.1)', 0.8));
  }

  if (vis === 'sr') {
    // PAD openings in solder mask
    for (let sx = x0 + 18; sx < x1 - 18; sx += 38)
      rect(sx, y + 2, 14, h - 4, '#0f172a', '1', null);
  }

  if (vis === 'enig') {
    // Gold surface line
    const el = document.createElementNS(NS, 'line');
    el.setAttribute('x1', x0 + 3); el.setAttribute('y1', y + h / 2);
    el.setAttribute('x2', x1 - 3); el.setAttribute('y2', y + h / 2);
    el.setAttribute('stroke', '#fbbf24'); el.setAttribute('stroke-width', '2.5');
    el.setAttribute('opacity', '0.75'); add(el);
    // Ni tick marks
    for (let ex = x0 + 14; ex < x1 - 10; ex += 20) {
      line(ex, y + 1, ex, y + h - 1, 'rgba(200,200,200,0.2)', 0.8);
    }
  }

  if (vis === 'pcb') {
    // PCB copper layer lines (simulating inner layers)
    const nL = Math.max(3, Math.floor(h / 11));
    for (let pl = 1; pl <= nL; pl++) {
      const ply = y + pl * h / (nL + 1);
      line(x0 + 4, ply, x1 - 4, ply, 'rgba(249,115,22,0.2)', 1.2);
    }
    // Vertical drill holes
    [0.25, 0.5, 0.75].forEach(f => {
      line(x0 + W * f, y + 2, x0 + W * f, y + h - 2, 'rgba(249,115,22,0.15)', 1.5, '3,3');
    });
  }

  if (vis === 'ltcc') {
    // Ag conductor lines (internal)
    const nAg = Math.floor(h / 11);
    for (let a = 1; a <= nAg; a++) {
      const aly = y + a * h / (nAg + 1);
      line(x0 + 8, aly, x1 - 8, aly, 'rgba(220,220,240,0.45)', 1);
    }
    // Antenna zigzag at top
    let d = `M${x0 + 12},${y + 4}`;
    for (let ax = x0 + 20; ax < x1 - 12; ax += 14) d += ` L${ax},${y + h - 5} L${ax + 7},${y + 4}`;
    const p = document.createElementNS(NS, 'path');
    p.setAttribute('d', d); p.setAttribute('fill', 'none');
    p.setAttribute('stroke', '#fbbf24'); p.setAttribute('stroke-width', '1.2');
    p.setAttribute('opacity', '0.65'); add(p);
  }

  if (vis === 'glass') {
    // Glass sheen overlay
    rect(x0, y, W, h, 'rgba(186,230,253,0.07)', '2', null);
    // TGV ellipses
    [0.22, 0.5, 0.78].forEach(f => {
      const gx = x0 + W * f;
      const el = document.createElementNS(NS, 'ellipse');
      el.setAttribute('cx', gx); el.setAttribute('cy', y + h / 2);
      el.setAttribute('rx', '3'); el.setAttribute('ry', Math.min(h / 2 - 2, 16));
      el.setAttribute('fill', '#f97316'); el.setAttribute('opacity', '0.55'); add(el);
      // TGV cap circles
      circle(gx, y + 3, 3, '#f97316', null); circle(gx, y + h - 3, 3, '#f97316', null);
    });
    // Horizontal grain lines
    for (let gl = 1; gl <= 2; gl++) line(x0 + 4, y + gl * h / 3, x1 - 4, y + gl * h / 3, 'rgba(186,230,253,0.12)', 0.8);
  }

  if (vis === 'rogers') {
    // Substrate base lines
    line(x0 + 4, y + h * 0.35, x1 - 4, y + h * 0.35, 'rgba(255,255,255,0.1)', 0.8);
    line(x0 + 4, y + h * 0.65, x1 - 4, y + h * 0.65, 'rgba(255,255,255,0.1)', 0.8);
    // Antenna patch rectangle
    const pW = Math.min(80, W * 0.45), pX = x0 + (W - pW) / 2;
    rect(pX, y + 3, pW, h - 6, '#f97316', '2', null);
    const feed = document.createElementNS(NS, 'line');
    feed.setAttribute('x1', x0 + W / 2); feed.setAttribute('y1', y + 3);
    feed.setAttribute('x2', x0 + W / 2); feed.setAttribute('y2', y);
    feed.setAttribute('stroke', '#f97316'); feed.setAttribute('stroke-width', '2');
    feed.setAttribute('opacity', '0.7'); add(feed);
  }

  if (vis === 'antenna') {
    // Antenna patch array with feed lines
    const nP = Math.max(2, Math.floor(W / 55));
    const pW = Math.floor((W - (nP + 1) * 8) / nP);
    for (let p = 0; p < nP; p++) {
      const px = x0 + 8 + p * (pW + 8);
      rect(px, y + 3, pW, h - 6, 'rgba(249,115,22,0.55)', '2', '#f97316', '0.8');
      line(px + pW / 2, y, px + pW / 2, y + 3, '#f97316', 2);
      line(px + pW / 2, y + h - 3, px + pW / 2, y + h, '#f97316', 2);
    }
    // Feed network connecting all patches
    line(x0 + 6, y + h / 2, x1 - 6, y + h / 2, 'rgba(249,115,22,0.3)', 1, '');
  }

  if (vis === 'rdl') {
    // Fan-out routing lines
    const nF = 6;
    for (let f = 0; f < nF; f++) {
      const fx1 = x0 + W * 0.2 + f * W * 0.6 / nF;
      const fx2 = x0 + W * 0.08 + f * W * 0.84 / nF;
      const el = document.createElementNS(NS, 'line');
      el.setAttribute('x1', fx1); el.setAttribute('y1', y);
      el.setAttribute('x2', fx2); el.setAttribute('y2', y + h);
      el.setAttribute('stroke', '#06b6d4'); el.setAttribute('stroke-width', '1');
      el.setAttribute('opacity', '0.45'); add(el);
    }
  }

  if (vis === 'underfill') {
    // Stipple dots
    for (let ux = x0 + 10; ux < x1 - 10; ux += 11) {
      circle(ux, y + h / 2, 1.5, 'rgba(253,186,116,0.45)', null);
    }
  }

  if (vis === 'bump') {
    // Cu Pillar bumps
    const nB = Math.floor(W / 18);
    for (let b = 0; b < nB; b++) {
      const bx = x0 + (b + 0.5) * W / nB;
      rect(bx - 3, y + 2, 6, h - 4, '#d97706', '1', null);
      circle(bx, y + 2, 3, '#f59e0b', null);
    }
  }

  if (vis === 'fpc') {
    // Polyimide film: amber tint + horizontal grain lines
    rect(x0, y, W, h, 'rgba(251,191,36,0.10)', '0', null);
    const nGrain = Math.max(2, Math.floor(h / 6));
    for (let gl = 1; gl < nGrain; gl++)
      line(x0 + 4, y + gl * h / nGrain, x1 - 4, y + gl * h / nGrain, 'rgba(251,191,36,0.18)', 0.6);
    // Edge wave to indicate flexibility
    let dPath = `M${x0 + 4},${y + h / 2}`;
    for (let wx = x0 + 14; wx < x1 - 8; wx += 18)
      dPath += ` Q${wx},${y + 2} ${wx + 9},${y + h / 2} Q${wx + 18},${y + h - 2} ${wx + 18},${y + h / 2}`;
    const waveEl = document.createElementNS(NS, 'path');
    waveEl.setAttribute('d', dPath); waveEl.setAttribute('fill', 'none');
    waveEl.setAttribute('stroke', 'rgba(251,191,36,0.28)'); waveEl.setAttribute('stroke-width', '1');
    add(waveEl);
  }
}

function showChainLayerDetail(appId, layerId) {
  const layers = EXTENDED_DATA.substrateLayers[appId];
  const layer = layers?.find(l => l.id === layerId);
  if (!layer) return;

  const matCards = (layer.materials || []).map(m => `
    <div class="chain-mat-card">
      <div class="chain-mat-name">${m.name}</div>
      ${m.specs ? `<div class="chain-mat-specs">${m.specs}</div>` : ''}
      <div class="chain-mat-role">${m.role}</div>
      <div class="chain-supplier-row">
        ${(m.supplierNames || []).map(s => `<span class="badge">${s}</span>`).join('')}
      </div>
    </div>`).join('');

  const procItems = (layer.processRefs || []).map(p => `<li>${p}</li>`).join('');

  const html = `
    <div class="panel-header" style="margin-bottom:0.75rem">
      <div>
        <h3 class="panel-title" style="font-size:0.9rem">${layer.name}</h3>
        <p class="panel-subtitle" style="font-size:0.7rem">${layer.nameEn}</p>
      </div>
    </div>
    ${layer.specs ? `<div class="panel-specs" style="font-size:0.68rem;margin-bottom:0.6rem">${layer.specs}</div>` : ''}
    <div style="font-size:0.78rem;color:var(--dim);line-height:1.6;margin-bottom:0.75rem">${layer.role}</div>
    ${matCards ? `<div class="pf-suppliers-title">🧪 材料 &amp; サプライヤー</div><div class="chain-mat-list">${matCards}</div>` : ''}
    ${procItems ? `<div class="pf-suppliers-title" style="margin-top:0.5rem;color:var(--accent2)">🔄 製造プロセス手順</div><ul class="chain-proc-list">${procItems}</ul>` : ''}
    <div style="display:flex;flex-wrap:wrap;gap:0.35rem;margin-top:0.75rem">
      <button class="pf-jump-btn" onclick="jumpToSection('processflow')">🌊 製造フローで見る →</button>
      ${layer.category === 'die' ? `<button class="pf-jump-btn" style="background:#4c1d95" onclick="openDrillModal('${appId}')">🔬 チップ断面ドリルダウン →</button>` : ''}
    </div>`;

  if (window.innerWidth <= 900) {
    showMobileBottomSheet(html);
  } else {
    document.getElementById('chain-detail-panel').innerHTML = html;
  }
}

function showMobileBottomSheet(html) {
  document.getElementById('xs-sheet-overlay')?.remove();
  const overlay = document.createElement('div');
  overlay.id = 'xs-sheet-overlay';
  overlay.className = 'xs-sheet-overlay';
  overlay.innerHTML = `
    <div class="xs-sheet" id="xs-sheet">
      <div class="xs-sheet-handle"></div>
      <button class="xs-sheet-close" onclick="closeBottomSheet()">✕ 閉じる</button>
      ${html}
    </div>`;
  overlay.addEventListener('click', e => { if (e.target === overlay) closeBottomSheet(); });
  document.body.appendChild(overlay);
}

function closeBottomSheet() {
  const el = document.getElementById('xs-sheet-overlay');
  if (!el) return;
  el.querySelector('.xs-sheet')?.classList.add('xs-sheet-closing');
  setTimeout(() => el.remove(), 280);
}

function openDrillModal(appId) {
  const meta = CHAIN_APP_META[appId] || {};
  const device = meta.device || 'smartphone';
  currentDevice = device;
  currentLevel = 'package';
  showModal(`
    <div style="min-width:min(700px,90vw)">
      <div id="drill-bc" class="breadcrumb" style="margin-bottom:0.5rem;font-size:0.75rem"></div>
      <div id="drill-wrap" style="border:1px solid var(--border);border-radius:8px;overflow:hidden;margin-bottom:0.5rem"></div>
      <div style="display:flex;gap:0.5rem;margin-bottom:0.5rem">
        <button class="pf-jump-btn" id="drill-prev" style="display:none" onclick="drillStep(-1)">← 戻る</button>
        <button class="pf-jump-btn" id="drill-next" onclick="drillStep(1)"></button>
      </div>
      <div id="drill-panel" style="border-top:1px solid var(--border);padding-top:0.75rem;font-size:0.8rem;color:var(--dim)"></div>
    </div>`);
  renderDrillLevel(currentLevel);
}

function renderDrillLevel(level) {
  currentLevel = level;
  const wrap = document.getElementById('drill-wrap');
  const bc = document.getElementById('drill-bc');
  const nextBtn = document.getElementById('drill-next');
  const prevBtn = document.getElementById('drill-prev');
  if (!wrap) return;
  wrap.innerHTML = '';

  const idx = LEVELS.indexOf(level);
  bc.innerHTML = LEVELS.map((l, i) => `<span class="bc-item ${l===level?'bc-active':''} ${i<idx?'bc-past':''}"
    onclick="${i<=idx?`renderDrillLevel('${l}')`:''}" style="cursor:${i<=idx?'pointer':'default'}">${LEVEL_LABELS[l]}</span>${i<LEVELS.length-1?'<span class="bc-sep">›</span>':''}`).join('');

  if (level === 'package') renderPackageSVG(wrap, currentDevice);
  else if (level === 'chip') renderChipSVG(wrap);

  const nextLevel = LEVELS[idx + 1];
  const prevLevel = LEVELS[idx - 1];
  if (nextLevel && (level === 'package' || level === 'chip')) {
    nextBtn.style.display = '';
    nextBtn.textContent = `${LEVEL_LABELS[nextLevel]} を見る →`;
  } else {
    nextBtn.style.display = 'none';
  }
  prevBtn.style.display = (prevLevel && idx > 1) ? '' : 'none';
  if (prevLevel && idx > 1) prevBtn.textContent = `← ${LEVEL_LABELS[prevLevel]}`;
}

function drillStep(dir) {
  const idx = LEVELS.indexOf(currentLevel) + dir;
  if (idx >= 0 && idx < LEVELS.length) renderDrillLevel(LEVELS[idx]);
}

// ── NEWS (Live RSS via Google News) ───────────────────────────────────────
const NEWS_QUERIES = {
  'すべて':        'semiconductor advanced packaging foundry',
  'ファウンドリ':   'TSMC Samsung Intel foundry node 2nm GAA',
  'HBM / AI半導体': 'HBM CoWoS NVIDIA AI accelerator packaging',
  'サプライチェーン': 'ABF semiconductor supply EUV ASML Ajinomoto',
  '車載 / EV':    'automotive SiC GaN ADAS semiconductor EV',
  '基板 / パッケージ': 'FC-BGA substrate advanced packaging chiplet',
};

function buildNewsSection() {
  const filtersEl = document.getElementById('news-filters');
  filtersEl.innerHTML = Object.keys(NEWS_QUERIES).map((cat, i) =>
    `<button class="filter-btn ${i===0?'active':''}" data-newscat="${cat}">${cat}</button>`
  ).join('');
  filtersEl.addEventListener('click', e => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    filtersEl.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    fetchAndRenderNews(btn.dataset.newscat);
  });
  fetchAndRenderNews('すべて');
}

async function fetchAndRenderNews(cat) {
  const grid = document.getElementById('news-grid');
  grid.innerHTML = '<div class="news-loading">🔄 最新ニュースを取得中...</div>';
  const query = NEWS_QUERIES[cat] || NEWS_QUERIES['すべて'];
  const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=ja&gl=JP&ceid=JP:ja`;
  const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(rssUrl)}`;
  try {
    const resp = await fetch(proxyUrl, { signal: AbortSignal.timeout ? AbortSignal.timeout(9000) : undefined });
    if (!resp.ok) throw new Error('fetch failed');
    const text = await resp.text();
    const doc = new DOMParser().parseFromString(text, 'text/xml');
    const items = [...doc.querySelectorAll('item')].slice(0, 18).map(item => ({
      title: (item.querySelector('title')?.textContent || '').replace(/ - [^-]+$/, ''),
      url:   item.querySelector('link')?.nextSibling?.nodeValue?.trim() ||
             item.querySelector('link')?.textContent || '#',
      date:  item.querySelector('pubDate')?.textContent || '',
      source: item.querySelector('source')?.textContent || 'Google News',
    }));
    if (!items.length) throw new Error('empty');
    grid.innerHTML = items.map(n => {
      const d = n.date ? new Date(n.date).toLocaleDateString('ja-JP', {month:'short', day:'numeric'}) : '';
      return `<a href="${n.url}" target="_blank" rel="noopener" class="news-card">
        <div class="news-meta"><span class="news-cat">${cat}</span><span class="news-date">${d}</span></div>
        <p class="news-title">${n.title}</p>
        <span class="news-source">📰 ${n.source}</span>
      </a>`;
    }).join('');
  } catch {
    const q = encodeURIComponent(query);
    grid.innerHTML = `<div style="grid-column:1/-1;padding:2rem;text-align:center;color:var(--muted)">
      <p style="margin-bottom:1rem">ネットワークに接続してニュースを取得してください。</p>
      <div style="display:flex;gap:0.5rem;justify-content:center;flex-wrap:wrap">
        <a href="https://news.google.com/search?q=${q}" target="_blank" rel="noopener" class="pf-jump-btn">🔍 Google Newsで検索 →</a>
        <a href="https://semiengineering.com" target="_blank" rel="noopener" class="pf-jump-btn">Semiconductor Engineering</a>
        <a href="https://www.eetimes.com" target="_blank" rel="noopener" class="pf-jump-btn">EE Times</a>
      </div>
    </div>`;
  }
}

// ── SUPPLY CHAIN FLOW DIAGRAM ─────────────────────────────────────────────
function buildSupplyChainFlow() {
  const root = document.getElementById('supply-section-root');
  if (!root || !EXTENDED_DATA?.supplyChainTiers) return;

  const tiers = EXTENDED_DATA.supplyChainTiers;
  const edges = EXTENDED_DATA.supplyChainEdges || [];
  const TIER_W = 160, TIER_GAP = 28, NODE_H = 42, NODE_GAP = 10;
  const RISK_COLOR = { CRIT: '#dc2626', HIGH: '#f59e0b', MED: '#3b82f6', LOW: '#22c55e' };
  const LEFT = 10, TOP = 36;

  // Compute positions
  const nodePos = {};
  tiers.forEach((tier, ti) => {
    tier.nodes.forEach((node, ni) => {
      nodePos[node.id] = {
        x: LEFT + ti * (TIER_W + TIER_GAP),
        y: TOP + ni * (NODE_H + NODE_GAP),
      };
    });
  });
  const maxNodes = Math.max(...tiers.map(t => t.nodes.length));
  const W = LEFT + tiers.length * (TIER_W + TIER_GAP) + 10;
  const H = TOP + maxNodes * (NODE_H + NODE_GAP) + 20;

  // Build SVG
  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.style.cssText = 'width:100%;display:block;min-height:300px';

  // Arrowhead
  const defs = document.createElementNS(NS, 'defs');
  const mk = document.createElementNS(NS, 'marker');
  mk.setAttribute('id', 'sc-arr'); mk.setAttribute('markerWidth', '7'); mk.setAttribute('markerHeight', '5');
  mk.setAttribute('refX', '6'); mk.setAttribute('refY', '2.5'); mk.setAttribute('orient', 'auto');
  const poly = document.createElementNS(NS, 'polygon');
  poly.setAttribute('points', '0 0, 7 2.5, 0 5'); poly.setAttribute('fill', '#334155');
  mk.appendChild(poly); defs.appendChild(mk); svg.appendChild(defs);

  // Draw edges first
  edges.forEach(([from, to]) => {
    const s = nodePos[from], t = nodePos[to];
    if (!s || !t) return;
    const x1 = s.x + TIER_W, y1 = s.y + NODE_H / 2;
    const x2 = t.x, y2 = t.y + NODE_H / 2;
    const dx = (x2 - x1) * 0.5;
    const path = document.createElementNS(NS, 'path');
    path.setAttribute('d', `M${x1},${y1} C${x1+dx},${y1} ${x2-dx},${y2} ${x2},${y2}`);
    path.setAttribute('stroke', '#1e3a5f'); path.setAttribute('stroke-width', '1.2');
    path.setAttribute('fill', 'none'); path.setAttribute('marker-end', 'url(#sc-arr)');
    path.setAttribute('opacity', '0.55');
    svg.appendChild(path);
  });

  // Tier headers
  tiers.forEach((tier, ti) => {
    const x = LEFT + ti * (TIER_W + TIER_GAP);
    const hdr = document.createElementNS(NS, 'text');
    hdr.setAttribute('x', x + TIER_W / 2); hdr.setAttribute('y', TOP - 10);
    hdr.setAttribute('text-anchor', 'middle'); hdr.setAttribute('fill', tier.color);
    hdr.setAttribute('font-size', '9'); hdr.setAttribute('font-weight', '700');
    hdr.setAttribute('font-family', 'Noto Sans JP,sans-serif');
    hdr.textContent = tier.label; svg.appendChild(hdr);
  });

  // Draw nodes
  tiers.forEach((tier, ti) => {
    tier.nodes.forEach((node) => {
      const pos = nodePos[node.id];
      const rc = RISK_COLOR[node.risk] || '#334155';
      const g = document.createElementNS(NS, 'g');
      g.style.cursor = 'pointer';

      const rect = document.createElementNS(NS, 'rect');
      rect.setAttribute('x', pos.x); rect.setAttribute('y', pos.y);
      rect.setAttribute('width', TIER_W); rect.setAttribute('height', NODE_H);
      rect.setAttribute('fill', '#0d1a2e'); rect.setAttribute('rx', '6');
      rect.setAttribute('stroke', rc); rect.setAttribute('stroke-width', '1.5');
      g.appendChild(rect);

      // Risk dot
      const dot = document.createElementNS(NS, 'circle');
      dot.setAttribute('cx', pos.x + TIER_W - 10); dot.setAttribute('cy', pos.y + 10);
      dot.setAttribute('r', '4'); dot.setAttribute('fill', rc);
      g.appendChild(dot);

      // Name
      const t1 = document.createElementNS(NS, 'text');
      t1.setAttribute('x', pos.x + 8); t1.setAttribute('y', pos.y + 16);
      t1.setAttribute('fill', '#e2e8f0'); t1.setAttribute('font-size', '9.5');
      t1.setAttribute('font-weight', '700'); t1.setAttribute('font-family', 'Noto Sans JP,sans-serif');
      t1.textContent = node.name; g.appendChild(t1);

      // Country + desc
      const t2 = document.createElementNS(NS, 'text');
      t2.setAttribute('x', pos.x + 8); t2.setAttribute('y', pos.y + 30);
      t2.setAttribute('fill', '#64748b'); t2.setAttribute('font-size', '7.5');
      t2.setAttribute('font-family', 'Noto Sans JP,sans-serif');
      t2.textContent = node.country + ' ' + node.desc.slice(0, 20);
      g.appendChild(t2);

      g.addEventListener('click', () => showSupplyNodeDetail(node, tier, rc));
      svg.appendChild(g);
    });
  });

  // Legend
  const legendDiv = document.createElement('div');
  legendDiv.style.cssText = 'display:flex;gap:1rem;flex-wrap:wrap;margin-bottom:0.75rem;font-size:0.72rem';
  legendDiv.innerHTML = Object.entries(RISK_COLOR).map(([r, c]) =>
    `<span style="display:flex;align-items:center;gap:4px"><span style="width:10px;height:10px;border-radius:50%;background:${c};display:inline-block"></span>${r==='CRIT'?'CRITICAL':r==='MED'?'MEDIUM':r}</span>`
  ).join('') + '<span style="margin-left:auto;color:var(--muted)">ノードをクリックで詳細</span>';

  const svgWrap = document.createElement('div');
  svgWrap.style.cssText = 'overflow-x:auto;border:1px solid var(--border);border-radius:10px;padding:0.75rem;background:var(--card)';
  svgWrap.appendChild(svg);

  root.appendChild(legendDiv);
  root.appendChild(svgWrap);

  // Risk cards below
  const riskHdr = document.createElement('h3');
  riskHdr.style.cssText = 'font-size:0.95rem;font-weight:700;color:var(--accent);margin-top:1.5rem;margin-bottom:0.5rem';
  riskHdr.textContent = '⚠️ 地政学・輸出規制 リスクマップ';
  root.appendChild(riskHdr);
  const riskSub = document.createElement('p');
  riskSub.style.cssText = 'font-size:0.75rem;color:var(--muted);margin-bottom:0.75rem';
  riskSub.textContent = 'CRITICAL=即時影響あり / HIGH=6ヶ月以内 / MEDIUM=1年以上';
  root.appendChild(riskSub);

  const grid = document.createElement('div');
  grid.className = 'risk-grid';
  (EXTENDED_DATA.supplyChainRisks || []).forEach(risk => {
    const card = document.createElement('div');
    card.className = 'risk-card';
    card.style.borderColor = risk.color + '50';
    card.innerHTML = `
      <div class="risk-card-top">
        <span class="risk-badge risk-${risk.riskLevel.toLowerCase()}">${risk.riskLevel}</span>
        <span class="risk-cat">${risk.category}</span>
      </div>
      <div class="risk-item">${risk.item}</div>
      <div class="risk-concentration">${risk.concentration}</div>
      <div class="risk-countries">${(risk.countries||[]).map(c=>`<span class="badge" style="font-size:0.62rem">${c}</span>`).join('')}</div>
      ${risk.exportControl?`<div style="font-size:0.68rem;color:#f87171;margin-top:0.1rem">🔒 ${risk.exportControl}</div>`:''}
      <div class="risk-impact">${risk.impact}</div>
      ${risk.alternatives?`<div class="risk-alt">→ 代替案: ${risk.alternatives}</div>`:''}`;
    grid.appendChild(card);
  });
  root.appendChild(grid);
}

function showSupplyNodeDetail(node, tier, color) {
  showModal(`
    <h2 style="font-size:1.1rem;margin-bottom:0.25rem">${node.name}</h2>
    <p style="font-size:0.8rem;color:var(--muted);margin-bottom:0.75rem">${tier.label} — ${node.country}</p>
    <div style="background:${color}22;border:1px solid ${color}55;border-radius:8px;padding:0.75rem;margin-bottom:0.75rem">
      <div style="font-size:0.75rem;font-weight:700;color:${color};margin-bottom:0.25rem">リスクレベル: ${node.risk}</div>
      <div style="font-size:0.82rem;color:var(--dim)">${node.desc}</div>
    </div>`);
}

// ── MODAL ─────────────────────────────────────────────────────────────────
function showModal(html) {
  document.getElementById('modal-body').innerHTML = html;
  document.getElementById('modal-overlay').classList.remove('hidden');
}
function closeModal() { document.getElementById('modal-overlay').classList.add('hidden'); }
document.addEventListener('keydown', e => { if(e.key==='Escape') closeModal(); });

// ── SVG HELPERS ───────────────────────────────────────────────────────────
function makeSVG(w, h) {
  const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  s.setAttribute('viewBox', `0 0 ${w} ${h}`);
  s.style.width = '100%';
  s.style.display = 'block';
  return s;
}
function makeSVGEl(tag, attrs) {
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  Object.entries(attrs).forEach(([k,v]) => el.setAttribute(k, v));
  return el;
}
function makeSVGGroup(parent) {
  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  parent.appendChild(g);
  return g;
}
function makeClickGroup(parent, title) {
  const g = makeSVGGroup(parent);
  g.style.cursor = 'pointer';
  g.setAttribute('title', title);
  return g;
}
function addRect(parent, x, y, w, h, fill, rx, id, onclick, title, sw, stroke) {
  const r = makeSVGEl('rect', { x, y, width:w, height:h, fill, rx:rx||0,
    ...(sw?{'stroke-width':sw}:{}), ...(stroke?{stroke}:{}) });
  if(id) r.id = id;
  parent.appendChild(r);
  return r;
}
function addText(parent, x, y, text, fill, size, anchor) {
  const t = makeSVGEl('text', { x, y, fill, 'font-size':size||11, 'text-anchor':anchor||'start', 'font-family':'Noto Sans JP,sans-serif', 'font-weight':'600' });
  t.textContent = text;
  parent.appendChild(t);
  return t;
}
function addLine(parent, x1, y1, x2, y2, stroke, sw, dash) {
  const l = makeSVGEl('line', { x1, y1, x2, y2, stroke, 'stroke-width':sw||1, ...(dash?{'stroke-dasharray':dash.join(',')}:{}) });
  parent.appendChild(l);
  return l;
}
function el(tag, cls, text) {
  const e = document.createElement(tag);
  if(cls) e.className = cls;
  if(text) e.textContent = text;
  return e;
}

// ── PROCESS FLOW (River / DAG Diagram) ─────────────────────────────────────
function buildProcessFlowSection() {
  const container = document.getElementById('pf-svg-container');
  if (!container || !EXTENDED_DATA?.processFlow) return;

  const PF = EXTENDED_DATA.processFlow;
  const PHASE_W = 178;
  const TRACK_H = 210;
  const LEFT = 120;
  const TOP = 55;
  const NODE_W = 132, NODE_H = 34;
  const W = LEFT + PHASE_W * PF.phases.length + 14;
  const H = TOP + TRACK_H * PF.tracks.length + 14;

  // Group nodes by (phase, track) to distribute vertically within each cell
  const cellMap = {};
  PF.nodes.forEach(n => {
    const key = `${n.phase},${n.track}`;
    if (!cellMap[key]) cellMap[key] = [];
    cellMap[key].push(n.id);
  });

  const nodePos = {};
  PF.nodes.forEach(n => {
    const key = `${n.phase},${n.track}`;
    const siblings = cellMap[key];
    const idx = siblings.indexOf(n.id);
    const count = siblings.length;
    const slot = TRACK_H / count;
    nodePos[n.id] = {
      cx: LEFT + n.phase * PHASE_W + PHASE_W / 2,
      cy: TOP + n.track * TRACK_H + slot * idx + slot / 2,
    };
  });

  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.style.cssText = `width:${W}px;height:${H}px;display:block;min-width:${W}px`;

  // defs: arrowhead markers
  const defs = document.createElementNS(NS, 'defs');
  Object.entries(PF.categoryColors).forEach(([cat, color]) => {
    const mk = document.createElementNS(NS, 'marker');
    mk.setAttribute('id', `arr-${cat}`);
    mk.setAttribute('markerWidth', '5'); mk.setAttribute('markerHeight', '5');
    mk.setAttribute('refX', '4'); mk.setAttribute('refY', '2.5');
    mk.setAttribute('orient', 'auto');
    const arrow = document.createElementNS(NS, 'path');
    arrow.setAttribute('d', 'M0,0 L0,5 L5,2.5 z');
    arrow.setAttribute('fill', color); arrow.setAttribute('opacity', '0.7');
    mk.appendChild(arrow); defs.appendChild(mk);
  });
  svg.appendChild(defs);

  // Background
  const bgr = document.createElementNS(NS, 'rect');
  bgr.setAttribute('width', W); bgr.setAttribute('height', H); bgr.setAttribute('fill', '#0d1525');
  svg.appendChild(bgr);

  // Phase column bands + labels
  PF.phases.forEach((phase, i) => {
    const x = LEFT + i * PHASE_W;
    if (i % 2 === 0) {
      const band = document.createElementNS(NS, 'rect');
      band.setAttribute('x', x); band.setAttribute('y', TOP);
      band.setAttribute('width', PHASE_W); band.setAttribute('height', TRACK_H * PF.tracks.length);
      band.setAttribute('fill', 'rgba(255,255,255,0.018)');
      svg.appendChild(band);
    }
    if (i > 0) {
      const ln = document.createElementNS(NS, 'line');
      ln.setAttribute('x1', x); ln.setAttribute('y1', TOP);
      ln.setAttribute('x2', x); ln.setAttribute('y2', TOP + TRACK_H * PF.tracks.length);
      ln.setAttribute('stroke', '#1e2d45'); ln.setAttribute('stroke-width', '1');
      svg.appendChild(ln);
    }
    const pt = document.createElementNS(NS, 'text');
    pt.setAttribute('x', x + PHASE_W / 2); pt.setAttribute('y', TOP - 12);
    pt.setAttribute('text-anchor', 'middle'); pt.setAttribute('fill', '#94a3b8');
    pt.setAttribute('font-size', '11'); pt.setAttribute('font-weight', '700');
    pt.setAttribute('font-family', 'Noto Sans JP,sans-serif');
    pt.textContent = phase; svg.appendChild(pt);
  });

  // Track row dividers + labels
  PF.tracks.forEach((track, i) => {
    const y = TOP + i * TRACK_H;
    if (i > 0) {
      const ln = document.createElementNS(NS, 'line');
      ln.setAttribute('x1', LEFT); ln.setAttribute('y1', y);
      ln.setAttribute('x2', W - 10); ln.setAttribute('y2', y);
      ln.setAttribute('stroke', '#1e2d45'); ln.setAttribute('stroke-width', '1');
      svg.appendChild(ln);
    }
    // Track type badge (chip vs package vs memory)
    const trackTypes = [
      { label: '半導体チップ', color: '#7c3aed', bg: '#3b0764' },
      { label: '基板・材料',   color: '#1d4ed8', bg: '#1e3a5f' },
      { label: 'メモリ',       color: '#059669', bg: '#064e3b' },
      { label: 'パッシブ/周辺', color: '#b45309', bg: '#451a03' },
    ];
    const tt = trackTypes[i];
    if (tt) {
      const badgeW = 80, badgeH = 18;
      const badgeX = LEFT - badgeW - 6;
      const badgeY = y + TRACK_H / 2 - badgeH / 2 - 12;
      const br = document.createElementNS(NS, 'rect');
      br.setAttribute('x', badgeX); br.setAttribute('y', badgeY);
      br.setAttribute('width', badgeW); br.setAttribute('height', badgeH);
      br.setAttribute('fill', tt.bg); br.setAttribute('rx', '3');
      svg.appendChild(br);
      const bl = document.createElementNS(NS, 'text');
      bl.setAttribute('x', badgeX + badgeW / 2); bl.setAttribute('y', badgeY + 12);
      bl.setAttribute('text-anchor', 'middle'); bl.setAttribute('fill', tt.color);
      bl.setAttribute('font-size', '7.5'); bl.setAttribute('font-weight', '700');
      bl.setAttribute('font-family', 'Noto Sans JP,sans-serif');
      bl.textContent = tt.label; svg.appendChild(bl);
    }
    const tl = document.createElementNS(NS, 'text');
    tl.setAttribute('x', LEFT - 6); tl.setAttribute('y', y + TRACK_H / 2 + 16);
    tl.setAttribute('text-anchor', 'end'); tl.setAttribute('fill', '#94a3b8');
    tl.setAttribute('font-size', '10'); tl.setAttribute('font-weight', '700');
    tl.setAttribute('font-family', 'Noto Sans JP,sans-serif');
    tl.textContent = track; svg.appendChild(tl);
  });

  // Edges
  const eg = document.createElementNS(NS, 'g');
  svg.appendChild(eg);
  PF.edges.forEach(edge => {
    const src = nodePos[edge.from], tgt = nodePos[edge.to];
    const srcNode = PF.nodes.find(n => n.id === edge.from);
    if (!src || !tgt) return;
    const color = PF.categoryColors[srcNode?.category] || '#334155';
    const x1 = src.cx + NODE_W / 2, y1 = src.cy;
    const x2 = tgt.cx - NODE_W / 2, y2 = tgt.cy;
    const dx = Math.max(Math.abs(x2 - x1) * 0.45, 40);
    const path = document.createElementNS(NS, 'path');
    path.setAttribute('d', `M${x1},${y1} C${x1+dx},${y1} ${x2-dx},${y2} ${x2},${y2}`);
    path.setAttribute('fill', 'none'); path.setAttribute('stroke', color);
    path.setAttribute('stroke-width', '1.4'); path.setAttribute('stroke-opacity', '0.5');
    path.setAttribute('marker-end', `url(#arr-${srcNode?.category||'raw'})`);
    eg.appendChild(path);
    if (edge.label) {
      const lt = document.createElementNS(NS, 'text');
      lt.setAttribute('x', (x1 + x2) / 2); lt.setAttribute('y', (y1 + y2) / 2 - 3);
      lt.setAttribute('text-anchor', 'middle'); lt.setAttribute('fill', '#94a3b8');
      lt.setAttribute('font-size', '8'); lt.setAttribute('font-family', 'Noto Sans JP,sans-serif');
      lt.textContent = edge.label; eg.appendChild(lt);
    }
  });

  // Nodes
  const nodeRects = {};
  PF.nodes.forEach(node => {
    const pos = nodePos[node.id];
    const color = PF.categoryColors[node.category] || '#374151';
    const x = pos.cx - NODE_W / 2, y = pos.cy - NODE_H / 2;
    const g = document.createElementNS(NS, 'g');
    g.style.cursor = 'pointer';
    svg.appendChild(g);

    const rect = document.createElementNS(NS, 'rect');
    rect.setAttribute('x', x); rect.setAttribute('y', y);
    rect.setAttribute('width', NODE_W); rect.setAttribute('height', NODE_H);
    rect.setAttribute('fill', color); rect.setAttribute('rx', '5');
    rect.setAttribute('stroke', 'rgba(255,255,255,0.08)'); rect.setAttribute('stroke-width', '1');
    g.appendChild(rect);
    nodeRects[node.id] = rect;

    const txt = document.createElementNS(NS, 'text');
    txt.setAttribute('x', pos.cx); txt.setAttribute('y', pos.cy + 4);
    txt.setAttribute('text-anchor', 'middle'); txt.setAttribute('fill', '#fff');
    txt.setAttribute('font-size', '10'); txt.setAttribute('font-weight', '700');
    txt.setAttribute('font-family', 'Noto Sans JP,sans-serif');
    txt.style.pointerEvents = 'none'; txt.textContent = node.label;
    g.appendChild(txt);

    g.addEventListener('mouseenter', () => {
      rect.setAttribute('filter', 'brightness(1.35)');
      rect.setAttribute('stroke', 'rgba(255,255,255,0.5)');
      rect.setAttribute('stroke-width', '1.5');
    });
    g.addEventListener('mouseleave', () => {
      rect.removeAttribute('filter');
      const sel = svg.dataset.selected === node.id;
      rect.setAttribute('stroke', sel ? '#06b6d4' : 'rgba(255,255,255,0.08)');
      rect.setAttribute('stroke-width', sel ? '2' : '1');
    });
    g.addEventListener('click', () => {
      Object.values(nodeRects).forEach(r => {
        r.setAttribute('stroke', 'rgba(255,255,255,0.08)'); r.setAttribute('stroke-width', '1');
      });
      rect.setAttribute('stroke', '#06b6d4'); rect.setAttribute('stroke-width', '2');
      svg.dataset.selected = node.id;
      showProcessFlowDetail(node);
    });
  });

  container.appendChild(svg);

  // Legend
  const legend = document.getElementById('pf-legend');
  if (legend) {
    const catLabels = {
      raw:'原材料', material:'素材/ウェーハ', feol:'FEOL前工程', beol:'BEOL配線', substrate:'基板プロセス',
      memory:'メモリ', assembly:'パッケージ組立', test:'テスト', pcb_assy:'PCB実装', product:'製品', equipment:'製造装置', passive:'パッシブ部品'
    };
    legend.innerHTML = Object.entries(PF.categoryColors).map(([cat, color]) =>
      `<span class="pf-legend-item"><span class="pf-legend-dot" style="background:${color}"></span>${catLabels[cat]||cat}</span>`
    ).join('');
  }
}

function showProcessFlowDetail(node) {
  const panel = document.getElementById('pf-detail-panel');
  const PF = EXTENDED_DATA.processFlow;
  const color = PF.categoryColors[node.category] || '#334155';

  const suppBadges = (node.suppliers || []).map(s => `<span class="badge">${s}</span>`).join('');
  const specBar = node.specs ? `<div class="pf-specs-bar">${node.specs}</div>` : '';

  const outgoing = PF.edges.filter(e => e.from === node.id).map(e => {
    const t = PF.nodes.find(n => n.id === e.to);
    return t ? `<span class="badge badge-blue">${t.label}</span>` : '';
  }).filter(Boolean).join('');
  const incoming = PF.edges.filter(e => e.to === node.id).map(e => {
    const s = PF.nodes.find(n => n.id === e.from);
    return s ? `<span class="badge">${s.label}</span>` : '';
  }).filter(Boolean).join('');

  panel.innerHTML = `
    <div style="display:flex;align-items:flex-start;gap:0.5rem;margin-bottom:0.4rem">
      <div style="width:10px;height:10px;border-radius:2px;background:${color};flex-shrink:0;margin-top:5px"></div>
      <div class="pf-node-name">${node.label}</div>
    </div>
    <div class="pf-node-category" style="background:${color}22;color:${color};border:1px solid ${color}44">${node.category.toUpperCase()} — Phase ${node.phase}</div>
    <div class="pf-node-desc">${node.desc||''}</div>
    ${specBar}
    ${node.suppliers?.length ? `<div class="pf-suppliers-title">🏭 主要サプライヤー</div><div class="pf-supplier-badges">${suppBadges}</div>` : ''}
    ${incoming ? `<div class="pf-suppliers-title" style="color:var(--muted)">⬅️ 入力 (前工程)</div><div class="pf-supplier-badges" style="margin-bottom:0.5rem">${incoming}</div>` : ''}
    ${outgoing ? `<div class="pf-suppliers-title" style="color:var(--accent2)">➡️ 出力 (後工程)</div><div class="pf-supplier-badges">${outgoing}</div>` : ''}
    ${node.examples?.length ? `<div class="pf-suppliers-title" style="margin-top:0.5rem;color:var(--accent3)">📦 製品例</div><div style="font-size:0.75rem;color:var(--dim)">${node.examples.join(' / ')}</div>` : ''}`;
}

// ── UNIFIED TECHNOLOGY ROADMAP ────────────────────────────────────────────
function buildUnifiedRoadmap() {
  const root = document.getElementById('roadmap-section-root');
  if (!root || !EXTENDED_DATA?.technologyRoadmap) return;

  const YEAR_START = 2000, YEAR_END = 2028;
  const YEAR_SPAN = YEAR_END - YEAR_START;
  const COL_W = 44; // px per year
  const ROW_H = 52;
  const LEFT = 130;
  const TOP = 32;
  const ROWS = [
    { id: 'chip',    label: '🔬 チップ\nスケーリング', color: '#7c3aed' },
    { id: 'pkg',     label: '📦 パッケージング\n技術進化',    color: '#0891b2' },
    { id: 'TSMC',    label: '🇹🇼 TSMC',      color: '#06b6d4' },
    { id: 'Samsung', label: '🇰🇷 Samsung',  color: '#3b82f6' },
    { id: 'Intel',   label: '🇺🇸 Intel',    color: '#6366f1' },
    { id: 'Rapidus', label: '🇯🇵 Rapidus',  color: '#f59e0b' },
  ];
  const W = LEFT + YEAR_SPAN * COL_W + 20;
  const H = TOP + ROWS.length * ROW_H + 20;

  // Build detail panel beside timeline
  root.innerHTML = `
    <div class="unified-roadmap-wrap">
      <div class="unified-timeline-area" id="timeline-area"></div>
      <div id="roadmap-detail-panel" class="chain-detail-panel" style="min-width:260px">
        <div class="panel-placeholder"><div class="hint-arrow">←</div><p>マイルストーンをクリックすると<br>詳細を表示</p></div>
      </div>
    </div>`;

  const area = root.querySelector('#timeline-area');
  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.style.cssText = `min-width:${W}px;display:block;`;

  function yearX(y) { return LEFT + (y - YEAR_START) * COL_W; }
  function rowY(ri) { return TOP + ri * ROW_H; }

  // Background bands for alternate rows
  ROWS.forEach((row, ri) => {
    const bg = document.createElementNS(NS, 'rect');
    bg.setAttribute('x', 0); bg.setAttribute('y', rowY(ri));
    bg.setAttribute('width', W); bg.setAttribute('height', ROW_H);
    bg.setAttribute('fill', ri % 2 === 0 ? 'rgba(255,255,255,0.015)' : 'rgba(0,0,0,0.1)');
    svg.appendChild(bg);
  });

  // Year grid lines + labels
  for (let y = YEAR_START; y <= YEAR_END; y += 2) {
    const x = yearX(y);
    const ln = document.createElementNS(NS, 'line');
    ln.setAttribute('x1', x); ln.setAttribute('y1', TOP);
    ln.setAttribute('x2', x); ln.setAttribute('y2', H - 10);
    ln.setAttribute('stroke', '#1e2d45'); ln.setAttribute('stroke-width', '1');
    svg.appendChild(ln);
    const t = document.createElementNS(NS, 'text');
    t.setAttribute('x', x); t.setAttribute('y', TOP - 8);
    t.setAttribute('text-anchor', 'middle'); t.setAttribute('fill', '#475569');
    t.setAttribute('font-size', '9'); t.setAttribute('font-family', 'sans-serif');
    t.textContent = y; svg.appendChild(t);
  }

  // Row labels
  ROWS.forEach((row, ri) => {
    const lines = row.label.split('\n');
    lines.forEach((line, li) => {
      const t = document.createElementNS(NS, 'text');
      t.setAttribute('x', LEFT - 8); t.setAttribute('y', rowY(ri) + 16 + li * 14);
      t.setAttribute('text-anchor', 'end'); t.setAttribute('fill', row.color);
      t.setAttribute('font-size', '9'); t.setAttribute('font-weight', '700');
      t.setAttribute('font-family', 'Noto Sans JP,sans-serif');
      t.textContent = line; svg.appendChild(t);
    });
    // Row divider
    const ln = document.createElementNS(NS, 'line');
    ln.setAttribute('x1', 0); ln.setAttribute('y1', rowY(ri));
    ln.setAttribute('x2', W); ln.setAttribute('y2', rowY(ri));
    ln.setAttribute('stroke', '#1e2d45'); ln.setAttribute('stroke-width', '0.8');
    svg.appendChild(ln);
  });

  // Chip scaling milestones (span bars)
  EXTENDED_DATA.technologyRoadmap.forEach(item => {
    const ri = 0;
    const x1 = yearX(item.year);
    const x2 = yearX(Math.min(item.endYear || item.year + 2, YEAR_END));
    const bw = Math.max(x2 - x1 - 2, 18);
    const g = document.createElementNS(NS, 'g'); g.style.cursor = 'pointer';
    const rect = document.createElementNS(NS, 'rect');
    rect.setAttribute('x', x1 + 1); rect.setAttribute('y', rowY(ri) + 6);
    rect.setAttribute('width', bw); rect.setAttribute('height', ROW_H - 14);
    rect.setAttribute('fill', item.color); rect.setAttribute('rx', '4');
    rect.setAttribute('opacity', item.highlight ? '0.95' : '0.7');
    g.appendChild(rect);
    const t = document.createElementNS(NS, 'text');
    t.setAttribute('x', x1 + bw / 2 + 1); t.setAttribute('y', rowY(ri) + ROW_H / 2 + 4);
    t.setAttribute('text-anchor', 'middle'); t.setAttribute('fill', '#fff');
    t.setAttribute('font-size', '8'); t.setAttribute('font-weight', '700');
    t.setAttribute('font-family', 'sans-serif');
    t.style.pointerEvents = 'none'; t.textContent = item.node;
    g.appendChild(t);
    g.addEventListener('click', () => showRoadmapNodeDetail({ type:'chip', item }));
    svg.appendChild(g);
  });

  // Packaging milestones (span bars)
  (EXTENDED_DATA.packagingRoadmap || []).forEach(item => {
    const ri = 1;
    const x1 = yearX(Math.max(item.year, YEAR_START));
    const x2 = yearX(Math.min(item.endYear || item.year + 3, YEAR_END));
    const bw = Math.max(x2 - x1 - 2, 20);
    const g = document.createElementNS(NS, 'g'); g.style.cursor = 'pointer';
    const rect = document.createElementNS(NS, 'rect');
    rect.setAttribute('x', x1 + 1); rect.setAttribute('y', rowY(ri) + 6);
    rect.setAttribute('width', bw); rect.setAttribute('height', ROW_H - 14);
    rect.setAttribute('fill', item.color); rect.setAttribute('rx', '4');
    rect.setAttribute('opacity', item.highlight ? '0.95' : '0.65');
    g.appendChild(rect);
    const t = document.createElementNS(NS, 'text');
    t.setAttribute('x', x1 + bw / 2 + 1); t.setAttribute('y', rowY(ri) + ROW_H / 2 + 4);
    t.setAttribute('text-anchor', 'middle'); t.setAttribute('fill', '#fff');
    t.setAttribute('font-size', '7.5'); t.setAttribute('font-weight', '700');
    t.setAttribute('font-family', 'sans-serif');
    t.style.pointerEvents = 'none'; t.textContent = item.shortName;
    g.appendChild(t);
    g.addEventListener('click', () => showRoadmapNodeDetail({ type:'pkg', item }));
    svg.appendChild(g);
  });

  // Manufacturer milestones (dots + labels)
  const mfrs = EXTENDED_DATA.manufacturerMilestones || {};
  ['TSMC','Samsung','Intel','Rapidus'].forEach((company, ci) => {
    const ri = ci + 2;
    const mdata = mfrs[company];
    if (!mdata) return;
    (mdata.milestones || []).forEach(ms => {
      const x = yearX(ms.year);
      if (x < LEFT || x > W) return;
      const g = document.createElementNS(NS, 'g'); g.style.cursor = 'pointer';
      const dot = document.createElementNS(NS, 'circle');
      dot.setAttribute('cx', x); dot.setAttribute('cy', rowY(ri) + ROW_H / 2);
      dot.setAttribute('r', ms.highlight ? '7' : '5');
      dot.setAttribute('fill', ms.type === 'pkg' ? '#0891b2' : mdata.color);
      dot.setAttribute('stroke', ms.highlight ? '#fff' : 'none');
      dot.setAttribute('stroke-width', '1.5');
      g.appendChild(dot);
      const t = document.createElementNS(NS, 'text');
      t.setAttribute('x', x); t.setAttribute('y', rowY(ri) + ROW_H - 4);
      t.setAttribute('text-anchor', 'middle'); t.setAttribute('fill', '#94a3b8');
      t.setAttribute('font-size', '7'); t.setAttribute('font-family', 'sans-serif');
      t.style.pointerEvents = 'none'; t.textContent = ms.node;
      g.appendChild(t);
      g.addEventListener('click', () => showRoadmapNodeDetail({ type:'mfr', company, item: ms, color: mdata.color }));
      svg.appendChild(g);
    });
  });

  const scrollWrap = document.createElement('div');
  scrollWrap.style.cssText = 'overflow-x:auto;border:1px solid var(--border);border-radius:10px;background:var(--card)';
  scrollWrap.appendChild(svg);
  area.appendChild(scrollWrap);
}

function showRoadmapNodeDetail(data) {
  const panel = document.getElementById('roadmap-detail-panel');
  if (!panel) return;
  if (data.type === 'chip') {
    const item = data.item;
    panel.innerHTML = `
      <h3 style="font-size:0.95rem;font-weight:700;color:${item.color};margin-bottom:0.25rem">${item.node} チップスケーリング</h3>
      <div style="font-size:0.72rem;color:var(--muted);margin-bottom:0.5rem">${item.year}〜${item.endYear||''} | ${item.structure}</div>
      <div style="font-size:0.72rem;font-weight:700;color:var(--accent2);margin-bottom:0.25rem">露光: ${item.litho} | 密度: ${item.densityMTr} MTr/mm²</div>
      <ul style="font-size:0.75rem;color:var(--dim);margin-bottom:0.5rem;padding-left:1.2rem">${item.features.map(f=>`<li>${f}</li>`).join('')}</ul>
      <div style="font-size:0.72rem;font-weight:700;color:var(--muted);margin-bottom:0.25rem">主要企業:</div>
      <div style="margin-bottom:0.5rem">${item.companies.map(c=>`<span class="badge">${c}</span>`).join('')}</div>
      ${item.exampleProducts?.length ? `<div style="font-size:0.72rem;color:var(--accent3)">${item.exampleProducts.join(' / ')}</div>` : ''}
      <div style="margin-top:0.5rem;font-size:0.72rem;color:#fca5a5">⚠️ ${item.keyChallenge}</div>`;
  } else if (data.type === 'pkg') {
    const item = data.item;
    panel.innerHTML = `
      <h3 style="font-size:0.95rem;font-weight:700;color:${item.color};margin-bottom:0.25rem">${item.name.replace('\n',' ')}</h3>
      <div style="font-size:0.72rem;color:var(--muted);margin-bottom:0.5rem">${item.year}〜${item.endYear||''} | ${item.io}</div>
      <div style="font-size:0.72rem;color:var(--accent2);margin-bottom:0.4rem">ピッチ: ${item.pitch}</div>
      <div style="font-size:0.78rem;color:var(--dim);line-height:1.6;margin-bottom:0.5rem">${item.desc}</div>
      <div style="font-size:0.72rem;font-weight:700;color:var(--muted);margin-bottom:0.25rem">主要企業:</div>
      <div>${item.companies.map(c=>`<span class="badge">${c}</span>`).join('')}</div>`;
  } else if (data.type === 'mfr') {
    const ms = data.item;
    panel.innerHTML = `
      <h3 style="font-size:0.95rem;font-weight:700;color:${data.color};margin-bottom:0.25rem">${data.company} — ${ms.node}</h3>
      <div style="font-size:0.72rem;color:var(--muted);margin-bottom:0.5rem">${ms.year}年 | ${ms.type === 'pkg' ? 'パッケージ' : ms.type === 'node' ? 'チップノード' : 'マイルストーン'}</div>
      <div style="font-size:0.82rem;color:var(--dim);line-height:1.5">${ms.tech}</div>
      ${ms.highlight ? `<div style="margin-top:0.5rem;font-size:0.72rem;color:#fbbf24">⭐ 重要マイルストーン</div>` : ''}`;
  }
}

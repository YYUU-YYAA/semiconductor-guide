const DATA = {

  // ── CHIP CROSS-SECTION LAYERS ─────────────────────────────────────────
  chipLayers: [
    {
      id: 'bump',
      name: 'Cu Pillar / Bump',
      nameEn: 'Cu Pillar / Micro Bump',
      svgY: 30, svgH: 65,
      color: '#b45309',
      colorLight: '#d97706',
      role: 'チップとパッケージ基板を電気的・機械的に接続するバンプ。微細化が進みμBump化（ピッチ<10μm）が重要課題。',
      materials: [
        { name: 'Cu (銅)', role: 'バンプ本体', supplier: ['JX金属', 'DOWA', 'Umicore'] },
        { name: 'SnAg はんだ', role: 'はんだキャップ', supplier: ['Alpha Assembly Solutions', 'Indium Corp', '千住金属'] },
        { name: 'UBM (Ti/TiW/Ni)', role: 'Under Bump Metallurgy', supplier: ['Tosoh', 'Materion'] },
      ],
      equipment: [
        { name: '電解銅めっき装置', maker: ['Ebara', 'Lam Research', 'Atotech'] },
        { name: 'スパッタリング装置 (PVD)', maker: ['AMAT', 'Ulvac', 'Evatec'] },
        { name: 'フォトリソ装置', maker: ['Canon', 'Nikon', 'EVG'] },
      ],
      processes: ['PVD (UBM成膜)', '厚膜レジスト露光', '電解Cu/Snめっき', 'リフロー'],
      challenges: ['ピッチ微細化 (<10μm)', 'Cu熱膨張によるストレス', 'ボイド抑制'],
      newsQuery: 'Cu pillar micro bump advanced packaging 2025'
    },
    {
      id: 'passivation',
      name: 'パッシベーション層',
      nameEn: 'Passivation (SiN / Polyimide)',
      svgY: 95, svgH: 30,
      color: '#065f46',
      colorLight: '#059669',
      role: 'チップ表面を水分・汚染・機械的損傷から保護する最終保護膜。SiN + Polyimideの2層構造が主流。',
      materials: [
        { name: 'SiN (窒化シリコン)', role: 'バリア層', supplier: ['Versum', 'Air Liquide', '大陽日酸'] },
        { name: 'Polyimide (PI)', role: 'ストレスバッファ', supplier: ['東レ', 'HD Micro Systems', 'Hitachi Chemical'] },
        { name: 'SiO₂', role: 'バッファ層', supplier: ['Merck', 'Entegris'] },
      ],
      equipment: [
        { name: 'PECVD装置', maker: ['AMAT', 'Lam Research', 'ASM Int\'l'] },
        { name: 'スピンコーター', maker: ['TEL', 'SCREEN', 'Suss MicroTec'] },
        { name: 'キュアオーブン', maker: ['各社汎用'] },
      ],
      processes: ['PECVD SiN成膜', 'Polyimideスピンコート', '露光・現像', '硬化 (キュア)'],
      challenges: ['ピンホール欠陥抑制', 'ストレス管理', '開口部 (pad opening) 精度'],
      newsQuery: 'semiconductor passivation layer advanced node 2025'
    },
    {
      id: 'metal_top',
      name: '上層金属配線 (M6-M9+)',
      nameEn: 'Upper Metal Layers (Global Interconnect)',
      svgY: 125, svgH: 35,
      color: '#dc2626',
      colorLight: '#ef4444',
      role: 'グローバル配線層。電源・クロック・信号を長距離伝送。ライン幅が広く抵抗値を低減。一部はAlを使用。',
      materials: [
        { name: 'Cu (銅)', role: '主配線材料', supplier: ['JX金属', 'Honeywell', 'Planar Solutions'] },
        { name: 'Al (アルミ)', role: '最上層配線 (一部)', supplier: ['Tosoh', 'ULVAC'] },
        { name: 'SiOCH / Low-k', role: '層間絶縁膜', supplier: ['Air Products', 'Merck', 'JSR'] },
        { name: 'TaN/Ta バリアメタル', role: 'Cu拡散防止', supplier: ['Materion', 'Plansee'] },
      ],
      equipment: [
        { name: 'Cu電解めっき装置', maker: ['Lam Research', 'Ebara'] },
        { name: 'PVDスパッタ (TaN/Ta)', maker: ['AMAT', 'Ulvac'] },
        { name: 'CMP装置', maker: ['AMAT', 'Ebara', 'KCTECH'] },
      ],
      processes: ['低誘電率膜成膜 (CVD)', 'デュアルダマシン加工', 'Cu電解めっき', 'CMP'],
      challenges: ['Low-kのメカニカル強度', 'RC遅延 (抵抗×容量)', 'エレクトロマイグレーション'],
      newsQuery: 'BEOL copper interconnect low-k dielectric 2025'
    },
    {
      id: 'imd',
      name: '層間絶縁膜 (IMD/ILD)',
      nameEn: 'Inter-Metal Dielectric (Low-k)',
      svgY: 160, svgH: 28,
      color: '#374151',
      colorLight: '#4b5563',
      role: '金属配線層間を絶縁しRC遅延を低減するポーラス低誘電率材料。k値=2.4〜2.6が最先端。',
      materials: [
        { name: 'SiOCH (organosilicate)', role: 'Low-k誘電体 k≈2.5', supplier: ['Air Products (PRECURSORS)', 'Merck', 'JSR'] },
        { name: 'SiCN / SiCOH', role: 'Etch Stop Layer', supplier: ['Versum Materials', 'Air Liquide'] },
        { name: 'Air-gap (空気層)', role: '超低k (k≈1)', supplier: ['TSMC独自プロセス'] },
      ],
      equipment: [
        { name: 'PECVD装置', maker: ['AMAT (Producer)', 'ASM Int\'l'] },
        { name: 'UV硬化装置', maker: ['Mattson', 'AMAT'] },
      ],
      processes: ['PECVD low-k成膜', 'UV硬化 (ポロシティ付与)', 'プラズマ処理 (SiC cap)'],
      challenges: ['k値と機械強度のトレードオフ', 'プラズマダメージ', 'Cu拡散バリア性'],
      newsQuery: 'low-k dielectric IMD advanced node 3nm 2025'
    },
    {
      id: 'm1',
      name: 'M1 ローカル配線 (BEOL下層)',
      nameEn: 'M1 / Local Interconnect (BEOL)',
      svgY: 188, svgH: 28,
      color: '#c2410c',
      colorLight: '#ea580c',
      role: 'ゲートとコンタクトを繋ぐ最下層配線。最微細ピッチ。先端ノードではRu (ルテニウム) への転換が進行中。',
      materials: [
        { name: 'Cu (銅)', role: '従来主流', supplier: ['JX金属', 'Entegris'] },
        { name: 'Ru (ルテニウム)', role: '次世代 (2nm以降)', supplier: ['田中貴金属', 'Materion', 'Umicore'] },
        { name: 'Co (コバルト)', role: 'ライナー / M0', supplier: ['Umicore', 'Glencore'] },
        { name: 'TaN / TiN バリア', role: 'Cu拡散防止', supplier: ['Materion', 'Plansee', 'Tosoh'] },
      ],
      equipment: [
        { name: 'ALD装置 (Ru/Co)', maker: ['ASM Int\'l', 'Lam Research', 'CVD Equipment'] },
        { name: 'Cu電解めっき', maker: ['Lam Research', 'Ebara'] },
        { name: 'Dry CMP', maker: ['AMAT', 'Ebara'] },
      ],
      processes: ['ALD バリアメタル成膜', 'ALD / CVD Ru成膜', 'ダマシン + CMP'],
      challenges: ['ライン抵抗増大 (サイズ効果)', '晶粒界散乱', 'Ru ALD速度向上'],
      newsQuery: 'ruthenium interconnect metal M1 2nm node 2025'
    },
    {
      id: 'contact',
      name: 'コンタクト / Via',
      nameEn: 'Contact / Via (Co, W, Ru)',
      svgY: 216, svgH: 30,
      color: '#1d4ed8',
      colorLight: '#2563eb',
      role: 'トランジスタのソース/ドレイン・ゲートと配線層を電気接続する微細コンタクトホール。高アスペクト比が特徴。',
      materials: [
        { name: 'W (タングステン)', role: '従来コンタクト充填材', supplier: ['Plansee', 'H.C. Starck'] },
        { name: 'Co (コバルト)', role: '先端ノード コンタクト', supplier: ['Umicore', 'Glencore', 'Entegris'] },
        { name: 'Ru (ルテニウム)', role: '2nm以降 コンタクト', supplier: ['田中貴金属', 'Materion'] },
        { name: 'TiN ライナー', role: '拡散バリア', supplier: ['Entegris', 'Tosoh', 'ULVAC'] },
      ],
      equipment: [
        { name: 'ALD/CVD装置', maker: ['ASM Int\'l', 'Lam Research', 'Kokusai Electric'] },
        { name: 'エッチング装置 (高アスペクト比)', maker: ['Lam Research', 'TEL', 'AMAT'] },
      ],
      processes: ['コンタクトホール エッチング', 'TiN ALD (バリア)', 'W/Co CVD充填', 'CMP'],
      challenges: ['高アスペクト比 (20:1以上)', 'ボイド欠陥', 'コンタクト抵抗低減'],
      newsQuery: 'contact resistance cobalt tungsten ruthenium 2nm 2025'
    },
    {
      id: 'gate',
      name: 'ゲートスタック (HK-MG)',
      nameEn: 'Gate Stack: High-k / Metal Gate',
      svgY: 246, svgH: 42,
      color: '#7c3aed',
      colorLight: '#8b5cf6',
      role: 'トランジスタのスイッチング動作を制御する核心部。High-k (HfO₂) + Metal Gate (TiN/W) が45nm以降の標準構成。GAA構造では「nanosheetを包む」形状になる。',
      materials: [
        { name: 'HfO₂ (酸化ハフニウム)', role: 'High-k ゲート絶縁膜 k≈22', supplier: ['Entegris', 'Air Liquide', '大陽日酸 (前駆体)'] },
        { name: 'TiN / TiAlC', role: 'Work Function Metal', supplier: ['Tosoh', 'Entegris', 'Merck'] },
        { name: 'W / WN', role: 'Gate Fill Metal', supplier: ['Plansee', 'H.C. Starck', 'Entegris'] },
        { name: 'SiO₂/SiON (interface layer)', role: 'Si界面制御', supplier: ['Merck', 'Air Products'] },
      ],
      equipment: [
        { name: 'ALD装置 (HfO₂)', maker: ['ASM Int\'l', 'Jusung Engineering', 'Kokusai Electric'] },
        { name: 'ALD / CVD (TiN)', maker: ['ASM Int\'l', 'Lam Research'] },
        { name: 'W CVD (Gate fill)', maker: ['Kokusai Electric', 'Lam Research'] },
      ],
      processes: ['Dummy Gate形成→除去 (Gate-Last)', 'HfO₂ ALD', 'Work Function Metal ALD', 'Gate Fill (W CVD)', 'Gate CMP'],
      challenges: ['PBTI/NBTI信頼性', 'Vt均一性', 'GAA nanosheet均一制御', 'Gate length <10nm'],
      newsQuery: 'high-k metal gate GAA nanosheet 2nm 3nm 2025'
    },
    {
      id: 'sd',
      name: 'ソース / ドレイン + Fin/Nanosheet',
      nameEn: 'Source/Drain + Fin / Nanosheet (Epitaxial)',
      svgY: 288, svgH: 35,
      color: '#92400e',
      colorLight: '#b45309',
      role: 'FinFETではSiの"ヒレ"、GAAでは積層ナノシートがチャネル。S/DにSiGe(PMOS)やSiP(NMOS)をエピタキシャル成長させストレスでキャリア移動度を向上。',
      materials: [
        { name: 'Si (シリコン)', role: 'Nチャネル Fin/Nanosheet', supplier: ['信越化学', 'SUMCO (ウェーハ)'] },
        { name: 'SiGe (シリコンゲルマニウム)', role: 'PMOS S/D ストレッサー', supplier: ['Air Liquide', 'Merck (GeH₄前駆体)'] },
        { name: 'SiP (リン添加Si)', role: 'NMOS S/D', supplier: ['Air Products', 'Lam (プロセス)'] },
        { name: 'SiGe (犠牲層)', role: 'GAA Nanosheet解放用', supplier: ['Air Liquide'] },
      ],
      equipment: [
        { name: 'エピタキシャル成長装置 (CVD)', maker: ['AMAT (Centura Epi)', 'ASM Int\'l (Epsilon)', 'TEL'] },
        { name: 'フィンエッチング装置', maker: ['Lam Research', 'TEL', 'AMAT'] },
        { name: 'Nanosheet解放 エッチング', maker: ['Lam Research (MERIE)', 'TEL'] },
      ],
      processes: ['Si Fin/Nanosheet パターニング', 'SiGe/Si多層エピ成長 (GAA)', 'Selective SiGe etching (Nanosheet解放)', 'SiGe/SiP S/Dエピ', 'ドーパント活性化アニール'],
      challenges: ['Nanosheet幅・厚さの均一制御', 'S/Dストレス最適化', '短チャネル効果抑制', 'DIBL低減'],
      newsQuery: 'nanosheet GAA gate-all-around 2nm TSMC Intel Samsung 2025'
    },
    {
      id: 'sti',
      name: 'STI (浅溝素子分離)',
      nameEn: 'Shallow Trench Isolation (STI)',
      svgY: 323, svgH: 30,
      color: '#065f46',
      colorLight: '#047857',
      role: '隣接するトランジスタ間を電気的に分離するSiO₂充填トレンチ。先端ノードでは深さ200〜300nm程度。',
      materials: [
        { name: 'SiO₂ (酸化シリコン)', role: 'トレンチ充填絶縁体', supplier: ['Merck', 'Versum', 'Air Products'] },
        { name: 'SiN (窒化シリコン)', role: 'ハードマスク', supplier: ['Versum', 'Air Liquide', '大陽日酸'] },
        { name: 'HDP-CVD SiO₂', role: '高密度プラズマ充填', supplier: ['Lam Research (プロセス)'] },
      ],
      equipment: [
        { name: 'プラズマエッチング装置 (Si RIE)', maker: ['Lam Research', 'TEL', 'AMAT'] },
        { name: 'HDP-CVD装置', maker: ['Lam Research', 'AMAT'] },
        { name: 'CMP装置', maker: ['AMAT', 'Ebara'] },
      ],
      processes: ['SiNハードマスク成膜', 'STIトレンチエッチング', 'ライナー酸化', 'HDP SiO₂充填', 'CMP平坦化'],
      challenges: ['STIエッジ でのストレス誘起欠陥', 'ナローチャネル効果', 'DPT (ダブルパターニング) との整合'],
      newsQuery: 'shallow trench isolation STI advanced semiconductor process 2025'
    },
    {
      id: 'substrate',
      name: 'Si基板 (ウェーハ)',
      nameEn: 'Silicon Substrate (Wafer)',
      svgY: 353, svgH: 80,
      color: '#1e3a5f',
      colorLight: '#1e40af',
      role: 'デバイスの土台となる単結晶Siウェーハ。300mm径が主流。SOI (絶縁体上Si) はRF・低消費電力用途。',
      materials: [
        { name: 'Si (単結晶)', role: 'ウェーハ本体', supplier: ['信越化学 (世界シェア1位)', 'SUMCO (2位)', 'SK Siltron', 'Siltronic', 'GlobalWafers'] },
        { name: 'BOX層 (SiO₂)', role: 'SOIウェーハ絶縁層', supplier: ['Soitec (SOIウェーハ)', '信越化学'] },
        { name: 'ドーパント (B, P, As)', role: 'Well形成 (P/N型)', supplier: ['Entegris', '関東化学'] },
      ],
      equipment: [
        { name: 'CZ引き上げ装置 (シリコン育成)', maker: ['Kayex (GT Advanced)', 'Ferrotec', 'Jinggong'] },
        { name: 'ワイヤーソー (スライシング)', maker: ['Meyer Burger', 'Takatori', '中村超硬'] },
        { name: 'ウェーハ研磨 (CMP/ポリッシュ)', maker: ['DISCO', 'Speed Fam', 'Lapmaster'] },
      ],
      processes: ['CZ法 (チョクラルスキー育成)', 'インゴットスライシング', 'ラッピング→エッチング→CMP→洗浄', 'エピタキシャル成長 (一部)'],
      challenges: ['大口径化 (450mm移行停滞)', '完全欠陥フリー結晶', 'Ultra-low defect density', 'SOI均一厚さ'],
      newsQuery: 'silicon wafer 300mm supply shortage 2025'
    },
  ],

  // ── PACKAGE CROSS-SECTION LAYERS ──────────────────────────────────────
  packageLayers: [
    {
      id: 'pkg_hbm',
      name: 'HBM (High Bandwidth Memory)',
      nameEn: 'HBM Stack (3D DRAM)',
      svgY: 20, svgH: 70,
      color: '#7c3aed',
      colorLight: '#8b5cf6',
      role: '複数のDRAMダイをTSV (Through-Silicon Via) で3D積層した超広帯域メモリ。AI/GPU用途で不可欠。HBM4で1TB/s超を実現。',
      materials: [
        { name: 'Si TSV (Through-Silicon Via)', role: 'ダイ間垂直配線', supplier: ['SK Hynix', 'Micron', 'Samsung (HBMメーカー)'] },
        { name: 'μBump (Cu/SnAg)', role: 'ダイ間接合', supplier: ['Alpha Assembly', 'Indium Corp'] },
        { name: 'NCF (Non-Conductive Film)', role: 'μBump接合用フィルム', supplier: ['味の素ファインテクノ (AFC)', 'レゾナック'] },
      ],
      equipment: [
        { name: 'TSV 深穴ドリル (Bosch法)', maker: ['Lam Research', 'TEL'] },
        { name: 'ダイボンダー (TCB)', maker: ['BESI', 'Toray Engineering', '日立パワーデバイス'] },
        { name: 'KGD (Known Good Die) テスト', maker: ['Advantest', 'Teradyne'] },
      ],
      processes: ['TSV形成 (Via-Middle/Last)', 'μBump形成', 'TC Bonding (熱圧着)', 'NCF硬化', 'Molding'],
      challenges: ['HBM4 12層積層', 'μBumpピッチ <10μm (ハイブリッドボンディングへ)', 'サーマル管理', 'テスト難易度'],
      newsQuery: 'HBM4 high bandwidth memory SK Hynix Samsung Micron 2025'
    },
    {
      id: 'pkg_die',
      name: 'GPU / SoC ダイ',
      nameEn: 'Logic Die (GPU / AI Chip)',
      svgY: 90, svgH: 55,
      color: '#dc2626',
      colorLight: '#ef4444',
      role: 'CoWoS基板上に搭載されるGPUやAIチップ本体。TSMC N3/N2などの先端プロセスで製造。',
      materials: [
        { name: 'Si (N2/N3 logic die)', role: 'チップ本体', supplier: ['TSMC (製造)', 'Samsung', 'Intel Foundry'] },
        { name: 'Cu Pillar', role: 'インターポーザー接続バンプ', supplier: ['JX金属', 'Atotech'] },
      ],
      equipment: [
        { name: 'EUVリソグラフィ', maker: ['ASML (NXE:3800E)'] },
        { name: 'フリップチップボンダー', maker: ['BESI', 'Toray Engineering'] },
      ],
      processes: ['Wafer fab (TSMC等)', 'Wafer bumping', 'Flip chip bonding onto interposer'],
      challenges: ['歩留まり管理', '熱放散 (300W+)', 'CoD (Chiplet on Die) 移行'],
      newsQuery: 'TSMC CoWoS advanced packaging AI chip 2025'
    },
    {
      id: 'pkg_interposer',
      name: 'シリコンインターポーザー (CoWoS)',
      nameEn: 'Si Interposer / CoWoS / EMIB',
      svgY: 145, svgH: 45,
      color: '#1d4ed8',
      colorLight: '#2563eb',
      role: 'GPUとHBMを超微細配線で横につなぐ橋渡し基板。CoWoS-S (Si)、CoWoS-L (Local Si+有機)、EMIB (Intel) など。配線ピッチ0.4〜2μm。',
      materials: [
        { name: 'Si インターポーザー', role: '微細RDL基板', supplier: ['TSMC (CoWoS-S)', 'UMC', 'GlobalFoundries'] },
        { name: 'Cu RDL配線', role: '超微細横配線 (ピッチ<2μm)', supplier: ['電解Cu (各社)'] },
        { name: 'TSV (Si貫通電極)', role: 'インターポーザー縦配線', supplier: ['TSMC / OSAT内製'] },
        { name: 'SiO₂ / Low-k IMD', role: 'RDL絶縁', supplier: ['Merck', 'Air Products'] },
      ],
      equipment: [
        { name: 'EUV / DUVリソグラフィ (RDL)', maker: ['ASML', 'Nikon'] },
        { name: 'Cu電解めっき (RDL)', maker: ['Lam Research', 'Ebara'] },
        { name: 'ウェーハ研削/薄化', maker: ['DISCO', 'Tokyo Seimitsu'] },
      ],
      processes: ['Si wafer RDL配線形成', 'TSV形成', 'ウェーハ薄化', 'GPU/HBMボンディング', 'Under Fillアンダーフィル'],
      challenges: ['Si インターポーザーコスト', 'ガラスインターポーザーへの移行', 'RDLピッチ微細化 (<1μm)'],
      newsQuery: 'CoWoS silicon interposer glass interposer 2025 TSMC'
    },
    {
      id: 'pkg_substrate',
      name: '有機パッケージ基板 (ABF基板)',
      nameEn: 'Organic Package Substrate (ABF)',
      svgY: 190, svgH: 55,
      color: '#374151',
      colorLight: '#4b5563',
      role: 'インターポーザーとマザーボード間を接続するビルドアップ多層基板。ABF (味の素ビルドアップフィルム) が絶縁材。',
      materials: [
        { name: 'ABF (Ajinomoto Build-up Film)', role: '絶縁ビルドアップ材', supplier: ['味の素ファインテクノ (世界独占的)'] },
        { name: 'ガラスクロス / FR-4コア', role: 'コア基材', supplier: ['日東紡', '旭化成', 'Isola', 'Shengyi'] },
        { name: 'Cu箔・電解銅', role: '配線層', supplier: ['JX金属', '古河電工', 'Mitsui Mining'] },
        { name: 'はんだレジスト (SR)', role: '表面保護', supplier: ['太陽インキ', 'Taiyo Holdings'] },
      ],
      equipment: [
        { name: 'レーザードリル (via形成)', maker: ['Mitsubishi Electric', 'ESI (MKS)', '日立ビアメカニクス'] },
        { name: 'セミアディティブ (SAP) めっきライン', maker: ['Atotech', 'MacDermid Enthone'] },
        { name: 'AOI検査装置', maker: ['Orbotech (KLA)', 'Camtek', 'Koh Young'] },
      ],
      processes: ['コア基板準備', 'ABFラミネート', 'レーザービア形成', 'デスミア処理', '無電解/電解Cuめっき', 'エッチング / SAP', '多層ビルドアップ'],
      challenges: ['ABF供給不足 (AI需要急増)', 'L/S=2μm/2μm以下 (mSAP)', 'ワーページ (反り) 管理', 'コスト高'],
      newsQuery: 'ABF substrate Ajinomoto shortage AI server packaging 2025'
    },
    {
      id: 'pkg_underfill',
      name: 'アンダーフィル / MUF',
      nameEn: 'Underfill / Molded Underfill (MUF)',
      svgY: 245, svgH: 20,
      color: '#78350f',
      colorLight: '#92400e',
      role: 'バンプ間の空隙を充填し熱サイクル信頼性を確保する封止材。毛細管現象 (CUF) またはモールドで充填 (MUF)。',
      materials: [
        { name: 'Epoxy系アンダーフィル', role: '充填封止', supplier: ['Namics', 'Henkel', '日立化成 (レゾナック)', 'Shin-Etsu MicroSi'] },
        { name: 'フラックス (はんだ付け補助)', role: 'リフロー時酸化防止', supplier: ['Alpha Assembly', 'Senju Metal Industry'] },
      ],
      equipment: [
        { name: 'アンダーフィルディスペンサー', maker: ['Nordson', 'Asymtek', 'GPD'] },
        { name: 'キュアオーブン', maker: ['各社汎用'] },
      ],
      processes: ['フラックス塗布', 'TC Bonding (Thermo-Compression)', 'CUF/MUF注入', '硬化 (キュア)'],
      challenges: ['ボイド欠陥', '高温信頼性 (Junction Temp >150°C)', 'μBump間への充填 (ピッチ<10μm)'],
      newsQuery: 'underfill advanced packaging HBM reliability 2025'
    },
    {
      id: 'pkg_bga',
      name: 'BGAボール / C4バンプ',
      nameEn: 'BGA Solder Balls / C4 Bumps',
      svgY: 265, svgH: 30,
      color: '#b45309',
      colorLight: '#d97706',
      role: 'パッケージ基板とマザーボードを接続するはんだボール。Pb-free (SnAgCu) が標準。ピッチ通常0.4〜1.0mm。',
      materials: [
        { name: 'SnAgCu はんだ (SAC305)', role: 'Pb-free標準はんだ', supplier: ['Alpha Assembly Solutions', 'Senju Metal Industry', '千住金属'] },
        { name: 'Cu コア入りボール', role: '反り対策', supplier: ['積水化学', 'Nippon Steel'] },
      ],
      equipment: [
        { name: 'ボールマウンター', maker: ['SHIBUYA', 'Athlete FA', 'Pac Tech'] },
        { name: 'リフロー炉', maker: ['ERSA', 'Heller', '光洋サーモシステム'] },
      ],
      processes: ['フラックス印刷', 'BGAボール搭載', 'リフロー', '洗浄', '外観検査 (AOI)'],
      challenges: ['熱サイクル信頼性 (BGA joint crack)', 'ファインピッチ化', 'Pb-free 鉛フリー対応'],
      newsQuery: 'BGA substrate advanced packaging reliability 2025'
    },
  ],

  // ── MANUFACTURING PROCESSES ───────────────────────────────────────────
  processes: [
    {
      id: 'litho',
      name: 'リソグラフィ',
      icon: '🔆',
      description: 'パターンを光でウェーハに焼き付けるプロセス。EUV (13.5nm光) が7nm以降の必須技術。',
      materials: [
        { name: 'EUVフォトレジスト', supplier: ['JSR (世界シェア1位)', 'Tokyo Ohka Kogyo (TOK)', '住友化学', 'Shin-Etsu Chemical'] },
        { name: 'フォトマスク (EUVマスク)', supplier: ['Hoya', 'AGC', 'Toppan Photomasks', 'TSMC内製'] },
        { name: 'EUV用ブランクマスク', supplier: ['AGC (世界主要)', 'Hoya', 'S&S Tech'] },
        { name: 'ArFフォトレジスト (DUV)', supplier: ['JSR', 'TOK', '信越化学', '富士フイルム'] },
        { name: 'BARC / TARC (反射防止膜)', supplier: ['Brewer Science', 'AZ Electronic Materials (Merck)'] },
        { name: 'Pellicle (防塵フィルム)', supplier: ['信越化学', 'Mitsui Chemicals', 'ASML (開発中)'] },
      ],
      equipment: [
        { name: 'EUV露光装置 (ASML NXE)', supplier: ['ASML (独占)', '出力: 350W+'] },
        { name: 'ArF液浸露光装置 (DUV)', supplier: ['ASML (主流)', 'Nikon', 'Canon'] },
        { name: 'コータ/デベロッパー (塗布/現像)', supplier: ['TEL (Lithius Pro)', 'SCREEN Semiconductor'] },
        { name: 'オーバーレイ計測装置', supplier: ['ASML (YieldStar)', 'KLA', 'Nova'] },
      ],
      keySuppliers: ['ASML', 'JSR', 'TOK', '信越化学', 'Hoya', 'AGC', 'TEL'],
      newsQuery: 'EUV lithography ASML High-NA 2025'
    },
    {
      id: 'etch',
      name: 'エッチング',
      icon: '⚡',
      description: 'パターンに従い薄膜を精密に削るプロセス。プラズマを使うドライエッチングが主流。原子層エッチング (ALE) が最先端。',
      materials: [
        { name: 'エッチングガス (CF₄, SF₆, Cl₂, HBr)', supplier: ['Air Products', 'Linde', '大陽日酸', 'Air Liquide'] },
        { name: 'フォトレジスト / ハードマスク', supplier: ['JSR', 'TOK', '信越化学'] },
        { name: 'SiN / SiC ハードマスク材', supplier: ['Merck', 'Versum'] },
      ],
      equipment: [
        { name: 'プラズマエッチング装置 (CCP/ICP)', supplier: ['Lam Research (世界1位)', 'TEL', 'AMAT', 'Hitachi High-Tech'] },
        { name: 'ウェットエッチング装置', supplier: ['TEL', 'SCREEN', 'AP Systems'] },
        { name: '原子層エッチング (ALE)', supplier: ['Lam Research', 'AMAT', 'TEL'] },
      ],
      keySuppliers: ['Lam Research', 'TEL', 'AMAT', 'Air Products', 'Linde', '大陽日酸'],
      newsQuery: 'atomic layer etch plasma etching advanced node 2025'
    },
    {
      id: 'deposition',
      name: '成膜 (CVD / ALD / PVD)',
      icon: '🌫️',
      description: '薄膜を形成するプロセス。CVD (化学気相成長), ALD (原子層成長), PVD (スパッタリング) が主要手法。先端では ALD が必須。',
      materials: [
        { name: 'Si前駆体 (SiH₄, TEOS, DCS)', supplier: ['Merck', 'Air Liquide', '大陽日酸', 'Entegris'] },
        { name: 'Hf前駆体 (High-k用)', supplier: ['Air Liquide', 'Entegris', '大陽日酸'] },
        { name: 'Ti / TiN / TaN ターゲット (PVD)', supplier: ['Tosoh', 'Plansee', 'Materion', 'ULVAC'] },
        { name: 'W前駆体 (WF₆)', supplier: ['Entegris', '関東電化工業'] },
        { name: 'Co / Ru 前駆体 (ALD)', supplier: ['Versum (Merck)', 'Strem Chemicals', 'UP Chemical'] },
      ],
      equipment: [
        { name: 'PECVD / SACVD装置', supplier: ['AMAT (Centura)', 'Lam Research', 'ASM Int\'l (PEALD)'] },
        { name: 'ALD装置', supplier: ['ASM Int\'l (Pulsar)', 'Lam Research (SALD)', 'TEL', 'Kokusai Electric'] },
        { name: 'PVD (スパッタリング) 装置', supplier: ['AMAT (Endura)', 'Ulvac', 'Evatec'] },
        { name: '縦型バッチ CVD/ALD 炉', supplier: ['Kokusai Electric (国際電気)', 'ASM Int\'l', 'TEL'] },
      ],
      keySuppliers: ['AMAT', 'ASM Int\'l', 'Lam Research', 'TEL', 'Kokusai Electric', 'Merck', 'Air Liquide', 'Entegris'],
      newsQuery: 'ALD atomic layer deposition advanced semiconductor 2025'
    },
    {
      id: 'cmp',
      name: 'CMP (化学機械研磨)',
      icon: '💿',
      description: 'ウェーハ表面を原子レベルで平坦化するプロセス。配線層ごとに必要。スラリーと研磨パッドが消耗品として重要。',
      materials: [
        { name: 'CMP スラリー (Cu / SiO₂ / STI)', supplier: ['Cabot Microelectronics (CMC)', '富士フイルム', 'Versum (Merck)', 'Fujimi', 'Asahi Glass (AGC)'] },
        { name: '研磨パッド', supplier: ['Dow (Rohm & Haas)', 'Cabot', '3M'] },
        { name: 'ダイヤモンドドレッサー', supplier: ['Kinik', 'Entegris', '旭ダイヤ'] },
      ],
      equipment: [
        { name: 'CMP装置', supplier: ['AMAT (Reflexion GT)', 'Ebara (FREX)', 'Okamoto Machine', 'KCTECH'] },
        { name: 'Post-CMP洗浄装置', supplier: ['TEL', 'SCREEN', 'Aion'] },
        { name: '研磨終点検出 (EPD)', supplier: ['AMAT内蔵', 'KLA (計測)'] },
      ],
      keySuppliers: ['AMAT', 'Ebara', 'Cabot (CMC)', 'Dow', '富士フイルム', 'Fujimi'],
      newsQuery: 'CMP slurry advanced packaging wafer planarization 2025'
    },
    {
      id: 'ion',
      name: 'イオン注入',
      icon: '💉',
      description: '不純物イオン (B, P, As) をウェーハに打ち込みP型/N型を形成するプロセス。Well形成・S/D形成に使用。',
      materials: [
        { name: 'BF₂, B₁₀H₁₄ (ボロン)', role: 'P型ドーパント', supplier: ['Air Products', 'Linde', '住友精化'] },
        { name: 'AsH₃ (ヒ素)', role: 'N型ドーパント', supplier: ['Air Products', '関東電化工業'] },
        { name: 'PH₃ (リン)', role: 'N型ドーパント', supplier: ['Air Products', 'Linde'] },
      ],
      equipment: [
        { name: 'イオン注入装置 (高電流/高エネルギー)', supplier: ['Axcelis Technologies (世界1位)', 'AMAT (VIISta)', 'Sumitomo Heavy Industries'] },
      ],
      keySuppliers: ['Axcelis', 'AMAT', 'Air Products', 'Linde', '住友重機', '関東電化工業'],
      newsQuery: 'ion implantation advanced semiconductor CMOS 2025'
    },
    {
      id: 'clean',
      name: '洗浄 (Wafer Clean)',
      icon: '🧹',
      description: 'プロセス間で発生する粒子・有機・金属汚染を除去するプロセス。全工程の30%以上が洗浄。RCA洗浄からSC-1/HF洗浄が主流。',
      materials: [
        { name: 'H₂O₂ / NH₄OH (SC-1)', supplier: ['Stella Chemifa', '三菱ガス化学', '徳山曹達'] },
        { name: 'HF (フッ酸)', supplier: ['Stella Chemifa', 'Honeywell', 'ANOFI'] },
        { name: 'IPA (イソプロピルアルコール)', supplier: ['Tokuyama', '三井化学', 'Dow'] },
        { name: '超純水 (UPW)', supplier: ['野村マイクロ・サイエンス', 'Kurita Water', 'Pall (Danaher)'] },
      ],
      equipment: [
        { name: 'バッチ式ウェット洗浄装置', supplier: ['TEL (CELLESTA)', 'SCREEN (SU-3300)', 'Aion'] },
        { name: '枚葉式スピン洗浄装置', supplier: ['TEL', 'SCREEN', 'Lam Research'] },
        { name: '超音波/メガソニック洗浄', supplier: ['TEL', 'SCREEN'] },
      ],
      keySuppliers: ['TEL', 'SCREEN', 'Stella Chemifa', '三菱ガス化学', '野村マイクロ', 'Kurita'],
      newsQuery: 'wafer cleaning semiconductor chemicals purity 2025'
    },
    {
      id: 'inspection',
      name: '検査・計測 (Inspection & Metrology)',
      icon: '🔭',
      description: '欠陥発見と寸法計測でプロセス品質を保証。AI活用の欠陥レビューが急速に普及。コストの15〜20%を占める。',
      materials: [
        { name: 'OPC (光学近接補正) マスク', supplier: ['Synopsys', 'Cadence', 'Mentor (Siemens EDA)'] },
      ],
      equipment: [
        { name: '光学欠陥検査 (Brightfield/Darkfield)', supplier: ['KLA (Surfscan, eSL10)', 'AMAT', 'Hitachi High-Tech'] },
        { name: '電子線欠陥レビュー (e-SEM)', supplier: ['KLA (eS40)', 'Hitachi High-Tech', 'AMAT'] },
        { name: 'CD-SEM (寸法計測)', supplier: ['Hitachi High-Tech (CG6300)', 'KLA', 'AMAT'] },
        { name: '薄膜計測 (光学)', supplier: ['KLA (Archer)', 'Nova Measuring', 'Onto Innovation'] },
        { name: 'EUV Mask Inspection', supplier: ['KLA (eSL10 AIMS)', 'ASML (HMI)'] },
      ],
      keySuppliers: ['KLA (世界1位)', 'AMAT', 'Hitachi High-Tech', 'Nova', 'Onto Innovation', 'Camtek'],
      newsQuery: 'semiconductor inspection metrology KLA AI defect review 2025'
    },
  ],

  // ── MANUFACTURERS & NODES ─────────────────────────────────────────────
  manufacturers: [
    {
      id: 'tsmc',
      name: 'TSMC',
      country: '🇹🇼 台湾',
      logo: 'T',
      color: '#2563eb',
      description: '世界最大のファウンドリ。N2 (GAA) で2025年量産。Arizona/Japan (熊本) でも製造拠点展開中。',
      nodes: [
        {
          node: 'N2',
          structure: 'GAA (Nanosheet)',
          year: '2025',
          status: '量産開始',
          statusColor: '#16a34a',
          density: '2倍 vs N3E',
          power: '-25〜30% vs N3E',
          performance: '+10〜15% vs N3E',
          features: ['GAAナノシート (3枚積層)', 'PowerRail (電源配線改善)', 'Backside Power Delivery (N2P)'],
          customers: ['Apple (iPhone 17)', 'Qualcomm', 'NVIDIA'],
          challenges: ['GAA均一制御', 'Multi-Vt調整', 'コスト'],
          newsQuery: 'TSMC N2 nanosheet GAA production 2025'
        },
        {
          node: 'N3E / N3P',
          structure: 'FinFET',
          year: '2023-2024',
          status: '量産中',
          statusColor: '#16a34a',
          density: '1.6倍 vs N5',
          power: '-34% vs N5',
          performance: '+18% vs N5',
          features: ['Multi-Bridge-Channel FinFET', '6世代 FinFET完成形', 'SRAM改善'],
          customers: ['Apple (A17/M4)', 'Qualcomm (Snapdragon 8 Gen 3)', 'AMD', 'NVIDIA H200'],
          challenges: ['EUV多重露光コスト', '歩留まり安定化'],
          newsQuery: 'TSMC N3E N3P production Apple Qualcomm 2024 2025'
        },
        {
          node: 'N2P / A16',
          structure: 'GAA + Super Power Rail',
          year: '2026',
          status: '開発中',
          statusColor: '#d97706',
          density: 'N2比+10%',
          power: 'N2比-5〜10%',
          performance: '+5% vs N2',
          features: ['BSPDN (Backside Power Delivery Network)', 'Super Power Rail', 'N2比で性能/電力改善'],
          customers: ['Apple (A20?)', 'NVIDIA', 'AMD'],
          challenges: ['両面プロセス統合難度', 'バックサイドビア形成'],
          newsQuery: 'TSMC A16 N2P backside power delivery 2026'
        },
        {
          node: 'CoWoS / SoIC',
          structure: '2.5D/3D Packaging',
          year: '2024-2025',
          status: '急拡大',
          statusColor: '#16a34a',
          density: 'HBM+GPU集積',
          power: 'I/O電力削減',
          performance: 'TB/s帯域',
          features: ['CoWoS-L (大面積)', 'SoIC (3D IC積層)', 'Hybrid Bonding (<1μmピッチ)'],
          customers: ['NVIDIA (H100/H200/B200)', 'AMD', 'Google (TPU)'],
          challenges: ['CoWoS供給ボトルネック', 'サーマル管理', '歩留まり'],
          newsQuery: 'TSMC CoWoS SoIC advanced packaging 2025'
        },
      ]
    },
    {
      id: 'intel',
      name: 'Intel Foundry',
      country: '🇺🇸 米国',
      logo: 'I',
      color: '#0284c7',
      description: 'IDM 2.0戦略でファウンドリ参入。Intel 18A (RibbonFET+PowerVia) がGAAと裏面電源の先行実装を目指す。',
      nodes: [
        {
          node: 'Intel 18A',
          structure: 'RibbonFET (GAA) + PowerVia (BSPDN)',
          year: '2025',
          status: '量産準備中',
          statusColor: '#d97706',
          density: 'N3相当',
          power: '大幅削減 (BSPDN効果)',
          performance: '競合比+15%目標',
          features: ['RibbonFET (Intel版 GAA)', 'PowerVia (バックサイド電源)', 'EMIB 2.5D packaging'],
          customers: ['Microsoft (内部)', 'Amazon (検討中)', 'Qualcomm (検討中)'],
          challenges: ['ファウンドリ顧客開拓', '歩留まり不安', 'TSMC比で遅れ'],
          newsQuery: 'Intel 18A RibbonFET PowerVia foundry 2025'
        },
        {
          node: 'Intel 3',
          structure: 'FinFET (EUV)',
          year: '2024',
          status: '量産中 (Granite Rapids)',
          statusColor: '#16a34a',
          density: 'N5相当',
          power: '-18% vs Intel 4',
          performance: '+18% vs Intel 4',
          features: ['EUV使用', 'Intel 4の改良版', 'Server CPU向け'],
          customers: ['Intel (Xeon Granite Rapids)'],
          challenges: ['顧客向け歩留まり実績'],
          newsQuery: 'Intel 3 Intel 4 Granite Rapids CPU 2024'
        },
        {
          node: 'Foveros / EMIB',
          structure: '3D/2.5D Packaging',
          year: '2024-2025',
          status: '量産中',
          statusColor: '#16a34a',
          density: '3D Chiplet集積',
          power: '効率的I/O',
          performance: '高帯域',
          features: ['Foveros Omni (3D)', 'EMIB (Embedded Multi-die Interconnect Bridge)', 'Foveros Direct (Hybrid Bond)'],
          customers: ['Intel (Meteor Lake)', 'Microsoft', 'AWS'],
          challenges: ['大面積3D集積の歩留まり', 'サーマル'],
          newsQuery: 'Intel Foveros EMIB 3D chiplet packaging 2025'
        },
      ]
    },
    {
      id: 'samsung',
      name: 'Samsung Foundry',
      country: '🇰🇷 韓国',
      logo: 'S',
      color: '#1e40af',
      description: 'SF2 (2nm GAA) で2025年量産予定。GAA (MBCFET) を3nmから先行採用。歩留まり改善が最大課題。',
      nodes: [
        {
          node: 'SF2 (2nm)',
          structure: 'MBCFET (GAA)',
          year: '2025',
          status: '量産開始 (限定)',
          statusColor: '#d97706',
          density: 'SF3比+12%',
          power: '-25% vs SF3',
          performance: '+12% vs SF3',
          features: ['Multi-Bridge Channel FET (MBCFET)', '4枚ナノシート積層', 'Samsung独自GAA'],
          customers: ['Qualcomm (一部)？', 'Samsung自社 (Exynos)'],
          challenges: ['歩留まり問題 (業界最大懸念)', 'TSMC比での遅れ', '顧客離れ'],
          newsQuery: 'Samsung SF2 2nm GAA MBCFET yield 2025'
        },
        {
          node: 'SF3E (3nm)',
          structure: 'MBCFET (GAA)',
          year: '2023-2024',
          status: '量産中',
          statusColor: '#16a34a',
          density: '5LPE比+35%',
          power: '-45% vs 5LPE',
          performance: '+23% vs 5LPE',
          features: ['世界初3nm GAA量産', 'MBCFET採用', '3枚ナノシート'],
          customers: ['Samsung (Exynos 2400)'],
          challenges: ['歩留まり課題 (約35%との報告)', '主要顧客離脱 (Apple→TSMC)'],
          newsQuery: 'Samsung 3nm SF3E yield 2024'
        },
      ]
    },
    {
      id: 'rapidus',
      name: 'Rapidus',
      country: '🇯🇵 日本',
      logo: 'R',
      color: '#dc2626',
      description: 'IBMと連携し2nm製造を目指す日本の新興ファウンドリ。北海道千歳に工場建設中。2027年試作開始目標。',
      nodes: [
        {
          node: '2nm (試作)',
          structure: 'GAA (IBM技術ライセンス)',
          year: '2027',
          status: '工場建設中',
          statusColor: '#6b7280',
          density: 'N2相当目標',
          power: '競合水準目標',
          performance: '競合水準目標',
          features: ['IBM 2nm技術ベース', '日本初の先端ロジック製造', '千歳工場 (IIM-1)'],
          customers: ['未定 (政府支援)'],
          challenges: ['資金調達 (5兆円規模)', '人材確保', '技術習得', 'TSMC/Samsung比7年遅れ'],
          newsQuery: 'Rapidus 2nm Japan Chitose factory 2027'
        },
      ]
    },
    {
      id: 'smic',
      name: 'SMIC',
      country: '🇨🇳 中国',
      logo: 'C',
      color: '#dc2626',
      description: '中国最大のファウンドリ。輸出規制下でDUV多重露光を使いN+1 (7nm相当) を量産。先端EUVは入手不可。',
      nodes: [
        {
          node: 'N+1 / N+2',
          structure: 'FinFET (DUV SADP)',
          year: '2023-2024',
          status: '量産中 (限定)',
          statusColor: '#d97706',
          density: '7nm相当 (コスト高)',
          power: '不明',
          performance: '7nm相当',
          features: ['DUV多重露光で7nm実現', 'Huawei Kirin 9000S搭載 (Mate 60 Pro)', '輸出規制下での技術突破'],
          customers: ['Huawei', '中国国内向け'],
          challenges: ['EUVなしでの微細化限界', '輸出規制強化リスク', '歩留まり・コスト高'],
          newsQuery: 'SMIC 7nm DUV China sanctions Huawei 2024 2025'
        },
      ]
    },
  ],

  // ── PACKAGING TYPES ───────────────────────────────────────────────────
  packagingTypes: [
    {
      id: 'cof',
      name: 'Wire Bond / COF',
      icon: '🔌',
      description: '従来型ワイヤーボンディング。コスト最安。IoT・MCU・ディスクリート向け。',
      applications: ['MCU', 'MEMS', 'Power IC', 'IoT'],
      suppliers: ['ASE', 'Amkor', 'JCET', 'Powertech'],
      bandwidth: '低',
      cost: '最安',
      density: '低'
    },
    {
      id: 'fcbga',
      name: 'Flip Chip BGA (FC-BGA)',
      icon: '📦',
      description: '最も広く使われる高性能パッケージ。ABF基板使用。CPU/GPU/ネットワークチップ向け。',
      applications: ['CPU', 'GPU', 'FPGA', 'NIC', 'AI ASIC'],
      suppliers: ['IBIDEN', 'Shinko Electric (FC基板)', 'Unimicron', 'TTM Technologies', 'AT&S'],
      bandwidth: '高',
      cost: '中〜高',
      density: '中〜高'
    },
    {
      id: 'cowos',
      name: 'CoWoS (2.5D)',
      icon: '🔗',
      description: 'TSMCのChip-on-Wafer-on-Substrate。Siインターポーザー上にGPU+HBMを並べる。AI GPU必須技術。',
      applications: ['AI GPU (NVIDIA H100/B200)', 'HPC', 'AI ASIC (Google TPU)'],
      suppliers: ['TSMC (CoWoS)', 'ASE (CoSx)', 'Amkor'],
      bandwidth: '超高 (TB/s)',
      cost: '高',
      density: '高'
    },
    {
      id: 'info',
      name: 'InFO (Fan-out WLP)',
      icon: '📡',
      description: 'TSMCのファンアウトパッケージ。薄型・低コスト。Apple AシリーズをPoP構造で搭載。',
      applications: ['スマートフォン AP (iPhone)', '5G Baseband', 'Wi-Fi'],
      suppliers: ['TSMC (InFO)', 'ASE (FOCoS)', 'Amkor (SWIFT)', 'JCET'],
      bandwidth: '中',
      cost: '中',
      density: '中'
    },
    {
      id: 'soic',
      name: 'SoIC / 3D IC',
      icon: '🏗️',
      description: 'TSMCの3D積層。ダイをHybrid Bondingで直接接合。バンプレス (<1μmピッチ)。次世代最重要技術。',
      applications: ['HBM4 + Logic 3D', 'AI推論チップ', 'Compute+Memory統合'],
      suppliers: ['TSMC (SoIC)', 'Intel (Foveros Direct)', 'Samsung (X-Cube)'],
      bandwidth: '最高 (ダイ間直接)',
      cost: '最高',
      density: '最高'
    },
    {
      id: 'rdl',
      name: 'RDL (再配線層) / Panel-level',
      icon: '🌐',
      description: '再配線層でI/Oを再配置。Fan-inWLPからPanel-level Fan-outまで。コスト削減のキー技術。',
      applications: ['IoT', 'ウェアラブル', 'RF Front-end', 'mmWave アンテナ'],
      suppliers: ['TSMC', 'ASE', 'Amkor', 'Deca Technologies', 'JCET'],
      bandwidth: '中',
      cost: '低〜中',
      density: '中'
    },
  ],

  // ── APPLICATION SUBSTRATES ────────────────────────────────────────────
  applications: [
    {
      id: 'ai-server',
      name: 'AI サーバー / HPC',
      icon: '🤖',
      color: '#7c3aed',
      description: 'NVIDIA H100/H200/B200、Google TPUなどのAI加速チップ向け。CoWoS + HBM + 大型ABF基板が特徴。',
      keyChip: 'NVIDIA B200 GPU',
      structure: [
        { layer: 'HBM4 (×8)', material: '3D DRAM (TSV)', supplier: 'SK Hynix / Micron' },
        { layer: 'GPU Die (N3/N2)', material: 'Si (TSMC製造)', supplier: 'TSMC' },
        { layer: 'Si Interposer (CoWoS)', material: 'Si + RDL', supplier: 'TSMC' },
        { layer: 'ABF基板 (FC-BGA)', material: 'ABF絶縁層 + Cu配線', supplier: 'IBIDEN / Shinko' },
        { layer: 'PCB (サーバーボード)', material: 'FR-4 / MEGTRON', supplier: 'TTM / Tripod / Meadville' },
        { layer: 'TIM (熱界面材料)', material: '液体金属 / In-Ga合金', supplier: 'Indium Corp / Parker Hannifin' },
      ],
      trends: ['CoWoS-L 大型化 (コスト削減)', 'HBM4 (1TB/s以上)', 'Liquid Cooling 液冷化', 'NVLink / CXL バス'],
      newsQuery: 'AI server GPU packaging CoWoS HBM substrate 2025'
    },
    {
      id: 'smartphone',
      name: 'スマートフォン (5G)',
      icon: '📱',
      color: '#0284c7',
      description: 'Appleシリーズ・Qualcomm Snapdragonなど。InFO PoP (Application Processor + LPDDR5) が主流。',
      keyChip: 'Apple A18 / Snapdragon 8 Elite',
      structure: [
        { layer: 'AP (SoC) N3/N2', material: 'Si (TSMC)', supplier: 'TSMC' },
        { layer: 'LPDDR5X (PoP)', material: 'DRAM (Samsung/SK Hynix)', supplier: 'Samsung / SK Hynix' },
        { layer: 'InFO パッケージ', material: 'Fan-out RDL', supplier: 'TSMC' },
        { layer: 'SLP (基板内蔵型PCB)', material: 'Any-layer IVH', supplier: 'Ibiden / Nippon Mektron / AT&S' },
        { layer: 'RF FEM (mmWave)', material: 'InFO + LTCC', supplier: 'ASE / Murata / Qualcomm' },
      ],
      trends: ['Gen AI on-device処理 (NPU強化)', '衛星通信対応', 'mmWave普及 (米中)', 'Type C → AI対応'],
      newsQuery: 'smartphone 5G SoC packaging InFO Apple Qualcomm 2025'
    },
    {
      id: 'antenna',
      name: 'アンテナ / RF (5G基地局)',
      icon: '📡',
      color: '#16a34a',
      description: '5G Massive MIMO アンテナ、mmWave向け基板。低損失Rogers / PTFE材料使用。アンテナ一体化AiP (Antenna in Package) も普及。',
      keyChip: '5G mmWave AiP Module',
      structure: [
        { layer: 'アンテナ導体 (Cu)', material: 'Cu / Au', supplier: 'JX金属 / Tanaka' },
        { layer: 'mmWave AiP 基板', material: 'PTFE / Rogers RO4350B', supplier: 'Rogers Corp / Taconic' },
        { layer: 'RF RFIC (28/39GHz)', material: 'SiGe / III-V族 (GaAs/GaN)', supplier: 'Qualcomm / Analog Devices' },
        { layer: 'LTCC / HDI 基板', material: 'セラミック / 低損失ガラス布', supplier: 'Murata / TDK / Kyocera' },
        { layer: 'PCB (低損失型)', material: 'Megtron 6 / Rogers', supplier: 'Panasonic / Rogers / Isola' },
      ],
      trends: ['Sub-THz (300GHz+) 研究開始', 'AiP (Antenna-in-Package) 拡大', 'Open RAN対応', '6G研究加速'],
      newsQuery: 'mmWave antenna AiP 5G 6G substrate Rogers LTCC 2025'
    },
    {
      id: 'automotive',
      name: '車載 (ADAS / EV)',
      icon: '🚗',
      color: '#b45309',
      description: '自動運転・ADAS用高信頼性パッケージ。AEC-Q100 グレード。高温・振動に耐える厚銅・HTCC基板。',
      keyChip: 'NVIDIA Orin / Mobileye EyeQ',
      structure: [
        { layer: 'SoC / MCU (28nm〜7nm)', material: 'Si', supplier: 'TSMC / Samsung / Renesas' },
        { layer: 'FC-BGA パッケージ', material: 'ABF基板', supplier: 'IBIDEN / AT&S / Tazmo' },
        { layer: 'HTCC / LTCC (パワーモジュール)', material: 'AlN / Al₂O₃ セラミック', supplier: 'Kyocera / NGK Spark Plug' },
        { layer: 'DBC / AMB 基板 (パワー用)', material: 'Cu + AlN', supplier: 'Rogers (Curamik) / Ferrotec / Heraeus' },
        { layer: 'PCB (高信頼性)', material: 'FR-4 TG180+', supplier: 'Tripod / TTM / CMK Corp' },
      ],
      trends: ['SiC / GaN パワー半導体普及', '800V EV対応パッケージ', 'チップレット (ADAS SoC)', '機能安全 (ISO 26262)'],
      newsQuery: 'automotive semiconductor SiC GaN ADAS packaging 2025'
    },
    {
      id: 'datacenter',
      name: 'データセンター ネットワーク',
      icon: '🌐',
      color: '#0284c7',
      description: '800G/1.6T スイッチチップ、Silicon Photonics 光トランシーバー向け。Co-packaged Optics (CPO) が次のトレンド。',
      keyChip: 'Broadcom Tomahawk 5 / Cisco Silicon One',
      structure: [
        { layer: 'NW Switch ASIC (5nm/3nm)', material: 'Si (TSMC)', supplier: 'TSMC' },
        { layer: 'Silicon Photonics (SiPh)', material: 'Si + Ge フォトダイオード', supplier: 'Intel SiPh / Coherent / II-VI' },
        { layer: 'FC-BGA + 高速基板', material: 'ABF / 低損失材料', supplier: 'IBIDEN / Shinko / Unimicron' },
        { layer: 'CPO光モジュール', material: 'InP/GaAs レーザー + SiPh', supplier: 'Coherent / Lumentum / II-VI' },
        { layer: 'PCB (低損失 56GHz+)', material: 'M6G / Megtron 6G', supplier: 'Panasonic / Isola / Ventec' },
      ],
      trends: ['Co-packaged Optics (CPO) 2026〜', '800G/1.6T Ethernet', 'PCIe 7.0 / CXL 3.0', 'In-network Computing'],
      newsQuery: 'data center switch 800G silicon photonics CPO packaging 2025'
    },
  ],

  // ── NEWS ──────────────────────────────────────────────────────────────
  news: [
    { title: 'TSMC N2量産開始、Apple A19 Pro向けに2025年下半期', source: 'DigiTimes', date: '2025-05', category: 'TSMC', url: 'https://www.digitimes.com/news/a20250101VL202.html' },
    { title: 'ASML High-NA EUV (TWINSCAN EXE:5000) 初出荷 — Intel 18A向け', source: 'ASML IR', date: '2025-04', category: 'Equipment', url: 'https://www.asml.com/en/investors' },
    { title: 'SK Hynix HBM4 量産開始 — NVIDIA Rubin GPU向け', source: 'SK Hynix', date: '2025-05', category: 'Memory/Packaging', url: 'https://news.skhynix.com' },
    { title: 'Intel 18A PowerVia + RibbonFET 製品シリコン公開、TSMC対抗へ', source: 'AnandTech', date: '2025-03', category: 'Intel', url: 'https://www.anandtech.com' },
    { title: 'Samsung SF2 (2nm GAA) 量産試験開始、歩留まりが課題', source: 'Korea Economic Daily', date: '2025-04', category: 'Samsung', url: 'https://www.hankyung.com/it' },
    { title: '味の素ファインテクノ ABF新工場稼働 — AI需要対応で増産', source: 'Nikkei', date: '2025-03', category: 'Materials', url: 'https://www.nikkei.com/article/DGXZQOUC00000' },
    { title: 'Rapidus IIM-1工場 構造完成 — 2027年試作に向け装置搬入開始', source: 'Reuters Japan', date: '2025-05', category: 'Rapidus', url: 'https://jp.reuters.com' },
    { title: 'NVIDIA Blackwell B200 CoWoS-L 量産加速 — TSMC最優先顧客に', source: 'TechInsights', date: '2025-04', category: 'AI/Packaging', url: 'https://www.techinsights.com' },
    { title: 'ルテニウム (Ru) 配線がM1に採用 — TSMCとIntelが競争', source: 'IEEE Spectrum', date: '2025-02', category: 'Materials', url: 'https://spectrum.ieee.org' },
    { title: 'Hybrid Bonding ピッチ <1μm達成 — 3D ICへの道筋', source: 'Semiconductor Engineering', date: '2025-04', category: 'Packaging', url: 'https://semiengineering.com' },
    { title: 'ガラスインターポーザー量産へ — Intelが2026年目標', source: 'Intel Newsroom', date: '2025-01', category: 'Packaging', url: 'https://www.intel.com/content/www/us/en/newsroom' },
    { title: 'KLA AI搭載欠陥検査で検出率30%向上 — eSL10発表', source: 'KLA', date: '2025-03', category: 'Equipment', url: 'https://www.kla.com/company/news-events' },
    { title: 'SiC基板供給拡大 — EV需要でWolfspeed/Rohm 増産', source: 'Power Electronics News', date: '2025-05', category: 'Materials', url: 'https://www.powerelectronicsnews.com' },
    { title: 'JSR フォトレジスト新世代 EUV High-NA対応品 開発完了', source: 'JSR Corporation', date: '2025-02', category: 'Materials', url: 'https://www.jsr.co.jp/en/news' },
    { title: '中国 SMIC/CXMT DUV多重露光で5nm相当開発との報告', source: 'Reuters', date: '2025-04', category: 'China', url: 'https://www.reuters.com/technology' },
    { title: 'Lam Research ALE (原子層エッチング) が2nm量産採用', source: 'Lam Research', date: '2025-03', category: 'Equipment', url: 'https://www.lamresearch.com/company/news-releases' },
  ],
};

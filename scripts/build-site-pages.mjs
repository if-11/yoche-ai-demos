import fs from 'node:fs';

const esc = (value = '') => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const id = (name) => name.replace(/[^a-zA-Z0-9_-]/g, '-');

function shell({ title, stage, stageEn, summary, status = '可用', body }) {
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="description" content="${esc(summary)}">
  <title>有车科技｜${esc(title)}</title>
  <link rel="stylesheet" href="assets/site.css">
</head>
<body>
  <nav class="site-bar">
    <img class="site-logo" src="assets/yoche-logo.png" alt="有车科技">
    <a class="home-link" href="index.html">返回主页面</a>
  </nav>
  <header class="hero">
    <div class="hero-inner">
      <div class="hero-grid">
        <div>
          <div class="eyebrow">${esc(stageEn)} · ${esc(stage)}</div>
          <h1>${esc(title)}</h1>
        </div>
        <div>
          <span class="status-pill">${esc(status)}</span>
          <p class="hero-copy">${esc(summary)}</p>
        </div>
      </div>
    </div>
  </header>
  <main class="page">${body}</main>
  <footer class="footer">有车科技 · AI 影视制作全流程 SOP · 持续梳理中</footer>
  <script src="assets/site.js"></script>
</body>
</html>`;
}

function section(index, title, lead, content) {
  return `<section class="section">
    <div class="section-head"><div class="section-index">${esc(index)}</div><div><h2>${esc(title)}</h2>${lead ? `<p class="lead">${esc(lead)}</p>` : ''}</div></div>
    ${content}
  </section>`;
}

function prompt(label, text, key) {
  const target = `prompt-${id(key)}`;
  return `<div class="prompt"><div class="prompt-head"><span class="prompt-label">${esc(label)}</span><button class="copy-btn" type="button" data-copy-target="${target}">复制提示词</button></div><pre id="${target}">${esc(text.trim())}</pre></div>`;
}

function gallery(images, extra = '') {
  return `<div class="gallery ${extra}">${images.map(([src, alt, caption]) => `<figure><img src="${src}" alt="${esc(alt)}" loading="lazy">${caption ? `<figcaption>${esc(caption)}</figcaption>` : ''}</figure>`).join('')}</div>`;
}

function steps(items) {
  return `<div class="steps">${items.map(([title, text]) => `<div class="step"><div><h3>${esc(title)}</h3><p>${esc(text)}</p></div></div>`).join('')}</div>`;
}

function downloads(items) {
  return items.map(([title, description, href]) => `<div class="download-card"><div><h3>${esc(title)}</h3><p>${esc(description)}</p></div><a class="download-btn" href="${href}" download>下载 Skill</a></div>`).join('');
}

const creativePrompt = `你是一名汽车品牌影视创意策划。请根据以下 Brief，生成 3 个差异明显、可执行的创意方向。

【项目背景】
品牌 / 车型：
传播目标：
核心受众：
投放渠道与时长：
必须传达的信息：
禁止出现的内容：
预算、周期和可用资产：

每个方向请输出：
1. 一句话核心创意
2. 受众洞察
3. 故事或画面机制
4. 关键视觉参考关键词
5. 适合 AI 生成的原因
6. 最大执行风险
7. 30 秒影片结构草案

三个方向不能只是换场景，必须在叙事逻辑、视觉机制或情绪上真正不同。`;

const creative = shell({
  title: '创意发想与参考检索', stage: '前期创意', stageEn: 'PRE-PRODUCTION', status: '持续补充中',
  summary: '把模糊的 Brief 变成可比较的创意方向，再为每个方向找到具体、可执行的参考。',
  body:
    `<div class="notice wip"><strong>当前状态：持续补充中</strong>前期源材料目前以问题和解决方法为主。本页先建立可执行骨架，后续可继续加入公司案例与创意 Skill。</div>` +
    section('01 / INPUT', '先把 Brief 变成创意约束', '创意发散不是从空白开始，而是先明确什么必须成立、什么不能发生。',
      `<div class="content-card"><h3>最小输入清单</h3><ul><li>品牌、产品与传播目标</li><li>核心受众与观看场景</li><li>片长、比例、渠道与交付时间</li><li>必须出现的产品点和必须避免的表达</li><li>现有车辆、人物、场景和品牌资产</li><li>预算、模型、版权与制作限制</li></ul></div>`) +
    section('02 / IDEATION', '先发散，再用同一标准收敛', '不要边想边否定。先拿到真正不同的方向，再比较品牌相关性、记忆点和执行风险。',
      steps([['生成 3 个不同方向','每个方向必须拥有不同的核心机制，而不是只换地点或颜色。'],['补齐故事与视觉','写清楚观众看到什么、为什么愿意看，以及产品如何进入故事。'],['统一评分','从品牌相关性、传播记忆点、AI 可实现性和周期风险四个维度比较。'],['形成一页方案','保留一句话创意、核心画面、参考、30 秒结构和风险说明。']])) +
    section('03 / PROMPT', '创意方向生成模板', '复制后填写 Brief，可用于第一次方向发散。', prompt('创意策划 Prompt', creativePrompt, 'creative')) +
    section('04 / REFERENCE', '参考不是“感觉像”，而是指出可借鉴的部分', '可以让 GPT 协助检索，也可以使用新片场、场鸽等案例库。',
      `<div class="content-card"><h3>参考拆解维度</h3><div class="compare"><div><b>视觉参考</b><p>色调、光线、镜头、构图、材质、节奏与转场。</p></div><div class="accent"><b>创意参考</b><p>叙事机制、信息揭示方式、产品进入故事的方法与结尾记忆点。</p></div></div><p>每张参考必须写一句“借什么、不借什么”，防止参考堆积但无法执行。</p></div>`)
});

const characterTurnaround = `生成一张高完成度的人物资产板。左侧 1/3 为超大高清面部正视特写，右侧 2/3 整齐排布同一角色的正面、侧面与背面三张全身站姿视图。

【角色描述】填写年龄、身份、体态、脸型、五官、发型、服装、配饰与核心气质。

所有视角必须保持同一面部比例、发型、服装、身体比例与角色身份。纯白或柔和米白背景，干净极简，无环境、无道具、无水印。柔和漫射光，清晰表现脸部、发型、服装轮廓、手部和全身比例。16:9，8K，写实或 UE5 + PBR 电影级质感。不要裁切面部，不要隐藏肢体，不要合并姿势，不要随机改变服装与人物身份。`;
const identityBoard = `创建一张艺术性的 16:9 角色身份板，主体使用参考角色，背景为纯白或柔和米白。不要创建标准网格角色表，而是高端动画工作室角色研究与艺术书布局的结合。

放置一个大型英雄全身视角作为视觉锚点，周围以清晰间距排列中性全身、背面、侧面、坐姿、倾斜姿势、蹲姿、俯视与仰视身体角度，以及富有表现力的肖像研究。所有图像不得重叠，不裁切面部或肢体。

在所有视角中保持严格身份一致：同一面部、发型、服装、身体比例、姿势语言与视觉个性。加入 2-3 个黑色轮廓、细微表情变化，以及面部、头发和服装的关键细节研究。文字仅保留名称、角色核心情绪和视觉标志。整体简约、电影感、高端、艺术书般、适用于 AI 后续生产。`;
const character = shell({
  title: '人物资产', stage: '中期制作', stageEn: 'PRODUCTION',
  summary: '先固定人物身份、比例、服装和表情范围，再把角色投入分镜与视频生成。',
  body:
    section('01 / WHY', '人物资产不是一张“好看的人像”', '真正可生产的人物资产要让模型在不同角度、姿势和镜头中仍然认得同一个人。',
      `<div class="content-card"><h3>建议交付物</h3><ul><li>人物三视图：正面、侧面、背面与面部特写</li><li>角色身份板：姿势、轮廓、表情与细节</li><li>完整 Character Sheet：装备拆解、配色、世界缩略图</li><li>一张经过检查的标准主参考图</li></ul></div>`) +
    section('02 / TURNAROUND', '人物三视图', '把角色身份锁定成后续所有镜头的共同参考。',
      gallery([['assets/images/character/character-turnaround.png','人物三视图示例','面部特写与全身多视角'],['assets/images/character/character-turnaround-reference.jpg','人物三视图参考','角色身份与视角一致性']], 'contain') + prompt('人物三视图 Prompt', characterTurnaround, 'character-turnaround')) +
    section('03 / IDENTITY BOARD', '角色身份板', '在严格身份一致的基础上补充姿势、情绪、轮廓和可识别细节。',
      gallery([['assets/images/character/character-identity-board.png','电影感角色身份板','艺术书式角色研究']], 'contain') + prompt('角色身份板 Prompt', identityBoard, 'identity-board')) +
    section('04 / CHARACTER SHEET', '角色设定图工作流', '完整设定图适合在批量分镜与视频生产前作为稳定资产。',
      gallery([['assets/images/character/character-sheet-1.jpg','角色设定图一','三视图、表情与装备'],['assets/images/character/character-sheet-2.jpg','角色设定图二','配色、姿势与世界缩略图'],['assets/images/character/character-sheet-3.jpg','角色设定图三','角色细节研究']], 'three contain') +
      steps([['生成完整角色提示词','包含三视图、六种表情、装备拆解、配色条、剪影姿势与世界缩略图。'],['在 Image 2 生成','统一半写实水彩或项目指定风格，柔和打光，米白背景。'],['检查与打磨','使用 Image 2、NanoBanana Pro 与少量 Photoshop 修复身份漂移、手部与细节。']]))
});

const vehicleSingle = `生成一张高完成度的车辆资产图，主体是一辆【车型名称 / 品牌车型】。严格保留真实车身比例、车头与车尾结构、灯组、车窗比例、轮毂、车门分缝、车顶线条和整体轮廓，不要将车型泛化成普通汽车。

展示角度为【前 45 度 / 纯侧面 / 后 45 度 / 正面 / 正后方 / 顶部】，车辆完整入镜，不裁切车身，不缺失车轮。镜头为人眼或略低机位，50mm-85mm 产品摄影视角，避免超广角畸变。

背景采用纯白、浅灰无缝或极简影棚，地面有自然接地阴影或轻微倒影。使用干净均匀的产品摄影布光，准确表现车漆、玻璃、金属、塑料、轮胎和灯罩材质。高端汽车产品视觉，真实摄影或写实 CG，高分辨率。

不要人物、复杂环境、文字、水印、夸张透视、多车、车身变形、轮毂错误或灯组结构错误。`;
const vehicleMulti = `生成一张高完成度的车辆六视角资产展示板，主体是一辆【车型名称 / 品牌车型】。六个视角分别为：前 45 度、纯侧面、后 45 度、正面、正后方、顶部。

六个视角必须是同一辆车，保持完全一致的车身颜色、比例、轮毂、灯组、车顶、门把手和尾部结构，仅改变观察角度。每个视角完整清楚，不重叠、不裁切、不遮挡。

纯白或浅灰无缝背景，高端汽车产品资产板风格。布光均匀自然，真实表现车漆、玻璃、轮胎、金属饰条和灯罩材质。高分辨率，结构稳定，适合作为后续 AI 生图、视频分镜和设计参考。

不要人物、复杂环境、文字说明、Logo 乱码、水印、错误透视、随机改变轮毂或车身结构。`;
const vehicle = shell({
  title: '车辆资产', stage: '中期制作', stageEn: 'PRODUCTION',
  summary: '车辆资产的核心是车型身份不漂移：比例、灯组、轮毂、门线和车顶结构必须跨视角保持一致。',
  body:
    section('01 / STANDARD', '先定义不可改变的车型特征', '模型生成前先列出最容易漂移的结构，避免只写“同一辆车”。',
      `<div class="content-card"><ul><li>车身长宽高比例与整体轮廓</li><li>前脸、尾部和灯组结构</li><li>车窗、车门分缝、门把手与车顶</li><li>轮毂样式、轮胎比例与离地高度</li><li>车漆颜色、玻璃、金属和塑料材质</li></ul></div>`) +
    section('02 / SINGLE VIEW', '单视角车辆资产', '适合为某个关键镜头建立清楚、干净的主参考。', prompt('单视角车辆资产 Prompt', vehicleSingle, 'vehicle-single')) +
    section('03 / SIX VIEWS', '六视角车辆资产板', '用于后续切换机位、制作分镜和检查车型一致性。',
      gallery([['assets/images/vehicle/vehicle-board-cream.png','奶茶色车辆六视角','同车多角度资产'],['assets/images/vehicle/vehicle-board-black.png','黑色车辆六视角','同车多角度资产'],['assets/images/vehicle/vehicle-board-blue.png','淡蓝车辆六视角','同车多角度资产']], 'three contain') + prompt('六视角车辆资产 Prompt', vehicleMulti, 'vehicle-multi')) +
    section('04 / CHECK', '生成后不要只看“像不像”', '逐项检查结构是否在不同视角悄悄改变。',
      steps([['身份检查','品牌车型、车身比例与主要轮廓一致。'],['结构检查','灯组、轮毂、门把手、窗线和车顶没有随机变化。'],['材质检查','车漆不过油、玻璃不发灰、轮胎与金属反射合理。'],['生产检查','车身完整、无裁切、无文字乱码，能够作为参考资产继续使用。']]))
});

const sceneSingle = `生成一个【场景地点与类型】的纯环境画面，时间为【时间段】，天气为【天气状态】，场景呈现【核心状态或叙事情境】。

前景是【前景元素与材质】，中景是【主要空间、道路、建筑或自然环境】，背景是【远景元素】，形成明确的前中后景和【开阔 / 封闭 / 纵深 / 一点透视】。

镜头采用【景别】，摄影机位于【机位与高度】，使用【焦段】，从【方向】观察。以【主体空间】为视觉中心，通过【道路 / 墙体 / 建筑 / 河流】形成引导线，使用【中心 / 非对称 / 对角线 / 留白】构图，画面比例【16:9】。

光线来自【方向】，属于【清晨 / 正午 / 傍晚 / 阴天】，阴影【长度与软硬】。主色为【主色】，辅色为【辅色】，保持色彩干净统一。材质符合真实物理规律，整体像【汽车广告 / 电影空镜 / 高端建筑摄影】，4K，高动态范围，不过度锐化。

不要人物、车辆、文字、Logo、水印、乱码广告牌、建筑变形、重复物体、过度雾气、脏污滤镜或夸张霓虹色。`;
const sceneConsistency = `【参考场景锁定模式】
完全相同的建筑设计、结构、比例、场地规划、空间布局、景观、道路、背景环境、材质、色彩、光照方向、阴影、天气和时间段。建筑锁定、环境锁定、材质锁定、灯光锁定。禁止重新设计、增加或删除建筑，仅允许摄影机移动。

【九宫格摄影机矩阵】
第一行：正面全景 / 正面近景 / 侧面全景
第二行：侧面近景 / 背面全景 / 背面近景
第三行：俯视全景 / 俯视近景 / 45° 斜向高位总览

【摄影机参数】
统一 50mm 焦段、曝光、白平衡、动态范围、景深、色彩风格、构图逻辑与画面比例。

【画面质量】
建筑摄影、ArchViz Presentation Board、商业广告级视觉、电影级环境设计、8K HDR、PBR 材质、统一渲染质量。

【建筑主体】
填写你的建筑与环境描述。`;
const scene = shell({
  title: '场景资产', stage: '中期制作', stageEn: 'PRODUCTION',
  summary: '先建立清楚的单场景主图，再生成多视角一致性资产；改变机位，不重新设计世界。',
  body:
    section('01 / FORMULA', '单场景提示词公式', '地点状态 + 空间层次 + 镜头构图 + 时间光线 + 色彩关系 + 材质细节 + 情绪氛围 + 视觉标准 + 排除项。',
      gallery([['assets/images/scene/scene-reference-1.jpg','场景主图参考一','纯环境建立镜头'],['assets/images/scene/scene-reference-2.jpg','场景主图参考二','空间与材质参考'],['assets/images/scene/scene-reference-3.jpg','场景主图参考三','时间与光线参考'],['assets/images/scene/scene-reference-4.jpg','场景主图参考四','建筑与纵深参考']])) +
    section('02 / SINGLE SCENE', '单场景主图', '一张主图先把地点、空间、光线和氛围说清楚。', prompt('单场景通用 Prompt', sceneSingle, 'scene-single')) +
    section('03 / CONSISTENCY', '场景一致性多视角', '核心规则是“仅允许摄影机移动”，所有空间与材质设计保持不变。',
      gallery([['assets/images/scene/scene-consistency-grid.jpg','场景九宫格多视角','同一场景的摄影机矩阵']], 'contain') + prompt('场景一致性九宫格 Prompt', sceneConsistency, 'scene-consistency')) +
    section('04 / CHECK', '判断它是不是同一个场景', '',
      `<div class="content-card"><ul><li>建筑数量、比例、开口与装饰没有改变。</li><li>道路、景观、远山和背景元素位置一致。</li><li>时间、天气、光照和材质没有随机漂移。</li><li>不同机位之间存在正确透视与空间逻辑，而不是九张相似的新设计。</li></ul></div>`)
});

const reversePrompt = `请用中英双语详细反推这张图片的 AI 绘图提示词。

按以下维度逐一分析：
1. 主体与动作
2. 场景与环境
3. 构图与摄影机
4. 艺术风格与成像方式
5. 色彩与对比关系
6. 光源方向、光质与阴影
7. 材质、纹理与细节
8. 氛围与情绪
9. 分辨率与画质限制

最后输出可直接用于目标模型的完整中文 Prompt、英文 Prompt 和排除项。不要只堆关键词，要形成有主次顺序的完整描述。`;
const referencePrompt = `参考图 1 的视觉风格。
参考图 2 的【主体身份 / 车辆车型】。
参考图 3 的【场景空间】。
参考图 4 的【构图或光线】。

必须保持【真实车辆结构、方向盘位置、座椅布局、人物身份等不可变条件】不变。
目标模型：【Flux / 其他模型】。

结合参考图控制方法，输出完整 JSON，以及可直接复制使用的中英文 Prompt。`;
const storyboard = shell({
  title: '分镜图片与提示词', stage: '中期制作', stageEn: 'PRODUCTION',
  summary: '把画面拆成有优先级的视觉信息，用参考图、反推和限制条件稳定生成分镜。',
  body:
    section('01 / STRUCTURE', 'Prompt 要有金字塔结构', '稳定顺序：图片类型 → 主体 → 场景 → 构图 → 光线 → 风格 → 质量参数 → 排除项。',
      `<div class="content-card"><h3>先决定什么最重要</h3><p>最重要的身份、动作和构图放在前面；越往后越接近材质、成像与微小细节。不要把所有词当成同一权重。</p></div>`) +
    section('02 / REVERSE', '图片反推 Prompt', '反推不是描述“看见了什么”就结束，而是把成像逻辑拆出来。',
      gallery([['assets/images/storyboard/prompt-reverse-example.png','图片反推示例','从主体、风格、色彩、光影与构图拆解']], 'contain') + prompt('通用图片反推 Prompt', reversePrompt, 'reverse')) +
    section('03 / REFERENCES', '多参考图要明确各自负责什么', '每张图只承担清楚的参考任务，并写明不可变条件。', prompt('多参考图组合命令', referencePrompt, 'references')) +
    section('04 / SKILLS', '下载本专题相关 Skill', '保留原始 Markdown 文件，可继续交给支持 Skill 的 AI 工具使用。',
      downloads([['参考图控制 Skill','用于多参考图视觉迁移，并强调车辆、内饰、人物与空间关系不可变。','downloads/skills/direct-reference-visuals-SKILL.md'],['Quill 提示词优化 Skill','用于分析画面问题并输出更稳定、更可执行的优化提示词。','downloads/skills/quill-image-prompt-director-pro-3.2.md']]))
});

const lineartPrompt = `整体转为纯黑白线条稿，去除所有色彩、明暗渐变、阴影、纹理与实景质感，只保留清晰流畅的主要轮廓线。线条干净利落、无杂色，结构完整，精准还原原图造型轮廓，纯白背景，简约手绘线稿风格，无填充色块，高清、干净。`;
const clayPrompt = `Transform the uploaded image into a clean Blender-style untextured 3D model preview. Preserve the original subject, identity, proportions, silhouette, object relationships, composition, camera angle, perspective, depth, and scene layout exactly as shown. Change only the rendering method.

Render the entire image as a smooth monochrome clay render or neutral viewport preview with soft studio lighting, clean geometry, controlled edge definition, and uniform neutral gray or off-white materials. No color information or texture maps. Do not turn it into line art, sketch, blueprint, wireframe, or illustration. Do not add outlines, hatch marks, invented wrinkles, grain, stains, material texture, topology lines, labels, UI, watermark, logo, subtitles, borders, QR codes, signatures, or extra text.`;
const cleanPrompt = `基于两张参考图生成一张干净修复版图片：图一是最终效果的主参考，必须严格保留图一的画风、颜色、材质、光照、构图、视角、主体身份、物体位置、背景关系和整体氛围。图二只作为结构参考，用来辅助判断轮廓、体积、边缘、遮挡关系和局部形体准确性。

请自动清理图一中的脏点和噪声：凡是孤立存在、随机分布、不连接主要轮廓、不构成阴影、不属于材质纹理、不服务于结构描写的小黑点、小黑斑、短黑线、扫描污渍、压缩噪点和异常脏线，都去除。保留图一中有意义的线条、纹理、材质细节、磨损痕迹、阴影、笔触和原始风格特征。

最终结果应像图一的干净高清修复版，而不是重新设计。禁止采用图二的白模材质、3D 渲染感、摄影感、颜色、光影、景深或风格。不要新增元素、文字、Logo、水印、边框。保持图一画幅比例。`;
const cleanup = shell({
  title: '画面去脏与干净重绘', stage: '中期制作', stageEn: 'PRODUCTION',
  summary: '专门解决脏点、噪线、涂抹感和错误纹理；它不是单纯把图片放大，也不等同于 4K 修复。',
  body:
    section('01 / DIAGNOSIS', '先判断什么是“脏”', '要删除的是不服务于结构、光影和材质的随机信息，而不是把所有纹理都抹平。',
      gallery([['assets/images/cleanup/dirty-image-example.png','画面脏点问题示例','随机噪点与异常细节']], 'contain') +
      `<div class="content-card"><ul><li>孤立、随机、不连接主要轮廓的小黑点与短线</li><li>不构成阴影、不属于材质的黑斑与扫描污渍</li><li>压缩噪点、错误纹理、涂抹感和不稳定边缘</li><li>保留真实磨损、笔触、阴影和有意义的材质细节</li></ul></div>`) +
    section('02 / STRUCTURE', '方法一：先得到干净结构', '根据画面选择线稿或白模。它们只负责结构，不负责最终风格。',
      prompt('转黑白线稿 Prompt', lineartPrompt, 'lineart') + prompt('转中性白模 Prompt', clayPrompt, 'clay')) +
    section('03 / REBUILD', '方法二：结构参考 + 风格主参考', '图一决定最终效果，图二只帮助恢复轮廓、体积和遮挡。建议使用 NanoBanana。',
      gallery([['assets/images/cleanup/cleanup-before.png','去脏前参考','保留构图和原风格'],['assets/images/cleanup/cleanup-reference.png','结构参考','辅助判断结构与体积'],['assets/images/cleanup/cleanup-after.png','干净重绘结果','清理异常噪点并保持画风']], 'three contain') + prompt('干净修复版 Prompt', cleanPrompt, 'clean-rebuild')) +
    section('04 / BOUNDARY', '去脏与 4K 修复不要混用', '',
      `<div class="compare"><div class="accent"><h3>画面去脏</h3><p>解决随机噪点、脏线、错误纹理、涂抹感和结构污染。必要时先抽取干净结构再重绘。</p></div><div><h3>图片 4K 修复</h3><p>解决整体模糊、局部错误、清晰度不足和高分辨率输出，使用现有六种方法页面。</p></div></div>`)
});

const videoPrompt = `严格使用输入图片作为视频第一帧和视觉基础。保持原图中的主体身份、车辆车型、人物面貌、服装、动作起点、位置关系、场景、建筑、道路、色彩、光线和构图不变，不新增或删除关键元素。视频时长约【时长】秒，比例与输入图一致。

【主体动作】从初始状态开始，【主体】自然地【具体动作】，方向【方向】，速度【速度】，幅度【轻微 / 明显 / 快速】。动作连续，符合真实物理惯性。

【摄影机运动】从原机位开始进行【推进 / 后拉 / 横移 / 环绕 / 跟随 / 抬升 / 下降 / 摇镜】，从【初始角度】移动到【最终角度】，轨迹平滑，不突然变焦或跳切。

【环境响应】前、中、背景产生正确的透视位移与视差，路面、建筑、植物、天空、光影和反射自然变化，天气、时间、色温和光线方向不变。

【时间节奏】0-【时间点】秒：【第一阶段】；【时间点】-【时间点】秒：【第二阶段】；【时间点】-【结束】秒：【结束与稳定构图】。

【结束画面】镜头停在【最终机位】，主体位于【画面位置】，呈现【最终动作状态】，可自然衔接下一镜头。

【画面质感】保持原有写实 TVC / 电影 / 动画 / CG 风格，增加自然运动感、空间视差、运动模糊和物理反馈。

【禁止事项】禁止改变身份、车型、颜色、服装、五官、灯组、轮毂和车身结构；禁止变形、闪烁、复制、瞬移、倒退、漂移；禁止背景融化、路面错位、建筑变形；禁止新增人物、车辆、文字、Logo、水印和无关物体。`;
const video = shell({
  title: 'AI 视频生成', stage: '中期制作', stageEn: 'PRODUCTION',
  summary: '用一套稳定的 Shot 结构，把首帧、主体动作、摄影机、环境响应和结束画面说清楚。',
  body:
    section('01 / SHOT', 'Shot 的七段写法', '起始画面 → 主体动作 → 摄影机运动 → 环境运动 → 时间节奏 → 结束画面 → 视觉质感与稳定性限制。',
      gallery([['assets/images/video/seedance-shot-example.jpg','Seedance Shot 示例','按镜头拆解主体、场景、摄影机与动作']], 'contain')) +
    section('02 / PROMPT', '图生视频通用模板', '先锁定第一帧和不可变条件，再写运动。', prompt('图生视频 Prompt', videoPrompt, 'video')) +
    section('03 / EXTRACT', '视频抽图法', '当参考视频的动作和镜头更清楚时，可以先抽取代表帧，再结合主体、环境与故事板生成。',
      steps([['抽取关键帧','选择动作起点、运动中段、构图变化点和结束画面。'],['标记不可变元素','锁定主体身份、车辆结构、场景布局和光线。'],['补充故事板','写清每一镜的动作原因、镜头方向与衔接。'],['生成与检查','先验证短镜头，再检查身份、物理、视差、闪烁和结束构图。']])) +
    section('04 / SKILL', '下载视频生成导演 Skill', '用于补全镜头设计、运镜、光影、动作逻辑、转场与电影级分镜提示词。',
      downloads([['视频生成导演 Skill','保留用户材料中提供的原始 Markdown 文件。','downloads/skills/video-prompt-director-SKILL.md']]))
});

function draftPage({ title, summary, known, framework, tools = [] }) {
  return shell({ title, stage: '后期制作', stageEn: 'POST-PRODUCTION', status: '待完善 · 持续梳理中', summary,
    body: `<div class="notice wip"><strong>本页尚未完成</strong>当前只整理已有信息和可执行框架，后续仍需加入公司标准、案例和测试结果。</div>` +
      section('01 / KNOWN', '当前已整理内容', '', `<div class="content-card"><ul>${known.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>`) +
      section('02 / FRAMEWORK', '建议执行框架', '用于先把后期工作串起来，不代表最终公司标准。', steps(framework)) +
      (tools.length ? section('03 / TOOLS', '当前工具记录', '', `<div class="content-card"><ul>${tools.map(([name, href]) => `<li><a href="${href}" target="_blank" rel="noopener noreferrer">${esc(name)} ↗</a></li>`).join('')}</ul></div>`) : '') +
      section(tools.length ? '04 / NEXT' : '03 / NEXT', '后续待补充', '', `<div class="content-card"><ul><li>公司实际项目案例与失败案例</li><li>明确的软件参数、检查标准和负责人</li><li>交付模板、文件命名与验收清单</li></ul></div>`)
  });
}

const postMaterial = draftPage({
  title: '素材筛选与管理', summary: '把生成素材变成可检索、可比较、可回退的镜头库。',
  known: ['当前源文档只列出“筛素材”，尚无详细公司标准。'],
  framework: [['统一收集','按项目、场次、镜头号集中素材，原始文件不得被覆盖。'],['初筛技术问题','淘汰身份漂移、结构错误、闪烁、分辨率不足和无法修复的片段。'],['创意筛选','比较表演、构图、运动、节奏和与前后镜头的衔接。'],['版本与状态','区分待选、备选、已选、需修复、已锁定，并记录生成模型和 Prompt。']]
});
const postAudio = draftPage({
  title: '音乐、音效与旁白配音', summary: '让音乐、环境声、动作声和旁白各自承担清楚的叙事任务。',
  known: ['MiniMax 国外版：音乐与模拟声音配音。','Suno 国外版：AI 音乐生成。'],
  framework: [['先做声音设计表','逐镜标记旁白、音乐情绪、环境声、动作声和需要留白的位置。'],['音乐定结构','先确定段落、速度、情绪变化和品牌气质，再生成或检索音乐。'],['音效补物理','补齐车辆、脚步、衣物、环境、转场和空间反馈，避免只有背景音乐。'],['旁白与混音','确定声音身份、语速、停顿和情绪，再处理响度、空间与音乐避让。']],
  tools: [['MiniMax Audio','https://www.minimax.io/audio'],['Suno Create','https://suno.com/create']]
});
const postEditing = draftPage({
  title: '剪辑节奏与叙事', summary: '把生成片段从“镜头集合”变成有信息推进、情绪变化和清楚结尾的影片。',
  known: ['当前源文档只列出“剪辑节奏”，尚无详细模板。'],
  framework: [['纸上结构回看','先对照前期纸上剪辑，确认片段是否仍服务原创意。'],['粗剪搭结构','先解决顺序、信息与叙事，不急着做复杂转场和特效。'],['精剪做节奏','根据动作点、视线、音乐重拍和声音变化调整镜头长度。'],['连续性检查','检查方向、动作、光线、主体位置、景别变化和声音空间是否连贯。'],['锁画面','镜头结构确认后再进入调色、字幕、混音和最终精修。']]
});
const postFinishing = draftPage({
  title: '精修与交付', summary: '完成超分、调色、字幕、混音、输出与归档，让成片可以稳定交付。',
  known: ['超分工具：Topaz。','达芬奇可用于放大、调色和最终输出。'],
  framework: [['镜头级精修','修复闪烁、边缘、穿帮、局部结构、速度和过渡问题。'],['超分与降噪','根据源素材选择 Topaz 或达芬奇，避免过度锐化、塑料感和新增伪细节。'],['统一调色','匹配曝光、白平衡、对比度、饱和度和镜头间色彩连续性。'],['字幕与声音终检','检查字幕安全区、错字、响度、峰值、声画同步和静音片段。'],['输出与归档','按渠道输出比例、编码和码率；同时保存母版、工程、字体、音乐授权和生成记录。']]
});

const topics = {
  'creative-ideation.html': creative,
  'character-assets.html': character,
  'vehicle-assets.html': vehicle,
  'scene-assets.html': scene,
  'storyboard-image-prompts.html': storyboard,
  'image-cleanup.html': cleanup,
  'ai-video-generation.html': video,
  'post-material-management.html': postMaterial,
  'post-audio.html': postAudio,
  'post-editing.html': postEditing,
  'post-finishing-delivery.html': postFinishing,
};

for (const [file, html] of Object.entries(topics)) fs.writeFileSync(file, html);

const stages = [
  { no: '01', cls: '', en: 'PRE-PRODUCTION', title: '前期创意', intro: '把目标、创意和镜头逻辑先想清楚，再进入资产与生成。', cards: [
    ['ai-film-preproduction.html','Brief 对齐与纸上剪辑','把项目目标变成团队共同执行的 Brief，并在生成前完成纸上剪辑。','现有网页','ready'],
    ['creative-ideation.html','创意发想与参考检索','生成真正不同的方向，并把参考拆成可借鉴、可执行的视觉与创意机制。','持续补充中','wip'],
  ]},
  { no: '02', cls: '', en: 'PRODUCTION', title: '中期制作', intro: '建立稳定资产，生成分镜和视频，并针对画面问题选择正确的修复路径。', cards: [
    ['character-assets.html','人物资产','三视图、身份板、角色设定图与一致性检查。','可用','ready'],
    ['vehicle-assets.html','车辆资产','单视角、六视角资产板与车型身份锁定。','可用','ready'],
    ['scene-assets.html','场景资产','单场景主图、九宫格多视角与场景锁定。','可用','ready'],
    ['storyboard-image-prompts.html','分镜图片与提示词','Prompt 结构、图片反推、多参考图控制与 Skill 下载。','可用','ready'],
    ['image-cleanup.html','画面去脏与干净重绘','处理脏点、噪线、涂抹感和错误纹理。','独立专题','ready'],
    ['ai-image-4k-restoration.html','图片 4K 修复','六种方法解决模糊、局部错误和高分辨率输出。','现有网页','ready'],
    ['ai-video-generation.html','AI 视频生成','Shot 写法、图生视频、抽图法与导演 Skill。','可用','ready'],
  ]},
  { no: '03', cls: 'post', en: 'POST-PRODUCTION', title: '后期制作', intro: '当前仍在梳理。先提供可进入的草稿框架，后续持续补充公司标准与案例。', cards: [
    ['post-material-management.html','素材筛选与管理','素材收集、筛选、版本和镜头状态。','待完善','wip'],
    ['post-audio.html','音乐、音效与旁白配音','声音设计、音乐、音效、配音和混音。','待完善','wip'],
    ['post-editing.html','剪辑节奏与叙事','粗剪、精剪、连续性和锁画面。','待完善','wip'],
    ['post-finishing-delivery.html','精修与交付','超分、调色、字幕、混音、输出与归档。','待完善','wip'],
  ]},
];

const indexHtml = `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="有车科技 AI 影视制作全流程 SOP"><title>有车科技｜AI 影视制作全流程 SOP</title><link rel="stylesheet" href="assets/site.css"></head><body>
<nav class="site-bar"><img class="site-logo" src="assets/yoche-logo.png" alt="有车科技"><span style="font-size:12px;color:#aaa">AI FILM PRODUCTION SOP</span></nav>
<header class="hero"><div class="hero-inner"><div class="hero-grid"><div><div class="eyebrow">YOCHE AI PRODUCTION SYSTEM</div><h1>AI 影视制作<br><em>全流程 SOP</em></h1></div><div><span class="status-pill">持续梳理中</span><p class="hero-copy">从 Brief、创意和纸上剪辑，到人物、车辆、场景、分镜、视频，再到后期交付。这里记录的是可以真正进入项目执行的工作方法。</p></div></div></div></header>
<main class="page">
  <div class="notice wip"><strong>这是一套持续更新的制作系统</strong>前期与中期已有可用内容；后期仍在整理，会保留草稿状态并逐步补齐。</div>
  ${stages.map(stage => `<section class="stage ${stage.cls}"><div class="stage-number">${stage.no}</div><div><div class="stage-kicker">${stage.en}</div><h2 class="stage-title">${stage.title}</h2><p class="stage-intro">${stage.intro}</p><div class="card-grid">${stage.cards.map(([href,title,description,status,state]) => `<a class="topic-card" href="${href}"><div><h3>${title}</h3><p>${description}</p></div><div class="card-meta"><span class="tag ${state}">${status}</span></div></a>`).join('')}</div></div></section>`).join('')}
</main><footer class="footer">有车科技 · AI 影视制作全流程 SOP · 持续梳理中</footer></body></html>`;
fs.writeFileSync('index.html', indexHtml);

console.log(`Generated ${Object.keys(topics).length} topic pages and index.html`);

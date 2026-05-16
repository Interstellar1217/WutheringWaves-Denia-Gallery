import React, { useState } from 'react';

const t = {
  zh: {
    title: '达尼娅 Denia',
    subtitle: '5★ 热熔属性共鸣者',
    affiliation: '星炬学院虚质科学部',
    quote: '总对大家展露出"温柔"的微笑，偶尔也会说上几句俏皮话',
    stats: '属性',
    element: '热熔',
    weapon: '法器',
    rarity: '5★',
    skills: '技能',
    resonance: '共鸣技能',
    resonanceDesc: '达妮娅挥动造型华丽的手杖，释放虚质防护泡泡。触发聚爆效应时获得【简并虚质】层数，上限 5 层。',
    liberation: '共鸣解放',
    liberationDesc: '达妮娅解放共鸣力量，将敌人困在梦幻星穹之中，对范围内敌人造成大量热熔伤害。拥有简并虚质时，伤害倍率提升 100%。',
    variant: '共鸣变奏',
    variantDesc: '达妮娅拥有双形态切换能力，两种形态风格迥异，可灵活应对不同战斗场景。',
    concerto: '协奏技能',
    concertoDesc: '释放协奏技能期间，下一位通过入场技能进场的角色获得 +25% 热熔伤害，持续 15 秒。',
    intro: '角色介绍',
    introText: '达妮娅是《鸣潮》3.3 版本中登场的 5 星热熔属性共鸣者。她是星炬学院虚质科学部的学生，总对大家展露出"温柔"的微笑，偶尔也会说上几句俏皮话。她经常懒懒地打盹，静静地观察与自己一起生活的人们，那些热闹的场景似乎让她感到安心。虽然自称"不擅长战斗"，但她在战场上展现出非凡的战术智慧和优雅的战斗风格。',
    background: '背景故事',
    backgroundText: '作为星炬学院虚质科学部的学生，达妮娅对未知的世界充满好奇，同时也肩负着探索虚质奥秘的使命。她挥动一柄造型华丽的手杖，泡泡随之释放出来，这些泡泡有着一定的虚质防护作用。看似柔软轻盈，却只轻轻一漾，便能将敌人困在梦幻星穹之中。',
    build: '养成建议',
    buildRole: '定位',
    buildRoleDesc: '副 C/辅助 - 双形态切换，集控场、增伤、输出于一体',
    buildWeapon: '武器推荐',
    buildWeaponDesc: '优先选择提升热熔伤害或元素威力的法器武器',
    buildEcho: '声骸套装',
    buildEchoDesc: '热熔伤害加成套装，主词条优先：双爆伤 > 热熔伤害加成 > 攻击百分比',
    buildTeam: '队伍搭配',
    buildTeamDesc: '核心队友：爱弥斯 (艾米斯)、其他热熔属性角色，组成热熔聚爆体系',
  },
  en: {
    title: 'Denia',
    subtitle: '5★ Fusion Resonator',
    affiliation: 'Startorch Academy - Department of Voidmatters',
    quote: 'Always showing a "gentle" smile to everyone, occasionally making witty remarks',
    stats: 'Stats',
    element: 'Fusion',
    weapon: 'Rectifier',
    rarity: '5★',
    skills: 'Skills',
    resonance: 'Resonance Skill',
    resonanceDesc: 'Denia waves her ornate staff, releasing Voidmatters-protective bubbles. Gains [Degenerate Voidmatters] stacks when triggering Grouping Explosion effects, max 5 stacks.',
    liberation: 'Resonance Liberation',
    liberationDesc: 'Denia unleashes resonant power, trapping enemies in a dreamy star dome, dealing massive Fusion DMG to enemies in the area. With Degenerate Voidmatters, DMG multiplier is increased by 100%.',
    variant: 'Resonance Variant',
    variantDesc: 'Denia has dual form switching abilities with distinctly different styles, flexibly adapting to different combat scenarios.',
    concerto: 'Concerto Skill',
    concertoDesc: 'During Concerto Skill, the next character entering via Intro Skill gains +25% Fusion DMG for 15s.',
    intro: 'Introduction',
    introText: 'Denia is a 5-star Fusion Resonator who debuted in Wuthering Waves Version 3.3. She is a student of Startorch Academy\'s Department of Voidmatters, always showing a "gentle" smile to everyone and occasionally making witty remarks. She often dozes off lazily, quietly observing the people she lives with - those lively scenes seem to make her feel at ease. Despite claiming to be "not good at fighting", she demonstrates extraordinary tactical wisdom and an elegant combat style on the battlefield.',
    background: 'Background',
    backgroundText: 'As a student of the Department of Voidmatters, Denia is full of curiosity about the unknown world and also bears the mission of exploring the secrets of Voidmatters. She waves an ornate staff from which bubbles are released - these bubbles have a certain Voidmatters protective effect. Seemingly soft and light, yet with just a gentle ripple, she can trap enemies in a dreamy star dome.',
    build: 'Build Guide',
    buildRole: 'Role',
    buildRoleDesc: 'Sub-DPS/Support - Dual form switching, combining crowd control, buffs, and damage',
    buildWeapon: 'Weapon Recommendation',
    buildWeaponDesc: 'Prioritize Rectifier weapons that boost Fusion DMG or Elemental Power',
    buildEcho: 'Echo Set',
    buildEchoDesc: 'Fusion DMG Bonus set. Main stats priority: Crit Rate/DMG > Fusion DMG Bonus > ATK%',
    buildTeam: 'Team Composition',
    buildTeamDesc: 'Core teammates: Amy, other Fusion Resonators, forming a Fusion Grouping Explosion team',
  },
};

function TimelineItem({ title, children }) {
  return (
    <div className="timeline-item">
      <div className="timeline-marker" />
      <div className="timeline-content">
        {title && <h3 className="timeline-title">{title}</h3>}
        <div className="timeline-body">{children}</div>
      </div>
    </div>
  );
}

function StatCard({ icon, label }) {
  return (
    <div className="stat-card">
      <span className="stat-icon">{icon}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

function SkillCard({ title, description }) {
  return (
    <div className="skill-card">
      <h4>{title}</h4>
      <p className="skill-desc">{description}</p>
    </div>
  );
}

export default function Profile() {
  const [lang, setLang] = useState(() => localStorage.getItem('denia-lang') || 'en');
  const i18n = lang === 'zh' ? t.zh : t.en;

  return (
    <div className="profile-page">
      <button className="lang-switch-btn" onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}>
        {lang === 'zh' ? 'English' : '中文'}
      </button>

      {/* 左侧固定图片区 */}
      <div className="profile-visual" />

      {/* 右侧滚动内容区 */}
      <div className="profile-content-scroll">
        {/* 角色标题卡片 */}
        <div className="profile-header-card">
          <div className="profile-title-section">
            <h1 className="profile-title">{i18n.title}</h1>
            <p className="profile-subtitle">{i18n.subtitle}</p>
            <p className="profile-affiliation">{i18n.affiliation}</p>
            <div className="profile-quote-box">
              <span className="quote-mark">"</span>
              <p className="profile-quote">{i18n.quote}</p>
            </div>
          </div>
        </div>

        {/* 时间线内容 */}
        <div className="profile-timeline">
          {/* 属性 */}
          <TimelineItem title={i18n.stats}>
            <div className="stats-grid">
              <StatCard icon="⚔️" label={i18n.weapon} />
              <StatCard icon="🔥" label={i18n.element} />
              <StatCard icon="⭐" label={i18n.rarity} />
            </div>
          </TimelineItem>

          {/* 角色介绍 */}
          <TimelineItem title={i18n.intro}>
            <p className="profile-text">{i18n.introText}</p>
          </TimelineItem>

          {/* 背景故事 */}
          <TimelineItem title={i18n.background}>
            <p className="profile-text">{i18n.backgroundText}</p>
          </TimelineItem>

          {/* 技能 */}
          <TimelineItem title={i18n.skills}>
            <div className="skills-list">
              <SkillCard title={i18n.resonance} description={i18n.resonanceDesc} />
              <SkillCard title={i18n.liberation} description={i18n.liberationDesc} />
              <SkillCard title={i18n.variant} description={i18n.variantDesc} />
              <SkillCard title={i18n.concerto} description={i18n.concertoDesc} />
            </div>
          </TimelineItem>

          {/* 养成建议 */}
          <TimelineItem title={i18n.build}>
            <div className="skills-list">
              <SkillCard title={i18n.buildRole} description={i18n.buildRoleDesc} />
              <SkillCard title={i18n.buildWeapon} description={i18n.buildWeaponDesc} />
              <SkillCard title={i18n.buildEcho} description={i18n.buildEchoDesc} />
              <SkillCard title={i18n.buildTeam} description={i18n.buildTeamDesc} />
            </div>
          </TimelineItem>
        </div>

        {/* 底部留白 */}
        <div className="profile-spacer" />
      </div>
    </div>
  );
}

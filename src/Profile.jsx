import React, { useState } from 'react';

const t = {
  zh: {
    title: '丹妮娅 Denia',
    subtitle: '5★ 融合属性共鸣者',
    intro: '角色介绍',
    introText: '丹妮娅是《鸣潮》3.3 版本中登场的 5 星融合属性共鸣者。她以其独特的战斗风格和强大的协同作战能力而闻名。',
    stats: '属性',
    element: '融合',
    weapon: '臂铠',
    rarity: '5★',
    skills: '技能',
    resonance: '共鸣技能',
    liberation: '共鸣解放',
    variant: '共鸣变奏',
    intro2: '背景故事',
    team: '队伍搭配',
  },
  en: {
    title: 'Denia',
    subtitle: '5★ Fusion Resonator',
    intro: 'Introduction',
    introText: 'Denia is a 5-star Fusion Resonator who debuted in Wuthering Waves Version 3.3. She is known for her unique combat style and powerful synergy abilities.',
    stats: 'Stats',
    element: 'Fusion',
    weapon: 'Gauntlets',
    rarity: '5★',
    skills: 'Skills',
    resonance: 'Resonance Skill',
    liberation: 'Resonance Liberation',
    variant: 'Resonance Variant',
    intro2: 'Background',
    team: 'Team Build',
  },
};

export default function Profile() {
  const [lang, setLang] = useState(() => localStorage.getItem('denia-lang') || 'en');
  const i18n = lang === 'zh' ? t.zh : t.en;

  return (
    <div className="profile-page">
      <button className="lang-switch-btn" onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}>
        {lang === 'zh' ? 'English' : '中文'}
      </button>

      <div className="profile-header">
        <div className="profile-avatar">
          <div className="avatar-frame">
            <div className="avatar-placeholder">丹妮娅</div>
          </div>
          <div className="rarity-badge">{t.zh.rarity}</div>
        </div>
        <div className="profile-info">
          <h1 className="profile-title">{i18n.title}</h1>
          <p className="profile-subtitle">{i18n.subtitle}</p>
        </div>
      </div>

      <div className="profile-content">
        <section className="profile-section">
          <h2 className="section-title">{i18n.stats}</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-icon">⚔️</span>
              <span className="stat-label">{i18n.weapon}</span>
            </div>
            <div className="stat-card">
              <span className="stat-icon">🔥</span>
              <span className="stat-label">{i18n.element}</span>
            </div>
            <div className="stat-card">
              <span className="stat-icon">⭐</span>
              <span className="stat-label">{i18n.rarity}</span>
            </div>
          </div>
        </section>

        <section className="profile-section">
          <h2 className="section-title">{i18n.intro}</h2>
          <p className="profile-text">{i18n.introText}</p>
        </section>

        <section className="profile-section">
          <h2 className="section-title">{i18n.skills}</h2>
          <div className="skills-list">
            <div className="skill-card">
              <h3>{i18n.resonance}</h3>
              <p className="skill-desc">丹妮娅释放融合能量，对敌人造成融合属性伤害。</p>
            </div>
            <div className="skill-card">
              <h3>{i18n.liberation}</h3>
              <p className="skill-desc">丹妮娅解放共鸣力量，对范围内敌人造成大量伤害。</p>
            </div>
            <div className="skill-card">
              <h3>{i18n.variant}</h3>
              <p className="skill-desc">丹妮娅在队伍中时，触发特殊共鸣效果。</p>
            </div>
          </div>
        </section>

        <section className="profile-section">
          <h2 className="section-title">{i18n.intro2}</h2>
          <p className="profile-text">
            丹妮娅是一位神秘而强大的共鸣者。她的过去笼罩在谜团之中，但她的力量和对伙伴的忠诚是毋庸置疑的。
            在战斗中，她展现出非凡的战术智慧和优雅的 combat 风格。
          </p>
        </section>
      </div>
    </div>
  );
}

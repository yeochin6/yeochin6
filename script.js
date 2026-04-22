// 简单随机标语/引言
const TAGLINES = [
  "今天也是努力搬砖的一天！",
      "加班使我快乐，薪资让我心安。",
      "打工路上，无问东西。",
      "科技让生活更美好，钱包也更鼓。",
      "向钱看，向厚赚！",
      "平凡岗位，闪耀青春。",
      "努力从未被辜负，加班也得有度。",
      "代码敲不完，薪水继续涨。",
      "工资不够，时间来凑。",
      "打工人的世界，只有干与更干！",
"搬砖虽苦，但我会把代码变成诗。",
  "Keep calm and commit often.",
  "「政府并非万能，但有时候也不错。」",
  "加班是生产力的误导，还是职场的仪式？",
  "「The only thing we have to fear is fear itself.」 — F. D. Roosevelt",
  "『Ask not what your code can do for you…』 — 纪念性自嘲"
];

function pickTagline(){
  const el = document.getElementById('tagline');
  el.textContent = TAGLINES[Math.floor(Math.random()*TAGLINES.length)];
}

// 计算本年已过去天数和百分比
function updateProgress(){
  const now = new Date();
  const start = new Date(now.getFullYear(),0,1);
  const next = new Date(now.getFullYear()+1,0,1);
  const passed = Math.floor((now - start) / (1000*60*60*24)) + 1;
  const total = Math.floor((next - start) / (1000*60*60*24));
  const pct = Math.min(100, Math.round(passed / total * 100));
  document.getElementById('dayText').textContent = `本年已过去 ${passed} 天 · 进度：`;
  document.getElementById('percentText').textContent = `${pct}%`;
  document.getElementById('progressFill').style.width = pct + '%';
  document.getElementById('worker').style.left = `calc(${pct}% - 22px)`;
}

// 从本地 news.json 加载新闻热词并滚动展示
async function loadNews(){
  try {
    const res = await fetch('news.json', {cache: "no-store"});
    if(!res.ok) throw new Error('无法加载 news.json');
    const arr = await res.json();
    if(!Array.isArray(arr) || arr.length===0) throw new Error('news.json 格式错误或空');
    const ticker = document.getElementById('newsTicker');
    const track = document.createElement('div');
    track.className = 'news-track';
    const items = arr.map(t => `<span class="news-item">${escapeHTML(t)}</span>`).join('');
    track.innerHTML = items + items;
    ticker.innerHTML = '';
    ticker.appendChild(track);
    const duration = Math.max(12, Math.min(40, arr.length * 2));
    track.style.animationDuration = duration + 's';
  } catch (err) {
    console.warn(err);
    document.getElementById('newsTicker').innerHTML = '<span class="news-item">新闻热词加载失败</span>';
  }
}

function escapeHTML(s){ return String(s).replace(/[&<>"']/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

// 移动端菜单切换
function initMobileMenu(){
  const toggle = document.getElementById('menuToggle');
  const links = document.getElementById('navLinks');
  if(!toggle || !links) return;
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    links.classList.toggle('active');
  });
  // 点击链接后关闭菜单
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      toggle.classList.remove('active');
      links.classList.remove('active');
    });
  });
}

document.addEventListener('DOMContentLoaded', ()=>{
  pickTagline();
  updateProgress();
  loadNews();
  initMobileMenu();
  setInterval(updateProgress, 60_000);
});
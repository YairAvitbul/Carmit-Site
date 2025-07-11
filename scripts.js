// scripts.js
document.addEventListener('DOMContentLoaded', async () => {
  // 1. טוענים את הקובץ כמערך בתים
  const resp = await fetch('docs/employees.xlsx');
  const buf = await resp.arrayBuffer();
  const wb = XLSX.read(buf, { type: 'array' });

  // 2. מוציאים את הגיליון הראשון ל-JSON
  const sheetName = wb.SheetNames[0];
  const sheet = wb.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false });

  // 3. מסמנים שורת כותרת (השורה החמישית, index = 4)
  const header = rows[4];
  const nameColIdx = header.indexOf('שם העובד ');
  const dateColIdx = header.indexOf('תאריך לידה');
  if (nameColIdx < 0 || dateColIdx < 0) {
    console.error('עמודה "שם העובד" או "תאריך לידה" לא נמצאה בכותרת');
    return;
  }

  // 4. בונים מערך של עובדים
  const employees = rows.slice(5)  // שורות הנתונים מתחילות משורה 6
    .map(r => ({
      name: r[nameColIdx],
      birth: new Date(r[dateColIdx])
    }))
    .filter(e => e.name && e.birth instanceof Date);

  // 5. פונקציה שבודקת אם יום־הולדת נמצא בחודש הקרוב
  function isBirthdayWithinNextMonth(birthDate) {
    const currentMonth = new Date().getMonth();
    const bd = new Date(birthDate);
    return bd.getMonth() == currentMonth;
  }

  // 6. מסננים את העובדים הקרובים
  const upcoming = employees.filter(e => isBirthdayWithinNextMonth(e.birth));

  // 7. בונים DOM של כרטיסיות
  const container = document.querySelector('.birthdays-cards');
  container.innerHTML = '';  // מנקים תוכן קיים
  upcoming.forEach(e => {
    const card = document.createElement('div');
    card.className = 'birthday-card';
    card.innerHTML = `
      <span class="employee-name">${e.name}</span>
      <span class="employee-date">
        ${e.birth.getDate().toString().padStart(2, '0')}/
        ${(e.birth.getMonth() + 1).toString().padStart(2, '0')}
      </span>`;
    container.appendChild(card);
  });

  // התאמת גובה דינמי של ה־container לפי מספר הכרטיסים,
  // עם מינימום של 3 שורות ומקסימום של 7.5 שורות
  const parent = document.querySelector('.birthdays-container');
  const cards = Array.from(parent.querySelectorAll('.birthday-card'));
  if (cards.length > 0) {
    const style = getComputedStyle(parent);
    const gap = parseFloat(style.rowGap || style.gap) || 0;
    const cardH = cards[0].getBoundingClientRect().height;
    // גובה כל הכרטיסים בפועל
    const totalH = cards.length * cardH + (cards.length - 1) * gap;
    // חישוב גבולות
    const minH = 3 * cardH + 2 * gap;
    const maxH = 7.5 * cardH + 6.5 * gap;
    // קלאמפ
    const finalH = Math.max(minH, Math.min(maxH, totalH));
    parent.style.height = `${finalH}px`;
  } else {
    parent.style.height = '0';
  }

  // 8. אם רוצים גלילה אינסופית – נשכפל את הכרטיסים פעמיים
  container.innerHTML += container.innerHTML;
  let scrollPos = 0;
  const speed = 50;
  setInterval(() => {
    scrollPos++;
    container.style.transform = `translateY(-${scrollPos}px)`;
    if (scrollPos >= container.scrollHeight / 2) scrollPos = 0;
  }, speed);







  // const re = /_R01|_R02|_R03|\.pdf|CAIS130200-/g;

  const toRemove = ["_R01", "_R02", "_R03", ".pdf", "CAIS130200-", "-11-", "-12-", "-13-", "-14-", "-15-", "-18"];

  // 9. בונים את תפריט "מדריכי הפעלה" מתוך docs/menu.json
  async function buildDocsMenu() {
    const resp = await fetch('docs/menu.json');
    const tree = await resp.json();
    const container = document.getElementById('dynamic-docs-menu');

    function createList(items) {
      const ul = document.createElement('ul');
      items.forEach(item => {
        const li = document.createElement('li');
        if (item.children) {
          li.classList.add('has-submenu');
          const a = document.createElement('a');
          a.href = '#';
          a.textContent = item.name;
          li.appendChild(a);
          const sub = createList(item.children);
          sub.classList.add('submenu');
          li.appendChild(sub);
        } else {
          const a = document.createElement('a');
          a.href = item.path;
          a.textContent = toRemove.reduce(
            (str, sub) => str.replaceAll(sub, ""),
            item.name
          ).replace("-", " ");

          // a.textContent = a.textContent;
          // a.textContent = a.textContent.replace("_R01", "");
          // a.textContent = a.textContent.replace("_R02", "");
          // a.textContent = a.textContent.replace("_R03", "");
          // a.textContent = a.textContent.replace(".pdf", "");
          // a.textContent = a.textContent.replace("CAIS130200-", "");

          // a.textContent = a.textContent.replace(["-11-", "-12-", "-13-", "-14-",], "");
          a.classList.add('pdf-option');
          li.appendChild(a);
        }
        ul.appendChild(li);
      });
      return ul;
    }

    // מנקים ושובצים
    container.innerHTML = '';
    container.appendChild(createList(tree));

    // מוסיפים האזנה ללינקים (אחרי שהתווספו ל־DOM!)
    container.querySelectorAll('.pdf-option').forEach(link =>
      link.addEventListener('click', e => {
        e.preventDefault();
        document.getElementById('modal-iframe').src = link.href;
        document.getElementById('modal').classList.remove('hidden');
      }));
  }
  // בסוף ה־DOMContentLoaded שלך:
  await buildDocsMenu();
});

// סגירת modal
const modal = document.getElementById('modal');
document.querySelector('.modal-close').addEventListener('click', () => {
  modal.classList.add('hidden');
  document.getElementById('modal-iframe').src = '';
});
modal.addEventListener('click', e => {
  if (e.target === modal) {
    modal.classList.add('hidden');
    document.getElementById('modal-iframe').src = '';
  }
});

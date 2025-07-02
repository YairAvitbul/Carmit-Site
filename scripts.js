// scripts.js
document.addEventListener('DOMContentLoaded', async () => {
  // 1. טוענים את הקובץ כמערך בתים
  const resp = await fetch('docs/birthdays.xlsx');
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

  // 5. פונקציה שבודקת אם יום־הולדת קרוב ב־nextDays ימים
  /**
   * בודק אם יום־הולדת של birthDate נופל בין היום לבין תאריך בדיוק חודש קדימה
   */
  function isBirthdayWithinNextMonth(birthDate) {
    const today = new Date();
    // מוציאים חודש קדימה
    const end = new Date(today);
    end.setMonth(end.getMonth() + 1);

    // יוצרים תאריך יומולדת לשנה הרלוונטית
    const bd = new Date(birthDate);
    bd.setFullYear(today.getFullYear());
    if (bd < today) bd.setFullYear(today.getFullYear() + 1);

    return bd >= today && bd < end;
  }

  // 6. מסננים את העובדים הקרובים
  const upcoming = employees.filter(e => isBirthdayWithinNextMonth(e.birth));

  // 7. בונים DOM של כרטיסיות
  const container = document.querySelector('.birthdays-cards');
  container.innerHTML = '';  // מנקים תוכן קיים
  upcoming.forEach(e => {
    const card = document.createElement('div');
    card.className = 'birthday-card';
    // בממשק RTL – שם לימין, תאריך לשמאל
    card.innerHTML = `
      <span class="employee-name">${e.name}</span>
      <span class="employee-date">
        ${e.birth.getDate().toString().padStart(2, '0')}/
        ${(e.birth.getMonth() + 1).toString().padStart(2, '0')}
      </span>`;
    container.appendChild(card);
  });

  // 8. אם רוצים גלילה אינסופית – נשכפל את הכרטיסים פעמיים
  container.innerHTML += container.innerHTML;
  let scrollPos = 0;
  const speed = 50;
  setInterval(() => {
    scrollPos++;
    container.style.transform = `translateY(-${scrollPos}px)`;
    if (scrollPos >= container.scrollHeight / 2) scrollPos = 0;
  }, speed);
});


// פתיחת modal להצגת הקובץ מתוך תפריט המשנה
document.querySelectorAll('.submenu a').forEach(link =>
  link.addEventListener('click', e => {
    e.preventDefault();
    document.getElementById('modal-iframe').src = link.href;
    document.getElementById('modal').classList.remove('hidden');
  })
);

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

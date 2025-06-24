// scripts.js
document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelector('.birthdays-cards');
  // משכפלים את התוכן פעמיים כדי ליצור רצף כפול
  cards.innerHTML += cards.innerHTML;

  const singleHeight = cards.scrollHeight / 2;  // גובה של המחצית (הבלוק המקורי)
  let scrollPos = 0;
  const speed = 50; // מילישניות בין צעדי גלילה

  setInterval(() => {
    scrollPos++;

    // ברגע שעברנו את גובה הבלוק המקורי – נחסיר ממנו
    if (scrollPos >= singleHeight) {
      scrollPos -= singleHeight;
    }

    cards.style.transform = `translateY(-${scrollPos}px)`;
  }, speed);
});



// משכפלים את התוכן פעמיים ברשימה, כדי לאפשר גלילה רצופה
list.innerHTML += list.innerHTML;

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



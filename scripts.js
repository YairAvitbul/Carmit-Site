// scripts.js
document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelector('.birthdays-cards');

  // שכפול התוכן פעמיים
  cards.innerHTML += cards.innerHTML;

  const singleHeight = cards.scrollHeight / 2;  // גובה "חצי" המכולה
  let scrollPos = 0;
  const speed = 40;

  setInterval(() => {
    scrollPos++;
    // כאשר מגיעים לסוף העותק הראשון, מחזירים אחורה בדיוק גובה חצי
    if (scrollPos >= singleHeight) {
      scrollPos -= singleHeight;
    }

    cards.style.transform = `translateY(-${scrollPos}px)`;
  }, speed);

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
})
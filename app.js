document.addEventListener('DOMContentLoaded', () => {
  const screens = {
    carnCheck: document.getElementById('carnitine-check'),
    drink: document.getElementById('drink-reminder'),
    gacha: document.getElementById('gacha'),
    exercise: document.getElementById('exercise'),
    stamp: document.getElementById('stamp')
  };
  const exercises = [
    { name: 'ニートゥチェスト', time: 60, instruction: '膝を胸に引き寄せて戻す' },
    { name: 'ヒップリフト', time: 75, instruction: 'お尻を上げてキープ' },
    { name: 'バイシクルレッグ', time: 60, instruction: '空中で自転車こぎ' },
    { name: 'ドローイン', time: 50, instruction: 'お腹をへこませてキープ' },
    { name: '足首回し', time: 40, instruction: '足首をぐるぐる回す' },
    { name: 'レッグレイズ', time: 60, instruction: '脚を上げ下げ' }
  ];
  let routine = [];
  let current = 0;
  let timerId = null;
  let timeLeft = 0;

  function show(screen) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[screen].classList.add('active');
  }

  document.getElementById('carn-yes').onclick = () => {
    makeRoutine();
    show('gacha');
  };
  document.getElementById('carn-no').onclick = () => {
    show('drink');
  };
  document.getElementById('recheck').onclick = () => {
    show('carnCheck');
  };

  function makeRoutine() {
    routine = [];
    const copy = [...exercises];
    for(let i=0;i<3;i++) {
      const idx = Math.floor(Math.random() * copy.length);
      routine.push(copy.splice(idx,1)[0]);
    }
    const list = document.getElementById('menu-list');
    list.innerHTML = '';
    routine.forEach(r => {
      const div = document.createElement('div');
      div.textContent = `${r.name} : ${r.time}s`;
      list.appendChild(div);
    });
    current = 0;
  }

  document.getElementById('start-routine').onclick = () => {
    showExercise();
  };

  function showExercise() {
    if(current >= routine.length) {
      addStamp();
      renderStreak();
      show('stamp');
      return;
    }
    const ex = routine[current];
    document.getElementById('exercise-name').textContent = ex.name;
    document.getElementById('instruction').textContent = ex.instruction;
    timeLeft = ex.time;
    updateTimer();
    animateCircle();
    show('exercise');
  }

  document.getElementById('complete').onclick = () => {
    clearInterval(timerId);
    document.getElementById('timer-circle').style.strokeDashoffset = 565;
    current++;
    showExercise();
  };

  document.getElementById('finish').onclick = () => {
    show('carnCheck');
  };

  function updateTimer() {
    document.getElementById('timer-text').textContent = timeLeft;
  }

  function animateCircle() {
    const circle = document.getElementById('timer-circle');
    const total = timeLeft;
    const per = 565 / total;
    circle.style.strokeDashoffset = 565;
    updateTimer();
    timerId = setInterval(() => {
      timeLeft--;
      circle.style.strokeDashoffset = 565 - per * (total - timeLeft);
      updateTimer();
      if(timeLeft <= 0) {
        clearInterval(timerId);
      }
    },1000);
  }

  function addStamp() {
    const today = new Date().toISOString().split('T')[0];
    const data = JSON.parse(localStorage.getItem('stampData') || '{"stamps":{}}');
    if(!data.stamps[today]) {
      data.stamps[today] = true;
      if(data.lastDate === getYesterday()) {
        data.streak = (data.streak||0) + 1;
      } else if(data.lastDate === today) {
        // do nothing
      } else {
        data.streak = 1;
      }
      data.lastDate = today;
    }
    localStorage.setItem('stampData', JSON.stringify(data));
  }

  function renderStreak() {
    const data = JSON.parse(localStorage.getItem('stampData') || '{"stamps":{}}');
    document.getElementById('streak').textContent = `連続 ${data.streak||1} 日達成！`;
  }

  function getYesterday() {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split('T')[0];
  }
});

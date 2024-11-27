const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const soal = document.getElementById('menjodohkan');
let selectedSoal = null;


function resizeCanvas() {
  const soalRect = soal.getBoundingClientRect();
  canvas.style.top = `${soalRect.top + window.scrollY}px`;
  canvas.style.left = `${soalRect.left + window.scrollX}px`;
  canvas.width = soal.offsetWidth;
  canvas.height = soal.offsetHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);
window.addEventListener('scroll', resizeCanvas);

document.querySelectorAll('input[name="soal"]').forEach((radio) => {
  radio.addEventListener('change', (e) => {
    selectedSoal = e.target;
  });
});

document.querySelectorAll('input[name="jawaban"]').forEach((radio) => {
  radio.addEventListener('change', (e) => {
    if (selectedSoal) {
      const soalRect = soal.getBoundingClientRect();
      const soalOptionRect = selectedSoal.getBoundingClientRect();
      const jawabanOptionRect = e.target.getBoundingClientRect();

      const soalCenter = {
        x: soalOptionRect.left + soalOptionRect.width / 2 - soalRect.left,
        y: soalOptionRect.top + soalOptionRect.height / 2 - soalRect.top,
      };

      const jawabanCenter = {
        x: jawabanOptionRect.left + jawabanOptionRect.width / 2 - soalRect.left,
        y: jawabanOptionRect.top + jawabanOptionRect.height / 2 - soalRect.top,
      };

      drawLine(soalCenter, jawabanCenter);
      logPair(selectedSoal.value, e.target.value);
      selectedSoal = null;
    }
  });
});

function drawLine(start, end) {
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.strokeStyle = 'blue';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.closePath();
}

function logPair(soalValue, jawabanValue) {
  console.log(`Soal ${soalValue} dijodohkan dengan Jawaban ${jawabanValue}`);
}

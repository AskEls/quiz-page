document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('soal-container');
  let currentQuestionId = 1; // ID soal yang sedang aktif

  try {
    // Fetch data soal
    const response = await fetch('./soal.json');
    const data = await response.json();
    window.questionsData = data; // Simpan soal untuk diakses oleh main.js
    // Ekspor fungsi ke global scope
    window.renderQuestionById = renderQuestionById;

    // Fungsi untuk merender soal berdasarkan ID
    function renderQuestionById(id) {
      container.innerHTML = ''; // Hapus soal sebelumnya
      const soal = data.find((q) => q.id === id); // Cari soal berdasarkan ID

      if (!soal) {
        container.innerHTML = '<p class="text-red-500">Soal tidak ditemukan.</p>';
        return;
      }

      const soalElement = document.createElement('div');
      soalElement.className = 'mb-6';

      // Render sesuai kategori soal
      if (soal.type === 'pilihanganda') {
        soalElement.innerHTML = `
          <h2 class="text-xs font-bold mb-2">${soal.id}. Pilihan ganda pilih salah satu</h2>
          <p class="text-gray-700 text-sm m-2">${soal.pertanyaan}</p>
          <div class="space-y-2">
            ${soal.pilihan
              .map(
                (pilihan, idx) => `
                <label class="flex items-center text-xs">
                  <input type="radio" name="soal-${soal.id}" value="${idx}" class="mr-2">
                  <span>${pilihan}</span>
                </label>
              `
              )
              .join('')}
          </div>
        `;
      } 
      else if (soal.type === 'benaratausalah') {
        soalElement.innerHTML = `
          <h2 class="text-xs font-bold mb-2">${soal.id}. Pilihan Benar atau Salah Pilih Salah Satu</h2>
          <p class="text-gray-700 text-sm m-2">${soal.pertanyaan}</p>
          <div class="space-y-2">
            ${soal.pilihan
              .map(
                (pilihan, idx) => `
                <label class="flex items-center text-xs">
                  <input type="radio" name="soal-${soal.id}" value="${idx}" class="mr-2">
                  <span>${pilihan}</span>
                </label>
              `
              )
              .join('')}
          </div>
        `;
      } 
      else if (soal.type === 'menjodohkan') {
  soalElement.innerHTML = `
    <h2 class="text-xs font-bold mb-2">${soal.id}. Cocokkan pasangan berikut:</h2>
    <p class="text-gray-700 text-sm m-2">${soal.pertanyaan}</p>
    <div class="kolom-pilihan grid grid-cols-2 gap-8" id="menjodohkan">
      <div class="space-y-1">
        ${soal.soal.map(
          (item, idx) => `
          <div class="flex items-center justify-end text-xs ">
            <label for="soal-${idx}" class="text-gray-700 text-left w-full">${item}</label>
            <input type="radio" class="m-2" name="soal" value="${idx + 1}" id="soal-${idx}">
          </div>
        `
        ).join('')}
      </div>
      <div class="space-y-1">
        ${soal.jawaban.map(
          (item, idx) => `
          <div class="radio-container text-xs">
            <input type="radio" name="jawaban" class="m-2" value="${String.fromCharCode(65 + idx)}" id="jawaban-${idx}">
            <label for="jawaban-${idx}" class="text-gray-700 text-right w-full">${item}</label>
          </div>
        `
        ).join('')}
      </div>
    </div>
    <canvas id="canvas"></canvas>
  `;

  let drawnLines = []; // Array untuk menyimpan garis

  setTimeout(() => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const soalContainer = document.getElementById('menjodohkan');
    let selectedSoal = null;

    function resizeCanvas() {
      const rect = soalContainer.getBoundingClientRect();
      canvas.style.top = `${rect.top + window.scrollY}px`;
      canvas.style.left = `${rect.left + window.scrollX}px`;
      canvas.width = soalContainer.offsetWidth;
      canvas.height = soalContainer.offsetHeight;

      // Gambar ulang semua garis
      drawnLines.forEach(({ start, end }) => {
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();
      });
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
          const soalRect = soalContainer.getBoundingClientRect();
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

      // Simpan garis ke array
      drawnLines.push({ start, end });
    }

    function logPair(soalValue, jawabanValue) {
      console.log(`Soal ${soalValue} dijodohkan dengan Jawaban ${jawabanValue}`);
    }
  }, 100);
}

      container.appendChild(soalElement);
    }

    // Render soal pertama kali
    renderQuestionById(currentQuestionId);

    // Tombol navigasi
    window.goToPreviousQuestion = () => {
      if (currentQuestionId > 1) {
        currentQuestionId--;
        renderQuestionById(currentQuestionId);
      }
    };

    window.goToNextQuestion = () => {
      if (currentQuestionId < data.length) {
        currentQuestionId++;
        renderQuestionById(currentQuestionId);
      }
    };

    window.refreshPage = () => {
      renderQuestionById(currentQuestionId);
    };
  } catch (error) {
    console.error('Error loading questions:', error);
    container.innerHTML = '<p class="text-red-500">Gagal memuat soal. Silakan coba lagi.</p>';
  }
});

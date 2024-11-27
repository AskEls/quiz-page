let currentQuestionId = 1; // ID soal yang sedang aktif
const answeredQuestions = new Set(); // Untuk melacak soal yang sudah dijawab

function startCountdown() {
  let countdownTime = 3600; // 1 hour in seconds
  const timerElement = document.getElementById('timer');
  const interval = setInterval(() => {
    if (countdownTime <= 0) {
      clearInterval(interval);
      alert("Waktu habis!");
      return;
    }
    const minutes = Math.floor(countdownTime / 60);
    const seconds = countdownTime % 60;
    timerElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    countdownTime--;
  }, 1000);
}

function populateQuestionList() {
  const dropdownMenu = document.getElementById('dropdown-menu');
  const totalQuestions = window.questionsData?.length || 0; // Ambil jumlah soal dari window.questionsData
  dropdownMenu.innerHTML = '';

  for (let i = 1; i <= totalQuestions; i++) {
    const questionItem = document.createElement('div');
    questionItem.className =
      'flex justify-center items-center bg-white text-black w-9 h-9 rounded-full shadow-md hover:bg-gray-200 cursor-pointer transition-all';
    questionItem.textContent = i;

    // Pindah ke soal saat nomor diklik
    questionItem.onclick = () => {
      currentQuestionId = i; // Perbarui ID soal saat ini
      window.renderQuestionById(i); // Gunakan fungsi dari loader.js
      toggleDropdown(); // Sembunyikan dropdown setelah navigasi
      updateQuestionListColors(); // Perbarui warna nomor
    };

    dropdownMenu.appendChild(questionItem);
  }
}

function adjustDropdownWidth() {
  const soalElement = document.getElementById('soal');
  const dropdownContainer = document.getElementById('dropdown-container');
  const soalWidth = soalElement.offsetWidth;
  dropdownContainer.style.width = `${soalWidth}px`;
}

function toggleDropdown() {
  const dropdown = document.getElementById('dropdown-container');
  dropdown.classList.toggle('hidden');
}

// Fungsi untuk memperbarui warna nomor pada daftar
function updateQuestionListColors() {
  const dropdownMenu = document.getElementById('dropdown-menu');
  const questionItems = dropdownMenu.children;

  for (let i = 0; i < questionItems.length; i++) {
    const questionId = i + 1;
    if (answeredQuestions.has(questionId)) {
      // Jika soal sudah dijawab, warna biru
      questionItems[i].className =
        'flex justify-center items-center bg-blue-600 text-white w-9 h-9 rounded-full shadow-md';
    } else {
      // Jika soal belum dijawab, warna putih
      questionItems[i].className =
        'flex justify-center items-center bg-white text-black w-9 h-9 rounded-full shadow-md';
    }
  }
}

// Listener untuk melacak jawaban soal
function addAnswerTracking() {
  const questionInputs = document.querySelectorAll('input[type="radio"]');
  questionInputs.forEach((input) => {
    input.addEventListener('change', () => {
      const questionId = currentQuestionId;
      answeredQuestions.add(questionId); // Tandai soal sebagai terjawab
      updateQuestionListColors(); // Perbarui warna nomor
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const waitForQuestions = setInterval(() => {
    if (window.questionsData) {
      clearInterval(waitForQuestions); // Tunggu sampai data tersedia
      populateQuestionList(); // Panggil fungsi setelah data tersedia
      window.renderQuestionById(currentQuestionId); // Render soal pertama
      addAnswerTracking(); // Tambahkan pelacakan jawaban
    }
  }, 100);

  startCountdown();
  adjustDropdownWidth();
  window.addEventListener('resize', adjustDropdownWidth); // Adjust width on window resize
});

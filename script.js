const cardsData = [
    {
      title: "Icício",
      description: "Boa noite minha vida, tudo bem com você? Espero que sim, e espero que você esteja tão empolgada quanto eu para curtir essa noite juntinha comigo, que irá marcar o começo oficial na nossa história. Criei esse app com pequenas missões como uma forma descontraída de aproveitarmos nosso encontro especial, espero que goste! Para começar-mos, digite a senha 'start'",
      password: "start"
    },
    {
      title: "Missão 1",
      description: "Vamos começar com uma missão simples, mas que tem um significado enorme (e eu particularmente gosto muito) sua primeira missão é me dar um BEIJÃO de 10 segundos, e um abraço bem gostoso. Após finalizar a missão, pode pedir a senha que desbloqueia a próxima tarefa para seu namorado careca, lindo, gostoso e cheiroso.",
      password: "beijo"
    },
    {
      title: "Missão 2",
      description: "Eita beijo gostoso da porra, depois vou querer mais viu. Mas agora, vamos para nosso date, no caminho até o Yasu, coloca pra gente ouvir uma música que represente nós dois. Quando a música acabar, Zezinho vai te dar a senha da próxima tarefa.",
      password: "musica"
    },
    {
      title: "Missão 3",
      description: "Essa música vai ficar marcada e vai representar nós 2, já era, se quiser mudar agora, só dia 12/09/26. Vamos chegar no Yasu, escolher nossa mesa, e aproveitar pra tirar uma foto bonita de nós 2 (não precisa postar se não quiser, é só pra registrar o momento enquanto escolhemos nossos pedidos, e não esquece do sunomono, aquele pepino que voce gosta). Depois que fizermos o pedido dus xuxis, vamos pra próxima missão.",
      password: "foto"
    },
    {
      title: "Missão 4",
      description: "Eita coisa boa, quanta coisa gostosa que a gente pediu, deixa eu adivinhar, você quis uns 2 sunomonos? Ou foram logo 3? Mas mais importante ainda, sei que pedimos nossos temakis de lei, depois que eles chegarem, vamos comer eles juntos (pq a gente ama temaki, e a gente ama fazer coisa junto) e depois podemos ir pra proxima tarefa.",
      password: "temaki"
    },
    {
      title: "Missão 5",
      description: "Hoje daremos início aos nossos videos de casal, e portanto gravaremos nosso primeiro conteudo......Calma vida, to falando de desafio de sushi, pensou em besteira né? Depois a gente vê melhor isso ai que voce pensou kkkkkkkkkkkkk. Mas voltando, vamos fazer o desafio do wasabi no sushi, as regras voce ja sabe, cada um coloca wasabi numa peça de sushi, e quem pegar o sushi com wasabi primeiro, perde o jogo.",
      password: "wasabi"
    },
    {
      title: "Missão 6",
      description: "Ardeu a boca né? Mas você dá conta vida, já até ta aprendendo a gostar de pimenta. Wasabi pra você não é nada! Mas ja que ardeu, você tem uma missão especial, você terá a enorme honra de pedir uma água da casa pra gente, pra entrar nesse relacionamento não pode ter vergonha de pedir água da casa!",
      password: "agua"
    },
    {
      title: "Missão 7 - Bônus",
      description: "Ja falei coisa de mais pra fazermos, agora é sua vez de me falar, me dê uma mini missão ou algo que queira que façamos aqui, essa missão é por sua conta.",
      password: "bonus"
    },
    {
      title: "Missão 8",
      description: "Mulher minha que vai pagar conta do restaurante no pedido de namoro, entao não quero nem saber, na hora de pagar você trate de pegar o cartão do Zezinho e pagar, e nao quero ouvir reclamação!",
      password: "conta"
    },
    {
      title: "Missão Final?",
      description: "A missão pode até ser a final, mas ela vai marcar o início de tudo, então ela é a que tem maior importância de todas! Mas ela também é simples. Quero saber, você aceita namorar comigo, e construir comigo um futuro lindo, do nosso jeitinho? (Afinal você nasceu pra mim pra ficar coladin)",
      password: "sim"
    }
  ];
  
  let currentCardIndex = 0;
  
  const container = document.getElementById("card-container");
  const progressFill = document.getElementById("progress-fill");
  const progressText = document.getElementById("progress-text");
  const resetBtn = document.getElementById("reset-btn");
  const modal = document.getElementById("final-modal");
  const modalClose = document.getElementById("close-modal");
  const answerYes = document.getElementById("answer-yes");
  const historyList = document.getElementById("history-list");
  const toggleHistoryBtn = document.getElementById("toggle-history");
  
  // camera elements
  const cameraModal = document.getElementById('camera-modal');
  const cameraVideo = document.getElementById('camera-video');
  const cameraCanvas = document.getElementById('camera-canvas');
  const captureBtn = document.getElementById('capture-photo');
  const switchCameraBtn = document.getElementById('switch-camera');
  const closeCameraBtn = document.getElementById('close-camera');
  let cameraStream = null;
  let useFrontCamera = false;
  let activeHistoryIndex = null;
  
  // lightbox
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const closeLightboxBtn = document.getElementById('close-lightbox');
  const downloadImage = document.getElementById('download-image');
  
  const STORAGE_INDEX = "currentCardIndex";
  const STORAGE_HISTORY = "missionsHistory";
  
  function updateProgress(index) {
    const total = cardsData.length;
    const value = Math.min(index, total);
    const percent = (value / total) * 100;
    progressFill.style.width = `${percent}%`;
    progressText.textContent = `${value}/${total}`;
  }
  
  function renderCard(index) {
    if (index >= cardsData.length) {
      updateProgress(cardsData.length);
      setTimeout(showFinalModal, 350);
      return;
    }
  
    // mostrar apenas a missão atual
    container.innerHTML = "";
  
    const card = cardsData[index];
    const div = document.createElement("div");
    div.className = "card locked";
    div.id = `card-${index}`;
    div.innerHTML = `
      <h2>${card.title}</h2>
      <p class="description hint">${card.description}</p>
      <input type="text" placeholder="Digite a senha para desbloquear" aria-label="Senha da ${card.title}" />
      <button class="primary" data-index="${index}">Desbloquear</button>
    `;
    container.appendChild(div);
  
    const input = div.querySelector('input');
    const button = div.querySelector('button');
    button.addEventListener('click', () => unlockCard(index));
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        unlockCard(index);
      }
    });
  
    updateProgress(index);
  }
  
  function addHistoryItem({ title, password, date, photos = [] }, index) {
    const li = document.createElement('li');
    li.dataset.index = String(index);
    li.innerHTML = `
      <span class="history-item-title">${title}</span>
      <div class="history-item-meta">
        <span>Senha: <strong>${password}</strong></span>
        <span>•</span>
        <span>${new Date(date).toLocaleString()}</span>
      </div>
      <div class="history-item-photo"></div>
      <div class="history-item-actions">
        <button class="icon-btn add-photo-file" aria-label="Adicionar foto da galeria">🖼️ Galeria</button>
        <button class="icon-btn add-photo-camera" aria-label="Abrir câmera">📷 Câmera</button>
        <input type="file" accept="image/*" class="photo-input" hidden />
      </div>
    `;
  
    const photoContainer = li.querySelector('.history-item-photo');
    photos.forEach(src => {
      const img = document.createElement('img');
      img.src = src;
      img.addEventListener('click', () => openLightbox(src));
      photoContainer.appendChild(img);
    });
  
    const fileBtn = li.querySelector('.add-photo-file');
    const camBtn = li.querySelector('.add-photo-camera');
    const fileInput = li.querySelector('.photo-input');
    fileBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', async (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const dataUrl = await fileToDataURL(file);
      appendPhotoToHistory(index, dataUrl);
      const img = document.createElement('img');
      img.src = dataUrl;
      img.addEventListener('click', () => openLightbox(dataUrl));
      photoContainer.appendChild(img);
      fileInput.value = '';
    });
    camBtn.addEventListener('click', () => openCamera(index));
  
    historyList.prepend(li);
  }
  
  function openLightbox(src) {
    lightboxImage.src = src;
    downloadImage.href = src;
    lightbox.hidden = false;
  }
  function closeLightbox() { lightbox.hidden = true; }
  
  function fileToDataURL(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
  
  function persistHistoryItem(item) {
    const data = JSON.parse(localStorage.getItem(STORAGE_HISTORY) || '[]');
    data.push(item);
    localStorage.setItem(STORAGE_HISTORY, JSON.stringify(data));
  }
  
  function appendPhotoToHistory(index, dataUrl) {
    const data = JSON.parse(localStorage.getItem(STORAGE_HISTORY) || '[]');
    const item = data[index];
    if (!item) return;
    item.photos = item.photos || [];
    item.photos.push(dataUrl);
    localStorage.setItem(STORAGE_HISTORY, JSON.stringify(data));
  }
  
  function loadHistory() {
    historyList.innerHTML = '';
    const data = JSON.parse(localStorage.getItem(STORAGE_HISTORY) || '[]');
    data.forEach((item, i) => addHistoryItem(item, i));
  }
  
  function toggleHistory() {
    const isHidden = historyList.hasAttribute('hidden');
    if (isHidden) {
      historyList.removeAttribute('hidden');
      toggleHistoryBtn.textContent = '🙈';
      toggleHistoryBtn.setAttribute('aria-label', 'Esconder histórico');
    } else {
      historyList.setAttribute('hidden', '');
      toggleHistoryBtn.textContent = '👁️';
      toggleHistoryBtn.setAttribute('aria-label', 'Mostrar histórico');
    }
  }
  
  async function openCamera(historyIndex) {
    activeHistoryIndex = historyIndex;
    cameraModal.hidden = false;
    await startCamera();
  }
  
  async function startCamera() {
    stopCamera();
    const constraints = {
      video: {
        facingMode: useFrontCamera ? 'user' : 'environment'
      },
      audio: false
    };
    try {
      cameraStream = await navigator.mediaDevices.getUserMedia(constraints);
      cameraVideo.srcObject = cameraStream;
      await cameraVideo.play();
    } catch (e) {
      alert('Não foi possível acessar a câmera. Verifique as permissões.');
      closeCamera();
    }
  }
  
  function stopCamera() {
    if (cameraStream) {
      cameraStream.getTracks().forEach(t => t.stop());
      cameraStream = null;
    }
  }
  
  function closeCamera() {
    stopCamera();
    cameraModal.hidden = true;
  }
  
  function captureFrame() {
    const video = cameraVideo;
    const canvas = cameraCanvas;
    const width = video.videoWidth;
    const height = video.videoHeight;
    if (!width || !height) return null;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, width, height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    return dataUrl;
  }
  
  function unlockCard(index) {
    const card = cardsData[index];
    const cardDiv = document.getElementById(`card-${index}`);
    const input = cardDiv.querySelector('input');
    const userInput = input.value.trim().toLowerCase();
  
    if (userInput === card.password) {
      cardDiv.classList.remove("locked");
      const desc = cardDiv.querySelector(".description");
      desc.classList.remove('hint');
      desc.style.display = "block";
      cardDiv.querySelector("input").style.display = "none";
      cardDiv.querySelector("button").style.display = "none";
  
      // persist progress
      localStorage.setItem(STORAGE_INDEX, index + 1);
      currentCardIndex = index + 1;
  
      // persist and render history
      const item = { title: card.title, password: card.password, date: Date.now(), photos: [] };
      persistHistoryItem(item);
      const data = JSON.parse(localStorage.getItem(STORAGE_HISTORY) || '[]');
      const newIndex = data.length - 1;
      addHistoryItem(item, newIndex);
  
      // transição de saída antes de carregar o próximo
      cardDiv.classList.add('card-leave');
      setTimeout(() => renderCard(currentCardIndex), 280);
    } else {
      cardDiv.classList.remove('shake');
      void cardDiv.offsetWidth;
      cardDiv.classList.add('shake');
    }
  }
  
  function showFinalModal() {
    modal.hidden = false;
    spawnCelebrationHearts();
  }
  
  function closeFinalModal() {
    modal.hidden = true;
  }
  
  function showOfficialGirlfriendMessage() {
    container.innerHTML = `
      <div class="card">
        <h2>Agora é oficial! 💍</h2>
        <p class="description">Você é oficialmente minha namorada! Espero que você tenha gostado desse nosso date, fiz com muito carinho. Que essa seja a primeira de muitas aventuras juntos! 💖</p>
        <img src="foto.jpg" alt="Nosso momento especial" class="final-photo" />
      </div>
    `;
  }
  
  function spawnCelebrationHearts() {
    const area = modal.querySelector('.celebration');
    area.innerHTML = '';
    for (let i = 0; i < 24; i++) {
      const span = document.createElement('span');
      span.textContent = '💖';
      span.style.display = 'inline-block';
      span.style.margin = '0 4px';
      span.style.transform = `translateY(${Math.random()*10}px)`;
      span.style.opacity = String(0.6 + Math.random()*0.4);
      area.appendChild(span);
    }
  }
  
  function resetProgress() {
    if (!confirm('Tem certeza que deseja recomeçar? Isso apagará o histórico da noite.')) return;
    localStorage.removeItem(STORAGE_INDEX);
    localStorage.removeItem(STORAGE_HISTORY);
    currentCardIndex = 0;
    container.innerHTML = '';
    historyList.innerHTML = '';
    updateProgress(0);
    renderCard(0);
  }
  
  // Load progress
  window.onload = () => {
    const savedIndex = localStorage.getItem(STORAGE_INDEX);
    currentCardIndex = savedIndex ? parseInt(savedIndex) : 0;
    updateProgress(currentCardIndex);
    renderCard(currentCardIndex);
    loadHistory();
  
    resetBtn.addEventListener('click', resetProgress);
    modalClose.addEventListener('click', closeFinalModal);
    answerYes.addEventListener('click', () => { closeFinalModal(); showOfficialGirlfriendMessage(); });
    toggleHistoryBtn.addEventListener('click', toggleHistory);
  
    // camera events
    captureBtn.addEventListener('click', () => {
      const dataUrl = captureFrame();
      if (!dataUrl || activeHistoryIndex === null) return;
      appendPhotoToHistory(activeHistoryIndex, dataUrl);
      const item = historyList.querySelector(`li[data-index="${activeHistoryIndex}"] .history-item-photo`);
      if (item) {
        const img = document.createElement('img');
        img.src = dataUrl;
        img.addEventListener('click', () => openLightbox(dataUrl));
        item.appendChild(img);
      }
      closeCamera();
    });
    switchCameraBtn.addEventListener('click', async () => {
      useFrontCamera = !useFrontCamera;
      await startCamera();
    });
    closeCameraBtn.addEventListener('click', closeCamera);
  
    // lightbox events
    closeLightboxBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  };
  
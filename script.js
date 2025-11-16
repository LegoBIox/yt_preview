// Configuración de tamaños de pantalla
const screenSizes = {
    mobile: {
        width: 360,
        height: 640,
        fontSize: '14px',
        resolution: '360x640'
    },
    desktop: {
        width: 640,
        height: 360,
        fontSize: '18px',
        resolution: '1280x720'
    },
    tv: {
        width: 1280,
        height: 720,
        fontSize: '28px',
        resolution: '1920x1080'
    }
};

// Elementos del DOM
const youtubeUrlInput = document.getElementById('youtube-url');
const loadBtn = document.getElementById('load-btn');
const localImageInput = document.getElementById('local-image');
const loadLocalBtn = document.getElementById('load-local-btn');
const videoTitleInput = document.getElementById('video-title');
const titleGroup = document.getElementById('title-group');
const previewSection = document.getElementById('preview-section');
const previewContainer = document.getElementById('preview-container');
const previewDevice = document.getElementById('preview-device');
const thumbnailImg = document.getElementById('thumbnail-img');
const previewTitle = document.getElementById('preview-title');
const sizeButtons = document.querySelectorAll('.size-btn');
const errorMessage = document.getElementById('error-message');
const resolutionInfo = document.getElementById('resolution-info');
const fontSizeInfo = document.getElementById('font-size-info');

let currentVideoId = null;
let currentImageSource = null; // Puede ser 'youtube' o 'local'
let currentSize = 'mobile';

// Extraer ID del video de YouTube
function extractVideoId(url) {
    if (!url) return null;
    
    const patterns = [ // regular expresssion para extraer el ID del video
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
        /youtube\.com\/.*[?&]v=([^&\n?#]+)/
    ];
    
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
            return match[1];
        }
    }
    
    return null;
}

// Obtener URL del thumbnail
function getThumbnailUrl(videoId, quality = 'maxresdefault') {
    return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
}

// Obtener título del video usando API pública
async function getVideoTitle(videoId) {
    try {
        // Intentar obtener el título desde oEmbed API de YouTube
        const oEmbedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
        
        const response = await fetch(oEmbedUrl);
        if (response.ok) {
            const data = await response.json();
            return data.title;
        }
    } catch (error) {
        console.log('No se pudo obtener el título automáticamente:', error);
    }
    
    // Si falla, intentar con una alternativa usando noembed.com
    try {
        const noEmbedUrl = `https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`;
        const response = await fetch(noEmbedUrl);
        if (response.ok) {
            const data = await response.json();
            return data.title || null;
        }
    } catch (error) {
        console.log('Error al obtener título:', error);
    }
    
    return null;
}

// Cargar video desde YouTube
async function loadVideo() {
    const url = youtubeUrlInput.value.trim();
    
    if (!url) {
        showError('Por favor, ingresa una URL de YouTube válida');
        return;
    }
    
    const videoId = extractVideoId(url);
    
    if (!videoId) {
        showError('URL de YouTube no válida. Por favor, verifica la URL.');
        return;
    }
    
    currentVideoId = videoId;
    currentImageSource = 'youtube';
    hideError();
    
    // Mostrar loading
    loadBtn.textContent = 'Cargando...';
    loadBtn.disabled = true;
    
    try {
        // Obtener thumbnail
        const thumbnailUrl = getThumbnailUrl(videoId);
        thumbnailImg.src = thumbnailUrl;
        
        // Intentar obtener título
        const title = await getVideoTitle(videoId);
        if (title) {
            videoTitleInput.value = title;
            previewTitle.textContent = title;
        } else {
            videoTitleInput.value = '';
            videoTitleInput.placeholder = 'Ingresa el título del video';
            previewTitle.textContent = 'Título del video';
        }
        
        // Mostrar secciones
        previewSection.style.display = 'block';
        
        // Actualizar vista
        updatePreview();
        
    } catch (error) {
        showError('Error al cargar el video. Por favor, intenta de nuevo.');
        console.error('Error:', error);
    } finally {
        loadBtn.textContent = 'Cargar Video';
        loadBtn.disabled = false;
    }
}

// Cargar imagen local
function loadLocalImage() {
    const file = localImageInput.files[0];
    
    if (!file) {
        showError('Por favor, selecciona una imagen');
        return;
    }
    
    if (!file.type.startsWith('image/')) {
        showError('Por favor, selecciona un archivo de imagen válido');
        return;
    }
    
    currentVideoId = null;
    currentImageSource = 'local';
    hideError();
    
    // Crear URL local para la imagen
    const reader = new FileReader();
    
    reader.onload = function(e) {
        thumbnailImg.src = e.target.result;
        
        // Si no hay título, usar placeholder
        if (!videoTitleInput.value.trim()) {
            previewTitle.textContent = 'Título del video';
        } else {
            previewTitle.textContent = videoTitleInput.value.trim();
        }
        
        // Mostrar secciones
        previewSection.style.display = 'block';
        
        // Actualizar vista
        updatePreview();
    };
    
    reader.onerror = function() {
        showError('Error al cargar la imagen. Por favor, intenta de nuevo.');
    };
    
    reader.readAsDataURL(file);
}

// Actualizar preview
function updatePreview() {
    // Solo actualizar si hay una imagen cargada (ya sea de YouTube o local)
    if (!currentImageSource) return;
    
    // Actualizar clase de tamaño
    previewDevice.className = `preview-device ${currentSize}`;
    
    // Actualizar título si hay uno ingresado
    const title = videoTitleInput.value.trim();
    if (title) {
        previewTitle.textContent = title;
    } else {
        previewTitle.textContent = 'Título del video';
    }
    
    // Actualizar información
    const sizeInfo = screenSizes[currentSize];
    resolutionInfo.textContent = sizeInfo.resolution;
    fontSizeInfo.textContent = sizeInfo.fontSize;
}

// Cambiar tamaño
function changeSize(size) {
    currentSize = size;
    
    // Actualizar botones activos
    sizeButtons.forEach(btn => {
        if (btn.dataset.size === size) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    updatePreview();
}

// Mostrar error
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

// Ocultar error
function hideError() {
    errorMessage.style.display = 'none';
}

// Event listeners
loadBtn.addEventListener('click', loadVideo);

loadLocalBtn.addEventListener('click', loadLocalImage);

localImageInput.addEventListener('change', () => {
    // Opcional: cargar automáticamente cuando se selecciona un archivo
    if (localImageInput.files.length > 0) {
        loadLocalImage();
    }
});

youtubeUrlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        loadVideo();
    }
});

videoTitleInput.addEventListener('input', () => {
    updatePreview();
});

sizeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        changeSize(btn.dataset.size);
    });
});

// Verificar si la imagen del thumbnail se carga correctamente
thumbnailImg.addEventListener('error', function() {
    // Solo intentar con hqdefault si es una imagen de YouTube
    if (currentImageSource === 'youtube' && currentVideoId && this.src.includes('maxresdefault')) {
        this.src = getThumbnailUrl(currentVideoId, 'hqdefault');
    } else if (currentImageSource === 'youtube') {
        showError('No se pudo cargar el thumbnail. Verifica que el video exista.');
    } else {
        showError('Error al cargar la imagen. Por favor, verifica el archivo.');
    }
});


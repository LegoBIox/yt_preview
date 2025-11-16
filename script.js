// Elementos del DOM
const thumbnailUpload = document.getElementById('thumbnailUpload');
const videoTitleInput = document.getElementById('videoTitle');
const channelNameInput = document.getElementById('channelName');
const channelIconUpload = document.getElementById('channelIconUpload');
const previewUpload = document.getElementById('previewUpload');
const previewChannelIcon = document.getElementById('previewChannelIcon');
const titleCount = document.getElementById('titleCount');
const channelCount = document.getElementById('channelCount');

// IDs de todos los elementos de thumbnail y texto
const thumbnailIds = [
    'thumbLarge', 'thumbSmall', 'thumbSidebar', 'thumbMobile', 
    'thumbMobileSuggested', 'thumbTV', 'thumbSearch', 'thumbShorts'
];

const titleIds = [
    'titleLarge', 'titleSmall', 'titleSidebar', 'titleMobile',
    'titleMobileSuggested', 'titleTV', 'titleSearch', 'titleShorts'
];

const channelIds = [
    'channelLarge', 'channelSmall', 'channelSidebar', 'channelMobile',
    'channelMobileSuggested', 'channelTV', 'channelSearch'
];

const avatarIds = [
    'avatarLarge', 'avatarSmall', 'avatarMobile', 'avatarTV', 'avatarSearch'
];

// Variables globales
let currentImageSrc = '';
let currentChannelIconSrc = '';
const defaultTitle = 'Tu título aparecerá aquí';
const defaultChannel = 'Nombre del Canal';

// Claves para localStorage
const STORAGE_KEYS = {
    CHANNEL_ICON: 'yt_preview_channel_icon',
    CHANNEL_NAME: 'yt_preview_channel_name',
    VIDEO_TITLE: 'yt_preview_video_title',
    THUMBNAIL: 'yt_preview_thumbnail'
};

// Función para actualizar todas las miniaturas
function updateAllThumbnails(imageSrc) {
    currentImageSrc = imageSrc;
    thumbnailIds.forEach(id => {
        const img = document.getElementById(id);
        if (img) {
            img.src = imageSrc;
            img.style.display = imageSrc ? 'block' : 'none';
        }
    });
}

// Función para actualizar todos los títulos
function updateAllTitles(title) {
    const displayTitle = title.trim() || defaultTitle;
    titleIds.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = displayTitle;
        }
    });
}

// Función para actualizar todos los nombres de canal
function updateAllChannels(channel) {
    const displayChannel = channel.trim() || defaultChannel;
    channelIds.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = displayChannel;
        }
    });
}

// Función para actualizar todos los avatares del canal
function updateAllAvatars(iconSrc) {
    currentChannelIconSrc = iconSrc;
    avatarIds.forEach(id => {
        const avatarContainer = document.getElementById(id);
        if (avatarContainer) {
            const img = avatarContainer.querySelector('.avatar-img');
            if (img) {
                if (iconSrc) {
                    img.src = iconSrc;
                    img.classList.add('show');
                } else {
                    img.classList.remove('show');
                    img.src = '';
                }
            }
        }
    });
    
    // Guardar en localStorage
    if (iconSrc) {
        localStorage.setItem(STORAGE_KEYS.CHANNEL_ICON, iconSrc);
    } else {
        localStorage.removeItem(STORAGE_KEYS.CHANNEL_ICON);
    }
}

// Event Listener para subir imagen
thumbnailUpload.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        // Validar que sea una imagen
        if (!file.type.startsWith('image/')) {
            alert('Por favor, selecciona un archivo de imagen válido.');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            const imageSrc = e.target.result;
            
            // Mostrar preview en el panel de control
            previewUpload.innerHTML = `<img src="${imageSrc}" alt="Preview">`;
            
            // Actualizar todas las miniaturas
            updateAllThumbnails(imageSrc);
            
            // Guardar en localStorage
            localStorage.setItem(STORAGE_KEYS.THUMBNAIL, imageSrc);
        };
        
        reader.onerror = function() {
            alert('Error al leer el archivo. Por favor, intenta nuevamente.');
        };
        
        reader.readAsDataURL(file);
    } else {
        previewUpload.innerHTML = '<p>Ninguna imagen seleccionada</p>';
        updateAllThumbnails('');
        localStorage.removeItem(STORAGE_KEYS.THUMBNAIL);
    }
});

// Event Listener para subir icono del canal
channelIconUpload.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        // Validar que sea una imagen
        if (!file.type.startsWith('image/')) {
            alert('Por favor, selecciona un archivo de imagen válido.');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            const iconSrc = e.target.result;
            
            // Mostrar preview en el panel de control
            previewChannelIcon.innerHTML = `
                <img src="${iconSrc}" alt="Channel Icon Preview">
                <small>Icono guardado automáticamente</small>
            `;
            
            // Actualizar todos los avatares
            updateAllAvatars(iconSrc);
        };
        
        reader.onerror = function() {
            alert('Error al leer el archivo. Por favor, intenta nuevamente.');
        };
        
        reader.readAsDataURL(file);
    } else {
        previewChannelIcon.innerHTML = '<p>Ningún icono seleccionado</p><small>El icono se guardará automáticamente</small>';
        updateAllAvatars('');
    }
});

// Event Listener para el título
videoTitleInput.addEventListener('input', function(event) {
    const title = event.target.value;
    titleCount.textContent = title.length;
    updateAllTitles(title);
    
    // Guardar en localStorage
    if (title.trim()) {
        localStorage.setItem(STORAGE_KEYS.VIDEO_TITLE, title);
    } else {
        localStorage.removeItem(STORAGE_KEYS.VIDEO_TITLE);
    }
});

// Event Listener para el nombre del canal
channelNameInput.addEventListener('input', function(event) {
    const channel = event.target.value;
    channelCount.textContent = channel.length;
    updateAllChannels(channel);
    
    // Guardar en localStorage
    if (channel.trim()) {
        localStorage.setItem(STORAGE_KEYS.CHANNEL_NAME, channel);
    } else {
        localStorage.removeItem(STORAGE_KEYS.CHANNEL_NAME);
    }
});

// Función para cargar datos desde localStorage
function loadFromLocalStorage() {
    // Cargar icono del canal
    const savedIcon = localStorage.getItem(STORAGE_KEYS.CHANNEL_ICON);
    if (savedIcon) {
        updateAllAvatars(savedIcon);
        previewChannelIcon.innerHTML = `
            <img src="${savedIcon}" alt="Channel Icon Preview">
            <small>Icono guardado automáticamente</small>
        `;
    }
    
    // Cargar nombre del canal
    const savedChannelName = localStorage.getItem(STORAGE_KEYS.CHANNEL_NAME);
    if (savedChannelName) {
        channelNameInput.value = savedChannelName;
        updateAllChannels(savedChannelName);
        channelCount.textContent = savedChannelName.length;
    }
    
    // Cargar título del video
    const savedTitle = localStorage.getItem(STORAGE_KEYS.VIDEO_TITLE);
    if (savedTitle) {
        videoTitleInput.value = savedTitle;
        updateAllTitles(savedTitle);
        titleCount.textContent = savedTitle.length;
    }
    
    // Cargar miniatura
    const savedThumbnail = localStorage.getItem(STORAGE_KEYS.THUMBNAIL);
    if (savedThumbnail) {
        updateAllThumbnails(savedThumbnail);
        previewUpload.innerHTML = `<img src="${savedThumbnail}" alt="Preview">`;
    }
}

// Modal functionality
const previewModal = document.getElementById('previewModal');
const modalClose = document.getElementById('modalClose');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');

// Función para abrir el modal con un preview
function openModal(previewCard) {
    const previewTitle = previewCard.querySelector('.preview-title').textContent;
    const previewWrapper = previewCard.querySelector('.preview-wrapper');
    
    // Copiar el contenido del preview
    modalTitle.textContent = previewTitle;
    modalBody.innerHTML = '';
    
    // Clonar el preview wrapper y su contenido
    const clonedWrapper = previewWrapper.cloneNode(true);
    clonedWrapper.style.width = '100%';
    clonedWrapper.style.maxWidth = '100%';
    
    modalBody.appendChild(clonedWrapper);
    
    // Mostrar el modal
    previewModal.classList.add('show');
    document.body.style.overflow = 'hidden'; // Prevenir scroll del body
}

// Función para cerrar el modal
function closeModal() {
    previewModal.classList.remove('show');
    document.body.style.overflow = ''; // Restaurar scroll del body
}

// Event listeners para el modal
if (modalClose) {
    modalClose.addEventListener('click', closeModal);
}

// Cerrar modal al hacer clic fuera
if (previewModal) {
    previewModal.addEventListener('click', function(e) {
        if (e.target === previewModal) {
            closeModal();
        }
    });
}

// Cerrar modal con la tecla Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && previewModal.classList.contains('show')) {
        closeModal();
    }
});

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    // Cargar datos guardados desde localStorage
    loadFromLocalStorage();
    
    // Inicializar contadores de caracteres si no hay valores guardados
    if (!localStorage.getItem(STORAGE_KEYS.VIDEO_TITLE)) {
        titleCount.textContent = videoTitleInput.value.length;
    }
    if (!localStorage.getItem(STORAGE_KEYS.CHANNEL_NAME)) {
        channelCount.textContent = channelNameInput.value.length;
        updateAllChannels(defaultChannel);
    }
    
    // Configurar valores por defecto si no hay guardados
    if (!localStorage.getItem(STORAGE_KEYS.VIDEO_TITLE)) {
        updateAllTitles(defaultTitle);
    }
    
    // Permitir arrastrar y soltar imágenes
    setupDragAndDrop();
    setupDragAndDropChannelIcon();
    
    // Configurar clics en preview cards para abrir modal
    setupPreviewCardClicks();
});

// Función para configurar clics en las preview cards
function setupPreviewCardClicks() {
    const previewCards = document.querySelectorAll('.preview-card');
    previewCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // No abrir modal si se hace clic en inputs o botones dentro de la card
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON' || e.target.closest('input') || e.target.closest('button')) {
                return;
            }
            openModal(card);
        });
    });
}

// Función para configurar drag and drop
function setupDragAndDrop() {
    const dropZone = previewUpload;
    
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, unhighlight, false);
    });

    dropZone.addEventListener('drop', handleDrop, false);
}

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function highlight(e) {
    previewUpload.style.borderColor = '#ff0000';
    previewUpload.style.backgroundColor = '#1a1a1a';
}

function unhighlight(e) {
    previewUpload.style.borderColor = '';
    previewUpload.style.backgroundColor = '';
}

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;

    if (files.length > 0) {
        const file = files[0];
        if (file.type.startsWith('image/')) {
            // Actualizar el input file
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            thumbnailUpload.files = dataTransfer.files;
            
            // Disparar el evento change
            const event = new Event('change', { bubbles: true });
            thumbnailUpload.dispatchEvent(event);
        } else {
            alert('Por favor, arrastra un archivo de imagen válido.');
        }
    }
}

// Función para configurar drag and drop del icono del canal
function setupDragAndDropChannelIcon() {
    const dropZone = previewChannelIcon;
    
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, function(e) {
            previewChannelIcon.style.borderColor = '#ff0000';
            previewChannelIcon.style.backgroundColor = '#1a1a1a';
        }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, function(e) {
            previewChannelIcon.style.borderColor = '';
            previewChannelIcon.style.backgroundColor = '';
        }, false);
    });

    dropZone.addEventListener('drop', function(e) {
        const dt = e.dataTransfer;
        const files = dt.files;

        if (files.length > 0) {
            const file = files[0];
            if (file.type.startsWith('image/')) {
                // Actualizar el input file
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                channelIconUpload.files = dataTransfer.files;
                
                // Disparar el evento change
                const event = new Event('change', { bubbles: true });
                channelIconUpload.dispatchEvent(event);
            } else {
                alert('Por favor, arrastra un archivo de imagen válido.');
            }
        }
    }, false);
}

// Función para manejar errores de carga de imágenes
document.addEventListener('error', function(e) {
    if (e.target.tagName === 'IMG' && e.target.classList.contains('thumbnail-img')) {
        e.target.style.display = 'none';
        const wrapper = e.target.closest('.thumbnail-wrapper');
        if (wrapper) {
            wrapper.style.backgroundColor = '#212121';
            wrapper.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #717171;">Error al cargar imagen</div>';
        }
    }
}, true);


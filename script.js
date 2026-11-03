/**
 * OMNICARD - Gafete Digital con QR de Contacto Nativo Directo
 * Brand: OmniFlow • Oscar Ramírez
 */

document.addEventListener('DOMContentLoaded', () => {
  // Contact Profile Data
  const profileData = {
    firstName: 'Oscar',
    lastName: 'Ramírez',
    fullName: 'Oscar Ramírez',
    company: 'OmniFlow',
    title: 'Fundador & Director',
    phone: '+524448016798',
    phoneFormatted: '444 801 6798',
    email: 'oscaruli184@gmail.com',
    city: 'San Luis Potosí',
    state: 'San Luis Potosí',
    country: 'México',
    clabe: '012180015536104975',
    facebook: 'https://www.facebook.com/omniflowautomatizacion',
    servicesNote: 'OmniFlow • Software a la medida, Bots de WhatsApp, Presencia en Redes y Tarjetas Digitales.'
  };

  // Raw vCard 3.0 string encoded specifically for mobile camera readers (iOS Camera & Android Google Lens)
  const vcardPayload = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${profileData.lastName};${profileData.firstName};;;`,
    `FN:${profileData.fullName}`,
    `ORG:${profileData.company}`,
    `TITLE:${profileData.title}`,
    `TEL;TYPE=CELL,VOICE,PREF:${profileData.phone}`,
    `EMAIL;TYPE=INTERNET,WORK,PREF:${profileData.email}`,
    `URL:${profileData.facebook}`,
    `ADR;TYPE=WORK:;;${profileData.city};${profileData.state};;${profileData.country}`,
    `NOTE:${profileData.servicesNote}`,
    'END:VCARD'
  ].join('\r\n');

  // DOM Elements
  const heroQrContainer = document.getElementById('hero-qr-container');
  const btnGafeteVcf = document.getElementById('btn-gafete-vcf');
  const btnDownloadQrImg = document.getElementById('btn-download-qr-img');
  const btnCopyClabe = document.getElementById('btn-copy-clabe');
  const toast = document.getElementById('toast-notify');
  const toastText = document.getElementById('toast-text');

  // View Switcher Elements
  const tabGafete = document.getElementById('tab-gafete');
  const tabServicios = document.getElementById('tab-servicios');
  const viewGafete = document.getElementById('view-gafete');
  const viewServicios = document.getElementById('view-servicios');
  const btnSeeServicesLink = document.getElementById('btn-see-services-link');
  const btnBackToGafete = document.getElementById('btn-back-to-gafete');

  let toastTimeout = null;
  let generatedQrImgUrl = '';

  /**
   * Display Toast Notification
   */
  function showToast(message, duration = 3000) {
    if (toastTimeout) clearTimeout(toastTimeout);
    toastText.textContent = message;
    toast.classList.add('show');
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  }

  /**
   * Render Native Contact vCard QR Code
   * Encodes the raw vCard payload so smartphone cameras immediately prompt to save contact
   */
  function renderHeroQRCode() {
    if (!heroQrContainer) return;

    const encodedVCard = encodeURIComponent(vcardPayload);
    // 400x400 high-res QR with dark elements and clean margin
    generatedQrImgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodedVCard}&margin=10&color=090e18&bgcolor=ffffff`;

    const img = new Image();
    img.src = generatedQrImgUrl;
    img.alt = 'QR Contacto Nativo Oscar Ramírez - OmniFlow';
    img.loading = 'eager';
    
    img.onload = () => {
      heroQrContainer.innerHTML = '';
      heroQrContainer.appendChild(img);
    };

    img.onerror = () => {
      heroQrContainer.innerHTML = '<p style="color: #0b0f19; font-size: 0.8rem; padding: 10px;">Escanea con tu cámara</p>';
    };
  }

  // Render on startup
  renderHeroQRCode();

  /**
   * Download .vcf File Directly
   */
  function downloadVCard() {
    const blob = new Blob([vcardPayload], { type: 'text/vcard;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.setAttribute('download', `${profileData.firstName}_${profileData.lastName}_OmniFlow.vcf`);
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    showToast('¡Contacto descargado! Ábrelo para guardar en tu agenda.');
  }

  if (btnGafeteVcf) btnGafeteVcf.addEventListener('click', downloadVCard);

  /**
   * Download QR Code Image as PNG (Ideal for Lock Screen / Photos)
   */
  if (btnDownloadQrImg) {
    btnDownloadQrImg.addEventListener('click', async () => {
      showToast('Preparando descarga de tu imagen QR...');
      try {
        const response = await fetch(generatedQrImgUrl);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `QR_Contacto_${profileData.firstName}_${profileData.lastName}_OmniFlow.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 2000);
        showToast('¡Imagen QR descargada! Puedes usarla como fondo de pantalla.');
      } catch (e) {
        // Fallback: open in new tab
        window.open(generatedQrImgUrl, '_blank');
        showToast('Mantén presionada la imagen para guardarla en tus fotos.');
      }
    });
  }

  /**
   * Switch between Views (Gafete QR vs Servicios Completos)
   */
  function switchToView(viewName) {
    if (viewName === 'servicios') {
      tabGafete.classList.remove('active');
      tabServicios.classList.add('active');
      viewGafete.classList.remove('active-view');
      viewServicios.classList.add('active-view');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      tabServicios.classList.remove('active');
      tabGafete.classList.add('active');
      viewServicios.classList.remove('active-view');
      viewGafete.classList.add('active-view');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  if (tabGafete) tabGafete.addEventListener('click', () => switchToView('gafete'));
  if (tabServicios) tabServicios.addEventListener('click', () => switchToView('servicios'));
  if (btnSeeServicesLink) btnSeeServicesLink.addEventListener('click', () => switchToView('servicios'));
  if (btnBackToGafete) btnBackToGafete.addEventListener('click', () => switchToView('gafete'));

  /**
   * Copy Bank CLABE to Clipboard
   */
  if (btnCopyClabe) {
    btnCopyClabe.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(profileData.clabe);
        btnCopyClabe.classList.add('copied');
        const copyLabel = btnCopyClabe.querySelector('.copy-label');
        if (copyLabel) copyLabel.textContent = '¡Copiado!';

        showToast('CLABE BBVA copiada al portapapeles');

        setTimeout(() => {
          btnCopyClabe.classList.remove('copied');
          if (copyLabel) copyLabel.textContent = 'Copiar';
        }, 2500);
      } catch (err) {
        showToast('CLABE BBVA: ' + profileData.clabe);
      }
    });
  }

  // Haptic Feedback for Mobile Devices
  const buttons = document.querySelectorAll('.gafete-action-btn, .view-tab-btn, .action-card');
  buttons.forEach(btn => {
    btn.addEventListener('touchstart', () => {
      if ('vibrate' in navigator) navigator.vibrate(10);
    }, { passive: true });
  });
});

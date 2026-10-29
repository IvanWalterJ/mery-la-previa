/**
 * MERY LA PREVIA — VIP CLUB ACCESS PASS (pase.js)
 * Standalone VIP Access Pass logic, offline QR generation, proof upload, and PNG export.
 */

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const targetId = (params.get('id') || params.get('reserva') || '').trim();

  // Elements
  const passCode = document.getElementById('passCode');
  const passStatusBadge = document.getElementById('passStatusBadge');
  const passName = document.getElementById('passName');
  const passType = document.getElementById('passType');
  const passGuests = document.getElementById('passGuests');
  const passDateTime = document.getElementById('passDateTime');
  const passBirthdayRow = document.getElementById('passBirthdayRow');
  const passDni = document.getElementById('passDni');
  const passBirthDate = document.getElementById('passBirthDate');

  const passDepositSection = document.getElementById('passDepositSection');
  const passDepositAmount = document.getElementById('passDepositAmount');
  const passDepositAlias = document.getElementById('passDepositAlias');
  const passDepositCbu = document.getElementById('passDepositCbu');
  const passDepositHolder = document.getElementById('passDepositHolder');
  const passPaymentLink = document.getElementById('passPaymentLink');

  const btnUploadProof = document.getElementById('btnUploadProof');
  const passProofFileInput = document.getElementById('passProofFileInput');
  const passProofPreviewWrap = document.getElementById('passProofPreviewWrap');
  const passProofPreviewImg = document.getElementById('passProofPreviewImg');
  const passProofStatusMsg = document.getElementById('passProofStatusMsg');

  const btnDownloadPassPng = document.getElementById('btnDownloadPassPng');
  const btnSharePassWhatsapp = document.getElementById('btnSharePassWhatsapp');
  const passToast = document.getElementById('passToast');

  let activeReservation = null;

  function showToast(msg) {
    if (!passToast) return;
    passToast.textContent = msg;
    passToast.hidden = false;
    setTimeout(() => {
      passToast.hidden = true;
    }, 2800);
  }

  // Find target reservation or fallback to first
  function loadReservation() {
    if (!window.MeryStore) return null;
    const reservations = window.MeryStore.getReservations();
    if (!reservations || reservations.length === 0) return null;

    if (targetId) {
      const match = reservations.find((r) => r.id.toLowerCase() === targetId.toLowerCase());
      if (match) return match;
    }

    // If no targetId or not found, display first reservation as fallback
    return reservations[0];
  }

  function renderReservationData(res) {
    if (!res) return;
    activeReservation = res;

    // Header & code
    if (passCode) passCode.textContent = res.id;
    if (passName) passName.textContent = res.customer_name || 'Invitado VIP';
    if (passType) passType.textContent = res.res_type || 'Mesa Cena + Previa';
    if (passGuests) passGuests.textContent = `${res.guests || 2} ${res.guests === 1 ? 'persona' : 'personas'}`;
    if (passDateTime) passDateTime.textContent = `${res.res_day} • ${res.res_time}`;

    // Birthday Info
    if (passBirthdayRow) {
      if (res.is_birthday && (res.birthday_dni || res.birthday_date)) {
        passBirthdayRow.hidden = false;
        if (passDni) passDni.textContent = res.birthday_dni || '-';
        if (passBirthDate) passBirthDate.textContent = res.birthday_date || '-';
      } else {
        passBirthdayRow.hidden = true;
      }
    }

    // Status Badge
    if (passStatusBadge) {
      if (res.deposit_mode === 'sin_sena') {
        passStatusBadge.className = 'pass-badge pass-badge-simple';
        passStatusBadge.textContent = 'Reserva simple';
      } else if (res.deposit_status === 'confirmada') {
        passStatusBadge.className = 'pass-badge pass-badge-confirmed';
        passStatusBadge.textContent = 'Lugar asegurado • Seña confirmada ✓';
      } else if (res.deposit_status === 'comprobante_subido') {
        passStatusBadge.className = 'pass-badge pass-badge-review';
        passStatusBadge.textContent = 'Comprobante en revisión';
      } else {
        passStatusBadge.className = 'pass-badge pass-badge-pending';
        passStatusBadge.textContent = 'Pendiente de comprobante de seña';
      }
    }

    // Deposit Details
    const settings = window.MeryStore ? window.MeryStore.getReservationSettings() : {};
    if (passDepositSection) {
      if (res.deposit_mode === 'sin_sena') {
        passDepositSection.hidden = true;
        passDepositSection.style.display = 'none';
      } else {
        passDepositSection.hidden = false;
        passDepositSection.style.display = 'flex';

        if (passDepositAmount) passDepositAmount.textContent = settings.depositAmount || '$15.000';
        if (passDepositAlias) passDepositAlias.textContent = settings.depositAlias || 'MERY.LAPREVIA.MP';
        if (passDepositCbu) passDepositCbu.textContent = settings.depositCbu || '0000003100098765432100';
        if (passDepositHolder) passDepositHolder.textContent = settings.depositHolder || 'Mery La Previa S.R.L.';
        if (passPaymentLink && settings.depositPaymentLink) {
          passPaymentLink.href = settings.depositPaymentLink;
        }
      }
    }

    // FIX EMPTY PROOF BUG: strictly hidden when !res.proof_url
    if (passProofPreviewWrap && passProofPreviewImg) {
      if (res.proof_url) {
        passProofPreviewWrap.hidden = false;
        passProofPreviewWrap.style.display = 'flex';
        passProofPreviewImg.src = res.proof_url;
        if (passProofStatusMsg) {
          passProofStatusMsg.textContent = (res.deposit_status === 'confirmada')
            ? '✓ Seña confirmada por el equipo de Mery'
            : '✓ Comprobante recibido — Ya notificamos al equipo';
        }
      } else {
        passProofPreviewWrap.hidden = true;
        passProofPreviewWrap.style.display = 'none';
        passProofPreviewImg.src = '';
      }
    }

    // Scannable Access QR Code
    const origin = window.location.origin || 'http://localhost:3000';
    const checkinUrl = `${origin}/admin?checkin=${encodeURIComponent(res.id)}`;
    if (window.MeryStore && typeof window.MeryStore.renderQrCode === 'function') {
      window.MeryStore.renderQrCode('passQrCanvas', checkinUrl, {
        size: 220,
        colorDark: '#0d0e0d',
        colorLight: '#ffffff',
        margin: 1
      });
    }
  }

  // Initial load
  const initialRes = loadReservation();
  if (initialRes) {
    renderReservationData(initialRes);
  }

  // Real-time updates subscription
  if (window.MeryStore && typeof window.MeryStore.subscribeToReservationChanges === 'function') {
    window.MeryStore.subscribeToReservationChanges((event) => {
      if (event && event.reservation && activeReservation && event.reservation.id === activeReservation.id) {
        renderReservationData(event.reservation);
        if (event.action === 'deposit_approved') {
          showToast('🎉 ¡Tu seña acaba de ser confirmada por el equipo!');
        }
      }
    });
  }

  // Copy buttons
  document.querySelectorAll('.vip-btn-copy').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetIdAttr = btn.getAttribute('data-copy-target');
      const targetEl = targetIdAttr ? document.getElementById(targetIdAttr) : null;
      if (targetEl && targetEl.textContent) {
        navigator.clipboard.writeText(targetEl.textContent.trim()).then(() => {
          const original = btn.textContent;
          btn.textContent = '✓ Copiado';
          setTimeout(() => { btn.textContent = original; }, 1800);
        }).catch(() => {});
      }
    });
  });

  // Proof File Upload Handler
  if (btnUploadProof && passProofFileInput) {
    btnUploadProof.addEventListener('click', () => {
      passProofFileInput.click();
    });

    passProofFileInput.addEventListener('change', async (e) => {
      const file = e.target.files?.[0];
      if (!file || !activeReservation) return;

      const originalText = btnUploadProof.textContent;
      btnUploadProof.disabled = true;
      btnUploadProof.textContent = 'Optimizando comprobante...';

      try {
        if (window.MeryStore && typeof window.MeryStore.uploadDepositProof === 'function') {
          const updated = await window.MeryStore.uploadDepositProof(activeReservation.id, file);
          activeReservation = updated;
          renderReservationData(updated);
          showToast('✓ Comprobante enviado con éxito');
        }
      } catch (err) {
        alert('Error al subir el comprobante: ' + (err.message || err));
      } finally {
        btnUploadProof.disabled = false;
        btnUploadProof.textContent = originalText;
        passProofFileInput.value = '';
      }
    });
  }

  // Share on WhatsApp
  if (btnSharePassWhatsapp) {
    btnSharePassWhatsapp.addEventListener('click', () => {
      if (!activeReservation) return;
      const origin = window.location.origin || 'http://localhost:3000';
      const passUrl = `${origin}/pase.html?id=${encodeURIComponent(activeReservation.id)}`;
      const msg = `¡Ya tengo mi Pase de Acceso VIP para Mery La Previa!\n` +
        `Código: ${activeReservation.id}\n` +
        `Sector: ${activeReservation.res_type} (${activeReservation.guests} personas)\n` +
        `Fecha: ${activeReservation.res_day} • ${activeReservation.res_time}\n` +
        `Ver Pase QR y detalles: ${passUrl}`;
      window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
    });
  }

  // PNG High-Definition Download
  if (btnDownloadPassPng) {
    btnDownloadPassPng.addEventListener('click', () => {
      if (!activeReservation) return;
      const qrCanvas = document.getElementById('passQrCanvas');

      // Create high-resolution canvas (700 x 960)
      const canvas = document.createElement('canvas');
      canvas.width = 700;
      canvas.height = 960;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Helper for rounded rectangle clipping / stroke
      function drawRoundedRect(c, x, y, width, height, radius) {
        c.beginPath();
        c.moveTo(x + radius, y);
        c.lineTo(x + width - radius, y);
        c.quadraticCurveTo(x + width, y, x + width, y + radius);
        c.lineTo(x + width, y + height - radius);
        c.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        c.lineTo(x + radius, y + height);
        c.quadraticCurveTo(x, y + height, x, y + height - radius);
        c.lineTo(x, y + radius);
        c.quadraticCurveTo(x, y, x + radius, y);
        c.closePath();
      }

      // Outer page background fill
      ctx.fillStyle = '#0a0b0a';
      ctx.fillRect(0, 0, 700, 960);

      // Save before card clip
      ctx.save();
      const cardX = 24;
      const cardY = 24;
      const cardW = 652;
      const cardH = 912;
      const cardRadius = 20;

      drawRoundedRect(ctx, cardX, cardY, cardW, cardH, cardRadius);
      ctx.clip();

      // Card gradient background
      const grad = ctx.createLinearGradient(cardX, cardY, cardX, cardY + cardH);
      grad.addColorStop(0, '#171917');
      grad.addColorStop(0.5, '#121412');
      grad.addColorStop(1, '#0c0e0c');
      ctx.fillStyle = grad;
      ctx.fillRect(cardX, cardY, cardW, cardH);

      // Top Monogram icon & Header
      ctx.fillStyle = 'rgba(212, 175, 55, 0.12)';
      drawRoundedRect(ctx, 55, 50, 48, 48, 12);
      ctx.fill();
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = '#d4af37';
      ctx.font = 'bold 26px serif';
      ctx.textAlign = 'center';
      ctx.fillText('M', 79, 84);

      ctx.textAlign = 'left';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillStyle = '#d4af37';
      ctx.fillText('WINE BAR & NIGHTCLUB', 118, 68);

      ctx.font = '400 24px serif';
      ctx.fillStyle = '#f7f4ed';
      ctx.fillText('Mery La Previa', 118, 94);

      // Status Pill on top right
      let badgeText = 'RESERVA SIMPLE';
      let badgeColor = '#a6a49c';
      let badgeBg = 'rgba(255, 255, 255, 0.08)';

      if (activeReservation.deposit_mode === 'con_sena') {
        if (activeReservation.deposit_status === 'confirmada') {
          badgeText = 'LUGAR ASEGURADO ✓';
          badgeColor = '#2ecc71';
          badgeBg = 'rgba(46, 204, 113, 0.16)';
        } else if (activeReservation.deposit_status === 'comprobante_subido') {
          badgeText = 'COMPROBANTE EN REVISIÓN';
          badgeColor = '#3498db';
          badgeBg = 'rgba(52, 152, 219, 0.16)';
        } else {
          badgeText = 'SEÑA PENDIENTE';
          badgeColor = '#d4af37';
          badgeBg = 'rgba(212, 175, 55, 0.16)';
        }
      }

      ctx.font = 'bold 11px sans-serif';
      const badgeWidth = ctx.measureText(badgeText).width + 24;
      const badgeX = 645 - badgeWidth;
      ctx.fillStyle = badgeBg;
      drawRoundedRect(ctx, badgeX, 62, badgeWidth, 26, 13);
      ctx.fill();
      ctx.fillStyle = badgeColor;
      ctx.fillText(badgeText, badgeX + 12, 79);

      // Code strip
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.fillRect(cardX, 120, cardW, 64);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
      ctx.strokeRect(cardX, 120, cardW, 64);

      ctx.fillStyle = '#d4af37';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText('◆  PASE DE ACCESO VIP', 55, 157);

      ctx.textAlign = 'right';
      ctx.font = '10px sans-serif';
      ctx.fillStyle = '#a6a49c';
      ctx.fillText('CÓDIGO DE RESERVA', 490, 157);

      ctx.font = 'bold 24px monospace';
      ctx.fillStyle = '#d4af37';
      ctx.fillText(activeReservation.id, 645, 160);
      ctx.textAlign = 'left';

      // Reservation details
      const col1 = 55;
      const col2 = 360;

      ctx.font = '11px sans-serif';
      ctx.fillStyle = '#a6a49c';
      ctx.fillText('TITULAR DE LA RESERVA', col1, 222);
      ctx.font = 'bold 18px sans-serif';
      ctx.fillStyle = '#f7f4ed';
      ctx.fillText(activeReservation.customer_name || 'Invitado VIP', col1, 246);

      ctx.font = '11px sans-serif';
      ctx.fillStyle = '#a6a49c';
      ctx.fillText('SECTOR / EXPERIENCIA', col2, 222);
      ctx.font = 'bold 18px sans-serif';
      ctx.fillStyle = '#f7f4ed';
      ctx.fillText(activeReservation.res_type || 'Mesa Cena + Previa', col2, 246);

      ctx.font = '11px sans-serif';
      ctx.fillStyle = '#a6a49c';
      ctx.fillText('MESA PARA', col1, 292);
      ctx.font = 'bold 18px sans-serif';
      ctx.fillStyle = '#f7f4ed';
      ctx.fillText(`${activeReservation.guests} personas`, col1, 316);

      ctx.font = '11px sans-serif';
      ctx.fillStyle = '#a6a49c';
      ctx.fillText('FECHA Y HORARIO', col2, 292);
      ctx.font = 'bold 18px sans-serif';
      ctx.fillStyle = '#f7f4ed';
      ctx.fillText(`${activeReservation.res_day} • ${activeReservation.res_time}`, col2, 316);

      let nextY = 360;
      if (activeReservation.is_birthday && (activeReservation.birthday_dni || activeReservation.birthday_date)) {
        ctx.fillStyle = 'rgba(212, 175, 55, 0.08)';
        drawRoundedRect(ctx, col1, 345, cardW - 62, 42, 8);
        ctx.fill();
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
        ctx.stroke();

        ctx.font = 'bold 13px sans-serif';
        ctx.fillStyle = '#d4af37';
        ctx.fillText(`🎂 Cumpleaños VIP — DNI: ${activeReservation.birthday_dni || '-'} (Brindis y beneficios habilitados)`, col1 + 14, 371);
        nextY = 415;
      }

      // Divider line
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(55, nextY);
      ctx.lineTo(645, nextY);
      ctx.stroke();

      // Scannable QR Code centered
      if (qrCanvas) {
        const qrSize = 250;
        const qrX = (700 - qrSize) / 2;
        const qrY = nextY + 30;

        ctx.fillStyle = '#ffffff';
        drawRoundedRect(ctx, qrX - 12, qrY - 12, qrSize + 24, qrSize + 24, 14);
        ctx.fill();
        ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);

        // Access instructions
        ctx.textAlign = 'center';
        ctx.font = '14px sans-serif';
        ctx.fillStyle = '#f7f4ed';
        ctx.fillText('Presentá este código QR en la recepción al llegar para ingresar sin fila', 350, qrY + qrSize + 48);

        ctx.font = 'bold 12px sans-serif';
        ctx.fillStyle = '#d4af37';
        ctx.fillText('ACCESO NOCTURNO EXCLUSIVO • CABINA 13:11 • LONGCHAMPS', 350, qrY + qrSize + 76);
      }

      ctx.restore();

      // Draw subtle rounded gold border on outer edge
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 1.8;
      drawRoundedRect(ctx, cardX, cardY, cardW, cardH, cardRadius);
      ctx.stroke();

      // Trigger high-res PNG download
      const link = document.createElement('a');
      link.download = `pase-mery-${activeReservation.id}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  }
});

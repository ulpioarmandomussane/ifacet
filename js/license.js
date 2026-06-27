
const SITE_EXPIRY_DATE = '2027-10-10';

// Mensagem mostrada quando o prazo expira (pode ser personalizada)
const SITE_EXPIRY_MESSAGE = {
  title: 'Serviço temporariamente indisponível',
  body: 'Este site precisa de atualização. Por favor contacte o responsável pela manutenção para mais informações.',
};

(function checkSiteValidity() {
  const today = new Date();
  const expiry = new Date(SITE_EXPIRY_DATE + 'T23:59:59');

  if (today > expiry) {
    document.documentElement.classList.add('site-expired');

    document.addEventListener('DOMContentLoaded', () => {
      document.body.innerHTML = '';
      document.body.style.cssText = `
        margin:0; min-height:100vh; display:flex; align-items:center;
        justify-content:center; padding:32px; text-align:center;
        background:#0B2545; font-family: Arial, Helvetica, sans-serif;
      `;
      const wrap = document.createElement('div');
      wrap.style.cssText = 'max-width:480px;';
      wrap.innerHTML = `
        <div style="width:64px;height:64px;border-radius:50%;background:rgba(201,162,75,0.15);
          display:flex;align-items:center;justify-content:center;margin:0 auto 24px;">
          <div style="width:24px;height:24px;border:3px solid #C9A24B;border-top-color:transparent;
            border-radius:50%;"></div>
        </div>
        <h1 style="color:#fff;font-size:1.4rem;margin:0 0 12px;font-weight:700;"></h1>
        <p style="color:rgba(255,255,255,0.7);font-size:0.95rem;line-height:1.6;margin:0;"></p>
      `;
      wrap.querySelector('h1').textContent = SITE_EXPIRY_MESSAGE.title;
      wrap.querySelector('p').textContent = SITE_EXPIRY_MESSAGE.body;
      document.body.appendChild(wrap);
    });
  }
})();

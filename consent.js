/* Cookie consent + Google Analytics (GDPR / ePrivacy compliant)
   GA loads ONLY after the user explicitly accepts. Nothing is sent on reject. */
(function () {
  var GA_ID = 'G-BP03DXLEGM';
  var KEY = 'cookie_consent_v1';

  function loadGA() {
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_ID, { anonymize_ip: true });
  }

  function setChoice(v) {
    try { localStorage.setItem(KEY, v); } catch (e) {}
  }
  function getChoice() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }

  function injectStyles() {
    var css = ''
      + '#cookie-banner{position:fixed;left:0;right:0;bottom:0;z-index:99999;'
      + 'background:#1E293B;color:#fff;border-top:2px solid #A8895A;'
      + 'padding:20px 5vw;display:flex;align-items:center;justify-content:space-between;'
      + 'gap:20px;flex-wrap:wrap;font-family:\'Raleway\',sans-serif;'
      + 'box-shadow:0 -4px 24px rgba(0,0,0,0.25);'
      + 'transform:translateY(110%);transition:transform .45s cubic-bezier(.4,0,.2,1);}'
      + '#cookie-banner.show{transform:translateY(0);}'
      + '#cookie-banner .cb-text{font-size:12.5px;line-height:1.7;color:rgba(255,255,255,0.8);max-width:780px;flex:1;min-width:260px;}'
      + '#cookie-banner .cb-text a{color:#C4A97A;text-decoration:underline;}'
      + '#cookie-banner .cb-actions{display:flex;gap:10px;flex-wrap:wrap;}'
      + '#cookie-banner button{font-family:\'Raleway\',sans-serif;font-size:10px;letter-spacing:1.5px;'
      + 'text-transform:uppercase;font-weight:600;padding:11px 22px;border:none;cursor:pointer;transition:all .2s;}'
      + '#cookie-banner .cb-accept{background:#A8895A;color:#fff;}'
      + '#cookie-banner .cb-accept:hover{background:#C4A97A;}'
      + '#cookie-banner .cb-reject{background:transparent;color:#fff;border:1.5px solid rgba(255,255,255,0.3);}'
      + '#cookie-banner .cb-reject:hover{border-color:#A8895A;color:#C4A97A;}'
      + '@media(max-width:600px){#cookie-banner .cb-actions{width:100%;}#cookie-banner button{flex:1;}}';
    var st = document.createElement('style');
    st.textContent = css;
    document.head.appendChild(st);
  }

  function showBanner() {
    injectStyles();
    var bar = document.createElement('div');
    bar.id = 'cookie-banner';
    bar.setAttribute('role', 'dialog');
    bar.setAttribute('aria-label', 'Συγκατάθεση cookies');
    bar.innerHTML =
      '<div class="cb-text">Χρησιμοποιούμε cookies ανάλυσης (Google Analytics) για να βελτιώνουμε '
      + 'την εμπειρία σας στον ιστότοπό μας. Τα cookies ενεργοποιούνται μόνο με τη συγκατάθεσή σας. '
      + 'Μπορείτε να αποδεχθείτε ή να απορρίψετε.</div>'
      + '<div class="cb-actions">'
      + '<button class="cb-reject" type="button">Απόρριψη</button>'
      + '<button class="cb-accept" type="button">Αποδοχή</button>'
      + '</div>';
    document.body.appendChild(bar);
    requestAnimationFrame(function () { bar.classList.add('show'); });

    bar.querySelector('.cb-accept').addEventListener('click', function () {
      setChoice('accepted');
      loadGA();
      hide(bar);
    });
    bar.querySelector('.cb-reject').addEventListener('click', function () {
      setChoice('rejected');
      hide(bar);
    });
  }

  function hide(bar) {
    bar.classList.remove('show');
    setTimeout(function () { if (bar.parentNode) bar.parentNode.removeChild(bar); }, 500);
  }

  var choice = getChoice();
  if (choice === 'accepted') {
    loadGA();
  } else if (choice === 'rejected') {
    /* do nothing */
  } else {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', showBanner);
    } else {
      showBanner();
    }
  }
})();

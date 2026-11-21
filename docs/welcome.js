/* AMG · Bienvenida por apertura. La autenticación real la valida Apps Script. */
(()=>{'use strict';
const gate=document.getElementById('welcomeGate'),start=document.getElementById('welcomeStart'),login=document.getElementById('welcomeLogin'),status=document.getElementById('welcomeAuthStatus'),demo=document.getElementById('welcomeDemo'),retry=document.getElementById('welcomeRetry'),target=document.getElementById('welcomeGoogleButton'),cfg=window.AMG_CONFIG||{};
if(!gate)return;
let entered=false,loginVisible=false,googleMounted=false;
const configured=()=>Boolean(cfg.googleClientId&&cfg.apiUrl);const canDemo=()=>cfg.allowDemo===true||new URLSearchParams(location.search).get('demo')==='1';
function protectBackground(value){document.querySelectorAll('body>aside,body>.shell').forEach(el=>{el.inert=value;if(value)el.setAttribute('aria-hidden','true');else el.removeAttribute('aria-hidden');});}
function show(){gate.classList.remove('onboarding-active');entered=false;loginVisible=false;document.body.classList.add('welcome-open');gate.hidden=false;start.hidden=false;login.hidden=true;protectBackground(true);document.getElementById('welcomeEnter').focus({preventScroll:true});}
function enter(){entered=true;document.body.classList.remove('welcome-open');gate.hidden=true;gate.classList.remove('onboarding-active');protectBackground(false);location.hash='inicio';document.getElementById('profile')?.focus({preventScroll:true});}
function initGoogle(){
 if(!loginVisible||entered)return;
 demo.hidden=configured()||!canDemo();retry.hidden=true;
 if(!configured()){status.textContent=canDemo()?'El acceso con Google estará disponible cuando activemos las cuentas. Mientras tanto, puedes explorar el borrador con datos de ejemplo.':'El acceso con Google está pendiente de activar. El administrador debe completar la configuración de AMG.';return;}
 if(!window.google?.accounts?.id){status.textContent='Cargando el acceso seguro de Google…';retry.hidden=false;return;}
 if(googleMounted)return;
 status.textContent='';
 try{window.google.accounts.id.initialize({client_id:cfg.googleClientId,auto_select:false,callback:response=>{status.textContent='Abriendo tu cuenta…';if(window.AMG_GOOGLE_SIGNIN)window.AMG_GOOGLE_SIGNIN(response);else{status.textContent='No se ha podido iniciar el acceso. Recarga la página.';retry.hidden=false;}}});
 window.google.accounts.id.renderButton(target,{theme:'outline',size:'large',type:'standard',shape:'pill',text:'continue_with',width:Math.min(320,Math.max(220,window.innerWidth-90))});googleMounted=true;
 }catch{status.textContent='No se ha podido cargar Google. Puedes volver a intentarlo.';retry.hidden=false;}
}
function openLogin(){loginVisible=true;start.hidden=true;login.hidden=false;initGoogle();document.getElementById('welcomeBack').focus({preventScroll:true});}
document.getElementById('welcomeEnter').addEventListener('click',openLogin);
document.getElementById('welcomeBack').addEventListener('click',()=>{loginVisible=false;start.hidden=false;login.hidden=true;document.getElementById('welcomeEnter').focus({preventScroll:true});});
demo.addEventListener('click',()=>{if(!configured()&&canDemo()){let complete=false;try{complete=localStorage.getItem('amg-onboarding-demo-complete')==='1';}catch{}if(complete&&new URLSearchParams(location.search).get('setup')!=='1')enter();else window.dispatchEvent(new CustomEvent('amg-first-access',{detail:{demo:true,setupRequired:true,name:'Manolo'}}));}});
retry.addEventListener('click',()=>{googleMounted=false;target.replaceChildren();initGoogle();});
window.addEventListener('amg-authenticated',enter);
window.addEventListener('amg-auth-error',()=>{status.textContent='No se ha podido abrir tu cuenta. Vuelve a intentarlo con Google.';retry.hidden=false;});
window.addEventListener('amg-signed-out',show);
window.addEventListener('load',initGoogle);
document.getElementById('googleIdentityScript')?.addEventListener('load',initGoogle);
document.getElementById('googleIdentityScript')?.addEventListener('error',()=>{if(loginVisible&&configured()){status.textContent='No se ha podido conectar con Google. Comprueba tu conexión y recarga la página.';retry.hidden=false;}});
if(window.AMG_WELCOME_EFFECTS?.logoFlash===false)gate.classList.add('no-logo-intro');
show();
})();

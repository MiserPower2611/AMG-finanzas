/* Sesión AMG por dispositivo. Los tokens de Google nunca se guardan aquí. */
(()=>{'use strict';
const KEY='amg-session-v8';let session='';
try{const saved=JSON.parse(localStorage.getItem(KEY)||'null');if(saved&&saved.expires>Date.now())session=saved.token;else localStorage.removeItem(KEY);}catch{}
function clear(){session='';try{localStorage.removeItem(KEY);}catch{}}
function accept(r){if(!r.sessionToken)return;session=r.sessionToken;try{localStorage.setItem(KEY,JSON.stringify({token:session,expires:r.sessionExpires}));}catch{/* Este navegador solo recordará la sesión hasta cerrar la página. */}}
window.AMG_SESSION={token:()=>session,clear,accept};
window.AMG_RESUME_SESSION=async()=>{if(!session)return false;try{const r=await window.AMG_CLOUD_REQUEST('load');window.AMG_USE_SESSION();if(r.state)window.AMG_FINISH_CLOUD(r);else window.dispatchEvent(new CustomEvent('amg-first-access',{detail:r}));return true;}catch(e){if(e.authRequired){clear();return false;}throw e;}};
})();

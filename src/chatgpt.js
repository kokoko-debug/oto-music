(()=>{
 const root=document.getElementById('oto-mock');
 let lastArea=null;
 // Leave an empty payload for older installed helpers: they cannot auto-send.
 const payload=document.createElement('textarea');payload.hidden=true;payload.setAttribute('data-oto-gpt-payload','');root.append(payload);
 const status=()=>{if(!lastArea)return;const node=lastArea.querySelector('[data-oto-gpt-status]');if(node)node.textContent=root.dataset.otoGptStatus||'';};
 new MutationObserver(status).observe(root,{attributes:true,attributeFilter:['data-oto-gpt-status']});
 root.otoOpenGPT=area=>{
  lastArea=area;payload.value='';root.dataset.otoGptAction='open';
  area.querySelector('.oto-gpt-message')?.remove();
  const box=document.createElement('section');box.className='oto-gpt-message oto-chat-only';
  if(root.dataset.otoGptBridge==='ready'&&root.dataset.otoGptBridgeVersion==='0.7.0'){
   box.innerHTML='<p class="oto-gpt-status" aria-live="polite" data-oto-gpt-status>ChatGPTを開いています…</p>';area.append(box);return;
  }
  box.classList.add('oto-dialog');box.innerHTML='<div class="oto-dialog-head"><h3>ChatGPTに質問する</h3><button type="button" class="oto-close cursor-interaction" data-gpt-close aria-label="案内を閉じる">×</button></div><p class="oto-gpt-setup">PCの補助拡張を0.7.0へ更新すると、右側にChatGPTを開けます。質問はご自身で入力してください。</p><a class="oto-secondary" href="https://chatgpt.com/" target="_blank" rel="noopener noreferrer">ChatGPTを開く</a>';
  box.querySelector('[data-gpt-close]').addEventListener('click',()=>box.remove());area.append(box);
 };
})();

(()=>{
 const root=document.getElementById('oto-mock');
 let lastArea=null;
 const payload=document.createElement('textarea');payload.hidden=true;payload.setAttribute('data-oto-gpt-payload','');root.append(payload);
 const status=()=>{if(!lastArea)return;const node=lastArea.querySelector('[data-oto-gpt-status]');if(node)node.textContent=root.dataset.otoGptStatus||'';};
 new MutationObserver(status).observe(root,{attributes:true,attributeFilter:['data-oto-gpt-status']});
 root.otoAskGPT=(prompt,area)=>{
  lastArea=area;payload.value=prompt;
  area.querySelector('.oto-gpt-message')?.remove();
  const box=document.createElement('section');box.className='oto-gpt-message oto-chat-only';
  if(root.dataset.otoGptBridge==='ready'){
   box.innerHTML='<p class="oto-gpt-status" aria-live="polite" data-oto-gpt-status>ChatGPTを開いています…</p>';area.append(box);return;
  }
  box.classList.add('oto-dialog');box.innerHTML='<div class="oto-dialog-head"><h3>自動質問の接続</h3><button type="button" class="oto-close cursor-interaction" data-gpt-close aria-label="接続案内を閉じる">×</button></div><p class="oto-gpt-setup">PCの補助拡張「おとのしくみ — ChatGPT質問」を一度読み込むと、このボタンだけでブラウザ版ChatGPTを開き、質問を入力して送信します。導入手順はチャットに記載しています。</p><details><summary class="cursor-interaction">送る質問文を確認</summary><textarea readonly aria-label="送る質問文"></textarea></details>';
  box.querySelector('textarea').value=prompt;box.querySelector('[data-gpt-close]').addEventListener('click',()=>box.remove());area.append(box);
 };
})();

(()=>{
 const root=document.getElementById('oto-mock');
 const app=root.querySelector('.oto-app'),area=app.querySelector('.oto-learning'),practice=app.querySelector('.oto-content'),bar=app.querySelector('.oto-modebar');
 const saved=globalThis.openai?.widgetState?.privateContent?.learning;
 const ui={mode:'basics',page:'interval',step:0,selected:null,checked:false,semi:4,degree:3,kind:'長',basicTopic:null,confirmed:{interval:[],chord:[]},chordRef:'C',chordFamily:'triads',chordTableRoot:'C',chordIdentity:null,referenceExample:'C',intervalPick:'table',chordPick:'table',chordKeys:[],chartStart:60,chartEnd:64,answers:{interval:{},chord:{}}};
 function restore(value){
  if(!value||typeof value!=='object')return;
  const allowed={mode:['basics','practice','chart'],page:['interval','chord','review']};
  for(const k of ['mode','page'])if(allowed[k].includes(value[k]))ui[k]=value[k];
  if(['interval','chord',null].includes(value.basicTopic))ui.basicTopic=value.basicTopic;
  const topic=(ui.basicTopic||ui.page)==='chord'?'chord':'interval',legacy=value.foundationVersion!==2;
  const limit=topic==='chord'?3:legacy?5:6;
  if(Number.isInteger(value.step)&&value.step>=0&&value.step<limit)ui.step=value.step+(legacy&&topic==='interval'?1:0);
  else ui.step=Math.min(ui.step,topic==='chord'?2:5);
  ui.selected=[0,1].includes(value.selected)?value.selected:null;ui.checked=ui.selected!==null&&value.checked===true;
  ui.answers={interval:{},chord:{}};
  if(value.answers&&typeof value.answers==='object')for(const t of ['interval','chord'])for(let step=0;step<(t==='chord'?3:legacy?5:6);step++){
   const answer=value.answers[t]?.[step],mapped=step+(legacy&&t==='interval'?1:0);
   if(answer&&[0,1].includes(answer.selected))ui.answers[t][mapped]={selected:answer.selected,checked:answer.checked===true};
  }
  // Older saves allowed a chord step up to 4; preserve the last valid lesson.
  if(topic==='chord'&&Number.isInteger(value.step)&&value.step>=3&&value.step<5)ui.step=2;
  if(ui.selected!==null&&!ui.answers[topic][ui.step])ui.answers[topic][ui.step]={selected:ui.selected,checked:ui.checked};
  if(/^(?:C|Cm|F|Fm|[A-G](?:b|#)?(?:maj7|7|m7|m7\(b5\)|dim7|m\(maj7\)|7\(#5\)))$/.test(value.chordRef))ui.chordRef=value.chordRef;
  if(['triads','sevenths'].includes(value.chordFamily))ui.chordFamily=value.chordFamily;
  if(['C','Db','D','Eb','E','F','F#','G','Ab','A','Bb','B'].includes(value.chordTableRoot))ui.chordTableRoot=value.chordTableRoot;
  if(typeof value.chordIdentity==='string'&&value.chordIdentity.length<24)ui.chordIdentity=value.chordIdentity;
  if(['C','F'].includes(value.referenceExample))ui.referenceExample=value.referenceExample;
  if(['table','keyboard'].includes(value.chordPick))ui.chordPick=value.chordPick;
  if(Array.isArray(value.chordKeys))ui.chordKeys=[...new Set(value.chordKeys.filter(n=>Number.isInteger(n)&&n>=60&&n<=84))].sort((a,b)=>a-b);
  if(['table','keyboard'].includes(value.intervalPick))ui.intervalPick=value.intervalPick;
  if(value.chartStart===null||Number.isInteger(value.chartStart)&&value.chartStart>=60&&value.chartStart<=72)ui.chartStart=value.chartStart;
  if(value.chartEnd===null||Number.isInteger(value.chartEnd)&&value.chartEnd>=60&&value.chartEnd<=72)ui.chartEnd=value.chartEnd;
  ui.confirmed={interval:[],chord:[]};
  if(value.confirmed&&typeof value.confirmed==='object')for(const t of ['interval','chord'])if(Array.isArray(value.confirmed[t]))ui.confirmed[t]=[...new Set(value.confirmed[t].filter(n=>Number.isInteger(n)&&n>=0&&n<(t==='chord'?3:legacy?5:6)).map(n=>n+(legacy&&t==='interval'?1:0)))];
  const valid=[[1,'完全',0],[2,'短',1],[2,'長',2],[3,'短',3],[3,'長',4],[4,'完全',5],[5,'完全',7],[6,'短',8],[6,'長',9],[7,'短',10],[7,'長',11],[8,'完全',12]];
  if(valid.some(([degree,kind,semi])=>degree===value.degree&&kind===value.kind&&semi===value.semi)){ui.degree=value.degree;ui.kind=value.kind;ui.semi=value.semi;}
 }
 restore(saved);
 const basics=[
  {label:'基準の音',title:'音程は、出発の音からの距離。',intro:'音程は<strong>ある音から、もうひとつの音までの距離</strong>です。まず出発の音を決めます。基準は、いつもドとは限りません。',visual:'origin',question:'ファ → ラの距離を調べるとき、基準の音は？',choices:['ファ','ド'],answer:0,feedback:'ファです。「ファからラまで」なので、ファを出発点にして測ります。ラだけでは、どの音からの距離か分かりません。'},
  {label:'半音',title:'鍵盤のとなりが、半音。',intro:'白鍵・黒鍵の区別にかかわらず、<strong>すぐ隣の鍵盤までの距離が「半音」</strong>です。ミとファの間には黒鍵がありません。',notes:[['E','ミ',64,2],['F','ファ',65,3]],question:'ミ → ファは、半音いくつ？',choices:['半音1個','半音2個'],answer:0,feedback:'間に鍵盤がないので、半音1個です。白鍵どうしでも、半音になる組み合わせがあります。'},
  {label:'全音',title:'半音2個で、全音。',intro:'ドとレの間にはド♯があります。<strong>ド → ド♯ → レと半音2個進む距離</strong>を「全音」といいます。',notes:[['C','ド',60,0],['C♯','ド♯',61,0],['D','レ',62,1]],question:'ド → レの距離を、何と呼ぶ？',choices:['半音','全音'],answer:1,feedback:'全音です。鍵盤を2回進むので半音2個。鍵盤の個数ではなく、進む回数を数えます。'},
  {label:'度数',title:'何度かは、音の名前で数える。',intro:'<strong>出発の音と到着の音を両方含めて</strong>数えます。ド → ミなら、ド・レ・ミで3度。半音の数とは別の数え方です。',visual:'count',question:'ド → ファは、何度？',choices:['3度','4度'],answer:1,feedback:'ド・レ・ミ・ファの4つで、4度です。出発のドを1として数えます。'},
  {label:'長・短',title:'同じ3度でも、距離が違う。',intro:'3度では、<strong>半音4個が長3度、半音3個が短3度</strong>です。まず度数を数えて、次に半音の数で長・短を決めます。',visual:'quality',question:'3度で、半音3個なら？',choices:['長3度','短3度'],answer:1,feedback:'短3度です。ド → ミは長3度。ミを半音下げたド → ミ♭は短3度になります。'},
  {label:'完全',title:'4度や5度は、「完全」が基本。',intro:'<strong>1・4・5・8度の基本の呼び方は「完全」</strong>です。完全4度は半音5個、完全5度は半音7個の距離です。',notes:[['C','ド',60,0],['G','ソ',67,4]],question:'5度で、半音7個なら？',choices:['完全5度','長5度'],answer:0,feedback:'完全5度です。ド・レ・ミ・ファ・ソで5度、ドからソの距離は半音7個です。'}
 ];
 const chordBasics=[
  {label:'ルート（根音）',title:'コードの基準になる音、ルート（根音）。',intro:'音程で出発の音を決めたように、コードにも<strong>基準になる音「ルート（根音）」</strong>があります。コード名のアルファベットがルート（根音）を表し、Cはド、Fはファです。',visual:'root',question:'Cのコードのルート（根音）は？',choices:['ド','ミ'],answer:0,feedback:'ドです。Cのコードは、ドを基準にほかの音を重ねます。'},
  {label:'三和音',title:'ルート（根音）に、3度と5度を重ねる。',intro:'メジャーの三和音は、<strong>ルート（根音）・長3度・完全5度</strong>で作ります。Cではド・ミ・ソです。',notes:[['C','ド',60,0],['E','ミ',64,2],['G','ソ',67,4]],question:'ルート（根音）から長3度の距離は？',choices:['半音3個','半音4個'],answer:1,feedback:'半音4個です。Cのルート（根音）ドから半音4個進むとミ、半音7個進むとソです。'},
  {label:'マイナー',title:'真ん中の音を、半音下げる。',intro:'メジャーの3度を半音下げると、<strong>短3度のマイナー三和音</strong>になります。Cのド・ミ・ソから、Cmのド・ミ♭・ソへ。',notes:[['C','ド',60,0],['E♭','ミ♭',63,2],['G','ソ',67,4]],question:'CからCmに変えるとき、下げる音は？',choices:['ミ','ソ'],answer:0,feedback:'ミを半音下げてミ♭にします。ルート（根音）ドと完全5度のソは、そのままです。'}
 ];
 const refs=[{degree:1,perfect:0},{degree:2,minor:1,major:2},{degree:3,minor:3,major:4},{degree:4,perfect:5},{degree:5,perfect:7},{degree:6,minor:8,major:9},{degree:7,minor:10,major:11},{degree:8,perfect:12}];
 const degreeNames=['ド','レ','ミ','ファ','ソ','ラ','シ','ド'];
 const midiLabels={60:'ド',61:'レ♭',62:'レ',63:'ミ♭',64:'ミ',65:'ファ',66:'ソ♭',67:'ソ',68:'ラ♭',69:'ラ',70:'シ♭',71:'シ',72:'ド'};
 function icons(){if(globalThis.lucide)globalThis.lucide.createIcons({attrs:{width:16,height:16}});}
 function basicTopic(){return (ui.basicTopic||ui.page)==='chord'?'chord':'interval';}
 function loadBasicAnswer(){const answer=ui.answers[basicTopic()][ui.step];ui.selected=answer?.selected??null;ui.checked=answer?.checked===true;}
 function remember(){if(ui.mode==='basics'&&ui.selected!==null)ui.answers[basicTopic()][ui.step]={selected:ui.selected,checked:ui.checked};root.otoLearning={foundationVersion:2,referenceExample:ui.referenceExample,intervalPick:ui.intervalPick,chordPick:ui.chordPick,chordKeys:ui.chordKeys,chartStart:ui.chartStart,chartEnd:ui.chartEnd,mode:ui.mode,page:ui.page,step:ui.step,basicTopic:ui.basicTopic,selected:ui.selected,checked:ui.checked,confirmed:ui.confirmed,semi:ui.semi,degree:ui.degree,kind:ui.kind,chordRef:ui.chordRef,chordFamily:ui.chordFamily,chordTableRoot:ui.chordTableRoot,chordIdentity:ui.chordIdentity,answers:ui.answers};if(root.otoPersist)root.otoPersist();}
 function piano(notes,origin=null){const labels={...midiLabels,61:'ド♯',...(origin!==null?{63:'レ♯',66:'ファ♯',68:'ソ♯'}:{}),...Object.fromEntries(notes.filter(n=>n[1]).map(n=>[n[2],n[1]]))};const lit=notes.map(n=>n[2]);const whites=[60,62,64,65,67,69,71,72],blacks=[[61,1],[63,2],[66,4],[68,5],[70,6]];return '<div class="oto-piano" aria-label="学習例の鍵盤">'+whites.map(m=>'<button type="button" class="oto-white cursor-interaction '+(lit.includes(m)?'lit ':'')+(origin===m?'oto-origin-key':origin!==null&&lit.includes(m)?'oto-target-key':'')+'" data-basic-key="'+m+'" aria-label="'+(m===72?'上の':'')+labels[m]+(origin===m?'（基準の音）':origin!==null&&lit.includes(m)?'（到着の音）':'')+'を鳴らす">'+(origin===m?'<small class="oto-key-role">基準</small>':origin!==null&&lit.includes(m)?'<small class="oto-key-role">到着</small>':'')+labels[m]+'</button>').join('')+blacks.map(([m,pos])=>'<button type="button" class="oto-black cursor-interaction '+(lit.includes(m)?'lit ':'')+(origin===m?'oto-origin-key':origin!==null&&lit.includes(m)?'oto-target-key':'')+'" data-basic-key="'+m+'" style="left:'+pos*12.5+'%" aria-label="'+labels[m]+(origin===m?'（基準の音）':origin!==null&&lit.includes(m)?'（到着の音）':'')+'を鳴らす">'+(origin===m?'<small class="oto-key-role">基準</small>':origin!==null&&lit.includes(m)?'<small class="oto-key-role">到着</small>':'')+(lit.includes(m)?labels[m]:'')+'</button>').join('')+'</div>';}
 let audio=null;
 async function sound(midi){try{const Audio=globalThis.AudioContext||globalThis.webkitAudioContext;if(!Audio)throw new Error('audio unavailable');audio=audio||new Audio();await audio.resume();const o=audio.createOscillator(),g=audio.createGain(),t=audio.currentTime;o.type='triangle';o.frequency.value=440*2**((midi-69)/12);g.gain.setValueAtTime(.07,t);g.gain.exponentialRampToValueAtTime(.001,t+.55);o.connect(g);g.connect(audio.destination);o.start(t);o.stop(t+.6);}catch(e){const status=area.querySelector('[data-basic-sound]');if(status)status.textContent='音を再生できません。鍵盤図で確認できます。';}}
 function bindKeys(){area.querySelectorAll('[data-basic-key]').forEach(b=>b.addEventListener('click',()=>sound(Number(b.dataset.basicKey))));}
 function table(interactive){return '<table class="oto-chart-table"><caption class="oto-example-title">基本の音程と半音の数</caption><thead><tr><th scope="col">度数</th><th scope="col">短</th><th scope="col">長</th><th scope="col">完全</th></tr></thead><tbody>'+refs.map(r=>'<tr><td>'+r.degree+'度</td>'+[['minor','短'],['major','長'],['perfect','完全']].map(([k,kind])=>{const n=r[k];if(n===undefined)return '<td>—</td>';return '<td>'+(interactive?'<button type="button" class="cursor-interaction '+(ui.semi===n&&ui.degree===r.degree?'active':'')+'" data-ref="'+n+'" data-degree="'+r.degree+'" data-kind="'+kind+'" aria-label="'+kind+r.degree+'度、半音'+n+'個" aria-pressed="'+(ui.semi===n&&ui.degree===r.degree)+'">'+n+'</button>':'<span class="oto-semi-number">'+n+'</span>')+'</td>';}).join('')+'</tr>').join('')+'</tbody></table><p class="oto-chart-caption">数字は半音の数。短は、同じ度数の長より半音1個せまい距離です。</p><details class="oto-chart-caption"><summary>慣れてから：半音6個の呼び方</summary><p>半音6個は「増4度」または「減5度」。音名の数え方で名前が変わります。</p></details>';}
 function steps(items){return items.map((q,i)=>'<button type="button" class="oto-basic-step cursor-interaction '+(ui.step===i?'active':'')+'" data-basic-step="'+i+'" aria-pressed="'+(ui.step===i)+'"><span>'+ (i+1)+'</span>'+q.label+(ui.confirmed[(ui.basicTopic||ui.page)==='chord'?'chord':'interval'].includes(i)?'<small aria-label="確認済み">✓</small>':'')+'</button>').join('');}
 const referenceExamples={
  C:{notes:[['C','ド',60,0],['E','ミ',64,2]],path:['ド','ド♯','レ','レ♯','ミ']},
  F:{notes:[['F','ファ',65,3],['A','ラ',69,5]],path:['ファ','ファ♯','ソ','ソ♯','ラ']}
 };
 function originDiagram(){const example=referenceExamples[ui.referenceExample];return '<div class="oto-origin-choices" role="group" aria-label="出発の音を切り替える">'+Object.entries(referenceExamples).map(([key,q])=>'<button type="button" class="oto-secondary '+(key===ui.referenceExample?'active':'')+'" data-origin-example="'+key+'" aria-pressed="'+(key===ui.referenceExample)+'">'+q.notes[0][1]+'から測る</button>').join('')+'</div><div class="oto-origin-pair"><span><small>基準・出発</small><b>'+example.notes[0][1]+'</b></span><span class="oto-arrow" aria-hidden="true">→</span><span><small>到着</small><b>'+example.notes[1][1]+'</b></span></div>'+piano(example.notes,example.notes[0][2])+'<div class="oto-origin-ruler" role="img" aria-label="'+example.path.join('、')+'。出発を0として半音4個進む">'+example.path.map((note,i)=>'<span><b>'+i+'</b><small>'+note+'</small></span>').join('')+'</div><p class="oto-chart-caption">出発は0。そこから鍵盤を4回進む距離です。<br>ド → ミも、ファ → ラも、同じ長3度（半音4個）。</p><p class="oto-origin-root"><strong>ルート（根音）とのつながり</strong><br>音程では「出発の音」を基準にします。コードで基準になる音は「ルート（根音）」と呼びます。</p>';}
 function basicsRender(){const items=(ui.basicTopic||ui.page)==='chord'?chordBasics:basics;ui.step=Math.min(ui.step,items.length-1);const answerFocus=document.activeElement?.dataset.basicAnswer;const q=items[ui.step],correct=ui.selected===q.answer;
  let diagram=q.visual==='origin'?originDiagram():q.notes?piano(q.notes):q.visual==='count'?'<div class="oto-count-example">'+['ド','レ','ミ'].map((n,i)=>'<div class="oto-count-note"><b>'+n+'</b><small>'+(i+1)+'</small></div>').join('<span class="oto-arrow">→</span>')+'</div>':q.visual==='quality'?'<div class="oto-formula"><span>3度 ＋ 半音4個</span><span>＝</span><b>長3度</b></div><div class="oto-formula" style="padding-top:0"><span>3度 ＋ 半音3個</span><span>＝</span><b>短3度</b></div>':'<div class="oto-formula"><b>C</b><span>のルート（根音）は</span><b>ド</b></div>';
  area.innerHTML='<div class="oto-topline"><span>練習の前に ／ <b>'+q.label+'</b></span><span>'+(ui.step+1)+' / '+items.length+' ステップ</span></div><div class="oto-progress" role="progressbar" aria-label="基礎学習の進捗" aria-valuenow="'+(ui.step+1)+'" aria-valuemin="0" aria-valuemax="'+items.length+'"><span style="width:'+(ui.step+1)/items.length*100+'%"></span></div><div class="oto-basic-mini-path">'+steps(items)+'</div><span class="oto-overline">SMALL STEPS</span><h2 class="oto-title">'+q.title+'</h2><p class="oto-basic-intro">'+q.intro+'</p><div class="oto-study-grid"><div><div class="oto-question"><span class="oto-example-title">'+(q.visual==='origin'?'基準を変えて、同じ距離を作る':q.notes?q.notes.map(n=>n[1]).join((ui.basicTopic||ui.page)==='chord'?'・':' → '):'考え方の例')+'</span>'+diagram+'<div class="oto-toast" aria-live="polite" data-basic-sound></div></div><h3 class="oto-micro-title">'+q.question+'</h3><div class="oto-options" role="group" aria-label="基礎の確認問題">'+q.choices.map((n,i)=>'<button type="button" class="oto-option cursor-interaction '+(ui.selected===i?'selected ':'')+(ui.checked&&q.answer===i?'right ':'')+(ui.checked&&!correct&&ui.selected===i?'wrong':'')+'" data-basic-answer="'+i+'" aria-pressed="'+(ui.selected===i)+'" '+(ui.checked?'disabled':'')+'><small>'+String.fromCharCode(65+i)+'</small><span>'+n+'</span></button>').join('')+'</div>'+(ui.checked?'<section class="oto-feedback" data-correct="'+correct+'" aria-live="polite"><h3>'+(correct?'その通り。':'ここを一緒に確認。')+'</h3><p>'+q.feedback+'</p><button type="button" class="oto-link" data-basic-retry>もう一度確かめる</button></section>':'')+'<div class="oto-actions"><button type="button" class="oto-link cursor-interaction" data-skip>練習へ進む</button><button type="button" class="oto-primary cursor-interaction" '+(ui.checked?'data-basic-next':'data-basic-check '+(ui.selected===null?'disabled':''))+'>'+(ui.checked?(ui.step===items.length-1?'この知識で練習する':'次の基礎へ'):'確かめる')+'<i data-lucide="arrow-right" aria-hidden="true"></i></button></div></div><aside class="oto-guide"><h3>ひとつずつ、確かめる。</h3><div class="oto-basic-path">'+steps(items)+'</div><p class="oto-basic-foot">短い説明 → 小さな確認問題 → 練習。<br>知っているところは飛ばせます。</p></aside></div>';
  area.querySelectorAll('[data-origin-example]').forEach(b=>b.addEventListener('click',()=>{ui.referenceExample=b.dataset.originExample;remember();basicsRender();icons();area.querySelector('[data-origin-example="'+ui.referenceExample+'"]')?.focus({preventScroll:true});}));
  area.querySelectorAll('[data-basic-answer]').forEach(b=>b.addEventListener('click',()=>{ui.selected=Number(b.dataset.basicAnswer);remember();basicsRender();icons();}));
  area.querySelectorAll('[data-basic-step]').forEach(b=>b.addEventListener('click',()=>{ui.step=Number(b.dataset.basicStep);loadBasicAnswer();remember();basicsRender();icons();root.otoReveal(area);}));
  area.querySelector('[data-skip]').addEventListener('click',()=>chooseMode('practice'));
  const retry=area.querySelector('[data-basic-retry]');if(retry)retry.addEventListener('click',()=>{delete ui.answers[basicTopic()][ui.step];ui.selected=null;ui.checked=false;remember();basicsRender();icons();root.otoReveal(area);});
  const check=area.querySelector('[data-basic-check]');if(check)check.addEventListener('click',()=>{ui.checked=true;const topic=(ui.basicTopic||ui.page)==='chord'?'chord':'interval';if(!ui.confirmed[topic].includes(ui.step))ui.confirmed[topic].push(ui.step);remember();basicsRender();icons();root.otoReveal(area,'.oto-feedback h3');});
  const next=area.querySelector('[data-basic-next]');if(next)next.addEventListener('click',()=>{if(ui.step===items.length-1){chooseMode('practice');return;}ui.step++;loadBasicAnswer();remember();basicsRender();icons();root.otoReveal(area);});
  const chat=document.createElement('div');chat.className='oto-chat-row oto-chat-only';chat.innerHTML='<span>この基礎で分からないところを、ChatGPTと確認。</span><button type="button" class="oto-link cursor-interaction" data-basic-chat><i data-lucide="messages-square" aria-hidden="true"></i>ChatGPTに質問する</button>';area.querySelector('.oto-study-grid').after(chat);chat.querySelector('button').addEventListener('click',()=>{const text=document.createElement('div');text.innerHTML=q.intro;root.otoAskGPT('音楽理論の入門者です。\nいま学んでいる基礎：'+q.label+'\n説明：'+text.textContent+(q.visual==='origin'?'\n鍵盤の例：'+referenceExamples[ui.referenceExample].notes.map(n=>n[1]).join(' → ')+'。ド→ミもファ→ラも長3度。音程では出発の音が基準、コードではルート（根音）が基準です。':'')+'\n確認問題：'+q.question+'\n私の回答：'+(ui.selected===null?'まだ回答していません':q.choices[ui.selected])+'\n'+(ui.checked?'正解：'+q.choices[q.answer]+'\n解説：'+q.feedback:'まだ答え合わせをしていません。答えをすぐに明かさず、考え方から案内してください。')+'\n\nこの基礎を短く説明し、理解を確かめる質問は2問以内、一度に1問ずつにしてください。区切りで学習画面に戻るか、疑問を続けて聞くか確認してください。',area);});bindKeys();if(answerFocus!==undefined)area.querySelector('[data-basic-answer="'+answerFocus+'"]')?.focus({preventScroll:true});
 }
 const chordRefs=[
  {symbol:'C',notes:[['C','ド',60,0],['E','ミ',64,2],['G','ソ',67,4]],minor:false},
  {symbol:'Cm',notes:[['C','ド',60,0],['E♭','ミ♭',63,2],['G','ソ',67,4]],minor:true},
  {symbol:'F',notes:[['F','ファ',65,3],['A','ラ',69,5],['C','ド',72,7]],minor:false},
  {symbol:'Fm',notes:[['F','ファ',65,3],['A♭','ラ♭',68,5],['C','ド',72,7]],minor:true}
 ];
 function chordTableRefs(family=ui.chordFamily,rootKey=ui.chordTableRoot,practice=false){
  if(family==='triads'&&!practice)return chordRefs;
  const ids=family==='triads'?['major','minor']:family==='diminished'?['dim','aug']:OtoTheory.types.filter(t=>t.group==='sevenths').map(t=>t.id);
  return ids.map(id=>{const type=OtoTheory.types.find(t=>t.id===id),q=OtoTheory.chord(rootKey,id);return {symbol:q.symbol,label:type.label,notes:q.notes.map(n=>[n.key,n.sol,n.midi,n.step]),minor:id==='minor'||id==='min7'};});
 }
 function chordTable(interactive,family=ui.chordFamily,rootKey=ui.chordTableRoot,practice=false){
  const caption=practice?rootKey+'をルート（根音）にした'+(family==='sevenths'?'4和音':family==='diminished'?'増・減三和音':'三和音'):family==='triads'?'最初に覚える4つの三和音':'7種類の4和音（セブンスコード）';
  return '<table class="oto-chart-table oto-chord-table"><caption>'+caption+'</caption><thead><tr><th scope="col">コード</th><th scope="col">構成音</th><th scope="col">種類</th></tr></thead><tbody>'+chordTableRefs(family,rootKey,practice).map(q=>'<tr><th scope="row">'+(interactive?'<button type="button" data-chord-ref="'+q.symbol+'" class="'+(q.symbol===ui.chordRef?'active':'')+'" aria-pressed="'+(q.symbol===ui.chordRef)+'" aria-label="'+q.symbol+'の構成音を鍵盤で見る">'+q.symbol+'</button>':q.symbol)+'</th><td>'+q.notes.map(n=>n[1]).join('・')+'</td><td>'+(q.label||(q.minor?'マイナー':'メジャー'))+'</td></tr>').join('')+'</tbody></table>';
 }
 function chromaticTable(){
  const rows=Array.from({length:8},(_,i)=>{const degree=i+1,perfect=[1,4,5,8].includes(degree),wide=OtoTheory.semitones(degree,'増'),narrow=OtoTheory.semitones(degree,'減');
   return '<tr><th scope="row">'+degree+'度</th><td>'+(perfect?'完全'+degree+'度：'+OtoTheory.semitones(degree,'完全'):'長'+degree+'度：'+OtoTheory.semitones(degree,'長')+'／短'+degree+'度：'+OtoTheory.semitones(degree,'短'))+'</td><td>'+wide+'</td><td>'+narrow+'</td></tr>';
  }).join('');
  return '<table class="oto-chart-table"><caption>増・減音程と半音の数</caption><thead><tr><th scope="col">度数</th><th scope="col">基本</th><th scope="col">増</th><th scope="col">減</th></tr></thead><tbody>'+rows+'</tbody></table><p class="oto-chart-caption">数字は半音の数。増は長・完全より1個広く、減は短・完全より1個狭い距離です。増8度（13個）と減1度（−1個）は、この単音程の練習範囲には含みません。半音0個でも、ド♯とレ♭のように音名が2つなら減2度です。</p>';
 }
 const chordRootNames=[['C','ド',0],['D♭','レ♭',1],['D','レ',1],['E♭','ミ♭',2],['E','ミ',2],['F','ファ',3],['F♯','ファ♯',3],['G','ソ',4],['A♭','ラ♭',5],['A','ラ',5],['B♭','シ♭',6],['B','シ',6]];
 const keyboardChordTypes=[
  {id:'major',suffix:'',label:'メジャー',offsets:[0,4,7]}, {id:'minor',suffix:'m',label:'マイナー',offsets:[0,3,7]},
  {id:'maj7',suffix:'maj7',label:'メジャーセブンス',offsets:[0,4,7,11]},
  {id:'dom7',suffix:'7',label:'ドミナントセブンス',offsets:[0,4,7,10]},
  {id:'min7',suffix:'m7',label:'マイナーセブンス',offsets:[0,3,7,10]},
  {id:'half-dim',suffix:'m7(b5)',label:'ハーフディミニッシュ',offsets:[0,3,6,10]},
  {id:'dim7',suffix:'dim7',label:'ディミニッシュセブンス',offsets:[0,3,6,9]},
  {id:'min-maj7',suffix:'m(maj7)',label:'マイナーメジャーセブンス',offsets:[0,3,7,11]},
  {id:'aug7',suffix:'7(#5)',label:'オーギュメントセブンス',offsets:[0,4,8,10]}
 ];
 function identifyKeyboardChord(keys,preferredSymbol=null){
  const sorted=[...new Set(keys)].sort((a,b)=>a-b),pcs=[...new Set(sorted.map(n=>n%12))],matches=[];
  if(![3,4].includes(pcs.length))return null;
  for(let rootPc=0;rootPc<12;rootPc++)for(const type of keyboardChordTypes){
   const offsets=type.offsets;if(offsets.length!==pcs.length||!offsets.every(n=>pcs.includes((rootPc+n)%12)))continue;
   const minor=type.id==='minor',root=minor&&rootPc===1?['C♯','ド♯',0]:minor&&rootPc===8?['G♯','ソ♯',4]:chordRootNames[rootPc];
   const letters=['C','D','E','F','G','A','B'],jp=['ド','レ','ミ','ファ','ソ','ラ','シ'],natural=[0,2,4,5,7,9,11];
   const tones=offsets.map((offset,i)=>{const degree=(root[2]+2*i)%7,pc=(rootPc+offset)%12,alter=(pc-natural[degree]+18)%12-6,accidental=alter===2?'𝄪':alter===-2?'𝄫':alter===1?'♯':alter===-1?'♭':'';return {pc,letter:letters[degree]+accidental,name:jp[degree]+accidental};});
   const bassPc=sorted[0]%12,inversion=offsets.indexOf((bassPc-rootPc+12)%12),bass=tones[inversion],symbol=root[0]+type.suffix;
   matches.push({rootPc,minor,type:type.id,tones,rootName:root[1],bassName:bass.name,bassMidi:sorted[0],inversion,symbol,displaySymbol:symbol+(inversion?'/'+bass.letter:''),displayName:root[0].replace('♭','b').replace('♯','#')+type.label,position:['基本形','第1転回形','第2転回形','第3転回形'][inversion],keys:sorted});
  }
  const chosen=matches.find(q=>q.symbol===preferredSymbol)||matches.find(q=>q.inversion===0)||matches[0];
  return chosen?{...chosen,alternatives:matches.map(q=>({symbol:q.symbol,name:q.displayName}))}:null;
 }
 function chordVoicing(match,inversion){
  if(!match||!Number.isInteger(inversion)||inversion<0||inversion>=match.tones.length)return [];
  const bass=60+match.tones[inversion].pc;
  return match.tones.map(t=>bass+(t.pc-bass%12+12)%12).sort((a,b)=>a-b);
 }
 function chordPiano(keys,match,interactive=true){
  const name=m=>match?.tones.find(n=>n.pc===m%12)?.name||midiLabels[60+m%12];
  const pitch=m=>(m===84?'さらに上の':m>=72?'上の':'')+name(m);
  const role=m=>!keys.includes(m)?'':match&&m%12===match.rootPc?'ルート（根音）':match&&m===match.bassMidi?'最低音':'';
  const button=(m,black,index)=>'<button type="button" class="'+(black?'oto-black':'oto-white')+' '+(keys.includes(m)?'lit ':'')+(role(m)==='ルート（根音）'?'oto-chord-root':role(m)==='最低音'?'oto-chord-bass':'')+'" '+(interactive?'data-chord-key':'data-basic-key')+'="'+m+'" aria-label="'+pitch(m)+(role(m)?'（'+role(m)+'）':'')+(interactive?'を選ぶ':'を鳴らす')+'"'+(interactive?' aria-pressed="'+keys.includes(m)+'"':'')+(black?' style="left:'+index*100/15+'%"':'')+'>'+(role(m)?'<small class="oto-key-role">'+(role(m)==='ルート（根音）'?'ルート<span class="oto-key-root-reading">（根音）</span>':role(m))+'</small>':'')+(!black||keys.includes(m)?name(m):'')+'</button>';
  const whites=[60,62,64,65,67,69,71,72,74,76,77,79,81,83,84],blacks=[[61,1],[63,2],[66,4],[68,5],[70,6],[73,8],[75,9],[78,11],[80,12],[82,13]];
  return '<div class="oto-chord-keyboard-scroll" tabindex="0" aria-label="コードを調べる2オクターブの鍵盤。左右にスクロールできます"><div class="oto-piano oto-chord-piano">'+whites.map((m,i)=>button(m,false,i)).join('')+blacks.map(([m,i])=>button(m,true,i)).join('')+'</div></div><div class="oto-octave-caption"><span>低い音 ←</span><span>→ 高い音</span></div>';
 }
 function chordPickTabs(){return '<div class="oto-interval-pick" role="group" aria-label="コードの調べ方">'+[['table','表から見る'],['keyboard','鍵盤で調べる']].map(([mode,text])=>'<button type="button" class="oto-secondary '+(mode===ui.chordPick?'active':'')+'" data-chord-pick="'+mode+'" aria-pressed="'+(mode===ui.chordPick)+'">'+text+'</button>').join('')+'</div>';}
 function chordKeyboardRender(){
  const match=identifyKeyboardChord(ui.chordKeys,ui.chordIdentity),count=new Set(ui.chordKeys.map(n=>n%12)).size;
  const title=match?match.displayName:count<3?'3つ、または4つの音を選ぶ':'音の組み合わせを確認';
  const subtitle=match?match.position:count+' 音名を選択';
  const result=match?'<h3 class="oto-chord-result-title"><strong>'+title+'</strong><span class="oto-chord-result-position">・'+subtitle+'</span></h3>':'<b>'+title+'</b><span>'+subtitle+'</span>';
  const name=m=>match?.tones.find(n=>n.pc===m%12)?.name||midiLabels[60+m%12];
  const selected=ui.chordKeys.map(m=>(m===84?'さらに上の':m>=72?'上の':'')+name(m)).join('・');
  const explanation=match?(match.inversion?'最低音が'+match.bassName+'でも、ルート（根音）は'+match.rootName+'。音の並びが変わっても、'+match.displayName+'の構成音です。':'ルート（根音）の'+match.rootName+'がいちばん下にあるので、'+match.displayName+'の基本形です。'):count<3?'異なる3つ、または4つの音名を選ぶと、コード名と転回形が表示されます。':'この組み合わせは対応する三和音・セブンスコードに当てはまりません。3音か4音にして、鍵盤を選び直してみましょう。';
  const scrollLeft=area.querySelector('.oto-chord-keyboard-scroll')?.scrollLeft||0;
  area.innerHTML='<span class="oto-overline">REFERENCE</span><h2 class="oto-title">コードの早見表</h2><p class="oto-subtitle">鍵盤でコード名と、音の並びを調べます。</p>'+chordPickTabs()+'<div class="oto-chord-workspace"><div class="oto-chart-example"><div class="oto-chart-example-head '+(match?'oto-chord-result':'')+'" aria-live="polite">'+result+'</div><p class="oto-chart-caption">3つ、または4つの音名を選びます。もう一度押すと、その音を外せます。</p><div class="oto-chart-pair" aria-live="polite">'+(selected||'まだ音を選んでいません')+'</div>'+chordPiano(ui.chordKeys,match)+'<p class="oto-chart-caption oto-chord-scroll-help">小さい画面では、鍵盤を左右に動かせます。</p>'+(match?'<div class="oto-chord-identity"><span><small>ルート（根音）</small><b>'+match.rootName+'</b></span><span><small>いちばん低い音</small><b>'+match.bassName+'</b></span></div>':'')+'<p class="oto-chart-caption" aria-live="polite">'+explanation+'</p>'+(match?.alternatives.length>1?'<p class="oto-chart-caption">この4音は複数のルート（根音）で読めます。使いたいコード名を選んでください。</p><div class="oto-chord-key-actions">'+match.alternatives.map(q=>'<button type="button" class="oto-secondary" data-chord-identity="'+q.symbol+'" aria-pressed="'+(q.symbol===match.symbol)+'">'+q.name+'</button>').join('')+'</div>':'')+'<div class="oto-chord-key-actions"><button type="button" class="oto-secondary" data-chord-clear '+(!ui.chordKeys.length?'disabled':'')+'>選択をクリア</button><button type="button" class="oto-secondary" data-chord-play '+(!ui.chordKeys.length?'disabled':'')+'>選んだ音を聴く</button>'+['基本形','第1転回形','第2転回形','第3転回形'].slice(0,match?.tones.length||3).map((label,i)=>'<button type="button" class="oto-secondary oto-voicing-button" data-chord-voicing="'+i+'" aria-pressed="'+(match?.inversion===i)+'" '+(!match?'disabled':'')+'>'+label+'</button>').join('')+'</div><div class="oto-toast" aria-live="polite" data-basic-sound></div></div><details class="oto-ref-reading"><summary>転回形とは？</summary><p>同じコードの構成音を、別の順番に並べた形です。ルート（根音）が最低音なら基本形、3度の音なら第1転回形、5度の音なら第2転回形、4和音の7度の音なら第3転回形です。たとえば、ミ・ソ・ドはCメジャーの第1転回形です。</p><p>判定できるのは、12音すべてのメジャー／マイナー三和音と、表の7種類のセブンスコードです。ディミニッシュセブンスは同じ鍵盤で複数のコード名になるため、ルート（根音）を選べます。同じ音を別の高さで重ねたり、音の間隔を広げたりしても判定できます。</p></details></div><div class="oto-actions"><span class="oto-chart-caption">ルート（根音）と最低音の違いを、鍵盤で確かめてみましょう。</span><button type="button" class="oto-primary" data-chart-return>コードを練習する</button></div>';
  area.querySelector('.oto-chord-keyboard-scroll').scrollLeft=scrollLeft;
  area.querySelectorAll('[data-chord-key]').forEach(b=>b.addEventListener('click',()=>{const midi=Number(b.dataset.chordKey);ui.chordIdentity=null;sound(midi);ui.chordKeys=ui.chordKeys.includes(midi)?ui.chordKeys.filter(n=>n!==midi):[...ui.chordKeys,midi].sort((a,b)=>a-b);chordChartRender();remember();icons();area.querySelector('[data-chord-key="'+midi+'"]')?.focus({preventScroll:true});}));
  area.querySelector('[data-chord-clear]').addEventListener('click',()=>{ui.chordKeys=[];ui.chordIdentity=null;chordChartRender();remember();icons();area.querySelector('.oto-chord-keyboard-scroll').scrollLeft=0;area.querySelector('[data-chord-key="60"]')?.focus({preventScroll:true});});
  area.querySelectorAll('[data-chord-identity]').forEach(b=>b.addEventListener('click',()=>{ui.chordIdentity=b.dataset.chordIdentity;chordChartRender();remember();icons();}));
  area.querySelector('[data-chord-play]').addEventListener('click',()=>ui.chordKeys.forEach(m=>sound(m)));
  area.querySelectorAll('[data-chord-voicing]').forEach(b=>b.addEventListener('click',()=>{if(!match)return;ui.chordIdentity=match.symbol;ui.chordKeys=chordVoicing(match,Number(b.dataset.chordVoicing));chordChartRender();remember();icons();const lowest=area.querySelector('[data-chord-key="'+ui.chordKeys[0]+'"]');area.querySelector('.oto-chord-keyboard-scroll').scrollLeft=Math.max(0,lowest.offsetLeft-12);area.querySelector('[data-chord-voicing="'+b.dataset.chordVoicing+'"]')?.focus({preventScroll:true});}));
 }
 function chordChartRender(){
  const rows=chordTableRefs(),q=rows.find(q=>q.symbol===ui.chordRef)||rows[0];ui.chordRef=q.symbol;
  if(ui.chordPick==='keyboard')chordKeyboardRender();
  else{
   area.innerHTML='<span class="oto-overline">REFERENCE</span><h2 class="oto-title">コードの早見表</h2><p class="oto-subtitle">コード名を選ぶと、構成音を鍵盤で確認できます。</p>'+chordPickTabs()+'<div class="oto-chord-key-actions" role="group" aria-label="和音の種類">'+[['triads','三和音'],['sevenths','4和音（セブンス）']].map(([family,label])=>'<button type="button" class="oto-secondary '+(ui.chordFamily===family?'active':'')+'" data-chord-family="'+family+'" aria-pressed="'+(ui.chordFamily===family)+'">'+label+'</button>').join('')+'</div>'+(ui.chordFamily==='sevenths'?'<label class="oto-chart-caption">ルート（根音） <select data-chord-table-root>'+OtoTheory.roots.map(r=>'<option '+(r===ui.chordTableRoot?'selected':'')+'>'+r+'</option>').join('')+'</select></label>':'')+'<div class="oto-note-letters" aria-label="アルファベットと音名の対応">'+[['C','ド'],['D','レ'],['E','ミ'],['F','ファ'],['G','ソ'],['A','ラ'],['B','シ']].map(([letter,note])=>'<span><b>'+letter+'</b>'+note+'</span>').join('')+'</div><div class="oto-reference-grid"><div class="oto-reference-table">'+chordTable(true)+'<p class="oto-chart-caption">'+(ui.chordFamily==='triads'?'小文字のmはマイナー。CとCm、FとFmは真ん中の音だけが違います。':'三和音に7度の音を加えた4和音です。maj7と7は、いちばん上の音が半音1個違います。dim7の7度は減7度です。')+'</p></div><div class="oto-reference-detail"><div class="oto-chart-example"><div class="oto-chart-example-head" aria-live="polite"><b>'+q.symbol+'</b><span>'+(q.label||(q.minor?'マイナー':'メジャー')+'三和音')+'</span></div><div class="oto-chart-pair">'+q.notes.map(n=>n[1]).join('・')+'</div>'+(q.notes.length===4?chordPiano(q.notes.map(n=>n[2]),identifyKeyboardChord(q.notes.map(n=>n[2]),q.symbol.replace(/^([A-G])b/,'$1♭').replace(/^([A-G])#/,'$1♯')),false):piano(q.notes))+'<p class="oto-chart-caption">'+q.notes[0][1]+'がルート（根音）。'+(q.notes.length===4?'3度・5度・7度の音を重ねています。':'3度・5度の音を重ねています。')+'</p><button type="button" class="oto-secondary" data-chord-table-keyboard>このコードを鍵盤で調べる</button><div class="oto-toast" aria-live="polite" data-basic-sound></div></div></div></div><div class="oto-actions"><span class="oto-chart-caption">表を見ながら練習して大丈夫です。</span><button type="button" class="oto-primary" data-chart-return>コードを練習する</button></div>';
   area.querySelectorAll('[data-chord-family]').forEach(b=>b.addEventListener('click',()=>{ui.chordFamily=b.dataset.chordFamily;chordChartRender();remember();icons();}));
   area.querySelector('[data-chord-table-root]')?.addEventListener('change',e=>{const suffix=ui.chordRef.slice(ui.chordTableRoot.length);ui.chordTableRoot=e.target.value;ui.chordRef=ui.chordTableRoot+suffix;chordChartRender();remember();icons();});
   area.querySelector('[data-chord-table-keyboard]').addEventListener('click',()=>{ui.chordKeys=q.notes.map(n=>n[2]);ui.chordIdentity=q.symbol.replace(/^([A-G])b/,'$1♭').replace(/^([A-G])#/,'$1♯');ui.chordPick='keyboard';chordChartRender();remember();icons();});
   area.querySelectorAll('[data-chord-key]').forEach(b=>b.addEventListener('click',()=>sound(Number(b.dataset.chordKey))));
   area.querySelectorAll('[data-chord-ref]').forEach(b=>b.addEventListener('click',()=>{ui.chordRef=b.dataset.chordRef;chordChartRender();remember();icons();area.querySelector('[data-chord-ref="'+ui.chordRef+'"]')?.focus({preventScroll:true});}));bindKeys();
  }
  area.querySelectorAll('[data-chord-pick]').forEach(b=>b.addEventListener('click',()=>{ui.chordPick=b.dataset.chordPick;chordChartRender();remember();icons();area.querySelector('[data-chord-pick="'+ui.chordPick+'"]')?.focus({preventScroll:true});}));
  area.querySelector('[data-chart-return]').addEventListener('click',()=>chooseMode('practice'));
 }
 // Choose a readable spelling for a keyboard pair, retaining both letter count and semitone distance.
 const keySpellings={60:[['ド',0]],61:[['レ♭',1],['ド♯',0]],62:[['レ',1]],63:[['ミ♭',2],['レ♯',1]],64:[['ミ',2]],65:[['ファ',3]],66:[['ソ♭',4],['ファ♯',3]],67:[['ソ',4]],68:[['ラ♭',5],['ソ♯',4]],69:[['ラ',5]],70:[['シ♭',6],['ラ♯',5]],71:[['シ',6]],72:[['ド',7]]};
 function keyboardInterval(start,end){
  const low=Math.min(start,end),high=Math.max(start,end),semi=high-low,candidates=[];
  for(const a of keySpellings[low])for(const b of keySpellings[high]){
   if(low===high&&a[1]!==b[1])continue;
   const degree=b[1]-a[1]+1,base=[0,0,2,4,5,7,9,11,12][degree];if(base===undefined)continue;
   const delta=semi-base,perfect=[1,4,5,8].includes(degree);
   const kind=perfect?({0:'完全',1:'増','-1':'減'}[delta]):({0:'長','-1':'短',1:'増','-2':'減'}[delta]);
   if(kind)candidates.push({a,b,degree,kind,semi,label:kind+degree+'度'});
  }
  const q=candidates.find(q=>['完全','長','短'].includes(q.kind))||candidates[0];
  const ordered=start<=end?[q.a,q.b]:[q.b,q.a];
  return {...q,notes:[[ '',ordered[0][0],start,ordered[0][1]],[ '',ordered[1][0],end,ordered[1][1]]],count:Array.from({length:q.degree},(_,i)=>degreeNames[(q.a[1]+i)%7])};
 }
 function chartRender(){
  if(ui.page==='chord'||ui.page==='review'&&ui.basicTopic==='chord'){chordChartRender();return;}
  const picking=ui.intervalPick==='keyboard',waiting=picking&&(ui.chartStart===null||ui.chartEnd===null);
  const picked=picking&&!waiting?keyboardInterval(ui.chartStart,ui.chartEnd):null;
  const label=picked?picked.label:ui.kind+ui.degree+'度',semi=picked?picked.semi:ui.semi;
  const upper=ui.degree===8?'上のド':ui.kind==='短'?degreeNames[ui.degree-1]+'♭':degreeNames[ui.degree-1];
  const notes=picking?(waiting?(ui.chartStart===null?[]:[['',keySpellings[ui.chartStart][0][0],ui.chartStart,keySpellings[ui.chartStart][0][1]]]):picked.notes):[['C','ド',60,0],['',ui.degree===8?'ド':upper,60+ui.semi,ui.degree-1]];
  const noteName=n=>(n[2]===72?'上の':'')+n[1];
  if(picked){ui.semi=picked.semi;ui.degree=picked.degree;ui.kind=picked.kind;}
  const caption=picking?(waiting?(ui.chartStart===null?'まず、基準にする音の鍵盤を選んでください。':'基準は'+noteName(notes[0])+'。次に、比べる音の鍵盤を選んでください。'):semi===0?'同じ音なので、距離は半音0個（完全1度）です。':'基準の'+noteName(notes[0])+'から'+noteName(notes[1])+'まで、'+(ui.chartStart>ui.chartEnd?'下へ':'上へ')+'半音'+semi+'個。'):'0から、鍵盤をひとつ進むごとに半音1個。';
  const reading=picked?picked.count.join('・')+'で'+picked.degree+'度。半音'+semi+'個で「'+label+'」です。':(ui.degree===1?'ドと同じドで1度。':ui.degree===8?'ド・レ・ミ・ファ・ソ・ラ・シ・ドで8度。':'ドから'+degreeNames[ui.degree-1]+'まで、音名を含めて数えると'+ui.degree+'度。')+' 半音'+semi+'個で「'+label+'」です。';
  area.innerHTML='<span class="oto-overline">REFERENCE</span><h2 class="oto-title">音程の早見表</h2><p class="oto-subtitle">表から選ぶか、鍵盤で2つの音を選んで距離を調べられます。</p><div class="oto-interval-pick" role="group" aria-label="音程の調べ方">'+[['table','表から見る'],['keyboard','鍵盤で調べる']].map(([mode,text])=>'<button type="button" class="oto-secondary '+(mode===ui.intervalPick?'active':'')+'" data-interval-pick="'+mode+'" aria-pressed="'+(mode===ui.intervalPick)+'">'+text+'</button>').join('')+'</div><div class="oto-reference-grid '+(picking?'oto-keyboard-only':'')+'">'+(picking?'':'<div class="oto-reference-table">'+table(true)+'</div>')+'<div class="oto-reference-detail"><div class="oto-chart-example"><div class="oto-chart-example-head" aria-live="polite"><b>'+(waiting?(ui.chartStart===null?'基準の音を選ぶ':'比べる音を選ぶ'):label)+'</b><span>'+(waiting?(ui.chartStart===null?'1つ目の鍵盤を選択':'2つ目の鍵盤を選択'):'半音'+semi+'個')+'</span></div>'+(picking?'<p class="oto-chart-caption">① 基準の音 → ② 比べる音、の順に鍵盤を選びます。</p>':'')+'<div class="oto-chart-pair">'+(notes.length?notes.map(noteName).join(' <span>→</span> '):'？')+(waiting?' <span>→</span> ？':'')+'</div>'+piano(notes,picking?ui.chartStart:null)+(waiting?'':'<div class="oto-semi-ruler" role="img" aria-label="出発を0として半音'+semi+'個進む">'+Array.from({length:13},(_,i)=>'<span class="'+(i===semi?'current':i<semi?'passed':'')+'">'+i+'</span>').join('')+'</div>')+'<p class="oto-chart-caption" aria-live="polite">'+caption+'</p>'+(picking?'<button type="button" class="oto-link" data-pick-again>2つの音を選び直す</button><p class="oto-chart-caption oto-spelling-note">黒鍵は、この音程に合う♯・♭の音名で表示します。</p>':'')+(!waiting&&semi===6?'<p class="oto-chart-caption">半音6個は、音名によって「増4度」または「減5度」と呼びます。</p>':'')+'<div class="oto-toast" aria-live="polite" data-basic-sound></div>'+(waiting?'':'<details class="oto-ref-reading"><summary class="cursor-interaction">この音程の数え方</summary><p>'+reading+'</p></details>')+'</div></div></div><div class="oto-actions"><span class="oto-chart-caption">問題中にも、同じ表を開けます。</span><button type="button" class="oto-primary cursor-interaction" data-chart-return>練習に戻る<i data-lucide="arrow-right" aria-hidden="true"></i></button></div>';
  area.querySelectorAll('[data-interval-pick]').forEach(b=>b.addEventListener('click',()=>{ui.intervalPick=b.dataset.intervalPick;if(ui.intervalPick==='table'&&!refs.some(r=>r.degree===ui.degree&&Object.values(r).includes(ui.semi)&&['完全','長','短'].includes(ui.kind))){ui.semi=4;ui.degree=3;ui.kind='長';}remember();chartRender();icons();area.querySelector('[data-interval-pick="'+ui.intervalPick+'"]')?.focus({preventScroll:true});}));
  area.querySelectorAll('[data-ref]').forEach(b=>b.addEventListener('click',()=>{ui.intervalPick='table';ui.semi=Number(b.dataset.ref);ui.degree=Number(b.dataset.degree);ui.kind=b.dataset.kind;remember();chartRender();icons();area.querySelector('[data-ref="'+ui.semi+'"][data-degree="'+ui.degree+'"]')?.focus({preventScroll:true});}));
  area.querySelector('[data-chart-return]').addEventListener('click',()=>chooseMode('practice'));
  if(picking){area.querySelectorAll('[data-basic-key]').forEach(b=>b.addEventListener('click',()=>{const midi=Number(b.dataset.basicKey);sound(midi);if(ui.chartStart===null){ui.chartStart=midi;ui.chartEnd=null;}else if(ui.chartEnd===null)ui.chartEnd=midi;else{ui.chartStart=midi;ui.chartEnd=null;}chartRender();remember();icons();area.querySelector('[data-basic-key="'+midi+'"]')?.focus({preventScroll:true});}));area.querySelector('[data-pick-again]').addEventListener('click',()=>{ui.chartStart=null;ui.chartEnd=null;chartRender();remember();icons();root.otoReveal(area,'.oto-chart-example-head b');});}else bindKeys();
 }
 function render(){bar.hidden=ui.page==='review'&&ui.mode==='practice';practice.hidden=ui.mode!=='practice';area.hidden=ui.mode==='practice';bar.querySelectorAll('[data-mode]').forEach(b=>{const active=b.dataset.mode===ui.mode;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});if(ui.mode==='basics')basicsRender();else if(ui.mode==='chart')chartRender();icons();}
 function chooseMode(mode){ui.mode=mode;remember();render();root.otoReveal(mode==='practice'?practice:area);}
 bar.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>chooseMode(b.dataset.mode)));
 app.querySelectorAll('[data-page]').forEach(b=>b.addEventListener('click',()=>{ui.page=b.dataset.page;ui.mode=ui.page==='review'?'practice':'basics';ui.step=0;ui.basicTopic=null;loadBasicAnswer();remember();render();root.otoReveal(ui.mode==='practice'?practice:area);}));
 function enhancePractice(){const activePage=app.querySelector('.oto-nav-btn.active')?.dataset.page;if(activePage&&ui.page!==activePage){ui.page=activePage;ui.mode='practice';ui.basicTopic=null;remember();render();}const grid=practice.querySelector('.oto-study-grid');if(grid&&!practice.querySelector('.oto-inline-chart')){const details=document.createElement('details');details.className='oto-inline-chart';const chord=practice.dataset.topic==='chord';details.innerHTML='<summary class="cursor-interaction">'+(chord?'コードの構成音を確認する':'音程の早見表を見る')+'</summary>'+(chord?chordTable(false,practice.dataset.range||'triads',practice.dataset.root||'C',true):practice.dataset.range==='chromatic'?chromaticTable():table(false));details.open=root.otoPracticeState?.referenceOpen===true;details.addEventListener('toggle',()=>{if(details.isConnected)root.otoSetReferenceOpen?.(details.open);});grid.after(details);const help=document.createElement('button');help.type='button';help.className='oto-link cursor-interaction';help.dataset.prerequisite='';help.innerHTML='<i data-lucide="book-open" aria-hidden="true"></i>'+(practice.querySelector('[data-practice-concept]')?'この範囲の考え方を確認する':'この問題の基礎を確認する');details.after(help);help.addEventListener('click',()=>{const concept=practice.querySelector('[data-practice-concept]');if(concept){concept.open=true;root.otoReveal(practice,'[data-practice-concept] summary');return;}const chord=practice.dataset.topic==='chord';ui.basicTopic=chord?'chord':'interval';ui.step=chord?(practice.dataset.questionId?.includes('minor')?2:1):(practice.dataset.questionId?.includes('second')?2:practice.dataset.questionId?.includes('perfect')?5:4);loadBasicAnswer();chooseMode('basics');});icons();}}
 new MutationObserver(enhancePractice).observe(practice,{childList:true});enhancePractice();
 window.addEventListener('openai:set_globals',event=>{const v=event.detail?.globals?.widgetState?.privateContent?.learning;if(v){restore(v);render();}});
 remember();render();
})();

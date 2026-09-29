const state={current:3750,goal:10000};
const el=id=>document.getElementById(id);
const fmt=n=>Math.round(n).toLocaleString('ru-RU');
function render(){const pct=Math.max(0,Math.min(100,state.current/state.goal*100));el('fill').style.width=pct+'%';el('amount').textContent=fmt(state.current)+' ₽';el('goal').textContent=fmt(state.goal)+' ₽';el('percent').textContent=Math.round(pct)+'%';}
const params=new URLSearchParams(location.search);
if(params.has('goal'))state.goal=Number(params.get('goal'))||state.goal;
if(params.has('current'))state.current=Number(params.get('current'))||state.current;
render();
if(params.has('demo'))setTimeout(()=>{state.current+=Number(params.get('demo'))||500;render()},1000);
window.vampireDonation=(amount)=>{amount=Number(amount);if(Number.isFinite(amount)&&amount>0){state.current+=amount;render();}};

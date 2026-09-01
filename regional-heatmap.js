const REGION_NAMES=['전주','군산','익산','정읍','남원','김제','완주','진안','무주','장수','임실','순창','고창','부안'];
const REGION_BASE={'전주':[99.2,100.1,96.8,95.0],'군산':[98.1,99.6,94.3,100.0],'익산':[100.0,99.8,95.1,93.8],'정읍':[96.9,99.2,92.7,100.0],'남원':[97.5,98.9,93.5,92.0],'김제':[95.6,99.1,91.8,100.0],'완주':[101.2,100.3,97.4,100.0],'진안':[94.2,97.8,89.6,90.0],'무주':[93.8,98.2,90.4,100.0],'장수':[92.6,97.5,88.9,90.0],'임실':[95.0,98.0,91.2,100.0],'순창':[94.7,98.4,90.8,90.0],'고창':[96.3,99.0,92.4,100.0],'부안':[97.1,99.3,93.1,100.0]};

function regionalRatesFor(year){
  const yearIndex=year-2021;
  return REGION_NAMES.map((region,index)=>{
    const base=REGION_BASE[region];
    const rates=base.map((value,jobIndex)=>Number((value+(yearIndex-5)*[.24,.11,.36,.18][jobIndex]+((index%3)-1)*.08).toFixed(1)));
    const overall=Number((rates[0]*.08+rates[1]*.73+rates[2]*.18+rates[3]*.01).toFixed(1));
    return {region,rates:[...rates,overall]};
  });
}

function heatStyle(rate){
  let rgb,alpha,status;
  if(rate<95){rgb='220,67,55';alpha=Math.min(.58,.18+(95-rate)*.035);status='위험'}
  else if(rate<100){rgb='234,179,8';alpha=.16+(100-rate)*.035;status='주의'}
  else{rgb='37,99,235';alpha=Math.min(.48,.18+(rate-100)*.055);status='안정'}
  return {background:`rgba(${rgb},${alpha.toFixed(2)})`,status};
}

function updateRegionalHeatmap(){
  const year=Number(document.querySelector('#year').value);
  const body=document.querySelector('#regionHeatmapBody');
  document.querySelector('#regionHeatmapSub').textContent=`${year}년 · 14개 시·군 교육지원청 및 관내 학교`;
  const rows=regionalRatesFor(year);
  body.innerHTML=rows.length?rows.map(({region,rates})=>`<tr><td>${region}</td>${rates.map((rate,index)=>{const heat=heatStyle(rate);return `<td class="heat-cell${index===rates.length-1?' heat-total':''}" style="background-color:${heat.background}" title="${region} ${rate.toFixed(1)}% · ${heat.status}">${rate.toFixed(1)}%<small>${heat.status}</small></td>`}).join('')}</tr>`).join(''):'<tr><td colspan="6" class="heatmap-empty">선택한 연도의 지역별 자료가 없습니다.</td></tr>';
}

window.addEventListener('DOMContentLoaded',()=>{
  document.querySelector('#year').addEventListener('change',updateRegionalHeatmap);
  updateRegionalHeatmap();
});

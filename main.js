'use strict';

/*
改造案
☑ランダム出題
☑複数出題
☑選択肢のシャッフル
☑正解数のカウント
☐(ツイッター共有機能)
☐問題の種類増やす?
  ☐条件:選択問題にできて、一度生成したらそのままでいい。(つまりゲームみたいに、リアルタイムでなんかやったりはできない。)
  ☐迷路を与えて最短での距離を求めさせるやばい問題
  ☐立方体
  ☐平方根を求めさせる(小数部分をずらす)
  ☐
*/

const quizData=[
    {
        title:'織田信長は何年生まれ？',
        choices:[
            {
                id:1,
                value:'1534'
            },
            {
                id:2,
                value:'1582'
            },
            {
                id:3,
                value:'1621'
            },
            {
                id:4,
                value:'1192'
            }
        ],
        correctId:1
    },
    {
        title:'city',
        choices:[
            {
                id:1,
                value:'都市'
            },
            {
                id:2,
                value:'村'
            }
        ],
        correctId:1
    },
    {
        title:"関ヶ原の戦いが起こった年は？",
        choices:[
            { id:1, value:"1600"},
            { id:2, value:"1500"},
            { id:3, value:"1550"},
            { id:4, value:"1500"},
        ],
        correctId: 1,
    }
];


for(let i=0;i<7;i++){
    const rand=getRandomInteger(4,0);
    
    const data=[
        createArithmeticQuizData,
        createCircleAreaQuizData,
        createTriangleAreaQuizData,
        createSquareRootQuizData,
        createBoxQuizData
    ][rand](100,10,4);

    quizData.push(data);
}

const indexes=[];
for(let i=0;i<quizData.length;i++){
    indexes.push(i);
}


let index,quizCount,correctCount,startTime;

const quizSentence=document.getElementById('quiz-sentence');
const quizAnswerSelect=document.getElementById('quiz-answer-select');
const quizSendButton=document.getElementById('quiz-send-button');
const quizResult=document.getElementById('quiz-result');

let useQuizData;

init();
ask();

function init(){
    index=quizCount=correctCount=0;
    shuffleArray(indexes);
    startTime=Date.now();
}

function shuffleArray(arr){
    //shuffle
    for(let i=arr.length-1;i>0;i--){
        const rand=Math.floor(Math.random()*(i+1));

        let tmp=arr[rand];
        arr[rand]=arr[i];
        arr[i]=tmp;
    }
}

function ask(){
    if(index==quizData.length){
        showResult();
        return;
    }

    quizCount++;

    //ここを繰り返せばよさげ。
    //reset
    quizSentence.innerHTML='';
    quizAnswerSelect.innerHTML='';
    quizResult.innerHTML='';

    quizSendButton.disabled=false;

    //select quizData
    useQuizData=quizData[indexes[index]];

    //display title
    quizSentence.innerHTML=`<p>Q${quizCount}. ${useQuizData.title}</p>`;

    //display choices
    const arr=[];
    for(let i=0;i<useQuizData.choices.length;i++){
        arr.push(i);
    }
    shuffleArray(arr);
    for(const i of arr){
        const choice=useQuizData.choices[i];
        const choiceInput=document.createElement('input');
        choiceInput.setAttribute('type','radio');
        choiceInput.setAttribute('name','answer');
        choiceInput.className='radio-inline-input';
        choiceInput.id=choice.id;
        
        const label=document.createElement('label');
        label.setAttribute('for',choice.id);
        label.className='radio-inline-label';
        label.innerText=choice.value;

        quizAnswerSelect.appendChild(choiceInput);
        quizAnswerSelect.appendChild(label);
    }
}

function getResult(){
    const elements=quizAnswerSelect.children;
    for(const element of elements){
        if(element.checked){
            const result=element.id==useQuizData.correctId;
            return result;
        }
    }
    return false;
}

function disableAllSelect(){
    const elements=quizAnswerSelect.children;

    for(const element of elements){
        element.setAttribute('disabled','disabled');
    }
}

quizSendButton.onclick=()=>{
    index++;
    const resultParagraph=document.createElement('p');
    if(getResult()){
        correctCount++;
        resultParagraph.innerText='正解!!';
    }else{
        resultParagraph.innerText=`不正解...。正解は「${getCorrectAnswer(useQuizData)}」`;
    }
    const nextButton=document.createElement('button');
    nextButton.innerText='次へ';
    //const countParagraph=document.createElement('p');
    //countParagraph.innerText=`正解数:${correctCount}/${quizCount}`;
    quizResult.innerHTML='';
    nextButton.onclick=ask;
    quizResult.appendChild(resultParagraph);
    quizResult.appendChild(nextButton);
    //quizResult.appendChild(countParagraph);

    quizSendButton.disabled=true;

    disableAllSelect();
}

function getRandomInteger(max,min){
    return min+Math.floor(Math.random()*(max-min+1));
}

function createArithmeticQuizData(max,min,choiceNum){
    let num1=getRandomInteger(max,min);
    let num2=getRandomInteger(max,min);

    const rand=Math.floor(Math.random()*4);

    const data={title:`${num1}${['+','-','*','/'][rand]}${num2}`,choices:[],correctId:1};

    const answer=eval(data.title);
    let option=answer;
    for(let i=1;i<=choiceNum;i++){
        data.choices.push({
            id:i,
            value:option
        });
        do{
            option+=Math.floor(Math.random()*11)-5;
        }while(option==answer);
    }
    return data;
}

function createCircleAreaQuizData(maxRadius,minRadius,choiceNum){
    const radius=getRandomInteger(maxRadius,minRadius);

    const data={title:`半径${radius}の円の面積(円周率は3.14)`,choices:[],correctId:1};

    const answer=radius**2*3.14;
    let option=answer;
    for(let i=1;i<=choiceNum;i++){
        data.choices.push({
            id:i,
            value:option
        });
        do{
            option+=Math.floor(Math.random()*11)-5;
        }while(option==answer);
    }
    return data;
}

function createTriangleAreaQuizData(maxEdgeLen,minEdgeLen,choiceNum){
    const h=getRandomInteger(maxEdgeLen,minEdgeLen);
    const w=getRandomInteger(maxEdgeLen,minEdgeLen);

    const data={title:`底辺${w}、長さ${h}の三角形の面積`,choices:[],correctId:1};

    const answer=w*h/2;
    let option=answer;
    for(let i=1;i<=choiceNum;i++){
        data.choices.push({
            id:i,
            value:option
        });
        do{
            option+=Math.floor(Math.random()*11)-5;
        }while(option==answer);
    }
    return data;
}

function createSquareRootQuizData(max,min,choiceNum){
    const baseNum=getRandomInteger(max,min);

    const data={title:`√${baseNum}`,choices:[],correctId:1};

    const answer=Math.sqrt(baseNum);
    let option=answer;
    for(let i=1;i<=choiceNum;i++){
        data.choices.push({
            id:i,
            value:option
        });
        do{
            option+=(Math.floor(Math.random()*11)-5)/10;
        }while(option==answer);
    }
    return data;
}

function createBoxQuizData(maxEdgeLen,minEdgeLen,choiceNum){
    const x=getRandomInteger(maxEdgeLen,minEdgeLen);
    const y=getRandomInteger(maxEdgeLen,minEdgeLen);
    const z=getRandomInteger(maxEdgeLen,minEdgeLen);

    const data={title:`幅${x}、高さ${y}、奥行${z}の直方体の体積`,choices:[],correctId:1};

    const answer=x*y*z;
    let option=answer;
    for(let i=1;i<=choiceNum;i++){
        data.choices.push({
            id:i,
            value:option
        });
        do{
            option+=Math.floor(Math.random()*11)-5;
        }while(option==answer);
    }
    return data;
}

function getCorrectAnswer(data){
    for(const choice of data.choices){
        if(choice.id==data.correctId)
            return choice.value;
    }
}

function showResult(){
    const time=(Date.now()-startTime)/1000;
    const sec=Math.round((time%60)*10)/10;
    const min=Math.floor(time/60);
    document.getElementsByClassName('content-top')[0].innerHTML=`<h1>終了!!</h1><p class="text-content">かかった時間:${min}分${sec}秒<br/>正解数:${correctCount}/${quizCount}</p><p class="text-content">リロードして再トライしてね。</p>`;
}
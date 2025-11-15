let score = (JSON.parse(localStorage.getItem('score'))) ||
  {
  wins: 0,
  lose: 0
  }; 

  let isAutoPlaying = false;
  let intervalId;

  function autoPlay() {
  if(!isAutoPlaying){
    intervalId = setInterval(() => {
    const move = moveGenerator();
    playGame(move);
  },1000);

  isAutoPlaying = true;
  }
  else {
    clearInterval(intervalId);
    isAutoPlaying = false;
  }
  }

  let record = 0;

  function playGame (playerMove) {
  let resetHTML = '';
  let computerMove = moveGenerator();

  let result;
  if(playerMove === computerMove){
  result = 'You Won.'
  score.wins += 1;
  } else {
  result = 'You Lose.'
  score.lose += 1;
  }

  localStorage.setItem('score', JSON.stringify(score));

  document.querySelector('.js-result')
  .innerHTML = `${result}`;

  document.querySelector('.js-move')
  .innerHTML = `You
   <img src="images/${playerMove}.jpg" class="js-img">
   , Outcome 
   <img src="images/${computerMove}.jpg" class="js-img">`;

  document.querySelector('.js-score')
  .innerHTML = `Score: Wins: ${score.wins}, Lose:${score.lose}`;

  resetHTML += `
  <p class="js-consecutive-wins wins-record"></p>
    `;

  document.querySelector('.js-updates')
  .innerHTML = resetHTML;

  if(result === 'You Won.'){
  record += 1;
  } else {
  record = 0;
  }
  if(record === 3) {
  document.querySelector('.js-consecutive-wins')
    .innerHTML = 'You won 3 times in a row!';
  record = 0;
  }
  }

  function moveGenerator () {
  const randomNumber = Math.random();
  let move = '';
  if(randomNumber >= 0 && randomNumber < 1/2) {
  move = 'heads';
  } else{
  move = 'tails';
  }
  return move;
  }

  function resetScore() {
  score.wins = 0;
  score.lose = 0;

  document.querySelector('.js-score')
  .innerHTML = `Score: Wins: ${score.wins}, Lose:${score.lose}`;

  localStorage.setItem('score', JSON.stringify(score));
  }

  document.querySelector('.js-score')
  .innerHTML = `Score: Wins: ${score.wins}, Lose:${score.lose}`;

  document.querySelector('.js-auto-play')
  .addEventListener('click', () => {
    autoPlay();
    
  });



        
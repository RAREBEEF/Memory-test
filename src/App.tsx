import React, { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./App.module.scss";
import "./App.module.scss";

// TODO:클리어문구 보여주기, 클리어문구 보여줄 동안 카운트다운x & 카운트 시작과 동시에 카드 보여주기

function App() {
  // 최초 시작
  const [start, setStart] = useState<boolean>(false);
  // 카드 엘리먼트 배열
  const [cardEls, setCardEls] = useState<any>([]);
  // 각 카드의 key 역할을 할 아이템을 담은 배열
  const cards = useMemo(
    () => Array.from(new Array(cardEls.length), (x, i) => i + 1),
    [cardEls]
  );
  // 카드의 개수
  const cardCount = useMemo(() => cards.length, [cards]);
  // 현재 라운드
  const [round, setRound] = useState<number>(1);
  // 난이도
  const [difficulty, setDifficulty] = useState<number>(3);
  // 라운드 시작 여부(클릭 가능 여부 결정)
  const [roundRunning, setRoundRunning] = useState<boolean>(false);
  // 정답
  const [answer, setAnswer] = useState<Array<string | number>>([""]);
  // 클릭 횟수
  const [clickCount, setClickCount] = useState<number>(0);
  // 클릭된 카드
  const [clickedCards, setClickedCards] = useState<Array<string>>([]);
  // 실패 여부
  const [isFail, setIsFail] = useState<boolean>(false);
  // 성공 여부
  const [isSuccess, setIsSuccesss] = useState<boolean>(false);
  // 라운드 시작 카운트다운
  const [countdown, setCountdown] = useState<number>(4);
  // 게임오버 카운트다운 클리너
  const [endCountdownClear, setEndCountdownClear] = useState<any>(() => {});

  const restart = () => {
    cardEls.forEach((el: any) => {
      el.style.backgroundColor = "skyblue";
    });

    setRound(1);
    setIsFail(false);
    setStart(false);
    setCountdown(4);
  };

  // 카드 클릭 함수
  const onCardClick = (e: any) => {
    // 라운드 시작 전 or 중복 클릭
    if (!roundRunning || clickedCards.indexOf(e.target.id) !== -1) {
      return;
    }

    // 오답일 경우 & 오답 아닐 경우
    if (answer.indexOf(e.target.id) === -1) {
      e.target.style.backgroundColor = "red";

      gameover();
      clearTimeout(endCountdownClear);

      return;
    } else {
      e.target.style.backgroundColor = "green";
    }

    // 클릭수와 정답개수가 동일하면 다음 라운드, 아닐 경우 계속 클릭 진행
    if (clickCount + 1 === answer.length) {
      nextRound();
      setIsSuccesss(true);
    } else {
      setClickCount((prev) => prev + 1);
      setClickedCards((prev) => [...prev, e.target.id]);
    }
  };

  // 게임오버
  const gameover = () => {
    setIsFail(true);
    setRoundRunning(false);
    setClickCount(0);
  };

  // 다음 라운드 진행 전 초기화
  const nextRound = () => {
    console.log("success");
    clearTimeout(endCountdownClear);
    setClickCount(0);
    setClickedCards([]);
    setCountdown(4);
    setRoundRunning(false);
    setRound((prev) => prev + 1);
  };

  // 1초 대기
  // 카운트 시작 & 색 표시
  //
  //

  // 라운드 시간제한
  const endCountdown = useCallback((time = 9000) => {
    const endTimer = setTimeout(() => {
      console.log("end");
      gameover();
    }, time);

    setEndCountdownClear(endTimer);
  }, []);

  // 라운드 시작
  const roundStart = useCallback(() => {
    if (!start) {
      return;
    }

    const delayTimer = setTimeout(() => {
      setIsSuccesss(false);

      cardEls.forEach((el: any) => {
        el.style.backgroundColor = "skyblue";
      });

      const newAnswer = [...cards].map((card) => card.toString());

      for (let i = cardCount - round, j = cardCount - 1; i !== 0; i--, j--) {
        const pick = Math.round(Math.random() * j);
        newAnswer.splice(pick, 1);
      }

      setAnswer(newAnswer);

      console.log(newAnswer);

      cardEls.forEach((el: any) => {
        if (newAnswer.indexOf(el.id) !== -1) {
          el.style.backgroundColor = "white";
        }
      });
    }, 1000);

    const countdown = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    const colorTimer = setTimeout(() => {
      cardEls.forEach((el: any) => {
        el.style.backgroundColor = "skyblue";
      });
    }, 2500);

    const startTimer = setTimeout(() => {
      setRoundRunning(true);
      setCountdown(0);
      clearTimeout(countdown);
    }, 4000);

    endCountdown();

    return { colorTimer, startTimer, countdown, delayTimer };
  }, [cardCount, cardEls, cards, endCountdown, round, start]);

  //
  //
  //
  //

  // 카드 엘리먼트 불러오기
  useEffect(() => {
    setCardEls(document.querySelectorAll(`.${styles.card}`));
  }, []);

  // 게임오버 카운트다운 클리어
  useEffect(() => {
    return () => {
      clearTimeout(endCountdownClear);
    };
  });

  //
  //

  useEffect(() => {
    if (!start) {
      return;
    }

    const { colorTimer, startTimer, countdown, delayTimer }: any = roundStart();

    return () => {
      clearTimeout(colorTimer);
      clearTimeout(startTimer);
      clearTimeout(countdown);
      clearTimeout(delayTimer);
    };
  }, [roundStart, start]);

  return (
    <div className={styles.container}>
      {(!start || isFail) && (
        <div className={styles.start}>
          <span
            className={styles["start__text"]}
            onClick={() => {
              if (isFail) {
                restart();
              } else {
                setStart(true);
              }
            }}
          >
            {isFail ? "Restart" : "Start"}
          </span>
        </div>
      )}
      <h2 className={styles.status}>
        {isFail
          ? "Fail"
          : isSuccess
          ? "Success"
          : start && (countdown === 0 ? "Start" : countdown !== 4 && countdown)}
      </h2>
      <div className={styles.board}>
        <div className={styles.row}>
          <div id="1" className={styles.card} onClick={onCardClick}></div>
          <div id="2" className={styles.card} onClick={onCardClick}></div>
          <div id="3" className={styles.card} onClick={onCardClick}></div>
          <div id="4" className={styles.card} onClick={onCardClick}></div>
        </div>
        <div className={styles.row}>
          <div id="5" className={styles.card} onClick={onCardClick}></div>
          <div id="6" className={styles.card} onClick={onCardClick}></div>
          <div id="7" className={styles.card} onClick={onCardClick}></div>
          <div id="8" className={styles.card} onClick={onCardClick}></div>
        </div>
        <div className={styles.row}>
          <div id="9" className={styles.card} onClick={onCardClick}></div>
          <div id="10" className={styles.card} onClick={onCardClick}></div>
          <div id="11" className={styles.card} onClick={onCardClick}></div>
          <div id="12" className={styles.card} onClick={onCardClick}></div>
        </div>
        <div className={styles.row}>
          <div id="13" className={styles.card} onClick={onCardClick}></div>
          <div id="14" className={styles.card} onClick={onCardClick}></div>
          <div id="15" className={styles.card} onClick={onCardClick}></div>
          <div id="16" className={styles.card} onClick={onCardClick}></div>
        </div>
      </div>
    </div>
  );
}

export default App;

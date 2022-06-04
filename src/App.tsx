import React, { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./App.module.scss";
import "./App.module.scss";

// TODO:클리어문구 보여주기, 클리어문구 보여줄 동안 카운트다운x & 카운트 시작과 동시에 카드 보여주기

function App() {
  const [start, setStart] = useState<boolean>(false);
  const [cardEls, setCardEls] = useState<any>([]);
  const cards = useMemo(
    () => Array.from(new Array(cardEls.length), (x, i) => i + 1),
    [cardEls]
  );
  const cardCount = useMemo(() => cards.length, [cards]);

  const [round, setRound] = useState<number>(1);
  const [roundRunning, setRoundRunning] = useState<boolean>(false);
  const [answer, setAnswer] = useState<Array<string | number>>([""]);
  const [clickCount, setClickCount] = useState<number>(0);
  const [clickedCards, setClickedCards] = useState<Array<string>>([]);
  const [isFail, setIsFail] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(3);

  const onCardClick = (e: any) => {
    // 라운드 시작 전 or 중복 클릭
    if (!roundRunning || clickedCards.indexOf(e.target.id) !== -1) {
      return;
    }

    // 오답일 경우 & 오답 아닐 경우
    if (answer.indexOf(e.target.id) === -1) {
      e.target.style.backgroundColor = "red";

      setIsFail(true);
      setRoundRunning(false);

      return;
    } else {
      e.target.style.backgroundColor = "white";
    }

    // 클릭수와 정답개수가 동일하면 다음 라운드, 아닐 경우 계속 클릭 진행
    if (clickCount + 1 === answer.length) {
      console.log(clickCount + 1, answer.length);
      nextRound();
    } else {
      setClickCount((prev) => prev + 1);
      setClickedCards((prev) => [...prev, e.target.id]);
    }
  };

  const nextRound = () => {
    console.log("success");
    setClickCount(0);
    setClickedCards([]);
    setAnswer([]);
    setCountdown(3);
    setRoundRunning(false);
    setRound((prev) => prev + 1);
  };

  //
  //
  //
  //

  const roundStart = useCallback(() => {
    if (!start) {
      return;
    }

    const delayTimer = setTimeout(() => {
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
          el.style.backgroundColor = "green";
        }
      });
    }, 1000);

    const colorTimer = setTimeout(() => {
      cardEls.forEach((el: any) => {
        el.style.backgroundColor = "skyblue";
      });
    }, 2500);

    const startTimer = setTimeout(() => {
      cardEls.forEach((el: any) => {
        setRoundRunning(true);
        setCountdown(0);
      });
      clearTimeout(countdown);
    }, 3000);

    const countdown = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return { colorTimer, startTimer, delayTimer, countdown };
  }, [cardCount, cardEls, cards, round, start]);

  //
  //
  //
  //

  useEffect(() => {
    setCardEls(document.querySelectorAll(`.${styles.card}`));
  }, []);

  //
  //

  useEffect(() => {
    if (!start) {
      return;
    }
    const { colorTimer, startTimer, delayTimer, countdown }: any = roundStart();

    return () => {
      clearTimeout(colorTimer);
      clearTimeout(startTimer);
      clearTimeout(delayTimer);
      clearTimeout(countdown);
    };
  }, [roundStart, start, round]);

  return (
    <div className={styles.container}>
      <h2 className={styles.round}>{round}</h2>
      <h2 className={styles.round}>{isFail && "Fail"}</h2>

      <h2 className={styles.round}>
        {start && (countdown === 0 ? "Start" : countdown)}
      </h2>

      <div
        className={styles.board}
        onClick={() => {
          setStart(true);
        }}
      >
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

import React, { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./App.module.scss";
import "./App.module.scss";

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

  // 현재 라운드
  const [round, setRound] = useState<number>(1);
  // 난이도(보드 크기)
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
    setDifficulty(3);
    setIsFail(false);
    setStart(false);
    setCountdown(4);
  };

  // 다음 라운드 진행 전 초기화
  const nextRound = useCallback(() => {
    console.log("success");
    clearTimeout(endCountdownClear);
    setClickCount(0);
    setClickedCards([]);
    setCountdown(4);
    setRoundRunning(false);
    setRound((prev) => prev + 1);
  }, [endCountdownClear]);

  // 게임오버
  const gameover = useCallback(() => {
    cardEls.forEach((el: any) => {
      if (answer.indexOf(el.id) !== -1 && clickedCards.indexOf(el.id) === -1) {
        el.style.backgroundColor = "white";
      }
    });
    setIsFail(true);
    setRoundRunning(false);
    setClickCount(0);
  }, [answer, cardEls, clickedCards]);

  // 카드 클릭 함수
  const onCardClick = useCallback(
    (e: any) => {
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
    },
    [
      answer,
      clickCount,
      clickedCards,
      endCountdownClear,
      gameover,
      nextRound,
      roundRunning,
    ]
  );

  // 라운드 시간제한
  const endCountdown = useCallback((time = 9000) => {
    const endTimer = setTimeout(() => {
      console.log("end");
      gameover();
    }, time);

    setEndCountdownClear(endTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changeDifficulty = useCallback(
    (num: number) => {
      cardEls.forEach((el: any) => {
        el.style.backgroundColor = "skyblue";
      });

      setDifficulty(num);
    },
    [cardEls]
  );

  // 라운드 시작
  const roundStart = useCallback(() => {
    if (!start) {
      return;
    }

    if (round === 5) {
      changeDifficulty(4);
    } else if (round === 9) {
      changeDifficulty(5);
    } else if (round === 13) {
      changeDifficulty(6);
    }

    const delayTimer = setTimeout(() => {
      setIsSuccesss(false);

      cardEls.forEach((el: any) => {
        el.style.backgroundColor = "skyblue";
      });

      const newAnswer = [...cards].map((card) => card.toString());

      for (
        let i = difficulty ** 2 - round, j = difficulty ** 2 - 1;
        i !== 0;
        i--, j--
      ) {
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
  }, [
    cardEls,
    cards,
    changeDifficulty,
    difficulty,
    endCountdown,
    round,
    start,
  ]);

  // 카드 엘리먼트 불러오기
  useEffect(() => {
    setCardEls(document.querySelectorAll(`.${styles.card}`));
  }, [difficulty]);

  // 게임오버 카운트다운 클리어
  useEffect(() => {
    return () => {
      clearTimeout(endCountdownClear);
    };
  });

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

  const rows = useCallback(() => {
    const rowsResult: Array<any> = [];

    const cardDeck = (i: number) => {
      const cardDeckResult: Array<any> = [];

      for (let j = 1; j <= difficulty; j++) {
        const id = -difficulty + j + difficulty * i;
        cardDeckResult.push(
          <div
            id={`${id}`}
            key={`${id}`}
            className={styles.card}
            onClick={onCardClick}
          ></div>
        );
      }

      return cardDeckResult;
    };

    for (let i = 1; i <= difficulty; i++) {
      rowsResult.push(
        <div key={i} className={styles.row}>
          {cardDeck(i)}
        </div>
      );
    }

    return rowsResult;
  }, [difficulty, onCardClick]);

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
      <div className={styles.board}>{rows()}</div>
    </div>
  );
}

export default App;

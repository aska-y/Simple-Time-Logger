import { useState, useRef, type MouseEvent } from "react";
import dayjs from "dayjs";
import ja from "dayjs/locale/ja";
import type { StopWatchDataType } from '../../types';

type StopWatchProps = {
    fromStopWatch: (data: StopWatchDataType) => void;
};

function StopWatch({ fromStopWatch }: StopWatchProps){
    const [ elapsedTime, setElapsedTime] = useState(0); //経過時間
    const [ isCounting, setIsCounting] = useState(false); //カウント中か否か
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null); //タイマー

    // // ミリ秒を時分秒に分けて2桁の整数にして格納
    const hours = `0${Math.floor(elapsedTime  / 1000 / 60 / 60)}`.slice(-2);
    const minutes = `0${Math.floor(elapsedTime / 1000 / 60) % 60}`.slice(-2);
    const seconds = `0${Math.floor(elapsedTime / 1000) % 60}`.slice(-2);

    const handleStart = (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      setIsCounting(true);
      // 1000ミリ秒ごとに経過時間を更新
      intervalRef.current = setInterval(() =>{
        setElapsedTime( prevElapsedTime => prevElapsedTime + 1000);
      },1000);
    }

    const handlePause = (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
      setIsCounting(false);
    }

    const handleStop = (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if(elapsedTime == 0){ return }
      dayjs.locale(ja);
      const date = Date.now();//一意のidとしても使用
      const data = ({
        "date": date,
        "elapsedTime":elapsedTime
      });

      fromStopWatch(data);//ProjectDetailにデータを送付
      
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
      setIsCounting(false);
      setElapsedTime(0);
    }


    return (
        <div>
            <div className="detail-main__watch u-font-point">
                <span className="hour">{hours}</span>
                <span className="separator">:</span>
                <span className="minute">{minutes}</span>
                <span className="second">{seconds}</span>
            </div> 

            <div className={`detail-main__btns u-flex-ctr ${isCounting ? 'is-counting' : ''}`}>
                {/* スタートとポーズを切り替えるボタン --> */}
                {isCounting ? (
                <button className="watch-btn -pause" onClick={handlePause}>
                  <span className="material-symbols-outlined watch-btn__icon icon-pause">pause_circle</span>
                  <span className="watch-btn-txt">PAUSE<br /><br /></span>
                </button>
                ):(
                <button className="watch-btn -start" onClick={handleStart}> 
                  <span className="material-symbols-outlined watch-btn__icon icon-start">play_circle</span>
                  <span className="watch-btn-txt">START<br /><br /></span>
                </button>
                  )}
                {/* <!-- ストップ/記録 --> */}
                <button id="js-watch-stop" className="watch-btn -stop" onClick={handleStop}>
                  <span className="material-symbols-outlined icon-stop watch-btn__icon">stop_circle</span>
                  <span className="watch-btn-txt">STOP&<br />RECORD</span>
                </button>
            </div>
        </div>
    );
}

export default StopWatch;
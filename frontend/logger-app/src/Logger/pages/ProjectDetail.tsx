import { useEffect, useState, type ChangeEvent, type FocusEvent } from 'react';
import { useParams } from 'react-router';
import dayjs from "dayjs";
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

import { fetchProjectDetail, updateProject} from '../api/ApiProject';
import type { ProjectType, StopWatchDataType, UpdatedItemType } from '../../types';

import Loading from '../components/Loading';
import ProjectListBar from '../components/ProjectListBar';
import StopWatch from '../components/StopWatch'
import CreateButton from '../components/CreateButton';


function ProjectDetail() {
  document.body.classList.add('project-detail'); //bodyタグにclass追加
  const { id } = useParams(); //idを取得
  
  //日付関連の設定
  dayjs.extend(utc);
  dayjs.extend(timezone);

  //日付のフォーマット
  const formattedDate = (date:string) => {
    return dayjs(date).format("YYYY/MM/DD");
  };
  const formattedDateShort = (date:string) => {
    return dayjs(date).format("YY/MM/DD");
  };

  //useStateの設定
  const [ project, setProject ] = useState<ProjectType | null>(null);
  const [ isLoading, setIsLoading] = useState(true);
  const [ , setIsError] = useState<string | null>(null);


  // APIから詳細取得してprojectに格納
  const fetchData = async () => {
    if (!id) {
      console.log('idがありません');
      setIsLoading(false);
      return;
    }
    try {
      const response = await fetchProjectDetail(id);
      const data = response.data;

      //重複を削除した日付のリストを作成してdataに追加
      const daysList = data.time_record.map((day: { date: string }) => formattedDate(day.date));
      const uniqueDays = Array.from(new Set(daysList));//重複を削除
      data.uniqueDays = uniqueDays;//dataにuniqueDaysを追加
      
      //projectに格納
      setProject(data);
      console.log('↓fetchData -------------------')
      console.log(data)

    } catch (error) {
      if (error instanceof Error) {
        setIsError(error.message || 'エラーが発生しました');
        setIsError(error.message); 
      } else {
        setIsError("不明なエラーが発生しました");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]); 

  // 更新された情報をAPIへ送る
  const updateData = async (updatedItem:UpdatedItemType) => {
    if (!id) {
      console.log('idがありません');
      return;
    }
    setIsLoading(true);
    try {
      const response = await updateProject( {id},  updatedItem );
      console.log('データを更新しました:', JSON.stringify(response.data));
    } catch (error) {

      if (error instanceof Error) {
        setIsError(error.message);
        console.error('更新エラー:', error);
        setIsError(error.message); 
      } else {
        // Errorオブジェクトではない場合（文字列など）の処理
        setIsError("不明なエラーが発生しました");
      }
    } finally {
      setIsLoading(false);
    }
  };

  //onChangeで完了/未完了を更新する
  const handleIsCompleted = (e: ChangeEvent<HTMLInputElement>) => {
    if (!project) {
      return;
    }
    //チェックした日時を取得
    let completed_at = "";
    if(project.is_completed == false){
      completed_at = dayjs().tz("Asia/Tokyo").format('YYYY-MM-DDTHH:mm:ssZ');
    }else{
      completed_at = "";
    }

    // Stateを更新してUIは即座に反映させる
    setProject((prev) => {
      if (!prev) {
        return prev;
      }
      return {
        ...prev,
        ["is_completed"]: e.target.checked,["completed_at"]: completed_at,
      };
    });

    //APIへデータを送信
    const updatedItem= { ["is_completed"] : e.target.checked,  ["completed_at"]: completed_at,};
    updateData(updatedItem);
  }

  //onChangeで変更を更新する
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    // Stateを更新してUIは即座に反映させる
    setProject((prev) => {
      if (!prev) {
        return prev;
      }
      return {
        ...prev,
        [e.target.name]: e.target.value 
      };
    })
  }

  //onBlurでAPIへデータを送信
  const handleBlur = (e: FocusEvent<HTMLTextAreaElement>) => {
    const updatedItem = { [e.target.name]: e.target.value };
    updateData(updatedItem);
  }
  
  // StopWatchから受け取ったデータ stopボタン押下で日付とタイムを投げる
  const fromStopWatch = (stopWatchData:StopWatchDataType) => {

    // 受け取ったデータの成形
    const formattedDate = dayjs(stopWatchData.date).tz("Asia/Tokyo").format('YYYY-MM-DDTHH:mm:ssZ');
    const elapsedTime = stopWatchData.elapsedTime; //秒で入っている
    const elapsedTime_ms = elapsedTime/1000;//ミリ秒に変換

    const new_time_record ={
        "date": formattedDate,
        "duration": elapsedTime_ms,//ミリ秒で送信
    }
    const updatedItem= { time_record:[new_time_record] };

    updateData(updatedItem);
    fetchData();
  }

  if (isLoading) {
    return <Loading />;
  }
    
  // エラー確認用のコード
  // throw new Error("エラーページのテスト");

  return (
    <>
      {/* projectの中身を表示 */}
      {/* <pre>{JSON.stringify(project, null, 2)}</pre> */}
      
      {project && (
        <>
        <ProjectListBar currentId = {id ?? ""}/>

        <CreateButton/>

        <section className="detail-main u-txt-ctr">
          <form>
              <div className="c-inner">
                <h2 className="detail-main__title">
                  <textarea name="title" rows={1} cols={100} placeholder= "プロジェクト名を入力してください" value={project.title} onChange={ handleChange } onBlur={ handleBlur } />
                </h2>

                <StopWatch fromStopWatch={fromStopWatch}/>

                <div className="detail-main__contents">
                    <div className="param-box param-box__total-time">
                        <span className="c-label -accent">Total Time</span><span className="detail-total-time">{project.grand_total_time}</span>
                    </div>
                    <div className="param-box">
                        <span className="c-label">Start date</span>{project.created_at ? formattedDate(project.created_at) : '----/--/--'}
                        <span className="c-label">Working</span> {project.uniqueDays?.length ?? 0} Days / {Array.isArray(project.time_record) ? project.time_record.length : 0} Sessions
                    </div>
                    <div className="param-box">
                        <span className="c-label">Completion date</span>
                        {project.is_completed && project.completed_at ? formattedDate(project.completed_at) : '----/--/--'}

                        <div className="param-box__check">
                            <label className={`c-checkbox ${project.is_completed ? "is_completed":"" }`} >
                              <input type="checkbox" checked={project.is_completed} onChange={handleIsCompleted} />
                              {project.is_completed ? 'プロジェクト完了' : 'プロジェクト完了'}
                            </label>
                        </div>

                    </div>
                    
                    <div className="memo u-txt-left">
                        <span className="c-label memo__label">Memo</span>
                        <div className="js-memo">
                            <textarea name="comment" rows={4} cols={100} placeholder="メモを残すことができます" value = {project.comment}  onChange={ handleChange} onBlur={handleBlur}/>
                        </div>
                    </div>
                </div>

              </div>
          </form>
        </section>
          
        <section className="detail-timelist c-inner">
            <h2 className="c-title">Activity log</h2>
            <table className="detail-timelist__table">
                <thead>
                    <tr>
                      <th>Date<span className="material-symbols-outlined">unfold_more</span></th>
                      <th>Time</th>
                      <th>Total</th>
                    </tr>
                </thead>
                <tbody>
    
                {(Array.isArray(project.time_record) ? project.time_record : []).map((item) => {

                  return(
                  <tr key={item.id}>
                      <td className="date"><span className="u-pc-only">20</span>{formattedDateShort(item.date)}</td>
                      <td className="time">{item.duration}</td>
                      <td className="time -total">{item.total_time}</td>
                  </tr>
                  )
                })}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={3}><strong>TOTAL&nbsp;&nbsp;&nbsp;</strong>Days : {project.uniqueDays?.length ?? 0}  / Sessions : {Array.isArray(project.time_record) ? project.time_record.length : 0}  / Time : {project.grand_total_time}</td>
                    </tr>
                </tfoot>
            </table>
        </section>
        </>
      )}
    </>
  );

  }
  
  export default ProjectDetail;
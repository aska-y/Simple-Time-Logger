import { useEffect, useState  } from 'react'
import { Link } from 'react-router';

import { fetchProjectList, deleteProject } from "../api/ApiProject";
import type { ProjectType } from '../../types';

import Loading from "../components/Loading";
import CreateButton from '../components/CreateButton';
import ArchiveLinkBtns from '../components/ArchiveLinkBtns';

import dayjs from "dayjs";
import ja from "dayjs/locale/ja";

function ProjectList() {

  const [projectList, setProjectList] = useState<ProjectType[]>([]); 
  const [filter, setFilter] = useState('active');
  const [filteredProjectList, setFilteredProjectList] = useState<ProjectType[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [, setIsError] = useState<string | null>(null);

  // APIから情報取得
  const fetchProject = async () => {
    try {
      const response = await fetchProjectList();
      setProjectList(response);
      // console.log(response)
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


  useEffect(() => { //初回のみ
    document.body.classList.add('project-archive');
    fetchProject();
  }, []);

  useEffect(() => {
    if (filter === 'completed') {
      setFilteredProjectList(projectList.filter(project => project.is_completed));
    } else if (filter === 'active') {
      setFilteredProjectList(projectList.filter(project => !project.is_completed));
    } else {
      setFilteredProjectList(projectList); 
    }
  }, [filter, projectList]);

  //日付のフォーマット
  dayjs.locale(ja);
  const formattedDate = (created_at:string) => {
    return dayjs(created_at).format("YYYY-MM-DD");
  };

  // プロジェクトを削除する
  const handleDeleteProject = async (id:string) => {
    setIsLoading(true);
    try {
      const response = await deleteProject(id);
      console.log('プロジェクトを削除しました:', response);
      fetchProject();//再読み込み
    } catch (error) {
        if (error instanceof Error) {
          setIsError(error.message || '削除失敗');
          setIsError(error.message); 
        } else {
          setIsError("不明なエラーが発生しました");
        }      
    } finally {
      setIsLoading(false);
    }
  };


  const handleFilter = (newFilter:string) =>{
    setFilter(newFilter)
  }

  if (isLoading) {
    return <Loading />;
  }

  // エラー確認用のコード
  // throw new Error("エラーページのテスト");

  return (
    <div className="archive-content c-inner">
      <CreateButton/>

      <h2 className="c-title u-txt-ctr"> {filter} Projects</h2>

      <ArchiveLinkBtns handleFilter={handleFilter} currentFilter={filter}/>

      <div className="archive-item-wrap">
        {filteredProjectList
          .map((project) => (
          <div key={project.id} className={'archive-item project-'+ project.id}>
            <button className="c-btn-delete" onClick={() => handleDeleteProject(project.id)}>Delete</button> 

            <Link to={`/projects/${project.id}`}>
              <h2 className="title">
                {project.title}
                {project.is_completed && <span className="title-flag">Completed</span>}
              </h2>

              <div className="data u-flex">
                <div className="total-time">
                  <span className="c-label -accent">Total</span><span>{project.grand_total_time}</span>
                </div>
                <div className="date">
                  <span className="c-label">Started</span><span>{ project.created_at ? formattedDate(project.created_at) : '----/--/--' }</span>
                </div>
                <div className="date">
                 {project.is_completed ? (
                    <><span className="c-label u-pc-only">Completion</span><span className="c-label u-sp-only">COMP</span> { project.completed_at ? formattedDate(project.completed_at) : '' }</>
                  ) : (
                    <><span className="c-label">Updated</span> { project.updated_at ? formattedDate(project.updated_at) : '' }</>
                  )}
                </div>
              </div>
              <div className="comment">
                <span className="c-label">Memo</span>
                <p>{project.comment}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <ArchiveLinkBtns handleFilter={handleFilter} currentFilter={filter}/>

    </div>
  )
}

export default ProjectList

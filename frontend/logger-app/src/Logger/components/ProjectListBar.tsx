import { useEffect, useState } from "react";
import { Link } from 'react-router';
import type { ProjectType } from '../../types';

import ScrollContainer from 'react-indiana-drag-scroll';//PCで横ドラッグスクロール
import { fetchProjectList } from "../api/ApiProject";

function ProjectListBar({currentId} : {currentId: string}){
  const [projectList, setProjectList] = useState([]); 
  const [, setIsError] = useState<string | null>(null);


  // APIから情報取得
  const fetchProject = async () => {
    try {
      const response = await fetchProjectList();
      setProjectList(response);
    } catch (error) {
      if (error instanceof Error) {
        setIsError(error.message || 'エラーが発生しました');
        console.error(error.message);
      } else {
        console.error("An unknown error occurred", error);
      }
    } finally {
    }
  };

  useEffect(() => {
    fetchProject();
  }, []);


  return (

    <div className="projects-list-bar__wrap">
      <ScrollContainer className="projects-list-bar">
        {projectList
          .filter((project: ProjectType) => project.is_completed === false)
          .map((project: ProjectType) => (
            <div key={project.id} className = {`projects-list-bar__item project-${project.id} ${currentId == project.id ? 'is-active' : ''}`}> 
              <Link to={`/projects/${project.id}`}>{project.title}</Link>
            </div>
        ))} 
      </ScrollContainer>
    </div>

  )
}

export default ProjectListBar;

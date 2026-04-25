import axiosInstance from "./AxiosInstance.tsx";
import type { ProjectType , UpdatedItemType } from '../../types';

//プロジェクト一覧の取得
export const fetchProjectList = async () => {
  const response = await axiosInstance.get('/api/projects');
  return await response.data;
};

//プロジェクト詳細の取得
export const fetchProjectDetail = async (id: string) => {
  const response = await axiosInstance.get(`/api/projects/${id}`);
  return await response;
};

//プロジェクトの追加
export const createProject = async (title:string) => {
  try{
    const response = await axiosInstance.post('/api/projects/', {
      title: title,
      comment: '',
      is_completed: false,
      time_record:[],
    });
    // console.log(response);
    return response.data.id;
  }catch(error){
    if (error instanceof Error) {
      console.log(error.message); // 正しく文字列として扱える
    } else {
      console.log('予期せぬエラーが発生しました', error);
    }
    // console.error(error.response.data)
  }
};

//プロジェクトの変更
export const updateProject = async (project:ProjectType, updatedItem:UpdatedItemType) => {
  const response = await axiosInstance.patch(`/api/projects/${project.id}/`, updatedItem);
  return await response;
};

//プロジェクトの削除
export const deleteProject = async (id:string) => {
  const response = await axiosInstance.delete(`/api/projects/${id}/`);
  return await response;
};
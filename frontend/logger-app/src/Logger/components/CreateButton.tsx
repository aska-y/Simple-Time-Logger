import {  useState } from 'react'
import { useNavigate } from 'react-router';
import { useForm } from "react-hook-form";
import { createProject } from '../api/ApiProject';
import Loading from "../components/Loading";

type CreateProjectFormValues = {
  title: string;
};

const CreateButton = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<CreateProjectFormValues>();
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePopup = () => {
    setIsActive(true)
  }
  
  const handleCancel = () => {
    setIsActive(false)
  }

  const onSubmit = async (formData: CreateProjectFormValues) => {
    setIsLoading(true);
    try {
      const title = formData.title;
      const id = await createProject(title);
      setIsSuccess(true)
      setTimeout(() => { //500ms後に遷移
        navigate(`/projects/${id}`);
      }, 500);

    } catch (error) {
      console.error(error);
      console.error('新規作成エラー:', error);

    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading) {
    return <Loading />;
  }


  return (
    <>
    <button className="c-btn-popup" onClick={handlePopup}>
      <span className="icon material-symbols-outlined">add</span>
      <span>Add</span>
    </button>

    <div className={`popup-wrapper ${isActive ? 'is-active ' : ''}`} >
      <div className="popup-bg" onClick={handleCancel}></div>
      <div className="popup-box">
        <div className="popup-box__inner">
          <h2 className="c-title">Create New Project</h2>

          <form onSubmit={handleSubmit(onSubmit)}>
            <textarea {...register("title", { required: "プロジェクト名は必ず入力してください" }) } placeholder= "プロジェクト名を入力してください"  />
            {errors.title?.message && <p className="c-txt-error">{String(errors.title.message)}</p>}

            <div className="popup-box__btns u-flex-ctr">
              <button className="c-btn -round -outlined" onClick={handleCancel}>Cancel</button>
              <button type="submit" className="c-btn -point -round">Create</button>
            </div>
          </form>
          {isSuccess && <p className="c-txt-success">プロジェクトが作成されました！</p>}

        </div>
      </div>
    </div>
    </>

  );
};

export default CreateButton;

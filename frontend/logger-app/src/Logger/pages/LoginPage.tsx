import { useState } from 'react'
import LoginForm from "../components/LoginForm"
import ResisterForm from "../components/ResisterForm"

const LoginPage = () => {
  // タブ切り替え
  const [isActiveTab, setIsActiveTab] = useState(0);

  const tabs = [
    { title: 'ログイン', content: <LoginForm/> },
    { title: 'アカウント作成', content: <ResisterForm /> },
  ];

  return (
    <main className="content-wrapper account">
      <div className="account-wrap c-inner">

        <div className="account-login-tab u-flex">
            {tabs.map((tab, index) => (
              <div className={`account-login-tab__item ${isActiveTab === index ? 'is-active' : ''}`} key={index} onClick={() => setIsActiveTab(index)}>
                {tab.title}
              </div>
            ))}
        </div>
        
        <section className="acccount-sec">
            {tabs[isActiveTab].content}
        </section>
        
      </div>
    </main>
  );
};

export default LoginPage;
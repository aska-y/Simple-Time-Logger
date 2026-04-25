import { useEffect, useState } from 'react';

function ChangeColorTheme() {
  const [colorTheme, setColorTheme] = useState<'LIGHT' | 'DARK' | 'COFFEE'>('LIGHT');

  useEffect(() => {
    document.documentElement.setAttribute('theme', colorTheme);
  }, [colorTheme]);

  return (
    <div className="theme-color u-flex c-inner u-font-point">
      <p className="">Theme Color</p>
      <div className="theme-color__btns u-flex">
          <button className="theme-color__btn" style={{backgroundColor: '#e3e3e3'}} onClick={() => setColorTheme('LIGHT')}>LIGHT</button>
          <button className="theme-color__btn" style={{backgroundColor: '#0b0e2f'}} onClick={() => setColorTheme('DARK')}>DARK</button>
          <button className="theme-color__btn" style={{backgroundColor: '#4b3603'}} onClick={() => setColorTheme('COFFEE')}>COFFEE</button>
      </div>
    </div>
  );
}

export default ChangeColorTheme;
import React, { useEffect, useState } from "react";
import "@styles/app.scss";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import Grid from "./Grid";

const Application: React.FC = () => {
  const [darkTheme, setDarkTheme] = useState(true);

  /**
   * On component mount
   */
  useEffect(() => {
    const useDarkTheme = parseInt(localStorage.getItem("dark-mode"));
    if (isNaN(useDarkTheme)) {
      setDarkTheme(true);
    } else if (useDarkTheme == 1) {
      setDarkTheme(true);
    } else if (useDarkTheme == 0) {
      setDarkTheme(false);
    }
  }, []);

  /**
   * On Dark theme change
   */
  useEffect(() => {
    if (darkTheme) {
      localStorage.setItem("dark-mode", "1");
      document.body.classList.add("dark-mode");
    } else {
      localStorage.setItem("dark-mode", "0");
      document.body.classList.remove("dark-mode");
    }
  }, [darkTheme]);

  /**
   * Toggle Theme
   */
  function toggleTheme() {
    setDarkTheme(!darkTheme);
  }

  return (
    <div id='erwt'>
      <Grid />
      <div className='footer'>
        <div className='center'>
          <button onClick={toggleTheme}>
            {darkTheme ? "Light Theme" : "Dark Theme"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Application;

@echo off
title Push Agri-Predict to GitHub
echo ========================================================
echo  Pushing Agri-Predict Code to GitHub
echo ========================================================
cd /d "C:\Users\student\.gemini\antigravity\scratch\crop-stress-telemetry"
echo.
echo Running: git push -u origin main
echo (If prompted, click "Sign in with your browser" in the popup window)
echo.
git push -u origin main
echo.
echo ========================================================
echo  Push Completed! Check https://github.com/dhakshan-M/Agri-predict
echo ========================================================
pause

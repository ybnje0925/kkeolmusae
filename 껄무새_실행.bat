@echo off
chcp 65001 >nul
title 껄무새 로컬 서버
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo [오류] Node.js가 설치되어 있지 않습니다.
  echo https://nodejs.org 에서 LTS 버전을 설치한 뒤 다시 실행해주세요.
  echo.
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo.
  echo 처음 실행입니다. 필요한 패키지를 설치합니다...
  call npm install
  if errorlevel 1 (
    echo.
    echo [오류] 패키지 설치에 실패했습니다.
    pause
    exit /b 1
  )
)

echo.
echo 껄무새를 시작합니다.
echo 브라우저가 열리지 않으면 http://localhost:3000 으로 접속하세요.
echo 서버를 종료하려면 이 창에서 Ctrl+C를 누르세요.
echo.

start "" powershell.exe -NoProfile -WindowStyle Hidden -Command "Start-Sleep -Seconds 3; Start-Process 'http://localhost:3000'"
call npm run dev

echo.
echo 서버가 종료되었습니다.
pause

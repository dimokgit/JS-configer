title configer
cd %~d0
cd %~p0
set path=%path%;C:\Users\ipbldit\AppData\Roaming\npm

rem @echo off
set /p msg="commit message: "

call gulp


git commit -a -m %msg%
pause
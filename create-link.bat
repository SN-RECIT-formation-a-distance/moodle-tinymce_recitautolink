echo off
set pluginPath=..\moodledev4\lib\editor\tiny\plugins\recitautolink

rem remove the current link
..\outils\junction -d src

rem set the link
..\outils\junction src %pluginPath%

pause
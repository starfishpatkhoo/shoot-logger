@echo off

rem File Locations
set TERSERCMD=C:\PortaSyncApps\nodejs\terser.cmd
set SASSCMD=C:\PortaSyncApps\nodejs\sass.bat

echo Executing Terser to Generate Minified JS for Shot-Logger
call %TERSERCMD% ..\js\*.js --config-file=terser.opt.json -o ..\compiled\logger.min.js

echo Executing Dart-SASS to Generate Minified CSS for Shot-Logger
call %SASSCMD% -s compressed ..\scss\logger.scss ..\compiled\logger.min.css

echo Deploying Internally
copy /y ..\compiled\logger.min.css ..\docs\s\logger.min.css
copy /y ..\compiled\logger.min.js ..\docs\s\logger.min.js

echo Done

:: Created by npm, please don't edit manually.
@IF EXIST "%~dp0"\"node.exe" (
  "%~dp0"\"node.exe"  "%~dp0\..\src\worldly.js" %*
) ELSE (
  node  "%~dp0\..\src\worldly.js" %*
)

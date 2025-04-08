@echo off
setlocal

REM Ruta del frontend
cd /d "C:\Users\Kratos\source\repos\ADUserGroupManagerWeb\frontend"

echo ================================
echo Instalando dependencias...
echo ================================
call npm install
IF %ERRORLEVEL% NEQ 0 (
    echo ❌ Error durante npm install
    exit /b %ERRORLEVEL%
)

echo ================================
echo Compilando el frontend en modo producción...
echo ================================
set NODE_ENV=production
call npm run build
IF %ERRORLEVEL% NEQ 0 (
    echo ❌ Error durante npm run build
    exit /b %ERRORLEVEL%
)

echo ✅ Build completado exitosamente
echo La carpeta 'build' está lista para ser copiada al servidor IIS
echo Ruta: C:\Users\Kratos\source\repos\ADUserGroupManagerWeb\frontend\build
pause
endlocal
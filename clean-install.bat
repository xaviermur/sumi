@echo off
echo ================================
echo  CLEAN NODE MODULES + INSTALL
echo ================================

echo Eliminando node_modules...
rmdir /S /Q node_modules

echo Eliminando package-lock.json...
del package-lock.json

echo Instalando dependencias (CON scripts)...
npm install

echo Listo.
pause

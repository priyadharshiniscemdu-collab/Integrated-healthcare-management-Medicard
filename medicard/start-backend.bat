@echo off
echo Starting Medicard Spring Boot Backend...
set JAVA_HOME=F:\medicard\tools\jdk-21\jdk-21.0.3+9
if not exist "%JAVA_HOME%" (
    echo JDK 21 not found at %JAVA_HOME%. Please check the tools directory.
    pause
    exit /b 1
)

set PATH=%JAVA_HOME%\bin;%PATH%
cd medicard-backend

echo Compiling and running Spring Boot backend natively on JDK 21...
..\tools\apache-maven-3.9.6\bin\mvn.cmd spring-boot:run
pause

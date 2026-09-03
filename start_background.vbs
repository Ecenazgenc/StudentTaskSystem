Set WshShell = CreateObject("WScript.Shell")
strPath = WshShell.CurrentDirectory
WshShell.Run "cmd /c ""cd /d """ & strPath & """ && npm run dev""", 0, False

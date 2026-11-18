# Print "<port-owner-pid> <top-pid>" for the process listening on -Port.
# top-pid = highest ancestor that is still node/python/cmd/nohup (the tree this run started).
# Killing top-pid with taskkill /T removes the whole server tree and nothing above it.
param([int]$Port)
$c = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
if (-not $c) { exit 1 }
$owner = $c.OwningProcess
$p = $owner; $top = $owner
for ($i = 0; $i -lt 8; $i++) {
  $o = Get-CimInstance Win32_Process -Filter "ProcessId=$p"
  if (-not $o) { break }
  if ($o.Name -notin 'node.exe', 'python.exe', 'cmd.exe', 'nohup.exe') { break }
  $top = $p
  $p = $o.ParentProcessId
}
"$owner $top"

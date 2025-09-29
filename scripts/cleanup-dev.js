const { execSync } = require('child_process');

function getProcessesOnPort(port) {
  try {
    const output = execSync(`netstat -ano | findstr ":${port}"`, { encoding: 'utf8' });
    const lines = output.split('\n').filter(line => line.includes('LISTENING'));
    const pids = lines.map(line => {
      const parts = line.trim().split(/\s+/);
      return parts[parts.length - 1];
    });
    return [...new Set(pids)];
  } catch (error) {
    return [];
  }
}

function getProcessInfo(pid) {
  try {
    const output = execSync(
      `wmic process where "ProcessId=${pid}" get ProcessId,CommandLine,ParentProcessId /format:csv`,
      { encoding: 'utf8' }
    );
    return output;
  } catch (error) {
    return '';
  }
}

function isClaudeCodeProcess(pid) {
  const info = getProcessInfo(pid);
  return info.includes('claude') || info.includes('Claude');
}

function killProcessTree(pid) {
  try {
    console.log(`Killing process tree for PID ${pid}...`);
    execSync(`taskkill /F /T /PID ${pid}`, { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

function cleanupDevServers() {
  console.log('Searching for development server processes...\n');

  const ports = [3000, 3001, 3002, 3003, 4000];
  let cleaned = false;

  for (const port of ports) {
    const pids = getProcessesOnPort(port);

    if (pids.length > 0) {
      console.log(`Port ${port} is occupied by PIDs: ${pids.join(', ')}`);

      for (const pid of pids) {
        if (isClaudeCodeProcess(pid)) {
          console.log(`  -> PID ${pid} is Claude Code, SKIPPING`);
          continue;
        }

        const info = getProcessInfo(pid);
        if (info.includes('tsx') || info.includes('turbo') || info.includes('next')) {
          console.log(`  -> PID ${pid} is a dev server process, killing...`);
          if (killProcessTree(pid)) {
            cleaned = true;
            console.log(`  -> Successfully killed PID ${pid}`);
          } else {
            console.log(`  -> Failed to kill PID ${pid}`);
          }
        } else {
          console.log(`  -> PID ${pid} is not a dev server process, SKIPPING`);
        }
      }
    }
  }

  if (!cleaned) {
    console.log('\nNo development server processes found to clean up.');
  } else {
    console.log('\nCleanup complete! Waiting 2 seconds for ports to be released...');
    execSync('ping -n 3 127.0.0.1 > nul', { stdio: 'ignore' });
  }

  console.log('\nPort status after cleanup:');
  for (const port of ports) {
    const pids = getProcessesOnPort(port);
    if (pids.length > 0) {
      console.log(`  Port ${port}: OCCUPIED by PIDs ${pids.join(', ')}`);
    } else {
      console.log(`  Port ${port}: FREE`);
    }
  }
}

cleanupDevServers();
const API_BASE = window.API_BASE_URL || 'https://vc-task-manager-backend.onrender.com/api';

async function fetchTasks() {
  try {
    const res = await fetch(`${API_BASE}/tasks`);
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

async function createTask(data) {
  try {
    const res = await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (err) {
    console.error(err);
  }
}

async function completeTask(id) {
  try {
    await fetch(`${API_BASE}/tasks/${id}/complete`, { method: 'POST' });
  } catch (err) {
    console.error(err);
  }
}

function renderTasks(tasks) {
  const list = document.getElementById('taskList');
  list.innerHTML = '';
  tasks.forEach(t => {
    const li = document.createElement('li');
    li.className = 'flex justify-between items-center p-2 border rounded';
    li.innerHTML = `<span>${t.title}</span>`;
    if (t.status !== 'completed') {
      const btn = document.createElement('button');
      btn.textContent = '\u5b8c\u4e86';
      btn.className = 'ml-2 px-2 py-1 bg-green-500 text-white rounded';
      btn.onclick = async () => { await completeTask(t.id); await refreshTasks(); };
      li.appendChild(btn);
    } else {
      const done = document.createElement('span');
      done.textContent = '\u5b8c\u4e86\u6e08\u307f';
      done.className = 'ml-2 text-green-500 text-sm';
      li.appendChild(done);
    }
    list.appendChild(li);
  });
}

function renderTodayTasks(tasks) {
  const todayList = document.getElementById('todayTasks');
  todayList.innerHTML = '';
  const sorted = tasks.filter(t => t.status !== 'completed').slice(0, 3);
  sorted.forEach(t => {
    const li = document.createElement('li');
    li.className = 'p-2 border rounded bg-yellow-50';
    li.textContent = t.title;
    todayList.appendChild(li);
  });
}

async function refreshTasks() {
  const tasks = await fetchTasks();
  renderTasks(tasks);
  renderTodayTasks(tasks);
}

document.getElementById('addTaskButton').addEventListener('click', async () => {
  const title = document.getElementById('title').value.trim();
  const description = document.getElementById('description').value.trim();
  const due = document.getElementById('due').value;
  const duration = document.getElementById('duration').value;
  const priority = parseInt(document.getElementById('priority').value, 10);
  if (!title) { alert('\u30bf\u30a4\u30c8\u30eb\u3092\u5165\u529b\u3057\u3066\u304f\u3060\u3055\u3044'); return; }
  await createTask({
    title: title,
    description: description || undefined,
    due_date: due ? new Date(due).toISOString() : undefined,
    duration_minutes: duration ? parseInt(duration, 10) : undefined,
    priority: priority,
  });
  document.getElementById('title').value = '';
  document.getElementById('description').value = '';
  document.getElementById('due').value = '';
  document.getElementById('duration').value = '';
  document.getElementById('priority').value = '3';
  await refreshTasks();
});

document.getElementById('generateScheduleButton').addEventListener('click', async () => {
  try {
    const res = await fetch(`${API_BASE}/schedule`, { method: 'POST' });
    if (!res.ok) return;
    const data = await res.json();
    const list = document.getElementById('scheduleList');
    list.innerHTML = '';
    const schedule = data.scheduled || [];
    if (!schedule.length) {
      list.textContent = '\u63d0\u6848\u3055\u308c\u305f\u30b9\u30b1\u30b8\u30e5\u30fc\u30eb\u304c\u3042\u308a\u307e\u305b\u3093\u3002\u30bf\u30b9\u30af\u3092\u8ffd\u52a0\u3057\u3066\u304f\u3060\u3055\u3044\u3002';
      return;
    }
    schedule.forEach(item => {
      const li = document.createElement('li');
      const start = new Date(item.slot.start_time);
      const end = new Date(item.slot.end_time);
      li.innerHTML = `<strong>${item.task.title}</strong><br><span class='text-xs text-gray-500'>${start.toLocaleString()} \u301c ${end.toLocaleString()}</span>`;
      li.className = 'p-2 border rounded';
      list.appendChild(li);
    });
  } catch (err) {
    console.error(err);
  }
});

refreshTasks();

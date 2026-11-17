
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("studyTasks") || "[]");
    } catch {
      return [];
    }
  });

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [date, setDate] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    localStorage.setItem("studyTasks", JSON.stringify(tasks));
  }, [tasks]);

  function addTask(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!title.trim() || !subject.trim() || !date) {
      setError("Please fill in all required fields.");
      return;
    }

    if (title.trim().length < 3) {
      setError("Task title must have at least 3 characters.");
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (new Date(date + "T00:00:00") < today) {
      setError("Deadline cannot be in the past.");
      return;
    }

    const newTask = {
      id: Date.now(),
      title: title.trim(),
      subject: subject.trim(),
      date,
      priority,
      completed: false,
    };

    setTasks(oldTasks => [...oldTasks, newTask]);
    setTitle("");
    setSubject("");
    setDate("");
    setPriority("Medium");
    setMessage("🎉 Task added successfully!");
  }

  function toggleTask(id) {
    setTasks(oldTasks =>
      oldTasks.map(task =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
    setMessage("Task status updated.");
    setError("");
  }

  function deleteTask(id) {
    setTasks(oldTasks => oldTasks.filter(task => task.id !== id));
    setMessage("Task deleted successfully.");
    setError("");
  }

  const completed = tasks.filter(task => task.completed).length;
  const pending = tasks.length - completed;
  const progress = tasks.length
    ? Math.round((completed / tasks.length) * 100)
    : 0;

  const filteredTasks = tasks.filter(task => {
    const matchesSearch =
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.subject.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" ||
      (filter === "Pending" && !task.completed) ||
      (filter === "Completed" && task.completed);

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="app">
      <header className="header">
        <div className="brand">📚 StudyFlow</div>
        <p>Your Smart Task & Study Planner</p>
        <span className="tagline">PLAN SMARTER • STUDY BETTER</span>
      </header>

      <main>
        <section className="welcome">
          <div>
            <p className="eyebrow">YOUR PERSONAL STUDY ASSISTANT</p>
            <h1>Make every day <span>count.</span></h1>
            <p>Organize your subjects, manage deadlines, and reach your goals.</p>
          </div>
          <div className="welcome-icon">✦</div>
        </section>

        <section className="stats">
          <div className="stat total">
            <span className="stat-icon">▤</span>
            <p>Total Tasks</p>
            <h2>{tasks.length}</h2>
          </div>

          <div className="stat pending">
            <span className="stat-icon">◷</span>
            <p>Pending</p>
            <h2>{pending}</h2>
          </div>

          <div className="stat completed">
            <span className="stat-icon">✓</span>
            <p>Completed</p>
            <h2>{completed}</h2>
          </div>
        </section>

        <section className="progress-card">
          <div className="progress-heading">
            <div>
              <h3>🚀 Your study progress</h3>
              <p>Keep going! Every task takes you one step forward.</p>
            </div>
            <strong>{progress}%</strong>
          </div>

          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
        </section>

        {error && <div className="notice error">⚠️ {error}</div>}
        {message && <div className="notice success">{message}</div>}

        <div className="content">
          <section className="card form-card">
            <div className="section-title">
              <span className="title-icon">＋</span>
              <div>
                <h2>Add a New Task</h2>
                <p>Turn your study goals into action.</p>
              </div>
            </div>

            <form onSubmit={addTask}>
              <label htmlFor="title">Task Title *</label>
              <input
                id="title"
                type="text"
                placeholder="e.g. Prepare for Java viva"
                value={title}
                maxLength={100}
                onChange={e => setTitle(e.target.value)}
              />

              <label htmlFor="subject">Subject *</label>
              <input
                id="subject"
                type="text"
                placeholder="e.g. Operating Systems"
                value={subject}
                maxLength={60}
                onChange={e => setSubject(e.target.value)}
              />

              <label htmlFor="date">Deadline *</label>
              <input
                id="date"
                type="date"
                min={new Date().toLocaleDateString("en-CA")}
                value={date}
                onChange={e => setDate(e.target.value)}
              />

              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                value={priority}
                onChange={e => setPriority(e.target.value)}
              >
                <option value="Low">🟢 Low</option>
                <option value="Medium">🟠 Medium</option>
                <option value="High">🔴 High</option>
              </select>

              <button className="add-button" type="submit">
                ＋ Add Task
              </button>

              <p className="form-note">* Required fields</p>
            </form>
          </section>

          <section className="card task-card">
            <div className="section-title">
              <span className="title-icon teal">✓</span>
              <div>
                <h2>My Study Tasks</h2>
                <p>Stay organized and keep moving forward.</p>
              </div>
            </div>

            <input
              className="search"
              type="search"
              placeholder="🔍 Search tasks or subjects..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              aria-label="Search tasks or subjects"
            />

            <div className="filter-row">
              <label htmlFor="filter">Show:</label>
              <select
                id="filter"
                value={filter}
                onChange={e => setFilter(e.target.value)}
              >
                <option>All</option>
                <option>Pending</option>
                <option>Completed</option>
              </select>
              <span className="result-count">
                {filteredTasks.length} tasks
              </span>
            </div>

            {filteredTasks.length === 0 ? (
              <div className="empty">
                <span>📝</span>
                <h3>{tasks.length ? "No matching tasks" : "Your planner is ready!"}</h3>
                <p>
                  {tasks.length
                    ? "Try another search or filter."
                    : "Add your first task to get started."}
                </p>
              </div>
            ) : (
              <div className="task-list">
                {filteredTasks.map(task => (
                  <article
                    className={`task ${task.completed ? "is-completed" : ""}`}
                    key={task.id}
                  >
                    <button
                      type="button"
                      className={`check ${task.completed ? "checked" : ""}`}
                      onClick={() => toggleTask(task.id)}
                      aria-label={task.completed ? "Undo completion" : "Complete task"}
                    >
                      {task.completed ? "✓" : ""}
                    </button>

                    <div className="task-info">
                      <h3>{task.title}</h3>
                      <p>{task.subject}</p>
                      <small>📅 {task.date}</small>
                    </div>

                    <div className="task-actions">
                      <span className={`badge ${task.priority.toLowerCase()}`}>
                        {task.priority}
                      </span>
                      <button
                        type="button"
                        className="delete-button"
                        onClick={() => deleteTask(task.id)}
                        aria-label={`Delete ${task.title}`}
                        title="Delete task"
                      >
                        🗑
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>

        <footer>
          <strong>✦ StudyFlow</strong>
          <span>Stay consistent. Keep learning. 💜</span>
        </footer>
      </main>
    </div>
  );
}

export default App;

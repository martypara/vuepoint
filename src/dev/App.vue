<template>
  <div class="dashboard-layout">
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="logo">
          <div class="logo-icon">V</div>
          <span class="logo-text">Vertext</span>
        </div>
      </div>
      <nav class="sidebar-nav">
        <ul>
          <li class="active"><a href="#">Dashboard</a></li>
          <li><a href="#">Projects</a></li>
          <li><a href="#">Analytics</a></li>
          <li><a href="#">Customers</a></li>
          <li><a href="#">Settings</a></li>
        </ul>
      </nav>
      <div class="sidebar-footer">
        <div class="user-profile">
          <img src="https://i.pravatar.cc/150?img=32" alt="User Avatar" class="avatar" />
          <div class="user-info">
            <span class="user-name">Alice Cooper</span>
            <span class="user-role">Admin</span>
          </div>
        </div>
      </div>
    </aside>

    <main class="main-content">
      <header class="top-header">
        <div class="search-bar">
          <input type="text" placeholder="Search across your workspace..." />
        </div>
        <div class="header-actions">
          <button class="btn-icon spin-icon" aria-label="Settings">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          </button>
          <button class="btn-icon" aria-label="Notifications">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
          </button>
          <button class="btn-primary">New Project</button>
        </div>
      </header>

      <div class="page-container">
        <div class="page-header">
          <h1>Welcome back, Alice</h1>
          <p class="subtitle">Here's what's happening in your workspace today.</p>
        </div>

        <section class="kpi-grid">
          <div class="kpi-card">
            <div class="kpi-header">
              <span class="kpi-title">Total Revenue</span>
              <span class="trend positive">+12.5%</span>
            </div>
            <div class="kpi-value">$124,500</div>
            <p class="kpi-context">Compared to last month</p>
          </div>
          <div class="kpi-card">
            <div class="kpi-header">
              <span class="kpi-title">Active Users</span>
              <span class="trend positive">+5.2%</span>
            </div>
            <div class="kpi-value">45,210</div>
            <p class="kpi-context">Compared to last month</p>
          </div>
          <div class="kpi-card">
            <div class="kpi-header">
              <span class="kpi-title">Churn Rate</span>
              <span class="trend negative">+1.1%</span>
            </div>
            <div class="kpi-value">2.4%</div>
            <p class="kpi-context">Compared to last month</p>
          </div>
          <div class="kpi-card">
            <div class="kpi-header">
              <span class="kpi-title">Avg Session</span>
              <span class="trend positive">+12s</span>
            </div>
            <div class="kpi-value">4m 32s</div>
            <p class="kpi-context">Compared to last month</p>
          </div>
        </section>

        <div class="content-split">
          <section class="panel main-panel">
            <div class="panel-header">
              <h2>Recent Subscriptions</h2>
              <button class="btn-secondary">View All</button>
            </div>
            <div class="table-container">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Plan</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div class="customer-cell">
                        <img src="https://i.pravatar.cc/150?img=11" alt="Acme Corp" class="avatar-sm" />
                        <div>
                          <div class="fw-medium">Acme Corp</div>
                          <div class="text-muted">contact@acme.com</div>
                        </div>
                      </div>
                    </td>
                    <td>Pro Tier</td>
                    <td><span class="badge active">Active</span></td>
                    <td>Oct 24, 2023</td>
                  </tr>
                  <tr>
                    <td>
                      <div class="customer-cell">
                        <img src="https://i.pravatar.cc/150?img=12" alt="Globex" class="avatar-sm" />
                        <div>
                          <div class="fw-medium">Globex Inc</div>
                          <div class="text-muted">info@globex.net</div>
                        </div>
                      </div>
                    </td>
                    <td>Enterprise</td>
                    <td><span class="badge active">Active</span></td>
                    <td>Oct 22, 2023</td>
                  </tr>
                  <tr>
                    <td>
                      <div class="customer-cell">
                        <img src="https://i.pravatar.cc/150?img=13" alt="Soylent" class="avatar-sm" />
                        <div>
                          <div class="fw-medium">Soylent Corp</div>
                          <div class="text-muted">billing@soylent.com</div>
                        </div>
                      </div>
                    </td>
                    <td>Starter</td>
                    <td><span class="badge past-due">Past Due</span></td>
                    <td>Oct 19, 2023</td>
                  </tr>
                  <tr>
                    <td>
                      <div class="customer-cell">
                        <img src="https://i.pravatar.cc/150?img=14" alt="Initech" class="avatar-sm" />
                        <div>
                          <div class="fw-medium">Initech</div>
                          <div class="text-muted">admin@initech.co</div>
                        </div>
                      </div>
                    </td>
                    <td>Pro Tier</td>
                    <td><span class="badge canceled">Canceled</span></td>
                    <td>Oct 15, 2023</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <aside class="panel side-panel">
            <div class="panel-header">
              <h2>Quick Actions</h2>
            </div>
            <div class="form-group">
              <label for="invite-email">Invite Team Member</label>
              <div class="input-group">
                <input type="email" id="invite-email" placeholder="email@example.com" />
                <button class="btn-primary">Send</button>
              </div>
            </div>
            <div class="alert-box">
              <div class="alert-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#b45309" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path></svg>
              </div>
              <div class="alert-content">
                <strong>System Update</strong>
                <p>Scheduled maintenance in 2 days. Some features may be unavailable.</p>
              </div>
            </div>
            
            <div class="settings-toggles">
              <label class="toggle-row">
                <span>Email Notifications</span>
                <input type="checkbox" checked class="toggle-switch"/>
              </label>
              <label class="toggle-row">
                <span>Weekly Reports</span>
                <input type="checkbox" class="toggle-switch"/>
              </label>
            </div>
          </aside>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

:global(body) {
  margin: 0;
  padding: 0;
  font-family: Inter, system-ui, -apple-system, sans-serif;
  background-color: #f7f9fc;
  color: #1a202c;
}

.dashboard-layout {
  display: flex;
  min-height: 100vh;
  width: 100%;
}

.sidebar {
  width: 260px;
  background-color: #ffffff;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  height: 100vh;
}

.sidebar-header {
  padding: 24px 20px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #f59e0b, #ea580c);
  color: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 18px;
}

.logo-text {
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.sidebar-nav {
  flex: 1;
  padding: 0 12px;
}

.sidebar-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sidebar-nav a {
  display: block;
  padding: 10px 16px;
  text-decoration: none;
  color: #4a5568;
  font-weight: 500;
  border-radius: 6px;
  transition: all 0.2s;
}

.sidebar-nav a:hover {
  background-color: #f1f5f9;
  color: #1a202c;
}

.sidebar-nav li.active a {
  background-color: #ffedd5;
  color: #ea580c;
  font-weight: 600;
}

.sidebar-footer {
  padding: 20px;
  border-top: 1px solid #e2e8f0;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-sm {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 600;
  font-size: 14px;
}

.user-role {
  font-size: 12px;
  color: #718096;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.top-header {
  height: 72px;
  background-color: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
}

.search-bar input {
  width: 300px;
  padding: 10px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 14px;
  background-color: #f8fafc;
  transition: border-color 0.2s;
}

.search-bar input:focus {
  outline: none;
  border-color: #f97316;
  background-color: #ffffff;
  box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.btn-icon {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-icon:hover {
  background-color: #f1f5f9;
}

.spin-icon svg {
  animation: spin 4s linear infinite;
}

@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}

.btn-primary {
  background-color: #f97316;
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 14px;
}

.btn-primary:hover {
  background-color: #ea580c;
}

.btn-secondary {
  background-color: #ffffff;
  color: #4a5568;
  border: 1px solid #e2e8f0;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
}

.btn-secondary:hover {
  background-color: #f8fafc;
  border-color: #cbd5e1;
}

.page-container {
  padding: 32px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.page-header {
  margin-bottom: 32px;
}

.page-header h1 {
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 700;
}

.subtitle {
  color: #718096;
  margin: 0;
  font-size: 16px;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.kpi-card {
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.kpi-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.kpi-title {
  color: #4a5568;
  font-size: 14px;
  font-weight: 500;
}

.trend {
  font-size: 12px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 999px;
}

.trend.positive {
  background-color: #d1fae5;
  color: #059669;
}

.trend.negative {
  background-color: #fee2e2;
  color: #dc2626;
}

.kpi-value {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #1a202c;
}

.kpi-context {
  margin: 0;
  font-size: 13px;
  color: #a0aec0;
}

.content-split {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
}

.panel {
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  overflow: hidden;
}

.panel-header {
  padding: 20px 24px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.panel-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.table-container {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  text-align: left;
  padding: 16px 24px;
  background-color: #f8fafc;
  color: #718096;
  font-weight: 500;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid #e2e8f0;
}

.data-table td {
  padding: 16px 24px;
  border-bottom: 1px solid #e2e8f0;
  font-size: 14px;
  vertical-align: middle;
}

.data-table tbody tr:last-child td {
  border-bottom: none;
}

.customer-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.fw-medium {
  font-weight: 500;
  color: #1a202c;
}

.text-muted {
  color: #718096;
  font-size: 13px;
}

.badge {
  display: inline-flex;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}

.badge.active {
  background-color: #d1fae5;
  color: #059669;
}

.badge.past-due {
  background-color: #fef3c7;
  color: #d97706;
}

.badge.canceled {
  background-color: #fee2e2;
  color: #dc2626;
}

.side-panel .panel-header {
  padding: 20px;
}

.form-group {
  padding: 20px;
  border-bottom: 1px solid #e2e8f0;
}

.form-group label {
  display: block;
  font-weight: 500;
  margin-bottom: 8px;
  font-size: 14px;
}

.input-group {
  display: flex;
  gap: 8px;
}

.input-group input {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 14px;
}

.input-group input:focus {
  outline: none;
  border-color: #f97316;
  box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
}

.alert-box {
  margin: 20px;
  padding: 16px;
  background-color: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 8px;
  display: flex;
  gap: 12px;
}

.alert-icon {
  display: flex;
  align-items: flex-start;
}

.alert-content strong {
  display: block;
  color: #92400e;
  margin-bottom: 4px;
  font-size: 14px;
}

.alert-content p {
  margin: 0;
  color: #b45309;
  font-size: 13px;
  line-height: 1.5;
}

.settings-toggles {
  padding: 20px;
}

.toggle-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  margin-bottom: 16px;
  font-size: 14px;
  font-weight: 500;
}

.toggle-row:last-child {
  margin-bottom: 0;
}

.toggle-switch {
  appearance: none;
  width: 44px;
  height: 24px;
  background-color: #cbd5e1;
  border-radius: 12px;
  position: relative;
  cursor: pointer;
  outline: none;
  transition: background-color 0.2s;
}

.toggle-switch:checked {
  background-color: #f97316;
}

.toggle-switch::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background-color: white;
  border-radius: 50%;
  transition: transform 0.2s;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

.toggle-switch:checked::after {
  transform: translateX(20px);
}

@media (max-width: 1024px) {
  .content-split {
    grid-template-columns: 1fr;
  }
}
</style>

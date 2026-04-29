export function settingsTabsForRole({ role, mode, showAll, isOwner }) {
  const all = ['setup', 'calling', 'connect', 'ai', 'sync', 'team', 'owner'];
  if (showAll) return isOwner ? all : all.filter(tab => tab !== 'owner');
  if (role === 'admin') return ['setup', 'connect', 'calling', 'ai'];
  if (mode === 'manage') return ['setup', 'team', 'connect', 'ai', 'sync', ...(isOwner ? ['owner'] : [])];
  return ['setup', 'calling', 'connect', 'ai', 'sync'];
}

export function SettingsSections(props) {
  const tabs = settingsTabsForRole(props);
  return (
    <section className="panel">
      <header className="panel-header">
        <h2>Settings</h2>
        <span>{props.showAll ? 'All' : 'Role view'}</span>
      </header>
      <div className="chips">
        {tabs.map(tab => <button key={tab}>{tab}</button>)}
      </div>
    </section>
  );
}

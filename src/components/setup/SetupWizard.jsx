export function SetupWizard({ items }) {
  const done = items.filter(item => item.done).length;
  return (
    <section className="panel">
      <header className="panel-header">
        <h2>Guided setup</h2>
        <span>{Math.round((done / items.length) * 100)}%</span>
      </header>
      <div className="progress">
        <i style={{ width: `${(done / items.length) * 100}%` }} />
      </div>
      {items.map(item => (
        <div className={item.done ? 'setup-row done' : 'setup-row'} key={item.key}>
          <span>
            <b>{item.label}</b>
            <small>{item.detail}</small>
          </span>
          <em>{item.done ? 'Done' : 'Open'}</em>
        </div>
      ))}
    </section>
  );
}

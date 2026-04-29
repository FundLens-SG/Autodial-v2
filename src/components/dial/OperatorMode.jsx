function formatTime(seconds) {
  const s = Math.max(0, Number(seconds) || 0);
  return [Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60]
    .map(part => String(part).padStart(2, '0'))
    .join(':');
}

export function OperatorMode({ elapsedSeconds, running, currentLead, nextLeads = [], callbacks = [] }) {
  return (
    <section className="panel operator">
      <header className="panel-header">
        <h2>Operator Mode</h2>
        <strong>{formatTime(elapsedSeconds)}</strong>
      </header>
      <div className="current-lead">
        <small>{running ? 'Current lead' : 'Ready'}</small>
        <b>{currentLead?.name || 'No lead selected'}</b>
        <span>{currentLead?.phone || 'No phone'}</span>
      </div>
      <div className="operator-grid">
        <div>
          <small>Next 3</small>
          {nextLeads.map(lead => <p key={lead.phone}>{lead.name || lead.phone}</p>)}
        </div>
        <div>
          <small>Due CB</small>
          {callbacks.map(cb => <p key={cb.lead_phone}>{cb.lead_name || cb.lead_phone} {cb.scheduled_time}</p>)}
        </div>
      </div>
    </section>
  );
}

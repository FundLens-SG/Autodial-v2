export function calculateSessionPay(session, config = {}) {
  const hours = Number(session.fullSession ? config.sessionDur : session.hours) || 0;
  const rate = Number(session.hourlyRate ?? config.hourlyRate ?? 0);
  const bonusMult = Number(config.bonusMult || 1.5);
  const metBonus = Boolean(session.bonus);
  const base = hours * rate;
  return Number((metBonus ? base * bonusMult : base).toFixed(2));
}

export function metAppointmentBar(sets, config = {}) {
  return Number(sets || 0) >= Number(config.mThresh || 0);
}

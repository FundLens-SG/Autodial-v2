import { SetupWizard } from '../components/setup/SetupWizard.jsx';
import { OperatorMode } from '../components/dial/OperatorMode.jsx';
import { SettingsSections } from '../components/manage/SettingsSections.jsx';

const sampleSetup = [
  { key: 'google', label: 'Google workspace', detail: 'Sheets, Drive, Calendar', done: true },
  { key: 'sheet', label: 'Leads source', detail: 'Pick sheet and tab', done: false },
  { key: 'columns', label: 'Detected columns', detail: 'Review phone/name/status mapping', done: false },
];

const sampleLead = {
  name: 'Sample Lead',
  phone: '+65 8123 4567',
  notes: 'Warm callback after 6pm',
};

export function App() {
  return (
    <main className="source-shell">
      <SetupWizard items={sampleSetup} />
      <OperatorMode
        elapsedSeconds={1840}
        running
        currentLead={sampleLead}
        nextLeads={[
          { name: 'Next Lead A', phone: '+65 9000 0001' },
          { name: 'Next Lead B', phone: '+65 9000 0002' },
          { name: 'Next Lead C', phone: '+65 9000 0003' },
        ]}
        callbacks={[{ lead_name: 'Callback Due', scheduled_time: '18:30' }]}
      />
      <SettingsSections role="main" mode="manage" showAll={false} isOwner />
    </main>
  );
}

import { ThemeSwitcher } from './components/theme-switcher';
import { EmotionBoard } from './components/emotion-board';

export default function Home() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <ThemeSwitcher />
      <EmotionBoard />
      </main>
  );
}

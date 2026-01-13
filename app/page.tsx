// app/page.tsx

export default function HomePage() {
  return (
    <main style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '80vh',
      textAlign: 'center'
    }}>
      <h1>Welcome to Pablo-Bets</h1>
      <p>Your application is successfully running.</p>
      <p>This is the root page (`app/page.tsx`). You can start building your UI here.</p>
    </main>
  );
}

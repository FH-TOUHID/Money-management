import AppRoute from "./routes/Route";

/**
 * Top-level shell. All routing/redirect decisions live in `routes/Route.jsx`
 * so "where do I send the user on first paint?" has exactly one answer.
 * Keeping `App.jsx` free of `useEffect` + `useNavigate` here also means
 * `Home` won't get unmounted/remounted by stray re-navigations.
 */
function App() {
  return <AppRoute />;
}

export default App;
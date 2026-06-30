import { isDemo } from "../mock/mockApi";

export default function DemoBanner() {
  if (!isDemo()) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-amber-500 text-white text-center py-2 px-4 text-sm font-medium shadow-md">
      Demo Mode — Data is simulated.{" "}
      <a
        href="https://github.com"
        className="underline hover:text-amber-100"
        target="_blank"
        rel="noopener noreferrer"
      >
        Run the backend
      </a>{" "}
      for full functionality.
    </div>
  );
}

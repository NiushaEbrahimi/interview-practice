
import "../assets/css/shimmer.css";

export default function Skeleton({
  className = "",
}) {
  return (
    <div
      className={`skeleton-card ${className} w-50 h-80`}
    />
  );
}
function BarLoader({ loading }) {
  if (!loading) return null;

  return (
    <div
      style={{
        width: "100%",
        height: "4px",
        backgroundColor: "#e5e7eb",
        overflow: "hidden",
        position: "relative",
        marginBottom: "10px",
      }}
    >
      <div
        style={{
          width: "30%",
          height: "100%",
          backgroundColor: "#3b82f6",
          position: "absolute",
          animation: "move 1.2s infinite",
        }}
      />
      <style>
        {`
          @keyframes move {
            0% { left: -30%; }
            100% { left: 100%; }
          }
        `}
      </style>
    </div>
  );
}

export default BarLoader;

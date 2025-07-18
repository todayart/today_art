export default function CalenderFixedCell(children) {
  return (
    <main className="calenderWrapper">
      {/* 첫 번째 열: 고정 파트 (OPEN, CLOSE) */}
      {["OPEN", "CLOSE"].map((label, idx) => (
        <div
          key={idx}
          className="calenderCell"
          style={{
            gridColumn: 1,
            gridRow: idx + 1,
          }}
        >
          {label}
        </div>
      ))}
      {children}
    </main>
  );
}

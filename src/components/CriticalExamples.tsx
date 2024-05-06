const CriticalExamples = ({ criticalInstances }) => {
  return (
    <table>
      <thead>
        <tr>
          <th style={{ paddingRight: "10px" }}>Credit Score</th>
          <th style={{ paddingRight: "10px" }}>Activity</th>
        </tr>
      </thead>
      <tbody>
        {criticalInstances.map((instance, index) => (
          <tr key={index}>
            <td style={{ paddingRight: "10px" }}>{instance.credit_score}</td>
            <td style={{ paddingRight: "10px" }}>{instance.activity_ime}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CriticalExamples;

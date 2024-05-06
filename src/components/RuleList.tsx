const RuleList = ({ rules }) => {
  return (
    <div>
      <h2>Rules</h2>
      <ul>
        {rules.map((rule, index) => (
          <li key={index}>
            <h3>Rule {index + 1}</h3>
            <p>Current Class Distribution: {rule.curr_class_dist.join(", ")}</p>
            <p>Rule: {rule.rule}</p>
            <p>Quality: {rule.quality}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RuleList;

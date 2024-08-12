interface Props {
  rules: any;
}

const RuleList = ({ rules }: Props) => {
  return (
    <div>
      <h2>Rules</h2>
      <ul>
        {rules.map((rule: any, index: number) => (
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

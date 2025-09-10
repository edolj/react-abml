import { Container, Card } from "react-bootstrap";

const Instructions = () => {
  return (
    <Container className="my-4">
      <Card className="box-with-border card-view">
        <Card.Body>
          <h2 className="mb-3">How to Use ABML Tutor</h2>
          <p className="text-muted mb-4">
            This guide will help you understand how to work with the tutor
            effectively.
          </p>

          <ol>
            <li className="mb-3">
              <strong>Home page:</strong> On the "Home" page, you can start a
              new learning session or continue where you left off.
            </li>
            <li className="mb-3">
              <strong>Select a domain:</strong> On the "Select Domain" page,
              choose the domain you want to work with.
            </li>
            <li className="mb-3">
              <strong>Choose a critical example:</strong> You will be shown
              instances from the dataset. Select the one you find interesting or
              challenging.
            </li>
            <li className="mb-3">
              <strong>Provide Arguments:</strong> Use the attribute list to
              support your classification:
              <ul>
                <li>
                  Numerical attributes: Click the button representing{" "}
                  <strong>High</strong> or <strong>Low</strong> to indicate your
                  choice.
                </li>
                <li>
                  Categorical attributes: Select the appropriate label using the
                  checkbox.
                </li>
                <li>
                  Click <strong>Send Arguments</strong> to submit your
                  arguments. The system will analyze your input and return an{" "}
                  <strong>M-score</strong>.
                </li>
              </ul>
            </li>
            <li className="mb-3">
              <strong>Review Your Progress:</strong> The M-score reflects the
              quality of your arguments.
              <ul>
                <li>Green bar: Shows your current M-score.</li>
                <li>
                  Yellow bar: Shows potential improvement if your argument is
                  refined.
                </li>
                <li>
                  Use the <strong>Hint</strong> button for suggestions to
                  improve your argument.
                </li>
                <li>
                  If counterexamples appear, compare your values with the
                  counterexample values and adjust your arguments accordingly.
                </li>
              </ul>
            </li>
            <li className="mb-3">
              <strong>Proceed to the next example:</strong> After submitting
              arguments with no remaining counterexamples, click{" "}
              <strong>Next Example</strong> to continue.
            </li>
          </ol>

          <p className="text-muted">
            You can return to the home page at any time to start a new session
            or resume a previous one.
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Instructions;

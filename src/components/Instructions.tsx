import { Container, Card } from "react-bootstrap";

const Instructions = () => {
  return (
    <Container className="my-4">
      <Card className="box-with-border card-view instructions-card">
        <Card.Body>
          <h2 className="mb-3">How to Use ABML Tutor</h2>
          <p className="text-muted mb-4">
            This guide will help you understand how to work with the tutor
            effectively.
          </p>

          <ol>
            <li className="mb-3">
              <strong>Home page:</strong> Start a new learning session or continue a
              previously saved one.
            </li>

            <li className="mb-3">
              <strong>Select a domain:</strong> Choose the domain you want to practice.
            </li>

            <li className="mb-3">
              <strong>Choose a critical example:</strong> Select one example from the
              dataset for argumentation.
            </li>

            <li className="mb-3">
              <strong>Create your argument:</strong>
              <ul>
                <li>
                  Numerical attributes: Click <strong>High</strong> or{" "}
                  <strong>Low</strong> to add the attribute as an argument.
                </li>
                <li>
                  Optionally, click a selected numerical argument to specify a <strong>bound (k)</strong> for more precise reasoning.
                </li>
                <li>
                  Categorical attributes: Select the checkbox to add the attribute.
                </li>
                <li>
                  You can select up to <strong>three arguments</strong>.
                </li>
              </ul>
            </li>

            <li className="mb-3">
              <strong>Submit your argument:</strong>
              <ul>
                <li>
                  Click <strong>Send Arguments</strong> to evaluate your argument.
                </li>
                <li>
                  The tutor calculates an <strong>M-score</strong> and searches for
                  counterexamples.
                </li>
              </ul>
            </li>

            <li className="mb-3">
              <strong>Improve your argument:</strong>
              <ul>
                <li>
                  The green bar represents the current quality of your argument.
                </li>
                <li>
                  The yellow bar indicates the potential improvement.
                </li>
                <li>
                  Use the <strong>Hint</strong> button if you need guidance.
                </li>
                <li>
                  If counterexamples are displayed, compare them with the selected
                  example and refine your argument.
                </li>
              </ul>
            </li>

            <li className="mb-3">
              <strong>Continue learning:</strong> Once you are satisfied with your
              argument, click <strong>Next Example</strong> to proceed.
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

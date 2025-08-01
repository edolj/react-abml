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
              instances from the dataset. Select the one you find most
              interesting or relevant.
            </li>
            <li className="mb-3">
              <strong>Provide arguments:</strong> Use the attribute list to
              support your classification. For numerical attributes, click
              "high" or "low." For categorical attributes, select the
              appropriate label. Then click <strong>Send Arguments</strong> to
              submit your reasoning. The system will analyze your input and
              return an M-score.
            </li>
            <li className="mb-3">
              <strong>Review M-score:</strong> The M-score reflects the quality
              of your arguments.
              <ul>
                <li>
                  The blue bar shows your current M-score. The green bar
                  indicates how much it could be improved by refining your
                  argument.
                </li>
                <li>
                  Use the <strong>Hint</strong> button for suggestions on
                  improving your reasoning.
                </li>
                <li>
                  Aim to maximize your M-score by choosing meaningful
                  attributes.
                </li>
                <li>
                  If counterexamples appear, adjust your argument to eliminate
                  them.
                </li>
              </ul>
            </li>
            <li className="mb-3">
              <strong>Proceed to the next example:</strong> After submitting
              valid arguments with no remaining counterexamples, click{" "}
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

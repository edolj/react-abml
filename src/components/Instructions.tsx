import { Container, Card } from "react-bootstrap";

const Instructions = () => {
  return (
    <Container className="my-4">
      <Card className="box-with-border card-view instructions-card">
        <Card.Body>
          <h2 className="mb-3">Kako uporabljati ABML Tutor</h2>
          <p className="text-muted mb-4">
            Ta navodila vam bodo pomagala razumeti, kako učinkovito uporabljati tutorja.
          </p>

          <ol>
            <li className="mb-3">
              <strong>Začetna stran:</strong> Začnite novo učno sejo ali nadaljujte
              predhodno shranjeno sejo.
            </li>

            <li className="mb-3">
              <strong>Izberite domeno:</strong> Izberite domeno, ki jo želite vaditi.
            </li>

            <li className="mb-3">
              <strong>Izberite kritični primer:</strong> Izberite en primer iz
              podatkovne zbirke za argumentacijo.
            </li>

            <li className="mb-3">
              <strong>Ustvarite svoj argument:</strong>
              <ul>
                <li>
                  Številske značilke: Kliknite <strong>Visoko</strong> ali{" "}
                  <strong>Nizko</strong>, da dodate značilko kot argument.
                </li>
                <li>
                  Po želji kliknite izbrani številski argument in določite{" "}
                  <strong>mejo (k)</strong> za natančnejše sklepanje.
                </li>
                <li>
                  Kategorične značilke: Izberite potrditveno polje, da dodate
                  značilko.
                </li>
                <li>
                  Izberete lahko največ <strong>tri argumente</strong>.
                </li>
              </ul>
            </li>

            <li className="mb-3">
              <strong>Pošljite svoj argument:</strong>
              <ul>
                <li>
                  Kliknite <strong>Pošlji argumente</strong>, da ocenite svoj
                  argument.
                </li>
                <li>
                  Tutor izračuna <strong>M-oceno</strong> in poišče protiprimere.
                </li>
              </ul>
            </li>

            <li className="mb-3">
              <strong>Izboljšajte svoj argument:</strong>
              <ul>
                <li>
                  Zelena vrstica predstavlja trenutno kakovost vašega argumenta.
                </li>
                <li>
                  Rumena vrstica prikazuje možnost za izboljšanje.
                </li>
                <li>
                  Če potrebujete pomoč, uporabite gumb <strong>Namig</strong>.
                </li>
                <li>
                  Če so prikazani protiprimeri, jih primerjajte z izbranim
                  primerom in izboljšajte svoj argument.
                </li>
              </ul>
            </li>

            <li className="mb-3">
              <strong>Nadaljujte z učenjem:</strong> Ko ste zadovoljni s svojim
              argumentom, kliknite <strong>Naslednji primer</strong> za nadaljevanje.
            </li>
          </ol>

          <p className="text-muted">
            Na začetno stran se lahko kadar koli vrnete in začnete novo sejo ali
            nadaljujete prejšnjo.
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Instructions;

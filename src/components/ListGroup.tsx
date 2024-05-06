import { Fragment, useState } from "react";

interface Props {
  items: string[];
  heading: string;
  onSelectItem: (item: string) => void;
}

function ListGroup({ items, heading, onSelectItem }: Props) {
  // props.items, props.heading
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const getMessage = () => (items.length === 0 ? <p>No item</p> : null);

  return (
    <Fragment>
      <div style={{ textAlign: "center" }}>
        <h1>{heading}</h1>
      </div>
      {/*{getMessage()}*/}
      <ul
        className="list-group"
        style={{ marginLeft: "20px", marginRight: "20px" }}
      >
        {items.map((item, index) => (
          <li
            className={
              selectedIndex === index
                ? "list-group-item active"
                : "list-group-item"
            }
            key={item}
            onClick={() => {
              setSelectedIndex(index);
              onSelectItem(index);
            }}
          >
            {item}
          </li>
        ))}
      </ul>
    </Fragment>
  );
}

export default ListGroup;

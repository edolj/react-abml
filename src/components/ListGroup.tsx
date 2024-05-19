import { Fragment, useState } from "react";

interface Props {
  items: string[];
  heading: string;
  onSelectItem: (item: string) => void;
  isVisible: boolean;
}

function ListGroup({ items, heading, onSelectItem, isVisible }: Props) {
  // props.items, props.heading
  const [selectedIndex, setSelectedIndex] = useState(-1);

  return (
    <Fragment>
      <div>
        <h2>{heading}</h2>
      </div>
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

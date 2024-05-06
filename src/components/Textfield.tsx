function Textfield({ label, value, onChange }) {
  return (
    <div>
      <div>
        <label htmlFor="textfield">{label}</label>
      </div>
      <div>
        <input type="text" id="textfield" value={value} onChange={onChange} />
      </div>
    </div>
  );
}

export default Textfield;

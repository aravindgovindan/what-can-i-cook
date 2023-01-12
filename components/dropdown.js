
export default function Dropdown(props) {

  const handleSelect = (option) => {
    props.handleChange(option)

  }

  return (
    <div className="dropdownContainer">
      {props.label ? <label htmlFor="dropdown">{props.label}</label> : ''}
      <select name="dropdown" value={props.selection} onChange={(e) => handleSelect(e.target.value)}>
        {Object.keys(props.options).map(option => (
          <option
            key={props.options[option]}
            value={option}
          >
            {props.options[option]}
          </option>
        ))}
      </select>
    </div>
  );
}
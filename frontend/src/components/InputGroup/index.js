
// import Styles from './inputGroup.module.css'

function InputGroup({ label, placeholder, type, name, handleChange }) {
    return (
    <div className='mb-3 input-group'>
        <label className='input-group-text'>{label}</label>
        <input type= {type} placeholder= {placeholder} className='form-control' name={name} onChange={handleChange }/>
        {/* Toda vez que for lidar com eventos utilizar handle */}
    </div>
    )

}

export default InputGroup
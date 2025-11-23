import Input from "./Input"
import InputGroup from "./InputGroup"

const Form = ({ children, onSubmit, style='', ...props }) => {
    return (
        <form onSubmit={onSubmit} className={`w-[336px] p-[1rem] bg-gray shadow-xl backdrop-blur-md rounded-[7px] ${style}`} {...props}>
            {children}
        </form>
    )
}



Form.input = Input;
Form.input_group = InputGroup
export default Form
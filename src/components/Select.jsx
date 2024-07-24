import { Form } from "react-bootstrap"

export const Select = ({data, value, onChange, isInvalid, placeholder}) => {

    return (
        <>
            <Form.Select value={value} onChange={(e) => onChange(e)} isInvalid={isInvalid}>
                <option>{placeholder}</option>
                {data.map((item, index) => {
                    for(const [key, value] of Object.entries(item)) {
                        return (
                            <option key={index} value={key}>{value}</option>
                        )
                    }
                })}
            </Form.Select>
        </>
    )
}

export default Select
import DateInput from "../../components/DateInput";
import renderer from "react-test-renderer";
import React from "react";

interface TestObject {
    value: string
}

describe('<DateInput />', () => {
    it('has 1 child', () => {
        let testObject: TestObject = { value: "" }
        const tree = renderer.create(<DateInput update={text => { testObject.value = text }} placeholder="date" startValue={testObject.value} />).toJSON();
        expect(tree.type).toBe('TextInput');
    })
})
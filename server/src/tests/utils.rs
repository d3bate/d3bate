pub fn extract_key(key: &str, value: &juniper::Value) -> juniper::Value {
    match &value {
        juniper::Value::Object(object) => match object.get_field_value(key) {
            Some(v) => v.clone(),
            _ => panic!(),
        },
        _ => panic!("expected an object"),
    }
}

pub fn extract_list(value: &juniper::Value) -> &Vec<juniper::Value> {
    match value {
        juniper::Value::List(l) => l,
        _ => panic!("expected a list"),
    }
}

pub fn extract_key_of_scalar(key: &str, value: &juniper::Value) -> juniper::DefaultScalarValue {
    match extract_key(key, value) {
        juniper::Value::Scalar(scalar) => scalar,
        _ => panic!("expected a scalar"),
    }
}

pub fn extract_key_of_string(key: &str, value: &juniper::Value) -> String {
    match extract_key_of_scalar(key, value) {
        juniper::DefaultScalarValue::String(s) => s,
        _ => panic!("expected a string"),
    }
}

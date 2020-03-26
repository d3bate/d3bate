use diesel;
use diesel::prelude::*;


#[macro_export]
macro_rules! crud {
    (
    $visibility:vis struct $name:ident {
        table: $table:ident,
        $($field: ident, $type:ty),* $(,)*
    }) => {
        $visibility struct $name {
            $(
            $field: $type
            ),*
        }
        impl $name {
            $visibility fn new($($field: $type),*) -> Self {
                Self {
                    $($type),*
                }
            }
            $($visibility fn get_$field (value_$field : $type) {
                $table . filter($field . eq(value_$field))
            })*
        }
    }
}

table! {
    clubmemberships (id) {
        id -> Nullable<Integer>,
        user -> Integer,
        club -> Integer,
    }
}

table! {
    clubs (id) {
        id -> Nullable<Integer>,
        name -> Text,
        owner -> Integer,
    }
}

table! {
    users (id) {
        id -> Nullable<Integer>,
        name -> Text,
        email -> Text,
        email_verified -> Integer,
        password_hash -> Text,
    }
}

joinable!(clubmemberships -> clubs (club));
joinable!(clubmemberships -> users (user));
joinable!(clubs -> users (owner));

allow_tables_to_appear_in_same_query!(
    clubmemberships,
    clubs,
    users,
);

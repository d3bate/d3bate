table! {
    chat_message (id) {
        id -> Int4,
        thread_id -> Int4,
        chat_message_id -> Nullable<Int4>,
        created -> Timestamp,
        content -> Text,
        user_id -> Int4,
    }
}

table! {
    chat_message_thread (id) {
        id -> Int4,
        last_active -> Timestamp,
        club_id -> Int4,
        title -> Text,
    }
}

table! {
    club (id) {
        id -> Int4,
        name -> Text,
        registered_school -> Text,
        school_verified -> Bool,
        created -> Bool,
        join_code -> Text,
    }
}

table! {
    club_member (id) {
        id -> Int4,
        user_id -> Int4,
        club_id -> Int4,
        role -> Int4,
    }
}

table! {
    training_session (id) {
        id -> Int4,
        start_time -> Timestamp,
        end_time -> Timestamp,
        livestream -> Bool,
        description -> Text,
        club_id -> Int4,
    }
}

table! {
    training_session_attendance (id) {
        id -> Int4,
        training_session_id -> Int4,
        user_id -> Int4,
        attending -> Bool,
    }
}

table! {
    user (id) {
        id -> Int4,
        name -> Text,
        email -> Text,
        password_hash -> Text,
        created -> Timestamp,
        email_verified -> Bool,
        pgp -> Nullable<Text>,
    }
}

joinable!(chat_message -> chat_message_thread (thread_id));
joinable!(chat_message -> user (user_id));
joinable!(chat_message_thread -> club (club_id));
joinable!(club_member -> club (club_id));
joinable!(club_member -> user (user_id));
joinable!(training_session -> club (club_id));
joinable!(training_session_attendance -> training_session (training_session_id));
joinable!(training_session_attendance -> user (user_id));

allow_tables_to_appear_in_same_query!(
    chat_message,
    chat_message_thread,
    club,
    club_member,
    training_session,
    training_session_attendance,
    user,
);

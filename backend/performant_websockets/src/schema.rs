table! {
    chat_message (id) {
        id -> Int4,
        thread_id -> Int4,
        is_reply -> Bool,
        reply_to -> Nullable<Int4>,
        created -> Timestamp,
    }
}

table! {
    chat_message_thread (id) {
        id -> Int4,
        last_active -> Nullable<Timestamp>,
        user_count -> Int4,
        club_id -> Nullable<Int4>,
    }
}

table! {
    club (id) {
        id -> Int4,
        name -> Nullable<Text>,
        registered_school -> Nullable<Text>,
        school_verified -> Bool,
        created -> Timestamp,
    }
}

table! {
    training_session (id) {
        id -> Int4,
        start_time -> Nullable<Timestamp>,
        end_time -> Nullable<Timestamp>,
        livestream -> Bool,
        description -> Nullable<Text>,
        club_id -> Nullable<Int4>,
    }
}

table! {
    training_session_attendance (id) {
        id -> Int4,
        training_session_id -> Nullable<Int4>,
        user_id -> Nullable<Int4>,
        attending -> Bool,
    }
}

table! {
    user (id) {
        id -> Int4,
        name -> Text,
        username -> Text,
        email -> Text,
        password_hash -> Text,
        created -> Timestamp,
        email_verified -> Nullable<Bool>,
    }
}

joinable!(chat_message -> chat_message_thread (thread_id));
joinable!(chat_message_thread -> club (club_id));
joinable!(training_session -> user (club_id));
joinable!(training_session_attendance -> training_session (training_session_id));
joinable!(training_session_attendance -> user (user_id));

allow_tables_to_appear_in_same_query!(
    chat_message,
    chat_message_thread,
    club,
    training_session,
    training_session_attendance,
    user,
);

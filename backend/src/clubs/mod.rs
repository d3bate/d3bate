use actix_web::post;
use diesel::prelude::*;
use diesel;

macro_rules! crud {
    (struct $name:ident { $($fname: ident : $ftype:ty),* }; $table: ident) => {
        #[derive(Queryable)]
        #[table_name="$name"]
        struct $name {
            $($fname: $ftype),*
        }

        #[derive(Insertable)]
        #[table_name="$name"]
        struct Insertable$name<'a> {
            $($fname: &'a $ftype),*
        }

        fn add_$name(conn: &SqliteConnection, $($fname: &'a $ftype),*) {
            let new_$name = Insertable$name {
                $($fname: $ftype),*
            }
            diesel::insert_into(table).values(&new_$name).execute(conn).expect("Could not insert that user into the table.")
        }

        fn update_$name() {}

        fn delete_$name() {}

        fn read_$name() {}


        #[post("/"$name"/create")]
        pub fn create_$name() {}

        #[post("/"$name"/read"), get("/"$name"/read")]
        pub fn read_$name() {}

        #[post("/"$name"/update")]
        pub fn update_$name() {}

        #[post("/"$name"/delete")]
        pub fn read_$name() {}
    };
}
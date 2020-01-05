use actix_web::post;
use diesel::prelude::{Queryable, Insertable};

macro_rules! crud {
    (struct $name:ident { $($fname: ident : $ftype:ty),* }) => {
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

        fn add_$name() {}

        fn update_$name() {}

        fn delete_$name() {}

        fn read_$name() {}


        #[post("/"$name"/create")]
        pub fn create_$name() {}

        #[post("/"$name"/read")]
        pub fn read_$name() {}

        #[post("/"$name"/update")]
        pub fn update_$name() {}

        #[post("/"$name"/delete")]
        pub fn read_$name() {}
    };
}